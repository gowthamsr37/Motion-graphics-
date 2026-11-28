# 100 Days of ML · Day 7: Missing Values (the complete guide)

Hook-first: frame 0 shows Bangalore listings where luxury areas have blank prices; filling them with the average (Rs 1,150 / sq ft) prices luxury flats Rs 40 lakh too low. Reveal: missing is not random. Then the title card (MISSING VALUES · 3 types · 6 fixes · 1 rule, with all 6 jargon terms), measuring missingness (% bars + the missingness map), the 3 types (MCAR / MAR / MNAR), 6 fixes (each `CleanStep`: BEFORE → AFTER + THE APPROACH), the train-only rule, the navy decision guide with SAVE THIS, poll and teaser. Statistics house style; ocean-blue cover `MLCover day={7}` titled "MISSING VALUES". About 2:48, −14.1 LUFS. Deliverables in `out/`: `ML_Day_07_Missing_Values.mp4`, `ML_Day_07_Missing_Values_Cover.png`, `.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Hook:** blank prices in luxury areas → fill with average → −Rs 40 L.
2. **Reveal + title:** not random; MISSING VALUES; 3 TYPES / 6 FIXES / 1 RULE; jargon chips.
3. **Measure first:** % missing per column, missingness map.
4. **3 types:** MCAR, MAR, MNAR.
5. **Fix 1 listwise deletion** · **6 drop the column** · **7 median imputation** · **8 group-wise imputation** · **9 model-based imputation** (never use the target) · **10 missing indicator**.
11. **The rule:** fit imputers on training data only, or test answers leak in.
12. **Decision guide:** 6-row navy checklist + SAVE THIS.
13. **Poll + teaser + end card:** high earners skip the salary question → A MCAR · B MAR · C MNAR · D Not missing (answer C); TOMORROW · DAY 8 · ENCODING CATEGORIES; follow card.

## Accuracy notes

Prices and percentages are illustrative. MCAR/MAR/MNAR follow Rubin's taxonomy. Model-based imputation must not use the target; all imputers are fitted on the training split only.

## Voiceover script

**S1 · Hook (frame 0)** (0:00.00–0:09.37)
- `0:00.15` 30% of luxury flats had no area listed. We filled the blanks with the average.
- `0:05.14` And our model started underpricing every luxury flat by 40 lakh.

**S2 · Reveal + title** (0:09.37–0:25.91)
- `0:09.67` The blanks weren't random. Luxury sellers often hide the size. So filling with the average shrank exactly the flats that mattered most.
- `0:17.79` Day 7 of 100 Days of Machine Learning: missing values. The 3 types, 6 fixes, and the one rule most beginners break.

**S3 · Step 0: measure** (0:25.91–0:36.55)
- `0:26.21` Before fixing anything, measure.
- `0:27.98` Count the percentage missing in every column. Then check which gaps appear together. Here, floor and age are missing in the same new projects.

**S4 · The 3 types** (0:36.55–0:58.02)
- `0:36.84` Next, ask why it's missing. There are 3 types.
- `0:39.63` Missing completely at random: a website glitch wiped some rows. Harmless.
- `0:44.15` Missing at random: it depends on another column. New projects don't list the building age, because it's zero.
- `0:50.48` Missing not at random: it depends on the missing value itself. Luxury sellers hide the size. This one is dangerous.

**S5 · Fix 1: drop rows** (0:58.02–1:11.59)
- `0:58.32` Fix 1: drop the rows.
- `1:00.10` Fine when only a few rows are missing, and the gaps are random. Under 5% is a common guide. But drop rows that are missing for a reason, and you delete a whole group from your data.

**S6 · Fix 2: drop the column** (1:11.59–1:20.77)
- `1:11.89` Fix 2: drop the column.
- `1:13.63` If a column is mostly empty, like 70%, and not important, filling it is mostly guessing. Let it go.

**S7 · Fix 3: median, not mean** (1:20.77–1:30.06)
- `1:21.07` Fix 3: fill with the median, not the mean.
- `1:23.60` Prices and areas are skewed. A few huge villas pull the mean up. The median stays a typical value.

**S8 · Fix 4: fill by group** (1:30.06–1:41.94)
- `1:30.36` Fix 4, much better: fill by group.
- `1:32.67` A missing area for a 3 BHK in Koramangala gets the median of other 3 BHKs in Koramangala, not the median of the whole city.

**S9 · Fix 5: predict it** (1:41.94–1:53.34)
- `1:42.24` Fix 5: predict the missing value.
- `1:44.47` Use the other columns, like bedrooms, bathrooms and floor, to estimate it. Methods like KNN or iterative imputation do this for you.

**S10 · Fix 6: flag it** (1:53.34–2:05.30)
- `1:53.64` Fix 6, the secret weapon: add a flag.
- `1:56.11` Create a column that says area was missing, yes or no. Remember our luxury sellers? That flag alone tells the model: this flat is probably big.

**S11 · The golden rule** (2:05.30–2:17.30)
- `2:05.59` Now the rule most beginners break.
- `2:07.56` Calculate your medians and group values from the training data only, then apply them to the test data. Use the whole dataset, and test answers leak into training.

**S12 · The decision guide** (2:17.30–2:32.05)
- `2:17.60` So here's the decision guide.
- `2:19.28` Few and random? Drop rows. Mostly empty? Drop the column. Otherwise, fill by group, or predict it. Always add a flag. And fit on training data only.
- `2:29.40` Save this. You'll need it on every dataset.

**S13 · Poll, teaser and CTA** (2:32.05–2:48.36)
- `2:32.40` Your turn: high earners often skip the salary question. Which type of missing is that? Vote in the caption poll!
- `2:39.15` Tomorrow, Day 8: encoding categories, and the mistake that makes Koramangala 5 times Whitefield.
- `2:45.64` Follow for data science made simple!

total 168.358

## Rebuild

```bash
npm install   # or cp -al ../ml-day-06-features/node_modules .
python scripts/gen-voice.py --model <kokoro> --whisper <whisper-small-en>
node scripts/gen-audio.mjs
BROWSER=<chrome-headless-shell> bash scripts/build.sh
```
