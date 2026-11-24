# Paradox #4: The False Positive Paradox

Fourth reel of the **Probability Paradoxes** series (house style, orange accent, shared `ParadoxCover.tsx` in black + orange). About 2:22. Deliverables in `out/`: `False_Positive_Paradox.mp4`, `False_Positive_Paradox_Cover.png`, `.srt`; caption in `CAPTION.md`.

## Storyboard

1. **Title card** (frame 0): PARADOX #4, THE FALSE POSITIVE PARADOX, TEST RESULT POSITIVE (99% accurate) and "9%?", chips (99% accurate test · usually wrong · 10,000 people · why doctors retest), SAVE THIS ONE.
2. **Hook:** 1,000 dots with 1 red (1 in 1,000); test 99% accurate → POSITIVE stamp; chance you're really sick?; COMMENT YOUR GUESS.
3. **Answer:** "99%?" and "90%?" struck out; ABOUT 9%; 11 figures, 1 red: most positives are false alarms.
4. **10,000 people:** a 100×100 crowd fills in; the 10 sick grow red; 10 TRUE POSITIVES.
5. **Healthy crowd:** 9,990 healthy; 1% wrong → 101 orange dots light up; ~100 FALSE POSITIVES.
6. **The maths:** 110 figures (10 red + 100 orange); 10 ÷ 110 = 9%.
7. **Why:** to-scale sick (10) vs healthy (9,990) squares, the 1% strip ≈ 100 > 10; BASE RATE NEGLECT.
8. **Retest:** test #2 on the 110 positives, the false ones fall away (10 red + ~1 orange left); after 2 positives ~90%.
9. **Everywhere:** fraud alert · airport scanner · spam filter; RARE TARGET → MOST ALARMS ARE FALSE.
10. **Remember this:** a positive depends on how RARE it is, not just how ACCURATE the test is; SAVE THIS.
11. **Poll + teaser + end card:** disease in 1 in 10, is a positive more or less trustworthy? A more · B less · C same · D can't tell (answer A, ≈92%); NEXT PARADOX #5: SIMPSON'S; follow card.

## Accuracy

Prevalence 0.1%, sensitivity 99%, specificity 99%. P(sick | +) = 0.001·0.99 / (0.001·0.99 + 0.999·0.01) = 9.0%. After a second independent positive: 90.8%. At 10% prevalence: 91.7%. Crowd simulation: mulberry32 seed 33 over 10,000 people gives 10 sick (10 positive) and 101 false positives (10/111 = 9.0%). Illustrative, not medical advice.

## Voiceover script

**S1 · Title card** (0:00.00–0:12.01)
- `0:00.20` The false positive paradox.
- `0:02.11` A test that's 99% accurate, a result that's usually wrong, 10,000 people to prove it, and why doctors always retest. Save this one!

**S2 · Hook** (0:12.01–0:24.61)
- `0:12.31` A rare disease affects 1 in every 1,000 people.
- `0:15.55` You take a test that's 99% accurate. It comes back positive.
- `0:20.02` What's the chance you actually have the disease? Comment your guess before the answer.

**S3 · The answer** (0:24.61–0:34.64)
- `0:24.91` Most people say 99%. Some say 90.
- `0:28.24` The real answer: about 9%. More than 9 out of 10 positive results are false alarms.

**S4 · 10,000 people** (0:34.64–0:47.20)
- `0:34.94` Here's how. Picture 10,000 people.
- `0:37.47` 1 in 1,000 is sick, so 10 people really have the disease.
- `0:41.31` The test is 99% accurate, so it catches all 10 of them. 10 true positives.

**S5 · The healthy crowd** (0:47.20–1:02.94)
- `0:47.50` But here's the twist. The other 9,990 people are healthy.
- `0:52.45` And the test is wrong for 1% of them. 1% of almost 10,000 is about 100 people.
- `0:58.70` 100 healthy people told they're sick. Those are false positives.

**S6 · Do the maths** (1:02.94–1:16.03)
- `1:03.24` Now count all the positives: 10 true, plus about 100 false. About 110.
- `1:09.05` Only 10 of those 110 are really sick. 10 divided by 110 is about 9%.

**S7 · Why it happens** (1:16.03–1:30.69)
- `1:16.33` The trap is the base rate. The disease is so rare that the healthy crowd is huge.
- `1:21.19` A tiny error rate on a huge crowd creates more false alarms than there are real cases.
- `1:26.74` Ignoring how rare something is: that's called base rate neglect.

**S8 · Retest** (1:30.69–1:43.18)
- `1:30.99` That's why doctors retest. Among the 110 positives, a second test clears almost all the false alarms.
- `1:38.06` After two positive tests, the chance you're really sick jumps to about 90%.

**S9 · Real life** (1:43.18–1:56.63)
- `1:43.48` It's everywhere.
- `1:44.56` Your bank blocks your card for fraud, but it was just you shopping. Airport scanners beep at innocent bags. Spam filters bin real emails.
- `1:53.06` When the thing you're looking for is rare, most alarms are false.

**S10 · Remember this** (1:56.63–2:07.35)
- `1:56.93` So remember: a positive result depends on how rare the thing is, not just how accurate the test is.
- `2:03.29` Save this, and send it to someone who panics over every test result.

**S11 · Poll, teaser and CTA** (2:07.35–2:21.71)
- `2:07.70` Your turn: if the disease affected 1 in 10 people instead, would a positive test be more or less trustworthy? Vote in the caption poll!
- `2:16.41` Next paradox: Simpson's paradox.
- `2:18.99` Follow for data science made simple!

total 141.706
