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
  const end = scene(fps, "s9").from + s9Beats(fps).thanks;
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
        IPL 2008–2026
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
  const music = useDuck(0.75, 0.2);
  const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps), b9 = s9Beats(fps);
  const S = (id: SceneId) => scene(fps, id).from;
  // crowd: hushed at the start, rising through the final years, swelling at the tribute
  const crowdBase = useDuck(1, 0.45);
  const crowd = (f: number) =>
    crowdBase(f) *
    interpolate(f, [0, S("s5"), S("s7"), S("s7") + b7.crowd, S("s8"), S("s8") + b8.end, S("s9"), S("s9") + b9.thanks, S("s9") + b9.thanks + 60], [0.04, 0.1, 0.14, 0.34, 0.2, 0.06, 0.08, 0.24, 0.12], CLAMP);
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
      <Sfx at={at("s1", 2)} file="clunk.wav" volume={0.35} />
      {Array.from({ length: 8 }).map((_, i) => <Sfx key={`n${i}`} at={at("s1", b1.name + i * 2)} file="flip.wav" volume={0.2} />)}
      {Array.from({ length: 9 }).map((_, i) => <Sfx key={`y${i}`} at={at("s1", b1.retired + 6 + i * 2)} file="flip.wav" volume={0.14} />)}
      {/* S2 — the auction */}
      {[b2.sign + 10, b2.sign + Math.round((b2.million - b2.sign) * 0.55), b2.million].map((t, i) => <Sfx key={`g${i}`} at={at("s2", t)} file="gavel.wav" volume={0.45} />)}
      <Sfx at={at("s2", b2.million) + 6} file="stamp.wav" volume={0.4} />
      <Sfx at={at("s2", b2.csk) - 4} file="slide.wav" volume={0.16} />
      {/* S3 — the captain */}
      {[b3.m, b3.w, b3.f, b3.t].map((t, i) => <Sfx key={`c${i}`} at={at("s3", t)} file="flip.wav" volume={0.3} />)}
      {Array.from({ length: 5 }).map((_, i) => <Sfx key={`t${i}`} at={at("s3", b3.t + 4 + i * 5)} file="chime.wav" volume={0.18} />)}
      {/* S4 — the dynasty */}
      {[b4.y10, b4.y11, b4.y18, b4.y21, b4.y23].map((t, i) => <Sfx key={`d${i}`} at={at("s4", t)} file="chime.wav" volume={0.28} />)}
      <Sfx at={at("s4", b4.fifth)} file="stamp.wav" volume={0.5} />
      <Sfx at={at("s4", b4.fifth)} file="cheer-soft.wav" volume={0.22} />
      {/* S5 — the batter */}
      {[b5.batter, b5.runs, b5.avg, b5.sr, b5.fifties].map((t, i) => <Sfx key={`b${i}`} at={at("s5", t)} file="flip.wav" volume={0.26} />)}
      <Sfx at={at("s5", b5.runs)} file="rattle-count.wav" volume={0.14} />
      <Sfx at={at("s5", b5.sixes)} file="rattle-count.wav" volume={0.18} />
      <Sfx at={at("s5", b5.sixWord) - 3} file="bat.wav" volume={0.55} />
      <Sfx at={at("s5", b5.sixWord) - 1} file="whoosh.wav" volume={0.3} />
      <Sfx at={at("s5", b5.sixWord) + 6} file="cheer-big.wav" volume={0.3} />
      {/* S6 — behind the stumps */}
      <Sfx at={at("s6", b6.d)} file="rattle-count.wav" volume={0.16} />
      <Sfx at={at("s6", b6.c) + 2} file="catch.wav" volume={0.5} />
      <Sfx at={at("s6", b6.st) + 4} file="stumps.wav" volume={0.5} />
      <Sfx at={at("s6", b6.rec)} file="stamp.wav" volume={0.5} />
      {/* S7 — the final years */}
      <Sfx at={at("s7", b7.sr) - 16} file="rattle-count.wav" volume={0.14} />
      <Sfx at={at("s7", b7.crowd)} file="chant.wav" volume={0.32} />
      {/* S8 — the final chapter */}
      {[2, b8.y25, b8.y26, b8.mentor - 8].map((t, i) => <Sfx key={`f${i}`} at={at("s8", t)} file="click-low.wav" volume={0.28} />)}
      <Sfx at={at("s8", b8.end) + 12} file="boom.wav" volume={0.3} />
      {/* S9 — the tribute */}
      <Sfx at={at("s9", b9.thanks) - 2} file="chant.wav" volume={0.26} />
      <Sfx at={scene(fps, "s9").from + scene(fps, "s9").duration - Math.round(fps * 0.9)} file="final-click.wav" volume={0.5} />
    </>
  );
};

export const DhoniTribute: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => scene(fps, id).from;
  // lighting: dark open, warm through the dynasty, a dim empty ground near the end, warm again for the tribute
  const lights = interpolate(frame, [0, S("s1") + 40, S("s3"), S("s5"), S("s8"), S("s8") + s8Beats(fps).end, S("s9")], [0.25, 0.75, 1.1, 1.05, 0.95, 0.4, 0.8], CLAMP);
  const lockup = S("s9") + s9Beats(fps).thanks - 4;
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
