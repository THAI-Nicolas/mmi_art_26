// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  security: {
    // VPS reverse proxy can cause Origin/Host mismatches on POST (Astro Actions).
    checkOrigin: false,
  },
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
  // Domaine officiel de l'expo
  site: "https://expo.mmimontbeliard.com",
  output: "server",
  integrations: [sitemap()],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        // On autorise le domaine de l'expo pour les images (servies via /api)
        hostname: "expo.mmimontbeliard.com",
      },
      {
        protocol: "https",
        // On garde ton domaine perso en secours si besoin
        hostname: "mmiart26.nicolas-thai.fr",
      },
    ],
    domains: ["127.0.0.1", "localhost"],
  },
  // Utilisation de l'adaptateur Node pour le VPS
  adapter: node({
    mode: "standalone",
  }),
});
