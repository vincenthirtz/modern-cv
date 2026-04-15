/**
 * Télécharge les images de couverture Unsplash référencées dans les
 * frontmatter .mdx et les enregistre dans public/notes/. Réécrit ensuite
 * le champ `cover:` pour pointer sur le chemin local.
 *
 * Pourquoi : satori (next/og) plante de manière opaque quand il doit
 * fetcher une image Unsplash pendant la génération de l'OG image sur
 * Netlify. Servir le fichier depuis le même domaine évite ce problème
 * et supprime une dépendance réseau au build.
 *
 * Usage : node scripts/download-covers.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const articlesDir = join(process.cwd(), "lib", "articles");
const publicCoversDir = join(process.cwd(), "public", "notes");

const mdxFiles = readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

/** Devine l'extension à partir du content-type. */
function extFromContentType(ct) {
  if (!ct) return "jpg";
  if (ct.includes("png")) return "png";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("avif")) return "avif";
  return "jpg";
}

async function downloadIfRemote(mdxFile) {
  const filePath = join(articlesDir, mdxFile);
  const raw = readFileSync(filePath, "utf-8");
  const slug = basename(mdxFile, ".mdx");

  const coverMatch = raw.match(/cover:\s*\n?\s*"([^"]+)"/);
  if (!coverMatch) return { slug, skipped: "pas de cover" };

  const url = coverMatch[1];
  if (!url.startsWith("https://")) return { slug, skipped: "déjà local" };

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
    },
  });
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status} sur ${url}`);

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const ext = extFromContentType(contentType);
  const fileName = `cover-${slug}.${ext}`;
  const destPath = join(publicCoversDir, fileName);
  const localUrl = `/notes/${fileName}`;

  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buf);

  const newRaw = raw.replace(/cover:\s*\n?\s*"[^"]+"/, `cover: "${localUrl}"`);
  writeFileSync(filePath, newRaw, "utf-8");

  return {
    slug,
    downloaded: fileName,
    size: `${(buf.byteLength / 1024).toFixed(0)} KB`,
    localUrl,
  };
}

if (!existsSync(publicCoversDir)) {
  throw new Error(`Dossier manquant : ${publicCoversDir}`);
}

const results = [];
for (const f of mdxFiles) {
  try {
    results.push(await downloadIfRemote(f));
  } catch (err) {
    results.push({ slug: basename(f, ".mdx"), error: String(err.message) });
  }
}

for (const r of results) {
  if (r.error) console.error(`✗ ${r.slug} — ${r.error}`);
  else if (r.skipped) console.log(`- ${r.slug} — ${r.skipped}`);
  else console.log(`✓ ${r.slug} → ${r.downloaded} (${r.size})`);
}
