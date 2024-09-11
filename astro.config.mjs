import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import mdx from "@astrojs/mdx";
import fs from "node:fs";
import { readdir } from 'node:fs/promises';
import { exportAsPng } from './ogImage';

const og = () => ({
  name: "satori-og",
  hooks: {
    "astro:build:done": async ({ dir, pages }) => {
      const interFont = fs.readFileSync(
        "public/fonts/inter.ttf"
      );

      for (const { pathname } of pages) {

        if (/(^(posts)\/[a-zA-Z0-9-])/.test(pathname) || pathname.startsWith("bytes/")) {

          if (pathname.startsWith("posts/")) {
            const filename = pathname.slice(6, -1);
            const file = fs.readFileSync(`src/content/posts/${filename}.mdx`);
            const { svg } = await exportAsPng(file, interFont);

            fs.writeFileSync(
              `${dir.pathname.slice(1)}${pathname}og.png`,
              svg
            );

          } else {
            const byteFiles = await readdir(`src/content/${pathname}/`);

            if (!fs.existsSync(`${dir.pathname.slice(1)}/${pathname}/og`)) {
              fs.mkdirSync(`${dir.pathname.slice(1)}/${pathname}/og`);
            }

            for (const byte of byteFiles) {
              const file = fs.readFileSync(`src/content/bytes/${byte}`);
              const { title, svg } = await exportAsPng(file, interFont);

              fs.writeFileSync(
                `${dir.pathname.slice(1)}/${pathname}/og/${title.replaceAll(" ", "-").toLowerCase()}og.png`,
                svg
              );
            }
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