// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://mmi-art-26.fr",
  output: "server",
  image: {
    domains: ["127.0.0.1", "localhost", "pb-expo.nicolas-thai.fr"],
  },
  adapter: netlify(),
});
