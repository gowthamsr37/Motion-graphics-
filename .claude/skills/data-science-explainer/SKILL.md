---
name: data-science-explainer
description: House style and production pipeline for the "Data Science Made Simple" educational Instagram Reels (first video "Types of Data Explained in 2 Minutes", in types-of-data/). Use EVERY time the user asks for a new explainer, educational, statistics, data-science, ML, maths or "X explained" video, or asks for "the same style as Types of Data". Locks the theme, colour code, fonts, voice, music, mix, layout, subtitle style, pacing, quiz and CTA, cover, caption format and QA loop so every video in the series matches. Read together with the remotion-motion-graphics skill.
---

# Data Science Made Simple: house style

The user approved **types-of-data/** as the reference ("came out very well") and asked that **every setting, theme and voice stay the same in future videos**. Treat everything below as fixed defaults. Change something only when the user explicitly asks; if a request seems to conflict with these, ask before deviating.

The reference implementation is `types-of-data/`; the later videos `mean-median-mode/`, `measures-of-dispersion/`, `centre-vs-spread/`, `outliers/`, `iqr/`, `treating-outliers/`, `skewness/`, `normal-distribution/`, `z-score/`, `probability-distribution/`, `population-vs-sample/`, `central-limit-theorem/`, `uniform-distribution/`, `binomial-distribution/`, `poisson-distribution/`, `exponential-distribution/`, `pareto-distribution/`, `lognormal-distribution/`, `bernoulli-geometric/`, `t-distribution/`, `chi-square-distribution/`, `which-distribution/` (cheat sheet v2), `confidence-intervals/`, `hypothesis-testing/`, `p-value/`, `type-1-type-2-errors/`, `ab-testing/`, `distributions-guide/` (complete cheat sheet v3), `confidence-intervals-v2/`, `p-value-v2/` and `hypothesis-testing-v2/` (simpler remakes), `which-test/`, `z-test/` and `t-test/` follow it exactly. Reuse their code, not a rewrite. Scaffold from the newest one so you inherit its improvements:

```bash
REF=which-test bash .claude/skills/data-science-explainer/new-video.sh <folder> <CompId> <File_Stem>
```

The improvements it inherits:
- `TreeHeaderN` for three branches;
- `cueS(i, token, nth)`;
- the subtitle pager that keeps number lists on one line;
- the SVG `Rupee`, `NotEqual`, `Radical` and `Arrow` glyphs;
- `clink.wav`;
- the `HANDLE` constant in `theme.ts`;
- the CTA with the handle;
- captions that highlight only one word at a time (two scaled neighbours ate the gap: "That'sdispersion");
- `components/Kit.tsx`: `inr()` Indian digit grouping (1,00,36,000) and `Money` (drawn ₹ + mono amount), `SceneTitle` (small-caps label + pill in the header band), `Lamp`, `Fence` (picket fence marker), `Stamp` (rubber stamp slam) and extra glyphs.

**Instagram page: @curious_datascientist.** Use the handle (`HANDLE` in `theme.ts`) on the CTA end card (under the FOLLOW button), on the cover (bottom) and in the caption ("Follow @curious_datascientist for data science made simple 🚀"). The spoken final line stays "Follow for data science made simple!"

Other series in this repo (the cricket "Beyond The Scoreboard" reels) have their own look. Do not restyle them, and do not apply this style to them.

## 1. Format

| Setting | Value |
| --- | --- |
| Canvas | 1080×1920 (9:16), **30 fps** |
| Length | 100–120 s (reference: 112 s) |
| Codec | H.264, CRF 16; AAC 256 kbps, 48 kHz stereo; `+faststart` |
| Loudness | **−14 LUFS** integrated, true peak −2 dBTP (alimiter → two-pass loudnorm) |
| Deliverables in `out/` | `<Stem>.mp4`, `<Stem>_Cover.png` (1080×1920), `<Stem>.srt`; caption in `CAPTION.md`; README with storyboard + timestamped VO script |

## 2. Look (copy `types-of-data/src/theme.ts` verbatim)

- **Background:** deep navy `#050A1F`, deep `#02051A`, navy `#0C1640`. Never flat. Five layers:
  1. Radial navy gradient, plus two big drifting radial colour fields tinted by the current topic (crossfade 20 frames at scene changes).
  2. A masked dot grid (54 px, slow drift).
  3. 44 twinkling particles.
  4. Grade: soft-light `#3B2F9E` at 0.2, plus top/bottom darkening.
  5. Grain: SVG turbulence, overlay, 0.07. Then a vignette.
- **Accents:** cyan `#22D3EE`, violet `#A78BFA`, green `#34D399`, orange `#FB923C`. Used sparingly:
  - red `#FB5C7A` only for "wrong" marks;
  - yellow `#FCD34D` only for the quiz badge, "?" bubbles and the 2-minutes highlight;
  - blood `#F2557A` only for blood drops.
- **Text:** `#F3F7FF`; dim `#A3B0D6`; ink (dark text on bright fills) `#071033`. Panels are `rgba(14,24,64,0.74)` gradients with a 2 px `rgba(150,180,255,0.16)` edge and radius 26–36.
- **Category colour code:** keep each concept on one colour for the whole video. In Types of Data:
  - DATA: white-blue orb
  - numerical / discrete: cyan
  - continuous: green
  - categorical / nominal: violet
  - ordinal: orange

  For a new topic, assign up to 4 accents to its main branches the same way. Keep these meanings for the basic types if they reappear.
- **Fonts** (in `public/fonts`, loaded by `src/fonts.ts`):
  - **Sora** 600/700/800: all display text, pills and subtitles.
  - **Inter** 500–800: small caps labels (letter-spacing 0.22–0.26em, dim).
  - **JetBrains Mono** 500/700/800: numbers, readouts, counters, equations.
- **Glow:** only on the focal element (`glowText` / `glowBox` from theme). Hero headlines are 70–120 px, weight 800, letter-spacing −0.02 to −0.03em.
- **Illustration style:** flat Kurzgesagt-like SVG drawn in theme colours (`components/Icons.tsx`):
  - `Person` (rounded head, hair cap, dot eyes, smile arc, walk swing, `armsUp`, blink), MapPin, BloodDrop, Face(mood), Jersey(number), Thermometer(level), Arrow;
  - 24–40 px stroke glyphs for chips.
  - No emoji, no bitmaps, no stock art.

## 3. Layout (safe areas)

- Top 0–220 and bottom ≥ 1530 are Instagram UI: background only.
- **Header** 240–480 holds the topic tree (`TreeHeader`: parent pill at (540, 292), children at (290, 452) and (790, 452)). **Stage** 500–1340. **Subtitles** centred on y = 1452.
- Keep content within x 90–990. Keep the right column (x > 960, y > 1100) clear of anything important.
- Use px `gap` values, never em, around big type.

## 4. Motion vocabulary (reuse `components/Motion.tsx`, `Nodes.tsx`, `Backdrop.tsx`)

- `Pop` for every entrance: spring plus 2–3 properties, with `dim` for focus dimming, `out` for faster exits.
- `Burst`, `Ripple`, `Confetti` for accents. `Rolling` for continuous number readouts (odometer with fade mask). `Mark` for strokes-on ✓/✗.
- `Wires` + `bezier` for connectors that draw on and then carry light pulses. `Orb` (glowing DATA particle with orbit rings), `Pill`, `Chip`, `Tag`, `TreeHeader`.
- **Transitions:**
  - whip-pan with motion blur;
  - zoom-through into the next node (the next scene's pill arrives scaled up);
  - horizontal pan between sibling branches;
  - collapse-into-badges and merge-into-orb;
  - shrink toward where the next scene's element will appear.
- **Rules:**
  - No linear easing; every `interpolate` is clamped.
  - Stagger entrances by 3–6 frames. Exits take about 10 frames and are faster than entrances.
  - A new visual or a meaningful change every 2–4 s. Idle elements breathe.
  - Concepts are *demonstrated*, not stated: counting, measuring, shuffling, staircases, struck-out comparisons. The video should work muted.
- **Focus pattern:** when explaining one branch, dim its sibling to about 0.38 and glow the active pill.

## 5. Narrative template (the reference structure)

1. **Hook (0–10 s):** three quick real-life vignettes, whip-panned, under a kinetic headline stack ("YOUR HEIGHT, / YOUR CITY, / YOUR EXAM RANK…", keywords coloured by category). Then a slam reveal with impact and shake, then a twist line with an RGB-split glitch. Merge into the orb.
2. **Big picture:** the orb splits into the main branches, each with example chips. Zoom into the first branch.
3. **One scene per leaf concept:** header tree on top, with one concrete, physical demonstration synced to the words, the classic misconception stamped out (e.g. "3.5 students"), and a one-line concept tag.
4. **Complete picture:** a file-tree hierarchy assembling on the spoken words, with one example per leaf, travelling pulses and a shine sweep.
5. **Quiz:** a QUICK QUIZ badge, a prop, the question word by word, and four colour-coded options. A **5-second countdown ring** (green → yellow → orange → red, beeps, options scanning). The reveal gets a check, ta-da and confetti, then a one-sentence why with struck-out wrong reasoning.
6. **CTA:** a tree logo, a **FOLLOW** button that gets tapped (turns green with a check), the **@curious_datascientist** handle chip under the button, "for data science / MADE SIMPLE." and recap chips of the video's key terms. The final spoken line is always **"Follow for data science made simple!"**

## 6. Voice (fixed)

- **Kokoro TTS v1.0** (`kokoro-v1.0.onnx`, `voices-v1.0.bin`), voice **`af_heart`**, `lang en-us`, **speed 1.05**. Conversational and energetic, about 160 wpm.
- Synthesize **each sentence separately** (`scripts/gen-voice.py`):
  - trim threshold 0.01, padding 0.04 s, peak-normalise to 0.9 per scene;
  - pauses 0.3–0.6 s, scene lead 0.35–0.55 s, hold 0.45–1.35 s;
  - the quiz question is followed by `"pause": 5.7` for the countdown.
- `scripts/voiceover.json` has, per segment:
  - `text`: spoken. Write numbers as words: "one sixty-five point eight".
  - `caption`: on screen, with numerals: "165.8".
  - `pause`.
  - optional `fix`: phoneme replacements for mispronunciations, e.g. `["ˈæb","ˈeɪ bˈiː"]` for AB and `["bˈɛŋɡɐlˌʊɹɹuː","bˈɛŋɡəlˌuːɹuː"]` for Bengaluru.

  Check every proper noun and acronym with `tts.tokenizer.phonemize(text, "en-us")` first.
- For a count where each item needs its own visual beat, make every number its own segment and sync visuals to `sent(i).from` (exact TTS onsets).

## 7. Subtitles (fixed)

- Burned in, word-synced. One line per page, chosen by the DP pager in `gen-voice.py` (max 28 characters, sentence ends always break, prefers `: ;` then `,`, never ends a line on a weak word, penalises orphans).
- Word timings: **faster-whisper `small.en`** int8, aligned to the script text with difflib.
- **Style:**
  - Sora 700, 46 px;
  - box `rgba(4,8,30,0.72)`, radius 24, 1.5 px edge, max width 860;
  - unspoken words at 0.42 opacity;
  - the current word takes the scene accent (yellow in the quiz), scale 1.05, with glow; only one word is highlighted at a time (the previous one releases when the next starts);
  - pop-in spring between pages.
- Also export `.srt` (`scripts/export-srt.py`).

## 8. Music and SFX (fixed sound, re-timed per video)

- **Score** (`scripts/gen-audio.mjs`, all synthesized, no samples): **112 BPM, F major, I–V–vi–IV (F–C–Dm–Bb)**.
  - Instruments: kick, clap, hats, off-beat saw bass, pluck arps, marimba, detuned pad, bells, a gliding sine lead, riser, impact, crash. Reverb 0.18, tanh 1.1, normalise 0.89, 0.6 s fade.
  - **Section styles:**
    - `intro`: filtered arps, kick from the 2nd vignette, riser into an impact plus crash on the reveal.
    - `drop`: lifted chord.
    - `grooveA` / `grooveB` / `play` (marimba, for categorical/playful topics) / `flow` (smooth pads plus gliding lead, for "continuous/smooth" ideas) / `build` (overview, 16th hats).
    - `tension`: the quiz. Beat out, Gsus pad, ticks, a heartbeat pulse per countdown second.
    - `finale`: crash on the reveal, full groove, ending on an F chord with bells.
- **SFX kit** (same file names):
  - movement: `whoosh`, `whip`, `pop`, `click`, `tick`, `hop`, `door`;
  - countdown and counting: `beep`, `beep-hi`, `blip1–5` (ascending, for counting), `step1–3` (ascending, for staircases/order);
  - cards: `flip`, `shuffle`;
  - reactions: `stamp` (wrong), `ding` (right), `tada` (quiz answer), `confetti`, `glitch`, `button`;
  - texture: `sparkle`, `glide`, `chime`, `riser`, `impact`.

  Every SFX fires **2 frames before** its visual.
- **Mix** (`src/SoundTrack.tsx`):
  - narration at 1.0;
  - music `useDuck(0.5, 0.16)`, ducked under every line with a ramp of fps/4;
  - SFX volumes 0.18–0.55 (whips and stamps up to 0.45–0.55, clicks about 0.3, sparkles about 0.25).

## 9. Timing architecture (don't break it)

- Visual beats key off spoken words via `src/timing.ts`:
  - `sent(i)`, `cue(token)`, and **`cueS(i, token, nth)` for any word spoken twice in a scene**. `cue` finds the first occurrence, and that bug is easy to miss.
  - Tokens are normalised to `[a-z0-9]`, so "-7," and "7." both match "7"; use `nth`.
  - Sentence indices shift when you split segments, so re-check every `sent(i)` after editing the script.
- Re-voicing re-times the whole film. Mirror any music hits in `gen-audio.mjs` with the same cue helpers.
- Animation durations are written in 30 fps frames, so keep the composition at 30 fps.

## 10. Cover and caption

- **Cover** (`src/Cover.tsx`): the same background. Title "TOPIC" in Sora 800 white (150 px), the key word in a cyan → violet gradient (about 196 px), then "explained in **2 minutes**" in Sora 700 52 px with the number in yellow. Below it, a visual of the topic in the colour code (tree, dot plot or curves), and the **@curious_datascientist** handle at the bottom. Keep it all inside the centre 3:4 profile-grid crop. Scale the title down for long topic names so it fits within 1080 px.
- **CAPTION.md:**
  - a hook line with 👀;
  - an emoji-headed bullet recap per branch (📊 / 🏷️ …) with concrete examples;
  - a quiz prompt ("Drop your answer before the reveal 👇");
  - "Follow @curious_datascientist for data science made simple 🚀";
  - about 10 hashtags (#datascience #statistics … #learnoninstagram …).

## 11. Pipeline and QA (mandatory)

1. Write `voiceover.json`, then run `gen-voice.py`. Check the durations (100–120 s total) and the subtitle pages it prints.
2. Build the scenes. Render stills with `node scripts/stills.mjs out/bundle out/check <frames…>` and tile them with `python3 scripts/sheet.py`, then **look at them**. Fix overlaps, safe areas and timing.
3. Run `BROWSER=<headless shell> bash scripts/build.sh`. It runs gen-audio, then bundle, render, cover, master and srt.
4. Extract frames from the **encoded MP4** across every scene and inspect them.
5. Transcribe the mastered audio with Whisper; it must match the script, which proves the voice sits clearly over the music. Confirm `ebur128` reads about −14 LUFS.
6. Deliver the MP4, cover and SRT with SendUserFile, paste the caption, and commit the project folder (renders in `out/` are gitignored; `public/audio` and `public/vo` are committed).

### Tool setup in a fresh cloud container

```bash
SP=<scratchpad>; uv venv $SP/venv --python 3.12 && . $SP/venv/bin/activate && uv pip install kokoro-onnx soundfile faster-whisper
mkdir -p $SP/models/kokoro && cd $SP/models/kokoro
curl -sSLo model.onnx  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -sSLo voices.npz  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
HF_HUB_DISABLE_XET=1 python -c "from huggingface_hub import snapshot_download; snapshot_download('Systran/faster-whisper-small.en', local_dir='$SP/models/whisper-small-en')"
BROWSER=$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell | head -1)
```

Notes:
- The Xet download path fails behind the proxy; `HF_HUB_DISABLE_XET=1` fixes it.
- faster-whisper's file decoder is broken with the installed `av`, so pass numpy arrays (gen-voice already does).

## 12. Lessons from the reference build

- Unicode arrows (→ ➜) and some symbols aren't in Sora. Use the SVG `Arrow`. Check "≈ … °" in renders.
- `Pop`'s `style.opacity` overrides its own fade; use the `dim` prop.
- In a mono font "3.5" spreads out; tighten with letter-spacing −0.14em.
- Shuffled or overlapping cards need a `zIndex` by lift direction. Comparison glyphs placed between tight cards need a backing disc to read.
- Put "?" gap badges on the open side of brackets, not over the neighbouring card.
- A misconception moment needs to be unmistakable: dim the rest, make the wrong thing big, then stamp it out.
- Hook headline lines must fit in 1080 px; 70 px Sora fits "YOUR EXAM RANK…".
- Dot plots: pick values and a scale so neighbouring dots sit at least one dot-width apart (a 0–100 axis over ~850 px needs gaps of 4+ units for 30 px dots), and keep labels clear of stacked dots.
- Never leave the stage empty while the first line of a scene plays: put the scene's question on screen from frame ~4. For a list that fills in on cue, show dashed empty slots from frame ~4.
- For a step-by-step method, a numbered step tracker in the header band (done = green check, active = glowing) keeps viewers oriented (`iqr/` S4).
- When one extreme value would squash a dot plot, use a broken axis (two segments with a `//` mark) rather than shrinking the dots until they overlap.
- Topics with many items (e.g. 7 treatments) can use more than 8 scenes. Scene ids now come from `timeline.json` (`src/timing.ts`), so just add the scene to `voiceover.json`, `SCENES`/`LOOK` in `Main.tsx` and the score sections (`treating-outliers/` uses 9). A numbered "n/7" pill keeps viewers oriented across scenes.
- Don't land an SFX on the first consonant of a spoken word: it masks it (Whisper heard "Right-skewed" as "Bright skewed"). Fire onset effects 8–12 frames before the word. If only the full-length transcript mishears a word, transcribe that clip alone before changing the mix; long-form Whisper sometimes mishears with context.
- The master chain ends with `alimiter=limit=0.79` after loudnorm (`skewness/scripts/build.sh`) so true peak stays near −2 dBTP.
- Histogram demos: keep the bin counts as the data and compute mode / median / mean from them (`skewness/src/components/Hist.tsx`), so markers are exact. Colour helpers like `alpha()` expect hex: pass `#RRGGBB`, not an rgba() string (an rgba fed to `alpha()` rendered black bars).
- Distribution curves: draw them from the formula (`normal-distribution/src/components/Bell.tsx`: `Bell`, `Axis`, `curveY`, `vx`), scaling the peak by 1/SD so the area stays constant when the SD changes. Show nested ranges (68 / 95 / 99.7) as non-overlapping coloured rings plus stacked brackets under the axis (`S5Rule.tsx`: `ruleBands`, `Bracket`), never as overlapping translucent fills that mix colours.
- Tiny probabilities (e.g. 3 in 1,000) read better as a dot grid (`S7Rare.tsx`) than as a sliver of curve area that is too thin to see.
- A teaser for a future topic goes between the quiz explanation and the CTA (about 3–4 s, `S9Quiz.tsx`). Keep its visuals generic (unlabelled mystery shapes) so the page isn't committed to specific next topics, and repeat it as a small NEXT: chip on the end card.
- Shared kits (from `z-score/`, inherited by every scaffold): `components/Quiz.tsx` (`QuizBadge`, `Question`, `Countdown`, `Options`, `Reveal`, `quizClock`), `components/Cta.tsx` (`Cta` with `next` and `chips` props) and `components/Rule.tsx` (`ruleBands`, `Bracket`, `Span`). A new quiz scene is just its prop plus these; don't copy the old inline quiz code.
- Cue only on words that appear in the `caption` text: tokens come from the caption, not the spoken text. A caption that writes "n - 1" has no "minus" token (cue "1," instead), and `cueS` throws `no spoken token` at render time.
- Seeded simulations (`rng(seed)`): print the min / max / mean / SD of the simulated data with node before rendering and pick a seed that looks typical. One seed put a 10-dice average at 1.6 (a ~1-in-5,000 event) as a stray dot.
- The countdown digit must be clamped to 5 (`Math.min(5, …)` in `Quiz.tsx`): before the countdown starts it read 6 for a few frames while the ring scaled in.
- A formula that completes on a later word: reveal the tail with an animated `maxWidth` (overflow hidden), not just opacity, or its box shows an empty gap.
- Shared teaching props live in components: `Prob.tsx` (Die, Coin, weather, battery, MiniBars), `Sampling.tsx` (seeded normals, discPoints, pick, pot / spoon / bulb), `Clt.tsx` (exact dice-average and Gamma densities, AreaChart, BarChart, Radical).
- **Narration style the user prefers (Nov 2026, after the CLT remake):** keep it easy. State the topic's definition in plain words right after the hook, and build it on screen as a numbered definition card (`central-limit-theorem/src/scenes/S2Definition.tsx`). Use one everyday running example shown step by step with a 1-2-3 tracker, add a short "why it happens" scene, avoid formulas where words work, repeat the definition in the recap, and make the quiz test the definition. Short sentences.
- Spoken numbers in the quiz question are fragile. In the full mix "fifteen" was heard as "fifty" because a pop fired 8 frames before it (the narration alone was fine). The shared `quiz()` helper in `SoundTrack.tsx` now fires the keyword pop 18 frames early at 0.18. When a full transcript mishears a number, transcribe the narration alone with a clean window around the sentence before changing the voice.
- Length: 100–120 s by default; the user allows a few extra seconds when it buys a clear explanation (`treating-outliers/` is 124 s).
- `Pop` is centred on its x, so its content can only be as wide as the distance to the right edge (540 px at x = 540) and multi-line text wraps early ("HOW DO / YOU"). Give every text block inside a `Pop` `whiteSpace: "nowrap"` and explicit `<br />`s.
- Money constants: write the unit next to every constant ("in ₹ thousand") and print the derived numbers once with node before rendering. A 10× slip (₹100 crore instead of ₹10 crore) looked plausible on screen.
- Never let an SFX land on a word: a whoosh plus dot ticks fired at the start of "Count many hours" and the mix read "How many hours" (Poisson). Put sentence-start whooshes 14–16 frames early and start tick runs after the second word (`cueS(i, "many") + 8`).
- A word repeated in one sentence ("one way … One head", "three ways … Three heads") needs `cueS(i, token, nth)`; the first match fires early.
- Whisper on the full mix can mishear a word or invent a closing line over the music tail ("See you next time"). Before changing anything, re-transcribe a 4-second window of the mix and the clean `public/vo/sN.wav`; only fix what the clean window also gets wrong.
- Distribution kits now in the scaffold: `Explain.tsx` (DefCard, RecapFlow, Flat/Bars/CurveIcon, Teaser), `Pois.tsx` (pois, poisDist, poisSamples, CountBars), `Exp.tsx` (expPdf/Cdf, expSamples, ExpCurve with bands and a `t0` shift, MinAxis, Stopwatch, Gap/DotsIcon) and `Pick.tsx` (`Shape` for uniform / binomial / Poisson / exponential / normal / bimodal, and the `QuestionScene` template).
- Writing README files from the shell: use the Write tool or a quoted heredoc (`<<'EOF'`). An unquoted heredoc runs every backtick span in the text as a command (it started `npx remotion studio` and a build).
- **Second style preference (Nov 2026, distributions batch 2):** "explain them very well so everyone understands; 10–15 extra seconds is fine; don't squeeze." So: one idea per scene, more scenes (8–10), explain every term before using it (what a log is, what degrees of freedom are), and a concrete running example. Target 1:55–2:15; if a draft runs longer, move side remarks onto the screen instead of cutting explanations.
- Quiz options with long names collide with the strike reason. `components/Quiz.tsx` (from `t-distribution/` on) shrinks names over 8 or 10 characters and puts the reason on a panel-coloured backing. Keep reasons to 1–3 words.
- Whisper's English model doesn't know Indian units: it writes "lakh" as "lock" and "crore" as "core". The TTS phoneme patch (*laakh*) is right; don't chase those in QA.
- When the spoken numbers come from a model (Pareto mean, t cut-offs, chi-square p-values), compute them exactly and keep any illustrative sample consistent with them, or label it as shape-only. 100 Pareto quantiles average ₹869, not the population ₹1,442.
- New kits: `Curve.tsx` (FnCurve for any density, with bands, a sweep and a dashed variant; ValueAxis, Marker, Badge, Bracket), `TDist.tsx` (exact t density via log-gamma), `Chi.tsx` (chi-square density plus a seeded dice simulation), `PriceDots.tsx` (a dot plot that morphs between a linear and a log scale) and `Pick.tsx` v2 (Shape for all twelve distributions, CheatRow).
- When a spoken line is cut to save time, re-check every visual that was timed off it. A stamp gated on the removed line's window silently never appeared.
- The fonts are Latin subsets: α, β, ≈, ≠, ₹, √ and → don't render. Spell out ALPHA / BETA, use the `NotEqual`, `Rupee`, `Radical` and `Arrow` SVGs, and replace "≈ 0.0002" with a true bound ("p < 0.001"). ± ÷ × − are fine.
- Even after the `Quiz.tsx` shrink, an 8-character option ("NO ERROR") plus a 3-word reason ("it was real") overlapped. Keep names at 7 characters or fewer when the reason is longer than 2 words, or pick shorter words ("NONE", "it erred").
- `SceneTitle` sits at y ≈ 280: start icons and headlines at y ≥ 400 (a warning icon at y 330 sat on the title).
- `cueS(i, …)` throws "Cannot read properties of undefined (reading 's')" in `SoundTrack` when sentence `i` doesn't exist. Count each scene's sentences in `voiceover.json` before writing cues; a two-sentence scene has indices 0 and 1 only.
- Inference batch kits: `Coins.tsx` (exact Binomial(10, ½), `HeadsBars`), `CI.tsx` (number line, `Interval`, 20 seeded surveys), `Errors.tsx` (`Phi`, `alphaAt` / `betaAt`, `ErrCurves` with α / β / power areas, the 2×2 outcome `Grid`, smoke-alarm and flame icons) and `AB.tsx` (`Phone`, `BuyButton`, `PLess`, the seeded 50/50 visitor `SPLIT`).
- Kokoro reads a standalone capital "A" as the article *uh* ("B beats A" became "B beats uh"). Patch it with `fix: [["bˈiːts ɐ", "bˈiːts ˈeɪ"]]` (match the word before it), and phonemize any sentence with a lone letter first.
- Long-form "save this" Reels (`distributions-guide/`): stay under 3:00. Longer uploads are accepted, but Reels over about 3 minutes are reported not to be recommended to non-followers. One full-screen card per item (family tag, 01/12 counter and progress bar, shape, use-it-when, three examples, key numbers, a code one-liner), cards on a 0.3 s lead and 0.6 s hold, a "how to use it" scene, then a one-screen cheat sheet held about 10 s with explicit save / send / "full video on my page" lines. Put the whole cheat sheet in the caption as text too.
- **100 Days of Machine Learning (user request, Nov 2026):** the ML series keeps this house style for the videos, but every ML cover uses the deep plum background (`ML.bg #12051F` → `ML.bg2 #240A3D`, magenta `#D946EF` and orange `#F97316` glows, pink `#F0ABFC` accents; `MLBackdrop` in `ml-trailer/src/Cover.tsx`), so ML and statistics covers are easy to tell apart. Scaffold ML episodes with `REF=ml-trailer`; add a DAY NN / 100 badge to each episode's video and cover. The trailer (`ml-trailer/`) skips the quiz, the only deliberate deviation.
- **Third style preference (Nov 2026, CI and p-value remakes):** "people should understand easily; give more examples, and a definition they can say in interviews; use up to about 170 s." So for core concepts:
  - open on a relatable real-world hook (a news poll, a coin);
  - give a formal **INTERVIEW ANSWER** card (`components/Simple.tsx` in `confidence-intervals-v2/`), revealed phrase by phrase, plus a plain-words line;
  - use an everyday analogy (spear vs net);
  - include 2–3 labelled EXAMPLE n scenes;
  - name the common misreadings explicitly ("interview traps");
  - make the quiz test the classic confusion.
- **Growth rules (user, Nov 2026, from the Instagram dashboard: follows came mostly from practical "how to" and "why" puzzle reels; basic definitions got views but few follows).** Apply to every new video (first used in `which-test/`):
  - **Hook and cover = a problem or a puzzle** the viewer has ("Found outliers in your dataset?", "Is this dice fair?", "Which test should I use?"), never "What is X?". The cover asks the same question as the hook.
  - Prefer practical step-by-step videos, "how to treat X" topics, full worked calculations and cheat sheets; for theory, open on a "why does this happen?" puzzle.
  - **Quiz options carry A/B/C/D letters** (`components/Quiz.tsx` from `which-test/` on) and the quiz scene shows `PollHint` ("VOTE IN THE CAPTION POLL" with a bouncing down arrow) from the question until the reveal. Keep the options identical to the caption poll.
  - A "SAVE" moment on the recap or cheat sheet (bookmark that drops and wiggles, plus a spoken save/send line).
  - Small purposeful animations tied to spoken words: numbers flying into formulas, step-by-step transforms, table cells counting up, props that act out the example (a bottle filling, a battery draining). No clutter.
  - Stay under 3:00.
  - **CAPTION.md has three parts:** the caption (a unique problem/puzzle first line, never reused across reels; the recap; the quiz as text with "Vote in the poll before the answer 👇"; a save/send line; a series line "Next: … The whole Data Science Made Simple series is on my page."; the handle; **5–8 specific hashtags**), a **Poll** block (short question, 2–4 short options matching the video's quiz; the user adds it while writing the caption), and a **Pinned comment** with the answer and the one-line reason.
  - The user now posts 2 reels a day.
- **Long calculation videos (user, Nov 2026, z-test second cut):** no in-video quiz. The quiz lives only in the caption poll; the video ends with a ~5 s spoken "Your turn: … Vote in the caption poll!" prompt (`z-test/src/scenes/S13Poll.tsx`: YOUR TURN badge, the question visual without the answer, a scaled-up `PollHint`), then the teaser and CTA. Spend the freed ~20 s on explanation. Name the standard terms explicitly (critical value, critical region / rejection region, fail-to-reject region, p-value vs critical-value method), and when a table is used two ways say which direction each look-up goes (z → area, area → z). Short explainers keep the full quiz. Introduce the definition with just "Here's the textbook definition." (the INTERVIEW ANSWER badge already says it is for interviews). For tests with a one- vs two-tailed choice, explain both in the hypotheses step and work the decision for both (z-test third cut).
- Group names that are single letters ("brand A vs brand B") hit the Kokoro "A" → *uh* bug in every position, not only after "beats": "each: A averages" → *ɐ*, "averages: A is" → *ɐ*, "For A," → *fɚɹə*. Phonemize every sentence that names group A and patch it (`t-test/scripts/voiceover.json` s1/s6 fixes); confirm on the clean `public/vo/sN.wav`.
