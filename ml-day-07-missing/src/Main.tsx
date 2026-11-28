// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// 100 Days of ML, Day 3 (missing values, the complete guide), in the statistics house style: navy backdrop whose two glows follow each scene's colours,
// scenes cut with the house fade, word-synced house captions, grade, grain, vignette, and the house mix.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S1Hook, S2Reveal, S3Measure, S4Types } from "./scenes/Intro";
import { S5Rows, S6Col, S7Median, S8Group, S9Predict, S10Flag, S11Rule } from "./scenes/Fixes";
import { S12Guide } from "./scenes/S11List";
import { S13Poll } from "./scenes/S12Poll";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Hook, s2: S2Reveal, s3: S3Measure, s4: S4Types, s5: S5Rows, s6: S6Col, s7: S7Median, s8: S8Group, s9: S9Predict, s10: S10Flag, s11: S11Rule, s12: S12Guide, s13: S13Poll };
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.red, b: C.yellow, accent: C.red },
  s2: { a: C.violet, b: C.cyan, accent: C.violet },
  s3: { a: C.cyan, b: C.violet, accent: C.cyan },
  s4: { a: C.yellow, b: C.red, accent: C.yellow },
  s5: { a: C.red, b: C.green, accent: C.red },
  s6: { a: C.orange, b: C.green, accent: C.orange },
  s7: { a: C.cyan, b: C.green, accent: C.cyan },
  s8: { a: C.green, b: C.cyan, accent: C.green },
  s9: { a: C.violet, b: C.green, accent: C.violet },
  s10: { a: C.yellow, b: C.green, accent: C.yellow },
  s11: { a: C.red, b: C.green, accent: C.red },
  s12: { a: C.cyan, b: C.green, accent: C.yellow },
  s13: { a: C.green, b: C.violet, accent: C.yellow },
};

const useLook = () => {
  const { fps } = useVideoConfig();
  const starts = SCENE_IDS.map((id) => sceneRange(fps, id).from);
  const input = [0, ...starts.slice(1).flatMap((t) => [t - 8, t + 12])];
  const pick = (k: "a" | "b" | "accent") => ({ input, out: [LOOK.s1[k], ...SCENE_IDS.slice(1).flatMap((id, i) => [LOOK[SCENE_IDS[i]][k], LOOK[id][k]])] });
  return { a: pick("a"), b: pick("b"), accent: pick("accent") };
};

// a scene enters with a short rise + fade and leaves with a quick fade (house cut)
const SceneShell: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const inP = ease(frame, [0, 10], [0, 1]);
  const outP = ease(frame, [dur - 8, dur], [0, 1], theme.ease.in);
  return <AbsoluteFill style={{ opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 30}px)` }}>{children}</AbsoluteFill>;
};

export const MLDay07: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const look = useLook();
  const col = (k: { input: number[]; out: string[] }, f: number) => (k.input.length > 1 ? interpolateColors(f, k.input, k.out) : k.out[0]);
  const total = totalFrames(fps);
  const fadeIn = ease(frame, [0, 5], [1, 0]);
  const fadeOut = ease(frame, [total - 14, total - 1], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: theme.fonts.body }}>
      <Backdrop a={col(look.a, frame)} b={col(look.b, frame)} />
      {SCENE_IDS.map((id, i) => {
        const s = sceneRange(fps, id);
        const Comp = SCENES[id];
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            {i === 0 ? <Comp /> : <SceneShell dur={s.duration}>{Comp ? <Comp /> : null}</SceneShell>}
          </Sequence>
        );
      })}
      <Grade />
      <Captions accent={(f) => col(look.accent, f)} />
      <Grain />
      <Vignette />
      <AbsoluteFill style={{ background: C.bgDeep, opacity: Math.max(fadeIn, fadeOut), pointerEvents: "none" }} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
