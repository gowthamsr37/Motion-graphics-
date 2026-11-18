import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Captions, FadeEdges, Grade, Grain, Header, StepRail, Vignette } from "./components/Lab";
import { CLAMP } from "./components/Motion";
import { S1, s1Beats, S10, s10Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats, S8, s8Beats, S9, s9Beats } from "./scenes/Story";
import { theme } from "./theme";
import { scene, SceneId, totalFrames, voCues } from "./timing";

const SCENES: [SceneId, React.FC][] = [
  ["s1", S1], ["s2", S2], ["s3", S3], ["s4", S4], ["s5", S5], ["s6", S6], ["s7", S7], ["s8", S8], ["s9", S9], ["s10", S10],
];

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

// Every beat a sound lands on comes from the scene's beat table, so audio and picture never drift.
const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const at = (id: SceneId, rel: number) => scene(fps, id).from + rel;
  const music = useDuck(0.55, 0.16);
  const noVo = Boolean(getInputProps().noVo);
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps), b9 = s9Beats(fps), b10 = s10Beats(fps);
  const type = (id: SceneId, rel: number, v = 0.16) => <Sfx at={at(id, rel)} file="type.wav" volume={v} />;
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {/* scene changes */}
      {SCENES.slice(1).map(([id]) => <Sfx key={`w${id}`} at={scene(fps, id).from - 4} file="whoosh.wav" volume={0.12} />)}
      {/* S1 */}
      <Sfx at={at("s1", b1.flip)} file="flick.wav" volume={0.4} />
      <Sfx at={at("s1", b1.land)} file="land.wav" volume={0.4} />
      <Sfx at={at("s1", b1.q + 8)} file="blip.wav" volume={0.22} />
      <Sfx at={at("s1", b1.q + 18)} file="blip2.wav" volume={0.22} />
      {type("s1", b1.ds)}
      {/* S2 */}
      {type("s2", b2.code)}
      <Sfx at={at("s2", b2.count - 2)} file="count.wav" volume={0.16} />
      {type("s2", b2.drop + 8)}
      <Sfx at={at("s2", b2.decided - 4)} file="count.wav" volume={0.14} />
      {[0, 1, 2, 3].map((i) => <Sfx key={`b2${i}`} at={at("s2", b2.decided + 10 + i * 5)} file="blip.wav" volume={0.12} />)}
      {/* S3 */}
      <Sfx at={at("s3", b3.h0 + 4)} file="pop.wav" volume={0.22} />
      <Sfx at={at("s3", b3.h0 + 22)} file="pop.wav" volume={0.16} />
      <Sfx at={at("s3", b3.fifty)} file="rise.wav" volume={0.14} />
      <Sfx at={at("s3", b3.reject + 6)} file="blip2.wav" volume={0.22} />
      {/* S4 */}
      {type("s4", b4.code)}
      <Sfx at={at("s4", b4.grow)} file="cascade.wav" volume={0.16} />
      <Sfx at={at("s4", b4.band)} file="rise.wav" volume={0.16} />
      <Sfx at={at("s4", b4.luck)} file="pop.wav" volume={0.2} />
      {/* S5 */}
      {type("s5", b5.code)}
      <Sfx at={at("s5", b5.drop)} file="drop.wav" volume={0.4} />
      <Sfx at={at("s5", b5.p)} file="blip.wav" volume={0.22} />
      <Sfx at={at("s5", b5.none)} file="chime.wav" volume={0.24} />
      {/* S6 */}
      {type("s6", 4, 0.13)}
      {[b6.odi, b6.t20, b6.ipl].map((t, i) => <Sfx key={`f${i}`} at={at("s6", t)} file="pop.wav" volume={0.18} />)}
      {[0, 1, 2].map((i) => <Sfx key={`c${i}`} at={at("s6", b6.inside + i * 5)} file="blip.wav" volume={0.12} />)}
      <Sfx at={at("s6", b6.test)} file="drop.wav" volume={0.34} />
      <Sfx at={at("s6", b6.p)} file="alert.wav" volume={0.2} />
      {/* S7 */}
      <Sfx at={at("s7", b7.pit)} file="alert.wav" volume={0.2} />
      <Sfx at={at("s7", b7.y21 + 10)} file="rise.wav" volume={0.18} />
      {[12, 30, 48].map((d, i) => <Sfx key={`wc${i}`} at={at("s7", b7.next + d)} file="pop.wav" volume={0.16} />)}
      <Sfx at={at("s7", b7.trend)} file="sweep.wav" volume={0.16} />
      {/* S8 */}
      <Sfx at={at("s8", 0)} file="alert.wav" volume={0.18} />
      <Sfx at={at("s8", b8.top + 4)} file="fall.wav" volume={0.2} />
      <Sfx at={at("s8", b8.bottom + 2)} file="rise.wav" volume={0.16} />
      <Sfx at={at("s8", b8.r + 4)} file="drop.wav" volume={0.3} />
      {/* S9 */}
      {type("s9", b9.code)}
      <Sfx at={at("s9", b9.test + 6)} file="rise.wav" volume={0.16} />
      <Sfx at={at("s9", b9.bowl - 4)} file="rise.wav" volume={0.16} />
      <Sfx at={at("s9", b9.decision)} file="buzz.wav" volume={0.16} />
      <Sfx at={at("s9", b9.does)} file="chime.wav" volume={0.24} />
      {/* S10 */}
      {type("s10", b10.code)}
      <Sfx at={at("s10", b10.ci + 4)} file="sweep.wav" volume={0.16} />
      <Sfx at={at("s10", b10.fail)} file="chime.wav" volume={0.24} />
      <Sfx at={at("s10", b10.stamp)} file="stamp.wav" volume={0.55} />
      <Sfx at={at("s10", b10.cta)} file="whoosh.wav" volume={0.14} />
      <Sfx at={totalFrames(fps) - Math.round(fps * 1.2)} file="end.wav" volume={0.4} />
    </>
  );
};

export const TossLab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const flash = (t: number, k = 0.6) => interpolate(frame, [t - 2, t + 4, t + 30], [0, k, 0], CLAMP);
  const pulse = flash(S("s5") + s5Beats(fps).drop) + flash(S("s6") + s6Beats(fps).test) + flash(S("s10") + s10Beats(fps).stamp, 1);
  const marks = [0, S("s2"), S("s3"), S("s4"), S("s5"), S("s7"), S("s9"), S("s10")];
  const ctaAt = S("s10") + s10Beats(fps).cta - 6;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      <Backdrop pulse={pulse} />
      {SCENES.map(([id, Comp]) => {
        const s = scene(fps, id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      <Header hideAt={ctaAt} />
      <StepRail marks={marks} hideAt={ctaAt} />
      <Captions hideAfter={ctaAt} />
      <Grade />
      <Grain />
      <Vignette />
      <FadeEdges fadeIn={Math.round(fps * 0.4)} fadeOut={Math.round(fps * 0.7)} total={totalFrames(fps)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
