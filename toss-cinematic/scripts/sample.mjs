// Contact-sheet sampler: node scripts/sample.mjs <Comp> <outdir> <scale> <from> <to> <every>
// Renders every Nth frame of a range in one browser (the 3D engine is built once per tab), as JPEGs.
import { renderFrames, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const [comp, outDir, scale, from, to, every] = process.argv.slice(2);
const serveUrl = path.resolve("out/bundle");
const browserExecutable = process.env.BROWSER || "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const chromiumOptions = { gl: "swangle" };
fs.mkdirSync(outDir, { recursive: true });
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable, chromiumOptions, inputProps: {} });
const t0 = Date.now();
let n = 0;
await renderFrames({
  composition, serveUrl, inputProps: {}, outputDir: outDir, imageFormat: "jpeg", jpegQuality: 88, scale: Number(scale),
  frameRange: [Number(from), Math.min(Number(to), composition.durationInFrames - 1)], everyNthFrame: Number(every || 1),
  concurrency: Number(process.env.CONC || 4), browserExecutable, chromiumOptions, muted: true, logLevel: "error",
  onStart: () => {}, onFrameUpdate: (f) => { n = f; },
  imageSequencePattern: "f[frame].[ext]",
});
console.log(`${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s (${((Date.now() - t0) / 1000 / Math.max(1, n)).toFixed(2)} s/frame)`);
