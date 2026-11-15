import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats, S8, s8Beats, S9, s9Beats } from "./scenes/Story";
import { Rain } from "./components/DLS";
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
        DLS · EXPLAINED
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

// when it is raining on screen (absolute frames)
const useRainOn = () => {
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const b2 = s2Beats(fps), b6 = s6Beats(fps);
  return (f: number) =>
    Math.max(
      interpolate(f, [0, 6, S("s1") + s1Beats(fps).wrong, S("s1") + s1Beats(fps).wrong + 20], [0.6, 1, 1, 0.25], CLAMP) * (f < S("s2") ? 1 : 0),
      interpolate(f, [S("s2") + b2.flip - 50, S("s2") + b2.flip - 30, S("s2") + b2.flip + 10, S("s2") + b2.flip + 30], [0, 1, 1, 0], CLAMP),
      interpolate(f, [S("s6"), S("s6") + 10, S("s6") + b6.half, S("s6") + b6.half + 20], [0, 0.8, 0.8, 0], CLAMP),
    );
};

const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const at = (id: SceneId, rel: number) => scene(fps, id).from + rel;
  const end = (id: SceneId, i: number) => at(id, sentence(fps, id, i).to);
  const music = useDuck(0.7, 0.16);
  const crowd = useDuck(0.26, 0.09);
  const rainOn = useRainOn();
  const duck = useDuck(1, 0.3);
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps);
  const noVo = Boolean(getInputProps().noVo);
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      <Audio src={staticFile("audio/crowd-ambience.wav")} volume={crowd} />
      <Audio
        src={staticFile("audio/rain.wav")}
        volume={(f) => {
          // the rain sound clears out of the way before the key line in scene 6
          const s6 = scene(fps, "s6").from;
          const clear = interpolate(f, [s6 + s6Beats(fps).half - 12, s6 + s6Beats(fps).half], [1, 0], CLAMP) * (f >= s6 ? 1 : 0) + (f < s6 ? 1 : 0);
          return 0.42 * rainOn(f) * duck(f) * clear;
        }}
      />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {/* S1 */}
      <Sfx at={at("s1", b1.score - 20)} file="rattle-count.wav" volume={0.18} />
      <Sfx at={at("s1", b1.cut) + 2} file="flip.wav" volume={0.36} />
      <Sfx at={at("s1", b1.wrong)} file="buzz.wav" volume={0.26} />
      <Sfx at={at("s1", b1.target)} file="stamp.wav" volume={0.55} />
      {/* S2 — 1992 */}
      <Sfx at={at("s2", b2.need - 14)} file="slide.wav" volume={0.14} />
      <Sfx at={at("s2", b2.flip) + 2} file="flip.wav" volume={0.36} />
      <Sfx at={at("s2", b2.flip) + 10} file="flip.wav" volume={0.36} />
      <Sfx at={at("s2", b2.flip) + 14} file="crowd-groan.wav" volume={0.2} />
      <Sfx at={end("s2", 2) + 4} file="click-low.wav" volume={0.3} />
      {/* S3 — the two tanks */}
      <Sfx at={at("s3", b3.overs)} file="fill.wav" volume={0.2} />
      {Array.from({ length: 10 }).map((_, i) => <Sfx key={`s3w${i}`} at={at("s3", b3.wickets + i * 2)} file="click-low.wav" volume={0.12} />)}
      <Sfx at={at("s3", b3.runs)} file="fill.wav" volume={0.22} />
      {/* S4 */}
      {Array.from({ length: 10 }).map((_, i) => <Sfx key={`s4a${i}`} at={at("s4", b4.a + i * 2)} file="click-low.wav" volume={0.1} />)}
      {Array.from({ length: 10 }).map((_, i) => <Sfx key={`s4b${i}`} at={at("s4", b4.b + i * 2)} file="click-low.wav" volume={0.1} />)}
      <Sfx at={at("s4", b4.b + 30)} file="buzz.wav" volume={0.2} />
      {/* S5 — curves */}
      {[0, 14, 28, 42].map((d, i) => <Sfx key={`s5${i}`} at={at("s5", b5.curves + d)} file="whoosh.wav" volume={0.12} />)}
      <Sfx at={at("s5", b5.full) + 4} file="click-low.wav" volume={0.3} />
      {/* S6 — the reveal */}
      <Sfx at={at("s6", b6.half + 10)} file="fill.wav" volume={0.2} />
      <Sfx at={at("s6", b6.third)} file="fill.wav" volume={0.22} />
      <Sfx at={at("s6", b6.target)} file="stamp.wav" volume={0.5} />
      <Sfx at={at("s6", b6.not126)} file="buzz.wav" volume={0.22} />
      {/* S7 — par */}
      <Sfx at={at("s7", b7.a + 20)} file="click-low.wav" volume={0.32} />
      <Sfx at={at("s7", b7.b + 20)} file="buzz.wav" volume={0.24} />
      {/* S8 */}
      <Sfx at={at("s8", b8.dls - 4)} file="flip.wav" volume={0.32} />
      <Sfx at={at("s8", b8.dls)} file="flip.wav" volume={0.32} />
      <Sfx at={end("s8", 2) + 4} file="cheer-soft.wav" volume={0.18} />
      {/* S9 */}
      <Sfx at={scene(fps, "s9").from + scene(fps, "s9").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.7} />
    </>
  );
};

export const DLSExplained: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const rainOn = useRainOn();
  const t6 = S("s6") + s6Beats(fps).target;
  // lighting: grey under the rain, a flare when the real target lands
  const lights = (1.1 - 0.4 * rainOn(frame)) * interpolate(frame, [t6 - 2, t6 + 4, t6 + 30], [1, 1.35, 1], CLAMP);
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
      <Rain on={rainOn(frame)} />
      <Masthead />
      <SubtitleStrip hiddenAfter={lockup} />
      <Grain />
      <Vignette />
      <Blackout flickerEnd={0} fadeLength={Math.round(fps * 0.7)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
