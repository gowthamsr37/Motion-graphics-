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
  const end = scene(fps, "s9").from + s9Beats(fps).final;
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
        ABHISHEK v RAHUL · T20Is
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
  const crowd = useDuck(0.3, 0.1);
  const under = useDuck(1, 0.12);
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
      {/* S1 — two counters rattle and land; the balls flip in; the 473 gap is drawn */}
      <Sfx at={at("s1", sentence(fps, "s1", 1).from)} file="rattle-a.wav" volume={(f) => 0.28 * under(at("s1", sentence(fps, "s1", 1).from) + f)} />
      <Sfx at={b1.aStop + 2} file="clunk.wav" volume={0.42} />
      <Sfx at={at("s1", sentence(fps, "s1", 2).from)} file="rattle-a.wav" volume={(f) => 0.28 * under(at("s1", sentence(fps, "s1", 2).from) + f)} />
      <Sfx at={b1.rStop + 2} file="clunk.wav" volume={0.42} />
      <Sfx at={end("s1", 4) + 2} file="flip.wav" volume={0.32} />
      <Sfx at={b1.bracket} file="boom.wav" volume={0.45} />
      {/* S2 — gauges sweep, the 100-ball race */}
      <Sfx at={at("s2", b2.race)} file="rattle-count.wav" volume={(f) => 0.22 * under(at("s2", b2.race) + f)} />
      <Sfx at={end("s2", 2) + 4} file="clunk.wav" volume={0.4} />
      {/* S3 — the six strip and boundary rings */}
      {[0, 1, 2, 3].map((k) => (
        <Sfx key={`s3a${k}`} at={at("s3", b3.a + 6 + Math.round(((k + 1) * 7.26 * 40) / 33))} file="bat.wav" volume={0.22} />
      ))}
      {[0, 1].map((k) => (
        <Sfx key={`s3r${k}`} at={at("s3", b3.r + Math.round(((k + 1) * 16.44 * 40) / 33))} file="bat.wav" volume={0.2} />
      ))}
      <Sfx at={end("s3", 1) + 2} file="cheer-short.wav" volume={0.14} />
      {[0, 6, 12, 18].map((d, i) => (
        <Sfx key={`s3f${i}`} at={at("s3", b3.rows + d)} file="flip.wav" volume={0.22} />
      ))}
      {/* S4 — the phase chart */}
      <Sfx at={at("s4", b4.a)} file="whoosh.wav" volume={0.18} />
      <Sfx at={at("s4", b4.r)} file="whoosh.wav" volume={0.16} />
      <Sfx at={end("s4", 1) + 2} file="flip.wav" volume={0.3} />
      <Sfx at={end("s4", 2) + 4} file="flip.wav" volume={0.3} />
      {/* S5 — the powerplay overs light up */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={`s5o${i}`} at={at("s5", b5.overs + i * 5)} file="click-low.wav" volume={0.18} />
      ))}
      <Sfx at={end("s5", 1) + 4} file="cheer-short.wav" volume={0.16} />
      {/* S6 — the twist */}
      <Sfx at={at("s6", b6.twist)} file="slide.wav" volume={0.14} />
      <Sfx at={end("s6", 3) + 4} file="flip.wav" volume={0.28} />
      {/* S7 — the price: a low hit before the risk reveal */}
      <Sfx at={at("s7", b7.cost) - 6} file="boom.wav" volume={0.32} />
      <Sfx at={end("s7", 1) + 2} file="relay.wav" volume={0.24} />
      {/* S8 — the simulation: balls tick, the total turns over */}
      {Array.from({ length: 18 }).map((_, i) => (
        <Sfx key={`s8b${i}`} at={at("s8", b8.simFrom) + Math.round(((b8.simTo - b8.simFrom) * (i + 1)) / 18)} file="tick.wav" volume={0.1} />
      ))}
      <Sfx at={end("s8", 2) + 2} file="flip.wav" volume={0.3} />
      <Sfx at={at("s8", b8.team + 30)} file="clunk.wav" volume={0.36} />
      <Sfx at={end("s8", 3) + 4} file="relay.wav" volume={0.22} />
      {/* S9 */}
      <Sfx at={at("s9", b9.final)} file="slide.wav" volume={0.14} />
      <Sfx at={scene(fps, "s9").from + scene(fps, "s9").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.7} />
    </>
  );
};

export const SameRuns: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  const risk = S("s7");
  // lighting: bright for the scoring story, dimmed for the wicket-risk turn, back up for the verdict
  const lights = interpolate(frame, [0, risk - 20, risk + 10, S("s8") - 10, S("s8") + 20, S("s9"), S("s9") + 40], [1.1, 1.1, 0.65, 0.65, 1.0, 1.0, 1.05], CLAMP);
  const lockup = S("s9") + s9Beats(fps).final;
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
