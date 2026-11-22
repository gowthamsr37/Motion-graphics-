# The File — Beyond The Scoreboard house template

The editorial "paper and ink" style first used in **The No.3 File** (`../../padikkal-film`, Devdutt Padikkal, Nov 2026). Use it for data-led analysis reels: player careers, comparisons, records and myth-busters.

Output: an Instagram Reel, 1080×1920 at 30 fps, mastered to −14 LUFS, with a cover still. The demo in this folder renders as is: a 46-second walkthrough of every widget, using real Padikkal data.

## Start a new reel

```bash
bash templates/the-file/new-reel.sh <folder> "<masthead tag>" <Output_File_Name>
# e.g. bash templates/the-file/new-reel.sh jaiswal-openers "The Opener File" Beyond_The_Scoreboard_Jaiswal_The_Opener_File
cd <folder>
bash scripts/setup-tools.sh          # first time only: Kokoro voice, whisper timings, BiRefNet cut-outs (~450 MB, in ~/.cache/bts-tools)
# 1  write scripts/voiceover.json
npm run voice                        # → public/vo/*.wav + src/timeline.json (word timings)
# 2  build src/scenes/Story.tsx (one component per scene) and its STORY.sfx cues
# 3  edit the two "EDIT PER REEL" blocks in scripts/gen-audio.mjs
# 4  photos → public/photos, cut-outs via scripts/cutout.py, then src/Cover.tsx
npx remotion bundle src/index.ts --out-dir out/bundle && node scripts/.stills.mjs <dir> <frames…>   # look, fix, repeat
BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell bash scripts/build.sh
```

The scaffold copies everything except `node_modules`, `out/`, the generated `public/audio/` and this README. It names the package, sets the output file name in `scripts/build.sh` and puts the masthead tag in `src/config.ts`.

## The look

| Element | Rule |
| --- | --- |
| Ground | Warm paper (`Paper`: radial light plus fibres) with `Grain` and `Vignette` on top. It warms with an accent tint in the verdict scene. Never use a flat or dark background. |
| Ink | Navy `ink` for text and the field; `ink2` for secondary text; `mute` for de-emphasised rows; `line` for hairlines. |
| Accent | One colour for the hero (India saffron by default, set in `theme.colors.accent`). Use it only for the hero's numbers, bars and name. Everyone else is ink or mute. |
| Red | The seam colour (`red`). It marks the masthead progress, scene wipes, timelines, benchmark lines, the crack and the stamp, and is the series thread. |
| Type | **Anton** (`Disp`) for numbers, names and headlines, always uppercase. **Fraunces italic** (`Serif`) is the editorial voice: scene titles and verdict lines. **Inter Display** (`Label`) for small uppercase labels and captions. |
| Motifs | The red-ball **seam**. The giant **glyph** (`BigGlyph`), which draws in outline for the question and fills with the accent for the answer. The **revolving door** card. The **case file** print with a rubber **stamp** to close. |

### Layout grid (1080×1920)

- **Masthead:** y 150 (series name, italic tag, progress seam).
- **Scene title** (`Kicker`): y 248, x 70.
- **Content:** y 330–1300, 70 px side margins.
- **Captions:** y 1340–1480, karaoke style, max 5 words, numbers in the accent colour.
- **Below 1500:** keep empty, because Instagram's UI covers it.
- **Cover:** the key content sits inside the 1080×1350 grid crop (y 285–1635).

## Widgets (`src/components`)

**`Ed.tsx` (the kit):**
- Type helpers: `Disp`, `Serif`, `Label`
- Background and texture: `Paper`, `Grain`, `Vignette`
- Seam motif: `Seam`, `SeamWipe`
- Frame furniture: `Masthead`, `Captions`, `Shell` (scene enter/exit/drift)
- Pictures: `BigGlyph` (alias `Big3`), `Cutout` (with `fadeBottom` for waist-cropped cut-outs)
- Helpers: `fade`, `useP`, `CLAMP`

**`Viz.tsx` (scene widgets).** Every one is absolutely positioned and keyed to frames:

| Widget | Use | Key props |
| --- | --- | --- |
| `Kicker` | scene title and sub-label | `title, sub, subAt, outAt` |
| `DoorCard` | names spinning like a revolving door; optional steady lead card first | `names, start, end, lead{name,note}` |
| `Tally` | tally marks and a label | `n, at, label, extra` |
| `Slam`, `ScoreStack` | giant numbers that slam in | `rows[{t,label,at,color}]` |
| `Lockup` | hero name with an ink tag, readable over an accent glyph | `name, tag, at` |
| `Lollipop` | ranking against the field, with a dashed benchmark | `rows[{name,sub,value,at,tone}], max, ticks, benchmark{value,label,at}` |
| `Road` | career timeline with a tracking camera and dotted gaps | `stations[{x,value,date,place,note,at,tone}], camera[{t,x}], gaps[{from,to,label,at}], width` |
| `DotColumn` | one dot per unit (balls per dismissal, runs …) | `n, at, x, label, sub, tone` |
| `Versus`, `FlyRow`, `Crack` | butterfly comparison of A (accent) and B (ink, muted once A wins: `winA`; or set `colorA`/`colorB`, e.g. two team colours), and a red zigzag break | `label, a, b, max, at, fmtA, fmtB, colorA, colorB` |
| `CaseFile`, `Stamp` | taped photo print; a stamp that lands on frame `at` | `src, at, pos` / `text, sub, at, x, y` |
| `StatRow` | 3–5 headline stats | `stats[{v,l,accent}], at, outAt` |
| `Brand` | the sign-off lockup | `at, series, tagline` |
| `Footnote` | source line | `text, at` |

`tone` is `"pick"` (the hero, accent), `"main"` (ink) or `"muted"`.

## Story recipe

Seven scenes, about 100–175 seconds. Extra seconds are fine, but never squeeze the pacing.

| # | Beat | Typical widgets |
| --- | --- | --- |
| 1 | **Hook:** the question in the first 2 seconds, then the reveal | outline `BigGlyph` + `DoorCard` + `Tally`, then glyph fill + `Cutout` + `Lockup` |
| 2 | **The headline numbers** | `Kicker` + `ScoreStack` + `Cutout` |
| 3 | **Against the field** | `Lollipop` with a benchmark |
| 4 | **The road:** highs, lows and gaps | `Road` (+ a cut-out per phase) |
| 5 | **A deeper measure** that explains *why* | `DotColumn`s (+ a one-line strike-rate comparison) |
| 6 | **The comparison** | `Versus` + `FlyRow`s + `Crack` |
| 7 | **The verdict** | accent `BigGlyph` + `CaseFile` + `Stamp` + `StatRow` → verdict line → `Brand` |

**Narration (`scripts/voiceover.json`):**
- **Voice:** `am_michael`, the series narrator.
- **Two versions of every line:**
  - `text` is what is spoken, with numbers as words ("one hundred and sixty-seven").
  - `caption` is what is shown, with digits ("167").
- **Explain every chart in the voice**, e.g. "Every dot here is one ball faced, per dismissal". Viewers should never have to decode a graphic alone.
- **One idea per sentence.** Give it a short pause (`pause` 0.3–0.5), and put a longer `hold` on the reveals.
- **Fix mispronunciations with `"fix"`** (phoneme replacements). The padikkal list already covers innings, Padikkal, Pujara, Sudharsan, Wadekar, Galle and Nair. To find the phonemes, run Kokoro's phonemizer on the word and compare.
- **End with** "Beyond The Scoreboard."

**Syncing:**
- `wordAt(fps, id, "prefix", fallbackSec, nth)` and `sentence(fps, id, i)` give frames relative to the scene. Key every entrance to the word that names it.
- Put the same moments in `STORY.sfx` and in `ev` in `scripts/gen-audio.mjs`, so picture, SFX and music hit together.

## Sound

**Score:** `gen-audio.mjs` writes it to `public/audio/score.wav`. It is a quiet piano film score in A minor at 84 BPM.
- The arrangement uses `section(from, to, level)`: level 0 is piano and strings, 1 adds a sub pulse, 2 adds kick and shaker.
- `hit(t)` places an accent hit.
- It resolves to A major on the verdict.
- The music is ducked under the voice (0.75 open, 0.2 under the voice).

**SFX library:**

| File | Use |
| --- | --- |
| `swoosh` | scene cuts |
| `whip` | door spins |
| `pen` | drawing |
| `tick` / `ticks` | counting, dots |
| `impact` | reveals |
| `slam` | numbers, stamp |
| `pop` | chart points |
| `rise` | build into a reveal |
| `crack` | the mirror breaking |
| `crowd` | celebration |

## Photos

- **Prefer the photos the page supplies.** Otherwise use genuine, relevant, correctly licensed photos in the right kit, and credit them in the README.
- **Cut-outs:** `$BTS_TOOLS/venv/bin/python scripts/cutout.py ~/.cache/bts-tools/birefnet.onnx public/photos public/photos/x.jpg` writes `x.png` with a transparent background. Rename it to `x-cut.png`.
- **Waist-cropped cut-outs** need `fadeBottom={0.8}`, otherwise the hard edge shows.
- **Don't clip faces inside the glyph.** A face in a landscape photo gets cropped by the strokes. Use the glyph as a backdrop, the cut-out in front, or the `CaseFile` print.

## QA checklist (learned the hard way)

- **Render a stills sheet** at every key word, before the full render, and look at it.
- **Keep labels inside the frame:**
  - In `Lollipop`, keep `x1` ≤ 870 so the hero's big value fits.
  - `FlyRow` anchors A's label from the right; keep values ≤ 5 characters.
  - Right-anchor any label that sits left of a line.
- **Never put accent-coloured text on an accent fill.** Use the ink tag (`Lockup`).
- **Text must not sit on the glyph or the photo** unless it has a backing. Check the verdict scene especially.
- **Name sources and dates on screen:** first-class figures, "Tests to <date>", and similar.
- **Check the final file:**
  - `ffmpeg -v error -i out/<name>.mp4 -f null -` reports no errors
  - duration as expected
  - loudness about −14 LUFS (printed by `build.sh`)
  - a frame grab from the final MP4

## Data notes

- **Test ball-by-ball:** [Cricsheet](https://cricsheet.org) JSON (ODC-BY).
  - Afghanistan men's matches are withheld; add them by hand and say so.
  - Batting position is the order of appearance in the ball-by-ball data.
- **Credit sources** in the caption and the README (see `../../padikkal-film` for the format).

## Files

```
new-reel.sh                 scaffold a new reel from this template
scripts/setup-tools.sh      one-time Python tools (venv + models) into $BTS_TOOLS
scripts/voiceover.json      narration (demo)
scripts/gen-voice.py        Kokoro TTS + whisper word timings → public/vo, src/timeline.json
scripts/gen-audio.mjs       score + SFX → public/audio
scripts/cutout.py           BiRefNet background removal
scripts/.stills.mjs         render check frames at half scale
scripts/build.sh            audio → bundle → render → cover → −14 LUFS master
src/config.ts               series name, masthead tag, tagline
src/theme.ts                colours, fonts, easings, springs
src/components/Ed.tsx       the kit
src/components/Viz.tsx      scene widgets
src/components/Sound.tsx    score, voice and SFX playback with ducking
src/scenes/Story.tsx        the story: scenes, STORY.sfx, masthead and caption cut-offs (demo)
src/Main.tsx, Root.tsx      film assembly (no edits needed)
src/Cover.tsx               cover still (edit COVER)
public/fonts                Anton, Fraunces (OFL, Fontsource), Inter Display (OFL)
public/photos               placeholders: replace with the reel's photos
```
