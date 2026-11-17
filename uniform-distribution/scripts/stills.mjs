// Render specific frames as PNGs from an existing bundle (one browser for all frames).
// Usage: node scripts/stills.mjs out/bundle out/check 15 90 300 ...   (BROWSER env optional)
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [bundle, outDir, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.BROWSER || null;
const browser = await openBrowser("chrome", { browserExecutable, chromiumOptions: {} });
const serveUrl = path.resolve(bundle);
const inputProps = process.env.PROPS ? JSON.parse(process.env.PROPS) : {};
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "UniformDistribution", puppeteerInstance: browser, inputProps, browserExecutable });
for (const f of frames) {
  const output = path.join(outDir, `f${String(f).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, output, frame: Number(f), puppeteerInstance: browser, inputProps, overwrite: true, browserExecutable, scale: Number(process.env.SCALE || 0.5) });
  console.log(output);
}
await browser.close({ silent: true });
