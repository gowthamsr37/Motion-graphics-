# Type 1 & Type 2 Errors Explained in 2 Minutes

The twenty-seventh **Data Science Made Simple** Reel for **@curious_datascientist**. It covers the two ways a hypothesis test can be wrong: a Type 1 error (a false alarm, rejecting a true null) and a Type 2 error (a miss, keeping a false null). 1:58, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

This is the fourth Reel of the inference batch (confidence intervals → hypothesis testing → p-value → **Type I vs Type II errors** → A/B testing). It runs on a smoke alarm (rings with no fire / stays silent during a real fire), then:
- a plain-words definition;
- the 2×2 outcome grid;
- a medical test;
- alpha (with "1 test in 20"), beta and power on null-vs-effect curves;
- the trade-off, shown by sliding the threshold and adding data;
- which error is worse;
- a recap and a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: A/B TESTING chip.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Type_1_Type_2_Errors.mp4` | the finished Reel |
| `Type_1_Type_2_Errors_Cover.png` | 1080×1920 cover: TYPE 1 & TYPE 2 ERRORS · explained in 2 minutes, "2 WAYS A TEST CAN BE WRONG" with a TYPE 1 FALSE ALARM card (ringing alarm) and a TYPE 2 A MISS card (silent alarm and flame), @curious_datascientist |
| `Type_1_Type_2_Errors.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| Type 1 error (false alarm), alpha | orange |
| Type 2 error (miss), beta, the real-effect curve | violet |
| A correct decision, power | green |
| The null (nothing going on), its curve | cyan |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:10 | **Hook** | A smoke alarm, then **2 WAYS TO BE WRONG**. Two panels: NO FIRE, where the alarm rings and shakes ("nothing burning") → **FALSE ALARM**; REAL FIRE, where the alarm stays silent over a flame → **SILENT: A MISS**. Title **TYPE 1 & TYPE 2 ERRORS** with a burst, EXPLAINED SIMPLY. |
| 2 | 0:10–0:23 | **The definition** | IN SIMPLE WORDS. Two cards: **TYPE 1 · FALSE ALARM**, *rejecting* the null when it was **TRUE** (ringing alarm); **TYPE 2 · A MISS**, *keeping* the null when it was **FALSE** (silent alarm and flame). |
| 3 | 0:23–0:34 | **Four outcomes** | THE TRUTH (NULL TRUE / NULL FALSE) × YOUR DECISION (REJECT THE NULL / KEEP THE NULL). The two **CORRECT** boxes tick green on "correct". **TYPE 1 · FALSE ALARM** (reject, null true) and **TYPE 2 · MISS** (keep, null false) light up on "errors". |
| 4 | 0:34–0:44 | **A medical test** | **NULL: THE PATIENT IS HEALTHY**. The grid becomes THE PATIENT IS HEALTHY / SICK × TEST SAYS SICK / TEST SAYS HEALTHY: **TYPE 1 · FALSE ALARM** lights on the healthy person told they're sick, **TYPE 2 · A MISS** on the sick person told they're healthy. |
| 5 | 0:44–0:59 | **Alpha and beta** | The NULL TRUE curve and a THRESHOLD line. The orange tail beyond it gives **ALPHA 5%** · FALSE ALARMS. A row of 20 smoke alarms, one ringing: **NOTHING GOING ON: 1 IN 20 STILL RINGS**. The REAL EFFECT curve draws: violet **BETA 20%** · MISSES and green **POWER 80%** · 1 − BETA: CATCHES. |
| 6 | 0:59–1:10 | **The trade-off** | Both curves with live ALPHA / BETA chips. **STRICTER TEST: THRESHOLD MOVES** right: alpha 5% → **1%** (↓) while beta 20% → **43%** (↑). On "more data" both curves narrow and beta drops to **0.4%**: **MORE DATA: FEWER OF BOTH** · 4× THE DATA: NARROWER CURVES, LESS OVERLAP. |
| 7 | 1:10–1:23 | **Which is worse?** | **IT DEPENDS**. DISEASE SCREENING (a medical cross): a missed disease can be deadly → **AVOID TYPE 2**. A COURT (scales): never jail an innocent person → **AVOID TYPE 1**. |
| 8 | 1:23–1:32 | **Remember** | A TYPE 1 & TYPE 2 pill and a recap flow: **TYPE 1 = FALSE ALARM** ↓ **TYPE 2 = A MISS** ↓ **STRICTER: TRADE ONE FOR THE OTHER** ↓ **MORE DATA HELPS BOTH**. |
| 9 | 1:32–1:58 | **Quiz, teaser and CTA** | QUICK QUIZ: an email FROM: YOUR BOSS flies → **SPAM**. "Which type of error? **WHICH ONE?**" Options TYPE 2 / TYPE 1 / NONE / BOTH with the 5-second countdown. **TYPE 1: FALSE ALARM** wins confetti, and the wrong options are struck ("no miss", "it erred", "just one"). Then **NULL: THE EMAIL IS NORMAL**. Teaser: NEXT: PUTTING IT ALL TOGETHER · **A/B TESTING** (A vs B buttons). End card: NEXT: A/B TESTING, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Type 1: alarm · Type 2: miss · Alpha 5% · More data. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; "Type 1" and "Type 2" are written as "Type one" / "Type two" in the TTS text and shown as digits in the captions; "A/B testing" is spoken from "A-B testing".

**S1 · Hook** (0:00.00–0:10.50)
- `0:00.45` A smoke alarm can be wrong in two ways.
- `0:02.89` It rings when there's no fire, or it stays silent during a real one.
- `0:06.97` Statistical tests make the same two mistakes.

**S2 · The definition** (0:10.50–0:23.44)
- `0:10.95` Here's the definition, in simple words.
- `0:13.56` A Type 1 error is a false alarm: rejecting the null when it was actually true.
- `0:18.55` A Type 2 error is a miss: keeping the null when it was actually false.

**S3 · Four outcomes** (0:23.44–0:33.75)
- `0:23.89` Picture all four outcomes.
- `0:25.75` The null is either true or false, and you either reject it or keep it.
- `0:29.91` Two boxes are correct. The other two are the errors.

**S4 · A medical test** (0:33.75–0:44.00)
- `0:34.20` Think of a medical test.
- `0:35.90` Telling a healthy person they're sick? Type 1: a false alarm.
- `0:39.87` Telling a sick person they're healthy? Type 2: a miss.

**S5 · Alpha and beta** (0:44.00–0:59.38)
- `0:44.45` The chance of a Type 1 error is called alpha, usually 5%.
- `0:48.80` So when nothing's going on, about 1 test in 20 still raises a false alarm.
- `0:54.06` The chance of a Type 2 error is beta, and 1 minus beta is called power.

**S6 · The trade-off** (0:59.38–1:09.87)
- `0:59.83` Here's the catch: the two errors trade off.
- `1:02.26` Make the test stricter, and you get fewer false alarms, but more misses.
- `1:06.50` The way to reduce both? Collect more data.

**S7 · Which is worse?** (1:09.87–1:22.97)
- `1:10.32` So which mistake is worse? It depends.
- `1:12.78` Missing a disease can be deadly, so screening tests avoid Type 2 errors.
- `1:17.32` Jailing an innocent person is a Type 1 error, so courts demand strong evidence.

**S8 · Remember** (1:22.97–1:32.12)
- `1:23.42` So remember: Type 1 is a false alarm. Type 2 is a miss.
- `1:27.44` Stricter tests trade one for the other, and more data helps with both.

**S9 · Quiz, teaser and CTA** (1:32.12–1:57.61)
- `1:32.47` Quick quiz!
- `1:33.50` A spam filter sends a real email from your boss to the spam folder.
- `1:37.81` Which type of error is that?
- `1:44.92` Type 1!
- `1:45.92` The null says the email is normal, and the filter wrongly rejected it. A false alarm.
- `1:51.42` Next: putting it all together. A/B testing.
- `1:54.34` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Definitions:**
  - Type 1 error: reject H0 when H0 is true (a false positive), with probability α = the significance level.
  - Type 2 error: fail to reject H0 when H0 is false (a false negative), with probability β.
  - Power = 1 − β, the probability of detecting a real effect.
- **"1 test in 20":** with α = 0.05, among tests where the null is actually true, about 5% (1 in 20) reject it by chance.
- **Scenes 5–6 curves** (`components/Errors.tsx`, exact normal CDF):
  - The test statistic is N(0, 1) under H0 and N(2.5, 1) under the illustrated real effect (2.5 standard errors), with a one-sided test.
  - Threshold 1.645: α = **5.0%**, β = Φ(1.645 − 2.5) = **19.6%** (shown 20%), power = **80.4%** (shown 80%). 80% is the conventional target power.
  - Stricter threshold 2.326 (α = **1%**): β = Φ(−0.174) = **43.1%** (shown 43%). Fewer false alarms, more misses.
  - 4× the data halves the standard error, so both curves narrow to SD 0.5 at the same effect. A threshold of 1.163 keeps α = 1%, and β = Φ((1.163 − 2.5)/0.5) = Φ(−2.67) = **0.4%**. That is how more data reduces both errors.
- **Medical test:** H0 = "the patient is healthy" (no disease). A false positive (healthy told sick) is Type 1; a false negative (sick told healthy) is Type 2. Screening tests are tuned for high sensitivity (few false negatives), accepting more false positives that follow-up tests then clear.
- **Courts:** "innocent until proven guilty" makes innocence the null. Convicting an innocent person is a Type 1 error, so the bar ("beyond reasonable doubt") is set high.
- **Quiz:** for a spam filter, H0 = "this email is normal (not spam)". Flagging a real email as spam rejects a true null: a Type 1 error, a false positive.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a pop on the alarm, beeps as it rings, a pop on the fire, and the whoosh, impact and chime on the title.
- Definition: calm "flow", with a blip per card and pops on each sub-line.
- Four outcomes and the medical test: marimba "play", with a glide as the grid labels appear, a ding on "correct" and stamps on the error boxes.
- Alpha, beta and the trade-off: groove, with glides as the curves draw, ticks as the 20 alarms land, beeps on the ringing one, a ding on "power", glides as the threshold slides and the curves narrow, and blips on "fewer" and "more".
- Which is worse: whooshes per card. Recap: build, with a crash on entry and step tones per line.
- Quiz: a whoosh as the email flies to spam, then the suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `p-value/` (`REF=p-value bash .claude/skills/data-science-explainer/new-video.sh type-1-type-2-errors TypeErrors Type_1_Type_2_Errors`). It adds `src/components/Errors.tsx`: the normal CDF (`Phi`), `alphaAt` / `betaAt`, the `ErrCurves` null-vs-effect plot with α / β / power areas, the 2×2 outcome `Grid`, and the `SmokeAlarm` and `Flame` icons.
