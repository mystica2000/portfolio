import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  site: 'https://mystica.me',
  markdown: {
    remarkPlugins: [
      remarkReadingTime,
    ],
    shikiConfig: {
      theme: "slack-dark",
      wrap: true
    }
  }
});