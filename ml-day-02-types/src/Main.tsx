// 100 Days of ML, Day 2 (the 3 types), in the statistics house style: navy backdrop whose two glows follow each scene's colours,
// scenes cut with the house fade, word-synced house captions, grade, grain, vignette, and the house mix.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S10Answers } from "./scenes/S10Answers";
import { S11Poll } from "./scenes/S11Poll";
import { S1Title } from "./scenes/S1Title";
import { S2Hook } from "./scenes/S2Hook";
import { S3Supervised } from "./scenes/S3Supervised";
import { S4Flavours } from "./scenes/S4Flavours";
import { S5Catch } from "./scenes/S5Catch";
import { S6Unsup } from "./scenes/S6Unsup";
import { S7Uses } from "./scenes/S7Uses";
import { S8Reinforce } from "./scenes/S8Reinforce";
import { S9Cheat } from "./scenes/S9Cheat";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Title, s2: S2Hook, s3: S3Supervised, s4: S4Flavours, s5: S5Catch, s6: S6Unsup, s7: S7Uses, s8: S8Reinforce, s9: S9Cheat, s10: S10Answers, s11: S11Poll };
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.violet, accent: C.cyan },
  s2: { a: C.cyan, b: C.orange, accent: C.orange },
  s3: { a: C.orange, b: C.violet, accent: C.orange },
  s4: { a: C.green, b: C.cyan, accent: C.green },
  s5: { a: C.violet, b: C.cyan, accent: C.violet },
  s6: { a: C.cyan, b: C.orange, accent: C.cyan },
  s7: { a: C.violet, b: C.green, accent: C.violet },
  s8: { a: C.cyan, b: C.violet, accent: C.cyan },
  s9: { a: C.orange, b: C.violet, accent: C.orange },
  s10: { a: C.green, b: C.violet, accent: C.green },
  s11: { a: C.green, b: C.violet, accent: C.yellow },
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

export const MLDay02: React.FC = () => {
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
