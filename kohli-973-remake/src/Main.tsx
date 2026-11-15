import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats, S8, s8Beats } from "./scenes/Story";
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
];

const Masthead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = scene(fps, "s8").from + s8Beats(fps).brand;
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
        KOHLI · IPL 2016 · 973
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
  const end = (id: SceneId, i: number) => at(id, sentence(fps, id, i).to);
  const music = useDuck(0.75, 0.17);
  const crowd = useDuck(0.34, 0.11);
  const under = useDuck(1, 0.12);
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
      {/* S1 — the counter spins and lands; two plates flip */}
      <Sfx at={2} file="rattle-a.wav" volume={(f) => 0.3 * under(2 + f)} />
      <Sfx at={b1.land973 + 2} file="clunk.wav" volume={0.45} />
      <Sfx at={end("s1", 0) + 4} file="flip.wav" volume={0.32} />
      <Sfx at={end("s1", 1) + 4} file="flip.wav" volume={0.32} />
      <Sfx at={b1.title + 4} file="slide.wav" volume={0.16} />
      {/* S2 — the count to 973, stat flips, the leaderboard */}
      <Sfx at={at("s2", b2.runsFrom)} file="rattle-count.wav" volume={(f) => 0.26 * under(at("s2", b2.runsFrom) + f)} />
      <Sfx at={at("s2", b2.runsTo + 2)} file="clunk.wav" volume={0.42} />
      {[b2.avg, b2.tons, b2.fifties].map((t, i) => (
        <Sfx key={`s2${i}`} at={end("s2", i + 2) + 4} file="flip.wav" volume={0.28} />
      ))}
      <Sfx at={at("s2", b2.board)} file="slide.wav" volume={0.15} />
      <Sfx at={end("s2", 5) + 4} file="cheer-short.wav" volume={0.22} />
      {/* S3 — each century card lands with a flip and a restrained crowd */}
      {b3.cards.map((t, i) => (
        <Sfx key={`s3w${i}`} at={at("s3", t - 4)} file="whoosh.wav" volume={0.2} />
      ))}
      {b3.runs.map((t, i) => (
        <Sfx key={`s3f${i}`} at={at("s3", t + 2)} file="flip.wav" volume={0.3} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`s3c${i}`} at={end("s3", i) + 2} file="cheer-short.wav" volume={0.12 + i * 0.03} />
      ))}
      {b3.cards.map((t, i) => (
        <Sfx key={`s3s${i}`} at={at("s3", t + 32)} file="clunk.wav" volume={0.25} />
      ))}
      {/* S4 — the climb to 113, the stitches */}
      <Sfx at={at("s4", b4.countFrom)} file="rattle-climb.wav" volume={(f) => 0.24 * under(at("s4", b4.countFrom) + f)} />
      <Sfx at={at("s4", b4.land + 2)} file="clunk.wav" volume={0.55} />
      <Sfx at={at("s4", b4.land + 2)} file="cheer-big.wav" volume={(f) => 0.42 * under(at("s4", b4.land + 2) + f)} />
      {Array.from({ length: 9 }).map((_, i) => (
        <Sfx key={`s4s${i}`} at={at("s4", b4.stitches + i * 5)} file="tick.wav" volume={0.14} />
      ))}
      <Sfx at={end("s4", 3) + 6} file="boom.wav" volume={0.32} />
      {/* S5 */}
      {Array.from({ length: 16 }).map((_, i) => (
        <Sfx key={`s5${i}`} at={at("s5", 6 + i * 3)} file="click-low.wav" volume={0.12} />
      ))}
      <Sfx at={at("s5", b5.playoffs)} file="cheer-soft.wav" volume={0.2} />
      {/* S6 — the duck */}
      <Sfx at={at("s6", b6.duck + 4)} file="clunk.wav" volume={0.5} />
      <Sfx at={at("s6", b6.duck + 6)} file="relay.wav" volume={0.3} />
      <Sfx at={at("s6", b6.won)} file="cheer-short.wav" volume={0.16} />
      <Sfx at={at("s6", b6.final)} file="flip.wav" volume={0.3} />
      {/* S7 — the final */}
      <Sfx at={end("s7", 0) + 4} file="flip.wav" volume={0.28} />
      <Sfx at={at("s7", b7.srh + 10)} file="slide.wav" volume={0.12} />
      <Sfx at={at("s7", b7.rcb + 6)} file="slide.wav" volume={0.12} />
      <Sfx at={end("s7", 3) + 6} file="boom.wav" volume={0.3} />
      {/* S8 */}
      <Sfx at={at("s8", b8.runs)} file="rattle-count.wav" volume={(f) => 0.2 * under(at("s8", b8.runs) + f)} />
      <Sfx at={end("s8", 1) + 4} file="flip.wav" volume={0.26} />
      <Sfx at={end("s8", 2) + 4} file="flip.wav" volume={0.26} />
      <Sfx at={at("s8", b8.linesAt)} file="slide.wav" volume={0.14} />
      <Sfx at={scene(fps, "s8").from + scene(fps, "s8").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.7} />
    </>
  );
};

export const Season973: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const land113 = S("s4") + s4Beats(fps).land;
  const duck = S("s6") + s6Beats(fps).duck;
  // lighting story: bright season, a flare on 113, dimmed for the duck and the final, warm at the end
  const lights = interpolate(
    frame,
    [0, S("s4"), land113 - 4, land113 + 4, land113 + 40, S("s6"), duck, duck + 20, S("s7"), S("s8"), S("s8") + 60],
    [1.1, 1.05, 1.05, 1.6, 1.15, 1.05, 1.0, 0.6, 0.65, 0.75, 1.05],
    CLAMP,
  );
  const lockup = S("s8") + s8Beats(fps).linesAt;
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
