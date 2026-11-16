import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S1Hook } from "./scenes/S1Hook";
import { S2Define } from "./scenes/S2Define";
import { S3Kinds } from "./scenes/S3Kinds";
import { S4Fence } from "./scenes/S4Fence";
import { S5Summary } from "./scenes/S5Summary";
import { S6Trend } from "./scenes/S6Trend";
import { S7Overview } from "./scenes/S7Overview";
import { S8Quiz } from "./scenes/S8Quiz";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<SceneId, React.FC> = { s1: S1Hook, s2: S2Define, s3: S3Kinds, s4: S4Fence, s5: S5Summary, s6: S6Trend, s7: S7Overview, s8: S8Quiz };
// backdrop tints + caption accent follow the idea being explained (orange = outliers)
const LOOK: Record<SceneId, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.orange, accent: C.orange },
  s2: { a: C.orange, b: C.violet, accent: C.orange },
  s3: { a: C.violet, b: C.cyan, accent: C.violet },
  s4: { a: C.violet, b: "#6D28D9", accent: C.violet },
  s5: { a: C.orange, b: C.cyan, accent: C.orange },
  s6: { a: C.cyan, b: C.orange, accent: C.orange },
  s7: { a: C.green, b: C.orange, accent: C.cyan },
  s8: { a: C.green, b: C.violet, accent: C.yellow },
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

export const Outliers: React.FC = () => {
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
