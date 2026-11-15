import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, S2, s1Stops } from "./scenes/Act1";
import { centuryBeats, S3, S4, s4Beats } from "./scenes/Act2";
import { S5, s5Beats, S6, s6Beats, S7, s7Beats } from "./scenes/Act3";
import { theme } from "./theme";
import { allScenes, scene, SceneId, sentence, voCues, wordAt } from "./timing";

const SCENES: Partial<Record<SceneId, React.FC>> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

// Brand rail across the top of the board from the very first frame (no logo sting), until the final lockup.
const Masthead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = scene(fps, "s7").from + s7Beats(fps).brand;
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
      <Lettering size={22} font="body" weight={500} color={theme.colors.creamDim} spacing="0.18em">
        VIRAT KOHLI · IPL 2016
      </Lettering>
    </div>
  );
};

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
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
  const music = useDuck(0.7, 0.3);
  const crowd = useDuck(0.3, 0.11);
  const s1 = s1Stops(fps);
  const cents = centuryBeats(fps);
  const s4 = s4Beats(fps);
  const s5 = s5Beats(fps);
  const s6 = s6Beats(fps);
  const s7 = s7Beats(fps);
  const countFrom = wordAt(fps, "s2", "973", 0.86);
  const countTo = wordAt(fps, "s2", "runs", 2.54) + 4;
  const s2rows = [wordAt(fps, "s2", "16", 3.4), sentence(fps, "s2", 1).from, sentence(fps, "s2", 1).from + 12, sentence(fps, "s2", 2).from, sentence(fps, "s2", 3).from];
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      <Audio src={staticFile("audio/crowd-ambience.wav")} volume={crowd} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {/* S1: counters already rattling; a deep click as each number lands */}
      <Sfx at={0} file="rattle-hook.wav" volume={0.4} />
      <Sfx at={s1.stop27} file="clunk.wav" volume={0.8} />
      <Sfx at={s1.stop8} file="clunk.wav" volume={0.9} />
      <Sfx at={s1.stop8 + 2} file="slide.wav" volume={0.25} />
      {/* S2 */}
      <Sfx at={at("s2", -10)} file="slide.wav" volume={0.16} />
      <Sfx at={at("s2", countFrom)} file="rattle-count.wav" volume={0.42} />
      <Sfx at={at("s2", countTo + 7)} file="clunk.wav" volume={0.7} />
      {s2rows.map((r, i) => (
        <Sfx key={`r${i}`} at={at("s2", r)} file="flip.wav" volume={0.32} />
      ))}
      {/* S3: a panel, a flip and a crowd that grows with every hundred */}
      {cents.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={at("s3", c - 7)} file="slide.wav" volume={0.25} />
          <Sfx at={at("s3", c)} file="flip.wav" volume={0.45} />
          <Sfx at={at("s3", sentence(fps, "s3", i).to - 6)} file="cheer-short.wav" volume={0.1 + i * 0.04} />
        </React.Fragment>
      ))}
      <Sfx at={at("s3", cents[3] + 10)} file="relay.wav" volume={0.35} />
      {/* S4: the count climbs, the crowd rises on the hundred */}
      <Sfx at={at("s4", 0)} file="slide.wav" volume={0.3} />
      <Sfx at={at("s4", s4.century)} file="clunk.wav" volume={0.7} />
      <Sfx at={at("s4", s4.century + 4)} file="cheer-big.wav" volume={0.24} />
      <Sfx at={at("s4", wordAt(fps, "s4", "hand", 2.14) + 8)} file="click-low.wav" volume={0.35} />
      <Sfx at={at("s4", s4.unreal)} file="flip.wav" volume={0.35} />
      {/* S5: the duck — a low mechanical click in the silence */}
      <Sfx at={at("s5", 0)} file="slide.wav" volume={0.3} />
      <Sfx at={at("s5", s5.q1 - 6)} file="slide.wav" volume={0.3} />
      <Sfx at={at("s5", sentence(fps, "s5", 1).to + 2)} file="click-low.wav" volume={0.85} />
      {/* S6 */}
      <Sfx at={at("s6", -10)} file="slide.wav" volume={0.16} />
      {[0, 1, 2].map((i) => (
        <Sfx key={`s${i}`} at={at("s6", s6.srh + i * 2)} file="flip.wav" volume={0.35} />
      ))}
      {[0, 1, 2].map((i) => (
        <Sfx key={`b${i}`} at={at("s6", s6.rcb + i * 2)} file="flip.wav" volume={0.35} />
      ))}
      <Sfx at={at("s6", s6.lost)} file="click-low.wav" volume={0.6} />
      {/* S7: 973 once more, the board turns, one last click */}
      {[0, 1, 2].map((i) => (
        <Sfx key={`n${i}`} at={at("s7", s7.big + i * 3)} file="flip.wav" volume={0.45} />
      ))}
      <Sfx at={at("s7", s7.rows - 18)} file="slide.wav" volume={0.2} />
      <Sfx at={at("s7", s7.m1)} file="flip.wav" volume={0.5} />
      <Sfx at={at("s7", s7.brand)} file="final-click.wav" volume={0.75} />
    </>
  );
};

export const Kohli973: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s7 = scene(fps, "s7");
  const lights = interpolate(frame, [s7.from + s7Beats(fps).m2, s7.from + s7Beats(fps).brand + 10], [1, 0.55], { easing: theme.ease.inOut, ...CLAMP });
  return (
    <AbsoluteFill style={{ background: theme.colors.board, fontFamily: theme.fonts.body }}>
      <Backdrop lights={lights} />
      {allScenes.map((id) => {
        const s = scene(fps, id);
        const Comp = SCENES[id];
        if (!Comp) return null;
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      <Masthead />
      <SubtitleStrip hidden={["s1", "s7"]} />
      <Grain />
      <Vignette />
      <Blackout flickerEnd={0} fadeLength={Math.round(fps * 0.4)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
