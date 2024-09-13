import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import mdx from "@astrojs/mdx";
import fs from "node:fs";
import { readdir } from 'node:fs/promises';
import { exportAsPng } from './ogImage';
import path from 'node:path';

const og = () => ({
  name: "satori-og",
  hooks: {

    // credits to https://dietcode.io/p/astro-og/ for building og image at build time
    "astro:build:done": async ({ dir, pages }) => {
      console.log(process.cwd());

      console.log(dir, pages);
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

            const getFolders = async (source) => {
              const entries = await readdir(source, { withFileTypes: true });
              return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
            };
            console.log(dir.pathname);
            getFolders(dir.pathname).then(folders => {
              console.log(folders);
            });


            for (const byte of byteFiles) {
              const file = fs.readFileSync(`src/content/bytes/${byte}`);
              const { title, svg } = await exportAsPng(file, interFont);

              const pathFile = path.join(dir.pathname.slice(1), pathname, `${title.replaceAll(" ", "-").toLowerCase()}-og.png`);
              console.log(pathFile);
              fs.writeFileSync(
                pathFile,
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