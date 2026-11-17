// Render a few frames at half scale for a visual check: node scripts/.stills.mjs outdir f1 f2 ...
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [outDir, ...frames] = process.argv.slice(2);
const serveUrl = path.resolve("out/bundle");
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "DhoniTribute", browserExecutable, inputProps: {} });
for (const f of frames) {
  await renderStill({ composition, serveUrl, frame: Number(f), output: `${outDir}/f${String(f).padStart(5, "0")}.png`, scale: 0.5, browserExecutable, inputProps: {} });
  process.stdout.write(f + " ");
}
console.log("done");
