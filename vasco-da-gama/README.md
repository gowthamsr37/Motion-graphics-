# The Sea Road to India — Vasco da Gama (YouTube pilot)

A 2 min 18 s pilot for a ~15-minute YouTube history documentary about how and why Vasco da Gama reached India. It's 1920×1080, 30 fps, H.264 + AAC, mastered to −14 LUFS.

## Look

- **Antique chart style:** a hand-inked 15th-century portolan chart on aged parchment, drawn from real Natural Earth coastlines (`world-atlas`, 1:50m) with a camera-driven Mercator projection (`d3-geo`).
- **Map details:** engraved coastal ripples, a blue-grey sea wash, a compass rose with rhumb lines, routes drawn in dashed red ink with a caravel sailing along them, and cartouche cards.
- **Type:** Cinzel / EB Garamond / IM Fell English.
- **No burned-in subtitles,** as is usual for YouTube. Upload `captions.srt` as closed captions.

## Story (pilot)

1. **Hook:** 20 May 1498, three ships anchor off Calicut. They are the first Europeans to reach India by sea. Why?
2. **Pepper:** grown on the Malabar coast. Cinnamon came from Ceylon, cloves and nutmeg from the Spice Islands.
3. **The chain:**
   - The route runs Arabian Sea → Red Sea → Cairo → Alexandria → Venice.
   - A price ledger shows each hand adding its cut. It is illustrative, with no invented numbers.
   - Mamluk Egypt and Venice hold the keys.
   - The Ottoman shadow after 1453 is hatched over an approximate modern-borders extent.
4. **Portugal:**
   - It is locked out of the spice trade but faces the Atlantic.
   - Prince Henry sponsors voyages down the African coast.
   - Cape Bojador is passed in 1434 and the Congo is reached in 1482 (Diogo Cão).
   - Bartolomeu Dias rounds the Cape in 1488.
5. **Teaser:**
   - Da Gama leaves Lisbon on 8 July 1497 with four ships and about 170 men.
   - His route swings far out into the Atlantic, about three months out of sight of land, while the coast-hugging "expected way" is shown in grey.
   - "Why sail away from Africa to get around it?" leads into the title card.

## Notes on accuracy

- **Ottoman extent:** the hatched area is drawn with modern country shapes (Turkey, Greece, Bulgaria, North Macedonia, Albania) and is labelled "approx. extent".
- **The 1453 point:** the narration says the Ottomans "loomed over" the eastern routes, not that they blocked them. Spices kept flowing through Egypt and Venice, and the popular "Ottomans closed the spice route" claim is an oversimplification.
- **Routes:** the routes are schematic reconstructions from the commonly described voyages, not ship logs.

## Audio

- **Narration:** Kokoro TTS `bm_george` (British male), speed 0.95.
- **Score:** original and synthesized: D-minor strings, a harp-like pluck, a frame-drum pulse from the spice chain onward, a brighter progression for Portugal, and a D-major swell under the title.
- **Ambience and foley:** sea ambience throughout, plus parchment, quill, ship creak, coins, seals, wind and drums.

## Rebuild

```bash
python scripts/gen-voice.py --model <dir with kokoro model.onnx + voices.npz>   # only if the script changes
python3 scripts/make-srt.py                                                      # captions.srt for YouTube
BROWSER=/path/to/chrome-headless-shell bash scripts/build.sh
```
