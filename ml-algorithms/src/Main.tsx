// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// 100 Days of ML, every ML algorithm (standalone reel), in the statistics house style: navy backdrop whose two glows follow each scene's colours,
// scenes cut with the house fade, word-synced house captions, grade, grain, vignette, and the house mix.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S1, S2, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, S15, S16 } from "./scenes/Scenes";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: A1, s4: A2, s5: A3, s6: A4, s7: A5, s8: A6, s9: A7, s10: A8, s11: A9, s12: A10, s13: A11, s14: A12, s15: S15, s16: S16 };
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.violet, accent: C.cyan },
  s2: { a: C.violet, b: C.orange, accent: C.violet },
  s3: { a: C.green, b: C.cyan, accent: C.green },
  s4: { a: C.cyan, b: C.violet, accent: C.cyan },
  s5: { a: C.violet, b: C.cyan, accent: C.violet },
  s6: { a: C.cyan, b: C.green, accent: C.cyan },
  s7: { a: C.green, b: C.cyan, accent: C.green },
  s8: { a: C.cyan, b: C.violet, accent: C.cyan },
  s9: { a: C.violet, b: C.cyan, accent: C.violet },
  s10: { a: C.cyan, b: C.green, accent: C.cyan },
  s11: { a: C.orange, b: C.yellow, accent: C.orange },
  s12: { a: C.orange, b: C.violet, accent: C.orange },
  s13: { a: C.green, b: C.cyan, accent: C.green },
  s14: { a: C.violet, b: C.red, accent: C.violet },
  s15: { a: C.cyan, b: C.green, accent: C.yellow },
  s16: { a: C.green, b: C.violet, accent: C.yellow },
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

export const MLAlgos: React.FC = () => {
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
