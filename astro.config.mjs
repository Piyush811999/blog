import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://piyushmakwana.in/",
  base: "/",
  integrations: [sitemap(), mdx()],
  redirects: {
    '/posts': '/'
  },
  markdown: {
    shikiConfig: {
      theme: "material-theme-darker",
      langs: []
    }
  }
});