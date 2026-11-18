// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
import React from "react";
import { AbsoluteFill, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { ease } from "./components/Motion";
import { CARD_SCENES } from "./scenes/Cards";
import { S15Practice } from "./scenes/S15Practice";
import { S16Sheet } from "./scenes/S16Sheet";
import { S17Quiz } from "./scenes/S17Quiz";
import { S1Hook } from "./scenes/S1Hook";
import { S2Choose } from "./scenes/S2Choose";
import { SoundTrack } from "./SoundTrack";
import { theme } from "./theme";
import { SCENE_IDS, sceneRange, SceneId, totalFrames } from "./timing";

const C = theme.colors;
const SCENES: Record<string, React.FC> = { s1: S1Hook, s2: S2Choose, ...CARD_SCENES, s15: S15Practice, s16: S16Sheet, s17: S17Quiz };
// backdrop tints + caption accent follow each card's family: cyan = counts, violet = measurements, orange = testing tools,
// green = bonus / save
const fam = (c: string) => ({ a: c, b: C.violet === c ? C.cyan : C.violet, accent: c });
const LOOK: Record<string, { a: string; b: string; accent: string }> = {
  s1: { a: C.cyan, b: C.violet, accent: C.violet },
  s2: { a: C.violet, b: C.orange, accent: C.violet },
  s3: fam(C.cyan),
  s4: fam(C.cyan),
  s5: fam(C.cyan),
  s6: fam(C.cyan),
  s7: fam(C.cyan),
  s8: fam(C.violet),
  s9: fam(C.violet),
  s10: fam(C.violet),
  s11: fam(C.violet),
  s12: fam(C.orange),
  s13: fam(C.orange),
  s14: fam(C.green),
  s15: { a: C.green, b: C.cyan, accent: C.green },
  s16: { a: C.green, b: C.violet, accent: C.green },
  s17: { a: C.green, b: C.violet, accent: C.yellow },
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

export const DistributionsGuide: React.FC = () => {
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
