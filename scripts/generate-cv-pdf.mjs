/**
 * Génère public/cv.pdf à partir de la vraie page /cv.
 *
 * Pourquoi : la page CV propose un lien « Télécharger PDF » vers /cv.pdf.
 * Plutôt que de maintenir un PDF à la main (qui se désynchronise du contenu
 * de page.tsx), on imprime la page elle-même via Chromium en émulant le
 * média « print » — on réutilise donc directement les règles @media print
 * de cv.css (A4, encre noire sur papier blanc, masquage des actions).
 *
 * Le script démarre son propre serveur Next si rien n'écoute sur le port,
 * sinon il réutilise celui déjà lancé (ex : npm run dev en parallèle).
 *
 * Usage : node scripts/generate-cv-pdf.mjs
 */
import { spawn } from "node:child_process";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = `http://localhost:${PORT}`;
const CV_URL = `${BASE_URL}/cv`;
const OUT_PATH = join(process.cwd(), "public", "cv.pdf");

/** Renvoie true dès que le serveur répond (status < 500) sur /cv. */
async function isServerUp() {
  try {
    const res = await fetch(CV_URL, { method: "HEAD" });
    return res.status < 500;
  } catch {
    return false;
  }
}

/** Attend que le serveur réponde, jusqu'à `timeoutMs`. */
async function waitForServer(timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp()) return;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Serveur injoignable sur ${BASE_URL} après ${timeoutMs / 1000}s`);
}

async function main() {
  let server = null;

  if (await isServerUp()) {
    console.log(`- Réutilisation du serveur déjà lancé sur ${BASE_URL}`);
  } else {
    console.log(`- Démarrage de « next dev » sur le port ${PORT}…`);
    // shell:true est requis pour lancer npm(.cmd) sur Windows ; le nettoyage
    // se fait via taskkill /T plus bas, qui tue tout l'arbre de processus.
    server = spawn("npm", ["run", "dev"], {
      stdio: "ignore",
      shell: true,
      env: { ...process.env, PORT: String(PORT) },
    });
    await waitForServer();
  }

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(CV_URL, { waitUntil: "networkidle" });
    // Émule le média print pour récupérer les règles @media print de cv.css.
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: OUT_PATH,
      format: "A4",
      printBackground: true,
      // Respecte @page { size: A4; margin: … } défini dans cv.css.
      preferCSSPageSize: true,
    });
    console.log(`✓ PDF généré → ${OUT_PATH}`);
  } finally {
    await browser.close();
    // server.kill() ne tue que le process npm : le serveur Next enfant
    // resterait orphelin. On tue donc tout l'arbre de processus.
    if (server?.pid) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        server.kill();
      }
    }
  }
}

main().catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});
