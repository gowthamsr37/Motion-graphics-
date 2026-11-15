# Measures of Dispersion Explained in 2 Minutes

The third **Data Science Made Simple** Reel for **@curious_datascientist**: 117 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`):
- the deep-navy studio look and four-accent colour code;
- Sora, Inter and JetBrains Mono;
- the Kokoro `af_heart` narrator at 1.05×;
- word-synced subtitles;
- the 112 BPM F-major synthesized score and SFX kit;
- the same mix and master;
- the quiz + "Follow for data science made simple!" ending, now with the page handle on the end card and the cover.

The running example is **two batters with the same average (40) but very different consistency**:

| Batter | Last four scores | Mean | Range | Variance | Std dev |
| --- | --- | --- | --- | --- | --- |
| A (steady) | 33, 39, 41, 47 | 40 | 14 | 25 | 5 |
| B (a gamble) | 5, 35, 45, 75 | 40 | 70 | 625 | 25 |

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Measures_of_Dispersion_Explained.mp4` | the finished Reel |
| `Measures_of_Dispersion_Explained_Cover.png` | 1080×1920 cover: MEASURES OF DISPERSION · explained in 2 minutes, narrow vs wide bell curves, Range · Variance · Std Dev, @curious_datascientist |
| `Measures_of_Dispersion_Explained.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Data / dispersion | white-blue orb |
| **Range** | cyan |
| **Variance** | green |
| **Standard deviation** | violet |
| Batter A (steady) | white-blue dots |
| Batter B (wild) / extreme values | orange dots |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:14 | **Hook** | Two batters' score dots, tight vs scattered, both **AVERAGE 40**. Whip-pan to two thermometers, one barely moving (23–27°) and one swinging wildly (12–38°), both **AVERAGE 25°C**. Whip-pan to two buses arriving, one bunched at 9:00 and one all over the place, both **AVERAGE 9:00**. Headline stack: TWO BATTERS, / TWO CITIES, / TWO BUSES… Then **ALL THREE HAVE THE SAME AVERAGE.** with two dots sitting on one average line. The orange row bursts outward (**BUT A COMPLETELY DIFFERENT SPREAD!**, RGB glitch), then everything merges into the DATA orb. |
| 2 | 0:14–0:24 | **Big picture** | A cloud of data opens up and breathes, with a SPREAD arrow and a **DISPERSION** tag. The orb branches into **RANGE** (high − low), **VARIANCE** (squared distance) and **STD DEV** (typical distance). The camera zooms into RANGE. |
| 3 | 0:24–0:39 | **Range** | Both batters on one 0–80 scale, the shared average line (BOTH AVG 40), then range brackets: `47 − 33 = 14` and `75 − 5 = 70`. One freak innings: a red 0 appears in A's row, the bracket stretches to **RANGE 47?!**, and ONE FREAK SCORE FOOLS IT. |
| 4 | 0:39–0:59 | **Variance** | Batter A zoomed in (30–50). Arrows from the average to each score are labelled −7, −1, +1, +7. Each distance becomes a real gridded square: **49, 1, 1, 49**. The squares gather (`49 + 1 + 1 + 49 = 100`) and merge into one square of area 25 (`100 ÷ 4 = 25`): **VARIANCE = 25**, in *runs²*. Footnote: divide by n for a whole group, n − 1 for a sample. |
| 5 | 0:59–1:11 | **Standard deviation** | The 25 square's side is traced in violet: **5**, and √25 = 5 gives **STD DEV = 5**. Then ±1 SD bands for both batters: A's band is narrow (SD 5) and B's is wide (SD 25), with a **×5 THE SPREAD** badge. |
| 6 | 1:11–1:19 | **Why it matters** | A narrow bell curve (40 ± 5) draws, its ±1 SD region shades with **ABOUT 68% within ±1 SD**, then a wide curve (40 ± 25) shades the same 68% over a wider band. |
| 7 | 1:19–1:32 | **Complete picture** | Dispersion → three cards, each landing on its spoken word, with what it is, its catch (QUICK BUT FRAGILE / UNITS ARE SQUARED / THE TYPICAL DISTANCE) and both batters' values (14/70, 25/625, 5/25). |
| 8 | 1:32–1:57 | **Quiz + CTA** | QUICK QUIZ. Two class cards, both AVG 70, with SD 5 and SD 15 popping in as they're spoken. "Which class is MORE CONSISTENT?" with four options and the 5-second countdown. The answer is **CLASS A**: mini bell curves appear in the cards (narrow vs wide), and the wrong options are struck through ("more spread", "only averages match"). SMALLER SD = MORE CONSISTENT. End card: FOLLOW button tap, **@curious_datascientist**, "for data science MADE SIMPLE." and Range · Variance · Std Dev · Spread chips. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Pronunciation fix: "innings" is stressed *IN-ings*.

**S1 · Hook** (0:00.00–0:13.73)
- `0:00.45` Two batters, both averaging forty.
- `0:03.08` Two cities, both twenty-five degrees on average.
- `0:06.32` Two buses, both on time, on average.
- `0:09.38` Same average.
- `0:10.78` But a completely different spread!

**S2 · The big picture** (0:13.73–0:23.71)
- `0:14.18` That's dispersion: how spread out your data is.
- `0:17.16` We measure it with the range, the variance, and the standard deviation.
- `0:21.16` Let's put our two batters to the test.

**S3 · Range** (0:23.71–0:38.94)
- `0:24.21` Here are their last four scores.
- `0:26.65` Both average forty.
- `0:28.21` The range is the highest minus the lowest.
- `0:30.93` Fourteen for batter A. Seventy for batter B!
- `0:34.26` Quick, but it only uses two scores, so one freak innings can fool it.

**S4 · Variance** (0:38.94–0:59.05)
- `0:39.44` Variance uses every score.
- `0:41.37` Measure each score's distance from the average.
- `0:43.96` Minus seven, minus one, one, seven.
- `0:46.63` Square them, so the negatives don't cancel out.
- `0:49.28` Forty-nine, one, one, forty-nine.
- `0:51.98` Average them: one hundred divided by four is twenty-five.
- `0:56.07` That's the variance, but it's in squared runs.

**S5 · Standard deviation** (0:59.05–1:11.24)
- `0:59.55` So take the square root: five.
- `1:01.84` That's the standard deviation, the typical distance from the average.
- `1:06.01` Batter A, five runs. Batter B, twenty-five.
- `1:09.18` Five times the spread!

**S6 · Why it matters** (1:11.24–1:19.34)
- `1:11.69` For bell-shaped data, about two thirds of values land within one standard deviation of the average.

**S7 · The complete picture** (1:19.34–1:31.82)
- `1:19.79` Here's the complete picture.
- `1:21.48` Range: highest minus lowest, quick but fragile.
- `1:24.71` Variance: the average squared distance.
- `1:27.15` Standard deviation: its square root, the typical distance.

**S8 · Quiz and call to action** (1:31.82–1:56.95)
- `1:32.17` Quick quiz!
- `1:33.20` Two classes both average seventy marks.
- `1:35.70` Class A's standard deviation is five. Class B's is fifteen.
- `1:39.82` Which class is more consistent?
- *(5-second countdown, music only)*
- `1:47.15` Class A!
- `1:48.21` A smaller standard deviation means scores stay closer to the average.
- `1:52.73` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Means:** A: (33 + 39 + 41 + 47) ÷ 4 = 160 ÷ 4 = 40. B: (5 + 35 + 45 + 75) ÷ 4 = 160 ÷ 4 = 40.
- **Ranges:** A: 47 − 33 = 14. B: 75 − 5 = 70. With a freak 0, A's range becomes 47 − 0 = 47.
- **Variance (A):** distances −7, −1, +1, +7; squares 49, 1, 1, 49; sum 100; 100 ÷ 4 = **25**. The squares are drawn to scale, side ∝ distance, so area = squared distance.
- **Variance (B):** distances −35, −5, +5, +35; squares 1225, 25, 25, 1225; sum 2500; 2500 ÷ 4 = **625**.
- **Standard deviation:** √25 = **5** and √625 = **25**, so B's spread is 5 times A's. On screen, the 25-square's side is 5 units, so the standard deviation is literally the side of the variance square.
- **Population vs sample:** the video uses the population formula (divide by n), which is right for "these four scores". An on-screen footnote says samples divide by n − 1.
- **"About two-thirds within one standard deviation"** applies to bell-shaped (normal) data, where it is about 68.3%. The narration says "for bell-shaped data", and the curves are illustrative, not drawn to exact area.
- **Quiz:** both classes average 70. SD 5 is less spread than SD 15, so Class A is more consistent. The distractors: "Class B" (more spread) and "Same" (only the averages match).

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro arps, then a riser into an impact on "Same average", then a lifted chord on "different spread".
- Big picture: groove.
- Range: pluck groove, with a low hit on the freak innings.
- Variance: calm "flow" with a gliding lead while the squares build, and a crash when they merge into 25.
- Standard deviation: groove.
- Bell curves: flow, with a gliding lead as they draw.
- Overview: build.
- Quiz: suspense countdown, then the finale.

The mix and master are unchanged: music ducked under every line with `useDuck(0.5, 0.16)`, then limiter → two-pass loudnorm to −14 LUFS.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

This project was scaffolded from `mean-median-mode/` (`REF=mean-median-mode bash .claude/skills/data-science-explainer/new-video.sh …`). `reference/` holds those scenes for patterns only; they are not compiled.
