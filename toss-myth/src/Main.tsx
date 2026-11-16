import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S10, s10Beats, S2, s2Beats, S3, s3Beats, S4, s4Beats, S5, s5Beats, S6, s6Beats, S7, s7Beats, S8, s8Beats, S9, s9Beats } from "./scenes/Story";
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
];

const Masthead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = scene(fps, "s10").from + s10Beats(fps).brand;
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
        MYTH BUSTERS · #01
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
  const music = useDuck(0.7, 0.17);
  const crowd = useDuck(0.2, 0.07);
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps), b9 = s9Beats(fps), b10 = s10Beats(fps);
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
      {/* S1 — the toss */}
      <Sfx at={at("s1", b1.toss)} file="coin-flick.wav" volume={0.5} />
      <Sfx at={at("s1", b1.toss) + 6} file="whoosh.wav" volume={0.14} />
      <Sfx at={at("s1", b1.land)} file="coin-land.wav" volume={0.5} />
      <Sfx at={at("s1", b1.captains) + 2} file="click-low.wav" volume={0.32} />
      <Sfx at={at("s1", b1.title) - 2} file="slide.wav" volume={0.16} />
      {/* S2 — the evidence */}
      <Sfx at={at("s2", b2.count) - 2} file="rattle-count.wav" volume={0.2} />
      <Sfx at={at("s2", b2.count) + 34} file="rattle-count.wav" volume={0.14} />
      {[0, 1, 2, 3].map((i) => <Sfx key={`s2${i}`} at={at("s2", b2.mens + i * Math.round((b2.format - b2.mens) / 4))} file="click-low.wav" volume={0.22} />)}
      {/* S3 — what luck looks like */}
      <Sfx at={at("s3", b3.flip)} file="coin-flick.wav" volume={0.3} />
      <Sfx at={at("s3", b3.flip) + 4} file="flips-run.wav" volume={0.16} />
      <Sfx at={at("s3", b3.band)} file="fill.wav" volume={0.18} />
      <Sfx at={at("s3", b3.zone)} file="click-low.wav" volume={0.3} />
      {/* S4 — the results */}
      <Sfx at={at("s4", b4.n) - 2} file="rattle-count.wav" volume={0.18} />
      <Sfx at={at("s4", b4.won) + 4} file="rattle-count.wav" volume={0.18} />
      <Sfx at={at("s4", b4.fifty) + 6} file="coin-land.wav" volume={0.32} />
      <Sfx at={at("s4", b4.exactly)} file="stamp.wav" volume={0.5} />
      <Sfx at={at("s4", b4.t20v) + 6} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s4", b4.iplv) + 6} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s4", b4.except)} file="buzz.wav" volume={0.16} />
      {/* S5 — the toss World Cup */}
      {Array.from({ length: 13 }).map((_, i) => <Sfx key={`s5${i}`} at={at("s5", b5.dubai + i * Math.max(4, Math.round((b5.thirteen - b5.dubai) / 12)))} file="flip.wav" volume={0.18} />)}
      <Sfx at={at("s5", b5.twelve) + 2} file="click-low.wav" volume={0.3} />
      <Sfx at={at("s5", b5.dew)} file="dew.wav" volume={0.22} />
      <Sfx at={at("s5", b5.thirty) - 4} file="rattle-count.wav" volume={0.16} />
      <Sfx at={at("s5", b5.final) - 4} file="cheer-soft.wav" volume={0.16} />
      {/* S6 — what nobody remembers */}
      <Sfx at={scene(fps, "s6").from - 6} file="rewind.wav" volume={0.22} />
      {[b6.y22, b6.y24, b6.y26].map((t, i) => <Sfx key={`s6${i}`} at={at("s6", t) - 4} file="fill.wav" volume={0.16} />)}
      <Sfx at={at("s6", b6.v)} file="click-low.wav" volume={0.32} />
      {[b6.place, b6.season, b6.cond].map((t, i) => <Sfx key={`s6w${i}`} at={at("s6", t) - 6} file="flip.wav" volume={0.26} />)}
      {/* S7 — toss grounds */}
      <Sfx at={at("s7", b7.halves) - 4} file="slide.wav" volume={0.16} />
      {Array.from({ length: 8 }).map((_, i) => <Sfx key={`s7${i}`} at={at("s7", b7.first + i * 3)} file="click-low.wav" volume={0.1} />)}
      <Sfx at={at("s7", b7.second) - 4} file="whoosh.wav" volume={0.16} />
      <Sfx at={at("s7", b7.b)} file="buzz.wav" volume={0.18} />
      <Sfx at={at("s7", b7.small)} file="stamp.wav" volume={0.5} />
      {/* S8 — Tests */}
      <Sfx at={at("s8", b8.v) + 6} file="coin-land.wav" volume={0.3} />
      <Sfx at={at("s8", b8.bat)} file="fill.wav" volume={0.18} />
      <Sfx at={at("s8", b8.bowl)} file="fill.wav" volume={0.14} />
      <Sfx at={at("s8", b8.over)} file="cracks.wav" volume={0.3} />
      {/* S9 — IPL */}
      <Sfx at={at("s9", b9.bowl)} file="fill.wav" volume={0.18} />
      <Sfx at={at("s9", b9.bat)} file="fill.wav" volume={0.14} />
      <Sfx at={at("s9", b9.decision) + 6} file="clunk.wav" volume={0.4} />
      {/* S10 — the verdict */}
      <Sfx at={at("s10", b10.v)} file="click-low.wav" volume={0.32} />
      <Sfx at={at("s10", b10.extra)} file="fill.wav" volume={0.18} />
      <Sfx at={at("s10", b10.myth)} file="boom.wav" volume={0.42} />
      <Sfx at={at("s10", b10.myth)} file="stamp.wav" volume={0.6} />
      {[b10.players, b10.conditions, b10.decisions].map((t, i) => <Sfx key={`s10${i}`} at={at("s10", t) - 4} file="flip.wav" volume={0.28} />)}
      <Sfx at={at("s10", b10.brand) + 4} file="slide.wav" volume={0.16} />
      <Sfx at={scene(fps, "s10").from + scene(fps, "s10").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.7} />
    </>
  );
};

export const TossMyth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  // lighting: flares when a key number lands
  const flare = (t: number, k = 0.3) => interpolate(frame, [t - 2, t + 4, t + 30], [0, k, 0], CLAMP);
  const lights = 1.05 + flare(S("s4") + s4Beats(fps).exactly) + flare(S("s5") + s5Beats(fps).thirty, 0.2) + flare(S("s10") + s10Beats(fps).myth, 0.4);
  const lockup = S("s10") + s10Beats(fps).brand;
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
