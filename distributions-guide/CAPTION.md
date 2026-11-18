# Instagram caption

Every probability distribution a data scientist needs, in ONE reel 📊 What each one looks like, when to use it, and the Python code. SAVE this for later 📌

🧭 First ask one question: what am I measuring?
Counting things (how many?) · Measuring things (how long, how much?) · Testing a result?

🔵 COUNTS
1️⃣ Bernoulli: ONE try, yes or no (coin flip, buy or not, spam or not) → stats.bernoulli(p)
2️⃣ Binomial: yeses in n fixed tries (heads in 10 flips, buyers out of 100) → stats.binom(n, p)
3️⃣ Geometric: tries until the first success (calls until a sale) → stats.geom(p)
4️⃣ Poisson: events in a stretch of time (calls per hour, visits per minute) → stats.poisson(mu)
5️⃣ Uniform: every outcome equally likely (a fair dice) → stats.randint(1, 7)

🟣 MEASUREMENTS
6️⃣ Normal: values cluster around an average (heights, exam scores) → stats.norm(mean, sd)
7️⃣ Exponential: waiting time until the next event (time between customers) → stats.expon(scale=1/rate)
8️⃣ Log-normal: positive, long right tail (incomes, house prices) → stats.lognorm(s, scale=median)
9️⃣ Pareto: a few giants hold most, the 80/20 rule (wealth, city sizes) → stats.pareto(b, scale=xmin)

🟠 TESTING TOOLS
🔟 t-distribution: like the bell, fatter tails, small samples (t-tests) → stats.t(df)
1️⃣1️⃣ Chi-square: do counts match what you expected? (is a dice fair?) → stats.chi2(df)

🟢 BONUS
1️⃣2️⃣ Bimodal: two humps = two groups mixed (lunch + dinner rush). Split them first! → GaussianMixture(2)

🛠️ In practice: 1. plot a histogram, 2. match the shape, 3. fit it in Python and check with a Q-Q plot.
(stats = from scipy import stats · GaussianMixture = from sklearn.mixture)

Every distribution here has its own full video on my page 👀

Quiz: the number of emails you get every hour. Which distribution fits best? Drop your answer before the reveal 👇

📤 Send this to a friend who's learning data science!

🔜 Next up: how sure can we be about an average? Confidence intervals.

Follow @curious_datascientist for data science made simple 🚀

#datascience #statistics #probabilitydistribution #cheatsheet #machinelearning #python #scipy #datascientist #learnoninstagram #datascienceforbeginners
