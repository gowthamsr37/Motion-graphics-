import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, s6Pass134, S7, s7Beats, S8, s8Beats } from "./scenes/Story";
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

// Brand rail across the top until the final lockup takes over.
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
      }}
    >
      <Lettering size={22} font="body" spacing="0.24em">
        BEYOND THE SCOREBOARD
      </Lettering>
      <Lettering size={22} font="body" weight={500} color={theme.colors.creamDim} spacing="0.16em">
        KOHLI · ENGLAND 2014 / 2018
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
  const music = useDuck(0.72, 0.16);
  const crowd = useDuck(0.3, 0.1);
  const under = useDuck(1, 0.12);
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps);
  const pass = s6Pass134(fps);
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
      {/* S1 — two counters rattle; each lands with a clunk just after its number is spoken */}
      <Sfx at={4} file="rattle-a.wav" volume={(f) => 0.3 * under(4 + f)} />
      <Sfx at={b1.stop149 + 2} file="clunk.wav" volume={0.45} />
      <Sfx at={b1.stop134 + 2} file="clunk.wav" volume={0.5} />
      <Sfx at={b1.stop134 + 18} file="slide.wav" volume={0.14} />
      {/* S2 — each stat flips in after its word */}
      {[b2.tests, b2.innings, b2.innings + 14, b2.avg, b2.ducks, b2.fifties, b2.highest].map((t, i) => (
        <Sfx key={`s2${i}`} at={at("s2", t + 8)} file="flip.wav" volume={0.32} />
      ))}
      <Sfx at={end("s2", 6) + 4} file="boom.wav" volume={0.4} />
      {/* S3 — bars rise ground by ground; a red relay for each duck */}
      {[b3.tb, b3.lords, b3.soton, b3.otr, b3.oval].map((t, i) => (
        <Sfx key={`s3${i}`} at={at("s3", t + 4)} file="click-low.wav" volume={0.3} />
      ))}
      <Sfx at={at("s3", b3.lords + 14)} file="relay.wav" volume={0.3} />
      <Sfx at={at("s3", b3.otr + 6)} file="relay.wav" volume={0.3} />
      {/* S4 — four wicket lamps, the nick */}
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`s4${i}`} at={at("s4", b4.four + 14 + i * 6)} file="click-low.wav" volume={0.36} />
      ))}
      <Sfx at={at("s4", b4.edge + 2)} file="nick.wav" volume={0.35} />
      <Sfx at={end("s4", 2) + 4} file="boom.wav" volume={0.35} />
      {/* S5 — the year turns over */}
      <Sfx at={at("s5", b5.flip + 2)} file="rattle-year.wav" volume={0.22} />
      <Sfx at={at("s5", b5.flip + 16)} file="clunk.wav" volume={0.45} />
      {b5.tags.map((t, i) => (
        <Sfx key={`s5${i}`} at={at("s5", t + 10)} file="click-low.wav" volume={0.25} />
      ))}
      {/* S6 — the climb past 134 and the landing on 149 */}
      <Sfx at={at("s6", b6.countFrom)} file="rattle-climb.wav" volume={(f) => 0.24 * under(at("s6", b6.countFrom) + f)} />
      <Sfx at={at("s6", pass)} file="relay.wav" volume={0.3} />
      <Sfx at={at("s6", b6.land + 3)} file="clunk.wav" volume={0.6} />
      <Sfx at={at("s6", b6.land + 3)} file="cheer-big.wav" volume={(f) => 0.5 * under(at("s6", b6.land + 3) + f)} />
      <Sfx at={at("s6", b6.diff + 14)} file="flip.wav" volume={0.32} />
      {/* S7 */}
      {[b7.runs, b7.avg, b7.tons, b7.tons + 10, b7.anderson].map((t, i) => (
        <Sfx key={`s7${i}`} at={at("s7", t + 8)} file="flip.wav" volume={0.28} />
      ))}
      <Sfx at={end("s7", 3) + 6} file="cheer-soft.wav" volume={0.18} />
      {/* S8 */}
      <Sfx at={at("s8", b8.series + 4)} file="slide.wav" volume={0.12} />
      {b8.lines.map((t, i) => (
        <Sfx key={`s8${i}`} at={at("s8", t + 12)} file="flip.wav" volume={0.24} />
      ))}
      <Sfx at={scene(fps, "s8").from + scene(fps, "s8").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.7} />
    </>
  );
};

export const EnglandNightmare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const land = S("s6") + s6Beats(fps).land;
  const flip = S("s5") + s5Beats(fps).flip;
  // story lighting: dim and flickering through 2014, warming at the 2018 flip, flaring on 149
  const flicker = frame >= S("s2") && frame < S("s5") ? 0.08 * Math.sin(frame * 1.7) * Math.sin(frame * 0.31) : 0;
  const lights = interpolate(frame, [0, S("s2"), S("s2") + 20, flip, flip + 40, land - 4, land + 4, land + 40, S("s8"), S("s8") + 60], [1, 1, 0.55, 0.55, 1.05, 1.05, 1.6, 1.15, 1.15, 0.9], CLAMP) + flicker;
  const cold = interpolate(frame, [0, S("s2"), S("s2") + 20, flip, flip + 40, S("s8"), S("s8") + 40], [0.12, 0.12, 0.3, 0.3, 0, 0, 0.08], CLAMP);
  const warm = interpolate(frame, [flip, flip + 50, S("s8"), S("s8") + 40], [0, 0.22, 0.22, 0.12], CLAMP);
  const lockup = S("s8") + s8Beats(fps).lines[0];
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
      <AbsoluteFill style={{ pointerEvents: "none", background: `rgba(30, 60, 85, ${cold})`, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 90% 60% at 50% 10%, rgba(242,169,59,${warm}) 0%, transparent 70%)`, mixBlendMode: "screen" }} />
      <Masthead />
      <SubtitleStrip hiddenAfter={lockup - 4} />
      <Grain />
      <Vignette />
      <Blackout flickerEnd={0} fadeLength={Math.round(fps * 0.7)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
