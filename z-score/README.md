# Z-Scores Explained in 2 Minutes

The tenth **Data Science Made Simple** Reel for **@curious_datascientist**: 121 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It follows straight on from the normal distribution Reel and covers:
- what a z-score is: how far a value is from the mean, measured in standard deviations;
- the formula z = (value − mean) ÷ SD;
- two worked examples (Maths 80 with mean 75 / SD 10 → z = 0.5; Science 70 with mean 60 / SD 5 → z = 2), and why the 70 is the stronger result;
- how to read one: the sign is the side, zero is average, the size is how unusual;
- where it's used: the 95% / ±2 link to the bell curve, |z| > 3 as an outlier flag, and putting features on one scale in machine learning;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`):
- the deep-navy look and four-accent colour code;
- Sora, Inter and JetBrains Mono;
- Kokoro `af_heart` at 1.05×;
- word-synced subtitles;
- the 112 BPM F-major synthesized score and SFX kit;
- the same mix and master;
- the quiz + "Follow for data science made simple!" ending, with @curious_datascientist on the end card and the cover, and a NEXT: PROBABILITY DISTRIBUTIONS chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Z_Score_Explained.mp4` | the finished Reel |
| `Z_Score_Explained_Cover.png` | 1080×1920 cover: WHAT IS A Z-SCORE? · explained in 2 minutes, Maths 80 (z = 0.5) and Science 70 (z = 2, crowned) on one z-axis, @curious_datascientist |
| `Z_Score_Explained.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The z-score, positive side | green |
| Maths, the mean, negative side | cyan |
| Science, the SD | violet |
| Outliers, "rare" | orange |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:11 | **Hook** | Report cards **MATHS 80/100** and **SCIENCE 70/100** pop in. WHICH IS BETTER? Maths glows ("LOOKS BETTER…"), then flips: Science gets a crown and an **ACTUALLY BETTER!** stamp. The cards shrink with "z = ?" chips and **Z-SCORE** slams in. |
| 2 | 0:11–0:18 | **What it is** | HOW FAR FROM THE MEAN? A number line with MEAN and VALUE and a dashed HOW FAR? gap. IN MARKS? gets struck out. IN STANDARD DEVIATIONS: two SD blocks hop from the mean to the value, and the value reads **z = 2**. |
| 3 | 0:18–0:25 | **The formula** | **z = (value − mean) ÷ SD** assembles over dashed slots on the spoken words. A 3-step tracker (TAKE THE VALUE → SUBTRACT THE MEAN → DIVIDE BY THE SD) ticks green. |
| 4 | 0:25–0:39 | **Maths** | A cyan bell (mean 75, SD 10) with MEAN 75 / SD 10 chips and YOU: 80 marker. A **+5** arrow, then a **1 SD = 10** bracket. The equation (80 − 75) ÷ 10 = 0.5 builds and the **z = 0.5** pill appears: JUST HALF AN SD ABOVE. |
| 5 | 0:39–0:54 | **Science** | A violet bell (mean 60, SD 5) with YOU: 70, a **+10** arrow and **1 SD / 2 SD** brackets. (70 − 60) ÷ 5 = 2, **z = 2**: TWO WHOLE SDs ABOVE. Then COMPARED FAIRLY: both scores on one standard z-axis (Maths 0.5, Science 2 with a crown) and **SCIENCE IS THE STRONGER RESULT**. |
| 6 | 0:54–1:05 | **Reading a z-score** | SIGN = SIDE. On a z-axis the right half fills green (+ ABOVE THE MEAN) and the left half cyan (− BELOW THE MEAN). A live z readout follows a dot from +1.5 to −1.5, then 0 (EXACTLY AVERAGE). SIZE = HOW UNUSUAL: the dot steps to 1, 2, 3 with COMMON → UNUSUAL → RARE! and a meter fills. |
| 7 | 1:05–1:20 | **Where it's used** | **95% BETWEEN −2 AND 2** (bands and bracket on the standard bell). **BEYOND ±3: OUTLIER FLAG** (orange tails, FLAG labels). IN MACHINE LEARNING: on one raw ruler (0 to ₹2,00,000) the age dots are ALL SQUASHED AT 0 while salaries spread out ("RAW: SALARY DROWNS OUT AGE"). Both rows then slide onto a −2 … +2 z-scale: AS Z-SCORES: ONE SCALE, FAIR TO COMPARE. |
| 8 | 1:20–1:34 | **The complete picture** | A Z-SCORE pill and three cards. **DISTANCE IN SDs** (z = (value − mean) ÷ SD, mini SD hops). **SIGN = SIDE** (size = how unusual, −/+ halves). **COMPARE · SPOT OUTLIERS** (different scales, one yardstick). |
| 9 | 1:34–2:01 | **Quiz + CTA** | QUICK QUIZ. A HEIGHTS (cm) bell with MEAN 165 and SD 7 and a yellow marker at 151. "The z-score of **151 cm?**" Options +2 / −2 / −14 / 0.5 with the 5-second countdown. **z = −2**: confetti and strikes ("wrong side", "still in cm", "that's Maths"). A **−14** arrow and 1 SD / 2 SD brackets back to the mean, then BELOW THE MEAN = NEGATIVE. End card: NEXT: PROBABILITY DISTRIBUTIONS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips In SDs · Sign = side · Fair compare · Outliers. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:11.10)
- `0:00.45` You scored 80 in Maths, and 70 in Science.
- `0:03.43` Which is the better result?
- `0:05.26` Maths looks better, right? Actually, it's Science!
- `0:08.33` To see why, you need a z-score.

**S2 · What it is** (0:11.10–0:17.96)
- `0:11.54` A z-score tells you how far a value is from the mean.
- `0:14.80` Not in marks, but in standard deviations.

**S3 · The formula** (0:17.96–0:25.27)
- `0:18.41` The formula is simple.
- `0:19.98` Take the value, and subtract the mean.
- `0:22.30` Then divide by the standard deviation.

**S4 · Maths** (0:25.27–0:38.95)
- `0:25.72` In Maths, the class mean was 75, and the standard deviation was 10.
- `0:30.57` 80 minus 75 is 5.
- `0:32.69` Divided by 10, that's 0.5.
- `0:35.71` Just half a standard deviation above the mean.

**S5 · Science** (0:38.95–0:53.92)
- `0:39.40` In Science, the mean was 60, and the standard deviation was 5.
- `0:43.54` 70 minus 60 is 10.
- `0:45.48` Divided by 5, that's 2!
- `0:47.40` Two whole standard deviations above the mean.
- `0:50.21` Compared fairly, Science is the stronger result.

**S6 · Reading a z-score** (0:53.92–1:04.72)
- `0:54.37` The sign tells you the side.
- `0:56.04` Positive is above the mean. Negative is below.
- `0:59.29` Zero is exactly average.
- `1:01.31` And the bigger the size, the more unusual the value.

**S7 · Where it's used** (1:04.72–1:20.48)
- `1:05.17` For normal data, about 95% of z-scores fall between -2 and 2.
- `1:10.27` Beyond 3, either way, is a common outlier flag.
- `1:13.73` And in machine learning, features like age and salary are turned into z-scores, so they share one scale.

**S8 · The complete picture** (1:20.48–1:34.15)
- `1:20.92` Here's the complete picture.
- `1:22.57` A z-score is the distance from the mean, in standard deviations.
- `1:26.57` The sign shows the side. The size shows how unusual.
- `1:29.98` Use it to compare different scales, and to spot outliers.

**S9 · Quiz and call to action** (1:34.15–2:00.67)
- `1:34.50` Quick quiz!
- `1:35.53` Heights have a mean of 165 centimetres, and a standard deviation of 7.
- `1:40.55` What's the z-score of someone 151 centimetres tall?
- `1:49.36` Minus 2!
- `1:50.58` 151 is 14 below the mean. 14 divided by 7 is 2, and below means negative.
- `1:57.41` Follow for data science made simple!

*(Between "What's the z-score of someone 151 centimetres tall?" and "Minus 2!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Formula:** z = (x − mean) ÷ SD.
- **Maths:** (80 − 75) ÷ 10 = **0.5**.
- **Science:** (70 − 60) ÷ 5 = **2**.
- **Why 70 in Science is the stronger result:** if the marks are roughly normal, z = 0.5 is about the 69th percentile, but z = 2 is about the 98th (97.7%). Relative to each class, the Science mark beat far more classmates.
- **95% between −2 and 2:** for a normal distribution, 95.45% of values lie within ±2 SD. "About 95%" is the usual empirical rule (see the normal distribution Reel).
- **Beyond ±3:** |z| > 3 covers 0.27% of normal data. It's a common rule-of-thumb outlier flag; skewed data needs care (the IQR method is more robust).
- **Machine learning example:** five people, ages 22, 30, 38, 47, 60 years and salaries ₹25,000, ₹50,000, ₹80,000, ₹1,20,000, ₹1,80,000 per month.
  - On one raw ruler (0 to 2,00,000) every age sits within 60 of zero, so the age dots pile up at the left while salaries spread across.
  - z-scores (population SD):
    - ages: mean 39.4, SD 13.23, giving z = −1.32, −0.71, −0.11, 0.57, 1.56;
    - salaries: mean ₹91,000, SD ₹54,626, giving z = −1.21, −0.75, −0.20, 0.53, 1.63.

    Both now span about −1.3 to +1.6. That's what "standardisation" (StandardScaler) does before distance-based or gradient-based models.
- **Quiz:** (151 − 165) ÷ 7 = −14 ÷ 7 = **−2**.
  - The distractors: +2 (wrong sign, 151 is below the mean), −14 (the difference in cm, not yet divided by the SD), 0.5 (the Maths answer).
- **Heights** reuse the normal distribution Reel's example (mean 165 cm, SD 7 cm).

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a falling lead on the "Actually" twist, a stamp on "Science!", and the riser, impact and crash on "z-score".
- What it is and the formula: calm "flow", with hops as the SD blocks jump and step tones for the three formula steps.
- Worked examples: groove, with pops, glide, hops and a ding plus bell arpeggio on each z result, then a rising lead and ta-da when Science wins.
- Reading: marimba "play", with rising blips as the dot moves out.
- Uses: groove, with a stamp on "outlier flag" and a glide as the features slide onto the z-scale.
- Overview: build.
- Quiz: suspense countdown, then the finale.

SFX land 6–12 frames before the words they illustrate. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

This project was scaffolded from `normal-distribution/` (`REF=normal-distribution bash .claude/skills/data-science-explainer/new-video.sh z-score ZScore Z_Score_Explained`). It adds shared components that later videos inherit:
- `src/components/Quiz.tsx`: badge, question, countdown ring, options, reveal.
- `src/components/Cta.tsx`: end card with a `next` chip and recap `chips`.
- `src/components/Rule.tsx`: SD colours, band rings, `Bracket`, `Span` arrow.

The worked-example stage is `src/scenes/Worked.tsx`.
