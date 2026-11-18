// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S10Remember } from "./scenes/S10Remember";
import { S11Quiz } from "./scenes/S11Quiz";
import { S1Hook } from "./scenes/S1Hook";
import { S2Why } from "./scenes/S2Why";
import { S3Net } from "./scenes/S3Net";
import { S4Definition } from "./scenes/S4Definition";
import { S5Poll } from "./scenes/S5Poll";
import { S6Average } from "./scenes/S6Average";
import { S7Recipe } from "./scenes/S7Recipe";
import { S8Meaning } from "./scenes/S8Meaning";
import { S9Width } from "./scenes/S9Width";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Hook, s2: S2Why, s3: S3Net, s4: S4Definition, s5: S5Poll, s6: S6Average, s7: S7Recipe, s8: S8Meaning, s9: S9Width, s10: S10Remember, s11: S11Quiz };
// backdrop tints + caption accent: cyan = the estimate, violet = the range, green = the true value, orange = a miss
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.violet, accent: C.violet },
  s2: { a: C.cyan, b: C.orange, accent: C.cyan },
  s3: { a: C.violet, b: C.green, accent: C.violet },
  s4: { a: C.violet, b: C.green, accent: C.yellow },
  s5: { a: C.cyan, b: C.violet, accent: C.cyan },
  s6: { a: C.cyan, b: C.violet, accent: C.cyan },
  s7: { a: C.violet, b: C.green, accent: C.violet },
  s8: { a: C.green, b: C.orange, accent: C.green },
  s9: { a: C.violet, b: C.orange, accent: C.violet },
  s10: { a: C.violet, b: C.cyan, accent: C.violet },
  s11: { a: C.green, b: C.violet, accent: C.yellow },
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

export const ConfidenceIntervalsV2: React.FC = () => {
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
