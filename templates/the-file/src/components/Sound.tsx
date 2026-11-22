// Score + narration + SFX. The score is ducked under the voice; SFX cues are absolute frames.
import React from "react";
import { Audio, getInputProps, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { voCues } from "../timing";
import { CLAMP } from "./Ed";

// SFX made by scripts/gen-audio.mjs: swoosh whip pen tick ticks impact slam pop rise crack crowd
export type Cue = { at: number; file: string; volume: number };

const Sfx: React.FC<Cue> = ({ at, file, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`audio/${file}`)} volume={volume} />
  </Sequence>
);

const useDuck = (open: number, ducked: number) => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps / 5);
  return (f: number) => {
    let d = 0;
    for (const c of cues) {
      const a = c.from - 2, b = c.from + c.duration + 2;
      if (f < a - ramp || f > b + ramp) continue;
      d = Math.max(d, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], CLAMP));
    }
    return interpolate(d, [0, 1], [open, ducked]);
  };
};

export const SoundTrack: React.FC<{ cues: Cue[]; music?: [number, number] }> = ({ cues, music = [0.75, 0.2] }) => {
  const { fps } = useVideoConfig();
  const duck = useDuck(music[0], music[1]);
  const noVo = Boolean(getInputProps().noVo); // render with --props='{"noVo":true}' for a music+SFX-only pass
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={duck} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {cues.map((c, i) => (
        <Sfx key={i} {...c} />
      ))}
    </>
  );
};
