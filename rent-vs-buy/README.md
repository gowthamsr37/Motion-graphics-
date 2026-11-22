# Money Stories — Ep 01: Arjun bought, Meera rented

A 2 min 10 s story Reel/Short (1080×1920, 30 fps, −14 LUFS) on rent vs buy, written for an Indian audience. The numbers drive the plot, but it is told as a story with two recurring characters.

## Story beats
1. **Hook:** Arjun and Meera are both 28, with the same salary, in Bangalore, and each gets ₹25 L from their parents. One buys, one rents. Twenty years later the gap is ₹1.73 Cr, but it almost went the other way.
2. **Arjun buys:** his dad says "Rent is money thrown away." He buys a ₹90 L flat: ₹18 L down payment plus ₹7 L stamp duty and registration, then a ₹72 L loan at 8.5% over 20 years. His EMI is ₹62,483 (shown as ₹62,500).
3. **Meera rents:** she pays ₹21,000 a month and puts the ₹25 L into an index fund. Each month she invests EMI + maintenance − rent, which is ₹45,500 in year 1. Her mum: "Renting? At your age?"
4. **Years 1–5:** a race chart shows Meera ₹78 L vs Arjun ₹51 L.
5. **Year 6 crash (−35%):** Meera loses ₹23 L on paper and Arjun is ahead for the first time. Family and friends push her to sell. She keeps investing.
6. **Year 20:** Arjun has a loan-free flat worth ₹2.4 Cr. Meera has ₹4.1 Cr.
7. **Twist:**
   - **Panic:** if Meera had sold in the crash and sat in FDs for 3 years, she would end with ₹2.6 Cr. That one panic costs ₹1.5 Cr.
   - **Flat prices at 8%/yr:** Arjun ends with ₹4.2 Cr and wins. The break-even is about 7.9%/yr.
8. **Lesson:** "Renting doesn't beat buying. Discipline does." It ends with the next-episode hook and an assumptions card.

## Model (`analysis/model.py` → `src/model.json`)
- **Monthly simulation over 20 years.** Arjun's net worth is the flat value minus the outstanding loan. Meera's is her portfolio.
- **Contributions:** Meera invests EMI + maintenance − rent each month. This goes negative in the last years, once rent overtakes Arjun's costs.
- **Returns:** a hypothetical yearly sequence with a geometric mean of about 9.9% and −35% in year 6.
- **Leaves out:** tax, selling costs, Arjun's tax deductions (new regime assumed), rent deposits and moving costs.

## Audio
- **Narration:** Kokoro `af_heart`. Pronunciation fixes for lakh, EMI and Meera are in `scripts/voiceover.json`.
- **Music and effects:** an original synthesized score (piano groove, a darker hush for the crash, a lift for the result) plus a UI and foley kit.

## Rebuild
```bash
python3 analysis/model.py                     # writes model2.json in the working directory → copy to src/model.json
python scripts/gen-voice.py --model <kokoro dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
```

*Educational only. Not investment advice.*
