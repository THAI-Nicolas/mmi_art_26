// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://expo.mmimontbeliard.com",
  output: "server",
  integrations: [sitemap()],
  image: {
    // Désactiver l'optimisation d'images pour les domaines PocketBase
    // Cela évite la double transformation qui cause les timeouts
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pb-expo.nicolas-thai.fr",
      },
    ],
    domains: ["127.0.0.1", "localhost"],
  },
  adapter: netlify({
    // Améliorer le cache des images
    imageCDN: false, // Désactiver le CDN Netlify pour éviter les timeouts
  }),
});
