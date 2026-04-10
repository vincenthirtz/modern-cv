import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vincent Hirtz — Lead Developer & Architecte Logiciel",
    short_name: "Vincent Hirtz",
    description:
      "Lead Developer basé à Lyon. Créateur de Pulse JS Framework. Curiosité infinie pour les nouvelles technos.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
