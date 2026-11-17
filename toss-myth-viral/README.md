# Beyond The Scoreboard — Myth Busters #01 (viral cut): Does winning the toss win matches?

A 97-second Instagram Reel: 1080×1920, 30 fps, mastered to −14 LUFS. It is a faster, Reels-native retelling of the toss analysis. The full method, the scripts and every figure live in `../toss-myth` (README and `analysis/`).

## What's different from the long version

- **Look:** floodlit night-match style, Anton and Inter Display type, word-by-word karaoke captions, and a chapter progress bar (CLAIM, TEST, DATA, 2021 TRAP, EXCEPTIONS, VERDICT).
- **The Toss-o-meter:** one gauge (40–60%) carries the story.
  - Green 48–52% is "just luck", gold is a "real edge".
  - ODIs land at 50.0%, T20Is at 50.5% and the IPL at 51.6%.
  - Tests jump to 57% when the toss winner bats first (48% when they bowl).
  - Everything together lands at 50.9%.
- **The hook:** "Winning the toss is worth almost nothing", slammed word by word over a spinning coin. A wall of real fixtures sampled from the dataset follows, with a counter to 8,408.
- **The 2021 trap:**
  - Dubai's 13 games light up (the chasing side won 12).
  - Toss winners won 30 of 45 across the tournament.
  - The tiles then fall away on "Then it vanished", before the 2022 / 2024 / 2026 bars (39%, 56%, 43%).
- **IPL:** a split card. Won the toss and bowled first: 54.7%. Batted first: 45.3%.
- **Verdict:** a 100-match grid (50 wins for a coin flip + 0.9 for the toss), a MYTH BUSTED stamp and a comment prompt.
- **Voice:** Kokoro `af_heart`, the engine's highest-rated voice, at a natural pace.
- **Music:** an original 100 BPM beat that cuts out just before each reveal and drops on it, with coin-flip wipes, impacts, risers and a tape stop.
- **Cut for length:** the toss-grounds segment from the long version.

## Data

- **Source:** [Cricsheet](https://cricsheet.org) open data, licensed under ODC-BY. Men's Tests and ODIs from 2002, T20Is from 2005, IPL 2008–2026.
- **Afghanistan matches:** Cricsheet withholds matches involving Afghanistan's men. The 2021 World Cup figures include their five games, taken from official scorecards (see `analysis/WC2021_AFGHANISTAN.md`). The 2022–26 bars are footnoted.

## Rebuild

```bash
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
```
