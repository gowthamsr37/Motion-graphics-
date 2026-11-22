# Money Stories — Ep 01, Bollywood-drama cut: Arjun vs Meera (rent vs buy)

A 2 min 2 s Reel/Short (1080×1920, 30 fps, −14 LUFS). It is the same story and numbers as `../rent-vs-buy`, retold as a filmy drama in which the characters speak their own lines in Indian-accented English.

## Look
- **Stage:** velvet curtains, a gold valance, sweeping spotlights, gold bokeh, film grain with scratches and gate weave.
- **Type:** poster titles in Rozha One / Yatra One with an animated gold shine.
- **Filmy beats:**
  - The opening curtain reveal and an "ARJUN vs MEERA" title poster
  - TV-serial **triple zooms** with "dhin" hits on "Twenty years?!", "Hey Bhagwan." and "I told you!"
  - An **INTERVAL** curtain before the crash
  - A "20 years later" clock and "The Twist"
  - "Moral of the story" and an end card: "The End?", coming soon, Ep 2
- **Cast:** Arjun, Meera, Papa and Maa are lip-synced. The mouth opens with the loudness of each character's own line, using an envelope stored in `src/timeline.json`.

## Voices (Kokoro, `scripts/voiceover.json`)
| Character | Voice |
|---|---|
| Arjun | `hm_omega`, speed 1.03 |
| Meera | `hf_alpha`, speed 1.03 |
| Papa | `hm_psi`, speed 0.92 |
| Maa | `hf_beta`, speed 0.95 |
| Narrator | blend of 55% `hm_omega` + 45% `am_onyx`, speed 0.9 |

Pronunciation fixes cover lakh, EMI, Meera and beta.

## Numbers
The figures are the same model and assumptions as `../rent-vs-buy` (see its README and `analysis/model.py`). The assumptions card at the end states them, and the reel is educational only, not investment advice.

## Audio
The score and sound kit are original and synthesized:
- **Score:** a D Bhairav-flavoured groove with tanpura drone, a sitar-like pluck, strings, and a dhol/tabla pattern that drops out for the interval and the crash.
- **Sound kit:** "dhin" hits, stings, curtain swishes, a crash, coins, a clock, an interval fanfare and applause.

## Rebuild
```bash
python scripts/gen-voice.py --model <kokoro dir>
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
```
