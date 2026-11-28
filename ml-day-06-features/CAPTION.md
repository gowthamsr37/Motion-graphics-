# Instagram caption, poll and pinned comment

## Caption (paste this)

This model predicts Bangalore flat prices with 99% accuracy… and it's completely USELESS 😳 Can you spot why? 👇

🧩 DAY 6 / 100: FEATURES, LABELS + THE 6 TESTS EVERY GOOD FEATURE MUST PASS

The reveal: one input was STAMP DUTY PAID. Stamp duty is calculated from the sale price, so the model was secretly reading the answer. Before the flat is sold, that number doesn't even exist.

📖 The words:
• LABEL (target) = what you predict → the price
• FEATURES = the inputs → area, bedrooms, locality, age
• Check the label too: asking price or SOLD price? Wrong label = everything after is wrong.

✅ The 6 tests:
1️⃣ DATA LEAKAGE: will you know it at prediction time? Stamp duty, days on market, final discount → only after the sale. Not a feature.
2️⃣ RELEVANCE: is it really related? Listing ID, broker's phone number → the model finds fake patterns in noise.
3️⃣ REDUNDANCY: is it a duplicate? Area in sq ft AND sq m = the same info twice. Keep one.
4️⃣ MISSINGNESS: is it filled in enough? Parking type blank for 70% → drop it, or keep a "has parking info" flag.
5️⃣ LOW VARIANCE: does it vary? City = Bangalore in every row explains nothing. Remove it.
6️⃣ FAIRNESS + PROXIES: never use religion or caste, and watch for proxies that sneak them back in. If you couldn't defend it in public, don't use it.

💡 The best features are BUILT, not found: build year → age, address → distance to the nearest metro.

🧠 Your turn: which is the best feature for predicting a flat's price? Vote in the poll 👇

📌 Save this and run every feature through it.
🔜 Tomorrow, Day 7: handling missing values, in depth.

Follow @curious_datascientist for data science made simple 🚀

#machinelearning #100daysofml #featureengineering #datascience #dataleakage #learnmachinelearning #datascientist #ai

## Poll

- **Question:** Best feature for predicting a flat's price?
- **Options:** A Listing ID · B Stamp duty paid · C Distance to metro · D City name

## Pinned comment

✅ Answer: C, distance to metro! It's known before the sale, it's genuinely related to price, and it varies across flats. Listing ID is random noise, stamp duty leaks the answer (it's calculated from the price), and city name is the same for every row. Did you get it? 👇
