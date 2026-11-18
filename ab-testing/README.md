# A/B Testing Explained in 2 Minutes

The twenty-eighth **Data Science Made Simple** Reel for **@curious_datascientist**. It covers A/B testing: show two versions to two random groups, then let a hypothesis test decide whether the difference is real. 1:59, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

This is the fifth and last Reel of the inference batch (confidence intervals → hypothesis testing → p-value → Type I vs Type II errors → **A/B testing**). It puts everything together on one running example, a green vs an orange Buy button, and covers:
- a plain-words definition;
- the random split (10,000 visitors, 100 dots that shuffle into two groups);
- the results (8% vs 9.2%);
- the test (null, the "gap if nothing's going on" curve, p = 0.03);
- the decision (reject, a 15% lift, ship it);
- three classic mistakes (peeking, no sample-size plan, many changes at once);
- a recap and a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: THE t-TEST chip.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `AB_Testing.mp4` | the finished Reel |
| `AB_Testing_Cover.png` | 1080×1920 cover: A/B TESTING · explained in 2 minutes, "WHICH BUTTON SELLS MORE?" with phone A (green BUY NOW) vs phone B (orange BUY NOW), @curious_datascientist |
| `AB_Testing.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Version A (the green button) | green |
| Version B (the orange button), the surprising tails | orange |
| The null, the random split | cyan |
| The test, the p-value | violet |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:08 | **Hook** | Two phone mockups with a product card, a price and a BUY NOW button, one green and one orange: **WHICH ONE SELLS MORE?** → **DON'T GUESS. TEST IT.** → the title **A/B TESTING** with a burst; the phones get their **A** and **B** tags; EXPLAINED SIMPLY. |
| 2 | 0:08–0:20 | **The definition** | IN SIMPLE WORDS: 1 show **TWO VERSIONS** (A / B chips); 2 to **RANDOM GROUPS** (people icon); 3 a **HYPOTHESIS TEST** decides. Then THAT'S A/B TESTING. |
| 3 | 0:20–0:33 | **The setup** | **10,000 VISITORS**: 100 dots (100 visitors each) fill a grid, then **SPLIT AT RANDOM**: each dot flies to a random half and turns green or orange, 50 / 50. Under each half: **5,000** SEE GREEN (A) / SEE ORANGE (B) with its button. Then **ALIKE IN EVERY WAY, BUT THE BUTTON**. |
| 4 | 0:33–0:45 | **The results** | AFTER A WEEK: PURCHASES. The green bar grows to **8%** (400 OF 5,000 BOUGHT), then the orange bar to **9.2%** (460 OF 5,000). Then **REAL, OR JUST LUCK?** |
| 5 | 0:45–0:57 | **The test** | **NULL: BOTH BUTTONS CONVERT THE SAME**. IF THAT WERE TRUE, THE GAP WOULD BE...: a bell of possible gaps around 0 (GAP IN PURCHASE RATE, POINTS). The marker **OUR GAP: +1.2**. Both tails beyond ±1.2 turn orange, **1.6%** each: A GAP THIS BIG, EITHER WAY: ABOUT 3%. Then the pill **p = 0.03**. |
| 6 | 0:57–1:08 | **The decision** | **p = 0.03 < 0.05** → **REJECT THE NULL**. The orange phone wears a crown: **ORANGE WINS**, **+15%** PURCHASES (8% TO 9.2%), and a **SHIP IT!** stamp. |
| 7 | 1:08–1:21 | **Three mistakes** | WATCH OUT FOR THESE. Three red cards, each crossed out: **1 STOPPING EARLY** (PEEKING RAISES FALSE ALARMS), **2 NO SAMPLE-SIZE PLAN** (DECIDE HOW MANY USERS FIRST), **3 MANY CHANGES AT ONCE** (CHANGE ONE THING AT A TIME). |
| 8 | 1:21–1:31 | **Remember** | An A/B TESTING pill and a recap flow: **SPLIT USERS AT RANDOM** ↓ **SHOW TWO VERSIONS** ↓ **LET A HYPOTHESIS TEST DECIDE** ↓ **PLAN THE SIZE. DON'T PEEK.** |
| 9 | 1:31–1:59 | **Quiz, teaser and CTA** | QUICK QUIZ: **B BEATS A BY 0.1** · **p = 0.4**. "What should you do? **WHICH ONE?**" Options SHIP B / NOT YET / DELETE A / SHIP BOTH with the 5-second countdown. **NOT YET: NO WINNER** wins confetti, and the wrong options are struck ("could be luck", "no reason", "pick one"). Then **0.4 IS FAR ABOVE 0.05: EASILY LUCK**. Teaser: NEXT: COMPARING TWO AVERAGES · **THE t-TEST** (two overlapping bells). End card: NEXT: THE t-TEST, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Random split · Two versions · Test decides · Don't peek. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions. "A/B testing" is spoken from "A-B testing"; "fifteen" has its usual stress fix, and the standalone "A" in "B beats A" is patched from the article (*uh*) to the letter (*ay*).

**S1 · Hook** (0:00.00–0:07.68)
- `0:00.45` A green Buy button, or an orange one? Which makes more people buy?
- `0:04.44` Don't guess. Test it. That's A/B testing.

**S2 · The definition** (0:07.68–0:19.76)
- `0:08.13` Here's the definition, in simple words.
- `0:10.74` A/B testing shows two versions to two random groups of users,
- `0:14.70` then uses a hypothesis test to decide if the difference is real.

**S3 · The setup** (0:19.76–0:32.64)
- `0:20.21` Say we split 10,000 visitors at random.
- `0:22.90` 5,000 see the green button, and 5,000 see the orange one.
- `0:27.02` Random matters: the groups are alike in every other way, so only the button differs.

**S4 · The results** (0:32.64–0:44.87)
- `0:33.09` After a week, green gets 400 purchases: 8%.
- `0:36.95` Orange gets 460: 9.2%.
- `0:40.93` Orange looks better. But is it real, or just luck?

**S5 · The test** (0:44.87–0:57.14)
- `0:45.32` The null hypothesis: both buttons convert the same.
- `0:48.90` If that were true, a gap this big would happen only about 3% of the time.
- `0:53.59` So the p-value is 0.03.

**S6 · The decision** (0:57.13–1:07.73)
- `0:57.59` 0.03 is below 0.05, so we reject the null.
- `1:03.02` Orange wins: a 15% lift in purchases. Ship it!

**S7 · Three mistakes** (1:07.73–1:21.19)
- `1:08.18` Watch out for three classic mistakes.
- `1:10.46` Stopping the test early, the moment it looks good. Peeking like that raises false alarms.
- `1:15.78` Skipping the plan for how many users you need. And changing many things at once.

**S8 · Remember** (1:21.19–1:30.89)
- `1:21.64` So remember: split users at random, show two versions, and let a hypothesis test decide.
- `1:27.66` Plan the sample size first, and don't peek.

**S9 · Quiz, teaser and CTA** (1:30.89–1:59.31)
- `1:31.24` Quick quiz!
- `1:32.27` Version B beats A by just 0.1 points, with a p-value of 0.4.
- `1:37.93` What should you do?
- `1:44.47` Not yet!
- `1:45.51` 0.4 is far above 0.05. A gap like that is easily luck, so there's no winner yet.
- `1:52.96` Next: comparing two averages. The t-test.
- `1:56.04` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Definition:** an A/B test (a randomised controlled experiment) assigns users at random to version A or B, measures an outcome (here the purchase rate), and tests H0: p_A = p_B.
  - Random assignment balances every other factor on average, so a real difference can be attributed to the change.
- **Scenes 4–5:** A = 400/5,000 = **8.0%** and B = 460/5,000 = **9.2%**; the gap is 1.2 percentage points.
  - Two-proportion z-test: pooled p = 860/10,000 = 0.086. SE = √(0.086 × 0.914 × (1/5000 + 1/5000)) = 0.00561 (0.56 points). z = 0.012/0.00561 = **2.14**.
  - Two-sided p = **0.032** ("about 3%", "0.03"); each tail is 1.6%. The curve in scene 5 is N(0, 0.56²) in percentage points: the gap expected between two random groups if H0 were true.
- **Scene 6:**
  - 0.032 < 0.05, so reject H0.
  - Relative lift = 9.2/8.0 − 1 = **15%**; the absolute lift is 1.2 points.
  - A 95% interval for the gap is about 1.2 ± 1.1 points (unpooled SE 0.56), so the real lift could be smaller or larger. Shipping on p < 0.05 is the standard simple rule.
- **Scene 7:**
  - **Peeking:** checking repeatedly and stopping as soon as p < 0.05 inflates the false-positive (Type 1) rate well above 5%.
  - **Sample-size plan:** decide the required sample size up front with a power analysis.
  - **Many changes at once:** you can't tell which change caused the effect (multivariate designs exist for that).
- **Quiz:** with p = 0.4, a gap like this would be common if the versions were equal, so there's no evidence that B is better and no winner yet.
  - A 0.1-point gap gives p ≈ 0.4 at roughly 120,000 users per group around a 9% base rate.
  - "Not yet" means don't ship B on this evidence; keep A unless a pre-planned, larger test says otherwise.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, pops as the phones land, a glitch before "Don't guess", and the whoosh, impact and chime on "A/B testing".
- Definition: calm "flow", with a blip per line and a ding as the card completes.
- The setup and the results: marimba "play", with ticks as the dots appear, a shuffle on "random", pops on the two groups, a ding on "only", glides as the bars grow, and a glitch on "real, or just luck?".
- The test, the decision and the mistakes: groove, with a pop on the null, a glide as the curve draws, pops on the gap and the 3%, a ding before p, a stamp on "reject", a tada and confetti on "Orange wins", a stamp on "Ship it!", and a pop and stamp per mistake card.
- Recap: build, with a crash on entry and step tones per line.
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `type-1-type-2-errors/` (`REF=type-1-type-2-errors bash .claude/skills/data-science-explainer/new-video.sh ab-testing ABTesting AB_Testing`). It adds `src/components/AB.tsx`: the A/B colours, the exact results (`RES`), the `Phone` mockup and `BuyButton`, the `PLess` lockup, and the seeded 50/50 visitor `SPLIT`.
