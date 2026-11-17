# Instagram caption

A food app 🛵 says its average delivery time is 32 minutes. But it only checked 100 orders. How sure can it be? That's exactly what a CONFIDENCE INTERVAL answers.

📖 The definition, in simple words:
1️⃣ A RANGE of values, not just one number
2️⃣ that likely contains the TRUE average
3️⃣ with a CONFIDENCE LEVEL (like 95%) that says how reliable the range is
Example: 30 to 34 minutes.

🤔 Why a range? Every sample gives a slightly different average: check another 100 orders and you might get 31, or 33.5. One number alone hides that wobble.

🧮 How to build it: sample average ± margin of error
• Standard error = spread ÷ √(sample size) = 10 ÷ √100 = 1 minute
• For 95%, go about 2 standard errors each way (1.96 to be exact)
• 32 ± 2 → 30 to 34 minutes

⚠️ The tricky part: 95% does NOT mean "a 95% chance the true average is in this one range". It means: repeat the survey many times, and about 95 out of 100 ranges will catch the true average.

📏 Want a narrower range? Collect more data. 4× the orders (400) cuts the margin in half: 32 ± 1. Only 25 orders? Use the t-distribution, and the range gets wider: about 28 to 36.

Quiz: a survey of 100 people has a margin of error of 4 points. If you survey 400 people instead, what's the new margin? Drop your answer before the reveal 👇

🔜 Next up: how do we decide if something is real? Hypothesis testing.

Follow @curious_datascientist for data science made simple 🚀

#datascience #statistics #confidenceinterval #marginoferror #standarderror #sampling #inferentialstatistics #learnoninstagram #education #datascienceforbeginners
