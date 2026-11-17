import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S10Quiz } from "./scenes/S10Quiz";
import { S1Hook } from "./scenes/S1Hook";
import { S2Definition } from "./scenes/S2Definition";
import { S9Remember } from "./scenes/S9Remember";
import { S3Uniform, S4Binomial, S5Poisson, S6Exponential, S7Normal, S8Bimodal } from "./scenes/Questions";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Hook, s2: S2Definition, s3: S3Uniform, s4: S4Binomial, s5: S5Poisson, s6: S6Exponential, s7: S7Normal, s8: S8Bimodal, s9: S9Remember, s10: S10Quiz };
// backdrop tints + caption accent follow each scene's distribution colour
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.violet, accent: C.cyan },
  s2: { a: C.cyan, b: C.violet, accent: C.cyan },
  s3: { a: C.cyan, b: C.violet, accent: C.cyan },
  s4: { a: C.violet, b: C.cyan, accent: C.violet },
  s5: { a: C.green, b: C.cyan, accent: C.green },
  s6: { a: C.orange, b: C.violet, accent: C.orange },
  s7: { a: C.violet, b: C.cyan, accent: C.violet },
  s8: { a: C.green, b: C.orange, accent: C.green },
  s9: { a: C.cyan, b: C.green, accent: C.green },
  s10: { a: C.green, b: C.violet, accent: C.yellow },
};

const useLook = () => {
  const { fps } = useVideoConfig();
  const starts = SCENE_IDS.map((id) => sceneRange(fps, id).from);
  const input = [0, ...starts.slice(1).flatMap((t) => [t - 8, t + 12])];
  const pick = (k: "a" | "b" | "accent") => ({
    input,
    out: [LOOK.s1[k], ...SCENE_IDS.slice(1).flatMap((id, i) => [LOOK[SCENE_IDS[i]][k], LOOK[id][k]])],
  });
  return { a: pick("a"), b: pick("b"), accent: pick("accent") };
};

export const WhichDistribution: React.FC = () => {
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
      {SCENE_IDS.map((id) => {
        const s = sceneRange(fps, id);
        const Comp = SCENES[id];
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
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
