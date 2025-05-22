import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Емуляція __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssDir = path.resolve(__dirname, "../styles/css");
const scssDir = path.resolve(__dirname, "../styles/scss");

const cssFiles = fs
  .readdirSync(cssDir)
  .filter((f) => f.endsWith(".css") && f !== "all-css.css");
const scssFiles = fs
  .readdirSync(scssDir)
  .filter((f) => f.endsWith(".scss") && f !== "all-scss.scss");

const cssImports = cssFiles.map((f) => `@import './${f}';`).join("\n");
const scssImports = scssFiles.map((f) => `@use './${f}';`).join("\n");

const cssOutFile = path.resolve(cssDir, "all-css.css");
const scssOutFile = path.resolve(scssDir, "all-scss.scss");

fs.writeFileSync(cssOutFile, cssImports);
fs.writeFileSync(scssOutFile, scssImports);

console.log("Скрипт styles-імпорту запущено");
