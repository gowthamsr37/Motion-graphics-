# Beyond The Scoreboard — KL Rahul in Tests: the highs, the lows, everything

A 121-second Instagram Reel: 1080×1920, 30 fps, mastered to −14 LUFS, in the series' scoreboard style. It was made on the day of his 136 at Wellington (21 Nov 2026).

## Story

| # | Scene | On screen |
| --- | --- | --- |
| 1 | Wellington | 136 (290) flips onto the board; 13th Test hundred, first Test in NZ; his first hundred in each SENA country lights up (Sydney 2015 110, The Oval 2018 149, Centurion 2021 123, Wellington 2026 136); FIRST INDIAN OPENER TO DO IT |
| 2 | The line | The career timeline draws: 123 bars, one per innings (gold for 100+, cream for 50+), with the 10-innings rolling average above; 71 Tests · 123 innings · 4,424 runs · 37.49; RISE → CRASH → RISE AGAIN |
| 3 | The rise | 2014–17 highlighted; debut 3 & 1 → 110 at Sydney; seven lamps for seven straight fifties (90, 51, 67, 60, 51, 57, 85); 199 at Chennai |
| 4 | The crash | Aug 2018 – Aug 2019 highlighted in red; average 23.5, 17.3 without the Oval 149, 14 scores under 20; DROPPED · 2 YEARS OUT, with the gap marked on the timeline |
| 5 | The comeback | 2021–24 highlighted; 129 at Lord's, 123 and 101 (at No.6) at Centurion; average as an opener 39.3 against 26.7 at No.3 or lower |
| 6 | The renaissance | Since Leeds 2025: average 55.6, 22 innings, 1,167 runs, five hundreds |
| 7 | The paradox | Home 42.0 with 3 hundreds; away 35.5 with 10 hundreds; away hundreds by country (England 4) |
| 8 | Verdict | 4,424 runs · 13 hundreds · 37.49; crashes and comebacks; "the best version, right now?" |

## Data and method

- **Source:** every innings comes from [Cricsheet](https://cricsheet.org) Test ball-by-ball JSON (ODC-BY), downloaded on 16 Nov 2026. The scripts are `analysis/innings.py` and `analysis/analyse.py`; the results are in `summary.json` and `klr_innings.csv`.
- **Added by hand:**
  - Two Afghanistan Tests, which Cricsheet withholds. Bengaluru 2018: 54 off 64, b Yamin Ahmadzai. Mullanpur, June 2026: 100.
  - Today's Wellington first innings: 136 off 290, b Nathan Smith.
- **Totals reconciled:** 71 Tests (his 71st was today's), 123 innings, 4,424 runs, 118 dismissals, average 37.49, 13 hundreds (10 of them away). This matches the published counts.
- **Home and away:** home means Tests in India. Away hundreds: England 4, South Africa 2, Australia, New Zealand, Sri Lanka and West Indies 1 each.
- **Batting position:** taken from the order in which batters appeared in Cricsheet's ball-by-ball. Positions 1–2 count as opening (105 innings); 3 and below as middle order (18 innings).
- **Eras:**
  - Slump: Aug 2018 – Aug 2019, 22 innings. His last Test before being dropped was 30 Aug 2019; he returned on 4 Aug 2021.
  - Renaissance: from Leeds, 20 Jun 2025, 22 innings.
- **Seven straight fifties (2017):** the scores come from the data. That this equals the Test record is widely reported.
- **No photos:** no licensed photo of him in Test whites was found on Wikimedia Commons, so the reel is built from data graphics.

## Sources for today's innings

- [ESPNcricinfo match report](https://www.cricinfo.com/series/india-in-new-zealand-2026-27-1539421/new-zealand-vs-india-1st-test-1539442/match-report)
- [CricTracker](https://www.crictracker.com/cricket-news/six-or-seven-months-of-homework-helped-score-maiden-wellington-ton-says-kl-rahul-2787/)
- [ETV Bharat](https://www.etvbharat.com/en/sports/ind-vs-nz-1st-test-day-3-report-kl-rahul-score-cenury-shubman-gill-fifty-enn26112101747)
- [Asianet Newsable](https://newsable.asianetnews.com/sports/cricket-ind-vs-n-kl-rahuls-wellington-test-century-puts-his-sena-record-into-perspective-articleshow-ysggnnb)
- [CSR Journal on the 12th hundred](https://thecsrjournal.in/kl-rahul-slams-12th-test-century-against-afghanistan-in-mullanpur/)
- [ESPNcricinfo, 2018 Afghanistan scorecard](https://www.espncricinfo.com/series/18544/scorecard/1133983/india-vs-afghanistan-only-test-afg-in-india-2018)
