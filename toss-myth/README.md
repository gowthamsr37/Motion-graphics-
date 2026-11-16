# Beyond The Scoreboard — Myth Busters #01: Does winning the toss win matches?

A 159-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS. It is the first episode of a **Myth Busters** series, a data story built on 8,408 men's matches, in the Beyond The Scoreboard scoreboard style.

## The story

1. **Hook.** A coin spins up and lands. The board reads "TOSS: WON · MATCH: WON?", then the title card: *"Win the toss, win the match": true… or myth?*
2. **The evidence.** A counter climbs to 8,408 men's matches, split into Tests 899, ODIs 2,617, T20Is 3,649 and IPL 1,243.
3. **What luck looks like.** Fourteen simulated coins are flipped 2,500 times each. Their running "% heads" lines funnel into **48–52%**, which becomes the *coin-flip zone*.
4. **The results.**
   - **ODIs:** toss winners won 1,244 of 2,487, **exactly 50.0%**.
   - **T20Is:** 50.5%.
   - **IPL:** 51.6%.
   - Each sits inside its own coin-flip zone. The fourth row, Tests, stays hidden: "Hold that thought."
5. **The "toss World Cup".**
   - 2021 T20 World Cup: in Dubai the chasing side won **12 of 13**. The tiles show every game, with one "defended".
   - Evening dew, then toss winners won **30 of 45**, including the final.
6. **What nobody remembers.**
   - The next World Cups: **39%, 56%, 43%**.
   - Every other T20I in Dubai: **50.8%**.
   - "One place, one season, one set of conditions."
7. **"Toss grounds".**
   - Each ground's matches are split into first and second halves.
   - The 8 strongest "toss grounds" fall from **64% to 42%**; Eden Park drops from 61% to 29%.
   - Small samples tell big lies.
8. **The exception: Tests.**
   - Toss winners win **54.2%**, just outside the zone.
   - Bat first: **57.1%**. Bowl first: **48.3%**.
   - The pitch cracks from day 1 to day 5.
9. **The IPL flips it.**
   - Won the toss and bowled first: **54.7%**. Batted first: **45.3%**.
   - "The coin doesn't win the match. The decision can tilt it."
10. **Verdict.**
    - **50.9%** across every format, shown as a 100-match grid: 50 wins for a coin flip, plus 0.9 for the toss.
    - **MYTH BUSTED (mostly)**.
    - Players, conditions and decisions decide who wins.
    - A call to action: "Got a myth for us to test?"

## Data and method

- **Source:** [Cricsheet](https://cricsheet.org) open ball-by-ball data, downloaded on 16 Nov 2026 and licensed under the [Open Data Commons Attribution License](https://cricsheet.org/article/licensing-and-venues-registry/).
- **Coverage:**
  - Men's Tests from Dec 2001 (899 matches)
  - ODIs from Jun 2002 (2,617)
  - T20Is from Feb 2005 (3,649)
  - IPL 2008–2026 (1,243)
- **Withheld matches:** Cricsheet withholds matches involving Afghanistan's men's team (14 Tests, 162 ODIs, 166 T20Is), so those are not in the totals.
  - The five Afghanistan games at the 2021 World Cup were added by hand from official scorecards; see [analysis/WC2021_AFGHANISTAN.md](analysis/WC2021_AFGHANISTAN.md).
- **Decided matches:** matches with a winner. Ties (including super-over finishes), draws and no-results are excluded. A rain-affected result counts as decided.
- **Coin-flip zone:** the 95% range for a fair coin over the same number of matches, 50 ± 1.96·√(0.25/n).
  - ODI (n = 2,487): 48.0–52.0
  - T20I (3,530): 48.4–51.6
  - IPL (1,218): 47.2–52.8
  - Test (730): 46.4–53.6
- **Significance:**
  - Tests are the only format outside the zone (54.2%, p ≈ 0.02). Tests where the toss winner chose to bat: 57.1% (95% CI 52.7–61.3).
  - IPL when the toss winner bowled: 54.7% (CI 51.2–58.1).
  - All formats together: 50.9% (CI 49.8–52.0), which is not significantly different from 50%.
- **World Cups:** event name "ICC Men's T20 World Cup" within each tournament's dates.
  - 2021: 30/45, including the Afghanistan games.
  - 2022: 15/38. 2024: 23/41. 2026: 21/49. These three exclude Afghanistan games.
  - Dubai 2021: the chasing side won 12/13 and toss winners won 11/13.
  - Other Dubai T20Is: 63/124.
- **Toss grounds:**
  - Population: 52 grounds with 40+ decided ODI, T20I and IPL games. Renamed grounds are merged, e.g. Feroz Shah Kotla and Arun Jaitley Stadium, or Subrata Roy Sahara Stadium and MCA Pune.
  - Each ground's matches are sorted by date and split in half.
  - The 8 grounds with the highest first-half toss-win % averaged **64.1%** in the first half and **42.3%** in the second.
  - The correlation between first-half and second-half figures across all 52 grounds is −0.09. In other words, a ground's toss record predicts nothing.
- **Code:** `analysis/load.py` builds the match table, `analyse.py` gives the headline rates, `deeper.py` covers trends and World Cups, and `venues2.py` runs the venue test. `summary.json` holds every figure. Set the RAW and work paths at the top of each script.
- **The 14 simulated coins** on screen use a fixed random seed. The note "N of 14 end inside · 95% do in theory" is computed from the simulation itself.
- **The dew explanation** is the widely reported reason for Dubai 2021, not something the data measures.

## Audio

- **Narration:** Kokoro TTS, `am_michael` voice (the series narrator), at a natural pace with no speed-up. Pronunciation is fixed for ODIs, IPL and Dubai.
- **Music and effects:** original and synthesized.
  - The music has a suspense open, an investigation groove, a darker build for the 2021 story and a hush for the twist. It closes with a timpani roll into the MYTH BUSTED stamp, then a resolve.
  - The effects are a coin flick, ring and landing, a run of rapid flips for the simulation, board flips, dew droplets, cracking earth for the Test pitch, a tape rewind for "what nobody remembers", stamps and a soft cheer for the final.

## Rebuild

```bash
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>   # only if the script changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```
