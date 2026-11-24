# 100 Days of ML · Day 3 (practical guide): Your First ML Project, Step by Step

The user asked for Day 3 to be rebuilt as a **practical guide** ("people should think this video has some practical use") using **Bangalore**. It replaces `../ml-day-03-workflow` (the conceptual version, kept for reference). Statistics house style; ocean-blue series cover `MLCover day={3}`. About 2:34. Deliverables in `out/`: `ML_Day_03_First_Project.mp4`, `ML_Day_03_First_Project_Cover.png`, `.srt`; caption (with copy-paste code) in `CAPTION.md`.

New components: `src/components/Code.tsx` (code-editor window: typed lines, Python highlighting, an Out: panel) and `src/components/Steps.tsx` (the 7-step bar: GOAL · DATA · CLEAN · PLOTS · SPLIT · MODEL · BASELINE).

## Storyboard

1. **Title card** (frame 0): DAY 3 / 100, "Your First ML PROJECT", the 7 step chips, "7 steps · the actual code · a checklist to copy", SAVE THIS ONE.
2. **Hook:** "40 hrs of theory, projects built: 0" → PREDICT FLAT PRICES in Bangalore, FOLLOW ALONG.
3. **Goal:** a fill-in-the-blanks sentence (flat price in Rs lakh · area, beds, location, age · off by < Rs 8 lakh); CAN'T WRITE IT? DON'T START CODING.
4. **Data:** KAGGLE · DATA.GOV.IN · YOUR SHEET; "a few thousand rows is plenty"; code read_csv → (10000, 5).
5. **Clean:** code with the 4 checks typed on their words; results (37 missing · 212 duplicates · 12,000 sq ft 1 bed?! · Rs 50 crore villa); FILL WITH MEDIAN · DROP DUPES · FIX TYPOS.
6. **Plots:** price vs size, average price by area (Koramangala tallest; Whitefield, HSR, Hebbal, E-City), price histogram.
7. **Split:** train_test_split(test_size=0.2) → 8,000 train · 2,000 test; TEST SET: LOCKED.
8. **Model:** LinearRegression in create / fit / predict lines; neural nets and XGBoost → later.
9. **Baseline:** guess-the-average Rs 22L vs our model Rs 7L, target Rs 8L line, IT WORKS!, mean_absolute_error → 7.1; then a free Streamlit app (1,200 sq ft · 2 BHK · HSR → Rs 1.1 Cr) and RETRAIN WHEN NEW SALES COME IN.
10. **Checklist:** a white clipboard "MY FIRST ML PROJECT" with 7 boxes ticking on their words; SCREENSHOT THIS; SAVE + SEND.
11. **Poll + teaser + end card:** new dataset, what first? A train · B check missing values · C deploy · D tune (answer B); TOMORROW · DAY 4: CLEANING DATA, HANDS-ON; follow card.

## Accuracy notes

The dataset and numbers (37 missing, 212 duplicates, MAE 7.1 lakh vs baseline 22 lakh, area price ranking) are illustrative, not from a real file. The code is real, runnable pandas / scikit-learn (X, y = feature columns and price after encoding the location).

## Voiceover script

**S1 · Title card** (0:00.00–0:10.25)
- `0:00.20` Day 3 of 100 Days of Machine Learning: your first ML project, step by step.
- `0:05.67` 7 steps, the actual code, and a checklist you can copy. Save this one!

**S2 · Hook** (0:10.25–0:20.13)
- `0:10.55` Most beginners watch hours of theory and never build anything.
- `0:14.11` Today we build one real project together: predicting flat prices in Bangalore. Follow along.

**S3 · Step 1: one sentence** (0:20.13–0:34.00)
- `0:20.43` Step 1: write one sentence.
- `0:22.41` Predict the flat price in lakhs, using area, bedrooms, location and age. Success means being off by less than 8 lakh on average.
- `0:31.08` If you can't write this sentence, don't start coding.

**S4 · Step 2: get the data** (0:33.99–0:48.01)
- `0:34.30` Step 2: get the data.
- `0:35.98` Free sources: Kaggle, data.gov.in, or your own spreadsheet.
- `0:40.22` For a first project, a few thousand rows is plenty.
- `0:43.43` Load it with pandas, using read_csv. We have 10,000 flats.

**S5 · Step 3: four checks** (0:48.01–1:14.16)
- `0:48.31` Step 3: run these 4 checks, every single time.
- `0:51.55` 1, missing values: isnull().sum().
- `0:53.90` 2, duplicates: drop_duplicates().
- `0:56.34` 3, impossible values: describe(). 12,000 sq ft with 1 bedroom? Probably a typo.
- `1:02.75` 4, outliers. One 50 crore villa will confuse a flat price model.
- `1:07.33` Then fix them: fill missing values with the median, delete the duplicates, and correct or remove the typos.

**S6 · Step 4: three plots** (1:14.16–1:27.24)
- `1:14.46` Step 4: make 3 plots before any model.
- `1:17.13` Price versus area. Average price by area of the city. And a histogram of prices.
- `1:22.66` Here, price climbs steadily with size, and Koramangala costs the most.

**S7 · Step 5: split** (1:27.24–1:36.12)
- `1:27.54` Step 5: split before you train.
- `1:29.66` train_test_split, with test_size = 0.2. Then lock the test set away until the very end.

**S8 · Step 6: start simple** (1:36.12–1:45.41)
- `1:36.42` Step 6: start simple.
- `1:38.07` Linear regression, in 3 lines: create the model, fit it on the training data, and predict. Fancy models can wait.

**S9 · Step 7: beat the baseline** (1:45.41–2:07.64)
- `1:45.71` Step 7: compare with a dumb baseline.
- `1:48.23` Just guessing the average price is off by 22 lakh. Our model is off by 7. That's under our target of 8. It works!
- `1:55.95` That number is the mean absolute error: on average, how far each prediction is from the real price.
- `2:02.17` Want others to use it? Wrap it in a free Streamlit app, and retrain when new sales come in.

**S10 · The checklist** (2:07.64–2:22.10)
- `2:07.94` Here's the whole checklist. Screenshot it.
- `2:10.33` One sentence goal. Load the data. 4 cleaning checks. 3 plots. Split. Simple model. Beat the baseline.
- `2:17.51` Save this, and send it to the friend who keeps saying they'll start ML someday.

**S11 · Poll, teaser and CTA** (2:22.10–2:34.06)
- `2:22.45` Your turn: you've just loaded a new dataset. What's the first thing you run? Vote in the caption poll!
- `2:28.18` Tomorrow, Day 4: cleaning messy data, hands-on.
- `2:31.34` Follow for data science made simple!

total 154.055
