# Hypothesis Testing Explained in 2 Minutes

The twenty-fifth **Data Science Made Simple** Reel for **@curious_datascientist**. It covers hypothesis testing: assume nothing's going on, check how surprising the data is, and reject that assumption only when the data is really surprising. 1:55, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

This is the second Reel of the inference batch (confidence intervals → **hypothesis testing** → p-value → Type I vs Type II errors → A/B testing). It runs on one example throughout: a friend's coin that lands heads 9 times out of 10. It covers:
- a plain-words definition card;
- the null and the alternative;
- the courtroom analogy ("not guilty" is not "innocent");
- how surprising 9 heads would be for a fair coin (exact binomial chances, about 1%);
- the decision against a 5% line chosen beforehand, including what "fail to reject" means;
- a recap and a quiz.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: THE p-VALUE chip.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Hypothesis_Testing.mp4` | the finished Reel |
| `Hypothesis_Testing_Cover.png` | 1080×1920 cover: HYPOTHESIS TESTING · explained in 2 minutes, "9 HEADS IN 10: RIGGED OR LUCK?" over the ten coins (5 + 5), the chips H0 NOTHING'S GOING ON and H1 SOMETHING IS, @curious_datascientist |
| `Hypothesis_Testing.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code for this video

| Concept | Colour |
| --- | --- |
| The null hypothesis ("nothing's going on"), heads coins | cyan |
| The alternative ("something is going on"), the surprising tail | orange |
| The evidence / data, tails coins | violet |
| The 5% decision line | green |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:09 | **Hook** | Ten coins flip in one by one (H H H T H H H H H H) and a counter climbs to **9 HEADS** OUT OF 10. **RIGGED, OR JUST LUCK?** pops, then the title **HYPOTHESIS TESTING** · EXPLAINED SIMPLY, with a burst. |
| 2 | 0:09–0:25 | **The definition** | IN SIMPLE WORDS: 1 data decides: **REAL OR CHANCE?**; 2 first, **ASSUME NOTHING'S GOING ON**; 3 too **SURPRISING?** reject that. Then THAT'S **HYPOTHESIS TESTING**. |
| 3 | 0:25–0:36 | **Two hypotheses** | Two cards: **H0 THE NULL**: Nothing's going on, the coin is fair (an H and a T coin); **H1 THE ALTERNATIVE**: Something is going on, the coin favours heads (two H coins). |
| 4 | 0:36–0:49 | **Like a courtroom** | A gavel, then **NULL = INNOCENT UNTIL PROVEN GUILTY**. Two rows: STRONG EVIDENCE → **REJECT THE NULL** (guilty); WEAK EVIDENCE → **FAIL TO REJECT** (not guilty). Then **NOT GUILTY ≠ INNOCENT**. |
| 5 | 0:49–1:02 | **How surprising?** | IF THE COIN WERE **FAIR**...: the exact chances of 0–10 heads in 10 flips grow as bars. Bars 9 and 10 turn orange under a bracket with a **1%** badge, then **9 OR MORE HEADS: ABOUT 1 IN 100**. |
| 6 | 1:02–1:19 | **The decision** | HOW OFTEN WOULD A FAIR COIN DO THIS? A 0–50% scale (VERY SURPRISING → EASILY LUCK) and **THE 5% LINE**. **9 HEADS: 1%** lands left of the line, with its coin row → **BELOW 5%: REJECT THE NULL** · THE COIN IS PROBABLY RIGGED. Then **6 HEADS: 38%**, with its coin row → **ABOVE 5%: FAIL TO REJECT** · NOT PROOF THE COIN IS FAIR. |
| 7 | 1:19–1:29 | **Remember** | A HYPOTHESIS TESTING pill and a recap flow: **ASSUME NOTHING'S GOING ON** ↓ **HOW SURPRISING IS THE DATA?** ↓ **REALLY SURPRISING? REJECT IT**. |
| 8 | 1:29–1:55 | **Quiz, teaser and CTA** | QUICK QUIZ. A pill and **CLAIM: LOWERS BLOOD PRESSURE**. "The null hypothesis is... **WHICH ONE?**" Options PILL WORKS / PILL DOES NOTHING / PILL IS HARMFUL / PEOPLE ARE SICK with the 5-second countdown. **THE PILL DOES NOTHING** wins confetti, and the wrong options are struck ("alternative", "not the claim", "off topic"). Then **THE NULL ALWAYS SAYS: NO EFFECT**. Teaser: NEXT: THAT 1% HAS A NAME · **THE p-VALUE** (the fair-coin bars with the 9–10 tail lit). End card: NEXT: THE p-VALUE, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Null: no effect · Alternative · How surprising? · 5% line. |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Short sentences; numbers are written out in the TTS text and shown as digits in the captions.

**S1 · Hook** (0:00.00–0:09.22)
- `0:00.45` Your friend's coin lands heads 9 times out of 10.
- `0:03.52` Is the coin rigged, or was it just luck?
- `0:06.04` Hypothesis testing helps you decide.

**S2 · The definition** (0:09.22–0:24.88)
- `0:09.67` Here's the definition, in simple words.
- `0:12.27` Hypothesis testing uses data to decide whether an effect is real, or just chance.
- `0:18.02` First, assume nothing special is going on.
- `0:20.65` Then check: is the data too surprising for that to be true?

**S3 · Two hypotheses** (0:24.88–0:35.97)
- `0:25.33` That gives us two hypotheses.
- `0:27.35` The null hypothesis: nothing's going on. The coin is fair.
- `0:31.33` The alternative: something is going on. The coin favours heads.

**S4 · Like a courtroom** (0:35.96–0:48.68)
- `0:36.41` It works like a courtroom.
- `0:38.08` The null is like 'innocent until proven guilty'.
- `0:41.12` Only strong evidence lets us reject it. Weak evidence means 'not guilty', which is not the same as 'innocent'.

**S5 · How surprising?** (0:48.68–1:01.96)
- `0:49.13` So, if the coin were fair, how often would we see 9 or more heads in 10 flips?
- `0:54.10` Picture a fair coin flipped 10 times, over and over.
- `0:57.48` 9 or more heads happens only about 1% of the time.

**S6 · The decision** (1:01.96–1:19.00)
- `1:02.41` Before testing, we choose a line, usually 5%.
- `1:05.78` 1% is below it, so we reject the null. The coin is probably rigged.
- `1:10.62` But 6 heads happens about 38% of the time. Then we'd fail to reject the null, which doesn't prove the coin is fair.

**S7 · Remember** (1:19.00–1:28.76)
- `1:19.45` So remember: assume nothing's going on, check how surprising the data is,
- `1:24.10` and reject that assumption only when the data is really surprising.

**S8 · Quiz, teaser and CTA** (1:28.76–1:54.72)
- `1:29.11` Quick quiz!
- `1:30.14` A company claims its new pill lowers blood pressure.
- `1:33.20` In a test, what is the null hypothesis?
- `1:41.28` The pill does nothing!
- `1:42.70` The null always says there's no effect. The company has to bring enough evidence to reject it.
- `1:48.32` Next: that 1% has a name. The p-value.
- `1:51.45` Follow for data science made simple!

## Accuracy notes (every number checked)

- **Framework:** a significance test sets a null hypothesis H0 (no effect: here the coin is fair, P(heads) = ½) against an alternative H1 (here P(heads) > ½, a one-sided test).
  - Assuming H0, it computes how likely data at least as extreme as the observed data would be. If that chance is below a level α chosen in advance (usually 5%), it rejects H0.
  - Otherwise it "fails to reject" H0. That is not evidence that H0 is true, which is the courtroom point: "not guilty" ≠ "innocent".
- **Scene 5:** with a fair coin, heads in 10 flips ~ Binomial(10, ½); the bars are drawn from the exact probabilities (`components/Coins.tsx`).
  - P(9) = 10/1024 and P(10) = 1/1024, so P(≥ 9) = 11/1024 = **1.07%**, "about 1%", "about 1 in 100".
- **Scene 6:**
  - 1.07% < 5%, so reject H0.
  - P(≥ 6) = (210 + 120 + 45 + 10 + 1)/1024 = 386/1024 = **37.7%**, "about 38%". That is above 5%, so fail to reject.
  - For reference, P(≥ 8) = 5.47%, so with 10 flips only 9 or 10 heads would be significant at the 5% level (one-sided).
- **"Usually 5%":** α = 0.05 is the most common convention; it is chosen before looking at the data.
- **Quiz:** H0 is the no-effect statement: the pill does nothing to blood pressure. The company's claim ("it lowers blood pressure") is the alternative, and the burden of evidence is on rejecting H0.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro, a flip sound per coin (a click on the tail), a glitch on "rigged", and the whoosh, impact and chime on "hypothesis testing".
- Definition: calm "flow", with a blip per line and a ding as the card completes.
- Two hypotheses and the courtroom: marimba "play", with pops on each card, a stamp for the gavel and blips on "strong" and "weak".
- How surprising and the decision: groove, with a tick run as the bars grow, a ding before "1%", a glide as the 5% line rises, a stamp on "reject" and a pop on "38%".
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

Scaffolded from `confidence-intervals/` (`REF=confidence-intervals bash .claude/skills/data-science-explainer/new-video.sh hypothesis-testing HypothesisTesting Hypothesis_Testing`). It adds `src/components/Coins.tsx`: exact Binomial(10, ½) chances (`B10`, `tailAtLeast`) and the `HeadsBars` chart with highlighted bars.
