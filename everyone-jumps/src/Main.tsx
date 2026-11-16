import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Grade, Grain, Vignette } from "./components/UI";
import { S1, S2, S3 } from "./scenes/Act1";
import { S4 } from "./scenes/Act2";
import { S5, S6 } from "./scenes/Act3";
import { CLAMP, theme } from "./theme";
import { scene, SceneId, voCues } from "./timing";

const SCENES: [SceneId, React.FC][] = [
  ["s1", S1],
  ["s2", S2],
  ["s3", S3],
  ["s4", S4],
  ["s5", S5],
  ["s6", S6],
];

// Music ducks under the narration.
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

export const EveryoneJumps: React.FC = () => {
  const { fps } = useVideoConfig();
  const duck = useDuck(0.95, 0.42);
  return (
    <AbsoluteFill style={{ background: theme.colors.space }}>
      {SCENES.map(([id, C]) => {
        const s = scene(fps, id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <C />
          </Sequence>
        );
      })}
      <Grade />
      <Captions />
      <Grain />
      <Vignette />
      {/* narration */}
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} durationInFrames={c.duration + 2} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {/* original score + sound design (scripts/gen-audio.mjs), pre-timed to the same timeline */}
      <Audio src={staticFile("audio/score.wav")} volume={(f) => duck(f) * 0.62} />
      <Audio src={staticFile("audio/sfx.wav")} volume={0.9} />
    </AbsoluteFill>
  );
};
