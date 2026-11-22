# Instagram caption, poll and pinned comment

## Caption (paste this)

Brand B's battery lasts 3 hours longer than Brand A 🔋 But you only tested 5 phones each. Real difference, or just luck? Here's the two-sample t-test, fully worked out 👇

📖 Textbook definition: a two-sample t-test checks whether the means of two independent groups are significantly different, when the population standard deviations are unknown.

🔋 The data (hours):
A: 6, 8, 7, 5, 9 → average 7
B: 9, 10, 8, 11, 12 → average 10
Gap = 3 hours. But notice the overlap (8 and 9 appear in both groups)…

🪜 Step by step:
1️⃣ Hypotheses: H0: µA = µB. H1 two-tailed: µA ≠ µB. H1 one-tailed: µB > µA
2️⃣ Alpha = 5% (two-tailed: 2.5% in each tail)
3️⃣ Variance of each group: 10 ÷ (5 − 1) = 2.5
4️⃣ Pooled variance sp² = (4 × 2.5 + 4 × 2.5) ÷ 8 = 2.5
5️⃣ Standard error = √(2.5 × (1/5 + 1/5)) = √1 = 1
6️⃣ t = gap ÷ SE = 3 ÷ 1 = 3
7️⃣ Degrees of freedom = nA + nB − 2 = 8 (degrees of freedom, not a data frame 😄)
8️⃣ t table, 8 degrees of freedom, two-tailed 0.05 → critical value ±2.306
9️⃣ 3 is beyond 2.306 → inside the critical region → REJECT H0 (p ≈ 0.017)
🔟 One-tailed: critical value 1.860, p = 0.0085 → reject again

✅ Verdict: Brand B really does last longer. It's not luck.

⚠️ Interview traps:
• Same people measured twice (before vs after)? That's a PAIRED t-test
• Unequal spreads? Use Welch's t-test (equal_var=False in scipy)
• σ known or a big sample? A z-test works too

🧠 Your turn: two-tailed, 8 degrees of freedom, t = 2. Reject H0 at 5%? Vote in the poll 👇

📌 Save this for your next interview, and send it to a friend who's learning statistics.
🔜 Next: what if the data are categories? The chi-square test. Part 1 (the one-sample t-test) and z-test vs t-test are on my page.

Follow @curious_datascientist for data science made simple 🚀

#statistics #ttest #hypothesistesting #ttable #datascience #datascienceinterview #statisticsforbeginners #pvalue

## Poll (add while writing the caption)

- **Question:** Two-tailed, 8 degrees of freedom, t = 2. Reject H0 at 5%?
- **Options:** Yes · No

## Pinned comment (post a few hours later)

✅ Answer: No! With 8 degrees of freedom (two-tailed, 5%) the critical value is 2.306. t = 2 is inside ±2.306, so it's NOT in the critical region → fail to reject H0 (software: p ≈ 0.08). Close, but not enough evidence. Did you get it right? 👇
