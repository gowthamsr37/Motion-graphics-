import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S10Rule } from "./scenes/S10Rule";
import { S11Poll } from "./scenes/S11Poll";
import { S1Title } from "./scenes/S1Title";
import { S2Hook } from "./scenes/S2Hook";
import { S3Edge } from "./scenes/S3Edge";
import { S4Many } from "./scenes/S4Many";
import { S5Coin } from "./scenes/S5Coin";
import { S6Law } from "./scenes/S6Law";
import { S7Profit } from "./scenes/S7Profit";
import { S8Uses } from "./scenes/S8Uses";
import { S9Fallacy } from "./scenes/S9Fallacy";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Title, s2: S2Hook, s3: S3Edge, s4: S4Many, s5: S5Coin, s6: S6Law, s7: S7Profit, s8: S8Uses, s9: S9Fallacy, s10: S10Rule, s11: S11Poll };
// backdrop tints + caption accent: the election-poll example stays cyan, the "similarly" tour mixes the use colours
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.green, b: C.violet, accent: C.green },
  s2: { a: C.yellow, b: C.green, accent: C.yellow },
  s3: { a: C.green, b: C.red, accent: C.green },
  s4: { a: C.yellow, b: C.green, accent: C.yellow },
  s5: { a: C.cyan, b: C.green, accent: C.cyan },
  s6: { a: C.cyan, b: C.violet, accent: C.cyan },
  s7: { a: C.green, b: C.cyan, accent: C.green },
  s8: { a: C.cyan, b: C.orange, accent: C.yellow },
  s9: { a: C.red, b: C.violet, accent: C.red },
  s10: { a: C.green, b: C.red, accent: C.yellow },
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

export const LawOfLargeNumbers: React.FC = () => {
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
