// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S10Decision } from "./scenes/S10Decision";
import { S11Traps } from "./scenes/S11Traps";
import { S12Remember } from "./scenes/S12Remember";
import { S13Poll } from "./scenes/S13Poll";
import { S1Hook } from "./scenes/S1Hook";
import { S2Definition } from "./scenes/S2Definition";
import { S3When } from "./scenes/S3When";
import { S4Setup } from "./scenes/S4Setup";
import { S5Formula } from "./scenes/S5Formula";
import { S6Calc } from "./scenes/S6Calc";
import { S7Picture } from "./scenes/S7Picture";
import { S8Table } from "./scenes/S8Table";
import { S9Critical } from "./scenes/S9Critical";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Hook, s2: S2Definition, s3: S3When, s4: S4Setup, s5: S5Formula, s6: S6Calc, s7: S7Picture, s8: S8Table, s9: S9Critical, s10: S10Decision, s11: S11Traps, s12: S12Remember, s13: S13Poll };
// backdrop tints + caption accent: cyan = the claim, violet = the sample mean, green = standard error, orange = the tail
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.orange, b: C.violet, accent: C.violet },
  s2: { a: C.violet, b: C.cyan, accent: C.violet },
  s3: { a: C.green, b: C.cyan, accent: C.green },
  s4: { a: C.cyan, b: C.orange, accent: C.cyan },
  s5: { a: C.violet, b: C.green, accent: C.violet },
  s6: { a: C.green, b: C.violet, accent: C.green },
  s7: { a: C.cyan, b: C.orange, accent: C.orange },
  s8: { a: C.orange, b: C.cyan, accent: C.orange },
  s9: { a: C.orange, b: C.green, accent: C.orange },
  s10: { a: C.orange, b: C.green, accent: C.orange },
  s11: { a: C.orange, b: C.cyan, accent: C.cyan },
  s12: { a: C.cyan, b: C.green, accent: C.cyan },
  s13: { a: C.green, b: C.violet, accent: C.yellow },
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

export const ZTest: React.FC = () => {
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
