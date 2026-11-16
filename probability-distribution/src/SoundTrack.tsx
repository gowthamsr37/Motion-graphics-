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

  // S1 — hook: a dice tumbles, six chances, six bars
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const EVERY = s.sent(2).from, OUT = s.cueS(2, "outcome."), PD = s.sent(3).from, PDW = s.cueS(3, "probability");
    h(2, "whoosh.wav", 0.18);
    for (let i = 0; i < 10; i++) h(6 + i * 6, "tick.wav", 0.12);
    h(EVERY - 12, "clink.wav", 0.26);
    for (let i = 0; i < 6; i++) h(EVERY + i * 4, `blip${Math.min(5, i + 1)}.wav`, 0.18);
    h(OUT - 6, "pop.wav", 0.22);
    h(PD - 8, "glide.wav", 0.24);
    h(PDW - 12, "whoosh.wav", 0.3);
    h(PDW - 6, "impact.wav", 0.42);
    h(PDW + 14, "chime.wav", 0.22);
  }
  // S2 — what it is: weather chances add up to 1
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const EVERY = s.cueS(0, "every"), LIKELY = s.cueS(0, "likely"), ADD = s.cueS(1, "add"), ONE = s.cueS(1, "1,");
    h(6, "whoosh.wav", 0.16);
    [0, 6, 12].forEach((d) => h(EVERY - 6 + d, "pop.wav", 0.22));
    [0, 5, 10].forEach((d) => h(LIKELY - 4 + d, "click.wav", 0.2));
    [0, 10, 20].forEach((d, i) => h(ADD - 8 + d, `step${i + 1}.wav`, 0.24));
    h(ONE - 8, "ding.wav", 0.26);
  }
  // S3 — two kinds
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    h(4, "pop.wav", 0.28);
    h(s.cueS(1, "Discrete,") - 10, "whoosh.wav", 0.22);
    h(s.cueS(1, "continuous,") - 10, "whoosh.wav", 0.22);
    h(s.cueS(1, "continuous,") + 6, "glide.wav", 0.2);
  }
  // S4 — one dice
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const SIX = s.cueS(0, "6"), ONE6 = s.cueS(0, "6", 1), BARS = s.cueS(1, "bars,"), STACK = s.cueS(2, "Stack"), ONE = s.cueS(2, "1.");
    for (let i = 0; i < 6; i++) h(SIX - 10 + i * 4, "tick.wav", 0.14);
    h(ONE6 - 6, "pop.wav", 0.22);
    h(BARS - 8, "glide.wav", 0.24);
    for (let i = 0; i < 6; i++) h(STACK - 6 + i * 5, `blip${Math.min(5, i + 1)}.wav`, 0.2);
    h(ONE - 8, "ding.wav", 0.28);
  }
  // S5 — two dice
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const ROLL = s.sent(0).from, COMB = s.sent(1).from, W7 = s.cueS(1, "7."), MOST = s.sent(2).from, LIKELY = s.cueS(2, "likely"), RARE = s.sent(3).from;
    for (let i = 0; i < 8; i++) h(ROLL + i * 5, "tick.wav", 0.12);
    h(ROLL + 38, "clink.wav", 0.26);
    h(COMB, "shuffle.wav", 0.22);
    h(W7 - 8, "sparkle.wav", 0.22);
    h(MOST - 18, "whoosh.wav", 0.24);
    for (let i = 0; i < 6; i++) h(MOST - 14 + i * 4, "tick.wav", 0.12);
    h(LIKELY - 8, "ding.wav", 0.24);
    h(RARE - 6, "pop.wav", 0.24);
  }
  // S6 — continuous
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    h(s.cueS(0, "any") - 6, "glide.wav", 0.2);
    h(s.cueS(0, "zero.") - 8, "stamp.wav", 0.26);
    h(s.sent(1).from + 2, "whoosh.wav", 0.22);
    h(s.cueS(2, "158") - 8, "glide.wav", 0.22);
    h(s.cueS(2, "68") - 8, "pop.wav", 0.28);
    h(s.sent(3).from - 6, "sparkle.wav", 0.26);
  }
  // S7 — why it matters
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(s.sent(0).from, "whoosh.wav", 0.2);
    [s.sent(1).from, s.sent(2).from, s.sent(3).from].forEach((f, i) => {
      h(f - 8, "pop.wav", 0.28);
      h(f + 8, i === 1 ? "glide.wav" : "click.wav", 0.18);
    });
  }
  // S8 — complete picture
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    h(s.sent(0).from - 2, "sparkle.wav", 0.25);
    [s.sent(1).from, s.sent(2).from, s.sent(3).from].forEach((f, k) => {
      h(f - 10, `blip${k * 2 + 1}.wav`, 0.26);
      h(f + 12, "click.wav", 0.18);
    });
    h(s.sent(4).from - 8, "ding.wav", 0.26);
    h(s.duration - 10, "whoosh.wav", 0.28);
  }
  // S9 — quiz + CTA
  {
    const s = sceneTiming(fps, "s9");
    const h = at("s9");
    const QQ = s.sent(0).from, FLIP = s.sent(1).from, ONEW = s.cueS(2, "one"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    const WHY = s.sent(4).from, TWO = s.cueS(4, "two"), FOL = s.sent(5).from, FOLW = s.cueS(5, "Follow"), SIMPLE = s.cueS(5, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    h(FLIP - 6, "whip.wav", 0.24);
    h(FLIP + 2, "clink.wav", 0.2);
    h(ONEW - 8, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    [0, 1, 2, 3].forEach((i) => h(WHY - 2 + i * 5, "pop.wav", 0.2));
    h(TWO - 8, "ding.wav", 0.24);
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
