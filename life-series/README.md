# Life Motivation Series: 504 sketch-style shorts

Short, no-voice motivational Reels (1080×1920, 30 fps, 15–20 s each). Every post is a hand-drawn
"truth about progress" sketch, set to synthesised music and sound effects. The look is warm paper, ink
lines that wobble like a hand-drawn animation, one accent colour, and a quote card at the end.

**The series in numbers:** 72 life topics × 7 visual formats = **504 posts**, about 1 a day for 16 months.

## The 7 formats

| Format | What happens | Topic fields used |
|---|---|---|
| `pile` | Expectation: 1 throw hits the target. Reality: a mountain of misses (counter ticks up), then the hit. | `u`, `c` |
| `squiggle` | "What people think it looks like" (a straight arrow) vs "what it really looks like" (a tangled scribble with 6 setbacks). | `goal`, `sb` |
| `iceberg` | The tip people see, then 6 hidden things revealed under the water. | `see`, `hid` |
| `compound` | 1.01³⁶⁵ = 37.8 vs 0.99³⁶⁵ = 0.03 drawn day by day, then "X a day = Y a year". | `hab` |
| `valley` | Expected straight line vs the real curve. "Most people quit here", then the breakthrough. | `quit`, `win` |
| `bamboo` | Years 1–4: nothing above ground while roots spread. Year 5: it shoots up. | `yrs`, `win` |
| `domino` | Six dominoes, each 1.5× bigger. One small habit knocks over a new life. | `dom` |

## Files
- `content/topics-1/2/3.mjs`: the topic library (field guide at the top of `topics-1.mjs`).
- `scripts/build-posts.mjs`: turns the topics into `content/posts.json` (504 specs) and `content/CAPTIONS.md`.
  It checks every label against its length limit and lists any that won't fit.
- `scripts/render-batch.mjs`: renders a range of posts to `out/posts/` (MP4 at −14 LUFS plus a cover PNG).
- `scripts/gen-audio.mjs`: the sound kit (12 SFX and 6 music loops), synthesised so there are no copyright issues.
- `src/formats/*.tsx`: the seven animations. `src/lib/ui.tsx` holds the shared drawing kit.
- `brand.json`: set `name` or `handle` to sign every end card (empty = no branding).

## Make videos
```bash
npm install
node scripts/build-posts.mjs          # after editing topics
node scripts/render-batch.mjs 1 30    # posts 001–030 (about 85 s each on 4 cores)
FORCE=1 REBUNDLE=1 node scripts/render-batch.mjs 15 15   # re-render one post after a code change
```

## Add topics
Add an object to a topics file, following the field guide, then run `build-posts.mjs`. Each new topic adds 7 posts.
Posting order is 7 rounds over all topics, so neighbouring posts always differ in topic and format.

## Notes
- **Numbers:** pile counts ("2,140 bad sketches") and bamboo years are symbolic storytelling, not statistics.
  The compound maths (1.01³⁶⁵ ≈ 37.8, 0.99³⁶⁵ ≈ 0.03) is exact.
- **Sound:** for extra reach, post with the built-in track, or mute it in the Instagram editor and add a trending sound.
- **Fonts:** Inter Display, Patrick Hand and Caveat (OFL).
