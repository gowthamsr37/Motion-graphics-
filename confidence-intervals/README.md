# Confidence Intervals Explained in 2 Minutes

The twenty-fourth **Data Science Made Simple** Reel for **@curious_datascientist**. It covers the confidence interval: a range that likely contains the true average, built as average ± margin of error. 2:18, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

This is the first Reel of the inference batch: confidence intervals → hypothesis testing → p-value → Type I vs Type II errors → A/B testing. It runs on one example throughout: a food app's 32-minute average delivery time, measured from only 100 orders. It covers:
- a plain-words definition card;
- why a single number is not enough (sample averages wobble);
- how the range is built (standard error, about 2 SE each way);
- what "95%" really means (20 simulated surveys, 19 catch the truth);
- how sample size changes the width (including the t-distribution for small samples);
- a recap and a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: HYPOTHESIS TESTING chip.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Confidence_Intervals.mp4` | the finished Reel |
| `Confidence_Intervals_Cover.png` | 1080×1920 cover: CONFIDENCE INTERVALS · explained in 2 minutes. It shows "32 ± 2 MIN" over 12 of the simulated 95% ranges around the green true-average line (one misses, in orange), plus @curious_datascientist |
| `Confidence_Intervals.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The sample average, sample dots | cyan |
| The 95% range, the margin, standard errors | violet |
| The true average | green |
| A range that misses, "only 100 orders" | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:10 | **Hook** | A food-app card: **FOOD APP · AVERAGE DELIVERY 32 MIN**, FROM ONLY **100 ORDERS**. **HOW SURE?** pops, then the title **CONFIDENCE INTERVALS** · EXPLAINED SIMPLY, with a burst. |
| 2 | 0:10–0:29 | **The definition** | IN SIMPLE WORDS: 1 **A RANGE** (not one number); 2 that likely contains **THE TRUE AVERAGE**; 3 with a **CONFIDENCE LEVEL** (95%). A number line draws the example range: **30 TO 34** MINUTES. |
| 3 | 0:29–0:41 | **Why a range** | EVERY SAMPLE **WOBBLES**: sample averages of 32, 31 and 33.5 (and more dots) land on the minutes line. Then **ONE NUMBER HIDES THE WOBBLE**. |
| 4 | 0:41–1:05 | **Building the range** | **AVERAGE ± MARGIN OF ERROR**. **STANDARD ERROR = SPREAD ÷ √n**, then 10 ÷ √100 = **1 MIN**. Two "2 SE" steps grow each way from 32, giving **32 ± 2 → 30 TO 34**, with the note 95%: 1.96 STANDARD ERRORS EACH WAY. |
| 5 | 1:05–1:22 | **What 95% means** | **NOT "95% SURE ABOUT THIS ONE RANGE"**, then REPEAT IT: 20 simulated surveys stack up as ranges around the green **TRUE AVERAGE (32)** line. 19 catch it; one, labelled **MISSED**, is orange, and a counter reaches **19 OF 20**. Then the chip **REPEAT IT: 95 IN 100 RANGES CATCH IT**. |
| 6 | 1:22–1:39 | **Sample size** | **NARROWER RANGE**: n = 100 gives 30 to 34 (±2), and n = 400 gives 31 to 33 (±1): **4× THE DATA = HALF THE MARGIN**. With n = 25, **USE t, WIDER**: about 28 to 36. |
| 7 | 1:39–1:50 | **Remember** | A CONFIDENCE INTERVALS pill and a recap flow: **A RANGE, NOT ONE NUMBER** ↓ **AVERAGE ± MARGIN** ↓ **MORE DATA, NARROWER RANGE**. |
| 8 | 1:50–2:18 | **Quiz, teaser and CTA** | QUICK QUIZ: 100 PEOPLE has a margin of ±4; 400 PEOPLE has **NEW MARGIN?** Options 1 / 2 / 4 / 8 with the 5-second countdown. **± 2 POINTS** wins confetti. The wrong options are struck with "that's ÷ 4", "no change" and "wrong way", and the panel reads **4× DATA: MARGIN ÷ √4 = ÷ 2**. Teaser: NEXT: HYPOTHESIS TESTING · IS IT REAL? (a coin). End card: NEXT: HYPOTHESIS TESTING, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips A range · Average ± margin · 95 of 100 · More data. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:10.50)
- `0:00.45` A food app says its average delivery time is 32 minutes.
- `0:04.31` But it only checked 100 orders. How sure can it be?
- `0:07.59` A confidence interval answers that.

**S2 · The definition** (0:10.50–0:28.92)
- `0:10.95` Here's the definition, in simple words.
- `0:13.55` A confidence interval is a range of values that likely contains the true average.
- `0:18.77` Instead of one number, you give a range: 30 to 34 minutes.
- `0:22.76` And a confidence level, like 95%, tells you how reliable that range is.

**S3 · Why a range** (0:28.92–0:41.19)
- `0:29.37` Why a range? Because every sample gives a slightly different average.
- `0:33.48` Check another 100 orders, and you might get 31, or 33.5.
- `0:38.14` One number alone hides that wobble.

**S4 · Building the range** (0:41.19–1:04.69)
- `0:41.64` The range is the sample average, plus or minus a margin of error.
- `0:45.94` First, the standard error: the spread of the data, divided by the square root of the sample size.
- `0:51.87` Here, the spread is 10 minutes, and the square root of 100 is 10. So the standard error is 1 minute.
- `0:58.11` For 95%, go about two standard errors each way: 32, plus or minus 2.

**S5 · What 95% means** (1:04.69–1:21.74)
- `1:05.14` Now the tricky part: what does 95% really mean?
- `1:08.95` It does not mean a 95% chance that the true average is in this one range.
- `1:14.20` It means: repeat the survey many times, and about 95 out of 100 ranges will catch the true average.

**S6 · Sample size** (1:21.75–1:39.00)
- `1:22.19` Want a narrower range? Collect more data.
- `1:24.93` Four times the orders, 400, cuts the margin in half: 32, plus or minus 1.
- `1:30.79` And with only 25 orders, we use the t-distribution, so the range gets wider: about 28 to 36.

**S7 · Remember** (1:39.00–1:49.99)
- `1:39.45` So remember: a confidence interval is a range that likely contains the true value.
- `1:45.04` Average, plus or minus a margin. More data, narrower range.

**S8 · Quiz, teaser and CTA** (1:49.99–2:17.61)
- `1:50.34` Quick quiz!
- `1:51.37` A survey of 100 people has a margin of error of 4 points.
- `1:55.42` If you survey 400 people instead, what's the new margin?
- `2:04.49` 2 points!
- `2:05.59` Four times the data halves the margin, because the square root of four is two.
- `2:10.07` Next: how do we decide if something is real? Hypothesis testing.
- `2:14.34` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Definition:** a 95% confidence interval for a mean is x̄ ± 1.96 · SE, with SE = s/√n (large sample).
  - The confidence level is a property of the *method*: across repeated samples, about 95% of such intervals contain the true mean μ.
  - For one computed interval, μ is either in it or not, so "a 95% chance that μ is in this range" is the classic misreading. The narration says exactly this.
- **Scene 4:** spread (SD) 10 minutes and n = 100, so SE = 10/√100 = **1 minute**.
  - The 95% margin is 1.96 × 1 = 1.96 ≈ **2**, giving 30.04 to 33.96 ≈ **30 to 34**. "About two standard errors" is the usual rounding of 1.96.
- **Scene 3:** the other sample averages, 31 and 33.5, are illustrative. Both lie well within ±2 SE of 32, which is what repeated samples of 100 would give.
- **Scene 5:** 20 surveys are simulated (`components/CI.tsx`, seed 3). Each takes 100 orders from N(32, 10²) and its range is m ± 1.96 · s/√n, using that survey's own SD.
  - Exactly 1 of 20 misses: survey 10, at 34.62 ± 1.89, which ends at 32.73.
  - 19/20 = 95% matches the long-run rate. A different seed could give 0, 1, 2 or more misses.
- **Scene 6:**
  - n = 400: SE = 10/20 = 0.5, so the margin is 0.98 ≈ **1** (31.02 to 32.98 ≈ 31 to 33). Four times the data halves the margin because the margin ∝ 1/√n.
  - n = 25: SE = 10/5 = 2. With an estimated spread and df = 24, the 95% t value is **2.064** (not 1.96), so the margin is 4.13 and the range 27.87 to 36.13, "about **28 to 36**".
- **Quiz:** the margin ∝ 1/√n. Going from 100 to 400 multiplies n by 4, so the margin divides by √4 = 2: ±4 → **±2 points**.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a pop on the food-app card and on "100", a glitch on "how sure", and the whoosh, impact and chime on "confidence interval".
- Definition: calm "flow", with a blip per line and a glide as the 30-to-34 range draws.
- Why a range and building it: marimba "play", with pops on the wobble averages, a tick run as the dots gather, a ding on "1 minute" and a glide into "plus or minus 2".
- What 95% means and sample size: groove, with a glitch on "does not mean", a tick per range as the 20 ranges stack, glides as each new range appears and a ding on "half".
- Recap: build, with a crash on entry and step tones per line.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `which-distribution/` (`REF=which-distribution bash .claude/skills/data-science-explainer/new-video.sh confidence-intervals ConfidenceIntervals Confidence_Intervals`). It reuses `components/TDist.tsx` from `t-distribution/` and adds `src/components/CI.tsx`: `TRUE_MEAN`, the number line (`Line`, `lx`, `Axis`), `Interval` and the 20 simulated `SURVEYS`.
