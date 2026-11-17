# Instagram caption

Roll a dice 60 times 🎲 Each face should come up about 10 times. But a six comes up 16 times. Is the dice unfair, or is it just luck? The CHI-SQUARE DISTRIBUTION answers that.

📖 The definition, in simple words:
1️⃣ Chi-square measures the gap between the counts we SEE and the counts we EXPECT
2️⃣ The chi-square distribution shows how big that gap can get JUST BY LUCK

🔢 Our 60 rolls: 8, 9, 12, 11, 4, 16 (expected: 10 each)

🧮 The score, step by step:
• Gap from 10: −2, −1, +2, +1, −6, +6
• Square it: 4, 1, 4, 1, 36, 36 (every gap positive, big gaps count more)
• Divide by 10: 0.4, 0.1, 0.4, 0.1, 3.6, 3.6
• Add them up: score = 8.2

📊 Even a fair dice never matches perfectly. Simulate many fair dice and their scores form the chi-square shape: it starts at 0 with a long tail to the right. Degrees of freedom = 6 faces − 1 = 5.

⚖️ The verdict: 95% of fair dice score below 11.1. Our 8.2 is inside that zone; a fair dice scores this high about 15% of the time. Could easily be luck!

💼 Data scientists use it to test counts everywhere: sales across the week, or what different groups of customers choose.

Quiz: another dice scores 20, with the same 5 degrees of freedom. Fair, or suspicious? Drop your answer before the reveal 👇

🔜 Next up: the complete cheat sheet of every distribution.

Follow @curious_datascientist for data science made simple 🚀

#datascience #statistics #chisquare #chisquaretest #probability #hypothesistesting #goodnessoffit #learnoninstagram #education #datascienceforbeginners
