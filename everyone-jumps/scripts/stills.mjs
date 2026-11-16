// Render frames at reduced scale for a visual check: node scripts/stills.mjs <outdir> <scale> f1 f2 ...
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [outDir, scale, ...frames] = process.argv.slice(2);
const serveUrl = path.resolve("out/bundle");
const browserExecutable = process.env.BROWSER || "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const chromiumOptions = { gl: "swangle" };
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "EveryoneJumps", browserExecutable, chromiumOptions, inputProps: {} });
for (const f of frames) {
  const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: Number(f), output: `${outDir}/f${String(f).padStart(5, "0")}.png`, scale: Number(scale), browserExecutable, chromiumOptions, inputProps: {}, timeoutInMilliseconds: 120000 });
  process.stdout.write(`${f}(${((Date.now() - t0) / 1000).toFixed(1)}s) `);
}
console.log("done");
