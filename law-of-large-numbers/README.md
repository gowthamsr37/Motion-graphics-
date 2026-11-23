# Why the Casino Never Loses: The Law of Large Numbers

A Data Science Made Simple reel for **@curious_datascientist** (the statistics series, not 100 Days of ML). House style throughout: navy backdrop, Sora / Inter / JetBrains Mono, the neon accents, house panels, pills and captions, FOLLOW end card, 112 BPM score + SFX, Kokoro `af_heart` at 1.05×, −14 LUFS. About 2:58, 1080×1920, 30 fps. Growth rules: a frame-0 title card listing everything covered, a puzzle hook (the casino), a save moment, an A/B/C/D caption poll and a CAPTION.md. Money in Rs (₹ in the caption).

## Deliverables (in `out/`, built by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Law_Of_Large_Numbers.mp4` | the finished Reel |
| `Law_Of_Large_Numbers_Cover.png` | the cover: WHY THE CASINO NEVER LOSES?, roulette wheel with the green zero glowing, "THE SECRET: 2.7%", THE LAW OF LARGE NUMBERS, short term: luck · long term: maths, SAVE THIS ONE, handle |
| `Law_Of_Large_Numbers.srt` | the subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Title card (frame 0)** | WHY THE CASINO / NEVER LOSES / THE LAW OF LARGE NUMBERS; a spinning European roulette wheel with the ball; chips THE EDGE · COIN TEST · THE LAW · REAL LIFE · GAMBLER'S TRAP by ~1.5 s, each glowing as named; SAVE THIS ONE. |
| 2 | **Hook** | "every night in Goa…" A PLAYER, TONIGHT: +Rs 4,50,000 with a chip shower; THE CASINO: never loses, with a profit line climbing Jan → Dec; RIGGED? struck out, JUST MATHS. |
| 3 | **The tiny edge** | The wheel settles; 18 RED · 18 BLACK · 1 GREEN; bar YOU WIN 48.6% vs HOUSE 51.4%; the green zero glows; HOUSE EDGE 2.7%; every Rs 100 → casino keeps Rs 2.70. |
| 4 | **One night vs millions** | YOU · ONE NIGHT: five WINs in a row, "pure luck"; THE CASINO · MILLIONS: a field of spins and a counter racing past 80 lakh; "over millions of spins, luck stops mattering". |
| 5 | **Coin experiment** | A flipping coin, true chance 50%; the running share of heads on a log scale of flips, stopping at 10 → 70% (way off), 100 → 54% (closer), 1,000 → 50.8%, 10,000 → 50.1%, with readout cards. |
| 6 | **The law** | THAT'S THE LAW OF LARGE NUMBERS; "more trials → the average gets closer to the expected value" with a settling line; INTERVIEW ANSWER: x̄ₙ → μ as n → ∞, "the sample mean converges to the population mean". |
| 7 | **The casino's year** | 10,00,000 bets × Rs 100 = Rs 10 crore bet; × 2.7% edge = Rs 27 lakh expected; profit scale Rs 0–50L with a narrow green band Rs 25L–29L and a jittering marker that never leaves it, "almost every time"; SHORT TERM: LUCK · LONG TERM: MATHS. |
| 8 | **Real life** | INSURANCE (which driver crashes? unknown · how many of 10 lakh? known → your premium); CRICKET (average after 3 innings 92.0 ✗, after 100 innings 44.6 ✓); RATINGS (5.0 from 3 reviews ✗, 4.6 from 5,000 reviews ✓). |
| 9 | **The gambler's fallacy** | THE TRAP; five REDs in a row; BLACK IS DUE? struck out; the wheel with a NO MEMORY stamp, "every spin: 48.6%"; then "not corrected: drowned out", with the 5 old reds lost in a sea of new spins; THE GAMBLER'S FALLACY. |
| 10 | **Remember this + save** | SMALL SAMPLES CAN LIE (jumpy line, n = 10) vs LARGE SAMPLES TELL THE TRUTH (settling line, n = 10,000); SAVE THIS; "send it to the friend who says 'this time I'll win'". |
| 11 | **Poll, teaser, end card** | YOUR TURN!; coin; "when are you MOST likely to get more than 60% heads?" A 10 flips · B 100 flips · C 1,000 flips · D Same chance; VOTE IN THE CAPTION POLL; NEXT · BEFORE vs AFTER: THE PAIRED t-TEST; house FOLLOW end card. |

## Accuracy notes

- European roulette: 37 pockets (0–36), one green zero. Red pays even money: P(win) = 18/37 = 48.65%, P(lose) = 19/37 = 51.35%; house edge = 1/37 = 2.70%; expected loss per Rs 100 = Rs 2.70.
- Casino year: 10,00,000 bets of Rs 100 = Rs 10 crore. Expected profit = Rs 27.0 lakh. Per-bet SD ≈ Rs 100, so the SD of the total ≈ Rs 100 × √10,00,000 = Rs 1 lakh, and ±2 SD gives about Rs 25–29 lakh.
- Coin data: mulberry32 seed 222211, cumulative heads 7/10, 54/100, 508/1,000, 5,010/10,000 (drawn in `src/components/Casino.tsx`).
- Poll answer A: P(≥7 heads in 10) = 17.2%; P(≥61 in 100) = 1.8%; P(≥601 in 1,000) ≈ 0.
- The batting averages (92.0 after 3 innings, 44.6 after 100) are illustrative.

## Rebuild

```bash
SP=<scratchpad>; $SP/venv/bin/python scripts/gen-voice.py --model $SP/models/kokoro --whisper $SP/models/whisper-small-en
BROWSER=<chrome-headless-shell> bash scripts/build.sh
```

## Voiceover script (timestamps are on the finished video)

**S1 · Title card** (0:00.00–0:10.30)
- `0:00.20` Why does the casino never lose? The law of large numbers.
- `0:03.78` The tiny edge, a coin experiment, the law, real-life uses, and the gambler's mistake. Save this one!

**S2 · Hook** (0:10.30–0:21.67)
- `0:10.60` Every night in Goa, someone walks out of a casino with lakhs in their pocket.
- `0:14.82` Yet the casino itself never loses. Not this month. Not this year.
- `0:19.02` Is the game rigged? No. It's just maths.

**S3 · The tiny edge** (0:21.67–0:46.44)
- `0:21.97` Take roulette. The wheel has 37 pockets: 18 red, 18 black, and one green zero.
- `0:28.09` Bet on red: 18 out of 37. A 48.6% chance.
- `0:32.95` The casino wins the other 51.4%. That one green zero gives the house an edge of just 2.7%.
- `0:40.87` So for every Rs 100 bet, the casino keeps about Rs 2.70, on average.

**S4 · One player vs millions of spins** (0:46.44–0:59.28)
- `0:46.74` For you, one night is pure luck. You might win five spins in a row and go home rich.
- `0:51.87` But the casino isn't playing one night. It's playing millions of spins. And over millions of spins, luck stops mattering.

**S5 · Coin flip experiment** (0:59.28–1:14.94)
- `0:59.58` Let's prove it with a fair coin. The true chance of heads is 50%.
- `1:03.75` 10 flips: 7 heads. 70%. Way off.
- `1:07.04` 100 flips: 54%. Closer.
- `1:09.96` 1,000: 50.8%. 10,000: 50.1%.

**S6 · The law** (1:14.94–1:29.35)
- `1:15.25` That's the law of large numbers.
- `1:17.18` As the number of trials grows, the average result gets closer and closer to the expected value.
- `1:22.98` In interview language: the sample mean converges to the population mean as the sample size grows.

**S7 · Back to the casino** (1:29.36–1:49.19)
- `1:29.66` Say the casino takes 10 lakh bets of Rs 100 in a year. That's Rs 10 crore bet.
- `1:35.36` The edge says it keeps 2.7%: Rs 27 lakh.
- `1:39.48` And with that many bets, its real profit lands between about Rs 25 and 29 lakh, almost every time.
- `1:46.30` Short term, it's luck. Long term, it's maths.

**S8 · Real-life uses** (1:49.19–2:15.95)
- `1:49.49` This law runs real life too.
- `1:51.36` Insurance: nobody knows which driver will crash, but across 10 lakh drivers, the company knows almost exactly how many will. That sets your premium.
- `2:00.63` Cricket: a batting average after 3 innings means nothing. After 100 innings, it shows who the player really is.
- `2:07.77` Ratings: 5 stars from 3 reviews? Don't trust it. 4.6 stars from 5,000 reviews is the real picture.

**S9 · The gambler's fallacy** (2:15.95–2:35.10)
- `2:16.25` But here's the trap. After five reds in a row, people bet on black: it's due.
- `2:20.89` It isn't. The wheel has no memory. Every spin is still 48.6%.
- `2:26.22` The average evens out, not because the wheel corrects itself, but because millions of new spins drown out the old ones. That's the gambler's fallacy.

**S10 · Remember this** (2:35.09–2:43.98)
- `2:35.40` So remember: small samples can lie. Large samples tell the truth.
- `2:39.59` Save this, and send it to the friend who says "this time I'll definitely win."

**S11 · Poll, teaser and CTA** (2:43.98–2:57.87)
- `2:44.33` Your turn: with a fair coin, when are you most likely to get more than 60% heads? 10 flips, 100, or 1,000? Vote in the caption poll!
- `2:53.42` Next: the paired t-test.
- `2:55.15` Follow for data science made simple!

total 177.874
