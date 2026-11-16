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

  // S1 — hook: three piles become the same bell
  {
    const s = sceneTiming(fps, "s1");
    const h = at("s1");
    [0, 1, 2].forEach((i) => {
      const f = s.sent(i).from;
      h(f - 6, "whoosh.wav", 0.14);
      for (let k = 0; k < 8; k++) h(f + 4 + k * 4, "tick.wav", 0.09);
    });
    const SAME = s.sent(3).from, BELL = s.sent(4).from;
    h(SAME + 8, "glide.wav", 0.26);
    h(BELL - 10, "whoosh.wav", 0.3);
    h(BELL - 6, "impact.wav", 0.42);
    h(BELL + 14, "chime.wav", 0.24);
  }
  // S2 — its name
  {
    const s = sceneTiming(fps, "s2");
    const h = at("s2");
    const NORMAL = s.cueS(0, "normal"), BELLW = s.cueS(0, "bell"), FAMOUS = s.cueS(1, "famous");
    h(NORMAL - 10, "sparkle.wav", 0.3);
    h(NORMAL - 6, "pop.wav", 0.32);
    h(BELLW - 8, "pop.wav", 0.26);
    h(FAMOUS - 10, "ding.wav", 0.26);
  }
  // S3 — the shape
  {
    const s = sceneTiming(fps, "s3");
    const h = at("s3");
    const SYM = s.cueS(0, "symmetric,"), PEAK = s.cueS(0, "peak"), TAILS = s.cueS(2, "tails");
    h(SYM - 8, "glide.wav", 0.24);
    h(SYM + 10, "flip.wav", 0.24);
    h(PEAK - 6, "pop.wav", 0.24);
    ["mean,", "median", "mode"].forEach((w, i) => h(s.cueS(1, w) - 8, `blip${i * 2 + 1}.wav`, 0.24));
    h(s.cueS(1, "centre.") - 6, "click.wav", 0.22);
    h(TAILS - 10, "whoosh.wav", 0.24);
    h(TAILS + 6, "pop.wav", 0.22);
  }
  // S4 — two numbers
  {
    const s = sceneTiming(fps, "s4");
    const h = at("s4");
    const TWO = s.cueS(0, "two"), MEANW = s.cueS(1, "mean"), SDW = s.cueS(2, "standard"), SMALL = s.cueS(3, "Small,"), BIGW = s.cueS(3, "Big,");
    h(4, "whoosh.wav", 0.16);
    h(TWO - 8, "pop.wav", 0.3);
    h(TWO - 2, "pop.wav", 0.26);
    h(MEANW + 4, "glide.wav", 0.24);
    h(MEANW + 24, "glide.wav", 0.2);
    h(SDW + 10, "glide.wav", 0.22);
    h(SMALL - 8, "whoosh.wav", 0.24);
    h(BIGW - 8, "whoosh.wav", 0.24);
  }
  // S5 — the 68-95-99.7 rule
  {
    const s = sceneTiming(fps, "s5");
    const h = at("s5");
    h(s.sent(0).from - 8, "sparkle.wav", 0.28);
    [s.cueS(1, "68"), s.cueS(2, "95"), s.cueS(3, "997")].forEach((f, i) => {
      h(f - 10, `step${i + 1}.wav`, 0.26);
      h(f + 12, "pop.wav", 0.2);
    });
    h(s.duration - 14, "chime.wav", 0.24);
  }
  // S6 — heights
  {
    const s = sceneTiming(fps, "s6");
    const h = at("s6");
    h(s.cueS(0, "165") - 8, "pop.wav", 0.3);
    h(s.cueS(0, "7") - 8, "pop.wav", 0.28);
    h(s.cueS(1, "68") - 10, "glide.wav", 0.24);
    h(s.cueS(1, "158") - 8, "click.wav", 0.22);
    h(s.cueS(1, "172") - 8, "click.wav", 0.22);
    h(s.cueS(2, "95") - 10, "glide.wav", 0.24);
    h(s.cueS(2, "151") - 8, "click.wav", 0.22);
    h(s.cueS(2, "179") - 8, "click.wav", 0.22);
  }
  // S7 — rare beyond 3 SD, uses
  {
    const s = sceneTiming(fps, "s7");
    const h = at("s7");
    const BEYOND = s.cueS(0, "beyond"), RAREW = s.cueS(0, "rare"), W3 = s.cueS(0, "3"), W1000 = s.cueS(0, "1000"), FLAG = s.cueS(1, "flag"), QUAL = s.cueS(1, "quality");
    h(BEYOND - 10, "whoosh.wav", 0.26);
    h(RAREW + 10, "glitch.wav", 0.2);
    for (let k = 0; k < 6; k++) h(W3 - 8 + k * 3, "tick.wav", 0.08);
    h(W1000 + 12, "ding.wav", 0.26);
    h(FLAG - 10, "pop.wav", 0.3);
    h(QUAL - 10, "pop.wav", 0.3);
  }
  // S8 — complete picture
  {
    const s = sceneTiming(fps, "s8");
    const h = at("s8");
    h(s.sent(0).from - 2, "sparkle.wav", 0.25);
    [s.cueS(1, "symmetric"), s.cueS(2, "standard"), s.cueS(3, "68")].forEach((f, k) => {
      h(f - 10, `blip${k * 2 + 1}.wav`, 0.26);
      h(f + 12, "click.wav", 0.18);
    });
    h(s.duration - 10, "whoosh.wav", 0.28);
  }
  // S9 — quiz, teaser, CTA
  {
    const s = sceneTiming(fps, "s9");
    const h = at("s9");
    const QQ = s.sent(0).from, EXAM = s.sent(1).from, W70 = s.cueS(1, "70"), W10 = s.cueS(1, "10"), BETW = s.cueS(2, "between"), QEND = s.sent(2).to, CD0 = QEND + Math.round(0.2 * fps), ANS = s.sent(3).from;
    const W50 = s.cueS(4, "50"), W20 = s.cueS(4, "20"), TWO = s.cueS(4, "two"), TZ = s.sent(5).from, FUTURE = s.cueS(5, "future");
    const FOL = s.sent(6).from, FOLW = s.cueS(6, "Follow"), SIMPLE = s.cueS(6, "simple!");
    h(QQ - 4, "pop.wav", 0.4);
    h(EXAM - 2, "glide.wav", 0.2);
    h(W70 - 8, "pop.wav", 0.26);
    h(W10 - 8, "pop.wav", 0.26);
    h(BETW - 6, "pop.wav", 0.3);
    [0, 1, 2, 3].forEach((i) => h(QEND - 6 + i * 4, "pop.wav", 0.22));
    [0, 1, 2, 3, 4].forEach((k) => h(CD0 + k * fps + 2, "beep.wav", 0.42));
    h(CD0 + 5 * fps + 2, "beep-hi.wav", 0.45);
    h(ANS - 3, "tada.wav", 0.5);
    h(ANS, "confetti.wav", 0.35);
    h(ANS + 2, "ding.wav", 0.3);
    [0, 2, 3].forEach((i) => h(ANS + 8 + i * 4, "stamp.wav", 0.18));
    h(W50 - 8, "glide.wav", 0.24);
    h(W20 - 8, "click.wav", 0.22);
    h(TWO - 8, "pop.wav", 0.3);
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
