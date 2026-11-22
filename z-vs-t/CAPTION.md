# Instagram caption, poll and pinned comment

## Caption (paste this)

Same data. Same score of −2. The z-test says REJECT, the t-test says DON'T 🤯 One question decides who's right 👇

❓ THE ONE QUESTION: do you know the population standard deviation (σ)?
✅ Yes → z-test
✅ No → t-test (at ANY sample size)

✏️ The formulas differ by just ONE letter:
z = (x̄ − µ) / (σ/√n)
t = (x̄ − µ) / (s/√n)
σ is the true spread. s is estimated from your sample, which adds uncertainty.

📉 That's why t has FATTER TAILS and needs a bigger score to reject.
The degrees of freedom (n − 1) pick which t curve you use. (And no, "df" here isn't a data frame 😄)

🪜 5% cut-off (two-tailed) by degrees of freedom:
5 → 2.571
10 → 2.228
30 → 2.042
60 → 2.000
100 → 1.984
infinite → 1.96 = z. More data and t becomes z!

🧩 Puzzle solved: a score of −2 only beats the t cut-off above 60 degrees of freedom. With 9 bottles (8 degrees of freedom) t fails to reject; z rejects. Both were right for what they knew.

⚠️ Interview trap: "use z when n > 30" is a shortcut, not the rule. σ is almost never known, so t is the default. With big n, s ≈ σ, so both agree.

🎯 Where z really shines: PROPORTIONS. A/B tests, polls, conversion rates (10% vs 12%), because SE = √(p(1 − p)/n) needs no σ.

🧠 Your turn: σ unknown, n = 200. z or t? Vote in the poll 👇 and tell me in the comments WHY.

📌 Save this for your next interview, and send it to a friend who still mixes these two up.
🔜 Next: comparing 3+ groups with ANOVA. The full z-test and t-test walkthroughs are already on my page.

Follow @curious_datascientist for data science made simple 🚀

#statistics #ztest #ttest #hypothesistesting #datascience #datascienceinterview #statisticsforbeginners #abtesting

## Poll (add while writing the caption)

- **Question:** σ unknown, n = 200. Which test?
- **Options:** z-test · t-test

## Pinned comment (post a few hours later)

✅ Answer: t-test! σ is unknown, so strictly it's t. But with n = 200 (199 degrees of freedom) the t cut-off is 1.972 vs z's 1.96, so both give almost the same answer. That's exactly why "use z for big n" works as a shortcut, but t is never wrong when σ is unknown. Did you vote t? 👇
