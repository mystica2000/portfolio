import { defineConfig } from "astro/config";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";
import mdx from "@astrojs/mdx";
import fs from "node:fs";
import { exportAsPng } from "./ogImage";
import path from "node:path";
import { platform } from "node:os";

import sitemap from "@astrojs/sitemap";

const og = () => ({
  name: "satori-og",
  hooks: {
    // credits to https://dietcode.io/p/astro-og/ for building og image at build time
    "astro:build:done": async ({ dir, pages }) => {
      const interFont = fs.readFileSync("public/fonts/inter.ttf");
      const isPlatformWindows = platform() == "win32" ? true : false;

      for (const { pathname } of pages) {
        if (
          /(^(posts)\/[a-zA-Z0-9-])/.test(pathname) ||
          /(^(bytes)\/[a-zA-Z0-9-])/.test(pathname)
        ) {
          if (pathname.startsWith("posts/")) {
            const filename = pathname.slice(6);
            const file = fs.readFileSync(`src/content/posts/${filename}.mdx`);
            const svg = await exportAsPng(file, interFont);
            const pathFile = path.join(
              `${isPlatformWindows == true ? dir.pathname.slice(1) : dir.pathname}`,
              "posts",
              `${filename}-og.png`
            );

            fs.writeFileSync(pathFile, svg);
          } else {
            const filename = pathname.slice(6);
            const file = fs.readFileSync(`src/content/bytes/${filename}.mdx`);
            const svg = await exportAsPng(file, interFont);
            const pathFile = path.join(
              `${isPlatformWindows == true ? dir.pathname.slice(1) : dir.pathname}`,
              "bytes",
              `${filename}-og.png`
            );
            fs.writeFileSync(pathFile, svg);
          }
        } else if (pathname == "") {
          const file = fs.readFileSync(`src/assets/images/og.png`);
          const pathFile = path.join(
            `${isPlatformWindows == true ? dir.pathname.slice(1) : dir.pathname}`,
            pathname,
            `${pathname}og.png`
          );
          fs.writeFileSync(pathFile, file);
        }
      }

      console.log("satori-og: build finished");
    },
  },
});

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), og(), sitemap()],
  site: "https://mystica.me",
  transitions: true,
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      themes: {
        light: "gruvbox-light-medium",
        dark: "houston",
      },
      wrap: true,
    },
  },
  build: {
    format: "file",
  },
});
