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

  // S1 — hook
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    h(4, "whoosh.wav", 0.18);
    [0, 1, 2, 3].forEach((i) => h(16 + i * 10, "pop.wav", 0.18));
    h(s.sent(1).from - 8, "glitch.wav", 0.18);
    [0, 1, 2].forEach((i) => h(s.sent(1).from + 2 + i * 8, "pop.wav", 0.18));
    const CLT = s.cueS(2, "Central");
    h(CLT - 12, "whoosh.wav", 0.3);
    h(CLT - 6, "impact.wav", 0.42);
    h(CLT + 12, "chime.wav", 0.22);
  }
  // S2 — the definition, line by line
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    h(s.sent(0).from - 2, "sparkle.wav", 0.22);
    [s.cueS(1, "many"), s.cueS(1, "average"), s.cueS(2, "bell"), s.cueS(2, "even"), s.cueS(3, "30")].forEach((f, i) => h(f - 10, `blip${i + 1}.wav`, 0.24));
    h(s.duration - 30, "ding.wav", 0.26);
  }
  // S3 — the example
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    h(s.sent(1).from - 6, "whoosh.wav", 0.2);
    for (let i = 0; i < 8; i++) h(s.sent(1).from + i * 4, "tick.wav", 0.1);
    h(s.cueS(2, "little,") - 8, "pop.wav", 0.24);
    h(s.cueS(2, "lot.") - 8, "pop.wav", 0.24);
    h(s.cueS(3, "skewed,") - 8, "stamp.wav", 0.36);
  }
  // S4 — step by step
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const S2 = s.sent(1).from, S3 = s.sent(2).from, PLOT = s.cueS(2, "plot"), LOOK = s.sent(3).from;
    h(s.sent(0).from - 8, "step1.wav", 0.24);
    for (let i = 0; i < 6; i++) h(s.cueS(0, "pick") + i * 4, "tick.wav", 0.1);
    h(s.cueS(0, "average") - 6, "glide.wav", 0.22);
    h(S2 - 22, "hop.wav", 0.24);
    h(S2 - 8, "step2.wav", 0.24);
    h(s.cueS(1, "average.") - 6, "glide.wav", 0.22);
    h(S3 - 22, "hop.wav", 0.24);
    h(S3 - 8, "step3.wav", 0.24);
    const span = Math.max(30, PLOT + 40 - S3 - 16);
    for (let i = 0; i < 16; i++) h(S3 + 16 + (i / 16) * span, "tick.wav", 0.09);
    h(LOOK - 8, "tada.wav", 0.32);
    h(LOOK + 6, "sparkle.wav", 0.2);
  }
  // S5 — why it happens
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    h(s.sent(0).from - 6, "pop.wav", 0.26);
    [0, 1, 2].forEach((r) => h(s.sent(1).from + 2 + r * 10, "shuffle.wav", 0.14));
    h(s.cueS(1, "huge") - 6, "glitch.wav", 0.16);
    [0, 1, 2].forEach((r) => h(s.sent(2).from + 4 + r * 8, "pop.wav", 0.22));
    h(s.cueS(2, "middle.") - 8, "ding.wav", 0.24);
  }
  // S6 — two bonus facts
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    h(8, "whoosh.wav", 0.18);
    h(s.cueS(1, "true") - 8, "glide.wav", 0.22);
    h(s.cueS(2, "narrower,") - 8, "glide.wav", 0.22);
    h(s.cueS(2, "precise.") - 8, "ding.wav", 0.24);
  }
  // S7 — remember
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(s.sent(0).from - 2, "sparkle.wav", 0.24);
    [s.cueS(1, "Many"), s.cueS(1, "one"), s.cueS(1, "bell")].forEach((f, k) => h(f - 10, `step${k + 1}.wav`, 0.24));
    h(s.cueS(1, "whatever") - 6, "pop.wav", 0.2);
    h(s.sent(2).from - 4, "whoosh.wav", 0.2);
    h(s.cueS(2, "country.") - 8, "ding.wav", 0.24);
  }
  // S8 — quiz, teaser, CTA
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    const QQ = s.sent(0).from, SKEW = s.cueS(1, "skewed."), W50 = s.cueS(1, "50,"), SHAPE = s.cueS(2, "shape"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    const WHY = s.sent(4).from, WHATEVER = s.cueS(4, "whatever"), TZ = s.sent(5).from, FUTURE = s.cueS(5, "future"), FOL = s.sent(6).from, FOLW = s.cueS(6, "Follow"), SIMPLE = s.cueS(6, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    h(SKEW - 8, "glide.wav", 0.2);
    h(W50 - 8, "pop.wav", 0.26);
    h(SHAPE - 8, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(WHY - 4, "glide.wav", 0.24);
    h(WHATEVER - 8, "pop.wav", 0.26);
    h(TZ - 10, "whoosh.wav", 0.3);
    h(FUTURE - 8, "sparkle.wav", 0.28);
    [0, 1, 2, 3].forEach((i) => h(FUTURE + 8 + i * 6, "pop.wav", 0.2));
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
