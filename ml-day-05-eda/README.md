# 100 Days of ML · Day 5: EDA, the 6 Problems It Catches

Hook-first (the user asked for a very strong hook): frame 0 opens on **Anscombe's quartet**, four datasets with identical average, variance and correlation, with the series strip "100 DAYS OF ML · DAY 5 · EDA" visible from frame 0. Then the reveal (a line, a curve, an outlier, one extreme point) → "that's why you never skip EDA" → the title. Then 6 practical EDA checks on the Bangalore flats, each with THE TERM, a chart in THE REAL PROBLEM and WHAT YOU DO bullets (`StepScene`). Then the decisions slide, the navy checklist, poll and teaser. Statistics house style; ocean-blue cover `MLCover day={5}` ("SAME NUMBERS, DIFFERENT DATA" with 4 mini scatters). About 2:34. Deliverables in `out/`: `ML_Day_05_EDA.mp4`, `ML_Day_05_EDA_Cover.png`, `.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Hook:** 4 dataset cards with identical stats (average 7.50 · variance 4.12 · correlation 0.816), "?"; SAME NUMBERS. NOW LOOK.
2. **Reveal + title:** the 4 scatters pop on their words (a line · a curve · an outlier · one extreme point); THAT'S WHY YOU NEVER SKIP EDA; "Exploratory DATA ANALYSIS · the 6 problems it catches" with the 6 terms.
3. **Distribution + skewness:** right-skewed price histogram, average Rs 1.2 Cr (red, dashed) vs median Rs 85 L (green) → report the median, log scale.
4. **Anomalies + default values:** a spike at exactly Rs 1 Cr + "built in 2000" bar → rounding/defaults, treat as uncertain.
5. **Hidden segments:** price-vs-area scatter with 2 clouds (villas turn violet) → split / add property type.
6. **Sample size:** locality averages with counts; Sadashivnagar Rs 2.4 Cr from n = 3 (red) → show counts, ignore tiny groups.
7. **Correlation ≠ causation:** AREA ↔ BEDROOMS r = 0.92; NEAR METRO → PRICIER, but areas were already popular.
8. **Time trends:** prices +20% over 2023–2025 → adjust for time, test on recent data.
9. **Output of EDA:** "pretty charts" struck out → a list of DECISIONS (median · split villas · drop tiny groups · adjust for time) + questions for the business.
10. **EDA checklist** (navy): 6 rows ticking on their words; SAVE THIS.
11. **Poll + teaser + end card:** avg Rs 1.2 Cr vs median Rs 85 L: A symmetric · B a few costly flats pull it up · C data error · D median wrong (answer B); TOMORROW · DAY 6: FEATURES + LABELS; follow card.

## Accuracy notes

Anscombe's quartet (F. J. Anscombe, 1973): each set has mean x = 9, mean y = 7.50, variance x = 11, variance y ≈ 4.12, r ≈ 0.816, same regression line y = 3 + 0.5x. The Bangalore figures are illustrative.

## Voiceover script

**S1 · Hook (frame 0)** (0:00.00–0:07.22)
- `0:00.15` These four datasets have the same average, the same spread, and the same correlation.
- `0:05.10` Same numbers. Now look at them.

**S2 · Reveal + title** (0:07.22–0:25.74)
- `0:07.52` Completely different. One is a line, one is a curve, one has an outlier, one is a single extreme point.
- `0:13.87` If you only looked at the numbers, you'd never know. That's why you never skip EDA.
- `0:18.54` Day 5 of 100 Days of Machine Learning: exploratory data analysis, and the 6 problems it catches.

**S3 · Check 1: distribution** (0:25.74–0:43.30)
- `0:26.04` Check 1: plot the distribution of your target. Our Bangalore flat prices: the average is 1.2 crore. The median is 85 lakh.
- `0:35.16` A few very expensive flats drag the average up. The data is skewed.
- `0:39.51` So report the median, and consider a log scale for the model.

**S4 · Check 2: strange spikes** (0:43.30–0:59.44)
- `0:43.60` Check 2: look for strange spikes.
- `0:45.81` Hundreds of flats priced at exactly 1 crore. And a pile of flats built in the year 2000.
- `0:51.60` That's brokers rounding, and a default value someone typed when the real year was unknown. Treat them as uncertain, not as real.

**S5 · Check 3: hidden groups** (0:59.43–1:13.42)
- `0:59.73` Check 3: plot price against area.
- `1:01.97` You see two separate clouds, not one. The second cloud is independent villas, mixed in with apartments.
- `1:08.13` One model for both will be bad at both. Split them, or add a property type column.

**S6 · Check 4: small groups** (1:13.42–1:26.28)
- `1:13.72` Check 4: compare groups, but count them first.
- `1:16.39` One locality shows the highest average price in the city, from just three listings. That's not a pattern. That's luck.
- `1:23.59` Always show the count next to every average.

**S7 · Check 5: correlation** (1:26.28–1:44.81)
- `1:26.58` Check 5: correlations.
- `1:28.34` Area and bedrooms move almost perfectly together, so they mostly carry the same information. And flats near metro stations cost more, but the metro didn't necessarily cause it. Those areas were already popular.
- `1:41.27` Correlation is not causation. Never sell it as one.

**S8 · Check 6: time** (1:44.81–1:57.88)
- `1:45.11` Check 6: plot everything over time.
- `1:47.44` Prices rose 20% in two years. Mix old and new sales blindly, and your model is out of date before it starts.
- `1:54.81` So adjust for time, and test on recent data.

**S9 · The output of EDA** (1:57.88–2:09.18)
- `1:58.17` The output of EDA isn't pretty charts. It's a list of decisions: use the median, split villas, drop tiny groups, adjust for time.
- `2:06.67` And questions to take back to the business.

**S10 · The EDA checklist** (2:09.18–2:18.52)
- `2:09.48` Here's the EDA checklist.
- `2:11.28` Distribution. Spikes. Hidden groups. Group sizes. Correlations. Time.
- `2:16.01` Save this, and run it before every model.

**S11 · Poll, teaser and CTA** (2:18.52–2:34.25)
- `2:18.87` Your turn: the average price is 1.2 crore, but the median is 85 lakh. What does that tell you? Vote in the caption poll!
- `2:27.02` Tomorrow, Day 6: features and labels, and how to choose good features.
- `2:31.53` Follow for data science made simple!

total 154.247
