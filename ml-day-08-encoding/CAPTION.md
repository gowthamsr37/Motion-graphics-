# Day 8 caption: Encoding Categories

## Caption

We coded Bangalore localities as 1 to 5… and our model decided Koramangala is 5× Whitefield. 🤯

Models only read numbers, but HOW you turn text into numbers decides what they learn. Day 8 of #100DaysOfML: encoding categories, the complete guide.

🧩 2 kinds: nominal (no order: locality) vs ordinal (real order: unfurnished < semi < fully)
❌ The beginner mistake: label encoding on nominal data invents a fake order
🛠 6 methods: ordinal encoding · one-hot encoding · drop one (dummy variable trap) · group rare labels into OTHER · target encoding (smoothed) · handle unknown categories
⚠️ The trap: target encoding uses the price, so fit it on training data only (out-of-fold), or the model peeks at test answers

💾 Save this: you'll need it in every project.
👉 Follow @curious_datascientist for Day 9: Feature Scaling.

## Poll (add the Instagram poll sticker)

Furnishing is unfurnished / semi / fully furnished. Which encoding fits best?
A) One-hot  B) Ordinal  C) Target  D) Drop the column

## Pinned comment

✅ Answer: B) Ordinal encoding. Furnishing has a real order (unfurnished < semi < fully), so set it yourself: 0, 1, 2. One-hot would throw that order away, and letting the computer sort alphabetically gives fully = 0, unfurnished = 2: backwards! Did you get it? 👇

## Hashtags

#100DaysOfML #MachineLearning #DataScience #FeatureEngineering #OneHotEncoding #Python #DataScientist #LearnML
