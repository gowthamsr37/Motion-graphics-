// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { S10Sheet } from "./scenes/S10Sheet";
import { S11Poll } from "./scenes/S11Poll";
import { S1Title } from "./scenes/S1Title";
import { S2Recap } from "./scenes/S2Recap";
import { S3Polls } from "./scenes/S3Polls";
import { S4AB } from "./scenes/S4AB";
import { S5Factory } from "./scenes/S5Factory";
import { S6Insurance } from "./scenes/S6Insurance";
import { S7ML } from "./scenes/S7ML";
import { S8Thread } from "./scenes/S8Thread";
import { S9Traps } from "./scenes/S9Traps";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Title, s2: S2Recap, s3: S3Polls, s4: S4AB, s5: S5Factory, s6: S6Insurance, s7: S7ML, s8: S8Thread, s9: S9Traps, s10: S10Sheet, s11: S11Poll };
// backdrop tints + caption accent follow each use's colour: polls cyan, A/B orange, factories green, insurance violet,
// ML pink (the ML-series accent, mapped onto violet/cyan for the backdrop)
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.orange, accent: C.violet },
  s2: { a: C.violet, b: C.orange, accent: C.violet },
  s3: { a: C.cyan, b: C.violet, accent: C.cyan },
  s4: { a: C.orange, b: C.green, accent: C.orange },
  s5: { a: C.green, b: C.cyan, accent: C.green },
  s6: { a: C.violet, b: C.cyan, accent: C.violet },
  s7: { a: C.violet, b: C.orange, accent: "#F0ABFC" },
  s8: { a: C.violet, b: C.cyan, accent: C.violet },
  s9: { a: C.orange, b: C.cyan, accent: C.orange },
  s10: { a: C.green, b: C.violet, accent: C.green },
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
