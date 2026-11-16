# The Normal Distribution Explained in 2 Minutes

The ninth **Data Science Made Simple** Reel for **@curious_datascientist**: 115 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It names the shape the series kept drawing (the "symmetric" bell in the skewness Reel) and explains:
- that heights, exam marks and machine-poured coffee all pile up into the same bell, called the **normal distribution** (the bell curve);
- its shape: symmetric, one peak, mean = median = mode at the centre, thin tails;
- that two numbers draw it: the mean sets where it sits, the standard deviation sets how wide it spreads;
- the **68-95-99.7 rule**, then a worked heights example (165 cm, SD 7 cm);
- why it matters: beyond 3 SD is rare (about 3 in 1,000), which is used to flag outliers and for quality control;
- a quiz, then a teaser for future videos on other kinds of distributions and a "Follow us" ask.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`):
- the deep-navy studio look and four-accent colour code;
- Sora, Inter and JetBrains Mono;
- the Kokoro `af_heart` narrator at 1.05×;
- word-synced subtitles;
- the 112 BPM F-major synthesized score and SFX kit;
- the same mix and master;
- the quiz + "Follow us for data science made simple!" ending, with the page handle on the end card and the cover.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Normal_Distribution.mp4` | the finished Reel |
| `Normal_Distribution_Cover.png` | 1080×1920 cover: WHAT IS THE NORMAL DISTRIBUTION? · explained in 2 minutes, the bell with its 68% / 95% / 99.7% bands and brackets, @curious_datascientist |
| `Normal_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The bell, within 1 SD (68%), mean | cyan |
| The SD, the 1–2 SD ring (95%) | violet |
| The 2–3 SD ring (99.7%) | green |
| Beyond 3 SD, tails, outliers | orange |
| Median / mode markers | green / violet (series colours) |

The bands are drawn as non-overlapping rings (cyan centre, violet ring, green ring), so the colours never mix. Brackets under the axis show the cumulative ranges.

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:10 | **Hook** | Three cards fill dot by dot as each is named: HEIGHTS (cm), EXAM MARKS (out of 100), COFFEE POURS (ml). SAME SHAPE: a white bell outline traces over each pile. They merge into one big cyan bell and **A BELL!** slams in with a burst. |
| 2 | 0:10–0:16 | **Its name** | IT'S CALLED **THE NORMAL DISTRIBUTION** (gradient title) · a.k.a. *the bell curve* · a crown tag: THE MOST FAMOUS SHAPE IN STATISTICS. |
| 3 | 0:16–0:25 | **The shape** | SYMMETRIC · ONE PEAK. A dashed mirror line draws and the left half folds over onto the right. PEAK label, then MEAN / MEDIAN / MODE chips stack at the centre ("all equal"). The tails turn orange and get TAIL labels. |
| 4 | 0:25–0:37 | **Two numbers** | MEAN (where it sits) and SD (how wide it spreads) pills. The curve slides left and right with the mean, then widens and narrows with the SD (with a ±1 SD bracket). SMALL SD: TALL & NARROW, then BIG SD: SHORT & WIDE. The area stays constant. |
| 5 | 0:37–0:48 | **68-95-99.7 rule** | 68 · 95 · 99.7 headline on a -3 SD … +3 SD axis. On each number the band sweeps out from the centre, the big figure swaps (68% WITHIN 1 SD → 95% WITHIN 2 SD → 99.7% WITHIN 3 SD) and a bracket stacks under the axis. |
| 6 | 0:48–1:04 | **Heights example** | MEAN 165 cm and SD 7 cm pills on a 144–186 cm axis. The ±1 SD band (158–172, with -7 / +7 steps) reads **68% are 158 to 172 cm**, then the ±2 SD band (151–179) reads **95% are 151 to 179 cm**. Brackets show both. |
| 7 | 1:04–1:14 | **Why it matters** | BEYOND 3 SD: dashed lines at ±3 SD, orange tail zones and RARE labels. A 1,000-dot grid ripples in with 3 orange dots ringed: **only 3 in 1,000**. Then two cards: **FLAG OUTLIERS** (lens, "past 3 SD? check it") and **QUALITY CONTROL** (shield, "spot faulty products"). |
| 8 | 1:14–1:27 | **The complete picture** | NORMAL DISTRIBUTION pill and three recap cards with mini bells. **SYMMETRIC** (mean right in the centre); **SD SETS THE WIDTH** (narrow and wide bells); **68 · 95 · 99.7** (within 1 · 2 · 3 SD, bands sweep in). |
| 9 | 1:27–1:55 | **Quiz, teaser and CTA** | QUICK QUIZ. An EXAM SCORES bell on a 40–100 axis with MEAN 70 and SD 10 pills. "What share score **50 TO 90?**" Options 68% / 95% / 99.7% / 50%, then the 5-second countdown. **ABOUT 95%**: confetti and strikes ("that's 1 SD", "that's 3 SD", "too low"). The 50–90 band shades green with -20 / +20 brackets: **2 SD EACH SIDE = 95%**. Teaser: IN FUTURE VIDEOS · **MORE DISTRIBUTIONS** with four mystery shapes (flat, two humps, decay, spikes) marked "?". End card: NEXT: MORE DISTRIBUTIONS chip, FOLLOW button tap, **@curious_datascientist**, "for data science MADE SIMPLE." and the chips Bell curve · Mean & SD · 68-95-99.7 · 3 in 1,000. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:09.90)
- `0:00.45` Heights in a class.
- `0:01.81` Marks in an exam.
- `0:03.23` Even coffee poured by a machine.
- `0:05.40` Measure enough of them, and the same shape appears.
- `0:08.38` A bell!

**S2 · Its name** (0:09.90–0:16.39)
- `0:10.35` It's called the normal distribution, or the bell curve.
- `0:13.52` It's the most famous shape in statistics.

**S3 · The shape** (0:16.39–0:25.33)
- `0:16.84` It's symmetric, with one peak in the middle.
- `0:19.16` The mean, median and mode all sit right at the centre.
- `0:22.48` And on both sides, the tails thin out.

**S4 · Two numbers** (0:25.33–0:36.89)
- `0:25.78` Just two numbers draw the whole curve.
- `0:27.92` The mean sets where it sits.
- `0:29.62` The standard deviation sets how wide it spreads.
- `0:32.64` Small, and it's tall and narrow. Big, and it's short and wide.

**S5 · The 68-95-99.7 rule** (0:36.89–0:48.29)
- `0:37.34` Now the famous rule.
- `0:38.82` About 68% of values fall within 1 standard deviation.
- `0:43.21` 95% within two.
- `0:45.18` And 99.7% within three.

**S6 · Heights example** (0:48.29–1:03.65)
- `0:48.74` Say heights average 165 centimetres. The standard deviation is 7.
- `0:53.83` Then about 68% of people are between 158 and 172.
- `0:59.02` And 95% between 151 and 179.

**S7 · Why it matters** (1:03.65–1:13.74)
- `1:04.10` Anything beyond three standard deviations is rare. About 3 in 1,000.
- `1:08.98` That's why it's used to flag outliers and to check quality in factories.

**S8 · The complete picture** (1:13.74–1:27.09)
- `1:14.19` Here's the complete picture.
- `1:15.88` Normal data is symmetric, with the mean in the centre.
- `1:19.16` The standard deviation sets its width.
- `1:21.44` And 68, 95, 99.7 tells you where the values fall.

**S9 · Quiz, teaser and call to action** (1:27.09–1:55.46)
- `1:27.44` Quick quiz!
- `1:28.47` Exam scores: mean 70, standard deviation 10.
- `1:32.12` What share of students score between 50 and 90?
- `1:40.50` About 95%!
- `1:42.32` 50 and 90 are each 20 away from 70: two standard deviations.
- `1:47.39` In future videos, we'll explore other kinds of distributions.
- `1:51.11` Follow us for data science made simple!

*(Between "What share of students score between 50 and 90?" and "About 95%!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **The curve** is drawn from the standard normal formula φ(z) = e^(−z²/2) / √(2π) (`src/components/Bell.tsx`). When the SD changes, the peak height scales by 1/SD so the area under the curve stays the same. That's why a small SD gives a tall, narrow curve and a big SD a short, wide one.
- **68-95-99.7:** the exact shares within ±1, ±2 and ±3 SD are 68.27%, 95.45% and 99.73%. "About 68 / 95 / 99.7" is the standard empirical rule.
- **Beyond 3 SD:** 1 − 0.9973 = 0.27%, i.e. 2.7 in 1,000. That rounds to "about 3 in 1,000" (both tails together). The dot grid shows exactly 3 of 1,000.
- **Symmetric with mean = median = mode:** true for every normal distribution.
- **Heights example:** mean 165 cm, SD 7 cm.
  - ±1 SD = 158–172 cm (about 68%).
  - ±2 SD = 151–179 cm (about 95%).
  - ±3 SD would be 144–186 cm; that's the axis range shown.
  - These are illustrative round numbers. Adult heights within one sex are close to normal with an SD of around 7 cm.
- **Hook examples:** heights in a class, exam marks and machine-filled coffee are textbook examples of roughly normal data. The three dot piles are hand-made bell-shaped counts (60–61 dots each), not real measurements.
- **Uses:** flagging values beyond ±3 SD (the "3-sigma rule", or z-score > 3) is a common outlier check for roughly normal data. Control charts in manufacturing quality control use ±3 SD limits.
- **Quiz:** mean 70, SD 10. 50 = 70 − 2×10 and 90 = 70 + 2×10, so 50–90 is ±2 SD, which is **about 95%**.
  - The distractors: 68% (that's ±1 SD, 60–80), 99.7% (that's ±3 SD, 40–100) and 50% (too low).
- **Teaser:** the four mystery shapes are generic (flat, two-humped, decaying, discrete spikes). They don't commit the page to specific next topics.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro arps, soft whooshes and dot ticks as each pile fills, a glide as the bell outlines trace, then the riser, impact and crash on "A bell!".
- Name: calm "flow", with a rising lead on "normal".
- Shape and two numbers: playful marimba ("play"), with a flip as the halves fold, blips for mean/median/mode and glides as the curve slides and stretches.
- The rule: groove, with step tones before 68 / 95 / 99.7 and a lead when the rule completes.
- Heights and why it matters: groove, with clicks on each boundary, an impact on "rare" and a ding on "3 in 1,000".
- Overview: build.
- Quiz: suspense countdown, then the finale, with a lifted pad under the teaser.

SFX land a few frames before the words they illustrate, never on a word onset. The mix and master are unchanged: music ducked under every line with `useDuck(0.5, 0.16)`, then limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

This project was scaffolded from `skewness/` (`REF=skewness bash .claude/skills/data-science-explainer/new-video.sh normal-distribution NormalDistribution Normal_Distribution`). `reference/` holds those scenes for patterns only; they are not compiled. The bell curve, its bands and the axis live in `src/components/Bell.tsx`; the rule bands and brackets are shared from `src/scenes/S5Rule.tsx`.
