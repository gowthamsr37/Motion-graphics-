# Beyond The Scoreboard — The Swap File: Kohli for Pakistan, Babar for India

A 175-second Instagram Reel: 1080×1920, 30 fps, mastered to −14 LUFS. Built from `../templates/the-file`.

**The question:** what if Virat Kohli had played ODIs for Pakistan, and Babar Azam for India? We simulated every ODI either man played since Babar's debut (31 May 2015), 10,000 times each.

## Story

| # | Scene | On screen |
| --- | --- | --- |
| 1 | Title card | Outline jersey numbers 18 (India blue) and 56 (Pakistan green). The two photo prints land on their sides, then swap across the frame. 292 ODIs × 10,000 replays → **THE SWAP** |
| 2 | Tale of the tape | Butterfly rows since May 2015: innings 153/139, average 65.5/52.4, hundreds 33/20, strike rate 98.2/86.9; a **+13 runs per innings** badge |
| 3 | The chase | Slope chart of averages. Batting first → chasing: Kohli 63.1 → 67.9 (▲4.8), Babar 55.9 → 49.1 (▼6.8) |
| 4 | How the replay works | A receipt for Mohali 2016, worked line by line (below). Then × 10,000 replays: India win 1.3% |
| 5 | The control | Each man replays himself, which removes luck: India 101 of 154 (real life 98), Pakistan 72 of 138 (real life 75.5) |
| 6 | The swap | Waffle grids, one square per match: India 101 → 95 (−5.8, of which −3.4 chasing); Pakistan 72 → 76.5 (+4.5) |
| 7 | Why not more? | Dot histogram of winning margins for all 292 matches. A red band marks the 13 runs that matter; only 44 games fall inside it |
| 8 | Sliding doors | Asia Cup 2023, Colombo (Pakistan lost off the last ball, missing the final): with Kohli they win 66%. World Cup 2019 semi-final, Manchester (Kohli 1): with Babar India win 19% |
| 9 | India v Pakistan | The six ODIs both men played: India won 5. Swapped, India expect 5.0 (98–100% in five games, 0% in the 2017 final) |
| 10 | Verdict | The prints swapped; a **+5 WINS** stamp ("Kohli over Babar · a decade"); −5.8 / +4.5 / −3.4 in chases; "The gap narrows. It doesn't close." |

The Mohali receipt (scene 4):
- India finished 289/3 with 10 balls to spare. The wickets and balls in hand were worth about 21 more runs, so India's potential was 310.
- Remove Kohli's 154\* off 134 balls.
- Add Babar's median chasing innings against top teams: 31 off 33.
- His teammates bat the 101 balls he leaves, at their 0.81 runs per ball: +82.
- New total 269, short of the target of 286, so New Zealand win.

## Method (`analysis/`)

**1. Extract** (`extract.py`): every India and Pakistan ODI since 31 May 2015 from Cricsheet ball-by-ball JSON. For each innings it records the batting card, legal balls, extras, target and DLS method. It also builds an empirical "runs still to come" table from every completed, unreduced 50-over first innings since 2010, keyed by overs left and wickets down.

**2. Simulate** (`sim.py`): 10,000 replays per match.
- **Who swaps.** Babar takes Kohli's place in every India ODI Kohli played, and Kohli takes Babar's in every Pakistan ODI Babar played. In India v Pakistan, both swaps happen at once. If the original man did not bat, nothing changes.
- **The replacement innings.** The original innings (k runs off kb balls) is replaced by one of the other man's ODI innings since May 2015, drawn at random. The draw matches the situation: batting first or chasing, and top-10 opposition or the rest. If fewer than 15 such innings exist, it uses the situation alone.
- **Teammates.** They bat the balls he leaves, or lose the balls he uses, at their own runs per ball in that innings:
  new total = total − k + b − (bb − kb) × teammates' rate.
- **Winning chases.** A chasing side that won had batting in hand, so its total is its potential: runs plus the average still to come from its final position.
- **Result.** The side batting second wins if its potential total reaches the adjusted target. DLS targets scale with the share of overs. Ties count half, and no-results are skipped.

**3. The control** is the same replay with each man replaced by a random innings of his own. Real results contain luck: a star tends to score big in wins and fail in losses, so any random redraw drifts results toward the middle. Comparing the swap with this baseline removes that drift.

| | Matches | Real wins | Baseline (self) | Swap | Effect (80% range) |
| --- | --- | --- | --- | --- | --- |
| India, Babar for Kohli | 154 | 98 | 101.0 | 95.1 | **−5.8** (−10.5 to −1.5) |
| Pakistan, Kohli for Babar | 138 | 75.5 | 72.0 | 76.5 | **+4.5** (+1.0 to +8.0) |

- **India:** the effect splits −2.4 batting first and −3.4 chasing. India is worse off in 94% of paired runs.
- **Pakistan:** the effect splits +2.3 batting first and +2.2 chasing. Pakistan is better off in 93% of runs.

**4. Close games:** 44 of the 292 matches were decided by less than 13.1 runs, which is Kohli's per-innings edge. Chase margins are converted to runs through the same table.

**5. Story data:** `story_data.py` writes every on-screen number to `src/data.json`.

### Limitations

- **Batting only.** The model ignores captaincy, fielding and the different batting orders around each man. Both usually batted at No.3.
- **Teammates' scoring rate is held fixed.** In reality, a better or worse partner changes how the other batters play.
- **Opposition and conditions are modelled coarsely:** two opposition tiers and the batting-first/chasing split.
- **Afghanistan matches are missing.** Cricsheet withholds every match involving Afghanistan. That leaves out a handful of India and Pakistan ODIs in the window, including both teams' World Cup games against Afghanistan in 2019 and 2023. Career lines exclude them too, which the reel says on screen.
- **Sample:** 153 Kohli innings and 139 Babar innings. Tournament and match figures are simulation probabilities, not predictions.

## Data and sources

- **Ball-by-ball:** [Cricsheet](https://cricsheet.org) ODIs (ODC-BY), downloaded 22 Nov 2026, latest match 2 Nov 2026.
- **Match facts:** Asia Cup 2023 Super Four, Pakistan v Sri Lanka, R Premadasa Stadium, 14 Sep 2023 (Sri Lanka won by 2 wickets, DLS, off the last ball; 42 overs a side). World Cup 2019 semi-final, Old Trafford, 9–10 Jul 2019 (New Zealand 239/8, India 221, Kohli 1). Mohali, 23 Oct 2016 (India 289/3 chasing 286, Kohli 154\*).

## Photos

- *2015 CWC I v UAE 02-28 Kohli (03) (cropped)*: Virat Kohli batting at the WACA, Perth, 28 Feb 2015, by Bahnfrend, CC BY-SA 4.0, via Wikimedia Commons.
- *Babar Azam in 2020*: screenshot from BBC Urdu on YouTube, 2 Sep 2020, CC BY 3.0, via Wikimedia Commons.

Both are credited on screen. Each print's frame is coloured by team: India blue, Pakistan green.

## Build

```bash
python3 analysis/extract.py <cricsheet odis_male_json dir>
python3 analysis/sim.py && python3 analysis/story_data.py      # numpy
npm run voice                                                   # Kokoro am_michael + whisper timings
BROWSER=<chrome-headless-shell> bash scripts/build.sh           # → out/Beyond_The_Scoreboard_The_Swap.mp4 + _Cover.png
```
