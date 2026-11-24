# Instagram caption, poll and pinned comment

## Caption (paste this)

Stop watching theory. Build your FIRST machine learning project today 👇 (copy the checklist + code below)

🛠️ DAY 3 / 100: YOUR FIRST ML PROJECT, STEP BY STEP
Project: predict flat prices in Bangalore 🏙️

1️⃣ PROBLEM DEFINITION: write ONE sentence.
"Predict flat price (₹ lakh) using area, bedrooms, location, age. Success = off by < ₹8 lakh."
Can't write it? Don't start coding.

2️⃣ DATA COLLECTION: free sources: Kaggle, data.gov.in, your own spreadsheet. A few thousand rows is plenty.
import pandas as pd
df = pd.read_csv("bangalore_flats.csv")

3️⃣ DATA CLEANING: run these 4 checks EVERY time:
df.isnull().sum()   → missing values
df = df.drop_duplicates()   → duplicates
df.describe()   → impossible values (12,000 sq ft with 1 bedroom?)
outliers   → one ₹50 crore villa confuses a flat model
Fix: fill missing with the median, drop dupes, fix or remove typos.

4️⃣ EXPLORATORY DATA ANALYSIS (EDA): price vs size · average price by area of the city · histogram of prices.

5️⃣ TRAIN-TEST SPLIT (before training):
from sklearn.model_selection import train_test_split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)
Lock the test set until the end.

6️⃣ MODEL TRAINING (start simple):
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_tr, y_tr)
preds = model.predict(X_te)

7️⃣ MODEL EVALUATION (beat the baseline):
Guessing the average price: off by ₹22 lakh. Our model: off by ₹7 lakh (mean absolute error). Under the ₹8 lakh target ✅
Then DEPLOYMENT: a free Streamlit app, and retrain when new sales come in.

✅ CHECKLIST (screenshot it): problem definition → data collection → data cleaning → EDA → train-test split → model training → model evaluation (→ deployment)

🧠 Your turn: you've just loaded a new dataset. What's the FIRST thing you run? Vote in the poll 👇

📌 Save this and send it to the friend who keeps saying they'll start ML "someday".
🔜 Tomorrow, Day 4: cleaning messy data, hands-on.

Follow @curious_datascientist for data science made simple 🚀

#machinelearning #100daysofml #python #datascience #mlproject #learnmachinelearning #pandas #sklearn

## Poll

- **Question:** New dataset loaded. What do you run FIRST?
- **Options:** A Train a model · B Check missing values · C Deploy an app · D Tune the model

## Pinned comment

✅ Answer: B, check for missing values (and the other cleaning checks)! A model trained on messy data gives messy predictions: garbage in, garbage out. df.isnull().sum() takes one second and can save you hours. Comment "CODE" if you want the full notebook for this project 👇
