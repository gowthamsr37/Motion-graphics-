import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Grade, Grain, Vignette } from "./components/UI";
import { S1, S2, S3 } from "./scenes/Act1";
import { S4, S5 } from "./scenes/Act2";
import { S6, S7 } from "./scenes/Act3";
import { S8, S9 } from "./scenes/Act4";
import { CLAMP, theme } from "./theme";
import { scene, SceneId, voCues, wordAt } from "./timing";

const SCENES: [SceneId, React.FC][] = [
  ["s1", S1],
  ["s2", S2],
  ["s3", S3],
  ["s4", S4],
  ["s5", S5],
  ["s6", S6],
  ["s7", S7],
  ["s8", S8],
  ["s9", S9],
];

// Music ducks under the narration so the voice always sits on top.
const useDuck = (open: number, ducked: number) => {
  const { fps } = useVideoConfig();
  const vo = voCues(fps);
  const ramp = Math.round(fps / 4);
  return (f: number) => {
    let d = 0;
    for (const c of vo) {
      const a = c.from - 2, b = c.from + c.duration + 2;
      if (f < a - ramp || f > b + ramp) continue;
      d = Math.max(d, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP }));
    }
    return interpolate(d, [0, 1], [open, ducked]);
  };
};

export const TossExperiment: React.FC = () => {
  const { fps } = useVideoConfig();
  const duck = useDuck(0.95, 0.4);
  const brandAt = scene(fps, "s9").from + wordAt(fps, "s9", "Beyond") - 2;
  return (
    <AbsoluteFill style={{ background: theme.colors.night }}>
      {SCENES.map(([id, C]) => {
        const s = scene(fps, id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <C />
          </Sequence>
        );
      })}
      <Grade />
      <Captions hideFrom={brandAt} />
      <Grain />
      <Vignette />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} durationInFrames={c.duration + 2} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/score.wav")} volume={(f) => duck(f) * 0.6} />
      <Audio src={staticFile("audio/sfx.wav")} volume={0.9} />
    </AbsoluteFill>
  );
};
