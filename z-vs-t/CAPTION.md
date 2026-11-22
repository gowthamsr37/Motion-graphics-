# Instagram caption, poll and pinned comment

## Caption (paste this)

Same data, same score of −2. The z-test says REJECT. The t-test says DON'T 🤯 Who's right? Here's z-test vs t-test, the complete comparison 👇

🎤 TEXTBOOK DEFINITIONS:
• z-test: compares a sample mean with a population mean when the population standard deviation (sigma) is KNOWN.
• t-test: does the same when sigma is UNKNOWN and has to be estimated from the sample.

✏️ The formulas differ by ONE letter:
z = (x̄ − µ) / (σ/√n)   vs   t = (x̄ − µ) / (s/√n)
σ is the true spread; s is estimated from the sample → extra uncertainty, especially for small samples.

📉 That's why t has FATTER TAILS. The degrees of freedom (n − 1, NOT a data frame 😄) pick the t curve; by about 30 it looks almost normal.

🪜 The 5% cut-off ladder (two-tailed):
Degrees of freedom → 5% cut-off: 5 → 2.571 · 10 → 2.228 · 30 → 2.042 · 60 → 2.000 · 100 → 1.984 · infinite → 1.96 (z). t becomes z!

🧩 The puzzle: a score of −2 only beats the t cut-off with more than 60 degrees of freedom. 9 bottles (8 degrees of freedom): fail to reject. 100 bottles: reject. Both tests were right for what they knew.

✅ Which one? Ask: do you know sigma? Yes → z. No → t (at any sample size). Big sample → almost the same answer.

⚠️ Interview trap: "use z when n > 30" is a rule of thumb, not the definition. In practice sigma is rarely known, so t is the default (with big n, s ≈ σ, so z works as an approximation).

🎯 Where z really lives: PROPORTIONS. A/B tests, polls, conversion rates (10% vs 12%?). SE = √(p(1 − p)/n), no sigma needed.

📏 Same cut-offs build confidence intervals: x̄ ± 1.96·σ/√n vs x̄ ± t·s/√n (small-sample t intervals are a little wider).

🧠 Quiz: sigma unknown, n = 200. z or t? Vote in the poll 👇

📌 Save this comparison for your next interview, and send it to a friend who's learning statistics.
🔜 Next: comparing three or more groups, ANOVA. The full z-test and t-test walkthroughs are on my page.

Follow @curious_datascientist for data science made simple 🚀

#statistics #ztest #ttest #hypothesistesting #datascience #datascienceinterview #statisticsforbeginners #abtesting

## Poll (add while writing the caption)

- **Question:** Sigma unknown, n = 200. Which test?
- **Options:** z-test · t-test

## Pinned comment (post a few hours later)

✅ Answer: strictly, the t-test, because sigma is unknown. But with n = 200 (199 degrees of freedom) the t cut-off is 1.972 vs z's 1.96, so both give almost the same answer. That's why "use z for big n" works as a shortcut. Did you vote t? 👇
