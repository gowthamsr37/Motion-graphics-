import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneFrom } from "./components/Cast";
import { CLAMP } from "./components/Motion";
import { Backdrop, Film, Subtitles, Weave } from "./components/Stage";
import { S1, S2, S3, S4, S5, S6, S7, S8 } from "./scenes/Story";
import { theme } from "./theme";
import { line, scene, SceneId, totalFrames, voCues } from "./timing";

const SCENES: [SceneId, React.FC][] = [["s1", S1], ["s2", S2], ["s3", S3], ["s4", S4], ["s5", S5], ["s6", S6], ["s7", S7], ["s8", S8]];

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`audio/${file}`)} volume={volume} />
  </Sequence>
);

const useDuck = (open: number, ducked: number) => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps / 4);
  return (f: number) => {
    let d = 0;
    for (const c of cues) {
      const a = c.from - 3, b = c.from + c.duration + 3;
      if (f < a - ramp || f > b + ramp) continue;
      d = Math.max(d, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP }));
    }
    return interpolate(d, [0, 1], [open, ducked]);
  };
};

const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const A = (id: SceneId, i: number, rel = 0) => scene(fps, id).from + line(fps, id, i).from + rel;
  const S = (id: SceneId, rel = 0) => scene(fps, id).from + rel;
  const music = useDuck(0.6, 0.16);
  const noVo = Boolean(getInputProps().noVo);
  const dhin = (at: number) => [0, 9, 18].map((d) => <Sfx key={at + d} at={at + d} file="dhin.wav" volume={0.55} />);
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {/* s1 */}
      <Sfx at={4} file="curtain.wav" volume={0.4} />
      <Sfx at={A("s1", 0, 2)} file="sting.wav" volume={0.35} />
      <Sfx at={A("s1", 1, 60)} file="coins.wav" volume={0.3} />
      <Sfx at={A("s1", 2, 70)} file="boom.wav" volume={0.5} />
      {/* s2 */}
      <Sfx at={S("s2", -4)} file="whoosh.wav" volume={0.2} />
      <Sfx at={A("s2", 1, 20)} file="pop.wav" volume={0.3} />
      <Sfx at={A("s2", 2, 10)} file="stamp.wav" volume={0.5} />
      {dhin(A("s2", 3))}
      {/* s3 */}
      <Sfx at={S("s3", -4)} file="whoosh.wav" volume={0.2} />
      <Sfx at={A("s3", 1, 10)} file="pop.wav" volume={0.3} />
      <Sfx at={A("s3", 2, 10)} file="coins.wav" volume={0.35} />
      {dhin(A("s3", 3))}
      {/* s4 */}
      <Sfx at={S("s4", 0)} file="sting.wav" volume={0.3} />
      <Sfx at={A("s4", 1, 0)} file="rise.wav" volume={0.25} />
      {/* s5 — interval */}
      <Sfx at={S("s5", 0)} file="curtain.wav" volume={0.45} />
      <Sfx at={S("s5", 14)} file="interval.wav" volume={0.45} />
      <Sfx at={S("s5", 52)} file="curtain.wav" volume={0.4} />
      <Sfx at={A("s5", 0, 50)} file="crash.wav" volume={0.6} />
      <Sfx at={A("s5", 0, 62)} file="stamp.wav" volume={0.55} />
      {dhin(A("s5", 1))}
      <Sfx at={A("s5", 2, 30)} file="pop.wav" volume={0.3} />
      <Sfx at={A("s5", 3, 0)} file="sting.wav" volume={0.3} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Sfx key={i} at={A("s5", 3, 90 + i * 8)} file="tick.wav" volume={0.3} />)}
      {/* s6 */}
      <Sfx at={S("s6", 0)} file="clock.wav" volume={0.35} />
      <Sfx at={A("s6", 1, 50)} file="pop.wav" volume={0.3} />
      <Sfx at={A("s6", 2, 40)} file="win.wav" volume={0.45} />
      {/* s7 */}
      <Sfx at={S("s7", 2)} file="boom.wav" volume={0.45} />
      <Sfx at={A("s7", 1, 110)} file="fall.wav" volume={0.3} />
      <Sfx at={A("s7", 2, 4)} file="stamp.wav" volume={0.55} />
      <Sfx at={A("s7", 3, 20)} file="rise.wav" volume={0.3} />
      {/* s8 */}
      <Sfx at={A("s8", 0, 100)} file="boom.wav" volume={0.5} />
      <Sfx at={A("s8", 3, -6)} file="curtain.wav" volume={0.35} />
      <Sfx at={A("s8", 3, 26)} file="sting.wav" volume={0.3} />
      <Sfx at={A("s8", 3, 46)} file="applause.wav" volume={0.35} />
    </>
  );
};

export const RentVsBuyFilmy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crashAt = scene(fps, "s5").from + line(fps, "s5", 0).from + 50;
  const red = interpolate(frame, [crashAt - 2, crashAt + 6, crashAt + 60], [0, 1, 0.25], CLAMP) * (frame < scene(fps, "s6").from ? 1 : 0);
  const total = totalFrames(fps);
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <Weave>
        <Backdrop redAlert={red} />
        {SCENES.map(([id, Comp]) => {
          const s = scene(fps, id);
          return (
            <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
              <SceneFrom.Provider value={s.from}>
                <Comp />
              </SceneFrom.Provider>
            </Sequence>
          );
        })}
      </Weave>
      <Subtitles hideAfter={total} />
      <Film />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(interpolate(frame, [0, 8], [1, 0], CLAMP), interpolate(frame, [total - 18, total], [0, 1], CLAMP)) }} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
