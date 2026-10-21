import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const fontkit = require("fontkit");

const rootDir = process.cwd();

const constantsPath = path.join(
  rootDir,
  "src/components/FontPicker/constants.ts",
);

// Static preview files → public
const previewDir = path.join(rootDir, "public/fonts");

// Data imported by React → src
const metadataPath = path.join(rootDir, "src/fonts/metadata.json");

const PREVIEW_WIDTH = 220;
const PREVIEW_HEIGHT = 32;
const FONT_SIZE = 15;

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/\+/g, "plus")
    .replace(/\s+/g, "-");

const extractFontFamilies = (content) => {
  const match = content.match(/FONT_FAMILIES\s*=\s*\[([\s\S]*?)\]/);

  if (!match) {
    throw new Error("Could not find FONT_FAMILIES in constants.ts");
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
};

const getGoogleFontCss = async (family) => {
  const encodedFamily = encodeURIComponent(family);

  const url =
    `https://fonts.googleapis.com/css2?family=` +
    `${encodedFamily}:wght@400&display=swap`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 Chrome/131 Safari/537.36",
    },
  });

  /**
   * Google Fonts trả 400 khi family không tồn tại
   * trên Google Fonts.
   *
   * Trường hợp này thường là system font:
   * Arial, Times New Roman, Georgia, ...
   */
  if (response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch CSS for "${family}": ${response.status}`);
  }

  return response.text();
};

const extractFontUrl = (css) => {
  const matches = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)];

  if (matches.length === 0) {
    return null;
  }

  /**
   * Ưu tiên latin.
   *
   * Google Fonts CSS thường trả nhiều @font-face:
   * - vietnamese
   * - latin-ext
   * - latin
   *
   * Preview chỉ cần bộ glyph latin.
   */
  const latinBlock = css.match(/\/\* latin \*\/([\s\S]*?)(?=\/\*|$)/);

  if (latinBlock) {
    const latinUrl = latinBlock[1].match(/url\((https:\/\/[^)]+)\)/);

    if (latinUrl) {
      return latinUrl[1];
    }
  }

  return matches[0][1];
};

const downloadFont = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download font: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
};

const createSvg = (font, text) => {
  const run = font.layout(text);

  const scale = FONT_SIZE / font.unitsPerEm;

  let x = 0;

  const paths = [];

  for (const glyph of run.glyphs) {
    const glyphPath = glyph.path.toSVG();

    if (!glyphPath) {
      continue;
    }

    const transform =
      `translate(${x.toFixed(2)}, 19) ` + `scale(${scale}, ${-scale})`;

    paths.push(
      `<path ` +
        `d="${glyphPath}" ` +
        `transform="${transform}" ` +
        `fill="#202124"/>`,
    );

    x += glyph.advanceWidth * scale;
  }

  const contentWidth = x;

  /**
   * Không chừa padding hai bên.
   * Nội dung có thể sử dụng toàn bộ width.
   */
  const maxWidth = PREVIEW_WIDTH;

  /**
   * Bắt đầu từ mép trái.
   */
  const offsetX = 0;

  /**
   * Nếu tên font dài quá thì scale
   * toàn bộ nội dung xuống để vừa preview.
   */
  const contentScale = contentWidth > maxWidth ? maxWidth / contentWidth : 1;

  /**
   * Khi scale nhỏ, căn giữa theo chiều dọc.
   */
  const scaledHeight = FONT_SIZE * contentScale;

  const offsetY = contentScale < 1 ? (PREVIEW_HEIGHT - scaledHeight) / 2 : 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${PREVIEW_WIDTH}"
  height="${PREVIEW_HEIGHT}"
  viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}"
>
  <g
    transform="
      translate(${offsetX}, ${offsetY})
      scale(${contentScale})
    "
  >
    ${paths.join("\n    ")}
  </g>
</svg>
`;
};

const main = async () => {
  const constantsContent = await fs.readFile(constantsPath, "utf8");

  const families = extractFontFamilies(constantsContent);

  console.log(`Found ${families.length} fonts.`);

  /**
   * Create directories if they don't exist.
   */
  await fs.mkdir(previewDir, {
    recursive: true,
  });

  await fs.mkdir(path.dirname(metadataPath), {
    recursive: true,
  });

  const metadata = {};

  for (const family of families) {
    console.log(`Generating: ${family}`);

    try {
      const css = await getGoogleFontCss(family);

      /**
       * Không tồn tại trên Google Fonts.
       *
       * FontPicker sẽ render trực tiếp
       * bằng CSS nếu đây là system font.
       */
      if (!css) {
        console.log("  → System font, skip preview generation");

        continue;
      }

      const fontUrl = extractFontUrl(css);

      if (!fontUrl) {
        console.log("  → No font file found, skip");

        continue;
      }

      const buffer = await downloadFont(fontUrl);

      const font = fontkit.create(buffer);

      /**
       * Preview chính là tên của font.
       *
       * Ví dụ:
       * - Roboto
       * - Alfa Slab One
       * - M PLUS Rounded 1c
       */
      const svg = createSvg(font, family);

      const filename = `${slugify(family)}.svg`;

      await fs.writeFile(path.join(previewDir, filename), svg, "utf8");

      metadata[family] = {
        family,
        source: fontUrl,
      };

      console.log(`  ✓ ${filename}`);
    } catch (error) {
      console.warn(`  ✗ Failed: ${family}`);

      console.warn(error instanceof Error ? error.message : error);
    }
  }

  /**
   * Save metadata inside src so it can be imported
   * directly by the React application.
   */
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), "utf8");

  console.log("");

  console.log(`Generated ${Object.keys(metadata).length} font previews.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
