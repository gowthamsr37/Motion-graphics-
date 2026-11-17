# The Pareto Distribution Explained in 2 Minutes

The nineteenth **Data Science Made Simple** Reel for **@curious_datascientist**: the 80/20 rule, the long tail, and why the average misleads. 2:16, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

This is the first of the "explain it very well" batch. The user asked for every concept to be clear and allowed 10–15 seconds beyond the usual 2 minutes, so it has more scenes and more breathing room:
- a hook;
- a plain-words definition card;
- a ranked example in two scenes (line up the customers, then each group's share);
- a contrast with heights (the long tail);
- the average trap;
- where it shows up;
- a recap;
- a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`), with @curious_datascientist on the end card and the cover and a NEXT: LOG-NORMAL DISTRIBUTION chip on the end card.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Pareto_Distribution.mp4` | the finished Reel |
| `Pareto_Distribution_Cover.png` | 1080×1920 cover: THE PARETO DISTRIBUTION · explained in 2 minutes, "20% OF CUSTOMERS = 80% OF SALES" over the ten group bars (top two orange), @curious_datascientist |
| `Pareto_Distribution.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The few huge values (top customers, the tail) | orange |
| The many small values | cyan |
| The average (mean) | violet |
| The typical value (median), "below average" | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:12 | **Hook** | A SHOP'S CUSTOMERS: ten people pop in. On "small group" the first two glow orange and get crowns. A bracket marks **20% OF CUSTOMERS**; the ALL THE SALES bar fills **80%** orange, 20% cyan; **20% → 80%** → **THE PARETO DISTRIBUTION** with a burst · explained simply. |
| 2 | 0:12–0:28 | **The definition** | IN SIMPLE WORDS: a 4-line card that fills on the spoken words. 1 Most values are **SMALL**; 2 a few are **HUGE**; 3 a **LONG TAIL** to the right; 4 behind the **80/20 RULE**. All tick green: THAT'S THE PARETO DISTRIBUTION. |
| 3 | 0:28–0:39 | **Line them up** | Ten customers line up under BIGGEST SPENDER → SMALLEST. On "split" each gets a box, a group number (1–10) and a 10% label: **10 GROUPS · 10% OF CUSTOMERS EACH**. |
| 4 | 0:39–0:51 | **Share of all sales** | A bar rises over each group (whole-percent labels 73, 7, 5, 3, 3, 2, 2, 2, 2, 1). Group 1 turns orange: **73%**. Group 2 joins: bracket **TOP 20% = 80% OF SALES**. Groups 6–10 turn cyan: **BOTTOM HALF = 9%**. |
| 5 | 0:51–1:05 | **The long tail** | HEIGHTS: the shortest (152 cm) and tallest (188 cm) of 100 adults side by side: **only 1.2×**. SPENDING: the smallest (₹200) and biggest (₹19,000) of 100 customers as bars: **about 100×**. Then the 100 spends drop into a dot plot (₹1,000 bins): a pile on the left and four orange dots far out to the right: **RARE, BUT ENORMOUS**. |
| 6 | 1:05–1:24 | **The average trap** | The Pareto curve on ₹0–3K (SMALLEST at 200). A violet line rises: **AVERAGE ₹1,400**. A green line: **TYPICAL ₹360** · the one in the middle. The area up to the average fills green (SPEND LESS THAN AVERAGE) and ten people pop in, nine green: **9 in 10**. Tag: **LONG TAIL? USE THE MEDIAN**. |
| 7 | 1:24–1:33 | **Where it shows up** | Four cards land on their words, each with the same "a few hold most" bars: WEALTH, CITY SIZES, VIDEO VIEWS, SOFTWARE BUGS. |
| 8 | 1:33–1:45 | **Remember** | PARETO DISTRIBUTION pill and a recap flow: **MOST VALUES ARE SMALL** ↓ **A FEW ARE HUGE** ↓ **A LONG TAIL**. **TOP 20% OFTEN HOLD ABOUT 80%**; chips 80/20 · 90/10 · 70/30: **A RULE OF THUMB, NOT A LAW**. |
| 9 | 1:45–2:16 | **Quiz, teaser and CTA** | QUICK QUIZ. CRASHES BY BUG TYPE, BIGGEST FIRST (the same ten bars); a bracket: FIX THE TOP 20%. "Crashes that disappear? **HOW MANY?**" Options 20% / 80% / 50% / 100% with the 5-second countdown. **ABOUT 80%**: confetti and strikes ("that's the bugs", "too low", "not all of them"); the top two bars turn orange; **20% OF CAUSES, 80% OF THE EFFECT**. Teaser: NEXT: ANOTHER LONG TAIL · LOG-NORMAL. End card: NEXT: LOG-NORMAL DISTRIBUTION, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Most are small · A few are huge · Long tail · 80/20 rule. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "Pareto" is phoneme-patched to *pa-RAY-toh*, and "fourteen" is patched to stress its second syllable.

**S1 · Hook** (0:00.00–0:12.00)
- `0:00.45` In many shops, a small group of customers brings in most of the money.
- `0:04.60` Often, just 20% of the customers bring in 80% of the sales.
- `0:09.37` That's the Pareto distribution.

**S2 · The definition** (0:12.00–0:28.23)
- `0:12.45` Here's the definition, in simple words.
- `0:15.05` In a Pareto distribution, most values are small.
- `0:18.43` But a few values are huge.
- `0:20.32` So the shape starts high, and stretches into a long tail on the right.
- `0:24.44` It's the idea behind the famous 80/20 rule.

**S3 · Line them up** (0:28.23–0:38.84)
- `0:28.68` Take a shop's customers, and line them up from the biggest spender to the smallest.
- `0:33.23` Now split them into 10 equal groups. Each group is 10% of the customers.

**S4 · The 80/20 split** (0:38.84–0:51.15)
- `0:39.28` The top group alone brings in 73% of all the sales.
- `0:43.37` Add the second group, and the top 20% bring in 80%.
- `0:47.50` And the whole bottom half? Only about 9%.

**S5 · The long tail** (0:51.15–1:04.65)
- `0:51.60` Compare that with height.
- `0:53.12` Heights cluster around an average. Nobody is ten times taller than you.
- `0:57.43` But one customer can spend a hundred times more than another.
- `1:00.81` That's the long tail: rare, but enormous values.

**S6 · The average trap** (1:04.65–1:23.62)
- `1:05.10` This makes the average misleading.
- `1:07.17` The average customer spends about 1,400 rupees.
- `1:10.84` But the typical customer, the one in the middle, spends only about 360.
- `1:16.03` In fact, 9 out of 10 customers spend less than the average.
- `1:19.87` So for long-tailed data, the median tells you more.

**S7 · Where it shows up** (1:23.62–1:33.40)
- `1:24.07` A few people hold most of the wealth. A few cities are giant. A few videos get most of the views. And a few bugs cause most of the crashes.

**S8 · Remember** (1:33.40–1:44.94)
- `1:33.85` So remember: most values are small, a few are huge, and the tail is long.
- `1:38.61` The top 20% often hold about 80%. But that's a rule of thumb, not a law.

**S9 · Quiz, teaser and CTA** (1:44.94–2:15.53)
- `1:45.29` Quick quiz!
- `1:46.32` An app's crashes come from many bugs, and they follow the 80/20 rule.
- `1:50.59` If the team fixes the top 20% of bugs, about how many crashes disappear?
- `2:00.90` About 80%!
- `2:02.42` The top 20% of causes bring about 80% of the effect. So fix the big ones first.
- `2:08.44` Next: another long tail, the log-normal distribution.
- `2:12.26` Follow for data science made simple!

*(Between "…about how many crashes disappear?" and "About 80%!": the 5-second countdown, music only.)*

## Accuracy notes (every number checked)

- **Definition:** the Pareto distribution (type I) with minimum x_m and shape α has P(X > x) = (x_m / x)^α for x ≥ x_m. The density α x_m^α / x^(α+1) is highest at x_m and falls into a long right tail.
- **The 80/20 shape:** α = log₄5 ≈ **1.161** gives exactly 80/20. The share of the total held by the top fraction q is q^(1 − 1/α) (the Pareto Lorenz curve), so q = 0.2 gives 0.80.
- **Scenes 3–4, exact shares for α = log₄5:**
  - Groups 1–10 (top 10% first) hold 72.7, 7.3, 4.6, 3.4, 2.8, 2.3, 2.0, 1.8, 1.6 and 1.5% (shown rounded: 73, 7, 5, 3, 3, 2, 2, 2, 2, 1).
  - Top 20% = **80.0%**; bottom half = 1 − 0.5^0.139 = **9.2%** ("about 9%").
- **Scene 6** (same α, minimum ₹200):
  - Mean = α x_m/(α − 1) = **₹1,442** ("about 1,400").
  - Median = x_m · 2^(1/α) = **₹363** ("about 360").
  - P(X < mean) = 1 − (x_m/mean)^α = **89.9%** ("9 out of 10").
- **Scene 5:** the dots are 100 evenly spaced quantiles, not random draws.
  - Heights: Normal(170, 7) cm, range 152–188, ratio 1.24 ("1.2×").
  - Spends: the Pareto above, range ₹201–₹19,188, ratio 95 ("about 100×").
  - These 100 dots illustrate the shape only. Their own average (₹869) is below the population mean, because the far tail that pulls the true mean up is too rare to appear in 100 customers; that is also why the scene 6 numbers use the exact population values.
- **Rule of thumb:** real data rarely splits exactly 80/20; 90/10 and 70/30 are common. Wealth, city sizes, video views and software bug impact are standard heavy-tailed, roughly Pareto examples.
- **Quiz:** under an exact 80/20 Pareto, the top 20% of bug types cause 80% of crashes, so fixing them removes **about 80%**.
  - The distractors: 20% (the share of bugs, not crashes), 50% (too low), 100% (the other 80% of bug types still cause 20%).

## Audio

Same score engine and kit as the series, re-timed for 9 scenes:
- Hook: intro, hops as the customers appear, a sparkle on the top two, a glide as the sales bar fills, and the riser, impact and crash on "Pareto".
- Definition: calm "flow", with a blip per line.
- Line-up and the split: marimba "play", with hops, ticks on the group boxes, and pops and a ding on 73%, 80% and 9%.
- Long tail, average trap and uses: groove, with an impact under "a hundred times", tail ticks after "long", pops on the markers and hops for the nine people.
- Recap: build.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `which-distribution/` (`REF=which-distribution bash .claude/skills/data-science-explainer/new-video.sh pareto-distribution ParetoDistribution Pareto_Distribution`). It adds:
- `src/data.ts`: the exact heights, spends and decile shares;
- `src/components/Curve.tsx`, a general kit for the later Reels:
  - `FnCurve`, which plots any density with bands, a sweep and a dashed variant;
  - `ValueAxis`, `Marker`, `Badge` and `Bracket`.
