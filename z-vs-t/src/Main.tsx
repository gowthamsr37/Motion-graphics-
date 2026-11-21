// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S10CI } from "./scenes/S10CI";
import { S11Table } from "./scenes/S11Table";
import { S12Poll } from "./scenes/S12Poll";
import { S1Hook } from "./scenes/S1Hook";
import { S2Definitions } from "./scenes/S2Definitions";
import { S3Formula } from "./scenes/S3Formula";
import { S4Tails } from "./scenes/S4Tails";
import { S5Ladder } from "./scenes/S5Ladder";
import { S6Puzzle } from "./scenes/S6Puzzle";
import { S7Which } from "./scenes/S7Which";
import { S8Trap } from "./scenes/S8Trap";
import { S9Props } from "./scenes/S9Props";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Hook, s2: S2Definitions, s3: S3Formula, s4: S4Tails, s5: S5Ladder, s6: S6Puzzle, s7: S7Which, s8: S8Trap, s9: S9Props, s10: S10CI, s11: S11Table, s12: S12Poll };
// backdrop tints + caption accent: cyan = z, violet = t, orange = cut-offs / traps, green = the save moment
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.violet, accent: C.violet },
  s2: { a: C.cyan, b: C.violet, accent: C.cyan },
  s3: { a: C.violet, b: C.orange, accent: C.violet },
  s4: { a: C.violet, b: C.cyan, accent: C.violet },
  s5: { a: C.orange, b: C.violet, accent: C.orange },
  s6: { a: C.violet, b: C.orange, accent: C.violet },
  s7: { a: C.cyan, b: C.violet, accent: C.cyan },
  s8: { a: C.orange, b: C.violet, accent: C.orange },
  s9: { a: C.cyan, b: C.orange, accent: C.cyan },
  s10: { a: C.violet, b: C.cyan, accent: C.violet },
  s11: { a: C.green, b: C.violet, accent: C.green },
  s12: { a: C.green, b: C.violet, accent: C.yellow },
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

export const ZvsT: React.FC = () => {
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
