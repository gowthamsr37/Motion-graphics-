# The Complete Team File: why RCB won IPL 2026

A Beyond The Scoreboard reel (1080×1920, 30 fps, about 121 s). RCB were back-to-back champions (2025 and 2026). This reel ranks all ten teams on 30 phase KPIs and finds RCB the most complete side.

## Method
`analysis/phase.py <cricsheet ipl_json dir>` reads every 2026 IPL match (74 matches, playoffs included). For each team it measures five KPIs in each of six phases:

- **Phases:** batting and bowling × powerplay (overs 1–6), middle (7–15) and death (16–20).
- **KPIs:** run rate, dot-ball %, boundary %, sixes per innings and wickets per innings.

That gives 30 KPIs. It ranks the ten teams 1–10 on each and averages the ranks. The output is `analysis/ranks.json`, which is also copied to `src/data`.

## Headline numbers
- **Average rank:** RCB 3.53. Next best were RR and SRH, both 5.07; worst was MI at 6.73. RCB were top three in 16 of 30 KPIs, and their worst rank was 8th.
- **Powerplay batting:** 33.3% dot balls, 1st in the league (average 41.6%). Sixes per powerplay 2.5, 8th.
- **Middle and death batting:** run rate 2nd in both phases. Wickets lost at the death 1.31 per innings, 2nd (league average 1.93).
- **Powerplay bowling:** 2.25 wickets per innings, 1st. GT 2.06, league average 1.58, DC 1.00.
- **Death bowling:** 21.0% boundary balls, 1st (league average 24.1%).
- **Weak spot:** middle-overs bowling, 7th for wickets and 7th for dot balls.
- **Kohli:** 675 runs at a strike rate of 165.8, his highest IPL season strike rate (2024: 154.7).
- **Bhuvneshwar Kumar:** 28 wickets at an economy of 7.95.
- **Chasing:** 7 wins from 9 chases. Beat GT by 92 runs in Qualifier 1 and by 5 wickets in the final (31 May 2026).

## Sources
- Data: Cricsheet IPL ball-by-ball (cricsheet.org).
- Photos: RCB / IPL images supplied by the page.
