import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats, S8, s8Beats, S9, s9Beats } from "./scenes/Story";
import { theme } from "./theme";
import { scene, SceneId, sentence, voCues } from "./timing";

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

const Masthead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = scene(fps, "s9").from + s9Beats(fps).brand;
  const on = interpolate(frame, [end - 8, end + 4], [1, 0], { easing: theme.ease.inOut, ...CLAMP });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 150,
        width: 960,
        height: 52,
        borderRadius: 6,
        background: `linear-gradient(180deg, ${theme.colors.panelHi}, ${theme.colors.board})`,
        boxShadow: `inset 0 0 0 2px ${theme.colors.panelEdge}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        boxSizing: "border-box",
        opacity: on,
        zIndex: 50,
      }}
    >
      <Lettering size={22} font="body" spacing="0.24em">
        BEYOND THE SCOREBOARD
      </Lettering>
      <Lettering size={22} font="body" weight={500} color={theme.colors.creamDim} spacing="0.16em">
        LBW · EXPLAINED
      </Lettering>
    </div>
  );
};

const Sfx: React.FC<{ at: number; file: string; volume: number | ((f: number) => number) }> = ({ at, file, volume }) => (
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
      const a = c.from - 3;
      const b = c.from + c.duration + 3;
      if (f < a - ramp || f > b + ramp) continue;
      d = Math.max(d, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP }));
    }
    return interpolate(d, [0, 1], [open, ducked]);
  };
};

// one delivery's sounds: release whoosh, bounce, pad
const Ball: React.FC<{ at: number; dur?: number; pitched?: boolean; vol?: number }> = ({ at, dur = 22, pitched = true, vol = 1 }) => (
  <>
    <Sfx at={at} file="whoosh.wav" volume={0.16 * vol} />
    {pitched && <Sfx at={at + Math.round(dur * 0.62)} file="tick.wav" volume={0.14 * vol} />}
    <Sfx at={at + dur} file="pad.wav" volume={0.55 * vol} />
  </>
);

const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const at = (id: SceneId, rel: number) => scene(fps, id).from + rel;
  const end = (id: SceneId, i: number) => at(id, sentence(fps, id, i).to);
  const music = useDuck(0.7, 0.16);
  const crowd = useDuck(0.3, 0.1);
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps);
  const noVo = Boolean(getInputProps().noVo);
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      <Audio src={staticFile("audio/crowd-ambience.wav")} volume={crowd} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {/* S1 — the hook */}
      <Ball at={at("s1", b1.ball)} dur={20} vol={1.3} />
      <Sfx at={at("s1", b1.hitting) + 20} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s1", b1.appeal)} file="appeal.wav" volume={0.38} />
      <Sfx at={at("s1", b1.notOut) + 2} file="stamp.wav" volume={0.6} />
      {/* S2 — three lamps, one turns red */}
      {[6, 12, 18].map((d, i) => <Sfx key={`s2${i}`} at={at("s2", b2.three + d)} file="click-low.wav" volume={0.3} />)}
      <Sfx at={at("s2", b2.red)} file="buzz.wav" volume={0.3} />
      {/* S3 — three balls pitching */}
      <Ball at={at("s3", b3.leg + 4)} />
      <Sfx at={at("s3", b3.leg + 18)} file="buzz.wav" volume={0.26} />
      <Sfx at={end("s3", 2) + 2} file="stamp.wav" volume={0.4} />
      <Ball at={at("s3", b3.fine + 2)} />
      <Ball at={at("s3", b3.fine + 30)} />
      <Sfx at={at("s3", b3.fine + 16)} file="click-low.wav" volume={0.3} />
      {/* S4 — impacts */}
      <Ball at={at("s4", b4.inLine)} pitched={false} />
      <Sfx at={at("s4", b4.inLine + 22)} file="click-low.wav" volume={0.3} />
      <Ball at={at("s4", b4.leg)} pitched={false} />
      <Sfx at={at("s4", b4.leg + 22)} file="buzz.wav" volume={0.26} />
      <Ball at={at("s4", b4.off)} pitched={false} />
      {/* S5 — would it hit? */}
      <Ball at={at("s5", b5.hit)} pitched={false} />
      <Sfx at={at("s5", b5.hit + 26)} file="click-low.wav" volume={0.3} />
      <Ball at={at("s5", b5.over - 20)} pitched={false} />
      <Sfx at={at("s5", b5.over + 6)} file="buzz.wav" volume={0.24} />
      <Ball at={at("s5", b5.turn - 18)} pitched={false} />
      {/* S6 — the two rules */}
      <Sfx at={end("s6", 1) + 2} file="stamp.wav" volume={0.4} />
      <Sfx at={end("s6", 2) + 2} file="stamp.wav" volume={0.4} />
      {/* S7 — three green lights, the finger */}
      {[b7.p, b7.i, b7.w].map((t, i) => <Sfx key={`s7${i}`} at={at("s7", t)} file="click-low.wav" volume={0.36} />)}
      <Sfx at={at("s7", b7.finger + 8)} file="stamp.wav" volume={0.45} />
      <Sfx at={end("s7", 4) + 4} file="cheer-big.wav" volume={0.22} />
      {/* S8 — the quiz */}
      <Ball at={at("s8", b8.replay)} dur={20} />
      {[0, 1, 2].map((k) => <Sfx key={`s8t${k}`} at={at("s8", b8.ask + 20) + Math.round(((b8.reveal - b8.ask - 20) * k) / 3)} file="tick.wav" volume={0.3} />)}
      <Sfx at={at("s8", b8.reveal + 6)} file="buzz.wav" volume={0.3} />
      <Sfx at={at("s8", b8.notOut)} file="stamp.wav" volume={0.55} />
      {/* S9 */}
      <Sfx at={scene(fps, "s9").from + scene(fps, "s9").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.7} />
    </>
  );
};

export const LBWExplained: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  // lighting: a dramatic dip for the hook verdict and for the quiz countdown
  const nb = S("s1") + s1Beats(fps).notOut;
  const ask = S("s8") + s8Beats(fps).ask;
  const rev = S("s8") + s8Beats(fps).reveal;
  const lights = interpolate(frame, [0, nb - 2, nb + 4, nb + 30, ask, ask + 10, rev, rev + 8], [1.1, 1.1, 1.5, 1.05, 1.05, 0.6, 0.6, 1.2], CLAMP);
  const lockup = S("s9") + s9Beats(fps).brand + 20;
  return (
    <AbsoluteFill style={{ background: theme.colors.board, fontFamily: theme.fonts.body }}>
      <Backdrop lights={lights} />
      {SCENES.map(([id, Comp]) => {
        const s = scene(fps, id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      <Masthead />
      <SubtitleStrip hiddenAfter={lockup} />
      <Grain />
      <Vignette />
      <Blackout flickerEnd={0} fadeLength={Math.round(fps * 0.7)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
