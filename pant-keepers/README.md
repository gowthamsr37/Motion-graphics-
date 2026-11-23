# Beyond The Scoreboard — The Keeper File: Pant v India's keepers and the world's

A 171.5-second Instagram Reel: 1080×1920, 30 fps, mastered to −14 LUFS. Built from `../templates/the-file`, with Kokoro `am_michael` narrating and the page's six Pant photos.

## Story

| # | Scene | On screen |
| --- | --- | --- |
| 1 | Nine | A saffron 9 behind the raised-bat cut-out; "9 Test hundreds"; Dhoni 6 in 90 Tests v Pant 9 in 53 |
| 2 | India's keepers | One hundred every … Tests: Kirmani 44, Engineer 23, Dhoni 15, Saha 13, Pant 5.9 |
| 3 | The world | Scatter of average v strike rate for 13 leading keepers. Most cluster in the 30s at 50–60 runs per 100 balls; Pant 44.8 at 74.3; only Gilchrist (47.6, 82) is higher and faster |
| 4 | The tempo gap | Strike rate minus his own top-order teammates' in the same innings: Gilchrist\* +28.3, Pant +24.9, de Kock +22.3 … Dhoni +5.7, Saha −8.2, Watling −10.6. Edgbaston 2022: 98/5, then 146 off 111. "He doesn't fit the tempo. He changes it." |
| 5 | Sixes | 108, the most by a keeper (Gilchrist 100, Dhoni 78) |
| 6 | Home and away | Home v away averages for Pant (49.6 / 42.9), Dhoni (46.4 / 32.8) and Saha (31.2 / 27.3); at home v spin 99 per 100 balls. Away hundreds since 2002: India's other keepers 3 (Dhoni, Saha, Jurel), Pant 7, all in SENA, at least one in each country; Dhoni 0 in SENA |
| 7 | Losing situations | The honest part: average when walking in at 4 down under 150 (de Kock 47.6, Watling 43.1, Rizwan 40.1, Prior 36.8, Pant 33.7, Dhoni 30.9). Then the fourth innings: Oval 114, Sydney 97 (saved), Gabba 89\* (won), Mumbai 64 (the rest added 57); fourth-innings average Pant 41 v Dhoni 33. Average in Tests lost: Pant 39.3, the highest shown (Dhoni 26.9) |
| 8 | Verdict | Studio portrait print; **NOBODY CLOSE** stamp; 9 · 74 · 108 · 7; "The gloves? Another debate." |

## Data and method (`analysis/keepers.py`)

**Source:** [Cricsheet](https://cricsheet.org) Test ball-by-ball (ODC-BY) from Dec 2001.

**Keepers compared:**
- India: Pant, Dhoni, Saha, Jurel, Bharat.
- World: the leading designated keepers, namely Gilchrist (2002–08 only in the data), Haddin, Paine, Carey, Prior, Foakes, de Kock, Watling, Blundell, Rizwan, Kamran Akmal, Dickwella and Hope. Boucher, Bairstow and Mushfiqur were computed but left off the charts, because of partial careers or mixed roles.

**Metrics:**
- **Home and away:** country taken from the venue city.
- **Fourth innings:** innings 4 of the match.
- **In trouble:** walked in with 4+ wickets down and fewer than 150 on the board.
- **Tempo gap:** the keeper's strike rate minus the strike rate of his team's other top-7 batters in the same innings, on balls faced.
- **Average by result:** split by the match result for his team.

**Career lines:**
- **Pant:** 53 Tests, 3,853 runs, 44.8, 9 hundreds, home 49.62, away 42.94. This includes Wellington 2026 (128) and the June 2026 Afghanistan Test, added by hand as in `../pant-tests`.
- **Ball-by-ball metrics** (strike rate 74.3, tempo gap, in-trouble, fourth innings, results) run to Aug 2026.

**Published records** ([ESPNcricinfo](https://www.espncricinfo.com) and Wikipedia):
- **Syed Kirmani:** 88 Tests, 2,759 runs, 27.04, 2 hundreds ([Wikipedia](https://en.wikipedia.org/wiki/Syed_Kirmani)).
- **Farokh Engineer:** 46 Tests, 2,611 runs, 31.08, 2 hundreds ([Wikipedia](https://en.wikipedia.org/wiki/Farokh_Engineer)).
- **MS Dhoni:** 90 Tests, 4,876 runs, 38.09, 6 hundreds, 78 sixes.
- **Adam Gilchrist:** 96 Tests, 5,570 runs, 47.60, strike rate 81.95, 100 sixes.

**Checked facts:**
- **Edgbaston 2022:** fall of wickets 5/98, Pant 146 off 111.
- **Mumbai 2024:** India 121 all out chasing 147; Pant 64 (Cricsheet).
- **Sixes:** Pant's 108 is the most by a wicketkeeper, and second all-time after Ben Stokes (reported after Wellington).

**Honesty notes:**
- Pant is not the best rescuer of collapses on this measure, and the reel says so.
- India's win rate in Tests where he makes 50+ is not clearly higher than when he doesn't, so the reel makes no such claim. Its "impact" claims rest on the fourth innings and on averages in defeat.

## Photos

The page's six Pant photos, cut out with BiRefNet (raised bat, big hit, flick), plus the studio portrait as a print.

## Build

```bash
python3 analysis/keepers.py <cricsheet tests_male_json dir>
npm run voice
BROWSER=<chrome-headless-shell> bash scripts/build.sh   # → out/Beyond_The_Scoreboard_Pant_The_Keeper_File.mp4 + _Cover.png
```
