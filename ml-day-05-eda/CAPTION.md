# Instagram caption, poll and pinned comment

## Caption (paste this)

These 4 datasets have the SAME average, the SAME spread and the SAME correlation 🤯 Now look at them. This is why you NEVER skip EDA 👇

📊 DAY 5 / 100: EXPLORATORY DATA ANALYSIS (EDA), the 6 problems it catches
(The 4 datasets are Anscombe's quartet, 1973: identical statistics, completely different shapes.)

Our Bangalore flats dataset:
1️⃣ DISTRIBUTION + SKEWNESS: average ₹1.2 Cr, median ₹85 L. A few costly flats drag the average up. Report the median; consider a log scale.
2️⃣ ANOMALIES + DEFAULT VALUES: hundreds of flats at exactly ₹1 Cr (broker rounding) and a pile "built in 2000" (a default value). Treat them as uncertain.
3️⃣ HIDDEN SEGMENTS: price vs area shows 2 clouds. Villas are mixed with apartments. Split them, or add a property-type column.
4️⃣ SAMPLE SIZE: one locality "most expensive in the city"… from 3 listings. That's luck. Show the count next to every average.
5️⃣ CORRELATION ≠ CAUSATION: area and bedrooms carry the same information (r = 0.92). Near-metro flats cost more, but those areas were already popular.
6️⃣ TIME TRENDS: prices rose 20% in 2 years. Adjust for time and test on recent data.

🧠 The output of EDA isn't pretty charts. It's DECISIONS: use the median, split the villas, drop tiny groups, adjust for time. Plus questions for the business.

✅ EDA CHECKLIST: distribution · spikes · hidden groups · group sizes · correlations · time

🧠 Your turn: average ₹1.2 Cr, median ₹85 L. What does that tell you? Vote in the poll 👇

📌 Save this and run it before every model.
🔜 Tomorrow, Day 6: features and labels, and how to choose good features.

Follow @curious_datascientist for data science made simple 🚀

#eda #exploratorydataanalysis #machinelearning #100daysofml #datascience #dataanalysis #statistics #learnmachinelearning

## Poll

- **Question:** Average ₹1.2 Cr, median ₹85 L. What does it tell you?
- **Options:** A Prices are symmetric · B A few costly flats pull it up · C The data has an error · D The median is wrong

## Pinned comment

✅ Answer: B! When the average is much higher than the median, a few very large values are pulling the average up: the data is right-skewed. That's normal for prices and salaries, and it's why the median is the better "typical" number here. Did you get it? 👇
