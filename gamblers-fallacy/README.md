# Paradox #2: The Gambler's Fallacy

Second reel of the **Probability Paradoxes** series (house style, orange series accent, shared `ParadoxCover.tsx` in black + orange). About 2:35. Deliverables in `out/`: `Gamblers_Fallacy.mp4`, `Gamblers_Fallacy_Cover.png`, `.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Title card** (frame 0): PARADOX #2, THE GAMBLER'S FALLACY, five heads + a "?" coin, "is tails due?", chips (Monte Carlo 1913 · the maths · 1,000,000 flips · everyday traps), SAVE THIS ONE.
2. **Hook:** five coins land HEADS on each spoken "heads"; HEADS / TAILS / 50-50; COMMENT YOUR ANSWER.
3. **Monte Carlo, 1913:** the wheel, black results piling up to 26, "RED IS DUE!", red bets, GAMBLERS LOST MILLIONS · the casino won.
4. **Answer:** 50-50, still; old flips fade; NO MEMORY; INDEPENDENCE card.
5. **Why it feels wrong:** BEFORE you start, ½⁵ = 1 in 32; AFTER, history, one flip left ½ · ½; the law of large numbers needs thousands, not five.
6. **Million-flip test** (mulberry32 seed 2): 1,000,000 flips; 31,225 runs of 5 heads; next flip 15,599 heads / 15,626 tails = 50.0%.
7. **How odd was Monte Carlo:** 26 in a row ≈ 1 in 66 million; after 25 blacks, black is still 48.6%; RARE STREAKS HAPPEN · THEY DON'T CHANGE THE ODDS.
8. **Everyday traps:** 3 boys → girl next? · lost 5 tosses → due? · avoiding last week's lottery numbers.
9. **Flip side:** "tails is due" and "heads is hot" both struck out, FAIR COIN: ALWAYS 50%; CAREFUL: only for truly random, independent events.
10. **Remember this:** random events HAVE NO MEMORY; SAVE THIS.
11. **Poll + teaser + end card:** red ×10, next black? A over 50% · B 48.6% · C under 10% · D 100% (answer B); NEXT PARADOX #3: MONTY HALL; follow card.

## Accuracy

- Monte Carlo Casino, 18 August 1913: black came up 26 times in a row. P(26 of one colour, given the first spin) = (18/37)^25 ≈ 1 in 66.6 million. European wheel: P(black) = 18/37 = 48.6%.
- 5 heads = (1/2)^5 = 1/32.
- Simulation: 1,000,000 flips, 31,225 positions preceded by ≥ 5 heads, of which 15,599 (49.96%) were heads.
- Boy/girl odds are roughly 50-50 (the real ratio is slightly above 1:1).

## Voiceover script

**S1 · Title card** (0:00.00–0:08.82)
- `0:00.20` The gambler's fallacy.
- `0:01.62` A true story from a casino, the simple maths, a million-flip test, and how it fools you every day. Save this one!

**S2 · Hook** (0:08.82–0:20.05)
- `0:09.12` You flip a fair coin five times. Heads, heads, heads, heads, heads.
- `0:13.45` What's the next flip more likely to be? Heads, tails, or 50-50? Comment your answer before I tell you.

**S3 · Monte Carlo 1913** (0:20.05–0:36.70)
- `0:20.35` Monte Carlo, 1913. At the roulette table, the ball lands on black. Again. And again.
- `0:26.86` After 10 blacks, the crowd is sure red is due. They bet more and more on red.
- `0:31.32` Black came up 26 times in a row. The gamblers lost millions. The casino won.

**S4 · The answer** (0:36.70–0:49.77)
- `0:37.00` So, the coin. The answer is 50-50. Still.
- `0:39.77` A coin has no memory. It doesn't know what happened before. Each flip is a brand new event.
- `0:45.12` Statisticians call this independence: the past flips don't change the next one.

**S5 · Why it feels wrong** (0:49.78–1:11.66)
- `0:50.08` So why does tails feel due? Because five heads in a row feels rare. And it is: 1 in 32.
- `0:55.99` But that was before you started. Once those five heads have happened, they're history. The only question left is one flip: half, half.
- `1:03.89` Your brain expects small samples to look balanced. The law of large numbers only works over thousands of flips, not five.

**S6 · Million-flip test** (1:11.66–1:23.07)
- `1:11.96` Don't trust me? We flipped a coin one million times on a computer.
- `1:15.73` 5 heads in a row happened 31,000 times. And the very next flip? Heads exactly 50% of the time.

**S7 · How odd was Monte Carlo?** (1:23.07–1:38.86)
- `1:23.37` And Monte Carlo? 26 in a row is about 1 in 66 million. Incredibly rare.
- `1:29.31` But even after 25 blacks, the next spin was still the same 48.6% for black. Rare streaks happen. They just don't change the odds.

**S8 · Everyday life** (1:38.86–1:56.01)
- `1:39.16` It fools us everywhere.
- `1:40.63` A couple with three boys thinks the fourth must be a girl. It's still about 50-50.
- `1:45.59` A captain who lost five tosses thinks he's due to win the next one. The coin doesn't care.
- `1:50.83` And people avoid last week's lottery numbers. They're exactly as likely as any others.

**S9 · The flip side** (1:56.01–2:12.31)
- `1:56.31` And watch out for the opposite mistake too: thinking heads is hot, so heads will continue. That's also wrong for a fair coin.
- `2:03.67` But careful: this only applies to truly random, independent events. A batter in form, or a slot machine that's rigged? Different story.

**S10 · Remember this** (2:12.31–2:21.18)
- `2:12.61` So remember: random events have no memory. The past doesn't make anything due.
- `2:17.51` Save this, and send it to the friend who says "this time I'm due."

**S11 · Poll, teaser and CTA** (2:21.18–2:34.42)
- `2:21.53` Your turn: a roulette wheel lands red 10 times in a row. What's the chance the next spin is black? Vote in the caption poll!
- `2:29.07` Next paradox: the Monty Hall problem.
- `2:31.70` Follow for data science made simple!

total 154.42
