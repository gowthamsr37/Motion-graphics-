// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// Mix (house style): narration on top, the synthesized score ducked under every line, SFX placed on the visual events
// (computed from the same word cues the scenes use, 2 frames early so they feel in sync).
import React from "react";
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { CLAMP } from "./components/Motion";
import { theme } from "./theme";
import { sceneRange, sceneTiming, SceneId, voCues } from "./timing";

type Hit = { at: number; file: string; vol: number };

const useDuck = (open: number, ducked: number) => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps / 4);
  return (f: number) => {
    let d = 0;
    for (const c of cues) {
      const a = c.from - 3;
      const b = c.from + c.duration + 3;
      if (f < a - ramp || f > b + ramp) continue;
      d = Math.max(d, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP }));
    }
    return interpolate(d, [0, 1], [open, ducked]);
  };
};

const useHits = (): Hit[] => {
  const { fps } = useVideoConfig();
  const hits: Hit[] = [];
  const at = (id: SceneId) => {
    const base = sceneRange(fps, id).from;
    return (rel: number, file: string, vol: number) => hits.push({ at: base + rel - 2, file, vol });
  };

  // S1 — hook: most people below average?
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const AVG = s.cueS(0, "average"), LESS = s.sent(1).from, HOW = s.sent(2).from, SKEW = s.cueS(3, "skew.");
    h(2, "whoosh.wav", 0.18);
    for (let i = 0; i < 9; i++) h(8 + i * 3, "tick.wav", 0.12);
    h(AVG - 4, "glide.wav", 0.25);
    h(AVG + 8, "pop.wav", 0.3);
    for (let i = 0; i < 7; i++) h(LESS + 4 + i * 4, `blip${Math.min(5, i + 1)}.wav`, 0.2);
    h(HOW - 2, "pop.wav", 0.35);
    h(SKEW - 8, "whoosh.wav", 0.3);
    h(SKEW - 2, "impact.wav", 0.45);
    h(SKEW, "glitch.wav", 0.25);
  }
  // S2 — what skew is
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const LOP = s.cueS(0, "lopsided."), PILE = s.cueS(1, "pile"), TAIL = s.cueS(1, "tail"), NAME = s.sent(2).from;
    for (let i = 0; i < 12; i++) h(4 + i * 2, "tick.wav", 0.1);
    h(LOP - 6, "glide.wav", 0.32);
    h(LOP - 2, "pop.wav", 0.35);
    h(PILE - 4, "click.wav", 0.25);
    h(TAIL - 4, "whoosh.wav", 0.28);
    h(NAME + 4, "chime.wav", 0.25);
  }
  // S3 — three shapes
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    ["Symmetric,", "Right-skewed,", "Left-skewed,"].forEach((w, i) => {
      const f = s.cueS(i + 1, w);
      // land before the word: an effect on the first consonant masks it ("Right" heard as "Bright")
      h(f - 12, "whoosh.wav", 0.2);
      h(f - 8, `step${i + 1}.wav`, 0.26);
      h(f + 16, "pop.wav", 0.18);
    });
  }
  // S4 — the tail rule
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const MEANW = s.cueS(0, "mean"), MEDW = s.cueS(1, "median,"), MODEW = s.cueS(1, "mode,"), FLIP = s.cueS(2, "flips."), SYMW = s.cueS(3, "symmetric,");
    for (let i = 0; i < 12; i++) h(4 + i * 2, "tick.wav", 0.1);
    h(MEANW - 6, "pop.wav", 0.3);
    h(MEANW - 4, "pop.wav", 0.35);
    h(MEANW + 4, "glide.wav", 0.22);
    h(MEDW - 4, "pop.wav", 0.32);
    h(MODEW - 4, "pop.wav", 0.32);
    h(MODEW + 6, "click.wav", 0.25);
    h(FLIP - 6, "whoosh.wav", 0.3);
    h(FLIP + 14, "flip.wav", 0.3);
    h(SYMW - 6, "glide.wav", 0.28);
    h(SYMW + 14, "chime.wav", 0.28);
  }
  // S5 — how to spot it
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const COMP = s.cueS(0, "compare"), ABOVE = s.cueS(1, "above"), RIGHTW = s.cueS(1, "Right"), BELOW = s.cueS(1, "Below"), LEFTW = s.cueS(1, "Left"), BOX = s.cueS(2, "box"), WHISK = s.cueS(2, "whisker");
    h(COMP - 4, "pop.wav", 0.32);
    h(s.sent(1).from - 10, "whoosh.wav", 0.2);
    h(RIGHTW - 3, "pop.wav", 0.32);
    h(RIGHTW + 10, "ding.wav", 0.22);
    h(BELOW - 4, "whoosh.wav", 0.22);
    h(LEFTW - 3, "pop.wav", 0.32);
    h(BOX - 2, "pop.wav", 0.3);
    h(BOX + 4, "glide.wav", 0.2);
    h(WHISK - 2, "sparkle.wav", 0.25);
  }
  // S6 — why it matters
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    const MIS = s.cueS(0, "misleads."), MEDW = s.cueS(1, "median:"), REP = s.cueS(2, "median"), LOGW = s.cueS(2, "log-transform");
    for (let i = 0; i < 9; i++) h(4 + i * 2, "tick.wav", 0.1);
    h(MIS - 2, "stamp.wav", 0.3);
    h(MEDW - 2, "pop.wav", 0.35);
    h(MEDW + 2, "ding.wav", 0.28);
    h(REP - 4, "pop.wav", 0.3);
    h(LOGW - 4, "pop.wav", 0.3);
    h(LOGW + 4, "glide.wav", 0.25);
  }
  // S7 — complete picture
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(s.sent(0).from - 2, "sparkle.wav", 0.25);
    [{ i: 1, w: "Symmetric:" }, { i: 2, w: "Right" }, { i: 3, w: "Left" }].forEach((c, k) => {
      const f = s.cueS(c.i, c.w);
      h(f - 10, `blip${k * 2 + 1}.wav`, 0.26);
      h(f + 10, "click.wav", 0.18);
    });
    h(s.duration - 10, "whoosh.wav", 0.28);
  }
  // S8 — quiz + CTA
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    const QQ = s.sent(0).from, W200 = s.cueS(1, "200"), FEW = s.cueS(1, "few"), SKEWQ = s.cueS(2, "skewed?"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    const TAILW = s.cueS(4, "tail"), MEANW = s.cueS(4, "mean"), FOL = s.sent(5).from, FOLW = s.cueS(5, "Follow"), SIMPLE = s.cueS(5, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    [0, 3, 6].forEach((d) => h(W200 - 4 + d, "tick.wav", 0.15));
    [0, 3, 6, 9, 12].forEach((d) => h(FEW - 2 + d, "tick.wav", 0.15));
    h(SKEWQ - 3, "pop.wav", 0.32);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(TAILW - 4, "whoosh.wav", 0.25);
    h(MEANW - 4, "pop.wav", 0.3);
    h(FOL - 10, "whoosh.wav", 0.3);
    h(FOL - 4, "sparkle.wav", 0.28);
    h(FOLW - 2, "pop.wav", 0.35);
    h(FOLW + 2, "click.wav", 0.25);
    h(FOLW + 16, "button.wav", 0.5);
    h(SIMPLE - 8, "pop.wav", 0.3);
    h(SIMPLE + 4, "sparkle.wav", 0.25);
  }
  return hits;
};

export const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = useDuck(0.5, 0.16);
  const hits = useHits();
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {hits.map((x, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(x.at))} layout="none">
          <Audio src={staticFile(`audio/${x.file}`)} volume={x.vol} />
        </Sequence>
      ))}
    </>
  );
};
