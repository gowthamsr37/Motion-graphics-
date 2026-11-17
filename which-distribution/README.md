# Which Distribution? The Complete Cheat Sheet

The **Data Science Made Simple** cheat sheet for **@curious_datascientist**: every distribution of the series in one Reel. 1:44, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

**Version 2.** The first cheat sheet (5 distributions plus bimodal, never posted) was rebuilt in this folder after the Pareto, log-normal, Bernoulli & geometric, t and chi-square Reels. It now covers twelve shapes in three families:
- **Counts:** Bernoulli, binomial, geometric, Poisson, uniform
- **Measurements:** normal, exponential, log-normal, Pareto
- **Tools for testing:** t, chi-square
- **Bonus:** bimodal

Structure:
- a hook;
- a reminder of what a distribution is;
- the three families;
- one row per distribution (question → name + shape);
- the bonus;
- the full saveable grid;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: CONFIDENCE INTERVALS chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Which_Distribution.mp4` | the finished Reel |
| `Which_Distribution_Cover.png` | 1080×1920 cover: WHICH DISTRIBUTION? · explained in 2 minutes, THE COMPLETE CHEAT SHEET: the twelve shapes in a 3 × 4 grid coloured by family, @curious_datascientist |
| `Which_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Family | Colour |
| --- | --- |
| Counts | cyan |
| Measurements | violet |
| Tools for testing | orange |
| Bonus (bimodal), the full sheet | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:10 | **Hook** | Twelve mini cards (shape + name) pop into a 3 × 4 grid: the six named ones on their words, the rest on "so many". They wobble, then **WHICH DISTRIBUTION?** with a burst → **THE COMPLETE CHEAT SHEET**. |
| 2 | 0:10–0:21 | **A reminder** | IN SIMPLE WORDS: 1 Shows **HOW LIKELY**; 2 each **POSSIBLE VALUE** is; 3 ask: **WHAT AM I MEASURING?** All tick green: ONE QUESTION, ONE SHAPE. |
| 3 | 0:21–0:27 | **Three families** | Three cards land on their words: **COUNTS** (Uniform · Bernoulli · Binomial · Geometric · Poisson), **MEASUREMENTS** (Normal · Exponential · Log-normal · Pareto), **TOOLS FOR TESTING** (t · Chi-square). |
| 4 | 0:27–0:43 | **Family 1: counts** | Five rows; each question lands on its sentence and each name (with its mini shape) on its word: One yes-or-no try? **BERNOULLI** · Successes in a fixed number of tries? **BINOMIAL** · Tries until the first success? **GEOMETRIC** · Events in a stretch of time? **POISSON** · Every outcome equally likely? **UNIFORM**. |
| 5 | 0:43–0:57 | **Family 2: measurements** | Values clustered around an average? **NORMAL** · Waiting time until the next event? **EXPONENTIAL** · Positive values, skewed by growth? **LOG-NORMAL** · A few giants holding most of it? **PARETO**. |
| 6 | 0:57–1:06 | **Family 3: tools for testing** | The average of a small sample? **t-DISTRIBUTION** · Do counts match what you expect? **CHI-SQUARE**. |
| 7 | 1:06–1:12 | **Bonus** | SEE **TWO HUMPS?** A two-humped curve draws, its humps labelled GROUP A and GROUP B: **BIMODAL** · TWO GROUPS MIXED TOGETHER. |
| 8 | 1:12–1:20 | **Remember** | ASK, THEN MATCH THE SHAPE: the full sheet in three columns: COUNTS (5 cards) · MEASUREMENTS (4) · TESTING (t, chi-square, bimodal). **SAVE THIS CHEAT SHEET**. |
| 9 | 1:20–1:44 | **Quiz, teaser and CTA** | QUICK QUIZ. An ON HOLD stopwatch counts up: **HOW LONG EACH CUSTOMER WAITS**. "Which distribution **FITS BEST?**" Options POISSON / EXPONENTIAL / BINOMIAL / NORMAL with the 5-second countdown. **EXPONENTIAL**: confetti and strikes ("counts calls", "no tries", "skewed"); **WAITING TIME → EXPONENTIAL**. Teaser: NEXT: CONFIDENCE INTERVALS · HOW SURE? (a bell with an interval bar). End card: NEXT: CONFIDENCE INTERVALS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Counts · Measurements · Testing tools · Match the shape. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. "Poisson" is phoneme-patched to *pwah-SOHN*, "Pareto" to *pa-RAY-toh*, "Bernoulli" to *ber-NOO-lee* and "bimodal" to *bye-MOH-dal*.

**S1 · Hook** (0:00.00–0:09.93)
- `0:00.45` Uniform, binomial, Poisson, normal, Pareto, chi-square... so many distributions!
- `0:06.34` Which one do you need? Here's the complete cheat sheet.

**S2 · The definition** (0:09.93–0:21.45)
- `0:10.38` First, a quick reminder, in simple words.
- `0:13.09` A probability distribution shows how likely each possible value is.
- `0:17.66` To pick the right one, just ask: what am I measuring?

**S3 · Three families** (0:21.45–0:26.64)
- `0:21.90` They come in three families: counts, measurements, and tools for testing.

**S4 · Counts** (0:26.64–0:42.66)
- `0:27.09` Counts first.
- `0:28.30` One yes-or-no try? Bernoulli.
- `0:30.52` Successes in a fixed number of tries? Binomial.
- `0:33.62` Tries until the first success? Geometric.
- `0:36.66` Events in a stretch of time? Poisson.
- `0:39.16` Every outcome equally likely? Uniform.

**S5 · Measurements** (0:42.66–0:57.20)
- `0:43.11` Now, measurements.
- `0:44.39` Values clustered around an average? Normal.
- `0:47.28` Waiting time until the next event? Exponential.
- `0:50.52` Positive values, skewed by growth? Log-normal.
- `0:53.78` A few giants holding most of it? Pareto.

**S6 · Testing tools** (0:57.20–1:06.02)
- `0:57.65` And two tools for testing.
- `0:59.36` The average of a small sample? The t-distribution.
- `1:02.60` Do counts match what you expect? Chi-square.

**S7 · Bonus** (1:06.02–1:11.57)
- `1:06.47` Bonus: see two humps? That's bimodal, usually two groups mixed together.

**S8 · Remember** (1:11.57–1:19.69)
- `1:12.02` So remember: ask what you're measuring, then match the shape.
- `1:15.29` Save this cheat sheet, and you'll always know which one to use.

**S9 · Quiz, teaser and CTA** (1:19.69–1:44.28)
- `1:20.04` Quick quiz!
- `1:21.07` You measure how long each customer waits on hold.
- `1:23.83` Which distribution fits best?
- `1:31.19` Exponential!
- `1:32.39` It's a waiting time until the next event. Counting the calls would be Poisson.
- `1:37.10` Next: how sure can we be about an average? Confidence intervals.
- `1:41.02` Follow for data science made simple!

*(Between "Which distribution fits best?" and "Exponential!": the 5-second countdown, music only.)*

## Accuracy notes

- **The guide is a rule of thumb for the distributions covered in the series.** Real data may fit none exactly; check the shape and the assumptions first. Each distribution has its own Reel with the details.
- **Counts** (the mini shapes are exact):
  - Bernoulli(1/6): one try, bars 5/6 and 1/6.
  - Binomial(10, ½).
  - Geometric(1/6): tries until the first success.
  - Poisson(4).
  - Uniform: 6 equal bars.
- **Measurements:**
  - normal: values clustered symmetrically around a mean;
  - exponential: waiting time until the next event of a steady random process;
  - log-normal: positive, right-skewed, multiplicative growth;
  - Pareto: heavy tail, a few giants, the 80/20 pattern.
- **Tools for testing:**
  - t: the distribution of a standardised sample mean when the SD is estimated from a small sample;
  - chi-square: the distribution of the goodness-of-fit / independence statistic for counts.
- **Bimodal** isn't a single named family; it describes any two-peaked shape, often a mixture of two groups.
- **Quiz:** hold time (the time until a call is answered) is a waiting time, classically modelled as exponential. The number of calls per period is Poisson. Binomial needs a fixed number of tries, and hold times are right-skewed, not normal.

## Audio

Same score engine and kit as the series, re-timed for 9 scenes:
- Hook: intro, a blip per named card, ticks as the rest pop, the riser, impact and crash on "Which", and a pop on "cheat sheet".
- Reminder: calm "flow", with a blip per line.
- Families and counts: marimba "play", with step tones per family and, on every row, a pop on the question plus a stamp and chime on the name.
- Measurements, testing and the bonus: groove, with the same row cues and a glide and stamp on "bimodal".
- Full sheet: build, with ticks as the grid fills and a ding on "save".
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off the spoken names. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Originally scaffolded from `exponential-distribution/`; v2 brings in `Curve.tsx` (from `pareto-distribution/`) and the fixed `Quiz.tsx` (from `t-distribution/`), and rewrites `src/components/Pick.tsx`:
- `Shape` for all twelve kinds;
- `CheatRow`, the question → name + mini-shape row.
