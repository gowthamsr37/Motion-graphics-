import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S10, s10Beats, S11, s11Beats, S12, s12Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats, S8, s8Beats, S9, s9Beats } from "./scenes/Story";
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
  ["s10", S10],
  ["s11", S11],
  ["s12", S12],
];

const Masthead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = scene(fps, "s12").from + s12Beats(fps).brand;
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
        KL RAHUL · TEST CAREER
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
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps), b9 = s9Beats(fps), b10 = s10Beats(fps), b11 = s11Beats(fps), b12 = s12Beats(fps);
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
      <Sfx at={at("s1", b1.runs) - 14} file="rattle-count.wav" volume={0.2} />
      <Sfx at={at("s1", b1.runs) + 10} file="bat.wav" volume={0.4} />
      <Sfx at={at("s1", b1.runs) + 12} file="cheer-soft.wav" volume={0.22} />
      {[0, 1, 2, 3].map((i) => <Sfx key={`s${i}`} at={at("s1", b1.sena + 10 + i * Math.max(5, Math.round((b1.countries - b1.sena) / 4)))} file="click-low.wav" volume={0.3} />)}
      <Sfx at={at("s1", b1.countries) + 6} file="stamp.wav" volume={0.5} />
      {/* S2 */}
      <Sfx at={at("s2", b2.tests)} file="rattle-count.wav" volume={0.12} />
      <Sfx at={at("s2", b2.gold) + 6} file="fill.wav" volume={0.16} />
      {[b2.rise, b2.crash, b2.again].map((t, i) => <Sfx key={`r${i}`} at={at("s2", t) - 4} file="flip.wav" volume={0.3} />)}
      {/* S3 */}
      <Sfx at={at("s3", b3.debut) + 8} file="buzz.wav" volume={0.14} />
      <Sfx at={at("s3", b3.sydney) + 4} file="bat.wav" volume={0.35} />
      {Array.from({ length: 7 }).map((_, i) => <Sfx key={`l${i}`} at={at("s3", b3.seven + 8 + i * 5)} file="click-low.wav" volume={0.22} />)}
      <Sfx at={at("s3", b3.n199) - 2} file="crowd-groan.wav" volume={0.22} />
      {/* S4 */}
      <Sfx at={at("s4", b4.cliff) + 4} file="whoosh.wav" volume={0.22} />
      <Sfx at={at("s4", b4.avg23) - 6} file="buzz.wav" volume={0.16} />
      <Sfx at={at("s4", b4.n17) - 6} file="buzz.wav" volume={0.16} />
      <Sfx at={at("s4", b4.dropped)} file="stamp.wav" volume={0.55} />
      <Sfx at={at("s4", b4.dropped)} file="boom.wav" volume={0.3} />
      {/* S5 */}
      {[b5.lords, b5.cent, b5.six].map((t, i) => <Sfx key={`c${i}`} at={at("s5", t) - 2} file="bat.wav" volume={0.32} />)}
      <Sfx at={at("s5", b5.n27) - 4} file="fill.wav" volume={0.14} />
      <Sfx at={at("s5", b5.n39) - 4} file="fill.wav" volume={0.18} />
      {/* S6 */}
      <Sfx at={at("s6", b6.n55) - 20} file="rattle-count.wav" volume={0.18} />
      <Sfx at={at("s6", b6.n55) + 6} file="cheer-big.wav" volume={0.22} />
      {/* S7 — what changed */}
      {[b7.n57 - 10, b7.n57 - 4, b7.n50 - 8, b7.n50 - 2].map((x, i) => <Sfx key={`sr${i}`} at={at("s7", x)} file="fill.wav" volume={0.1} />)}
      {[b7.longer + 6, b7.n41 - 4, b7.n41 + 8, b7.n112 - 4].map((x, i) => <Sfx key={`bp${i}`} at={at("s7", x)} file="fill.wav" volume={i === 3 ? 0.22 : 0.12} />)}
      <Sfx at={at("s7", b7.n112) + 10} file="stamp.wav" volume={0.35} />
      {/* S8 — first 20 balls */}
      <Sfx at={at("s8", b8.until)} file="rattle-count.wav" volume={0.14} />
      <Sfx at={at("s8", b8.balls) - 4} file="buzz.wav" volume={0.16} />
      <Sfx at={at("s8", b8.once) - 4} file="click-low.wav" volume={0.34} />
      {/* S9 — new ball */}
      {[0, 1, 2, 3].map((i) => <Sfx key={`nb${i}`} at={at("s9", [b9.first, b9.n25 - 14, b9.n25 - 6, b9.n58 - 6][i])} file="fill.wav" volume={i === 3 ? 0.22 : 0.12} />)}
      <Sfx at={at("s9", b9.n58)} file="bat.wav" volume={0.35} />
      {/* S10 — paradox */}
      <Sfx at={at("s10", b10.home) - 4} file="flip.wav" volume={0.28} />
      <Sfx at={at("s10", b10.away) - 4} file="flip.wav" volume={0.28} />
      {Array.from({ length: 13 }).map((_, i) => <Sfx key={`h${i}`} at={at("s10", b10.yet + 4 + (i < 3 ? i * 4 : 14 + (i - 3) * 3))} file="click-low.wav" volume={0.13} />)}
      <Sfx at={at("s10", b10.h3) - 2} file="fill.wav" volume={0.14} />
      <Sfx at={at("s10", b10.a10) - 2} file="fill.wav" volume={0.2} />
      {/* S11 — first innings */}
      <Sfx at={at("s11", b11.n43) - 6} file="flip.wav" volume={0.3} />
      {Array.from({ length: 11 }).map((_, i) => <Sfx key={`f${i}`} at={at("s11", b11.n11 - 2 + i * 3)} file="click-low.wav" volume={0.12} />)}
      <Sfx at={at("s11", b11.n29) - 6} file="flip.wav" volume={0.3} />
      {/* S12 */}
      {Array.from({ length: 5 }).map((_, i) => <Sfx key={`v${i}`} at={at("s12", b12.runs + i * 3)} file="flip.wav" volume={0.22} />)}
      <Sfx at={at("s12", b12.brand) + 4} file="slide.wav" volume={0.16} />
      <Sfx at={scene(fps, "s12").from + scene(fps, "s12").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.6} />
    </>
  );
};

export const RahulTests: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  // lighting dips through the crash and lifts for the renaissance
  const lights = interpolate(frame, [0, S("s4"), S("s4") + 40, S("s5"), S("s6"), S("s6") + 60, S("s7"), S("s12")], [1.05, 1.05, 0.7, 0.9, 1.0, 1.2, 1.05, 1.1], CLAMP);
  const lockup = S("s12") + s12Beats(fps).brand;
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
