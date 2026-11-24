# 100 Days of ML · Day 4: Data Cleaning, Step by Step

Practical-guide format (the user asked for "all these practical problems, step by step, the approach to clean, like the outlier-treatment video"). Same Bangalore flats dataset as Day 3. Each of the 8 steps shows its proper term, a BEFORE → AFTER pair of mini tables, and THE APPROACH as 3 numbered bullets synced to the narration. The checklist is a navy panel (no white cards). Statistics house style; ocean-blue series cover `MLCover day={4}`. About 2:33. Deliverables in `out/`: `ML_Day_04_Data_Cleaning.mp4`, `ML_Day_04_Data_Cleaning_Cover.png`, `.srt`; caption in `CAPTION.md`.

Components: `src/components/CleanStep.tsx` (step bar, THE TERM tag, headline, BEFORE / AFTER panels with a yellow arrow, THE APPROACH panel; `Mini` table) and `src/components/Steps.tsx`.

## Storyboard

1. **Title card** (frame 0): DAY 4 / 100, "Data Cleaning STEP BY STEP", 8 problems · 8 fixes, the 8 terms, "+ EXACTLY HOW TO FIX EACH ONE", SAVE THIS ONE.
2. **Hook:** the raw flats table full of red problem cells (79 sq m, 2bhk, Kormangala, —, 12,000, 50 Cr); model on this = garbage; the 8 steps; LET'S CLEAN IT, IN ORDER.
3. **Data profiling:** raw file stats (10,000 rows · 8 columns · price type text · 412 blanks) → your fix list.
4. **Type + unit conversion:** 1.2 Cr / 98 L / Rs 74,00,000 and 79 sq m → 120 / 98 / 74 lakh and 850 sq ft.
5. **Category standardisation:** 2 BHK / 2bhk / two bedroom → 2; four Koramangala spellings → one.
6. **Deduplication:** the same 1,200 sq ft 5th-floor flat ×3 brokers (98L / 1Cr / 96L) → one row.
7. **Missing value imputation:** price missing → row dropped; floor missing → building median 6 + WAS_MISSING = yes.
8. **Validity checks:** 12,000 sq ft 1 BHK → 1,200 (typo fixed); built 2031 → removed.
9. **Outlier treatment:** a 50 Cr villa → keep / cap / separate model; points to the outlier-treatment video.
10. **Data logging:** change log (5 entries) → profile again: 9,300 rows · number · 0 blanks · READY.
11. **Cleaning checklist** (navy): 8 rows ticking on their words; SAVE THIS.
12. **Poll + teaser + end card:** price missing, best approach? A average · B median · C drop the row · D zero (answer C, it's the target); TOMORROW · DAY 5: EDA, HANDS-ON; follow card.

## Accuracy notes

1 sq m = 10.764 sq ft. Dataset numbers are illustrative. Filling the target is never done; median imputation (with a missingness flag) is for features.

## Voiceover script

**S1 · Title card** (0:00.00–0:10.83)
- `0:00.20` Day 4 of 100 Days of Machine Learning: data cleaning, step by step.
- `0:04.81` 8 problems you'll meet in every real dataset, and exactly how to fix each one. Save this one!

**S2 · Hook** (0:10.83–0:20.94)
- `0:11.13` Remember our Bangalore flats? 10,000 rows, straight from the websites.
- `0:15.61` Feed this to a model as it is, and the predictions are garbage. Let's clean it, in order.

**S3 · Step 1: profile** (0:20.94–0:34.20)
- `0:21.24` Step 1: data profiling. Before fixing anything, look.
- `0:24.83` Count rows and columns, check each column's type, and count the blanks. Here, price is stored as text, like "1.2 Cr".
- `0:32.52` Now you know what's broken.

**S4 · Step 2: types and units** (0:34.20–0:46.63)
- `0:34.50` Step 2: fix types and units.
- `0:36.64` Turn "1.2 Cr" into 120 lakh, and "98 L" into 98. Convert sq m into sq ft. One unit per column, always.

**S5 · Step 3: categories** (0:46.63–1:00.35)
- `0:46.93` Step 3: standardise categories.
- `0:49.24` "2 BHK", "2bhk" and "two bedroom" all become the number 2. Koramangala, spelled 4 different ways, becomes one. Otherwise the model thinks they're different places.

**S6 · Step 4: duplicates** (1:00.35–1:13.72)
- `1:00.65` Step 4: remove duplicates.
- `1:02.75` Exact copies are easy. The tricky ones: the same flat posted by 3 brokers, with slightly different prices. Match on area, locality, floor and building, and keep one.

**S7 · Step 5: missing values** (1:13.72–1:27.51)
- `1:14.02` Step 5: missing values. First ask why it's missing.
- `1:17.48` If the price is missing, that's what we're predicting, so drop the row. If the floor is missing, fill it with the median for that building. And add a column that says it was missing.

**S8 · Step 6: validity** (1:27.51–1:43.55)
- `1:27.81` Step 6: validity checks. Write simple rules.
- `1:30.87` Area between 200 and 10,000 sq ft. Built year not in the future. A 12,000 sq ft 1 BHK? Clearly a typo for 1,200, so fix it. If you can't tell, remove it.

**S9 · Step 7: outliers** (1:43.55–1:57.62)
- `1:43.85` Step 7: outliers. Not errors, just extreme.
- `1:47.22` A 50 crore villa is real, but it will pull a flat price model off course. Keep it, cap it, or model villas separately. We covered this in our outlier treatment video.

**S10 · Step 8: log and re-check** (1:57.62–2:08.89)
- `1:57.92` Step 8: log everything, and re-check.
- `2:00.29` Write down every change, and run the profile again. We went from 10,000 rows to 9,300 clean ones. Now the data is ready.

**S11 · The cleaning checklist** (2:08.89–2:21.36)
- `2:09.19` Here's the cleaning checklist, in order.
- `2:11.31` Profile. Types and units. Categories. Duplicates. Missing values. Validity rules. Outliers. Log and re-check.
- `2:18.66` Save this, and use it on your next dataset.

**S12 · Poll, teaser and CTA** (2:21.36–2:33.29)
- `2:21.71` Your turn: a flat's price is missing. What's the best approach? Vote in the caption poll!
- `2:26.71` Tomorrow, Day 5: exploratory data analysis, hands-on.
- `2:30.57` Follow for data science made simple!

total 153.29
