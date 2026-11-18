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

  // shared helpers: a soft pop before each sentence, and the standard quiz / teaser / CTA hits
  const pops = (id: SceneId, n: number, vol = 0.16) => {
    const s = sceneTiming(fps, id);
    const h = at(id);
    h(2, "whoosh.wav", 0.14);
    for (let i = 0; i < n; i++) h(s.sent(i).from - 8, "pop.wav", vol);
  };
  const quiz = (id: SceneId, key: [number, string], why: [number, string], tz: number | null, fol: number) => {
    const s = sceneTiming(fps, id);
    const h = at(id);
    const QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    h(s.sent(0).from - 4, "pop.wav", 0.4);
    h(s.sent(1).from - 2, "glide.wav", 0.2);
    // land well before the keyword: a pop near a spoken number masked it ("fifteen" heard as "fifty")
    h(s.cueS(key[0], key[1]) - 18, "pop.wav", 0.18);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(s.sent(4).from - 4, "glide.wav", 0.22);
    h(s.cueS(why[0], why[1]) - 8, "pop.wav", 0.28);
    if (tz !== null) {
      h(s.sent(tz).from - 10, "whoosh.wav", 0.3);
      h(s.sent(tz).from + 10, "sparkle.wav", 0.24);
    }
    const FOL = s.sent(fol).from, FOLW = s.cueS(fol, "Follow"), SIMPLE = s.cueS(fol, "simple!");
    h(FOL - 10, "whoosh.wav", 0.3);
    h(FOL - 4, "sparkle.wav", 0.28);
    h(FOLW - 2, "pop.wav", 0.35);
    h(FOLW + 2, "click.wav", 0.25);
    h(FOLW + 16, "button.wav", 0.5);
    h(SIMPLE - 8, "pop.wav", 0.3);
    h(SIMPLE + 4, "sparkle.wav", 0.25);
  };

  // S1 — hook
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    [0, 1, 2].forEach((i) => h(6 + i * 4, "pop.wav", 0.14));
    h(s.cueS(0, "statistics.") - 8, "ding.wav", 0.2);
    h(s.sent(1).from - 6, "whoosh.wav", 0.2);
    for (let i = 0; i < 4; i++) h(s.sent(1).from + 4 + i * 8, "blip" + ((i % 3) + 1) + ".wav", 0.12);
  }
  // S2 — title
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    for (let i = 0; i < 8; i++) h(s.cueS(0, "100") - 6 + i * 3, "tick.wav", 0.06);
    const T = s.cueS(0, "Machine");
    h(T - 12, "whoosh.wav", 0.3);
    h(T - 6, "impact.wav", 0.42);
    h(T + 12, "chime.wav", 0.22);
    [s.sent(1).from, s.cueS(1, "Explained"), s.cueS(1, "zero")].forEach((f, i) => h(f - 10, `blip${i + 1}.wav`, 0.2));
  }
  // S3 / S4 — the roadmap: a step tone per row
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    h(2, "whip.wav", 0.14);
    [s.cueS(1, "foundations:"), s.sent(2).from, s.cueS(3, "Regression"), s.cueS(3, "classification,"), s.sent(4).from].forEach((f, k) => h(f - 10, `step${(k % 3) + 1}.wav`, 0.2));
  }
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    h(2, "whip.wav", 0.14);
    [s.cueS(0, "power"), s.sent(1).from, s.sent(2).from, s.cueS(3, "deep"), s.sent(3).to - 4].forEach((f, k) => h(f - 10, `step${(k % 3) + 1}.wav`, 0.2));
  }
  // S5 — projects
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    h(s.sent(0).from - 2, "sparkle.wav", 0.2);
    [s.cueS(1, "house"), s.cueS(1, "customer"), s.cueS(1, "spam"), s.cueS(1, "image")].forEach((f) => h(f - 10, "pop.wav", 0.2));
  }
  // S6 — who it's for
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    h(s.cueS(0, "PhD") - 10, "pop.wav", 0.2);
    h(s.cueS(0, "few") - 10, "tick.wav", 0.12);
    [s.cueS(1, "beginners,"), s.cueS(1, "students,"), s.cueS(1, "interview")].forEach((f, i) => h(f - 10, `blip${i + 1}.wav`, 0.2));
  }
  // S7 — coming soon + CTA
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    h(s.sent(0).from - 6, "pop.wav", 0.2);
    h(s.cueS(1, "notifications,") - 6, "ding.wav", 0.22);
    for (let i = 0; i < 3; i++) h(s.cueS(1, "notifications,") + 2 + i * 6, "tick.wav", 0.08);
    const FOL = s.sent(2).from, FOLW = s.cueS(2, "Follow"), SIMPLE = s.cueS(2, "simple!");
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
