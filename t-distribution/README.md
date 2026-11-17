# The t-Distribution Explained in 2 Minutes

The twenty-second **Data Science Made Simple** Reel for **@curious_datascientist**: Student's t, the bell with fatter tails for small samples. 1:55, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Part of the "explain it very well" batch:
- the Guinness story as the hook;
- a plain-words definition card;
- why the tails are fatter (with few values the guessed spread wobbles);
- degrees of freedom (n − 1);
- how the shape slims to the normal as df grows;
- why it matters (wider, honest 95% ranges);
- a recap;
- a quiz.

It sets up the confidence-interval Reels that come next.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: CHI-SQUARE DISTRIBUTION chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `T_Distribution.mp4` | the finished Reel |
| `T_Distribution_Cover.png` | 1080×1920 cover: THE t-DISTRIBUTION · explained in 2 minutes, "SMALL SAMPLE? FATTER TAILS." over a fat-tailed t-curve and the dashed normal, @curious_datascientist |
| `T_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The t-curve | violet |
| The normal curve (dashed) | cyan |
| The tails | orange |
| Sample values, the 95% range | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:13 | **Hook** | **1908 · GUINNESS BREWERY**: four barrels (BATCH 1–4) · ONLY A **FEW SAMPLES**. A normal curve draws: **✗ NORMAL CURVE: TOO CONFIDENT**. A fat-tailed t-curve traces over it (the normal turns dashed) → **THE t-DISTRIBUTION** with a burst. |
| 2 | 0:13–0:28 | **The definition** | IN SIMPLE WORDS: 1 looks like **THE NORMAL BELL**; 2 but with **FATTER TAILS**; 3 for **SMALL SAMPLES**. Then **SMALLER SAMPLE → FATTER TAILS**. |
| 3 | 0:28–0:42 | **Why fatter tails** | FEW VALUES: **SHAKY SPREAD**. Three samples of 5 values from the same population; their ±1 SD brackets land on the words: SPREAD: SMALL, BIG, MEDIUM. A t-curve over the dashed normal, tails beyond ±2 orange: **FAT TAILS = ROOM FOR SURPRISES**. |
| 4 | 0:42–0:53 | **Degrees of freedom** | **DEGREES OF FREEDOM (df)** · **df = n − 1** (n = the sample size) · five sample dots · **5 − 1 = 4** · 4 DEGREES OF FREEDOM. |
| 5 | 0:53–1:03 | **The shape** | The t-curve against the dashed normal, with the df label morphing: **df = 4** (orange tails beyond ±2.5, FAT TAILS) → **df = 10** (SLIMMER) → **df = 30** (ALMOST EXACTLY NORMAL). |
| 6 | 1:03–1:19 | **Why it matters** | THE **MIDDLE 95%**: on the normal curve the green band spans **±1.96**; on the t-curve with 5 values (df = 4) it spans **±2.78**. **SMALL SAMPLE: WIDER, MORE HONEST RANGE**. |
| 7 | 1:19–1:28 | **Remember** | THE t-DISTRIBUTION pill and a recap flow: **A BELL WITH FATTER TAILS** ↓ **FOR SMALL SAMPLES** ↓ **BIGGER SAMPLE: NEAR NORMAL**. |
| 8 | 1:28–1:55 | **Quiz, teaser and CTA** | QUICK QUIZ. A t-curve over the dashed normal; SAMPLE SIZE n counts up from 3 to 41 and the curve slims onto the normal. "As the sample grows, t becomes... **WHICH CURVE?**" Options UNIFORM / NORMAL / POISSON / EXPONENTIAL with the 5-second countdown. **THE NORMAL**: confetti and strikes ("not flat", "counts", "one-sided"); **MORE DATA, SLIMMER TAILS: NORMAL**. Teaser: NEXT: IS THIS DICE FAIR? · CHI-SQUARE. End card: NEXT: CHI-SQUARE DISTRIBUTION, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Bell, fatter tails · Small samples · df = n − 1 · Big n: normal. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "1908" is spoken as *nineteen oh eight*.

**S1 · Hook** (0:00.00–0:12.82)
- `0:00.45` In 1908, a brewer at Guinness had a problem: he could only test a few batches at a time.
- `0:06.20` With so little data, the normal curve made him too confident.
- `0:09.96` His fix is the t-distribution.

**S2 · The definition** (0:12.82–0:28.37)
- `0:13.27` Here's the definition, in simple words.
- `0:15.88` The t-distribution looks like the normal bell curve, but with fatter tails.
- `0:20.22` We use it when the sample is small, and we have to guess the spread from the data itself.
- `0:25.05` The smaller the sample, the fatter the tails.

**S3 · Why fatter tails** (0:28.37–0:42.14)
- `0:28.82` Why fatter tails? Because with only a few values, our guess of the spread is shaky.
- `0:33.72` Take five values, and the spread can look small one time, and big the next.
- `0:38.34` Fatter tails leave room for that extra uncertainty.

**S4 · Degrees of freedom** (0:42.14–0:52.81)
- `0:42.59` Its exact shape depends on one number: the degrees of freedom.
- `0:46.29` Usually, that's the sample size, minus one. So five values give four degrees of freedom.

**S5 · Shapes** (0:52.81–1:02.80)
- `0:53.26` With four degrees of freedom, the tails are fat.
- `0:56.09` With ten, they slim down.
- `0:57.85` And by about thirty, the t-curve is almost exactly the normal curve.

**S6 · What it changes** (1:02.80–1:19.14)
- `1:03.25` Why does this matter? Think about the middle 95%.
- `1:06.73` On the normal curve, it stretches about two steps from the centre.
- `1:10.53` But with only five values, the t-curve needs about 2.8 steps.
- `1:14.97` So small samples give wider, more honest ranges.

**S7 · Remember** (1:19.14–1:28.40)
- `1:19.59` So remember: the t-distribution is a bell with fatter tails, for small samples.
- `1:24.78` The bigger the sample, the closer it gets to normal.

**S8 · Quiz, teaser and CTA** (1:28.40–1:55.23)
- `1:28.75` Quick quiz!
- `1:29.78` Imagine collecting more and more data.
- `1:32.14` As the sample grows, what does the t-distribution turn into?
- `1:41.24` The normal distribution!
- `1:42.91` With more data, the extra uncertainty fades, and the tails slim down to the normal curve.
- `1:48.45` Next: is this dice fair? The chi-square distribution.
- `1:51.96` Follow for data science made simple!

*(Between "…what does the t-distribution turn into?" and "The normal distribution!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **History:** William Sealy Gosset, a chemist and brewer at Guinness in Dublin, published the distribution in 1908 (*Biometrika*, "The probable error of a mean") under the pen name "Student", hence "Student's t". Guinness wanted small-sample methods for quality control.
- **Definition:** if a sample of n values comes from a normal population, (x̄ − μ)/(s/√n) follows a t-distribution with n − 1 degrees of freedom. Here s is the sample SD (the spread guessed from the data).
  - The t density is symmetric and bell-shaped, with heavier tails than the normal.
  - It tends to the standard normal as df → ∞.
- **Densities** are computed exactly (`components/TDist.tsx`, log-gamma) and checked by numerical integration.
- **Scene 3:** the three 5-value samples are illustrative, with sample SDs of 0.29, 1.40 and 0.75. The hook and scene 3 use df = 2 and 3 to make the fat tails visible.
- **Scene 5:** the peak heights are 0.375 (df 4), 0.389 (df 10) and 0.395 (df 30) vs 0.399 (normal). P(|T| > 2) is 11.6% (df 4), 7.7% (df 9) and 5.5% (df 29) vs 4.6% for the normal.
- **Scene 6:** the two-sided 95% critical values, each checked to cover 95.00% numerically:
  - normal **1.96**;
  - t with df = 4 (5 values) **2.776** ("about 2.8");
  - df = 9: 2.262; df = 29: 2.045.
  - The "steps" are standard errors; that is why a confidence interval from a small sample is wider.
- **"By about 30, almost exactly normal":** a common rule of thumb; at df = 30 the 95% critical value is 2.04 vs 1.96.
- **Quiz:** as df → ∞ the t-distribution converges to the **standard normal**. The quiz animation counts n from 3 to 41 (df 2 → 40).

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, hops on the barrels, a glide as the normal draws, a glitch on "too confident", and the riser, impact and crash on "t-distribution".
- Definition: calm "flow", with a blip per line and a ding on "smaller sample".
- Why and df: marimba "play", with step tones on the spread brackets, a glide to the tails, ticks on the five dots and a ding on "four".
- Shapes and why it matters: groove, with glides as df grows and as the 95% bands fill, and a sparkle on "normal".
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `pareto-distribution/` (`REF=pareto-distribution bash .claude/skills/data-science-explainer/new-video.sh t-distribution TDistribution T_Distribution`). It adds `src/components/TDist.tsx`: `lgamma`, `tpdf`, `npdf` and the 95% cut-offs.

`components/Quiz.tsx` now shrinks long option names (more than 8 or 10 characters) and puts the strike reason on its own backing, so the two never overlap.
