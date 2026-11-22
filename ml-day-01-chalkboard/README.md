# 100 Days of ML · Day 1: What Is Machine Learning? (CHALKBOARD trial)

**Trial version of Day 1 in the CHALKBOARD look** (user asked for chalkboard and comic versions of the same video to choose the series style). Same script, narration and timeline as `ml-day-01-what-is-ml/`; only the look and sound change:

- **Board:** green slate with chalk-dust texture, faint ghosts of erased writing, wooden frame and a chalk tray with chalk pieces and a duster (`ChalkBoard` in `src/components/NB.tsx`).
- **Chalk:** every rough.js stroke and every letter passes through a grain filter (`#chalkfx`, `ChalkDefs`), titles in **Cabin Sketch**, body in **Kalam**, coloured chalk palette (`nb` in `src/theme.ts`); a chalk stick rides the tip as text writes on.
- **Props:** notes are chalk-outlined boxes held by coloured magnets; highlights are soft colour smears; stamps are chalk outlines.
- **Transition:** an eraser sweeps across the board and wipes the old scene, leaving a dusty smear (`ChalkWipe` in `src/Main.tsx`).
- **Subtitles:** chalk words on a faint dark band, the spoken word turns yellow with a chalk underline.
- **Sound:** the lo-fi study beat stays; SFX become chalk scratch (with the odd squeak), eraser rub, magnet click and chalk tap (`SFX_MAP` in `src/SoundTrack.tsx`, synthesized in `scripts/gen-audio.mjs`).

The rest of this README (storyboard, VO, accuracy notes) is shared with the notebook version.

---


Episode 1 of **100 Days of Machine Learning** for **@curious_datascientist**, and the first video in the series' own **NOTEBOOK** look, chosen by the user from six theme mock-ups (`../ml-theme-options.png`) because the navy statistics template had become too familiar. 2:57, 1080×1920 (9:16), 30 fps, H.264 with AAC 48 kHz stereo, mastered to −14 LUFS.

It keeps the series' voice (Kokoro `af_heart` at 1.05×), pacing, word-synced subtitles and growth rules (title card from frame 0 listing everything covered, hook, save moment, caption poll with A/B/C/D options, CAPTION.md), but everything you see and hear is new.

## The notebook look (reuse for every ML episode)

| Layer | What it is | Where |
| --- | --- | --- |
| Paper | cream page, blue ruled lines every 64 px, red double margin at x = 118, punched holes, fibre texture, warm vignette | `Paper` in `src/components/NB.tsx` |
| Sketches | every shape is drawn with **rough.js** (seeded, so it's identical every render) and *draws itself on* like a pen (dash-offset); hachure fills hatch in after the outline | `Sketch`, `Layer`, `Arrow`, `Squiggle`, `CircleAround`, `Check`, `Cross` |
| Handwriting | **Caveat** (titles) and **Patrick Hand** (body) that *write themselves* left to right with a little pencil riding the tip | `Write`, `WriteAt` |
| Marker | yellow / pink / blue highlighter swiped behind words (multiply blend) | `Hi` |
| Props | sticky notes with tape, rubber stamps (SPAM, YOUR TURN!), an index card, a wavy-underlined pen header per page | `Sticky`, `Stamp`, `Header` |
| Doodles | phone + face scan, envelope, play button, map pin, house, robot, gamepad, bank, computer, paper plane, star, person, clusters, flash cards, trophy | `src/components/Doodles.tsx` |
| Transitions | every scene is a page; scenes change with a **real page turn** (the outgoing page, drawings and all, hinges at the left edge and swings away over the next page, darkening as it lifts) | `Page` in `src/Main.tsx` (`TURN = 16` frames) |
| Subtitles | handwritten words on a torn paper strip; spoken words go from pencil-grey to ink, the current word gets a marker swipe | `src/components/NBCaptions.tsx` |
| End card | TOMORROW sticky, robot, hand-drawn FOLLOW button tapped by a sketched hand (turns green: "Following!"), handle in pen, "for data science made simple!" with marker | `src/components/NBCta.tsx` |
| Palette | `nb` in `src/theme.ts`: ink #1E2433, blue / red / green / orange / purple pens, yellow / pink / sky / mint markers, four sticky-note colours | |
| Music | **lo-fi study beat**: 82 BPM, swung, Fmaj7–Em7–Dm7–Cmaj7 on a soft electric piano, sub bass, brushed snare, dark soft hats, music-box accents, vinyl crackle and tape hiss | `scripts/gen-audio.mjs` |
| SFX | new paper kit: `scribble` / `scribble-short` (pencil), `page` (page turn), `tap` (pencil tap), `marker` (highlighter swipe), `sticky` (note slapped down), plus the old pop / ding / chime / stamp / sparkle | `scripts/gen-audio.mjs`, placed in `src/SoundTrack.tsx` |

## Deliverables (in `out/`, produced by `scripts/build.sh`)

| File | What it is |
| --- | --- |
| `ML_Day_01_Chalkboard.mp4` | the finished Reel |
| `ML_Day_01_Chalkboard_Cover.png` | 1080×1920 notebook cover: 100 DAYS OF ML box, red "Day 1 / 100", "What is Machine Learning?" in handwriting with marker, robot doodle, the four everyday-ML doodles, "you use it 12x a day" with tally marks, "but do you know what it actually is?", SAVE THIS sticky, handle (all inside the 3:4 grid crop) |
| `ML_Day_01_Chalkboard.srt` | the on-screen subtitle pages |

The caption, poll and pinned comment are in [`CAPTION.md`](CAPTION.md).

## Storyboard

| # | Scene | What moves |
| --- | --- | --- |
| 1 | **Title card (from frame 0)** | 100 DAYS OF ML box, red "Day 1 / 100"; "What is / Machine / Learning?" writes itself (marker on Machine Learning), a robot sketches itself; "In this one:" checklist (Rules vs learning · How a machine learns · The 3 types · AI vs ML vs Deep Learning) written by ~1.6 s, each box ticked as it is named; SAVE THIS sticky. |
| 2 | **Hook** | "You used ML today..." + 12 tally marks (x12); face-unlock phone, envelope (SPAM stamp), play button and map pin sketch on as named, labelled in pen; NO RULES. THEY LEARNED. with a red squiggle. |
| 3 | **The old way** | Programmer doodle; RULE #1 sticky (IF email says "free money" THEN mark it SPAM); DATA + RULES → computer → ANSWERS; "fr3e m0ney!!!" email slips past, the rule is crossed out ("rule broken. straight to inbox."), a pile of IF... stickies: millions of rules?! |
| 4 | **ML flips it** | Envelopes get SPAM / NOT SPAM stamps (x 10,000 emails) → robot ("learning...") → green sticky "rules it found" (weird spelling · lots of $$$ · unknown sender · "URGENT!!!"); bottom: Normal: data + rules → answers vs ML: data + answers → RULES! (marker + red circle). |
| 5 | **Textbook definition** | Index card "MACHINE LEARNING (n.)" written line by line, "learn patterns from data" (yellow) and "explicitly programmed" (pink); Arthur Samuel 1959 quote sticky. |
| 6 | **Watch a machine learn** | Axes size (sq ft) / price ($k), 10 houses; round 1 random line ("terrible!"); dashed error lines + ERROR meter with the average miss in $k; rounds 2, 3, 4 on "nudges / again / again" (pencil ghosts of old guesses); fast-forward to round 50, error tiny, green tick; GUESS → ERROR → ADJUST → REPEAT loop, circled: = learning! |
| 7 | **The model** | MODEL box with the learned line inside ("a learned recipe"); house 1,500 sq ft → MODEL → $275k (predicted price); FEATURE (the input) / LABEL (the answer) with markers; table size (feature) / price (label): 800 → $170k, 1,200 → $230k, 2,000 → $350k, 1,500 → $275k. |
| 8 | **The 3 types** | 1 Supervised (flash cards with ✓/✗) · 2 Unsupervised (dots circled into 3 groups) · 3 Reinforcement (gamepad + trophy), each with a one-line meaning and example. |
| 9 | **Where it fits** | Nested hatched ellipses: Artificial Intelligence (machines doing smart things) ⊃ Machine Learning (learns from data) ⊃ Deep Learning, ChatGPT sticky. |
| 10 | **Remember this + save** | Pink sticky NORMAL PROGRAMMING: WE write the rules vs blue sticky MACHINE LEARNING: the MACHINE learns the rules; red bookmark "save this", paper plane with dashed trail "send it to a friend". |
| 11 | **Your turn, teaser, end card** | YOUR TURN! stamp, bank doodle, the fraud puzzle, "Which type is it?" with A Supervised · B Unsupervised · C Reinforcement · D Not ML boxes, bouncing VOTE IN THE CAPTION POLL + arrow; TOMORROW: Day 2 sticky, robot, FOLLOW tap, handle, made simple! |

## Voiceover script (timestamps are on the finished video)

**S1 · Title card** (0:00.00–0:10.10)
- `0:00.20` Day 1 of 100 Days of Machine Learning: what is machine learning, really?
- `0:04.63` Rules vs learning, how a machine actually learns, and the 3 types. Save this one!

**S2 · Hook** (0:10.10–0:25.61)
- `0:10.50` You've already used machine learning a dozen times today.
- `0:13.66` Your phone unlocked when it saw your face. Gmail hid a spam email. YouTube picked your next video. Google Maps guessed the traffic.
- `0:21.93` Nobody wrote rules for any of that. These systems learned.

**S3 · The old way** (0:25.61–0:44.16)
- `0:26.01` Here's how computers normally work. A programmer writes the rules.
- `0:29.92` Say we want to catch spam. We write a rule: if an email says free money, it's spam.
- `0:34.90` Data and rules go in. Answers come out.
- `0:37.74` But spammers just write "fr3e m0ney", and our rule breaks. We'd need millions of rules.

**S4 · Machine learning flips it** (0:44.16–0:57.47)
- `0:44.56` Machine learning flips this around.
- `0:46.59` We give the computer thousands of emails, each one already labelled: spam, or not spam.
- `0:52.11` And it works out the rules by itself.
- `0:54.31` Data and answers go in. The rules come out.

**S5 · Definition** (0:57.47–1:15.78)
- `0:57.87` Here's the textbook definition.
- `0:59.80` Machine learning is a branch of artificial intelligence where computers learn patterns from data, instead of being explicitly programmed.
- `1:07.70` Or, as Arthur Samuel put it in 1959: giving computers the ability to learn without being explicitly programmed.

**S6 · Watch it learn** (1:15.78–1:39.29)
- `1:16.18` So how does a machine actually learn? Let's watch it happen.
- `1:19.55` Here are some houses: their size, and their price.
- `1:22.42` The machine starts with a random guess. This line. It's terrible.
- `1:26.40` So it measures how wrong it is. That's the error.
- `1:29.20` Then it nudges the line, to be a little less wrong. And again. And again.
- `1:33.29` After many rounds, the error is tiny. Guess, measure the error, adjust, repeat. That's learning.

**S7 · The model** (1:39.28–1:54.78)
- `1:39.69` What it ends up with is called a model: a learned recipe that turns inputs into predictions.
- `1:45.06` Give it a house it has never seen, say 1,500 square feet, and it predicts the price.
- `1:50.27` The inputs are called features. The answer it predicts is called the label.

**S8 · Three types** (1:54.78–2:15.73)
- `1:55.18` Machine learning comes in 3 main types.
- `1:57.78` Supervised learning: learning from examples with answers, like spam or not spam.
- `2:02.93` Unsupervised learning: no answers at all, just finding hidden groups, like types of customers.
- `2:08.84` Reinforcement learning: learning by trial and error, with rewards, like a computer mastering a video game.

**S9 · AI vs ML vs DL** (2:15.73–2:29.28)
- `2:16.13` So where does it all fit? Artificial intelligence is the big circle: machines doing smart things.
- `2:21.97` Machine learning sits inside it. And deep learning, the tech behind ChatGPT, sits inside machine learning.

**S10 · The rule** (2:29.28–2:41.02)
- `2:29.68` So remember: in normal programming, we write the rules. In machine learning, the machine learns the rules from data.
- `2:36.54` Save this, and send it to a friend who's starting machine learning.

**S11 · Poll, teaser and CTA** (2:41.02–2:57.12)
- `2:41.37` Your turn: a bank learns to catch fraud from past transactions, each labelled fraud or not fraud. Which type is that? Vote in the caption poll!
- `2:50.61` Tomorrow, Day 2: the 3 types of machine learning, in depth.
- `2:54.40` Follow for data science made simple!

## Accuracy notes

- **Definition:** "a branch of AI where computers learn patterns from data instead of being explicitly programmed" is the standard textbook phrasing; the 1959 line is the classic paraphrase attributed to Arthur Samuel (it doesn't appear verbatim in his 1959 paper, but it is how the definition is universally quoted).
- **House data (scene 6):** sizes 700–2,300 sq ft, prices in $k = 50 + 0.15 × size + noise, with the noise chosen to be zero-mean and uncorrelated with size, so the least-squares line is exactly price = 50 + 0.15 × size. The animation interpolates from a bad first guess (330 − 0.06 × size) geometrically toward that line (a stand-in for gradient descent; the ERROR meter shows the true mean absolute error of the line on screen).
- **Prediction (scene 7):** 50 + 0.15 × 1,500 = 275 → $275k; table rows 800 → 170, 1,200 → 230, 2,000 → 350.
- **3 types / poll:** fraud detection with labelled past transactions is supervised learning (answer A); without labels it would be unsupervised anomaly detection.
- **AI ⊃ ML ⊃ DL:** ChatGPT is a deep-learning (transformer) model.

## Rebuild

```bash
npm install            # roughjs 4.6.6 is the one new dependency
python scripts/gen-voice.py --model <kokoro dir> --whisper <faster-whisper small.en dir>   # only if the narration changes
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
npx remotion studio src/index.ts
```

Scaffolded from `clt-uses/` (the newest pipeline: frame-0 title card, 0.7 final limiter), then re-skinned: the notebook kit (`NB.tsx`, `Doodles.tsx`, `NBCaptions.tsx`, `NBCta.tsx`), page-turn `Main.tsx`, lo-fi score and paper SFX in `gen-audio.mjs`, Caveat + Patrick Hand fonts in `public/fonts`. **Scaffold the next ML episodes from this project** (`REF=ml-day-01-what-is-ml`) and reuse the kit.
