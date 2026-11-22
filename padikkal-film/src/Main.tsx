import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, CLAMP, Grain, Masthead, Paper, SeamWipe, Vignette } from "./components/Ed";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats } from "./scenes/Story";
import { theme } from "./theme";
import { scene, SceneId, sentence, totalFrames, voCues } from "./timing";

const SCENES: [SceneId, React.FC][] = [
  ["s1", S1],
  ["s2", S2],
  ["s3", S3],
  ["s4", S4],
  ["s5", S5],
  ["s6", S6],
  ["s7", S7],
];

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
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

const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const at = (id: SceneId, rel: number) => S(id) + rel;
  const music = useDuck(0.75, 0.2);
  const noVo = Boolean(getInputProps().noVo);
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps);
  const ids: SceneId[] = ["s2", "s3", "s4", "s5", "s6", "s7"];
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {ids.map((id) => (
        <Sfx key={`w${id}`} at={S(id) - 9} file="swoosh.wav" volume={0.28} />
      ))}
      {/* S1 — the door spins, then the answer */}
      <Sfx at={2} file="pen.wav" volume={0.35} />
      <Sfx at={12} file="whip.wav" volume={0.14} />
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={`d${i}`} at={b1.doorStart + i * b1.per} file="whip.wav" volume={0.18} />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <Sfx key={`t${i}`} at={at("s1", b1.seven + i * 3)} file="tick.wav" volume={0.22} />
      ))}
      <Sfx at={at("s1", b1.then)} file="impact.wav" volume={0.6} />
      {/* S2 — three slams */}
      {[b2.a, b2.b, b2.c].map((x, i) => (
        <Sfx key={`s${i}`} at={at("s2", x - 2)} file="slam.wav" volume={i === 2 ? 0.55 : 0.45} />
      ))}
      {/* S3 */}
      {[b3.gill, b3.sai, b3.nair].map((x, i) => (
        <Sfx key={`g${i}`} at={at("s3", x - 6)} file="pop.wav" volume={0.24} />
      ))}
      <Sfx at={at("s3", b3.pad - 6)} file="rise.wav" volume={0.3} />
      <Sfx at={at("s3", b3.pad + 6)} file="impact.wav" volume={0.4} />
      <Sfx at={at("s3", b3.puj)} file="pen.wav" volume={0.25} />
      {/* S4 — the road */}
      {[b4.debut, b4.perth, b4.galle, b4.colombo, b4.well].map((x, i) => (
        <Sfx key={`r${i}`} at={at("s4", x - 4)} file={i >= 2 && i <= 3 ? "slam.wav" : "pop.wav"} volume={i >= 2 && i <= 3 ? 0.4 : 0.26} />
      ))}
      <Sfx at={at("s4", b4.galle - 4)} file="crowd.wav" volume={0.22} />
      {/* S5 — the clock ticks while the dots fill */}
      <Sfx at={at("s5", b5.puj - 8)} file="ticks.wav" volume={0.3} />
      <Sfx at={at("s5", b5.oth - 8)} file="ticks.wav" volume={0.22} />
      <Sfx at={at("s5", b5.pad - 8)} file="ticks.wav" volume={0.34} />
      <Sfx at={at("s5", b5.pad + 20)} file="impact.wav" volume={0.35} />
      {/* S6 — the mirror breaks */}
      <Sfx at={at("s6", b6.breaks - 4)} file="crack.wav" volume={0.5} />
      <Sfx at={at("s6", b6.n71 - 6)} file="slam.wav" volume={0.35} />
      {/* S7 */}
      <Sfx at={at("s7", 4)} file="rise.wav" volume={0.25} />
      <Sfx at={at("s7", 6)} file="swoosh.wav" volume={0.22} />
      <Sfx at={at("s7", b7.three - 2)} file="slam.wav" volume={0.55} />
      <Sfx at={at("s7", b7.three - 2)} file="impact.wav" volume={0.55} />
      <Sfx at={at("s7", b7.three - 4)} file="crowd.wav" volume={0.24} />
      <Sfx at={totalFrames(fps) - Math.round(fps * 1.2)} file="pen.wav" volume={0.3} />
    </>
  );
};

export const PadikkalFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const end = totalFrames(fps);
  const warm = interpolate(frame, [S("s7"), S("s7") + 40], [0, 1], CLAMP);
  const hide: [number, number][] = [[S("s7") + sentence(fps, "s7", 1).from - 2, end + 1]];
  return (
    <AbsoluteFill style={{ background: theme.colors.paper }}>
      <Paper warm={warm} />
      {SCENES.map(([id, Comp]) => {
        const s = scene(fps, id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      {(["s2", "s3", "s4", "s5", "s6", "s7"] as SceneId[]).map((id) => (
        <SeamWipe key={id} at={S(id)} />
      ))}
      <Masthead end={end} hideAfter={S("s7") + s7Beats(fps).brand} />
      <Captions hiddenRanges={hide} />
      <Grain />
      <Vignette />
      <AbsoluteFill style={{ background: theme.colors.paper, opacity: interpolate(frame, [end - 14, end], [0, 1], CLAMP) }} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
