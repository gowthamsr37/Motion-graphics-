# When to Use Centre vs Spread, Explained in 2 Minutes

The fourth **Data Science Made Simple** Reel for **@curious_datascientist**: 116 seconds, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It answers one practical question: **when do you use a measure of central tendency, and when do you need a measure of dispersion?** The short version: always ask both. Pick the centre that suits the data (mode for categories, mean for balanced numbers, median when there are outliers), then add the spread whenever consistency or risk matters, and pair them up (mean ± SD, median + IQR).

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
| `Central_Tendency_vs_Dispersion.mp4` | the finished Reel |
| `Central_Tendency_vs_Dispersion_Cover.png` | 1080×1920 cover: WHEN TO USE · CENTRE vs SPREAD · explained in 2 minutes, a MEAN ± SD card (bell curve, balanced data) and a MEDIAN + IQR card (skewed bars with an outlier), @curious_datascientist |
| `Central_Tendency_vs_Dispersion.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Your data | white-blue orb / header |
| **Centre** (central tendency: mean, median, mode) | cyan |
| **Spread** (dispersion: range, variance, SD, IQR) | violet |
| Balanced data | green |
| Skewed data, outliers, extremes, "dragged" averages | orange |
| Categories | blue |
| Right answer / "stays put" | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:14 | **Hook** | A person about to wade into a river whose deep channel is plain to see; **AVERAGE 3 FT** appears and a "?" pops up over their head. Whip-pan to delivery-time dots on a 0–60 min line, **AVERAGE 30 MIN**. Whip-pan to nine earners (₹18K…₹56K plus one ₹2L with a crown), **AVERAGE ₹50K**. Headline stack: A RIVER, / AN APP, / A CITY… The slam **AVERAGES ALONE CAN MISLEAD.** The three average badges merge into **CENTRE + SPREAD**, "YOU NEED THE CENTRE AND THE SPREAD!", then into the DATA orb. |
| 2 | 0:14–0:27 | **Two questions** | The orb rises; TWO QUESTIONS. It branches into **CENTRE** ("Where's the middle?") with Mean / Median / Mode chips and **SPREAD** ("How scattered?") with Range / Variance / Std Dev chips, each landing on its spoken word. The camera zooms into CENTRE. |
| 3 | 0:27–0:44 | **Which centre?** | A YOUR DATA → CENTRE / SPREAD header. Three cards slide in: CATEGORIES (bars with a crown) → **MODE**, BALANCED NUMBERS (bell curve) → **MEAN**, OUTLIERS / SKEWED (bars plus one tall orange bar) → **MEDIAN**. Then the city's nine salaries as a bar chart: the orange **AVERAGE ₹50K** line sits above eight of the nine bars and gets a red cross; the ₹30K bar lights cyan: **TYPICAL (MEDIAN) ₹30K**. |
| 4 | 0:44–1:02 | **When spread matters** | WHEN DOES SPREAD MATTER? → CONSISTENCY · RISK. The river returns with depth arrows **1 FT** and **8 FT**, the deep channel glows, the person looks worried: **RANGE: 1 TO 8 FT**. Then two delivery apps on 0–60 min lines, **BOTH AVERAGE 30 MIN**; violet ±1 SD bands grow: **SD 3 MIN** (tight) and **SD 15 MIN** (wide). **PICK ME** lands on App A. |
| 5 | 1:02–1:13 | **Meet the IQR** | INTERQUARTILE RANGE. Twelve scattered values drop onto a 0–100 line in order; the middle six are boxed (**MIDDLE HALF**, Q1 to Q3) and the box width is bracketed **IQR**. The biggest value flies out to 97: a dashed orange **RANGE STRETCHES** bracket grows while the box stays where it is (**IQR STAYS PUT**). |
| 6 | 1:13–1:24 | **Pair them up** | PRO TIP: PAIR THEM UP. Row 1, **MEAN + STD DEV**: a dot plot with a cyan mean marker and a violet ±1 SD band; one value flies out to 96 and the marker slides right while the band balloons (**BOTH SHIFT WITH OUTLIERS**). Row 2, **MEDIAN + IQR**: the same move, but the median marker and IQR box don't budge (**BOTH STAY PUT** ✓). |
| 7 | 1:24–1:37 | **Complete picture** | WHEN TO USE WHAT → three cards, each landing on its spoken word: BALANCED NUMBERS (heights, test scores; NO EXTREME VALUES) → **MEAN ± STD DEV**; SKEWED / OUTLIERS (salaries, house prices; A FEW EXTREME VALUES) → **MEDIAN + IQR**; CATEGORIES (phone brands, cities; LABELS, NOT NUMBERS) → **MODE + COUNTS**. |
| 8 | 1:37–1:56 | **Quiz + CTA** | QUICK QUIZ. A street of six homes (₹40L–₹65L) and then two orange mansions (₹15Cr, ₹20Cr) thump in. "Which pair describes THEM BEST?" with four options and the 5-second countdown. The answer is **MEDIAN + IQR**: confetti, "Mean ± SD" struck through ("dragged up"), "Range only" struck through ("extremes only"), then **MANSIONS CAN'T DRAG THEM UP**. End card: FOLLOW button tap, **@curious_datascientist**, "for data science MADE SIMPLE." and Centre · Spread · Mean ± SD · Median + IQR chips. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. The narration text uses "center" so the US voice says it naturally; captions use the series' British spelling "centre". Numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:14.13)
- `0:00.45` A river, 3 feet deep on average.
- `0:03.02` A delivery app, 30 minutes on average.
- `0:05.80` A city, earning 50,000 on average.
- `0:08.91` Averages alone can mislead you.
- `0:11.20` You need the centre and the spread!

**S2 · Two questions** (0:14.13–0:26.68)
- `0:14.58` Every dataset answers two questions.
- `0:16.98` Where's the centre? That's central tendency: mean, median and mode.
- `0:21.30` How spread out is it? That's dispersion: range, variance and standard deviation.

**S3 · Choosing the centre** (0:26.68–0:44.04)
- `0:27.18` First, which centre should you use?
- `0:29.26` For categories, like favourite phone brands, use the mode.
- `0:32.82` For balanced numbers, like heights in a class, use the mean.
- `0:36.31` For numbers with outliers, like salaries, use the median.
- `0:39.96` That city's typical salary? 30,000, not 50.

**S4 · When spread matters** (0:44.04–1:02.41)
- `0:44.54` Now, when do you need the spread?
- `0:46.39` Whenever consistency or risk matters.
- `0:48.98` That river's depth ranges from 1 foot to 8. The range warns you!
- `0:53.36` Two delivery apps both average 30 minutes.
- `0:56.06` One has a standard deviation of 3 minutes. The other, 15.
- `1:00.35` Pick the consistent one!

**S5 · Meet the IQR** (1:02.41–1:13.01)
- `1:02.86` There's one more spread measure: the interquartile range.
- `1:06.24` Sort the data and keep the middle half. Its width is the IQR.
- `1:10.41` Extreme values can't stretch it.

**S6 · Pair them up** (1:13.01–1:24.33)
- `1:13.46` Here's the pro tip: pair them up.
- `1:15.68` Mean goes with standard deviation. Both react to outliers.
- `1:19.91` Median goes with the IQR. Both resist outliers.

**S7 · The complete picture** (1:24.33–1:36.84)
- `1:24.78` Here's the complete picture.
- `1:26.47` Balanced numbers: mean and standard deviation.
- `1:29.50` Skewed data or outliers: median and IQR.
- `1:32.85` Categories: the mode, with counts for each group.

**S8 · Quiz and call to action** (1:36.84–1:56.42)
- `1:37.19` Quick quiz!
- `1:38.22` House prices in a town with a few mansions.
- `1:40.93` Which pair describes them best?
- `1:48.21` Median and IQR!
- `1:50.01` The mansions can't drag them up.
- `1:52.20` Follow for data science made simple!

*(Between "Which pair describes them best?" and "Median and IQR!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **River:** the drawn cross-section is 1 ft deep at the banks and 8 ft in the channel; its width-weighted average depth is 3.04 ft, so "3 feet deep on average" and "ranges from 1 foot to 8" both match the picture. (This is the classic "never cross a river that is on average 4 feet deep" warning, with friendlier numbers.)
- **Delivery apps:** App A 25, 27, 29, 29, 31, 31, 33, 35 and App B 5, 15, 25, 25, 35, 35, 45, 55. Both sum to 240 over 8 orders, so both average **30 min**. Population SD: A √((25 + 9 + 1 + 1 + 1 + 1 + 9 + 25) ÷ 8) = √9 = **3 min**; B √((625 + 225 + 25 + 25 + 25 + 25 + 225 + 625) ÷ 8) = √225 = **15 min**. The hook uses App B's times.
- **City salaries (₹ thousands):** 18, 22, 25, 28, 30, 33, 38, 56, 200. Sum 450 over 9 people, mean **₹50K**; the middle (5th of 9) value is **₹30K**. Eight of nine people earn less than the "average". ₹2L = ₹200K; its bar is drawn with a break because it would be 4× taller than the chart.
- **Which centre:** mode for categories (you can't average phone brands), mean for roughly symmetric data without extreme values, median when outliers or skew would drag the mean.
- **IQR:** values 10, 16, 22, 28, 33, 38, 42, 47, 52, 58, 64, 72. Q1 = median of the lower six = (22 + 28)/2 = **25**; Q3 = median of the upper six = (52 + 58)/2 = **55**; IQR = 30 and the median is 40. When 72 moves to 97, the range grows from 62 to 87 while Q1, the median and Q3 don't change. (Quartile conventions differ slightly between textbooks and software; the "median of each half" method is used here.)
- **Pair them up:** base values 14, 20, 26, 32, 38, 44, 50 (mean 32, SD 12, median 32, Q1 20, Q3 44). With the last value moved to 96: mean 38.6 and SD 25.3 (both shift), while the median (32) and quartiles (20, 44) stay put. Q1/Q3 use the medians of the lower and upper three values. The markers and bands on screen are computed live from these values.
- **Quiz:** house prices with a few mansions are right-skewed, so the median and IQR describe a typical home and the typical spread; the mansions inflate the mean and SD ("dragged up"). Mode alone says nothing about spread, and the range only reports the extremes.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro arps, then a riser into an impact and crash on "Averages alone can mislead you".
- Two questions: groove.
- Which centre: pluck groove, with step tones as MODE / MEAN / MEDIAN land and a stamp on "not 50".
- When spread matters: groove, with a low hit on "The range warns you!" and a ding on "Pick the consistent one!".
- Meet the IQR: calm "flow" with a gliding lead while the values sort, and a riser as the extreme value flies out.
- Pair them up: playful groove.
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

This project was scaffolded from `measures-of-dispersion/` (`REF=measures-of-dispersion bash .claude/skills/data-science-explainer/new-video.sh centre-vs-spread CentreVsSpread Central_Tendency_vs_Dispersion`). `reference/` holds those scenes for patterns only; they are not compiled.
