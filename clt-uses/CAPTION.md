# Instagram caption, poll and pinned comment

## Caption (paste this)

How can a poll of just 1,000 people predict an election with millions of voters? 🗳️ The answer is the Central Limit Theorem 👇

1️⃣ Each voter says yes or no. As data, that's just two bars: nothing like a bell curve.

2️⃣ But the poll result is an AVERAGE. Yes = 1, no = 0 → 520 yeses out of 1,000 = 0.52 = 52%.

3️⃣ Run the same poll again and again with different people: 51%, 53%, 52%, 50%, 54%… Stack the results and they form a bell curve. That's the CLT: averages form a bell, even when each answer is just yes or no.

4️⃣ How wide is the bell? Standard error = √(p(1 − p)/n) = √(0.52 × 0.48 / 1,000) ≈ 1.6%

5️⃣ 95% of results land within about 2 standard errors → 2 × 1.6% ≈ 3% → "52% ± 3%". That ± is the margin of error, and 49–55% is the 95% confidence interval.

6️⃣ Want a smaller margin? Ask 4× the people: 4,000 voters → ± 1.5%.

🔁 Similarly, the CLT is used in:
📱 A/B tests: the average spend per user, version A vs B
🏭 Factories: the average weight of 5 bottles, checked every hour
🛡️ Insurance: the average claim of thousands of customers sets the premium
🤖 Machine learning: test accuracy is an average of right/wrong predictions

🧵 The rule: single values can be messy, but averages form a bell, and the bell tells you how sure to be.

🧠 Quiz: one customer's spend is skewed. Is the average spend of 500 customers roughly normal? Vote in the poll 👇

📌 Save this, and send it to a friend who's learning data science.
🔜 Next: comparing three or more groups, ANOVA.

Follow @curious_datascientist for data science made simple 🚀

#statistics #centrallimittheorem #datascience #marginoferror #confidenceinterval #datascienceinterview #statisticsforbeginners #normaldistribution

## Poll (add while writing the caption)

- **Question:** One customer's spend is skewed. Is the average of 500 customers roughly normal?
- **Options:** Yes · No

## Pinned comment (post a few hours later)

✅ Answer: Yes! That's the Central Limit Theorem: individual spends stay skewed, but the AVERAGE of 500 independent customers is roughly normal (unless the spending has extremely heavy tails, where you'd need even more data). Did you get it right? 👇
