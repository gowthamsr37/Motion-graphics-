# Instagram caption, poll and pinned comment

## Caption (paste this)

Brand B says its battery lasts longer 🔋 You test 5 phones of each: A averages 7 hours, B averages 10. Real difference, or just luck? The T-TEST settles it, step by step 👇

🎤 INTERVIEW ANSWER (textbook definition): "A two-sample t-test is a hypothesis test that checks whether the means of two independent groups are significantly different, when the population standard deviations are unknown."

✅ Use it when: you compare the averages of TWO SEPARATE groups, sigma is unknown, and the samples are small.

🪜 The steps:
1️⃣ Hypotheses: H0: µA = µB (same average)
   • Two-tailed H1: µA ≠ µB (different in EITHER direction)
   • One-tailed H1: µB > µA (ONE direction: does B last longer?)
2️⃣ Alpha = 5%: two-tailed splits it (2.5% per tail); one-tailed puts all 5% in the right tail
3️⃣ Formula: t = (x̄B − x̄A) / √( sp² (1/nA + 1/nB) )
   • Averages: A = 7, B = 10 → gap = 3
   • Variances: A: (6,8,7,5,9) squared distances from 7 = 1,1,0,4,4 → 10 ÷ (n − 1 = 4) = 2.5. B: also 2.5
   • Pooled variance sp² = (4×2.5 + 4×2.5) ÷ 8 = 2.5
   • Standard error = √(2.5 × (1/5 + 1/5)) = √1 = 1
   • t = 3 ÷ 1 = 3
4️⃣ Degrees of freedom: nA + nB − 2 = 8. Small samples → fatter tails → bigger cut-offs than z's 1.96
5️⃣ Two-tailed decision with the t table: row df 8, two-tailed 0.05 → CRITICAL VALUE ±2.306. Beyond it is the CRITICAL REGION (area = alpha). t = 3 is inside it. p: 3 sits between 2.896 and 3.355 → 0.01 < p < 0.02 (software: 0.017) → reject H0
6️⃣ One-tailed decision: one-tailed 0.05 column → critical value 1.860; p halves to 0.0085. 3 > 1.860 → reject again. Brand B really lasts longer.

⚠️ Interview traps:
• Same people measured twice (before/after)? That's a PAIRED t-test, not two-sample
• Sigma known or a big sample (30+)? A z-test works
• Unequal spreads? Use Welch's t-test (equal_var=False in scipy)

🧠 Quiz: a two-tailed t-test with df 8 gives t = 2. At 5%, do we reject H0? Vote in the poll before the answer 👇

📌 Save this for your next interview, and send it to a friend who's learning statistics.
🔜 Next: what if the data are categories? The chi-square test, with a full calculation. The whole Data Science Made Simple series is on my page.

Follow @curious_datascientist for data science made simple 🚀

#statistics #ttest #hypothesistesting #ttable #datascience #datascienceinterview #statisticsforbeginners #pvalue

## Poll (add while writing the caption)

- **Question:** Two-tailed, df 8, t = 2. Reject H0 at 5%?
- **Options:** Yes · No · Almost · Can't say

## Pinned comment (post a few hours later)

✅ Answer: No! The critical value for df 8 (two-tailed, 5%) is 2.306, and 2 is inside ±2.306, so it's not in the critical region. In the t table, 2 sits below 2.306, so p > 0.05 (software: p ≈ 0.08). Did you get it right? 👇
