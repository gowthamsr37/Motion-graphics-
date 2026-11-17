import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Captions, Coin, Grain, Header, Vignette } from "./components/Kit";
import { CLAMP } from "./components/Motion";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats, S8, s8Beats, S9, s9Beats } from "./scenes/Story";
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
  ["s8", S8],
  ["s9", S9],
];

// key frames (absolute) shared by picture and sound
export const useKeys = () => {
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps), b9 = s9Beats(fps);
  return {
    S,
    b1, b2, b3, b4, b5, b6, b7, b8, b9,
    wipes: [S("s2"), S("s5"), S("s9")],
    slams: [S("s1") + b1.nothing, S("s1") + b1.count + 40, S("s3") + b3.drop, S("s5") + b5.thirty + 16, S("s7") + b7.v57, S("s9") + b9.v, S("s9") + b9.myth],
  };
};

// a gold coin flies at the camera and fills the frame across a cut
const CoinWipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const u = (frame - (at - 12)) / 24;
  if (u < 0 || u > 1) return null;
  const scale = u < 0.5 ? interpolate(u, [0, 0.5], [0.15, 9], { easing: theme.ease.in }) : interpolate(u, [0.5, 1], [9, 16]);
  const op = u < 0.5 ? 1 : interpolate(u, [0.5, 1], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 60, pointerEvents: "none" }}>
      <div style={{ transform: `scale(${scale}) rotate(${u * 40}deg)`, opacity: op }}>
        <Coin size={240} angle={u * Math.PI * 3} />
      </div>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`audio/${file}`)} volume={volume} />
  </Sequence>
);

const useDuck = (open: number, ducked: number) => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps / 6);
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
  const k = useKeys();
  const { S, b1, b2, b3, b4, b5, b6, b7, b8, b9 } = k;
  const music = useDuck(0.8, 0.24);
  const noVo = Boolean(getInputProps().noVo);
  const at = (id: SceneId, rel: number) => S(id) + rel;
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {k.wipes.map((w, i) => (
        <Sfx key={`w${i}`} at={w - 13} file="swoosh.wav" volume={0.45} />
      ))}
      {k.slams.map((s, i) => (
        <Sfx key={`s${i}`} at={s} file="impact.wav" volume={i === 6 ? 0.9 : 0.55} />
      ))}
      {/* S1 */}
      <Sfx at={0} file="coin-flick.wav" volume={0.55} />
      {b1.w.map((t, i) => (
        <Sfx key={`h${i}`} at={at("s1", t) - 1} file="hit.wav" volume={i >= 5 ? 0.5 : 0.3} />
      ))}
      <Sfx at={at("s1", b1.prove)} file="whoosh.wav" volume={0.3} />
      <Sfx at={at("s1", b1.count) - 2} file="tick-run.wav" volume={0.35} />
      {/* S2 */}
      <Sfx at={at("s2", b2.winners)} file="servo.wav" volume={0.32} />
      <Sfx at={at("s2", b2.half)} file="ding.wav" volume={0.3} />
      <Sfx at={at("s2", b2.z48)} file="shimmer.wav" volume={0.3} />
      <Sfx at={at("s2", b2.luck) - 2} file="pop.wav" volume={0.35} />
      {/* S3 */}
      <Sfx at={at("s3", b3.won) + 8} file="tick-run.wav" volume={0.28} />
      <Sfx at={at("s3", b3.of)} file="tick-run.wav" volume={0.24} />
      <Sfx at={at("s3", b3.drop) - Math.round(fps * 2.2)} file="riser.wav" volume={0.32} />
      <Sfx at={at("s3", b3.drop)} file="coin-land.wav" volume={0.4} />
      <Sfx at={at("s3", b3.exactly)} file="stamp.wav" volume={0.6} />
      {/* S4 */}
      <Sfx at={at("s4", b4.t20) - 4} file="servo.wav" volume={0.28} />
      <Sfx at={at("s4", b4.ipl) - 4} file="servo.wav" volume={0.28} />
      <Sfx at={at("s4", b4.luck)} file="ding.wav" volume={0.32} />
      {/* S5 */}
      <Sfx at={at("s5", b5.q)} file="whoosh.wav" volume={0.25} />
      <Sfx at={at("s5", b5.wc) - 2} file="hit.wav" volume={0.45} />
      {Array.from({ length: 13 }).map((_, i) => (
        <Sfx key={`t${i}`} at={at("s5", b5.dubai + i * Math.max(3, Math.round((b5.thirteen - b5.dubai) / 12)))} file="pop.wav" volume={i === 7 ? 0.4 : 0.22} />
      ))}
      <Sfx at={at("s5", b5.dew)} file="dew.wav" volume={0.3} />
      <Sfx at={at("s5", b5.slip)} file="pop.wav" volume={0.25} />
      <Sfx at={at("s5", b5.bowl)} file="pop.wav" volume={0.25} />
      <Sfx at={at("s5", b5.thirty) - 6} file="tick-run.wav" volume={0.28} />
      {/* S6 */}
      <Sfx at={at("s6", b6.vanished) - 2} file="tape-stop.wav" volume={0.5} />
      <Sfx at={at("s6", b6.vanished)} file="glitch.wav" volume={0.35} />
      {[b6.y22, b6.y24, b6.y26].map((t, i) => (
        <Sfx key={`b${i}`} at={at("s6", t) - 3} file="fill.wav" volume={0.22} />
      ))}
      <Sfx at={at("s6", b6.law)} file="hit.wav" volume={0.35} />
      {/* S7 */}
      <Sfx at={at("s7", b7.v57) - Math.round(fps * 1.6)} file="riser.wav" volume={0.3} />
      <Sfx at={at("s7", b7.v57) - 8} file="servo.wav" volume={0.3} />
      <Sfx at={at("s7", b7.v48) - 8} file="servo.wav" volume={0.22} />
      <Sfx at={at("s7", b7.because)} file="cracks.wav" volume={0.4} />
      {/* S8 */}
      <Sfx at={at("s8", b8.coin) - 4} file="coin-flick.wav" volume={0.4} />
      <Sfx at={at("s8", b8.v55) - 6} file="fill.wav" volume={0.3} />
      <Sfx at={at("s8", b8.v45) - 6} file="fill.wav" volume={0.24} />
      {/* S9 */}
      <Sfx at={at("s9", b9.v) - Math.round(fps * 2.0)} file="riser.wav" volume={0.3} />
      <Sfx at={at("s9", b9.v)} file="coin-land.wav" volume={0.35} />
      <Sfx at={at("s9", b9.extra)} file="ding.wav" volume={0.3} />
      <Sfx at={at("s9", b9.myth)} file="stamp.wav" volume={0.75} />
      <Sfx at={at("s9", b9.myth)} file="boom.wav" volume={0.6} />
      <Sfx at={at("s9", b9.cta) - 4} file="swoosh.wav" volume={0.3} />
      <Sfx at={totalFrames(fps) - Math.round(fps * 1.1)} file="ding.wav" volume={0.3} />
    </>
  );
};

export const TossMyth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = useKeys();
  const flash = Math.max(0, ...k.slams.map((s) => interpolate(frame, [s, s + 1, s + 9], [0, 1, 0], CLAMP)));
  const redPulse = interpolate(frame, [k.S("s9") + k.b9.myth, k.S("s9") + k.b9.myth + 3, k.S("s9") + k.b9.myth + 40], [0, 0.22, 0.08], CLAMP);
  const hideCaps: [number, number][] = [
    [0, k.S("s2")],
    [k.S("s9") + sentence(fps, "s9", 2).from - 2, totalFrames(fps) + 1],
  ];
  const chapters = [
    { label: "CLAIM", from: 0 },
    { label: "TEST", from: k.S("s2") },
    { label: "DATA", from: k.S("s3") },
    { label: "2021 TRAP", from: k.S("s5") },
    { label: "EXCEPTIONS", from: k.S("s7") },
    { label: "VERDICT", from: k.S("s9") },
  ];
  return (
    <AbsoluteFill style={{ background: theme.colors.bg0 }}>
      <Bg flash={flash} tint={redPulse > 0 ? `rgba(255,40,60,${redPulse})` : undefined} />
      {SCENES.map(([id, Comp]) => {
        const s = scene(fps, id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      <Header chapters={chapters} end={totalFrames(fps)} hideAfter={k.S("s9") + k.b9.cta - 4} />
      <Captions hiddenRanges={hideCaps} />
      {k.wipes.map((w) => (
        <CoinWipe key={w} at={w} />
      ))}
      <Grain />
      <Vignette />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [totalFrames(fps) - 18, totalFrames(fps)], [0, 1], CLAMP) }} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
