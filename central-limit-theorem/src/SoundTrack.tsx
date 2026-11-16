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

  // S1 — hook: one dice flat; ten dice averaged again and again → a bell
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const FLAT = s.cueS(0, "flat."), TEN = s.sent(1).from, AVGW = s.cueS(1, "average."), BELLW = s.sent(2).from, CLT = s.cueS(3, "Central");
    h(2, "whoosh.wav", 0.18);
    for (let i = 0; i < 8; i++) h(6 + i * 5, "tick.wav", 0.12);
    h(FLAT - 22, "clink.wav", 0.24);
    h(FLAT - 8, "glide.wav", 0.22);
    for (let i = 0; i < 5; i++) h(TEN - 4 + i * 4, "tick.wav", 0.12);
    const t0 = AVGW - 4, t1 = BELLW - 6;
    for (let i = 0; i < 18; i++) h(t0 + (i / 18) * (t1 - t0), "tick.wav", 0.09);
    h(BELLW - 10, "whoosh.wav", 0.3);
    h(BELLW - 4, "impact.wav", 0.42);
    h(CLT - 10, "sparkle.wav", 0.28);
    h(CLT + 6, "chime.wav", 0.22);
  }
  // S2 — what it says
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    [s.cueS(0, "samples,"), s.cueS(0, "mean"), s.sent(1).from].forEach((f, i) => h(f - 10, `step${i + 1}.wav`, 0.24));
    h(s.cueS(1, "normal") - 8, "ding.wav", 0.24);
    [0, 5, 10].forEach((d) => h(s.sent(2).from - 6 + d, "pop.wav", 0.18));
    h(s.sent(2).from + 12, "glide.wav", 0.22);
  }
  // S3 — watch it build
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    [0, 1, 2, 3].forEach((i) => {
      h(s.sent(i).from - 8, "pop.wav", 0.26);
      h(s.sent(i).from + 4, `blip${i + 2}.wav`, 0.18);
    });
    h(s.cueS(3, "bell,") - 8, "ding.wav", 0.26);
  }
  // S4 — any shape
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    h(s.sent(0).from - 6, "pop.wav", 0.26);
    h(s.sent(1).from - 8, "whoosh.wav", 0.22);
    h(s.cueS(1, "tail") - 6, "glide.wav", 0.22);
    h(s.sent(2).from - 6, "whoosh.wav", 0.22);
    h(s.cueS(2, "bell") - 8, "ding.wav", 0.28);
  }
  // S5 — two rules
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    h(s.cueS(0, "true") - 8, "pop.wav", 0.26);
    h(s.sent(1).from + 2, "glide.wav", 0.22);
    h(s.cueS(1, "narrower.") - 6, "glide.wav", 0.22);
    h(s.sent(2).from - 6, "pop.wav", 0.26);
    h(s.cueS(2, "square") - 8, "click.wav", 0.22);
    h(s.sent(3).from - 6, "ding.wav", 0.26);
  }
  // S6 — why it matters
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    h(s.sent(0).from - 6, "whoosh.wav", 0.2);
    h(s.cueS(1, "polls") - 8, "pop.wav", 0.28);
    h(s.cueS(1, "margin") - 6, "click.wav", 0.2);
    h(s.cueS(1, "scientists") - 8, "pop.wav", 0.28);
    h(s.cueS(1, "real.") - 6, "ding.wav", 0.24);
  }
  // S7 — big enough
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    const T30 = s.cueS(0, "30.");
    for (let i = 0; i < 10; i++) h(s.sent(0).from + i * ((T30 - s.sent(0).from) / 10), "tick.wav", 0.1);
    h(T30 - 6, "ding.wav", 0.28);
    h(s.sent(1).from - 6, "pop.wav", 0.24);
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
    h(s.duration - 10, "whoosh.wav", 0.28);
  }
  // S9 — quiz, teaser, CTA
  {
    const s = sceneTiming(fps, "s9");
    const h = at("s9");
    const QQ = s.sent(0).from, H = s.sent(1).from, W7 = s.cueS(1, "7"), W49 = s.cueS(1, "49"), AVGW = s.cueS(2, "averages?"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    const WHY = s.sent(4).from, ROOT = s.cueS(4, "square"), GIVES = s.cueS(4, "gives"), TZ = s.sent(5).from, FUTURE = s.cueS(5, "future"), FOL = s.sent(6).from, FOLW = s.cueS(6, "Follow"), SIMPLE = s.cueS(6, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    h(H - 2, "glide.wav", 0.2);
    h(W7 - 8, "pop.wav", 0.26);
    h(W49 - 8, "pop.wav", 0.26);
    h(AVGW - 8, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(WHY - 4, "glide.wav", 0.24);
    h(ROOT - 8, "pop.wav", 0.26);
    h(GIVES - 6, "ding.wav", 0.24);
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
