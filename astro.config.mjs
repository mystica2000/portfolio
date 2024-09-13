import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import mdx from "@astrojs/mdx";
import fs from "node:fs";
import { exportAsPng } from './ogImage';
import path from 'node:path';
import { platform } from "node:os";

const og = () => ({
  name: "satori-og",
  hooks: {

    // credits to https://dietcode.io/p/astro-og/ for building og image at build time
    "astro:build:done": async ({ dir, pages }) => {

      const interFont = fs.readFileSync(
        "public/fonts/inter.ttf"
      );
      const isPlatformWindows = platform() == "win32" ? true : false;

      for (const { pathname } of pages) {

        if (/(^(posts)\/[a-zA-Z0-9-])/.test(pathname) || /(^(bytes)\/[a-zA-Z0-9-])/.test(pathname)) {

          if (pathname.startsWith("posts/")) {
            const filename = pathname.slice(6, -1);
            const file = fs.readFileSync(`src/content/posts/${filename}.mdx`);
            const svg = await exportAsPng(file, interFont);

            fs.writeFileSync(
              `${isPlatformWindows == true ? dir.pathname.slice(1) : dir.pathname}${pathname}og.png`,
              svg
            );

          } else {

            const filename = pathname.slice(6, -1);
            const file = await fs.readFileSync(`src/content/bytes/${filename}.mdx`);
            const svg = await exportAsPng(file, interFont);
            const pathFile = path.join(`${isPlatformWindows == true ? dir.pathname.slice(1) : dir.pathname}`, pathname, `og.png`);
            fs.writeFileSync(
              pathFile,
              svg
            );
          }
        }
      }


      console.log("satori-og: build finished");
    },
  }
})

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), og()],
  site: 'https://mystica.me',
  prefetch: false,
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