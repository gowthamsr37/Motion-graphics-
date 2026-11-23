# Paradox #1: The Birthday Paradox

First reel of the **Probability Paradoxes** series for @curious_datascientist. Same house style as the statistics videos (navy backdrop, Sora / Inter / JetBrains Mono, house captions and end card, 112 BPM score + SFX, `af_heart` 1.05×, −14 LUFS). The series accent is orange (#FF8A00). The cover is the shared series cover `src/components/ParadoxCover.tsx` (user picked option D, black + orange, `PARADOX_PAL = "orange"`): a "PARADOX #n" banner, the title, a big counter-intuitive number, the art and the handle, all inside the grid crop. About 2:47.

Deliverables in `out/`: `Birthday_Paradox.mp4`, `Birthday_Paradox_Cover.png`, `Birthday_Paradox.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Title card** (frame 0): PARADOX #1, THE BIRTHDAY PARADOX, 23 people (two glowing), "23 people → 50%", four topic chips, SAVE THIS ONE.
2. **Hook:** cricket field filling to 23 people (22 players + umpire), "same birthday?", gut guess 23 ÷ 365 ≈ 6%, COMMENT YOUR GUESS.
3. **Answer:** 50.7% counts up, "basically a coin flip", 70 people → 99.9%.
4. **Why your gut is wrong:** "MY birthday?" star of 22 links ≈ 6% vs "ANY two?" web of 253 links; 5 friends = 10 pairs; 253 CHANCES FOR A MATCH.
5. **Maths:** EVERYONE DIFFERENT; 23 fraction tiles 365/365 … 343/365.
6. **Result:** the all-different bar shrinks 100% → 49.3% as the fractions multiply; 100 − 49.3 = 50.7%, AT LEAST ONE MATCH.
7. **Curve:** P(n) for n = 1–70 with markers 10: 12%, 23: 50.7%, 40: 89%, 57: 99%.
8. **Simulation:** 1,000 rooms in a 40×25 grid light up, giving 507 / 1,000 (mulberry32 seed 8); HALF THE ROOMS, LIKE THE MATHS.
9. **Real life:** birthday attack (two files → same fingerprint), long codes; class of 60 → 99.4%.
10. **Remember this:** everyone vs everyone → pairs explode → coincidences likely; 5→10, 10→45, 23→253, 70→2,415 pairs; lottery repeats are expected; SAVE THIS.
11. **Poll + teaser + end card:** class of 30, A 8% · B 30% · C 50% · D 70% (answer D, 70.6%); NEXT PARADOX #2: MONTY HALL; follow card.

## Accuracy

P(match) = 1 − ∏_{i=0}^{n−1}(365−i)/365 (365 equally likely days, no leap day): n = 10 → 11.7%, 23 → 50.7%, 30 → 70.6%, 40 → 89.1%, 57 → 99.0%, 60 → 99.4%, 70 → 99.9%. P(someone shares MY birthday among 22 others) = 1 − (364/365)^22 = 5.9%. Pairs = n(n−1)/2.

## Voiceover script

**S1 · Title card** (0:00.00–0:09.26)
- `0:00.20` The birthday paradox.
- `0:01.70` Why your gut gets it wrong, the maths step by step, a live simulation, and where it's used in real life. Save this one!

**S2 · Hook** (0:09.26–0:23.87)
- `0:09.56` A cricket match. 22 players on the field, plus the umpire. 23 people.
- `0:14.78` What's the chance that two of them share a birthday?
- `0:17.30` Most people guess around 6%. 23 out of 365. Comment your guess before the answer.

**S3 · The answer** (0:23.87–0:32.91)
- `0:24.17` The real answer? 50.7%. Basically a coin flip.
- `0:28.39` And with 70 people, it's 99.9%. Almost certain.

**S4 · Why your gut is wrong** (0:32.91–0:56.68)
- `0:33.21` Your brain is answering the wrong question. It's thinking: does someone share my birthday?
- `0:38.34` That really is small: about 6%.
- `0:40.84` But the question is: do ANY two people share a birthday? And with 23 people, there are 253 different pairs.
- `0:48.28` Even 5 friends make 10 pairs. Every new person pairs up with everyone already in the room.
- `0:53.89` That's 253 chances for a match.

**S5 · The maths, step by step** (0:56.68–1:18.55)
- `0:56.98` It's easier to work out the opposite: everyone has a different birthday.
- `1:00.91` Person 1 can have any day: 365 out of 365.
- `1:05.16` Person 2 must avoid that day: 364 out of 365.
- `1:09.77` Person 3: 363 out of 365. And so on, down to person 23: 343 out of 365.

**S6 · The result** (1:18.55–1:37.81)
- `1:18.85` Each fraction is only a little below 1. But multiply 22 of them, and the total shrinks fast.
- `1:25.06` Multiply them all, and the chance that everyone is different is only 49.3%.
- `1:30.83` So the chance of at least one shared birthday is 100 minus 49.3: that's 50.7%.

**S7 · The curve** (1:37.81–1:48.16)
- `1:38.11` Watch how fast it climbs.
- `1:39.84` 10 people: 12%. 23 people: 50%. 40 people: 89%. 57 people: 99%.

**S8 · Simulation** (1:48.16–1:59.83)
- `1:48.46` Still don't believe it? We simulated 1,000 rooms, each with 23 random people.
- `1:53.82` In 507 of them, two people shared a birthday. Half the rooms, just like the maths said.

**S9 · Real life** (1:59.83–2:19.08)
- `2:00.13` And this isn't just a party trick.
- `2:02.03` Hackers use it. The birthday attack finds two files with the same digital fingerprint much faster than you'd expect. That's why passwords and bank systems use extremely long codes.
- `2:13.49` And in a class of 60 students? A shared birthday is 99.4% certain.

**S10 · Remember this** (2:19.08–2:35.29)
- `2:19.38` So remember: when everyone is compared with everyone, the pairs explode, and coincidences become likely.
- `2:25.99` It's also why lottery results seem to repeat suspiciously often. With enough draws, a repeat is expected.
- `2:32.75` Save this, and test it in your next group chat.

**S11 · Poll, teaser and CTA** (2:35.29–2:47.21)
- `2:35.65` Your turn: in a class of 30 students, what's the chance that two share a birthday? Vote in the caption poll!
- `2:41.86` Next paradox: the Monty Hall problem.
- `2:44.49` Follow for data science made simple!

total 167.211
