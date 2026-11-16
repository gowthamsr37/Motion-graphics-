# The Central Limit Theorem Explained in 2 Minutes

The thirteenth **Data Science Made Simple** Reel for **@curious_datascientist**: 111 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It completes the run that started with the normal distribution Reel (normal → z-scores → probability distributions → population vs sample → CLT). It covers:
- the averages of dice (flat for one dice) piling up into a bell;
- what the theorem says;
- the bell building from 1, 2, 5 and 30 dice;
- the same thing for skewed bus waiting times;
- the two rules: the bell is centred on the true mean, and its spread is SD ÷ √n (the standard error);
- why it matters (polls, science);
- the rule of thumb of 30.

The quiz is a standard-error calculation. The teaser for future distribution videos echoes the normal distribution Reel's promise.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: MORE DISTRIBUTIONS chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Central_Limit_Theorem.mp4` | the finished Reel |
| `Central_Limit_Theorem_Cover.png` | 1080×1920 cover: THE CENTRAL LIMIT THEOREM · explained in 2 minutes, one dice's flat bars → the narrow bell of averages of 30, @curious_datascientist |
| `Central_Limit_Theorem.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Raw data (single dice, the samples) | cyan |
| Sample means, the CLT bell | green |
| Spread, the standard error | violet |
| Skewed source data (waiting times) | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:13 | **Hook** | A dice tumbles and lands; six equal bars rise: ONE DICE: FLAT. Ten dice roll again and again, with a live "average = 3.4" and a SAMPLE n OF 90 counter. Each average drops a green dot into a histogram on a 1–6 axis, and the dots pile into a hump. A white bell traces over them: **A BELL!**, then **THE CENTRAL LIMIT THEOREM**. |
| 2 | 0:13–0:24 | **What it says** | Three step cards fill on their words: 1 MANY SAMPLES (three sample circles), 2 THE MEAN OF EACH (3.4 · 3.7 · 3.2), 3 PLOT THE MEANS (a green bell), then "= a NORMAL distribution". Then flat, skewed and two-humped shapes → arrow → a bell: ANY SHAPE IN · A BELL OUT. |
| 3 | 0:24–0:35 | **Watch it build** | AVERAGE OF n DICE: four panels on the same 1–6 axis fill in on their words. **1 DICE** flat; **2 DICE** a triangle, PEAK AT 3.5; **5 DICE** ROUNDER; **30 DICE** A CLEAN BELL (narrow, centred on 3.5). Then MORE DICE = MORE BELL-SHAPED. |
| 4 | 0:35–0:45 | **Any shape** | SKEWED DATA TOO? WAITING TIMES (bus) as orange exponential bars from 0–20 min with a LONG TAIL. AVERAGES OF 30 on the same axis is a narrow green bell centred on 5 min (dashed mean line through both): **A BELL AGAIN!** |
| 5 | 0:45–0:56 | **Two rules** | A green bell with a dashed **TRUE MEAN** line. An n chip ticks 4 → 16 → 36 as the bell narrows (earlier bells left as dashed ghosts): NARROWER. **SPREAD = SD ÷ √n** with a ±1 spread bracket under the axis, then **THE STANDARD ERROR** pill. |
| 6 | 0:56–1:06 | **Why it matters** | WHY THE BELL IS EVERYWHERE: a big bell, "so much of what we measure is an average". Cards: **POLLS** (a 48% bar with ± whiskers, 48% ± 3%) and **SCIENCE** ("is the result real?", magnifier + ✓). |
| 7 | 1:06–1:12 | **How big is big enough?** | A live n = 1 … 30 counter while the distribution of the average of n waiting times morphs from an orange decay into a green bell. **RULE OF THUMB: 30**, then VERY SKEWED? NEED MORE. |
| 8 | 1:12–1:24 | **The complete picture** | CENTRAL LIMIT THEOREM pill and three cards. **MANY SAMPLES · MEANS** (average each sample); **A BELL, ANY SHAPE IN** (centred on the true mean); **BIGGER n = NARROWER** (spread = the standard error). |
| 9 | 1:24–1:51 | **Quiz, teaser and CTA** | QUICK QUIZ. A HEIGHTS bell with SD 7 cm and n = 49 chips. "Spread of the **AVERAGES?**" Options 7 cm / 1 cm / 49 cm / 0.14 cm with the 5-second countdown. **1 cm**: confetti and strikes ("one person", "too big", "not ÷ 49"). A narrow green bell (AVERAGES OF 49) rises inside the wide one: **7 ÷ √49 = 7 ÷ 7 = 1**. Teaser: IN FUTURE VIDEOS · MORE DISTRIBUTIONS with four mystery shapes. End card: NEXT: MORE DISTRIBUTIONS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Sample means · Bell shape · Std error · n = 30. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:13.20)
- `0:00.45` Roll one dice, and every number is equally likely. The shape is flat.
- `0:05.07` Now roll ten dice and take their average. Again, and again.
- `0:08.90` The averages make a bell!
- `0:10.66` That's the Central Limit Theorem.

**S2 · What it says** (0:13.20–0:23.62)
- `0:13.65` Take many samples, and find the mean of each one.
- `0:16.62` Plot those means, and they form a normal distribution.
- `0:20.09` Even when the original data isn't normal at all.

**S3 · Watch it build** (0:23.62–0:35.40)
- `0:24.07` One dice is flat.
- `0:25.50` The average of two dice? A triangle, peaking at 3.5.
- `0:29.64` Five dice? Rounder.
- `0:31.36` Thirty dice? A clean bell, centred on 3.5.

**S4 · Any shape** (0:35.40–0:45.10)
- `0:35.85` It works for skewed data too.
- `0:37.63` Waiting times at a bus stop have a long tail to the right.
- `0:41.13` But the averages of thirty waiting times? A bell again.

**S5 · Two rules** (0:45.10–0:56.38)
- `0:45.55` The bell is centred on the true mean.
- `0:47.59` And bigger samples make it narrower.
- `0:49.69` Its spread is the standard deviation, divided by the square root of n.
- `0:54.04` That's called the standard error.

**S6 · Why it matters** (0:56.38–1:06.00)
- `0:56.83` That's why the normal distribution shows up everywhere.
- `1:00.05` It's how polls get their margin of error, and how scientists test if a result is real.

**S7 · How big is big enough** (1:06.00–1:12.37)
- `1:06.45` How big is big enough? A common rule of thumb is 30.
- `1:09.79` Very skewed data may need more.

**S8 · The complete picture** (1:12.37–1:23.70)
- `1:12.82` Here's the complete picture.
- `1:14.46` Take many samples, and plot their means.
- `1:16.90` They form a bell around the true mean, whatever the original shape.
- `1:20.60` And bigger samples make that bell narrower.

**S9 · Quiz, teaser and CTA** (1:23.70–1:51.34)
- `1:24.05` Quick quiz!
- `1:25.08` Heights have a standard deviation of 7 centimetres. You average samples of 49 people.
- `1:30.84` What's the spread of those averages?
- `1:38.25` 1 centimetre!
- `1:39.55` 7, divided by the square root of 49, which is 7, gives 1.
- `1:44.30` In future videos, we'll explore other kinds of distributions.
- `1:48.07` Follow for data science made simple!

*(Between "What's the spread of those averages?" and "1 centimetre!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **One fair dice:** uniform on 1–6, mean 3.5, SD √(35/12) = 1.708.
- **Hook simulation:** 90 samples of 10 dice, seeded (`rng(233)` in `S1Hook.tsx`).
  - Their averages have mean 3.49 and SD 0.51 and range from 2.5 to 4.6.
  - Theory says mean 3.5 and SD 1.708 ÷ √10 = 0.54.
  - The overlaid bell is Normal(3.5, 0.54) scaled to the dot count.
- **Watch it build:** exact distributions of the average of n dice, by repeated convolution (`diceSumDist` in `src/components/Clt.tsx`).
  - The average of two dice is a triangle peaking at 3.5 (a sum of 7).
  - 30 dice give spread 1.708 ÷ √30 = 0.31.
- **Waiting times:** exponential with mean 5 min, shown in 1-minute bins (P = e^(−a/5) − e^(−(a+1)/5)).
  - The average of 30 independent waits follows a Gamma distribution (shape 30, scale 5/30), drawn exactly: mean 5 min, spread 5 ÷ √30 = 0.91 min.
  - It's very close to a bell (it keeps a slight right skew, about 0.37).
- **Two rules:** for independent samples, the mean of the sample means equals the population mean, and their SD is σ ÷ √n (the standard error). n = 4, 16, 36 give σ/2, σ/4, σ/6.
- **Polls:** 48% ± 3% is illustrative. A random sample of about 1,000 gives a 95% margin of error of about ±3.1 points (1.96 × √(0.25/1000)).
- **Rule of thumb:** n ≥ 30 is the common textbook guideline; strongly skewed or heavy-tailed data can need more.
- **Quiz:** σ = 7 cm, n = 49. Standard error = 7 ÷ √49 = 7 ÷ 7 = **1 cm**.
  - The distractors: 7 cm (the spread of single heights), 49 cm (nonsense), 0.14 cm (dividing by n instead of √n: 7 ÷ 49).

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro ticks, a clink as the dice lands, a tick stream as the averages drop, and the riser, impact and crash on "a bell".
- What it says: calm "flow", with step tones for the three steps.
- Dice build and any shape: marimba "play", with a bell arpeggio on the 30-dice bell and a rising lead on "a bell again".
- Two rules: "flow", with a lead on "standard error".
- Why it matters and how big: groove, with a tick count-up as n climbs.
- Overview: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–12 frames before their words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `population-vs-sample/` (`REF=population-vs-sample bash .claude/skills/data-science-explainer/new-video.sh central-limit-theorem CentralLimitTheorem Central_Limit_Theorem`). It adds `src/components/Clt.tsx`: `diceSumDist`, `meanOfExpPdf`, `AreaChart`, `BarChart` and `Radical`.
