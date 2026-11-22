// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S10Poll } from "./scenes/S10Poll";
import { S1Title } from "./scenes/S1Title";
import { S2Problem } from "./scenes/S2Problem";
import { S3Average } from "./scenes/S3Average";
import { S4Repeat } from "./scenes/S4Repeat";
import { S5Width } from "./scenes/S5Width";
import { S6Margin } from "./scenes/S6Margin";
import { S7Bigger } from "./scenes/S7Bigger";
import { S8Similar } from "./scenes/S8Similar";
import { S9Rule } from "./scenes/S9Rule";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Title, s2: S2Problem, s3: S3Average, s4: S4Repeat, s5: S5Width, s6: S6Margin, s7: S7Bigger, s8: S8Similar, s9: S9Rule, s10: S10Poll };
// backdrop tints + caption accent: the election-poll example stays cyan, the "similarly" tour mixes the use colours
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.orange, accent: C.cyan },
  s2: { a: C.cyan, b: C.violet, accent: C.cyan },
  s3: { a: C.cyan, b: C.violet, accent: C.cyan },
  s4: { a: C.cyan, b: C.orange, accent: C.yellow },
  s5: { a: C.violet, b: C.cyan, accent: C.yellow },
  s6: { a: C.green, b: C.cyan, accent: C.green },
  s7: { a: C.green, b: C.violet, accent: C.green },
  s8: { a: C.orange, b: C.violet, accent: C.orange },
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

export const CltUses: React.FC = () => {
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
