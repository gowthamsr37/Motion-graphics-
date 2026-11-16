# Outliers Explained in 2 Minutes

The fifth **Data Science Made Simple** Reel for **@curious_datascientist**: 115 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It covers **what outliers are and how they affect an analysis**:
- a definition you can see;
- the two kinds (mistakes vs real-but-rare);
- how to spot one with the IQR fence rule (which also builds a box plot);
- four ways they distort results: averages, spread, trends and charts.

How to *treat* outliers is saved for the next Reel, and the ending teases it ("Next time: how to treat outliers").

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`):
- the deep-navy studio look and four-accent colour code;
- Sora, Inter and JetBrains Mono;
- the Kokoro `af_heart` narrator at 1.05×;
- word-synced subtitles;
- the 112 BPM F-major synthesized score and SFX kit;
- the same mix and master;
- the quiz + "Follow for data science made simple!" ending, with the page handle on the end card and the cover.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Outliers_Explained.mp4` | the finished Reel |
| `Outliers_Explained_Cover.png` | 1080×1920 cover: WHAT ARE OUTLIERS? · explained in 2 minutes, a box plot over a dot plot (nine values huddled as "THE REST", one orange OUTLIER far away), @curious_datascientist |
| `Outliers_Explained.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Outliers, extreme values, distorted results | orange |
| Ordinary data points | white-blue |
| Mistakes (typos, glitches, wrong units) | violet |
| Real but rare (billionaire, sales spike, fraud) | cyan |
| IQR box, fences arithmetic, spread | violet |
| Mean / trend line | cyan |
| Median, "barely moves", right answer | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:13 | **Hook** | A café under hanging lamps: NINE FRIENDS stand in a row with salary tags (₹30K–₹48K), and **AVERAGE SALARY ₹40,000** pops in above them. A billionaire walks in from the right (orange shirt, crown, ₹10 CR A MONTH): +1 BILLIONAIRE. The average rolls up to **₹1,00,36,000**, the screen shakes, the friends look shocked, "?" bubbles pop and a red stamp slams down: **NOBODY HERE EARNS THIS**. On "changed everything" the people shrink into dots: nine huddle together on the left, one orange dot sits far right. Slam: **THAT'S AN OUTLIER!** (RGB glitch, ripple ring on the dot). |
| 2 | 0:13–0:20 | **What is an outlier?** | An OUTLIERS pill with the definition "a value that sits **far away** from the rest". A dashed ring marks THE REST and a dashed orange arrow runs to the lone dot: FAR AWAY. On "two kinds" the pill flies up into a header tree, OUTLIERS → MISTAKES (violet) and REAL BUT RARE (cyan), with "e.g. a typo, a glitch" / "e.g. a billionaire". |
| 3 | 0:20–0:35 | **Two kinds** | MISTAKES: a survey form (Riya, AGE) types "25", then a stray red "0" → **250**, ONE EXTRA ZERO. The 250 flies into an AGE column of a data table (24, 31, 19, 27, **250**, 22), glows orange: "?!". Tag: TYPOS · GLITCHES · WRONG UNITS. REAL BUT RARE: three cards land on their words: BILLIONAIRE (₹10 CR / month), SALES SPIKE (festival day), FRAUD (₹2L at 3 AM), then REAL, JUST RARE ✓. Then all three turn orange and tilt: **EITHER WAY, THEY WRECK YOUR ANALYSIS**. |
| 4 | 0:35–0:54 | **Spotting them: the IQR fence rule** | HOW DO YOU SPOT ONE? → THE IQR FENCE RULE. Eleven test scores drop onto a 20–100 line (equal scores stack). The box draws from **Q1 50** to **Q3 62** with the median at 58, and dotted guides drop to the dots: **IQR = 12**. A **1.5 × 12 = 18** chip appears and arrows step 18 out from each end of the box. Picket fences plant at **32** and **80**. The 95 dot hops, turns orange, ripples: **OUTLIER!** The whiskers draw to 40 and 66, completing a real box plot with its outlier dot. |
| 5 | 0:54–1:05 | **Effect 1: summary numbers** | HOW OUTLIERS AFFECT ANALYSIS · 1 · SUMMARY NUMBERS. A mini café (9 avatars + the crowned billionaire). Three rows count up as they're spoken: **MEAN** ₹40,000 → ₹1,00,36,000 (OVER 250× HIGHER); **MEDIAN** ₹40,000 → ₹41,000 (BARELY MOVES ✓); **RANGE** ₹18,000 → ₹9,99,70,000 (EXPLODES). |
| 6 | 1:05–1:20 | **Effect 2: trends** | 2 · TRENDS. Hours studied vs score: seven students on a rising cyan line of best fit, **+6.6 MARKS PER HOUR**. An orange point drops in at 8 hours, score 10 ("missed the exam"). The line re-fits live and swings almost flat (orange), the old line stays as a dashed ghost, and the readout rolls to **+0.6**: ONE POINT BENT THE TREND. |
| 7 | 1:20–1:32 | **Complete picture** | WHAT OUTLIERS DO TO ANALYSIS: four cards wire in on their words, each with a tiny live demo. **DRAG THE AVERAGE** (the mean marker slides toward the outlier), **INFLATE THE SPREAD** (a band balloons), **TILT TREND LINES** (a line flattens) and **SQUASH YOUR CHARTS** (one giant bar flattens the rest). Then the cards dim: a wobbling bin asks **JUST DELETE THEM?** and an orange stamp slams **NOT SO FAST!** |
| 8 | 1:32–1:55 | **Quiz + teaser + CTA** | QUICK QUIZ. A box on a 0–60 axis: Q1 20, Q3 30. "Which value is AN OUTLIER?" Options 12 / 48 / 18 / 38 with the 5-second countdown. Answer **48** with confetti; the others are struck through ("inside"). Fences draw at **5** and **45**, the four options drop onto the axis, and only 48 is beyond the fence. Teaser: NEXT TIME · HOW TO TREAT **OUTLIERS**. End card: NEXT: HOW TO TREAT OUTLIERS chip, FOLLOW button tap, **@curious_datascientist**, "for data science MADE SIMPLE." and Outliers · Mistakes · Real but rare · IQR fences chips. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "crore", "café" and "IQR" were checked with the phonemizer (kɹˈɔːɹ, kæfˈeɪ, aɪ-kjuː-ɑːɹ). Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:13.37)
- `0:00.45` Nine friends in a café.
- `0:02.14` Their average salary? 40,000 a month.
- `0:05.17` Then a billionaire walks in.
- `0:07.01` Now the average is 1 crore!
- `0:09.05` One extreme value changed everything.
- `0:11.44` That's an outlier!

**S2 · What is an outlier?** (0:13.37–0:19.85)
- `0:13.81` An outlier is a value that sits far away from the rest of the data.
- `0:17.96` They come in two kinds.

**S3 · Two kinds** (0:19.85–0:34.91)
- `0:20.30` Some are mistakes, like a typo that turns an age of 25 into 250.
- `0:25.87` Others are real, just rare: a billionaire, a festival sales spike, a fraudulent payment.
- `0:31.97` Either way, they can wreck your analysis.

**S4 · Spotting them** (0:34.91–0:53.70)
- `0:35.36` How do you spot one? Use the IQR fence rule.
- `0:38.45` Here are 11 test scores.
- `0:40.37` The middle half: 50 to 62. So the IQR is 12.
- `0:44.40` Step 1.5 IQRs, that's 18, beyond each end.
- `0:48.16` The fences land at 32 and 80.
- `0:50.53` 95 jumps the fence. Outlier!

**S5 · Summary numbers** (0:53.70–1:05.32)
- `0:54.15` First, outliers distort your summary numbers.
- `0:57.02` The mean jumped: 40,000 to 1 crore!
- `0:59.96` The median? Just 41,000.
- `1:02.59` And the range? Almost 10 crore!

**S6 · Bent trends** (1:05.32–1:19.67)
- `1:05.77` Second, they can bend a trend.
- `1:07.83` More hours studied, higher scores. A clear rising line.
- `1:11.54` Now add one student who studied 8 hours but missed the exam.
- `1:15.55` The line goes almost flat, as if studying barely helps!

**S7 · The complete picture** (1:19.67–1:31.75)
- `1:20.12` Here's the complete picture.
- `1:21.81` Outliers drag the average.
- `1:23.66` They inflate the spread.
- `1:25.07` They tilt trend lines.
- `1:26.63` And they squash your charts.
- `1:28.42` So should you just delete them? Not so fast!

**S8 · Quiz and call to action** (1:31.75–1:55.01)
- `1:32.10` Quick quiz!
- `1:33.13` Q1 is 20 and Q3 is 30.
- `1:35.78` Which value is an outlier?
- `1:42.90` 48!
- `1:44.05` The fences are 5 and 45. Only 48 is outside.
- `1:48.43` Next time: how to treat outliers.
- `1:50.79` Follow for data science made simple!

*(Between "Which value is an outlier?" and "48!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Café salaries (₹ thousand per month):** 30, 34, 36, 40, 40, 42, 44, 46, 48. Sum 360 over 9, so the mean is **₹40,000**. Median (5th of 9) is ₹40,000; range 48 − 30 = **₹18,000**.
- **With the billionaire** earning ₹10 crore (₹10,00,00,000) a month:
  - Mean = (3,60,000 + 10,00,00,000) ÷ 10 = **₹1,00,36,000**, about ₹1 crore and 250.9× the old mean.
  - Median of 10 values = (40 + 42) ÷ 2 = **₹41,000**.
  - Range = 10,00,00,000 − 30,000 = **₹9,99,70,000**, "almost 10 crore".
- **IQR fence rule (Tukey's 1.5 × IQR rule):** scores 40, 45, 50, 54, 54, 58, 58, 58, 62, 66, 95.
  - Quartiles use the median of each half (Tukey's hinges, excluding the overall median): lower five 40–54 give **Q1 = 50**; upper five 58–95 give **Q3 = 62**; the median is 58.
  - IQR = 12, and 1.5 × 12 = 18, so the fences are 50 − 18 = **32** and 62 + 18 = **80**.
  - Only 95 lies outside, so it is the outlier. The whiskers end at the most extreme values inside the fences, 40 and 66.
  - Software that interpolates quartiles (e.g. numpy's default) gives Q1 = 52 and Q3 = 60. 95 is still an outlier under that method.
- **Study hours vs score:** (1, 35), (2, 42), (3, 50), (4, 55), (5, 62), (6, 68), (7, 75).
  - The least-squares slope is 184 / 28 = **+6.57 marks per hour**.
  - Adding (8, 10) gives a slope of 25.5 / 42 = **+0.61**: "almost flat".
  - The line on screen is the live weighted least-squares fit as the odd point's weight goes from 0 to 1.
- **Quiz:** Q1 = 20 and Q3 = 30, so IQR = 10, 1.5 × IQR = 15 and the fences are **5 and 45**. 12, 18 and 38 are inside; **48** is outside.
- **"3 standard deviations"**, the other common rule (flag |z| > 3), is left out of the narration to stay under 2 minutes. It only suits fairly large, roughly bell-shaped datasets. In a sample of 11 a point can barely reach z = 3: the maximum possible is (n − 1)/√n ≈ 3.02 with the sample SD. Here 95 has z = (95 − 58.2) / 14.3 ≈ 2.6, so the z rule would miss the very outlier the fence rule catches, which is why the IQR rule is the one shown.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro arps, an impact when the average lands on a crore, then the riser, impact and crash on "That's an outlier!".
- What is an outlier: groove.
- Two kinds: playful marimba ("play"), with typing clicks, a stamp on the extra zero and an impact on "wreck".
- IQR fence rule: calm "flow" with a gliding lead as the scores drop, ascending step tones as each fence plants, and a hop as 95 jumps.
- Summary numbers: groove, with glides and impacts on the mean and the range and a ding on the median.
- Trends: groove, with an impact as the odd point lands and a glide as the line tilts.
- Overview: build, with a riser into the "NOT SO FAST!" stamp.
- Quiz: suspense countdown, then the finale.

The mix and master are unchanged: music ducked under every line with `useDuck(0.5, 0.16)`, then limiter → two-pass loudnorm to −14 LUFS.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

This project was scaffolded from `centre-vs-spread/` (`REF=centre-vs-spread bash .claude/skills/data-science-explainer/new-video.sh outliers Outliers Outliers_Explained`). `reference/` holds those scenes for patterns only; they are not compiled. New shared pieces live in `src/components/Kit.tsx`.
