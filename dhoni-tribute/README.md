# Beyond The Scoreboard — MS Dhoni: The End of an Era

A 146-second Instagram Reel: 1080×1920, 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS. It is a tribute made on the day CSK announced Dhoni's retirement as an IPL player (17 Nov 2026), in the series' Adelaide-scoreboard style.

## Scenes

| # | Scene | On screen |
| --- | --- | --- |
| 1 | The news | Dark ground, one spotlight. "17 NOVEMBER 2026"; MS DHONI and 2008–2025 flip onto the board; END OF AN ERA; studio portrait |
| 2 | Where it began | The 2008 auction: the gavel strikes as the bid flips $500,000 → $1,000,000 → $1,500,000; ≈ ₹6 crore; MOST EXPENSIVE SIGNING · 2008; the coin-toss photo; CHENNAI SUPER KINGS · THEY FOUND THEIR CAPTAIN |
| 3 | The captain | 235 matches as captain, 136 wins, 10 finals, 5 titles; five trophies light up (2010, 2011, 2018, 2021, 2023) |
| 4 | The dynasty | Five CHAMPIONS rows, each with a trophy; a strip of every season (★ champions, ● runners-up); 5 × CHAMPIONS stamp |
| 5 | The batter | 278 matches, 5,439 runs, 38.30 average, 137.45 strike rate, 24 fifties, 264 sixes (the counter accelerates and a ball flies into the crowd); 375 fours · 100 not outs · 84* highest |
| 6 | Behind the stumps | A glove takes the catch and the bails fly; 205 dismissals, 158 catches, 47 stumpings; IPL WICKETKEEPING RECORD |
| 7 | The final years | Number 7 walking out; IPL 2024 · age 42 · strike rate 220.55 (161 off 73); "one man, one walk out" |
| 8 | The final chapter | Timeline: 2008 the beginning · 2025 final appearance · 2026 retirement announced · 2027 CSK mentor; fades to an empty ground with a glowing 7 |
| 9 | The tribute | Photo montage; career card (278 · 5,439 · 136 · 205 · 5); THANK YOU, THALA 💛 · BEYOND THE SCOREBOARD |

## Facts and sources

The retirement, the 2026 injury and the career totals were confirmed in the coverage on 17 Nov 2026:
- [Onmanorama](https://www.onmanorama.com/sports/cricket/2026/11/17/ms-dhoni-retires-from-ipl-cricket-to-continue-as-csk-mentor.html)
- [The Tribune](https://www.tribuneindia.com/news/sports/end-of-an-era-ms-dhoni-ends-ipl-playing-career-after-19-seasons)
- [ETV Bharat](https://www.etvbharat.com/en/sports/ms-dhoni-retirement-ipl-career-achievements-records-chennai-super-kings-enn26111704201)
- [myKhel](https://www.mykhel.com/cricket/ms-dhoni-ipl-career-5-titles-5-439-runs-and-136-captaincy-wins-459251.html)
- [CricketAddictor](https://cricketaddictor.com/cricket-news/ms-dhonis-record-as-ipl-captain-full-batting-stats-and-key-numbers-after-retirement-466132/)
- [Sunday Guardian](https://sundayguardianlive.com/sports/ms-dhoni-ipl-retirement-18-seasons-five-titles-and-an-unbreakable-bond-with-chennai-thala-incredible-journey-323546/)

What the figures cover:
- **Career totals** cover every IPL team he played for: CSK 2008–15 and 2018–25, plus Rising Pune Supergiant 2016–17. CSK-only counts (e.g. 5,314 runs in 272 games) are lower.
- **Captaincy:** 235 matches and 136 wins. That is 226 matches and 133 wins up to 2023, plus 9 matches and 3 wins in 2025 after Ruturaj Gaikwad was injured.
- **Finals and titles:** CSK's 10 finals were 2008, 2010, 2011, 2012, 2013, 2015, 2018, 2019, 2021 and 2023. They won in 2010, 2011, 2018, 2021 and 2023.
- **2008 auction:** $1.5 million, the auction's highest price, about ₹6 crore at 2008 exchange rates.
- **Batting:** 100 not outs is consistent with the average: 5,439 runs ÷ 142 dismissals = 38.30.
- **2024 season:** 161 runs off 73 balls, a strike rate of 220.55, at age 42.
- **Final appearance:** 25 May 2025, CSK v GT in Ahmedabad.

## Photos

The five photographs were supplied by the page. A franchise watermark in the corner of the studio portrait was painted out, and the photos were upscaled for 1080 px. No other photos were used, so the trophy and season graphics are drawn rather than photographed.

## Audio

- **Narration:** Kokoro TTS, `am_michael` voice, the series narrator, at a natural pace. Pronunciation is fixed for IPL, Thala, wicketkeeping and cricketer. It is a US-English voice; no Indian-English voice of matching quality is available offline.
- **Music:** original and synthesized. Piano in the dark, a nostalgic 2008 figure, a proud build with a hit on every title, more drive for the batting and the stumps, an emotional turn for the final years, near silence for the 7, and a full swell for the tribute.
- **Sound effects:** board flips, an auction gavel, trophy chimes, bat on ball, a catch, stumps and bails, a stadium chant and crowd swells.

## Rebuild

```bash
python scripts/gen-voice.py --model <kokoro model dir> --whisper <faster-whisper dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
```
