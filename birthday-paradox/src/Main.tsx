import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S1Title } from "./scenes/S1Title";
import { S2Hook } from "./scenes/S2Hook";
import { S3Answer } from "./scenes/S3Answer";
import { S4Pairs } from "./scenes/S4Pairs";
import { S5Maths } from "./scenes/S5Maths";
import { S6Result } from "./scenes/S6Result";
import { S7Curve } from "./scenes/S7Curve";
import { S8Sim } from "./scenes/S8Sim";
import { S9Real } from "./scenes/S9Real";
import { S10Rule } from "./scenes/S10Rule";
import { S11Poll } from "./scenes/S11Poll";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Title, s2: S2Hook, s3: S3Answer, s4: S4Pairs, s5: S5Maths, s6: S6Result, s7: S7Curve, s8: S8Sim, s9: S9Real, s10: S10Rule, s11: S11Poll };
// backdrop tints + caption accent: the election-poll example stays cyan, the "similarly" tour mixes the use colours
const O = "#FF8A00";
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: O, b: C.violet, accent: O },
  s2: { a: C.green, b: O, accent: O },
  s3: { a: O, b: C.red, accent: O },
  s4: { a: C.yellow, b: O, accent: O },
  s5: { a: C.cyan, b: C.violet, accent: C.cyan },
  s6: { a: C.cyan, b: O, accent: C.cyan },
  s7: { a: O, b: C.violet, accent: O },
  s8: { a: O, b: C.green, accent: O },
  s9: { a: C.red, b: O, accent: C.red },
  s10: { a: C.green, b: O, accent: C.yellow },
  s11: { a: O, b: C.violet, accent: C.yellow },
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

export const BirthdayParadox: React.FC = () => {
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
