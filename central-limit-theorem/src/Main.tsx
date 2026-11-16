// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S1Hook } from "./scenes/S1Hook";
import { S2What } from "./scenes/S2What";
import { S3Build } from "./scenes/S3Build";
import { S4AnyShape } from "./scenes/S4AnyShape";
import { S5Rules } from "./scenes/S5Rules";
import { S6Why } from "./scenes/S6Why";
import { S7Enough } from "./scenes/S7Enough";
import { S8Recap } from "./scenes/S8Recap";
import { S9Quiz } from "./scenes/S9Quiz";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Hook, s2: S2What, s3: S3Build, s4: S4AnyShape, s5: S5Rules, s6: S6Why, s7: S7Enough, s8: S8Recap, s9: S9Quiz };
// backdrop tints + caption accent: cyan = raw dice data, green = sample means / the bell, violet = spread, orange = skewed data
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.green, accent: C.green },
  s2: { a: C.green, b: C.cyan, accent: C.green },
  s3: { a: C.cyan, b: C.green, accent: C.cyan },
  s4: { a: C.orange, b: C.green, accent: C.orange },
  s5: { a: C.green, b: C.violet, accent: C.violet },
  s6: { a: C.green, b: C.cyan, accent: C.green },
  s7: { a: C.orange, b: C.green, accent: C.green },
  s8: { a: C.green, b: C.violet, accent: C.green },
  s9: { a: C.green, b: C.violet, accent: C.yellow },
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

export const CentralLimitTheorem: React.FC = () => {
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
