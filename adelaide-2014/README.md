# Beyond The Scoreboard — The Chase: Kohli's Day 5, Adelaide 2014

A 155-second film-style Reel (under the 3-minute cap) of Australia v India at Adelaide Oval, 9–13 December 2014, with Virat Kohli as the hero and day five as the story. It is 1080×1920 at 30 fps, mastered to −14 LUFS, and built from `../templates/the-file`, with Kokoro `am_michael` narrating.

The first cut was 3:53 with a long Hughes tribute. This version mentions Hughes once and gives about 94 of its 155 seconds to the final day.

## Story

| # | Scene | On screen |
| --- | --- | --- |
| 1 | Hook, day 5 | The chase chart frozen at 242/2, needing 122 with 8 wickets in hand. Kohli cut-out: 26, first Test as captain. "◀◀ Rewind 4 days": the line erases |
| 2 | Four days earlier | "A Test played in grief, two weeks after Phillip Hughes's death" (the one mention); Australia 517 (Warner 145, Clarke 128, Smith 162\*); Dhoni injured, Kohli leads; Johnson's first ball hits the helmet (flash, shake, music stops), and he gets up for 115; Warner 102, 364 on the final day; "Settle for a draw" is struck out for "Go for the win" |
| 3 | Day 5 morning | A DAY 5 chapter card; the chart runs to 57/2 (Dhawan 9, Pujara 21); "Kohli walks in at 57/2", 307 to get |
| 4 | Kohli v Lyon | Lyon cut-out: Kohli took 74 off 82 balls from Lyon on day 5, with 9 fours and a six. The chart runs to tea at 205/2 (Kohli 82\*, Vijay 85\*): "159 to win. One session." |
| 5 | The hundred | Kohli's celebration print; 100 off 135 balls; twin hundreds on captaincy debut (Greg Chappell 1975, Virat Kohli 2014); the chart reaches 242/2 with 8 wickets in hand: "The impossible chase is on." |
| 6 | Lyon finds a way | Lyon celebration print; the chart turns red wicket by wicket while a ledger fills (Vijay 99 lbw; Rahane 0, off the pad, with "No DRS in this series"; Rohit 6; Saha 13 b); "Kohli: 41 off 40 as wickets fall"; 304/6, Kohli 141\*, need 60; then "c Marsh b Lyon, on the boundary", 304/7 |
| 7 | Ending | India lose 8 for 73, Australia win by 48, Lyon 12 in the match (Lyon cut-out with the stump); Kohli 256 (115 + 141, most by an Indian on captaincy debut), full-time captain within a month; "India lost a Test that day. They found a captain." |

Kohli's day-5 figures come from Cricsheet ball by ball:
- **His innings:** in at 57/2 (over 20), 50 off 69 balls, 82\* at tea, 100 off 135, 141 off 175 with 16 fours and 1 six.
- **Against Lyon:** 74 runs off 82 balls, with 9 fours and 1 six.
- **The collapse:** from his hundred at 242/2 to his dismissal at 304/7, he made 41 off 40 balls.
- **His dismissal:** pulling Lyon to Mitchell Marsh at deep midwicket ([ESPNcricinfo](https://www.espncricinfo.com/print/story/809851), [Dawn](https://www.dawn.com/news/1150671)).

## Data and sources

- **Ball by ball:** [Cricsheet](https://cricsheet.org) match 754737 (ODC-BY). It gives:
  - every scorecard figure, the fall of wickets and the bowling
  - India's chase over by over (`analysis/inn4.json` → `src/data.json`)
  - when the wickets fell (both Vijay and Rahane in over 70), and Kohli's hundred in over 68
- **Checked against match reports:**
  - **Hughes tributes:** 63 seconds of applause before play; black armbands and 408 on the shirts; Warner's gesture to the sky on 63 ([cricket.com.au](https://www.cricket.com.au/news/4179905/famous-australia-india-test-moments-adelaide-second-test-2014-kohli-smith-hughes-lyon-warner-clarke), [ESPNcricinfo](https://www.espncricinfo.com/page2/content/story/808715.html), [Irish Times](https://www.irishtimes.com/sport/other-sports/david-warner-dedicates-century-to-phillip-hughes-1.2031001)).
  - **Day 1:** the Test was moved from Brisbane's 4 Dec start, and Australia were 354/6 at stumps.
  - **Clarke:** retired hurt on 60 on day 1 and returned for 128; the "most important Test" quote ([SBS](https://www.sbs.com.au/news/article/injured-clarke-inspires-dominant-australia/lq25chrmb), [ESPNcricinfo](https://www.espncricinfo.com/page2/content/story/809055.html)).
  - **Kohli's arrival:** Johnson's first-ball bouncer to Kohli on day 3, with Kohli coming in at 111/2, Dhoni injured and Kohli's first Test as captain ([cricket.com.au](https://www.cricket.com.au/news/3258220), [Irish Times](https://www.irishtimes.com/sport/other-sports/bouncer-scare-for-unharmed-kohli-to-help-players-past-phillip-hughes-shock-1.2034042), [Al Jazeera](https://www.aljazeera.com/amp/sports/2014/12/11/captain-kohli-leads-indias-fightback)).
  - **Day 5:** the overnight declaration, tea at 205/2 and the 185 stand ([ESPNcricinfo](https://www.espncricinfo.com/print/story/809851), [cricket.com.au](https://www.cricket.com.au/news/3256356)).
  - **Kohli's records:** twin hundreds on captaincy debut, after only Greg Chappell (1975), and the first overseas; 256, the most by an Indian on captaincy debut ([ESPNcricinfo stats](https://www.espncricinfo.com/story/twin-hundreds-on-captaincy-debut-and-lyon-s-ten-for-810001), [Sportskeeda](https://www.sportskeeda.com/cricket/virat-kohlis-twin-centuries-adelaide-australia-stats-records-created)).
  - **Rahane:** given out caught at short leg when replays showed pad, in a series with no DRS ([Sportskeeda](https://sportskeeda.com/cricket/5-instances-when-team-india-paid-price-bccis-reluctance-use-drs/5)).
  
## Photos

- **Supplied by the page:**
  - Kohli: three photos (arms raised to the sky, and hand on chest as a cut-out)
  - Warner: two, cut out
  - Smith beside the 408 on the outfield
  - Lyon: bowling, hands to face, celebrating with the stump (cut out), and a wicket appeal
- **Not used:**
  - a Josh Hazlewood photo, because he did not play this Test
  - a Kohli photo carrying a publisher's logo, because the logo would have had to be cropped out

## Build

```bash
npm run voice                                            # am_michael, speed 0.96
BROWSER=<chrome-headless-shell> bash scripts/build.sh    # → out/Beyond_The_Scoreboard_Adelaide_2014.mp4 + _Cover.png
```
