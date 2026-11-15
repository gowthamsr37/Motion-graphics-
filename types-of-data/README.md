# Types of Data Explained in 2 Minutes

A 112-second animated educational Instagram Reel: 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It is built entirely in Remotion (React + SVG + CSS) as premium 2D motion graphics: a deep-navy studio look with a fixed colour code (cyan, green, violet, orange), flat vector characters, kinetic type, animated diagrams and particle effects. It has no stock footage and no slides. Every scene demonstrates its idea visually, so it works with the sound off. Subtitles are word-synced and burned in, and a matching `.srt` is exported.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Types_of_Data_Explained.mp4` | the finished Reel, with narration, music, SFX and burned-in subtitles |
| `Types_of_Data_Cover.png` | 1080×1920 cover: TYPES OF DATA · explained in 2 minutes |
| `Types_of_Data_Explained.srt` | the same subtitle pages as a sidecar file |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## The colour code (identical in every scene)

| Category | Colour | Example used on screen |
| --- | --- | --- |
| DATA | white-blue orb | — |
| NUMERICAL → **Discrete** | cyan | 5 students |
| NUMERICAL → **Continuous** | green | 165.8 cm, 24.0 → 31.6 °C |
| CATEGORICAL → **Nominal** | violet | blood groups A, B, AB, O; Bengaluru, Mumbai, Delhi |
| CATEGORICAL → **Ordinal** | orange | satisfaction LOW → MEDIUM → HIGH |

The hook already uses this code. HEIGHT is green, CITY violet and EXAM RANK orange, so the opening quietly previews three of the four types.

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:09 | **Hook** | A person is measured on a ruler (172 cm counter), then a whip-pan to a city skyline where a map pin drops on BENGALURU with ripples, then another whip-pan to a podium where #3, #2 and #1 badges drop with confetti. The headline stack builds "YOUR HEIGHT, YOUR CITY, YOUR EXAM RANK…". Everything collapses into three identical badges: **ALL ARE DATA.** (impact + shake). The badges flip into three different colours: **BUT NOT THE SAME TYPE!** (RGB-split glitch). They merge into one glowing particle. |
| 2 | 0:09–0:23 | **Big picture** | The DATA orb rises and splits. Two sparks travel along drawn connectors and become **NUMERICAL** (Quantitative) and **CATEGORICAL** (Qualitative). A spotlight alternates as example chips stack under each family (172 cm · 5 students · 38.5 °C; Mumbai · Blood type O · Colour: Red). The camera then zooms into NUMERICAL. |
| 3a | 0:23–0:39 | **Discrete** | The tree header grows DISCRETE / CONTINUOUS. In a classroom, the door swings open and five students walk in one by one, each arriving on its spoken number. The counter flips 1…5 and number-line dots light up only at whole numbers. "You can't have 3.5 students": the counter glitches to a red 3.5, a half student flickers in, and a red X stamps it out. |
| 3b | 0:39–0:58 | **Continuous** | A height odometer rolls smoothly from 165.0 to 165.8 cm while a zoom lens scrolls the fine scale. A thermometer rises smoothly (24.0 → 31.6 °C) and an unbroken line draws ("NO GAPS"). **MEASURED**: a range from 165 to 166 fills with ever-finer ticks, a knob glides through 3-decimal values and settles at 165.372…, which rounds to **≈ 165.4 cm (rounded, still continuous)**. A ball *hops* across 5 discrete dots, then the dots melt into one smooth bar and the ball *glides* 1.00 → 5.00. |
| 4a | 0:58–1:12 | **Nominal** | The camera pans across the tree to CATEGORICAL. Blood-group cards flip in on A, B, AB, O and city cards on Bengaluru, Mumbai, Delhi. ">" comparisons between cards are struck out (**NO NATURAL ORDER**). The cards shuffle twice: **ORDER DOESN'T MATTER**. |
| 4b | 1:12–1:24 | **Ordinal** | LOW / MEDIUM / HIGH cards (frown → neutral → smile, 1–3 bars) rise into a staircase while a little climber hops up each step: **ORDER MATTERS**. Gap brackets with "?" appear, the middle step wobbles and the gaps become visibly unequal: **ORDER ✓ · EQUAL GAPS ✗**. |
| 5 | 1:24–1:33 | **Complete picture** | A file-tree hierarchy draws itself, with each branch and leaf landing on its spoken word. Each leaf carries an example (5 students · 165.8 cm · Blood group AB · Low < Mid < High). Light pulses travel the connectors and a shine sweeps the cards. |
| 6 | 1:33–1:52 | **Quiz + CTA** | QUICK QUIZ badge, then a swinging jersey #10 and "What type of data is a JERSEY NUMBER?" with four options. A 5-second countdown ring (green → red, beeps, options scanning). The answer: **CATEGORICAL → NOMINAL!** (check, confetti). "IDENTIFIER, NOT A QUANTITY": `10 > 7 ?` and `10 + 7 = 17 ?` are struck through. The end card has a tree logo, a **FOLLOW** button that gets tapped, "for data science MADE SIMPLE." and the four types as chips. |

A new visual element or meaningful change lands every 2–4 seconds. Every entrance is a spring or eased move on 2–3 properties at once, entrances are staggered, and exits are faster than entrances. Idle elements breathe.

## Voiceover script (timestamps are on the finished video)

Narration is Kokoro TTS, voice `af_heart` (US English) at 1.05× for an energetic but natural pace. Each sentence is synthesized separately, so pauses and the 5-second quiz countdown sit exactly where the script puts them.

**S1 · Hook** (0:00.00–0:08.96)
- `0:00.45` Your height.
- `0:01.74` Your city.
- `0:03.01` Your exam rank.
- `0:04.84` They're all data.
- `0:06.25` But they're not the same type!

**S2 · The big picture** (0:08.96–0:22.58)
- `0:09.41` All data splits into two big families.
- `0:12.07` Numerical, or quantitative, is about quantities: things you count or measure.
- `0:16.66` Categorical, or qualitative, is about labels: names and groups.
- `0:20.89` Let's open each one.

**S3 · Numerical: discrete** (0:22.58–0:39.23)
- `0:23.13` Numerical data comes in two types.
- `0:25.53` First: discrete.
- `0:27.04` Count the students walking into class.
- `0:29.20` One. `0:29.97` Two. `0:30.76` Three. `0:31.60` Four. `0:32.43` Five.
- `0:33.49` Discrete data is counted, usually in whole numbers.
- `0:36.85` You can't have three and a half students!

**S4 · Numerical: continuous** (0:39.23–0:58.33)
- `0:39.73` Second: continuous.
- `0:41.38` A height glides smoothly, from one sixty-five to one sixty-five point eight.
- `0:46.10` Temperature rises the same way, with no gaps.
- `0:49.19` Continuous data is measured.
- `0:51.12` It can take any value in a range, even if we round it off.
- `0:54.76` Discrete jumps in steps.
- `0:56.50` Continuous flows.

**S5 · Categorical: nominal** (0:58.33–1:12.00)
- `0:58.83` Now, categorical data.
- `1:00.71` First: nominal.
- `1:02.27` Blood groups: A, B, AB, O.
- `1:04.53` Or cities: Bengaluru, Mumbai, Delhi.
- `1:07.21` Just names, with no natural ranking.
- `1:09.67` Shuffle them, and nothing changes.

**S6 · Categorical: ordinal** (1:12.00–1:24.38)
- `1:12.45` Second: ordinal.
- `1:13.92` Rate your satisfaction: low, medium, high.
- `1:16.92` Now, order matters. Each level sits above the last.
- `1:20.38` But the gaps between levels aren't measured, and may not be equal.

**S7 · The complete picture** (1:24.38–1:33.43)
- `1:24.83` Here's the complete picture.
- `1:26.52` Numerical splits into discrete and continuous.
- `1:29.56` Categorical splits into nominal and ordinal.

**S8 · Quiz and call to action** (1:33.43–1:52.10)
- `1:33.78` Quick quiz!
- `1:34.81` What type of data is a jersey number?
- *(5-second countdown, music only)*
- `1:42.44` It's categorical. Nominal!
- `1:44.49` A jersey number is an identifier, not a quantity.
- `1:47.88` Follow for data science made simple!

## Accuracy notes

- **Hierarchy:** nominal and ordinal sit under categorical (qualitative); discrete and continuous sit under numerical (quantitative). This holds in every scene.
- **Discrete** is described as *counted, usually in whole numbers*. It is not described as "only integers", because some discrete scales (shoe sizes, for example) use halves.
- **Continuous** is described as *measured, any value within a range, even when recorded rounded*. The ≈ 165.4 cm moment is labelled "rounded · still continuous".
- **Ordinal** says the order is meaningful but the gaps between levels *aren't measured and may not be equal*. On screen, the middle step's height changes and the gaps become unequal.
- **Jersey number** is categorical → nominal: an identifier with no quantity, and arithmetic or ordering on it is meaningless (`10 > 7 ?`, `10 + 7 = 17 ?` struck out).

## Subtitles and safe areas

- Subtitles come from the script text (so "3.5" and "165.8" read correctly). Each word is aligned to Whisper (`faster-whisper small.en`) timings of the generated narration. Pages are one line each, chosen by a small optimiser that breaks at punctuation and never leaves a word alone on a line. Spoken words light up, and the current word takes the scene's colour.
- Critical content stays between y≈250 and y≈1330. Subtitles sit around y≈1452, above Instagram's caption/username overlay, and the right-hand button column is kept clear.

## Audio

Everything is original and synthesized in `scripts/gen-audio.mjs`, with no samples.

- **Score:** 112 BPM, F major (I–V–vi–IV).
  - The hook has a filtered arp, a kick from "your city", a riser into an impact on "They're ALL data", and a lifted chord for "not the same type".
  - Each scene has its own arrangement: a light groove (big picture), a brighter pluck groove (discrete), a smooth gliding lead with no steps (continuous) and playful marimba (categorical).
  - The overview is a build. The quiz is suspense: the beat drops, a suspended pad and a heartbeat pulse play under the countdown, then a riser, a crash and the full groove on the reveal. It ends on an F-major chord.
- **SFX:** 30 synthesized sounds: whooshes, whip-pans, pops, an ascending blip per student, a door, card flips and shuffles, a stamp, glides, staircase notes, hops, countdown beeps, a ta-da, confetti and the button tap. Each one fires 2 frames before its visual lands.
- **Mix:** the music is ducked under every line of narration. The master goes through a limiter and then two-pass loudnorm to −14 LUFS, true peak −2 dBTP.

## Rebuild

```bash
npm install
# only if the narration changes (Python venv with kokoro-onnx, soundfile, faster-whisper):
python scripts/gen-voice.py --model <dir with model.onnx + voices.npz> --whisper <faster-whisper model dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh   # BROWSER optional
npx remotion studio src/index.ts                              # live preview / scrubbing
```

All visual timing is keyed to the spoken words in `src/timeline.json`. If you edit `scripts/voiceover.json` and re-run `gen-voice.py`, the whole film re-times itself, captions included.

### Export notes

- `scripts/build.sh` renders `out/raw.mp4` (H.264, CRF 16) and masters the audio into `out/Types_of_Data_Explained.mp4` with `+faststart`, ready to upload.
- Single still for inspection: `npx remotion still src/index.ts TypesOfData out/frame.png --frame 1500`.
- Quick preview render: `npx remotion render src/index.ts TypesOfData out/preview.mp4 --scale 0.5`.
- Batch stills for review (one browser, half scale): `node scripts/stills.mjs out/bundle out/check 300 900 1500`. Then tile them with `python3 scripts/sheet.py out/check/sheet.png out/check/f0300.png …`.

### How this cut was verified

- Frames were extracted from the encoded MP4 across all six scenes and inspected for layout, safe areas, entrance/exit timing and text legibility.
- The mastered audio was transcribed back with Whisper. The transcript matches the narration script word for word, so the voice is clear over the music.
- Loudness was measured with `ebur128`: −14 LUFS integrated, about −1.8 dBFS peak.

## Project layout

```
scripts/voiceover.json   narration script (spoken text, on-screen caption text, pauses, pronunciation fixes)
scripts/gen-voice.py     TTS + Whisper alignment → public/vo/*.wav + src/timeline.json
scripts/gen-audio.mjs    score + SFX → public/audio/*.wav
scripts/build.sh         full render + master
src/theme.ts             palette, colour code, easings, springs
src/components/          Backdrop (mesh, particles, grade, grain, vignette), Motion, Icons, Nodes, Captions
src/scenes/              S1Hook … S8Quiz
src/SoundTrack.tsx       narration, ducked score, SFX cue list
```

Fonts: Sora, Inter and JetBrains Mono (SIL Open Font License), bundled in `public/fonts`.
