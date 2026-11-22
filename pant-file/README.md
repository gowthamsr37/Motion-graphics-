# Beyond The Scoreboard — The Pant File: what happens when he walks in

A 161-second Instagram Reel: 1080×1920, 30 fps, mastered to −14 LUFS. Built from `../templates/the-file`.

It retells the `../pant-tests` reel in the house style, with a new angle chosen by the page: not the numbers, the impact. It covers how Pant's tempo, counterattacks and sixes move a Test match. It was made on the day of his 128 at Wellington (22 Nov 2026).

## Story

| # | Scene | On screen |
| --- | --- | --- |
| 1 | Hook | 128 off 153 at Wellington. A giant 9 fills behind him: "9th Test hundred". On "forget the hundreds" the tag is struck through and the 9 drains, replaced by "Watch the match, not the score" |
| 2 | The tempo | Speed bars: all top-order Test batters since Aug 2018 score at 53.3 runs per 100 balls, Pant at 74.3. India's run rate is 3.89 with Pant at the crease and 3.16 the rest of the time |
| 3 | Speed is time | 323 extra overs at an ordinary pace (1,941 balls); five Test-day blocks fill to 3.6 days, "handed back to India's bowlers" |
| 4 | When the match is slipping | A tracking road of counterattacks, each showing Pant's runs against his partners' while he batted: Sydney 2021, chasing 407, 97 (118) v 45 (146), Test saved; the Gabba 2021, chasing 328, 89\*, chase and series won; Ahmedabad 2021, in at 80/4, 101 (118) v 70 (162), win by an innings |
| 5 | The six | 108 Test sixes (2nd to Stokes, 138); 1 in 5 of India's Test sixes since 2018 (99 of 552); his first 100 as dots, 75 off spin; v spin 52.8 avg, SR 86, v pace 39.0, SR 65; Lyon: 6 dismissals, but 258 runs and 7 sixes |
| 6 | The comeback | 30·12·2022 and a crack; 637 days; 109 at Chennai, India won; Leeds 2025, 134 and 118; Manchester, batted on a fractured foot |
| 7 | Where it's hardest | Lollipop of away averages for the 8 leading keepers since 2002 (Pant 42.9, 7 hundreds, SR 69: best on all three) |
| 8 | The price | All 16 scores of 90+ as tiles (7 red nineties, 9 saffron hundreds); 90+ scores that stopped short: all batters 18%, Pant 44% |
| 9 | Verdict | Studio portrait as a case-file print; a **GAME CHANGER** stamp ("Judge him by the match"); 74 · 108 · 323 · 9; brand |

## Data

**Impact** (`analysis/impact.py`), from Cricsheet Test ball-by-ball (ODC-BY) for Pant's 89 innings to Aug 2026:
- **Arrival:** the score when he walked in. On average it was 133 for 4.
- **India's tempo:** runs per over with him at the crease against the rest of each innings: 3.89 v 3.16.
- **Partners:** runs and balls faced by his partners while he batted.
- **Baseline strike rate:** every batter in positions 1–7 in all Tests since 18 Aug 2018: 53.3.
- **Overs saved:** his 3,644 ball-by-ball runs at 53.3 would take 6,843 balls; he needed 4,902. That's 1,941 balls, or 323 overs, about 3.6 days at 90 overs a day.

A check we ran and did not use: India's win rate in Tests where Pant made 50+ is 48%, against 46% otherwise. The reel therefore makes no "India win more when he scores" claim. It tells the match-turning innings instead.

**Sixes:**
- India hit 552 Test sixes from his debut to Aug 2026, and Pant hit 99 of them in the ball-by-ball data.
- His career total of 108 after Wellington, second only to Ben Stokes (138), is the reported figure.

**Everything else** comes from `../pant-tests` (see its README for full method and sources):
- pace and spin splits (each bowler labelled by hand)
- the Lyon duel
- the keepers' away table
- the nineties baseline (17.6% of 90+ scores since 2002)
- the 637-day gap
- the June 2026 Afghanistan Test and today's 128 at Wellington, both added by hand

## Photos

The page's six photos:
- raised bat: hook
- big hit: Sydney and the cover
- hand on heart: Gabba and Leeds
- falling flick: Ahmedabad
- looking up, helmet in hand: comeback
- studio portrait: verdict

Each was cut out with BiRefNet-lite run locally (`scripts/cutout.py`), except the portrait, which is used as a print. None is captioned with a place or date.

## Build

```bash
python3 analysis/impact.py <cricsheet tests_male_json dir>   # → analysis/impact.json (copied to src/)
npm run voice                                                # Kokoro am_michael + whisper timings
BROWSER=<chrome-headless-shell> bash scripts/build.sh        # → out/Beyond_The_Scoreboard_Pant_The_File.mp4 + _Cover.png
```
