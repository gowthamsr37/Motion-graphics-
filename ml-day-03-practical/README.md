# 100 Days of ML · Day 3 (practical guide): Your First ML Project, Step by Step

The user asked for Day 3 to be rebuilt as a **practical guide** ("people should think this video has some practical use") using **Bangalore**. It replaces `../ml-day-03-workflow` (the conceptual version, kept for reference). Statistics house style; ocean-blue series cover `MLCover day={3}`. About 2:34. Deliverables in `out/`: `ML_Day_03_First_Project.mp4`, `ML_Day_03_First_Project_Cover.png`, `.srt`; caption (with copy-paste code) in `CAPTION.md`.

**Jargon (user request):** every step is named by its proper term in the narration ("Step 3, data cleaning: …"), in a THE TERM tag under the step bar, in the step-bar labels (PROBLEM · COLLECTION · CLEANING · EDA · SPLIT · TRAINING · EVALUATION), on the title card (all 7 terms glow as they are named) and under each checklist item; deployment is named in step 7.

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

**S1 · Title card** (0:00.00–0:16.86)
- `0:00.20` Day 3 of 100 Days of Machine Learning: your first ML project, step by step.
- `0:05.67` Problem definition, data collection, data cleaning, exploratory data analysis, the train-test split, model training and evaluation, with the actual code. Save this one!

**S2 · Hook** (0:16.86–0:26.75)
- `0:17.16` Most beginners watch hours of theory and never build anything.
- `0:20.72` Today we build one real project together: predicting flat prices in Bangalore. Follow along.

**S3 · Step 1: one sentence** (0:26.75–0:41.90)
- `0:27.05` Step 1, problem definition: write one sentence.
- `0:30.32` Predict the flat price in lakhs, using area, bedrooms, location and age. Success means being off by less than 8 lakh on average.
- `0:38.99` If you can't write this sentence, don't start coding.

**S4 · Step 2: get the data** (0:41.90–0:56.79)
- `0:42.20` Step 2, data collection: get the data.
- `0:44.76` Free sources: Kaggle, data.gov.in, or your own spreadsheet.
- `0:49.00` For a first project, a few thousand rows is plenty.
- `0:52.21` Load it with pandas, using read_csv. We have 10,000 flats.

**S5 · Step 3: four checks** (0:56.79–1:23.92)
- `0:57.09` Step 3, data cleaning: run these 4 checks, every single time.
- `1:01.31` 1, missing values: isnull().sum().
- `1:03.65` 2, duplicates: drop_duplicates().
- `1:06.10` 3, impossible values: describe(). 12,000 sq ft with 1 bedroom? Probably a typo.
- `1:12.50` 4, outliers. One 50 crore villa will confuse a flat price model.
- `1:17.08` Then fix them: fill missing values with the median, delete the duplicates, and correct or remove the typos.

**S6 · Step 4: three plots** (1:23.92–1:40.05)
- `1:24.22` Step 4, exploratory data analysis, or EDA: make 3 plots before any model.
- `1:29.94` Price versus area. Average price by area of the city. And a histogram of prices.
- `1:35.47` Here, price climbs steadily with size, and Koramangala costs the most.

**S7 · Step 5: split** (1:40.05–1:50.30)
- `1:40.35` Step 5, the train-test split: split before you train.
- `1:43.84` train_test_split, with test_size = 0.2. Then lock the test set away until the very end.

**S8 · Step 6: start simple** (1:50.30–2:00.43)
- `1:50.60` Step 6, model training: start simple.
- `1:53.09` Linear regression, in 3 lines: create the model, fit it on the training data, and predict. Fancy models can wait.

**S9 · Step 7: beat the baseline** (2:00.43–2:25.25)
- `2:00.73` Step 7, model evaluation: compare with a dumb baseline.
- `2:04.58` Just guessing the average price is off by 22 lakh. Our model is off by 7. That's under our target of 8. It works!
- `2:12.30` That number is the mean absolute error: on average, how far each prediction is from the real price.
- `2:18.52` Want others to use it? That's deployment: wrap it in a free Streamlit app, and retrain when new sales come in.

**S10 · The checklist** (2:25.25–2:39.70)
- `2:25.55` Here's the whole checklist. Screenshot it.
- `2:27.94` One sentence goal. Load the data. 4 cleaning checks. 3 plots. Split. Simple model. Beat the baseline.
- `2:35.11` Save this, and send it to the friend who keeps saying they'll start ML someday.

**S11 · Poll, teaser and CTA** (2:39.70–2:51.66)
- `2:40.05` Your turn: you've just loaded a new dataset. What's the first thing you run? Vote in the caption poll!
- `2:45.78` Tomorrow, Day 4: cleaning messy data, hands-on.
- `2:48.94` Follow for data science made simple!

total 171.659
