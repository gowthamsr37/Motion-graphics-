// Render a range of posts: node scripts/render-batch.mjs 1 14
// Writes out/posts/<id>_<topic>_<format>.mp4 (mastered to -14 LUFS) and a matching _cover.png.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(ROOT);
const [from = 1, to = 7] = process.argv.slice(2).map(Number);
const BROWSER = process.env.BROWSER || "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const posts = JSON.parse(readFileSync("content/posts.json", "utf8"));
const COVER = { pile: 420, squiggle: -15, iceberg: -15, compound: -15, valley: -20, bamboo: -15, domino: -20 };
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();

mkdirSync("out/posts", { recursive: true });
mkdirSync("out/tmp", { recursive: true });
if (!existsSync("public/audio/music/m0.wav")) run("node", ["scripts/gen-audio.mjs"]);
if (!existsSync("out/bundle/index.html") || process.env.REBUNDLE) { rmSync("out/bundle", { recursive: true, force: true }); run("npx", ["remotion", "bundle", "src/index.ts", "--out-dir", "out/bundle"]); }

for (const p of posts.filter((x) => +x.id >= from && +x.id <= to)) {
  const name = `${p.id}_${p.topic.replace(/[^a-z0-9]+/gi, "-")}_${p.format}`;
  const final = `out/posts/${name}.mp4`;
  if (existsSync(final) && !process.env.FORCE) { console.log(`skip ${name}`); continue; }
  const t0 = Date.now();
  const props = `out/tmp/${p.id}.json`;
  writeFileSync(props, JSON.stringify({ p }));
  const raw = `out/tmp/${p.id}_raw.mp4`;
  run("npx", ["remotion", "render", "out/bundle", "Post", raw, `--props=${props}`, "--codec", "h264", "--crf", "19", "--concurrency", "4", "--overwrite", `--browser-executable=${BROWSER}`]);
  const dur = parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", raw]));
  const endCardF = Math.round(dur * 30) - 120; // every format ends with a 120-frame end card
  const coverF = p.format === "pile" ? COVER.pile : endCardF + COVER[p.format];
  run("npx", ["remotion", "still", "out/bundle", "Post", `out/posts/${name}_cover.png`, `--props=${props}`, `--frame=${coverF}`, "--overwrite", `--browser-executable=${BROWSER}`]);
  // two-pass loudness to -14 LUFS for Instagram
  let m;
  try { m = JSON.parse(execFileSync("bash", ["-c", `ffmpeg -hide_banner -i ${raw} -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -vn -f null - 2>&1 | sed -n '/^{/,/^}/p'`]).toString()); } catch { m = null; }
  const af = m ? `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true` : "loudnorm=I=-14:TP=-1.5:LRA=11";
  run("ffmpeg", ["-v", "error", "-y", "-i", raw, "-c:v", "copy", "-af", af, "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", final]);
  rmSync(raw); rmSync(props);
  console.log(`done ${name}  ${dur.toFixed(1)}s video  in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
