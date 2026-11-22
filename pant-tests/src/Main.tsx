import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats, S8, s8Beats, S9, s9Beats } from "./scenes/Story";
import { theme } from "./theme";
import { scene, SceneId, voCues } from "./timing";

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
        RISHABH PANT · TEST CAREER
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
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps), b9 = s9Beats(fps);
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
      <Sfx at={at("s1", b1.runs) - 16} file="rattle-count.wav" volume={0.2} />
      <Sfx at={at("s1", b1.runs) + 8} file="bat.wav" volume={0.4} />
      <Sfx at={at("s1", b1.runs) + 10} file="cheer-soft.wav" volume={0.22} />
      {[0, 1, 2, 3].map((i) => <Sfx key={`s${i}`} at={at("s1", b1.sena + 10 + i * Math.max(5, Math.round((b1.countries - b1.sena) / 4)))} file="click-low.wav" volume={0.3} />)}
      <Sfx at={at("s1", b1.countries) + 4} file="stamp.wav" volume={0.45} />
      <Sfx at={at("s1", b1.stokes) - 6} file="slide.wav" volume={0.16} />
      {/* S2 */}
      <Sfx at={at("s2", b2.tests) + 4} file="rattle-count.wav" volume={0.12} />
      <Sfx at={at("s2", b2.line) - 4} file="fill.wav" volume={0.16} />
      {/* S3 */}
      <Sfx at={at("s3", b3.six)} file="bat.wav" volume={0.45} />
      <Sfx at={at("s3", b3.six) + 2} file="cheer-soft.wav" volume={0.16} />
      <Sfx at={at("s3", b3.oval)} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s3", b3.syd) - 4} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s3", b3.n89) - 4} file="cheer-big.wav" volume={0.26} />
      {/* S4 */}
      <Sfx at={at("s4", b4.n18) - 4} file="buzz.wav" volume={0.16} />
      <Sfx at={at("s4", b4.car)} file="boom.wav" volume={0.4} />
      <Sfx at={at("s4", b4.days) - 4} file="rattle-count.wav" volume={0.18} />
      <Sfx at={at("s4", b4.chennai) - 6} file="bat.wav" volume={0.35} />
      <Sfx at={at("s4", b4.chennai) - 4} file="cheer-soft.wav" volume={0.2} />
      {/* S5 */}
      {[0, 1, 2].map((i) => <Sfx key={`l1${i}`} at={at("s5", b5.each - 10 + i * 3)} file="flip.wav" volume={0.24} />)}
      {[0, 1, 2].map((i) => <Sfx key={`l2${i}`} at={at("s5", b5.each + i * 3)} file="flip.wav" volume={0.24} />)}
      <Sfx at={at("s5", b5.flower) - 4} file="stamp.wav" volume={0.45} />
      <Sfx at={at("s5", b5.foot) - 4} file="buzz.wav" volume={0.14} />
      <Sfx at={at("s5", b5.n54) - 4} file="cheer-soft.wav" volume={0.18} />
      {/* S6 */}
      <Sfx at={at("s6", b6.pace) - 6} file="flip.wav" volume={0.28} />
      <Sfx at={at("s6", b6.n53) - 6} file="flip.wav" volume={0.28} />
      <Sfx at={at("s6", b6.sixes)} file="rattle-count.wav" volume={0.16} />
      <Sfx at={at("s6", b6.lyon) - 4} file="slide.wav" volume={0.16} />
      <Sfx at={at("s6", b6.six6) - 6} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s6", b6.n258) - 4} file="click-low.wav" volume={0.3} />
      {/* S7 */}
      {Array.from({ length: 8 }).map((_, i) => <Sfx key={`k${i}`} at={at("s7", b7.cmp + 10 + i * 4)} file="fill.wav" volume={i === 0 ? 0.2 : 0.08} />)}
      <Sfx at={at("s7", b7.most) - 4} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s7", b7.faster) - 4} file="click-low.wav" volume={0.3} />
      {/* S8 */}
      {Array.from({ length: 7 }).map((_, i) => <Sfx key={`n${i}`} at={at("s8", b8.seven + 6 + i * 5)} file="flip.wav" volume={0.22} />)}
      <Sfx at={at("s8", b8.nine) - 4} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s8", b8.half) - 8} file="buzz.wav" volume={0.16} />
      <Sfx at={at("s8", b8.n105) - 4} file="fill.wav" volume={0.16} />
      <Sfx at={at("s8", b8.n73) - 6} file="fill.wav" volume={0.14} />
      <Sfx at={at("s8", b8.n73) + 6} file="crowd-groan.wav" volume={0.18} />
      {/* S9 */}
      {Array.from({ length: 9 }).map((_, i) => <Sfx key={`v${i}`} at={at("s9", b9.nine + 4 + i * 3)} file="click-low.wav" volume={0.16} />)}
      <Sfx at={at("s9", b9.brand) + 4} file="slide.wav" volume={0.16} />
      <Sfx at={scene(fps, "s9").from + scene(fps, "s9").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.6} />
    </>
  );
};

export const PantTests: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  // lighting dips through the crash and lifts for the renaissance
  const lights = interpolate(frame, [0, S("s4"), S("s4") + 60, S("s4") + 200, S("s5"), S("s8"), S("s9")], [1.05, 1.05, 0.65, 0.65, 1.1, 0.95, 1.1], CLAMP);
  const lockup = S("s9") + s9Beats(fps).brand;
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
