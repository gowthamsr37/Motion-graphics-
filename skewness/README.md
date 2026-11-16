# Skewness Explained in 2 Minutes

The eighth **Data Science Made Simple** Reel for **@curious_datascientist**: 113 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

Four earlier Reels kept saying "skewed data" (centre vs spread, outliers, the IQR, treating outliers); this one explains it:
- what skew is (lopsided data with a long tail);
- the three shapes (symmetric, right-skewed, left-skewed) with everyday examples;
- the tail rule: the tail pulls the mean, so right skew gives mode < median < mean and left skew flips it;
- how to spot skew: compare the mean and median, or look for the longer box-plot whisker;
- what to do about it: report median + IQR, or log-transform.

It reuses the city-salary example from earlier Reels (average ₹50K, typical ₹30K) as the hook.

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
| `Skewness_Explained.mp4` | the finished Reel |
| `Skewness_Explained_Cover.png` | 1080×1920 cover: WHAT IS SKEWNESS? · explained in 2 minutes, three mini histograms (left · symmetric · right) with mean (dashed cyan) and median (green) lines, @curious_datascientist |
| `Skewness_Explained.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Right skew, the tail, the misleading mean ₹50K | orange |
| Left skew | blue `#60A5FA` |
| Symmetric | white-blue |
| Mean | cyan (series colour) |
| Median | green (series colour) |
| Mode | violet (series colour) |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:11 | **Hook** | ONE CITY · NINE SALARIES: bars ₹18K…₹56K and an orange ₹2L (with a break), with an avatar under each bar. A dashed **AVERAGE ₹50K** line draws across. The bars under the line light up cyan one by one while a counter climbs to **7 OF 9 EARN LESS** (the avatars frown). MOST PEOPLE BELOW AVERAGE? Then THE ANSWER IS **SKEW** (slanted, orange). |
| 2 | 0:11–0:21 | **What skew is** | A BALANCED histogram tips into a LOPSIDED! one. A bracket marks MOST VALUES PILE UP over the left bars, the right-hand bars turn orange and an arrow draws A LONG TAIL. Tag: → TAIL TO THE RIGHT = RIGHT-SKEWED. |
| 3 | 0:21–0:37 | **Three shapes** | Three cards slide in on their words, each with a mini histogram. **SYMMETRIC** (e.g. heights in a class · BOTH SIDES MATCH), **RIGHT-SKEWED** (e.g. salaries · LONG TAIL TO THE RIGHT, orange tail) and **LEFT-SKEWED** (e.g. scores on an easy test · LONG TAIL TO THE LEFT, blue tail). |
| 4 | 0:37–0:52 | **The tail rule** | THE TAIL PULLS THE MEAN. A big right-skewed histogram with live markers: MEAN (cyan, "pulled by the tail"), MEDIAN (green) and MODE (violet); a chip reads **MODE < MEDIAN < MEAN**. The histogram flips into its mirror image and the markers slide across: **MEAN < MEDIAN < MODE**. It then morphs into a symmetric bell and all three markers meet in the middle: **MEAN = MEDIAN = MODE**. |
| 5 | 0:52–1:03 | **How to spot it** | MEAN vs MEDIAN. **MEAN > MEDIAN → RIGHT SKEW** (our city: mean ₹50K > median ₹30K ✓) and **MEAN < MEDIAN → LEFT SKEW**. Then a box plot under a faded right-skewed histogram: a short left whisker and a long orange right whisker, **LONG WHISKER = TAIL →**. |
| 6 | 1:03–1:17 | **Why it matters** | The city chart again: MEAN ₹50K gets a red cross and THE MEAN MISLEADS; the ₹30K bar lights up as **TYPICAL (MEDIAN) ₹30K**. Two cards: REPORT **MEDIAN + IQR** and OR **LOG-TRANSFORM**, where a mini histogram morphs from skewed to balanced. |
| 7 | 1:17–1:29 | **Complete picture** | Three columns, each with a mini histogram and computed mean/median lines. **SYMMETRIC:** MEAN = MEDIAN, no tail, e.g. heights. **RIGHT SKEW:** MEAN > MEDIAN, tail →, e.g. salaries. **LEFT SKEW:** MEAN < MEDIAN, ← tail, e.g. easy tests. |
| 8 | 1:29–1:53 | **Quiz + CTA** | QUICK QUIZ. A PHONE RECHARGES histogram: a tall ₹200 bar, then a few small bars out to ₹2,000. "Which way is it SKEWED?" Options: Left-skewed / Right-skewed / Symmetric / Can't tell, with the 5-second countdown. The answer is **RIGHT-SKEWED**: confetti and strikes ("wrong side", "lopsided", "you can"). The tail turns orange (TAIL →), the mean and median lines drop in, and **MEAN > MEDIAN**. End card: FOLLOW button tap, **@curious_datascientist**, "for data science MADE SIMPLE." and Symmetric · Right skew · Left skew · Mean vs median chips. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Numbers are written out in the TTS text and shown as digits in the captions. The rupee sign isn't in the caption font, so captions say "200 rupees".

**S1 · Hook** (0:00.00–0:10.87)
- `0:00.45` In this city, the average salary is 50,000.
- `0:03.64` Yet 7 out of 9 people earn less than that!
- `0:06.47` How can most people be below average?
- `0:08.79` The answer is skew.

**S2 · What skew is** (0:10.87–0:21.42)
- `0:11.32` Skew means your data is lopsided.
- `0:13.60` Most values pile up on one side. A long tail stretches out the other way.
- `0:18.29` The tail's direction gives the skew its name.

**S3 · Three shapes** (0:21.42–0:37.12)
- `0:21.87` There are three shapes.
- `0:23.36` Symmetric, like heights: both sides match.
- `0:26.09` Right-skewed, like salaries: a few huge values make a long tail to the right.
- `0:31.04` Left-skewed, like scores on an easy test: most score high, and a few trail off to the left.

**S4 · The tail rule** (0:37.12–0:52.28)
- `0:37.57` Here's the key rule. The tail pulls the mean toward it.
- `0:40.85` In right skew, the mean is dragged above the median, and the peak, the mode, sits lowest.
- `0:45.77` In left skew, it flips. The mean falls below the median.
- `0:49.24` And when it's symmetric, they all meet in the middle.

**S5 · How to spot it** (0:52.28–1:03.16)
- `0:52.73` To spot skew, compare the mean and the median.
- `0:55.58` Mean above the median? Right skew. Below it? Left skew.
- `0:59.15` Or look at a box plot: the longer whisker points to the tail.

**S6 · What to do** (1:03.16–1:16.68)
- `1:03.61` Why does it matter? In skewed data, the mean misleads.
- `1:06.89` That city's typical salary is the median: 30,000, not 50.
- `1:11.37` So report the median and IQR, or log-transform the data to balance it.

**S7 · The complete picture** (1:16.68–1:29.19)
- `1:17.13` Here's the complete picture.
- `1:18.82` Symmetric: the mean equals the median.
- `1:21.26` Right skew: the mean is above the median, tail to the right.
- `1:24.80` Left skew: the mean is below the median, tail to the left.

**S8 · Quiz and call to action** (1:29.19–1:53.20)
- `1:29.54` Quick quiz!
- `1:30.57` Most people recharge their phone for 200 rupees, but a few pay 2,000.
- `1:35.62` Which way is it skewed?
- `1:42.50` Right-skewed!
- `1:43.74` The few big recharges make a long tail to the right, and pull the mean above the median.
- `1:48.98` Follow for data science made simple!

*(Between "Which way is it skewed?" and "Right-skewed!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **City salaries (₹ thousand):** 18, 22, 25, 28, 30, 33, 38, 56, 200.
  - The mean is 450 ÷ 9 = **50**. The median (5th of 9) is **30**.
  - **7 of 9** are below 50: 18, 22, 25, 28, 30, 33 and 38. Only 56 and 200 are above.
- **Histograms (`src/components/Hist.tsx`):** the bar counts are the data, and every marker is computed from them.
  - **Right-skewed:** counts 2, 10, 13, 10, 7, 5, 4, 3, 3, 2, 2, 2 over values 1–12 (n = 63).
    - The mode is 3 (the tallest bar) and the median is 4 (the 32nd value; the running totals are 2, 12, 25, 35).
    - The mean is 311 ÷ 63 = **4.94**.
    - So **mode 3 < median 4 < mean 4.94**.
  - **Left-skewed:** the mirror image, so mode 10, median 9 and mean 13 − 4.94 = **8.06**, giving **mean < median < mode**.
  - **Symmetric:** counts 1, 3, 5, 8, 11, 13, 13, 11, 8, 5, 3, 1, with mode = median = mean = **6.5** (two equal peaks at 6 and 7).
- **The tail rule** (mean pulled toward the tail; mode < median < mean in right skew) is the usual rule of thumb for unimodal distributions. It can fail for some unusual shapes, but it holds for everyday data like salaries, prices and test scores.
- **Box plot (right-skewed data above):**
  - Q1 = 3 (16th value), median = 4 and Q3 = 7 (48th value).
  - The whiskers run from 1 to 12. That's within the 1.5 × IQR fences (−3 and 13), so there are no outliers.
  - The left whisker spans 2 units and the right spans 5: the longer whisker points to the tail.
- **Examples:**
  - Heights are roughly symmetric.
  - Salaries are right-skewed (a few very high earners).
  - Scores on an easy test are left-skewed (most score high, a few low).
- **Quiz:** recharge amounts binned from ₹200 up to ₹2,000, counts 14, 6, 3, 2, 1, 1, 1, 2. The mode is the ₹200 bin. The median falls in the 2nd bin, and the mean is about 2.57 bins.
  - So mean > median: a long tail to the right, right-skewed.
  - The distractors: "Left-skewed" (wrong side), "Symmetric" (it's lopsided), "Can't tell" (the mean vs median comparison tells you).
- **What to do:** in skewed data the median + IQR describe the typical value and spread honestly. A log transform makes right-skewed data closer to symmetric (see the "How to Treat Outliers" Reel).

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro arps, then ascending blips as the bars below average light up and the counter climbs, and the riser, impact and glitch on "skew".
- What skew is: calm "flow", with a falling lead as the balanced shape tips over.
- Three shapes: playful marimba ("play"), with step tones per card.
- Tail rule: groove, with pops as each marker lands, a whoosh, flip and impact when the shape flips to left skew, and a rising lead and chime when all three meet.
- Spotting it and why it matters: groove, with a ding on our city's check and a stamp on "the mean misleads".
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

This project was scaffolded from `treating-outliers/` (`REF=treating-outliers bash .claude/skills/data-science-explainer/new-video.sh skewness Skewness Skewness_Explained`). `reference/` holds those scenes for patterns only; they are not compiled. Histograms and their exact mean/median/mode live in `src/components/Hist.tsx`.
