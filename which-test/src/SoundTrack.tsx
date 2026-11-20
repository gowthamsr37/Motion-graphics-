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

  // S1 — hook: a pop per test tile, a whoosh on "Which one?", a stamp on "wrong", a chime on "Save"
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    h(s.sent(0).from - 10, "whoosh.wav", 0.24);
    [s.cueS(0, "z-test,"), s.cueS(0, "t-test,"), s.cueS(0, "chi-square,"), s.cueS(0, "ANOVA.")].forEach((f, i) => h(f - 10, `blip${i + 1}.wav`, 0.2));
    h(s.cueS(0, "Which") - 12, "impact.wav", 0.32);
    h(s.cueS(1, "wrong") - 6, "stamp.wav", 0.3);
    h(s.cueS(1, "wrong") - 4, "glitch.wav", 0.08);
    h(s.cueS(1, "exactly") - 10, "pop.wav", 0.2);
    h(s.cueS(1, "Save") - 10, "chime.wav", 0.24);
  }
  // S2 — two questions
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    h(s.cueS(1, "One:") - 10, "step1.wav", 0.22);
    h(s.cueS(1, "Numbers") - 10, "pop.wav", 0.2);
    h(s.cueS(1, "categories") - 10, "pop.wav", 0.2);
    h(s.sent(2).from - 10, "step2.wav", 0.22);
    [0, 6, 12].forEach((d, i) => h(s.cueS(2, "groups") - 6 + d, `blip${i + 1}.wav`, 0.16));
  }
  // S3–S9 — the seven cards: a whip, a pop on the name, a blip on "use it when", a pop on the example, ticks as H0 and
  // the code land
  (["s3", "s4", "s5", "s6", "s7", "s8", "s9"] as SceneId[]).forEach((id, i) => {
    const s = sceneTiming(fps, id);
    const h = at(id);
    const E = s.sent(2).from;
    h(0, "whip.wav", 0.12);
    h(s.sent(0).from - 6, "pop.wav", 0.2);
    h(s.sent(1).from - 8, `blip${(i % 3) + 1}.wav`, 0.16);
    h(E - 8, "pop.wav", 0.14);
    h(E + 12, "tick.wav", 0.08);
    h(E + 24, "click.wav", 0.12);
  });
  // S10 — bonus swaps
  {
    const s = sceneTiming(fps, "s10");
    const h = at("s10");
    h(s.sent(0).from - 2, "sparkle.wav", 0.2);
    [s.cueS(1, "Mann-Whitney"), s.cueS(1, "Wilcoxon"), s.cueS(1, "Kruskal-Wallis")].forEach((f, k) => h(f - 10, `step${k + 1}.wav`, 0.22));
  }
  // S11 — the cheat sheet
  {
    const s = sceneTiming(fps, "s11");
    const h = at("s11");
    h(s.sent(0).from - 4, "sparkle.wav", 0.2);
    [s.cueS(1, "One"), s.cueS(1, "Two"), s.cueS(1, "Three"), s.cueS(1, "Counts?")].forEach((f, k) => h(f - 10, `blip${k + 1}.wav`, 0.18));
    h(s.cueS(2, "Save") - 8, "pop.wav", 0.22);
    h(s.cueS(2, "send") - 8, "whoosh.wav", 0.16);
  }
  // S12 — quiz, teaser, CTA
  {
    const s = sceneTiming(fps, "s12");
    const h = at("s12");
    h(s.sent(1).from - 4, "pop.wav", 0.18);
  }
  quiz("s12", [2, "improved?"], [4, "twice,"], 5, 6);
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
