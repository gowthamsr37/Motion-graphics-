import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "./components/Motion";
import { Backdrop, Captions, FadeEdges, Grade, Grain, Header, Vignette } from "./components/Stage";
import { S1, S2, S3, S4, S5, S6, S7, S8 } from "./scenes/Story";
import { theme } from "./theme";
import { scene, SceneId, sentence, totalFrames, voCues } from "./timing";

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
  const A = (id: SceneId, i: number, rel = 0) => scene(fps, id).from + sentence(fps, id, i).from + rel;
  const music = useDuck(0.55, 0.15);
  const noVo = Boolean(getInputProps().noVo);
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {SCENES.slice(1).map(([id]) => <Sfx key={id} at={scene(fps, id).from - 5} file="whoosh.wav" volume={0.12} />)}
      {/* s1 */}
      <Sfx at={8} file="pop.wav" volume={0.25} />
      <Sfx at={18} file="pop.wav" volume={0.25} />
      <Sfx at={A("s1", 1, 40)} file="sparkle.wav" volume={0.25} />
      <Sfx at={A("s1", 2, 4)} file="pop.wav" volume={0.3} />
      <Sfx at={A("s1", 2, 28)} file="pop.wav" volume={0.3} />
      <Sfx at={A("s1", 3, 10)} file="count.wav" volume={0.2} />
      <Sfx at={A("s1", 4, 2)} file="tension.wav" volume={0.3} />
      {/* s2 */}
      <Sfx at={A("s2", 0, 30)} file="pop.wav" volume={0.25} />
      <Sfx at={A("s2", 1, 0)} file="rise.wav" volume={0.2} />
      <Sfx at={A("s2", 2, 14)} file="tick.wav" volume={0.25} />
      <Sfx at={A("s2", 2, 40)} file="tick.wav" volume={0.25} />
      <Sfx at={A("s2", 3, 60)} file="thud.wav" volume={0.35} />
      <Sfx at={A("s2", 3, 70)} file="count.wav" volume={0.18} />
      {/* s3 */}
      <Sfx at={A("s3", 0, 20)} file="pop.wav" volume={0.25} />
      <Sfx at={A("s3", 1, 0)} file="coin.wav" volume={0.3} />
      {[14, 26, 38].map((d) => <Sfx key={d} at={A("s3", 2, d)} file="tick.wav" volume={0.22} />)}
      <Sfx at={A("s3", 2, 56)} file="coins.wav" volume={0.3} />
      <Sfx at={A("s3", 3, 10)} file="hmm.wav" volume={0.3} />
      {/* s4 */}
      <Sfx at={A("s4", 0, 0)} file="rise.wav" volume={0.18} />
      <Sfx at={A("s4", 2, 24)} file="sparkle.wav" volume={0.22} />
      {/* s5 */}
      <Sfx at={A("s5", 0, 20)} file="crash.wav" volume={0.5} />
      <Sfx at={A("s5", 0, 34)} file="stamp.wav" volume={0.5} />
      <Sfx at={A("s5", 1, 50)} file="pop.wav" volume={0.25} />
      <Sfx at={A("s5", 2, 0)} file="phone.wav" volume={0.25} />
      {[6, 30, 56].map((d) => <Sfx key={d} at={A("s5", 2, d)} file="pop.wav" volume={0.22} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <Sfx key={i} at={A("s5", 3, 40 + i * 7)} file="tick.wav" volume={0.2} />)}
      {/* s6 */}
      <Sfx at={A("s6", 0, 4)} file="rise.wav" volume={0.22} />
      <Sfx at={A("s6", 0, 90)} file="pop.wav" volume={0.25} />
      <Sfx at={A("s6", 1, 10)} file="sparkle.wav" volume={0.3} />
      {/* s7 */}
      <Sfx at={A("s7", 1, 90)} file="fall.wav" volume={0.25} />
      <Sfx at={A("s7", 2, 6)} file="stamp.wav" volume={0.5} />
      <Sfx at={A("s7", 3, 10)} file="rise.wav" volume={0.22} />
      <Sfx at={A("s7", 3, 50)} file="pop.wav" volume={0.3} />
      {/* s8 */}
      <Sfx at={A("s8", 0, 44)} file="boom.wav" volume={0.4} />
      {[0, 1, 2].map((i) => <Sfx key={i} at={A("s8", 1, 20 + i * 26)} file="chime.wav" volume={0.18} />)}
      <Sfx at={A("s8", 3, 2)} file="whoosh.wav" volume={0.18} />
      <Sfx at={A("s8", 3, 26)} file="pop.wav" volume={0.3} />
    </>
  );
};

export const RentVsBuy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crashAt = scene(fps, "s5").from + sentence(fps, "s5", 0).from + 20;
  const flash = interpolate(frame, [crashAt - 2, crashAt + 4, crashAt + 40], [0, 1, 0], CLAMP);
  const total = totalFrames(fps);
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      <Backdrop flash={flash} />
      {SCENES.map(([id, Comp]) => {
        const s = scene(fps, id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      <Header />
      <Captions hideAfter={total} />
      <Grade />
      <Grain />
      <Vignette />
      <FadeEdges fadeIn={Math.round(fps * 0.3)} fadeOut={Math.round(fps * 0.6)} total={total} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
