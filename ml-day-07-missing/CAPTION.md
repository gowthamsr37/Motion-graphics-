# Day 7 caption: Missing Values

## Caption

Filled the blanks with the average… and the model priced luxury flats ₹40 lakh too low. 😬

Missing data is NEVER random by accident. Day 7 of #100DaysOfML: the complete guide to missing values.

📊 Measure it first: % missing per column + the missingness map
🧩 3 types: MCAR (pure chance) · MAR (depends on another column) · MNAR (depends on the value itself)
🛠 6 fixes: drop rows · drop the column · median imputation · group-wise imputation · model-based imputation (KNN / iterative) · missing indicator flag
⚠️ The 1 rule: fit every imputer on TRAINING data only, or test answers leak in

💾 Save this: you'll need it on every dataset.
👉 Follow @curious_datascientist for Day 8: Encoding Categories.

## Poll (add the Instagram poll sticker)

High earners skip the salary question. Which type of missing is it?
A) MCAR  B) MAR  C) MNAR  D) Not missing

## Pinned comment

✅ Answer: C) MNAR (Missing Not At Random). The salary is missing BECAUSE of the salary itself: the higher it is, the more likely people skip it. Filling with the average would drag every high earner down to the middle. Fix: add a "salary_missing" flag so the model learns that a blank itself means something. Did you get it right? 👇

## Hashtags

#100DaysOfML #MachineLearning #DataScience #DataCleaning #MissingValues #Python #DataScientist #LearnML
