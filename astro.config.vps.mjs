// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node"; // Garde bien celui-là
// Retire l'import netlify s'il n'est plus utile
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: [
          "**/node_modules/**",
          "**/backend/**",
          "**/public/360/**",
          "**/.git/**",
        ],
      },
    },
  },
  site: "https://expo.mmimontbeliard.com",
  output: "server", // C'est parfait
  integrations: [sitemap()],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mmiart26.nicolas-thai.fr",
      },
    ],
    domains: ["127.0.0.1", "localhost"],
  },
  // --- MODIFICATION ICI ---
  adapter: node({
    mode: "standalone",
  }),
  // -------------------------
});
