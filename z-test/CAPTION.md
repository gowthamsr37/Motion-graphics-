# Instagram caption, poll and pinned comment

## Caption (paste this)

A juice bottle says 200 ml. You measure 100 bottles and the average is 198 🧃 Is the company cheating you, or is it just chance? The Z-TEST settles it, step by step 👇

🎤 INTERVIEW ANSWER (textbook definition): "A z-test is a hypothesis test that checks whether a sample mean is significantly different from a population mean, when the population standard deviation is known."

✅ Use it when: you're testing an average AND sigma (the population SD) is known, or n ≥ 30.

🪜 The steps:
1️⃣ Hypotheses: H0: µ = 200 ml · H1: µ ≠ 200 ml
2️⃣ Alpha = 5%, two-tailed (2.5% in each tail)
3️⃣ Formula: z = (x̄ − µ) / (σ / √n)
   • Top: 198 − 200 = −2 (how far off we are)
   • Bottom: 10 / √100 = 10 / 10 = 1 (the standard error)
   • z = −2 / 1 = −2
4️⃣ Z table: row −2.0, column 0.00 → 0.0228 (area to the left). Two-tailed → p = 2 × 0.0228 ≈ 0.046
5️⃣ Decide: the 5% cut-off is ±1.96 (0.0250 in the table sits at −1.96). −2 is beyond −1.96 and p < 0.05 → reject H0. The machine is under-filling.

⚠️ 3 interview traps:
• Sigma unknown and a small sample → use a t-test, not z
• One-tailed (testing only "less than") → cut-off −1.645, p = 0.0228
• A z-score describes one value; a z-test tests a sample mean

🧠 Quiz: a two-tailed z-test gives z = 1.5. At 5%, do we reject H0? Vote in the poll before the answer 👇

📌 Save this for your next interview, and send it to a friend who's learning statistics.
🔜 Next: what if we don't know sigma? The t-test, with a full calculation. The whole Data Science Made Simple series is on my page.

Follow @curious_datascientist for data science made simple 🚀

#statistics #ztest #hypothesistesting #ztable #datascience #datascienceinterview #statisticsforbeginners #pvalue

## Poll (add while writing the caption)

- **Question:** Two-tailed z = 1.5. Reject H0 at 5%?
- **Options:** Yes · No · Almost · Can't say

## Pinned comment (post a few hours later)

✅ Answer: No! 1.5 is inside ±1.96, so it's not in the rejection zone. The p-value is about 0.13 (2 × 0.0668 from the z table), well above 0.05: the gap could easily be chance. Did you get it right? 👇
