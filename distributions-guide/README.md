# Every Distribution You Need: The Complete Cheat Sheet

The **Data Science Made Simple** series finale for distributions, for **@curious_datascientist**. All twelve distributions from the series get one full-screen card each, followed by a how-to-use-them section and a final one-screen cheat sheet built to be saved and shared. 2:39, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

This is cheat sheet v3, the detailed version. The user asked for "more information… how to use, where to use… don't squeeze… it should go viral". `which-distribution/` (v2, 2:00) stays as the shorter question-driven version.

The length is kept **under 3 minutes**. Instagram accepts longer uploads, but Reels longer than about 3 minutes are reported not to be recommended to non-followers. Those recommendations are where viral reach comes from.

It uses the locked series house style (`.claude/skills/data-science-explainer/SKILL.md`). @curious_datascientist is on the end card and the cover, and the end card has a NEXT: CONFIDENCE INTERVALS chip, the next video in posting order.

## What makes it save-worthy

- **One card per distribution (12 cards):**
  - family tag (COUNT / MEASUREMENT / TESTING TOOL / BONUS) and a 01/12 counter;
  - a 12-step progress bar, for retention;
  - the big animated shape;
  - **USE IT WHEN**;
  - three **REAL EXAMPLES**;
  - a **KEY** line (parameters, mean, rule);
  - the exact **SciPy / scikit-learn** one-liner.
- **In practice:** 1 plot a histogram → 2 match the shape → 3 fit it in Python and check it with a Q-Q plot.
- **The cheat sheet:** all twelve on one screen (question → name + mini shape), on screen for about 11 s.
  - The narration explicitly asks viewers to save the reel and send it to a friend, and points to the full videos on the page.
- **The caption** repeats the whole cheat sheet in text, with the Python lines.

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `Distributions_Complete_Guide.mp4` | the finished Reel |
| `Distributions_Complete_Guide_Cover.png` | 1080×1920 cover: **12 DISTRIBUTIONS EVERY DATA SCIENTIST MUST KNOW** · THE COMPLETE CHEAT SHEET, the twelve mini cards in a 3 × 4 grid, a SAVE THIS FOR LATER bookmark pill, @curious_datascientist |
| `Distributions_Complete_Guide.srt` | the on-screen subtitle pages |

The Instagram caption is in [`CAPTION.md`](CAPTION.md).

## Colour code

| Family | Colour | Members |
| --- | --- | --- |
| Counts | cyan | Bernoulli, binomial, geometric, Poisson, uniform |
| Measurements | violet | normal, exponential, log-normal, Pareto |
| Testing tools | orange | t, chi-square |
| Bonus, save | green | bimodal |

## Storyboard

| # | Time | Scene | What moves |
| --- | --- | --- | --- |
| 1 | 0:00–0:10 | **Hook** | **EVERY DISTRIBUTION YOU NEED** with a burst. The twelve mini cards cascade into a 3 × 4 grid and wobble on "one video". Then three promise chips on their words (THE SHAPE · WHEN TO USE IT · PYTHON CODE) and the **SAVE THIS ONE** bookmark pill. |
| 2 | 0:10–0:20 | **How to choose** | **WHAT AM I MEASURING?** Three family cards: **COUNTS** (How many? and its five members), **MEASUREMENTS** (How long? How much? and its four), **TESTING TOOLS** (Is the result real? t and chi-square). |
| 3–14 | 0:20–1:55 | **The twelve cards** | Each about 7–10 s: progress bar, family tag, 01–12 counter, the name, the shape drawing on the name, USE IT WHEN on the second sentence, the KEY line, the three example chips across the third sentence, and the code pill. Order: Bernoulli · binomial · geometric · Poisson · uniform · normal · exponential · log-normal · Pareto · t · chi-square · bimodal (bonus). |
| 15 | 1:55–2:05 | **In practice** | 3 STEPS: **1 PLOT A HISTOGRAM** (a skewed histogram grows) · **2 MATCH THE SHAPE** (normal / exponential / log-normal; log-normal lights up) · **3 FIT IT, CHECK IT** (`stats.lognorm.fit(data)` and a Q-Q plot whose dots hug the line). |
| 16 | 2:05–2:17 | **The cheat sheet** | All twelve rows cascade in (One yes/no try? → BERNOULLI … Two humps? → BIMODAL, each with its mini shape). **SEND** and **SAVE** badges pop on their words; the pill reads FULL VIDEO ON EACH ONE. |
| 17 | 2:17–2:39 | **Quiz, teaser and CTA** | QUICK QUIZ: an envelope and **EMAILS PER HOUR**. "Which distribution fits? **WHICH ONE?**" Options NORMAL / POISSON / BINOMIAL / PARETO with the 5-second countdown. **POISSON** wins confetti, and the wrong options are struck ("not counts", "no limit", "no giants"). Then **COUNTS EVENTS IN A STRETCH OF TIME**. Teaser: NEXT: HOW SURE CAN WE BE? · **CONFIDENCE INTERVALS** (ranges around a true value, one missing). End card: NEXT: CONFIDENCE INTERVALS, FOLLOW tap, @curious_datascientist, MADE SIMPLE., and the chips Counts · Measurements · Testing · Save it. |

## The twelve cards (on screen)

| # | Name | Use it when | Real examples | Key | Code |
| --- | --- | --- | --- | --- | --- |
| 1 | Bernoulli | ONE try, two outcomes: yes or no | Coin flip · Buy or not · Spam or not | p = chance of yes · mean = p | `stats.bernoulli(p)` |
| 2 | Binomial | Number of YESES in a fixed number of tries | Heads in 10 flips · Buyers out of 100 · Defects in a batch | n tries, chance p · mean = n × p | `stats.binom(n, p)` |
| 3 | Geometric | Number of TRIES until the first success | Calls until a sale · Rolls until a 6 · Ads until a click | chance p · mean = 1 / p tries | `stats.geom(p)` |
| 4 | Poisson | How many EVENTS in a stretch of time | Calls per hour · Visits per minute · Typos per page | rate = average count · mean = variance | `stats.poisson(mu)` |
| 5 | Uniform | EVERY outcome equally likely | Fair dice roll · Random number · Lottery draw | range a to b · mean = (a + b) / 2 | `stats.randint(1, 7)` |
| 6 | Normal | Values CLUSTER around an average | Heights · Exam scores · Measurement errors | mean and SD · 68-95-99.7 rule | `stats.norm(mean, sd)` |
| 7 | Exponential | The WAITING time until the next event | Between customers · Until a failure · Between calls | mean wait = 1 / rate · memoryless | `stats.expon(scale=1/rate)` |
| 8 | Log-normal | POSITIVE values, long right tail, growth that multiplies | Incomes · House prices · Stock prices | log(x) is normal · mean > median | `stats.lognorm(s, scale=median)` |
| 9 | Pareto | A FEW GIANTS hold most of the total | Wealth · City sizes · Sales per product | heavy tail · the 80/20 rule | `stats.pareto(b, scale=xmin)` |
| 10 | t-distribution | Like the bell, FATTER tails, for small samples | Small-sample means · t-tests · Confidence intervals | df = n − 1 · near normal by about 30 | `stats.t(df)` |
| 11 | Chi-square | Do COUNTS match what you expected? | Is a dice fair? · Category vs category · Goodness of fit | df · always positive · skewed right | `stats.chi2(df)` |
| 12 | Bimodal (bonus) | TWO humps: two groups mixed together | Lunch + dinner rush · Two customer types · Mixed batches | split the groups first | `GaussianMixture(2)` (scikit-learn) |

## Voiceover script (timestamps are on the finished video)

Kokoro TTS `af_heart` at 1.05×. Phoneme fixes: Bernoulli (*ber-NOO-lee*), Poisson (*pwah-SOHN*), Pareto (*pa-RAY-toh*), bimodal (*bye-MOH-dal*). The twelve card scenes use a shorter lead and hold (0.3 s / 0.6 s) so the cards flip briskly.

**S1 · Hook** (0:00.00–0:10.03)
- `0:00.45` Every probability distribution a data scientist needs, in one video.
- `0:05.28` What each one looks like, when to use it, and the Python code. Save this one!

**S2 · How to choose** (0:10.03–0:19.76)
- `0:10.43` To choose, ask one question: what am I measuring?
- `0:13.62` Counting things: how many? Measuring things: how long, or how much?
- `0:17.65` Or testing a result?

**S3 · Bernoulli** (0:19.76–0:27.95)
- `0:20.06` Bernoulli.
- `0:20.90` One single try, with two outcomes: yes or no.
- `0:23.98` A coin flip. Will this customer buy? Is this email spam?

**S4 · Binomial** (0:27.96–0:35.61)
- `0:28.26` Binomial.
- `0:29.21` The number of yeses in a fixed number of tries.
- `0:31.92` Heads in ten flips. Buyers out of a hundred visitors.

**S5 · Geometric** (0:35.61–0:43.13)
- `0:35.91` Geometric.
- `0:36.98` The number of tries until the first success.
- `0:39.35` Calls until the first sale. Rolls until the first six.

**S6 · Poisson** (0:43.13–0:51.17)
- `0:43.43` Poisson.
- `0:44.36` How many events happen in a stretch of time.
- `0:46.72` Calls per hour. Website visits per minute. Typos per page.

**S7 · Uniform** (0:51.17–0:57.80)
- `0:51.47` Uniform.
- `0:52.45` Every outcome is equally likely.
- `0:54.58` A fair dice roll. A random number generator.

**S8 · Normal** (0:57.80–1:05.01)
- `0:58.10` Normal.
- `0:58.89` The bell curve: values cluster around an average.
- `1:01.96` Heights. Exam scores. Measurement errors.

**S9 · Exponential** (1:05.01–1:12.42)
- `1:05.31` Exponential.
- `1:06.40` The waiting time until the next event.
- `1:08.76` Time between customers. Time until a machine fails.

**S10 · Log-normal** (1:12.42–1:21.27)
- `1:12.72` Log-normal.
- `1:13.73` Positive values with a long right tail, from growth that multiplies.
- `1:17.97` Incomes. House prices. Stock prices.

**S11 · Pareto** (1:21.27–1:29.26)
- `1:21.57` Pareto.
- `1:22.42` A few giants hold most of the total: the eighty twenty rule.
- `1:26.18` Wealth. City sizes. Sales per product.

**S12 · The t-distribution** (1:29.26–1:37.63)
- `1:29.56` The t-distribution.
- `1:30.93` Like the bell curve, but with fatter tails, for small samples.
- `1:34.23` Averages from just a few values, and t-tests.

**S13 · Chi-square** (1:37.63–1:44.80)
- `1:37.93` Chi-square.
- `1:38.87` Checks whether counts match what you expected.
- `1:41.44` Is this dice fair? Are two categories related?

**S14 · Bonus: bimodal** (1:44.80–1:54.60)
- `1:45.10` And a bonus: bimodal.
- `1:46.76` Two humps usually mean two groups mixed together.
- `1:49.53` Like restaurant orders, with a lunch rush and a dinner rush. Split the groups first!

**S15 · In practice** (1:54.60–2:05.36)
- `1:55.05` Using them in practice takes three steps.
- `1:57.44` Plot a histogram of your data, and match its shape to these cards.
- `2:01.23` Then fit it in Python, and check the fit with a Q-Q plot.

**S16 · The cheat sheet** (2:05.36–2:17.30)
- `2:05.81` So here's the full cheat sheet.
- `2:07.74` Save this reel, and send it to a friend who's learning data science.
- `2:11.67` Every distribution here has its own full video on my page.

**S17 · Quiz, teaser and CTA** (2:17.30–2:38.79)
- `2:17.65` Quick quiz!
- `2:18.67` The number of emails you get every hour.
- `2:21.02` Which distribution fits best?
- `2:28.38` Poisson!
- `2:29.41` It counts events in a stretch of time.
- `2:31.61` Next: how sure can we be about an average? Confidence intervals.
- `2:35.52` Follow for data science made simple!

## Accuracy notes (every fact checked)

- **Shapes** come from `components/Pick.tsx` (cheat sheet v2):
  - exact Binomial(10, ½), Geometric(1/6), Poisson(4) and Bernoulli(1/6) bars;
  - illustrative normal, exponential, log-normal (σ = 0.55), Pareto, t (df 2), chi-square (df 4) and bimodal curves.
- **Key lines:**
  - Bernoulli mean p; binomial mean np.
  - Geometric (number of trials until the first success, SciPy's `geom`) mean 1/p.
  - Poisson mean = variance = rate.
  - Discrete uniform on a…b has mean (a + b)/2 (a dice: 3.5).
  - Normal 68–95–99.7% within 1, 2, 3 SD.
  - Exponential mean 1/rate and memoryless.
  - Log-normal: log X ~ normal, median e^μ < mean e^(μ+σ²/2).
  - Pareto: heavy power-law tail; the 80/20 split holds for a tail index of about 1.16 and is used as the rule of thumb.
  - t: df = n − 1 for a one-sample mean, and its 95% cut-off is only about 4% above the normal's by df 30 (2.04 vs 1.96).
  - Chi-square: non-negative and right-skewed, with df degrees of freedom.
- **Code** (SciPy `scipy.stats`, with documented positional or keyword parameters):
  - `bernoulli(p)`, `binom(n, p)`, `geom(p)`, `poisson(mu)`;
  - `randint(1, 7)`: the high end is exclusive, giving 1–6;
  - `norm(loc, scale)`;
  - `expon(scale=1/rate)`;
  - `lognorm(s, scale=e^μ)`: e^μ is the median;
  - `pareto(b, scale=x_min)`, `t(df)`, `chi2(df)`;
  - `.fit(data)` estimates the parameters by maximum likelihood.
  - Bimodal data is usually modelled as a two-component mixture: scikit-learn's `sklearn.mixture.GaussianMixture(n_components=2)`.
- **Examples:**
  - Arrivals and calls per interval are classic Poisson counts, and the gaps between them are exponential.
  - Incomes and house prices are right-skewed and roughly log-normal in their body; wealth and city sizes are classic power laws.
  - Restaurant orders by time of day have lunch and dinner peaks, a standard bimodal example. Mixed adult heights are deliberately avoided: they are not visibly bimodal.
- **Quiz:** emails per hour are counts of events in a fixed interval: Poisson. Normal is for continuous measurements, binomial needs a fixed number of tries, and Pareto is a heavy-tailed size distribution.

## Audio

Same score engine and kit as the series, re-timed:
- Hook: intro under the cascade (a tick per card), a blip per promise, and the drop and chime on "Save this one".
- How to choose: calm "flow" with step tones per family.
- Counts cards: marimba "play"; measurement, testing and bonus cards: groove. Every card gets a whip as it flips in, a pop on the name, a blip on "use it when", ticks on the example chips and a click as the code pill lands.
- In practice and the cheat sheet: build, with a crash on the cheat sheet, step tones per step, a tick per row, and pops on "save" and "send".
- Quiz: suspense countdown and finale, with a lifted pad under the teaser.

SFX land 6–18 frames before their words and stay off key words. The mix and master are unchanged: music `useDuck(0.5, 0.16)`, limiter → two-pass loudnorm to −14 LUFS → final limiter.

## Rebuild

```bash
npm install
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `ab-testing/` (`REF=ab-testing bash .claude/skills/data-science-explainer/new-video.sh distributions-guide DistributionsGuide Distributions_Complete_Guide`). It adds `src/components/Guide.tsx`: the twelve-card data (`DIST`), the `DistCard` template with its progress bar, `MiniCard` and the `Bookmark` icon. It reuses `Pick.tsx` (`Shape`, `CheatRow`) from cheat sheet v2.
