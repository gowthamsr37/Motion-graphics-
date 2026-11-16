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

  // S1 — hook: a crowd, a few light up, they gather into a sample
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    const CRORES = s.cueS(0, "crores"), FEW = s.cueS(0, "few"), NOT = s.sent(1).from, SAMPLE = s.cueS(2, "sample.");
    h(2, "whoosh.wav", 0.18);
    h(CRORES - 10, "riser.wav", 0.14);
    for (let i = 0; i < 6; i++) h(FEW - 6 + i * 3, `blip${Math.min(5, i + 1)}.wav`, 0.16);
    h(NOT - 6, "glide.wav", 0.2);
    h(SAMPLE - 12, "whoosh.wav", 0.3);
    h(SAMPLE - 6, "impact.wav", 0.42);
    h(SAMPLE + 12, "chime.wav", 0.22);
  }
  // S2 — population vs sample
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const POPW = s.cueS(0, "population"), SAMPW = s.cueS(1, "sample"), SOUP = s.sent(2).from;
    h(POPW - 8, "pop.wav", 0.28);
    for (let i = 0; i < 5; i++) h(POPW - 4 + i * 4, "tick.wav", 0.1);
    h(SAMPW - 6, "glide.wav", 0.24);
    h(SAMPW + 18, "pop.wav", 0.22);
    h(SOUP - 6, "whoosh.wav", 0.22);
    h(SOUP + 4, "pop.wav", 0.24);
    h(SOUP + 14, "clink.wav", 0.22);
  }
  // S3 — why sample
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    h(s.sent(0).from - 6, "pop.wav", 0.26);
    [s.cueS(1, "slow,"), s.cueS(1, "costly,"), s.cueS(1, "impossible.")].forEach((f, i) => h(f - 10, `step${i + 1}.wav`, 0.24));
    for (let i = 0; i < 8; i++) h(s.sent(2).from - 4 + i * 3, "click.wav", 0.12);
    const BURN = s.cueS(2, "burn");
    for (let i = 0; i < 8; i++) h(BURN + 2 + i * 6, "glitch.wav", 0.08);
    h(BURN + 48, "stamp.wav", 0.24);
  }
  // S4 — parameter vs statistic
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    h(4, "whoosh.wav", 0.16);
    h(s.cueS(0, "true") - 8, "pop.wav", 0.28);
    h(s.cueS(0, "parameter.") - 8, "ding.wav", 0.22);
    h(s.cueS(1, "sample") - 10, "pop.wav", 0.28);
    h(s.cueS(1, "statistic,") - 8, "ding.wav", 0.22);
    h(s.cueS(1, "guess") - 8, "glide.wav", 0.22);
  }
  // S5 — samples wobble
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    const A = s.cueS(0, "another"), B = s.sent(2).from, LESS = s.cueS(2, "less,");
    for (let k = 0; k < 6; k++) h(A - 8 + k * 14, "hop.wav", 0.2);
    h(s.sent(1).from + 2, "glide.wav", 0.2);
    for (let k = 0; k < 6; k++) h(B - 4 + k * 7, "tick.wav", 0.16);
    h(LESS - 6, "ding.wav", 0.24);
  }
  // S6 — bias
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    h(s.cueS(0, "random.") - 8, "pop.wav", 0.28);
    h(s.cueS(0, "random.") + 8, "sparkle.wav", 0.2);
    h(s.cueS(1, "gym") - 10, "pop.wav", 0.28);
    h(s.cueS(1, "off.") - 8, "glitch.wav", 0.22);
    h(s.cueS(2, "bias.") - 8, "stamp.wav", 0.4);
  }
  // S7 — n − 1
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    for (let i = 0; i < 10; i++) h(8 + i * 3, "tick.wav", 0.1);
    h(s.cueS(1, "divide") - 8, "pop.wav", 0.26);
    h(s.cueS(1, "1,") - 8, "pop.wav", 0.26);
    h(s.cueS(1, "not") + 2, "stamp.wav", 0.2);
    h(s.sent(2).from - 2, "glide.wav", 0.22);
    h(s.cueS(2, "spread.") - 6, "ding.wav", 0.24);
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
    const QQ = s.sent(0).from, COLLEGE = s.cueS(1, "college,"), BBALL = s.cueS(1, "basketball"), PROB = s.cueS(2, "problem?"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    const HIGH = s.cueS(4, "high."), TZ = s.sent(5).from, SHAPE = s.cueS(5, "shape"), FOL = s.sent(6).from, FOLW = s.cueS(6, "Follow"), SIMPLE = s.cueS(6, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    for (let i = 0; i < 4; i++) h(COLLEGE - 10 + i * 4, "tick.wav", 0.12);
    h(BBALL - 8, "pop.wav", 0.28);
    h(PROB - 8, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(HIGH - 8, "pop.wav", 0.28);
    h(TZ - 10, "whoosh.wav", 0.3);
    for (let i = 0; i < 5; i++) h(TZ + 4 + i * 4, `blip${i + 1}.wav`, 0.16);
    h(SHAPE - 8, "sparkle.wav", 0.26);
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
