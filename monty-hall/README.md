# Paradox #3: The Monty Hall Problem

Third reel of the **Probability Paradoxes** series (house style, orange accent, shared `ParadoxCover.tsx` black + orange). About 2:30. Deliverables in `out/`: `Monty_Hall.mp4`, `Monty_Hall_Cover.png`, `.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Title card** (frame 0): PARADOX #3, THE MONTY HALL PROBLEM, three doors, STICK or SWITCH?, chips (the game · the answer · 3 easy ways · 1,000 games), SAVE THIS ONE.
2. **The game:** 1 car × 2 goats; you pick door 1 (YOU); the host opens door 3 (goat); switch to door 2?; COMMENT YOUR ANSWER.
3. **Answer:** "50-50" struck out; STICK 1/3 vs SWITCH 2/3; SWITCHING DOUBLES YOUR CHANCE; 1990 newspaper card (Marilyn vos Savant), angry letters, SHE WAS RIGHT.
4. **Way 1:** your pick 1/3 forever; the 2/3 bracket over doors 2+3 slides onto door 2 when the host opens 3.
5. **Way 2:** table of all three cases (car behind 1/2/3), with switching LOSE / WIN / WIN.
6. **Way 3:** 100 doors; the host opens 98; #1 your random pick vs #57 the door he avoided; OBVIOUSLY: SWITCH.
7. **1,000-game test** (mulberry32 seed 9): grid of games; stick 333 vs switch 667.
8. **The key:** the host KNOWS and NEVER opens the car → information → not 50-50.
9. **Real life:** update your odds; doctors · spam filters · data scientists; BAYESIAN THINKING.
10. **Remember this:** ALWAYS SWITCH, 2/3 beats 1/3; SAVE THIS; 3 cups + a coin.
11. **Poll + teaser + end card:** 100-door switch chance: A 1% · B 50% · C 67% · D 99% (answer D); NEXT PARADOX #4: FALSE POSITIVES; follow card.

## Accuracy

Standard assumptions: the car is placed uniformly at random, the host always opens a goat door you didn't pick and always offers the switch. P(win | switch) = 2/3; with 100 doors and 98 opened, 99/100. Marilyn vos Savant's "Ask Marilyn" column (Parade, 1990) gave the answer and drew thousands of letters, many from readers with PhDs, saying she was wrong.

## Voiceover script

**S1 · Title card** (0:00.00–0:08.83)
- `0:00.20` The Monty Hall problem.
- `0:01.74` The game, the answer that broke the internet, 3 easy ways to see it, and a 1,000-game test. Save this one!

**S2 · The game** (0:08.83–0:26.04)
- `0:09.13` You're on a game show. Three doors. Behind one is a brand new car. Behind the other two: goats.
- `0:15.07` You pick door number one.
- `0:16.53` The host, who knows where the car is, opens door number three. A goat.
- `0:20.60` Now he asks: do you want to switch to door number two? Stick or switch? Comment your answer.

**S3 · The answer** (0:26.04–0:45.77)
- `0:26.34` Most people say it doesn't matter. Two doors left, so 50-50.
- `0:30.43` Wrong. If you switch, you win 2 out of 3 times. Switching doubles your chance.
- `0:34.99` In 1990, a columnist named Marilyn vos Savant said this, and thousands of readers, including mathematicians, wrote in to say she was wrong. She was right.

**S4 · Way 1: your first pick** (0:45.77–1:03.04)
- `0:46.07` Here's the first way to see it.
- `0:47.79` When you picked door one, you had a 1 in 3 chance of being right. That never changes.
- `0:52.67` So there's a 2 in 3 chance the car is behind one of the other two doors. The host just opens the goat among them, and the whole 2 in 3 moves onto the last door.

**S5 · Way 2: all three cases** (1:03.04–1:19.19)
- `1:03.34` Second way: just list every case.
- `1:05.56` Car behind door one: switching loses.
- `1:08.09` Car behind door two: the host opens three, you switch to two, you win.
- `1:12.28` Car behind door three: the host opens two, you switch to three, you win.
- `1:16.56` Switching wins in 2 of the 3 cases.

**S6 · Way 3: a hundred doors** (1:19.19–1:34.62)
- `1:19.49` Third way, the one that makes it click. Imagine 100 doors.
- `1:23.03` You pick one. The host opens 98 goat doors, leaving just your door and one other.
- `1:28.51` Would you stick with your random pick, or switch to the one door he carefully avoided? Obviously, switch.

**S7 · 1,000-game test** (1:34.61–1:44.58)
- `1:34.92` Still not convinced? We played 1,000 games on a computer.
- `1:38.46` Always sticking won 333 cars. Always switching won 667.

**S8 · The key** (1:44.58–1:54.52)
- `1:44.88` The key is the host. He knows where the car is, and he never opens it.
- `1:48.84` His choice isn't random, so it gives you information. That's why the odds aren't 50-50.

**S9 · Real life** (1:54.52–2:09.51)
- `1:54.82` And it's not just game shows. When new information arrives, update your odds. Don't freeze on your first guess.
- `2:01.18` That's exactly how doctors read test results, how spam filters learn, and how data scientists think. It's called Bayesian thinking.

**S10 · Remember this** (2:09.51–2:17.10)
- `2:09.81` So remember: always switch. 2 in 3 beats 1 in 3.
- `2:13.60` Save this, and try it on a friend with three cups and a coin.

**S11 · Poll, teaser and CTA** (2:17.10–2:29.83)
- `2:17.45` Your turn: in the 100-door version, if you switch, what's your chance of winning the car? Vote in the caption poll!
- `2:24.06` Next paradox: the false positive paradox.
- `2:27.11` Follow for data science made simple!

total 149.832
