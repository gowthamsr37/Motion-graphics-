# Instagram caption, poll and pinned comment

## Caption (paste this)

Real data is messy. Here's EXACTLY how data scientists clean it, step by step 🧹 (save this for your next dataset 👇)

🧹 DAY 4 / 100: DATA CLEANING, STEP BY STEP
Our Bangalore flats dataset: 10,000 rows straight from the websites.

1️⃣ DATA PROFILING: look before you fix. Count rows and columns, check each column's type, count the blanks. (Price was stored as text like "1.2 Cr"!)
2️⃣ TYPE + UNIT CONVERSION: "1.2 Cr" → 120 lakh, "98 L" → 98, sq m × 10.76 → sq ft. One unit per column, always.
3️⃣ CATEGORY STANDARDISATION: "2 BHK", "2bhk", "two bedroom" → 2. Koramangala spelled 4 ways → 1. Otherwise the model thinks they're different places.
4️⃣ DEDUPLICATION: drop exact copies, then match the same flat posted by 3 brokers (area + locality + floor + building) and keep one.
5️⃣ MISSING VALUES: first ask WHY. Price missing (it's the target) → drop the row. Floor missing → median for that building, plus a "was missing" flag.
6️⃣ VALIDITY CHECKS: simple rules (area 200–10,000 sq ft, built year not in the future). 12,000 sq ft 1 BHK? Obvious typo → 1,200. Can't tell → remove.
7️⃣ OUTLIER TREATMENT: a ₹50 crore villa is real but extreme. Keep it, cap it, or model villas separately.
8️⃣ DATA LOGGING: write down every change and re-run the profile. 10,000 → 9,300 clean rows. Ready!

✅ CHECKLIST: profile → types + units → categories → duplicates → missing values → validity rules → outliers → log + re-check

🧠 Your turn: a flat's PRICE is missing. Best approach? Vote in the poll 👇

📌 Save this and use it on your next dataset.
🔜 Tomorrow, Day 5: exploratory data analysis, hands-on.

Follow @curious_datascientist for data science made simple 🚀

#datacleaning #machinelearning #100daysofml #datascience #dataanalysis #learnmachinelearning #datascientist #ai

## Poll

- **Question:** A flat's price is missing. Best approach?
- **Options:** A Fill with the average · B Fill with the median · C Drop the row · D Set it to zero

## Pinned comment

✅ Answer: C, drop the row! Price is the TARGET, the thing we're trying to predict. If you fill it with an average or a median, you're teaching the model a made-up answer. Filling with the median is great for missing FEATURES (like floor), not for the target. Did you get it? 👇
