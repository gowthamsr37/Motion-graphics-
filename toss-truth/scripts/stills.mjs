// Render check frames from a bundle with one shared browser.
// Usage: node scripts/stills.mjs <bundleDir> <outDir> <frame> [frame...]   (BROWSER env = chrome-headless-shell path)
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [bundle, outDir, ...frames] = process.argv.slice(2);
const browser = await openBrowser("chrome", { browserExecutable: process.env.BROWSER || null });
const serveUrl = path.resolve(bundle);
const composition = await selectComposition({ serveUrl, id: "TossTruth", puppeteerInstance: browser });
for (const f of frames) {
  await renderStill({ serveUrl, composition, frame: Number(f), output: path.join(outDir, `f${String(f).padStart(4, "0")}.png`), puppeteerInstance: browser, overwrite: true, scale: 0.5 });
  process.stdout.write(`${f} `);
}
await browser.close({ silent: true });
console.log("done");
