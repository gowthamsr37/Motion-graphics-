import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats } from "./scenes/Story";
import { theme } from "./theme";
import { scene, SceneId, voCues } from "./timing";

const SCENES: [SceneId, React.FC][] = [
  ["s1", S1],
  ["s2", S2],
  ["s3", S3],
  ["s4", S4],
  ["s5", S5],
  ["s6", S6],
];

const Masthead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = scene(fps, "s6").from + s6Beats(fps).brand;
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
        DEVDUTT PADIKKAL · INDIA'S No.3
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

const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const at = (id: SceneId, rel: number) => scene(fps, id).from + rel;
  const music = useDuck(0.72, 0.18);
  const crowd = useDuck(0.16, 0.06);
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps);
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
      {/* S1 */}
      {Array.from({ length: 7 }).map((_, i) => <Sfx key={`t${i}`} at={at("s1", b1.tried + i * 3)} file="click-low.wav" volume={0.18} />)}
      <Sfx at={at("s1", b1.easy)} file="stamp.wav" volume={0.35} />
      {[b1.a, b1.b, b1.c].map((x, i) => <Sfx key={`f${i}`} at={at("s1", x - 2)} file="flip.wav" volume={0.3} />)}
      <Sfx at={at("s1", b1.c) + 4} file="cheer-soft.wav" volume={0.2} />
      {/* S2 */}
      {[b2.gill, b2.sai, b2.nair].map((x, i) => <Sfx key={`g${i}`} at={at("s2", x - 6)} file="fill.wav" volume={0.12} />)}
      <Sfx at={at("s2", b2.pad) - 6} file="fill.wav" volume={0.24} />
      <Sfx at={at("s2", b2.pad) + 6} file="bat.wav" volume={0.35} />
      <Sfx at={at("s2", b2.bench)} file="click-low.wav" volume={0.3} />
      {/* S3 */}
      <Sfx at={at("s3", b3.debut) - 6} file="click-low.wav" volume={0.26} />
      <Sfx at={at("s3", b3.perth) - 6} file="buzz.wav" volume={0.14} />
      <Sfx at={at("s3", b3.galle) - 6} file="bat.wav" volume={0.4} />
      <Sfx at={at("s3", b3.galle) - 4} file="cheer-big.wav" volume={0.22} />
      <Sfx at={at("s3", b3.colombo) - 6} file="bat.wav" volume={0.35} />
      <Sfx at={at("s3", b3.colombo) - 4} file="cheer-soft.wav" volume={0.2} />
      <Sfx at={at("s3", b3.well) + 40} file="click-low.wav" volume={0.3} />
      {/* S4 */}
      {[b4.puj, b4.others, b4.pad].map((x, i) => <Sfx key={`b${i}`} at={at("s4", x - 6)} file="fill.wav" volume={i === 2 ? 0.24 : 0.14} />)}
      <Sfx at={at("s4", b4.faster) - 10} file="click-low.wav" volume={0.3} />
      {/* S5 */}
      {Array.from({ length: 5 }).map((_, i) => <Sfx key={`r${i}`} at={at("s5", [b5.fc + 4, b5.fc + 10, b5.forties - 4, b5.tens - 2, b5.tens + 8][i])} file="click-low.wav" volume={0.16} />)}
      {Array.from({ length: 5 }).map((_, i) => <Sfx key={`s${i}`} at={at("s5", [b5.tests + 2, b5.n71 - 4, b5.none - 10, b5.none + 6, b5.none + 14][i])} file="flip.wav" volume={0.2} />)}
      {/* S6 */}
      <Sfx at={at("s6", b6.three) - 6} file="stamp.wav" volume={0.5} />
      <Sfx at={at("s6", b6.three) - 4} file="cheer-soft.wav" volume={0.2} />
      <Sfx at={at("s6", b6.brand) + 4} file="slide.wav" volume={0.16} />
      <Sfx at={scene(fps, "s6").from + scene(fps, "s6").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.6} />
    </>
  );
};

export const PadikkalNo3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  // lighting dips through the crash and lifts for the renaissance
  const lights = interpolate(frame, [0, S("s3"), S("s4"), S("s6")], [1.05, 1.0, 1.1, 1.15], CLAMP);
  const lockup = S("s6") + s6Beats(fps).brand;
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
