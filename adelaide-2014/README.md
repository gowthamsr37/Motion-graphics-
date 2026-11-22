# Beyond The Scoreboard — The Adelaide Test, 2014

A 233-second film-style Reel of the Australia v India Test at Adelaide Oval, 9–13 December 2014: 1080×1920, 30 fps, mastered to −14 LUFS. Built from `../templates/the-file`, with Kokoro `am_michael` narrating at 0.96 speed.

It runs past the usual 3-minute Reel cap, as requested, for full detail. Check that the account can post Reels of this length.

## Story

| # | Act | On screen |
| --- | --- | --- |
| 1 | Cold open | A black-bordered card: Phillip Hughes, 30 Nov 1988 – 27 Nov 2014, Test cap 408, **63\***, struck in Sydney on 25 Nov 2014. "Adelaide: the ground he called home". A 63-second applause ring, then the title card |
| 2 | Day 1, Tue 9 Dec | 408 drawn in outline (armbands, cap number on every shirt); Warner 63, "looks to the sky", 145; Clarke counts up to 60 and retires hurt (back); stumps 354/6 |
| 3 | Day 2, Wed 10 Dec | Clarke: "The most important Test of my career", 128; Smith beside the 408 painted on the outfield, 162\*; 517/7 declared |
| 4 | Day 3, Thu 11 Dec | Kohli, stand-in captain with Dhoni injured, aged 26 (the age Hughes would have turned on 30 Nov); walks in at 111/2; Johnson's first ball hits the helmet. A flash and shake, then the music stops and four lines appear in the silence. He gets up: 115 off 184; India 444, 73 behind; Lyon 5/134 |
| 5 | Day 4, Fri 12 Dec | Warner 102, a hundred in each innings; 290/5 declared overnight; India need 364 on day 5 on a turning pitch; "Block for a draw" is struck out for "Go for it" |
| 6 | Day 5, Sat 13 Dec | A live chase chart (India's score over by over, the 364 line, tea at 205/2, Kohli's 100 marker); twin hundreds on captaincy debut, Chappell 1975 and Kohli 2014; the 185 stand; 242/2, 122 to win |
| 7 | Then, Nathan Lyon | The chart continues as wickets turn red; a ledger of all eight wickets (Vijay 99 lbw; Rahane 0 c Rogers, off the pad; Rohit; Saha; Kohli 141 c Marsh; Shami; Aaron; Ishant st Haddin); "No DRS in this series"; **8 for 73** |
| 8 | Ending | Australia win by 48 (517/7d & 290/5d v 444 & 315); Lyon in front of a giant 12 (7/152, 12/286, player of the match); Kohli's 256 (115 + 141, most by an Indian on captaincy debut), full-time captain within a month; "India lose the Test. But they find their captain"; "Some Tests are won. This one is remembered"; the Hughes card returns: 63\*, forever |

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
  - **Hughes:** born 30 Nov 1988; struck on 63 at the SCG on 25 Nov 2014 playing for South Australia; died 27 Nov 2014.

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
