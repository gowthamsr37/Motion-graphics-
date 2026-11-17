// Render a few frames for a visual check: node scripts/stills.mjs <Comp> <outdir> <scale> f1 f2 ...
// (bundle first: npx remotion bundle src/index.ts --out-dir out/bundle)
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [comp, outDir, scale, ...frames] = process.argv.slice(2);
const serveUrl = path.resolve("out/bundle");
const browserExecutable = process.env.BROWSER || "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const chromiumOptions = { gl: "swangle" };
const browser = await openBrowser("chrome", { browserExecutable, chromiumOptions });
const composition = await selectComposition({ serveUrl, id: comp, puppeteerInstance: browser, inputProps: {} });
for (const f of frames) {
  const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: Number(f), output: `${outDir}/f${String(f).padStart(5, "0")}.png`, scale: Number(scale), puppeteerInstance: browser, inputProps: {}, chromiumOptions });
  process.stdout.write(`${f}(${((Date.now() - t0) / 1000).toFixed(1)}s) `);
}
await browser.close({ silent: true });
console.log("done");
