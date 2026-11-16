# The IQR Explained in 2 Minutes

The sixth **Data Science Made Simple** Reel for **@curious_datascientist**: 112 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

The last three Reels kept using "the IQR"; this one finally explains it:
- what the name means;
- what quartiles are;
- how to calculate it step by step;
- what the number tells you;
- where it's useful (skewed data, box plots, outlier fences).

One running example, ten days of commute times with one traffic jam, carries the whole video.

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
| `IQR_Explained.mp4` | the finished Reel |
| `IQR_Explained_Cover.png` | 1080×1920 cover: WHAT IS THE IQR? · explained in 2 minutes, a box plot over four 25% quarters (middle two highlighted), IQR = Q3 − Q1, @curious_datascientist |
| `IQR_Explained.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| IQR, the middle half, the box | violet |
| Quartiles Q1 and Q3 | cyan |
| Median (Q2), "still 8", right answer | green |
| The traffic jam, the range, outliers | orange |
| Ordinary data points | white-blue |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:16 | **Hook** | YOUR COMMUTE: ten day cards pop in, each with a bus and a time. Most light up cyan (MOST DAYS: 20 TO 30 MIN); then DAY 4 shakes, turns orange with a red "!": ONE TRAFFIC JAM: 60 MIN. HOW MUCH DOES IT REALLY VARY? The cards fly onto a minutes axis as dots (equal times stack). An orange dashed bracket draws **RANGE = 42 MIN**, then a violet box wraps the middle: **IQR = 8 MIN**. Slam: LET'S DECODE THE **IQR** (glitch). |
| 2 | 0:16–0:25 | **What it is** | The big IQR opens into **I**NTER (= between), **Q**UARTILE (= the quarter marks), **R**ANGE (= the spread). A sorted strip splits into four 25% quarters (SMALLEST … LARGEST). The middle two glow violet (MIDDLE HALF); the lowest and highest quarters drop away (LOWEST · DROP / HIGHEST · DROP), and a violet bracket measures what's left: **IQR**. |
| 3 | 0:25–0:38 | **Quartiles** | Twelve sorted bars (a staircase) split into four groups of three, 25% each. Cut lines become **Q1** (25% below, cyan), **Q2** (the median, green) and **Q3** (75% below, cyan) as each is named. The middle six bars turn violet under an IQR bracket, and a chip lands: **IQR = Q3 − Q1**. |
| 4 | 0:38–1:00 | **How to calculate** | A 4-step tracker (SORT · MEDIAN · SPLIT · SUBTRACT) lights up as each step is spoken. Ten number cards in day order sort themselves (18 20 22 22 25 27 30 30 35 60). (25 + 27) ÷ 2 → a green line drops between them: **MEDIAN 26**. The halves pull apart (LOWER HALF / UPPER HALF). The middle card of each half glows cyan: **Q1 = 22**, **Q3 = 30**. Then **IQR = 30 − 22 = 8 MIN**. |
| 5 | 1:00–1:08 | **What it means** | **22 TO 30 MIN · AN 8-MINUTE WINDOW** for the middle half of your days. On a broken minutes axis the IQR box sits over the everyday commutes, with RANGE 42 dashed underneath. A worse jam: the orange dot hops from 60 to 90 and the range stretches to **72**, while the box stays put: **✓ IQR STILL 8**. |
| 6 | 1:08–1:25 | **Where it's useful** | WHEN SHOULD YOU USE IT? Three cards land on their words, each with a tiny live demo. **1 SKEWED DATA** (salaries, house prices: huge values inflate the SD, not the IQR) shows a long-tailed histogram. **2 BOX PLOTS** (the box IS the IQR) shows a box plot drawing with Q1/Q3. **3 CATCHING OUTLIERS** (beyond 1.5 × IQR from the box; commute fences 10 and 42, so the jam is flagged) shows fences and a ringed orange dot. |
| 7 | 1:25–1:32 | **The recipe** | IQR IN 3 STEPS: dashed empty slots fill as each step is spoken. 1 SORT THE DATA, 2 FIND Q1 AND Q3, 3 SUBTRACT: Q3 − Q1 (30 − 22 = 8 minutes), each with a check. Then THE OUTLIER-PROOF PAIR: **MEDIAN + IQR**. |
| 8 | 1:32–1:52 | **Quiz + CTA** | QUICK QUIZ. Number chips 2, 4, 6, 8, 10, 12 pop in one per spoken word. "What's the **IQR?**" Options 10 / 6 / 7 / 4 with the 5-second countdown. Answer **6** with confetti; 10 is struck through ("the range"), 7 ("the median") and 4 ("just Q1"). The chips split into halves at the median, **Q1 = 4** and **Q3 = 10** glow, and **10 − 4 = 6**. End card: FOLLOW button tap, **@curious_datascientist**, "for data science MADE SIMPLE." and Quartiles · Q3 − Q1 · Box plots · Outliers chips. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions ("Q one" → Q1).

**S1 · Hook** (0:00.00–0:16.03)
- `0:00.45` Ten days of your commute.
- `0:02.07` Most take 20 to 30 minutes.
- `0:04.25` But one day, a traffic jam: 60!
- `0:06.89` So how much does your commute really vary?
- `0:09.25` The range says 42 minutes.
- `0:11.17` The IQR says just 8.
- `0:13.14` Let's finally decode the IQR!

**S2 · What it is** (0:16.03–0:25.43)
- `0:16.48` IQR stands for interquartile range.
- `0:19.12` It's the range of the middle half.
- `0:21.03` Drop the lowest quarter and the highest quarter, and measure what's left.

**S3 · Quartiles** (0:25.43–0:38.05)
- `0:25.88` Quartiles cut sorted data into four equal parts.
- `0:29.35` Q1 marks the first quarter.
- `0:31.28` Q2 is the median.
- `0:32.87` Q3 marks three quarters.
- `0:34.87` So the IQR is Q3 minus Q1.

**S4 · How to calculate** (0:38.05–0:59.76)
- `0:38.50` Let's calculate it. Step one: sort the data.
- `0:41.53` Step two: find the median, halfway between 25 and 27: 26.
- `0:47.05` Step three: split the data at the median.
- `0:49.54` The middle of the lower half is Q1: 22.
- `0:52.56` The middle of the upper half is Q3: 30.
- `0:55.38` Step four: subtract. 30 minus 22 is 8 minutes!

**S5 · What it means** (0:59.76–1:07.69)
- `1:00.21` On a typical day, your commute takes 22 to 30 minutes. An 8-minute window.
- `1:05.32` Even a worse jam can't move it.

**S6 · Where it's useful** (1:07.69–1:25.00)
- `1:08.14` So when should you use the IQR?
- `1:10.09` With skewed data, like salaries or house prices, where a few huge values inflate the standard deviation.
- `1:16.83` In box plots, where the box is the IQR.
- `1:19.80` And to catch outliers: anything more than 1.5 IQRs beyond the box.

**S7 · The recipe** (1:25.00–1:32.29)
- `1:25.45` Here's the recipe.
- `1:26.82` Sort. Find Q1 and Q3. Subtract.
- `1:30.02` And pair it with the median.

**S8 · Quiz and call to action** (1:32.29–1:52.07)
- `1:32.64` Quick quiz!
- `1:33.67` 2, 4, 6, 8, 10, 12.
- `1:35.84` What's the IQR?
- `1:42.66` 6!
- `1:43.61` Q1 is 4 and Q3 is 10. 10 minus 4 is 6.
- `1:47.85` Follow for data science made simple!

*(Between "What's the IQR?" and "6!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Commute times (minutes), in day order:** 25, 30, 18, 60, 22, 27, 35, 20, 30, 22. Sorted: 18, 20, 22, 22, 25 | 27, 30, 30, 35, 60.
  - Median (10 values) = (25 + 27) ÷ 2 = **26**.
  - Q1 = middle of the lower five (18, 20, **22**, 22, 25) = **22**.
  - Q3 = middle of the upper five (27, 30, **30**, 35, 60) = **30**.
  - IQR = 30 − 22 = **8 minutes**; range = 60 − 18 = **42**. "Most take 20 to 30 minutes": 7 of the 10 days.
- **Worse jam:** 60 → 90 makes the range 90 − 18 = 72. Q1 and Q3 don't change, so the IQR is still 8.
- **Fences (1.5 × IQR rule):** 1.5 × 8 = 12, so the fences are 22 − 12 = **10** and 30 + 12 = **42**. The 60-minute jam is outside, so it's flagged as an outlier.
- **Method:** quartiles are the medians of the lower and upper halves (Tukey's hinges). With an even count the halves are clean; with an odd count the usual school method leaves the median out of both halves (as in the Outliers Reel).
  - Software can differ: numpy's default linear interpolation gives Q1 = 22, Q3 = 30 here, the same answer. Other datasets may differ slightly by method.
- **Quartiles = four equal parts:** the 12-bar staircase splits 3 / 3 / 3 / 3. Q1 sits between the 3rd and 4th bars, Q2 between the 6th and 7th, and Q3 between the 9th and 10th.
- **Quiz:** 2, 4, 6, 8, 10, 12. The median is (6 + 8) ÷ 2 = 7. The lower half 2, 4, 6 gives Q1 = 4 and the upper half 8, 10, 12 gives Q3 = 10, so the IQR = **6**.
  - The distractors are each a real statistic of the same data: 10 = the range (12 − 2), 7 = the median, 4 = Q1.
- **Skewed data:** a few huge values pull the mean and inflate the standard deviation. The quartiles depend only on the order of the middle values, so they barely move. That's why the median + IQR pair is used for salaries and house prices.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro arps, an impact on the traffic jam, then the riser, impact and crash on "Let's finally decode the IQR!".
- What it is: groove.
- Quartiles: playful marimba ("play"), with flips as the cut lines drop and ascending step tones for Q1, Q2 and Q3.
- Calculation: calm "flow" with a gliding lead as the cards sort; a ding on the median, step tones on Q1 and Q3, and a ta-da and crash on "8 minutes".
- What it means: groove, with a hop as the jam gets worse and a ding on "can't move it".
- Uses: groove, with step tones per card.
- Recipe: build.
- Quiz: suspense countdown, then the finale.

The mix and master are unchanged: music ducked under every line with `useDuck(0.5, 0.16)`, then limiter → two-pass loudnorm to −14 LUFS.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

This project was scaffolded from `outliers/` (`REF=outliers bash .claude/skills/data-science-explainer/new-video.sh iqr IqrExplained IQR_Explained`). `reference/` holds those scenes for patterns only; they are not compiled. The commute data lives in `src/data.ts`.
