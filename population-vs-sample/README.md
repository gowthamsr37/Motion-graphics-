# Population vs Sample Explained in 2 Minutes

The twelfth **Data Science Made Simple** Reel for **@curious_datascientist**: 105 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It explains the idea underneath every poll and survey:
- the population (everyone you want to know about) vs the sample (who you actually measure), with the soup analogy;
- why we sample (too slow, too costly, or impossible; testing every bulb destroys every bulb);
- parameter vs statistic;
- why sample means wobble, and wobble less as the sample grows;
- why a sample must be random (bias);
- why the sample SD divides by n − 1.

The quiz is about a biased sample. Before the CTA, a teaser sets up the Central Limit Theorem.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: CENTRAL LIMIT THEOREM chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Population_vs_Sample.mp4` | the finished Reel |
| `Population_vs_Sample_Cover.png` | 1080×1920 cover: POPULATION vs SAMPLE · explained in 2 minutes, a violet population circle with dots picked into a cyan sample circle, @curious_datascientist |
| `Population_vs_Sample.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Population (everyone) | violet |
| Sample, sample means | cyan |
| The truth (true mean, parameter), "about right", less wobble | green |
| Bias, "too small", big wobble | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:09 | **Hook** | CRORES OF VOTERS: a crowd of 1,368 dots ripples in. "ask just a few thousand": 44 scattered dots light up cyan. The crowd dims (not everyone) and the lit dots gather into a glowing circle: **A SAMPLE**. |
| 2 | 0:09–0:19 | **Population vs sample** | A violet circle of 260 dots, **POPULATION** (everyone you want to know about). 26 dots fly into a small cyan circle, **SAMPLE** (who you actually measure). Both shrink to the left as a pot (POT = POPULATION) and a spoon (SPOON = SAMPLE) slide in: ONE SPOONFUL judges THE POT. |
| 3 | 0:19–0:29 | **Why sample** | WHY NOT MEASURE EVERYONE? Dashed slots fill: TOO SLOW (clock), TOO COSTLY (₹), IMPOSSIBLE. A row of eight glowing bulbs flickers and burns out one by one, puffing smoke: **NOTHING LEFT TO SELL!** |
| 4 | 0:29–0:36 | **Parameter vs statistic** | AVERAGE HEIGHT. The population circle's **TRUE MEAN = ?** (PARAMETER, the truth, usually hidden) next to the sample circle's **SAMPLE MEAN 165.8 cm** (STATISTIC, computed from the sample), with a BEST GUESS arrow between them. |
| 5 | 0:36–0:47 | **Samples wobble** | A dashed green TRUE MEAN 165 line across two height axes. Six samples of 5 land their means all over the place (162.8 … 171.4): **BIG WOBBLE**. Six samples of 50 cluster tightly (164.9 … 166.2): **LESS WOBBLE**, then BIGGER SAMPLE = BETTER GUESS. |
| 6 | 0:47–0:55 | **Bias** | IT MUST BE RANDOM. A RANDOM panel picks dots from everywhere (✓ FAIR ANSWER). A GYM ONLY panel picks everyone from one corner (✗ WAY OFF) and is stamped **BIAS!**, then RANDOM = EVERYONE HAS THE SAME CHANCE. |
| 7 | 0:55–1:05 | **n − 1** | ONE MORE DETAIL · SAMPLE SD. Ten heights drop onto an axis. Cards: **÷ n → SD = 6.7 cm** (struck out) vs **÷ (n − 1) → SD = 7.1 cm**. Bars against a dashed TRUE SD 7 line: ÷ n is TOO SMALL, ÷ (n − 1) is ABOUT RIGHT. |
| 8 | 1:05–1:19 | **The complete picture** | SAMPLING pill and three cards. **POPULATION vs SAMPLE** (everyone · who you measure); **SAMPLE MEAN = GUESS** (steadier as the sample grows); **RANDOM · n − 1** (no bias · a fair spread). |
| 9 | 1:19–1:45 | **Quiz, teaser and CTA** | QUICK QUIZ. A line of COLLEGE STUDENTS, then three tall orange BASKETBALL TEAM players. "What's the **PROBLEM?**" Options Too random / Biased sample / Use n − 1 / No problem with the 5-second countdown. **BIASED!**: the players glow, then TALLER GROUP = AVERAGE TOO HIGH. Teaser: NEXT · WHAT SHAPE DO SAMPLE MEANS MAKE? (a histogram grows, "?"). End card: NEXT: CENTRAL LIMIT THEOREM, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Population · Sample · Random · n − 1. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:08.85)
- `0:00.45` How can a poll predict crores of voters, by asking just a few thousand people?
- `0:05.26` It doesn't ask everyone.
- `0:06.78` It asks a sample.

**S2 · Population vs sample** (0:08.85–0:19.40)
- `0:09.30` The population is everyone you want to know about.
- `0:12.40` The sample is the smaller group you actually measure.
- `0:15.54` Like tasting one spoonful to judge a whole pot of soup.

**S3 · Why sample** (0:19.40–0:29.04)
- `0:19.85` Why not measure everyone?
- `0:21.45` It's often too slow, too costly, or impossible.
- `0:24.68` To test how long every bulb lasts, you'd burn out every bulb!

**S4 · Parameter vs statistic** (0:29.04–0:36.33)
- `0:29.49` The population has a true mean, called a parameter.
- `0:32.56` The sample mean, a statistic, is our best guess of it.

**S5 · Samples wobble** (0:36.33–0:46.67)
- `0:36.78` But take another sample, and you get a slightly different mean.
- `0:40.24` Every sample wobbles around the truth.
- `0:42.67` Bigger samples wobble less, so they give better guesses.

**S6 · Bias** (0:46.67–0:55.44)
- `0:47.12` And a sample must be random.
- `0:48.86` Survey only people at a gym about exercise, and your answer is way off.
- `0:53.48` That's called bias.

**S7 · n minus 1** (0:55.44–1:05.27)
- `0:55.89` One more detail.
- `0:57.20` For a sample's standard deviation, divide by n - 1, not n.
- `1:01.69` It stops the sample from underestimating the spread.

**S8 · The complete picture** (1:05.27–1:19.24)
- `1:05.72` Here's the complete picture.
- `1:07.36` The population is everyone. The sample is who you measure.
- `1:10.89` The sample mean estimates the truth, and gets steadier as the sample grows.
- `1:15.43` Keep it random, and use n - 1 for the spread.

**S9 · Quiz, teaser and CTA** (1:19.24–1:45.15)
- `1:19.59` Quick quiz!
- `1:20.61` To find the average height of students in a college, you measure only the basketball team.
- `1:25.61` What's the problem?
- `1:32.28` It's biased!
- `1:33.39` Basketball players are taller than most students, so the average comes out too high.
- `1:38.25` Next, we'll see the surprising shape that sample means make.
- `1:41.88` Follow for data science made simple!

*(Between "What's the problem?" and "It's biased!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Polls:** national polls typically interview a few thousand people. With random sampling, a sample of about 1,000–2,000 already gives a margin of error of a few percentage points. That depends on the sample size, not the population size. Precision is about randomness and size; the hook makes no other numeric claim.
- **Bulb testing:** lifetime testing is destructive, the classic example of why a sample is necessary.
- **Parameter vs statistic:** the population mean is a parameter (fixed, usually unknown); a sample mean is a statistic (computed from data) used to estimate it. The sample mean shown (165.8 cm) is the mean of the first simulated sample of 50 below.
- **Wobble demo:** samples drawn in code from Normal(165, 7) heights (seeded, `src/components/Sampling.tsx`).
  - Six samples of 5 have means 162.8, 171.4, 163.6, 165.3, 167.6, 166.7.
  - Six samples of 50 have means 165.8, 166.2, 165.3, 164.9, 165.8, 165.3.
  - The theoretical spread of the mean is 7 ÷ √5 ≈ 3.1 cm vs 7 ÷ √50 ≈ 1.0 cm. That's the "standard error" covered in the Central Limit Theorem Reel.
- **Bias:** surveying only gym-goers about exercise over-represents people who exercise, a selection bias. A simple random sample gives every member the same chance of selection.
- **n − 1 (Bessel's correction):** the sample of 10 heights is 155, 157, 160, 161, 164, 165, 168, 170, 173, 177.
  - Mean 165; sum of squared deviations 448.
  - ÷ 10 gives a variance of 44.8, so SD 6.69. ÷ 9 gives 49.8, so SD 7.06. The true SD is 7.
  - Dividing by n underestimates the population variance on average, because deviations are measured from the sample's own mean. Dividing by n − 1 makes the variance unbiased. (The SD is still very slightly biased, but much closer.)
- **Quiz:** basketball players are selected for height, so measuring only the team over-estimates students' average height. That's a biased (non-random, unrepresentative) sample.
  - The distractors: "Too random" (it isn't random at all), "Use n − 1" (about the spread, unrelated), "No problem".

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, rising blips as the sample lights up, and the riser, impact and crash on "sample".
- Population vs sample and why sample: calm "flow", with a glide as the dots fly, a clink on the spoon, step tones for the three reasons, flickers as the bulbs burn out and a stamp on "nothing left".
- Parameter and wobble: groove, with a lead on "best guess", hops as each sample mean lands, and a bell arpeggio on "less".
- Bias and n − 1: groove, with an impact and stamp on "bias".
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

Scaffolded from `probability-distribution/` (`REF=probability-distribution bash .claude/skills/data-science-explainer/new-video.sh population-vs-sample PopulationVsSample Population_vs_Sample`). It adds `src/components/Sampling.tsx`: seeded `normals`, `meanOf`, `discPoints`, `pick`, `PotGlyph`, `SpoonGlyph` and `BulbGlyph`.
