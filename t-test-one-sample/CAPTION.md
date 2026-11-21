# Instagram caption, poll and pinned comment

## Caption (paste this)

Same juice bottles, same average of 198 ml, same "−2"… but a DIFFERENT answer 🤯 This time we don't know sigma and only measured 9 bottles. Here's the ONE-SAMPLE T-TEST, step by step 👇

🎤 INTERVIEW ANSWER (textbook definition): "A one-sample t-test is a hypothesis test that checks whether a sample mean is significantly different from a claimed population mean, when the population standard deviation is unknown."

✅ Use it when: one average vs a claim, sigma unknown, especially with small samples.

🪜 The steps:
1️⃣ Hypotheses: H0: µ = 200 ml
   • Two-tailed H1: µ ≠ 200 (either direction)
   • One-tailed H1: µ < 200 (only "is it less?")
2️⃣ Alpha = 5%: two-tailed → 2.5% per tail; one-tailed → all 5% in the left tail
3️⃣ Formula: t = (x̄ − µ) / (s / √n). It's the z formula with s (sample SD) instead of sigma
4️⃣ s: bottles 193, 195, 197, 197, 198, 199, 199, 201, 203 → squared distances from 198 = 25, 9, 1, 1, 0, 1, 1, 9, 25 → sum 72 ÷ (n − 1 = 8) = 9 → s = √9 = 3
5️⃣ Standard error = 3 / √9 = 1 → t = (198 − 200) / 1 = −2 (same as the z-test!)
6️⃣ Degrees of freedom = n − 1 = 8. Fatter tails → bigger cut-offs
7️⃣ Two-tailed: t table, df 8, two-tailed 0.05 → critical value ±2.306. −2 is NOT in the critical region; p ≈ 0.08 > 0.05 → FAIL TO REJECT H0
8️⃣ One-tailed: critical value −1.860; p ≈ 0.04 → −2 is beyond it → REJECT. Under-filling found.

💡 The lesson: with z (sigma known), −2 was enough. With t (small sample, sigma unknown), the fatter tails need stronger evidence.

⚠️ Interview traps:
• n − 1 (not n) when you calculate s
• Sigma known or n ≥ 30? A z-test works
• Two groups to compare? That's the two-sample t-test (next video)

🧠 Quiz: two-tailed, df 8, t = −2.5. At 5%, reject H0? Vote in the poll before the answer 👇

📌 Save this for your next interview, and send it to a friend who's learning statistics.
🔜 Next: comparing two groups, the two-sample t-test. The whole Data Science Made Simple series is on my page.

Follow @curious_datascientist for data science made simple 🚀

#statistics #ttest #hypothesistesting #ttable #datascience #datascienceinterview #statisticsforbeginners #ztest

## Poll (add while writing the caption)

- **Question:** Two-tailed, df 8, t = −2.5. Reject H0 at 5%?
- **Options:** Yes · No · Almost · Can't say

## Pinned comment (post a few hours later)

✅ Answer: Yes! The critical value for df 8 (two-tailed, 5%) is ±2.306, and −2.5 is beyond −2.306, so it's in the critical region. p ≈ 0.037 < 0.05. Did you get it right? 👇
