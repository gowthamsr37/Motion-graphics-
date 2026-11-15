import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, S2, S3 } from "./scenes/Act1";
import { S4, S5, S6 } from "./scenes/Act2";
import { S7, S8, S9, s9Beats } from "./scenes/Act3";
import { theme } from "./theme";
import { allScenes, scene, SceneId, sentence, voCues, voStart, wordAt } from "./timing";

const SCENES: Record<SceneId, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9 };

// Thin masthead rail across the top of the board, scenes 2–8.
const Masthead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = scene(fps, "s2").from;
  const b = scene(fps, "s9").from;
  const on = interpolate(frame, [a, a + 12, b - 6, b + 6], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP });
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
        transform: `translateY(${(1 - on) * -16}px)`,
      }}
    >
      <Lettering size={22} font="body" spacing="0.24em">
        BEYOND THE SCOREBOARD
      </Lettering>
      <Lettering size={22} font="body" weight={500} color={theme.colors.creamDim} spacing="0.18em">
        VIRAT KOHLI · 2019–2023
      </Lettering>
    </div>
  );
};

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`audio/${file}`)} volume={volume} />
  </Sequence>
);

// Music and crowd dip smoothly under the narration.
const useDuck = (open: number, ducked: number) => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps / 4);
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
  const music = useDuck(0.75, 0.3);
  const crowd = useDuck(0.3, 0.11);
  const s9 = s9Beats(fps);
  const years = [wordAt(fps, "s3", "68", 1.6), wordAt(fps, "s3", "19", 3.6), wordAt(fps, "s3", "28", 6.6), wordAt(fps, "s3", "26", 9.6)];
  const hundred = wordAt(fps, "s6", "122", 3.6);
  const hit = sentence(fps, "s6", 1).to + 2;
  const spinStart = wordAt(fps, "s6", "drought", 8.0) - 6;
  const spinEnd = wordAt(fps, "s6", "over", 9.2) + 4;
  const runs = wordAt(fps, "s7", "186", 6.2);
  const until = wordAt(fps, "s7", "until", 3.0);
  const s4 = scene(fps, "s4");
  const ticks = Array.from({ length: Math.floor(s4.duration / fps) }, (_, i) => s4.from + i * fps);
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      <Audio src={staticFile("audio/crowd-ambience.wav")} volume={crowd} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {/* S1: clunk on, digits rattle, everything stops dead on 1021 */}
      <Sfx at={0} file="clunk.wav" volume={0.7} />
      <Sfx at={2} file="rattle-hook.wav" volume={0.45} />
      <Sfx at={at("s1", voStart(fps, "s1"))} file="clunk.wav" volume={0.85} />
      <Sfx at={at("s1", 3)} file="slide.wav" volume={0.25} />
      <Sfx at={at("s1", 9)} file="slide.wav" volume={0.25} />
      <Sfx at={at("s1", wordAt(fps, "s1", "without", 3.6) - 6)} file="slide.wav" volume={0.3} />
      {/* S2 */}
      <Sfx at={at("s2", 0)} file="cheer-soft.wav" volume={0.32} />
      <Sfx at={at("s2", 2)} file="slide.wav" volume={0.35} />
      {[0, 1, 2].map((i) => (
        <Sfx key={`f2${i}`} at={at("s2", wordAt(fps, "s2", "scored", 1.8) + i * 3)} file="flip.wav" volume={0.4} />
      ))}
      <Sfx at={at("s2", wordAt(fps, "s2", "scored", 1.8) + 10)} file="relay.wav" volume={0.3} />
      {/* S3: one low, precise click per year */}
      <Sfx at={at("s3", 0)} file="slide.wav" volume={0.35} />
      <Sfx at={at("s3", 8)} file="slide.wav" volume={0.25} />
      {years.map((y, i) => (
        <React.Fragment key={`y${i}`}>
          <Sfx at={at("s3", y)} file="click-low.wav" volume={0.7} />
          {[0, 1, 2, 3].map((d) => (
            <Sfx key={d} at={at("s3", y + 2 + d * 2)} file="flip.wav" volume={0.18} />
          ))}
        </React.Fragment>
      ))}
      <Sfx at={at("s3", Math.min(years[3] + Math.round(fps * 0.8), scene(fps, "s3").duration - Math.round(fps * 2)))} file="slide.wav" volume={0.3} />
      {/* S4: the clock */}
      {ticks.map((t, i) => (
        <Sfx key={`t${i}`} at={t} file={i % 2 ? "tock.wav" : "tick.wav"} volume={0.32} />
      ))}
      <Sfx at={at("s4", 6)} file="slide.wav" volume={0.3} />
      <Sfx at={at("s4", wordAt(fps, "s4", "batter", 4.2) - 6)} file="slide.wav" volume={0.3} />
      {/* S5: sharp mechanical change */}
      <Sfx at={at("s5", 0)} file="boom.wav" volume={0.5} />
      <Sfx at={at("s5", 0)} file="clunk.wav" volume={0.6} />
      {[sentence(fps, "s5", 0).from + 10, sentence(fps, "s5", 1).from, wordAt(fps, "s5", "t20", 6.0)].map((r, i) => (
        <Sfx key={`v${i}`} at={at("s5", r)} file="click-low.wav" volume={0.55} />
      ))}
      <Sfx at={at("s5", wordAt(fps, "s5", "producing", 7.0) - 18)} file="slide.wav" volume={0.3} />
      {/* S6: the breakthrough */}
      <Sfx at={at("s6", 0)} file="slide.wav" volume={0.3} />
      {[0, 1, 2].map((i) => (
        <Sfx key={`f6${i}`} at={at("s6", hundred + i * 3)} file="flip.wav" volume={0.45} />
      ))}
      <Sfx at={at("s6", hit)} file="cheer-big.wav" volume={0.27} />
      <Sfx at={at("s6", spinStart - 24)} file="slide.wav" volume={0.3} />
      <Sfx at={at("s6", spinStart)} file="rattle-spin.wav" volume={0.5} />
      <Sfx at={at("s6", spinEnd)} file="clunk.wav" volume={0.8} />
      {/* S7 */}
      <Sfx at={at("s7", 2)} file="slide.wav" volume={0.3} />
      <Sfx at={at("s7", until - 8)} file="slide.wav" volume={0.3} />
      {[0, 1, 2].map((i) => (
        <Sfx key={`f7${i}`} at={at("s7", runs + i * 3)} file="flip.wav" volume={0.45} />
      ))}
      <Sfx at={at("s7", runs + 8)} file="flip.wav" volume={0.4} />
      <Sfx at={at("s7", runs)} file="cheer-soft.wav" volume={0.3} />
      {/* S8 */}
      <Sfx at={at("s8", 0)} file="slide.wav" volume={0.3} />
      <Sfx at={at("s8", wordAt(fps, "s8", "55", 3.6))} file="click-low.wav" volume={0.55} />
      <Sfx at={at("s8", sentence(fps, "s8", 1).from - 6)} file="slide.wav" volume={0.3} />
      {/* S9: the board turns, the lights go down, one last click */}
      <Sfx at={at("s9", s9.m1 - 10)} file="slide.wav" volume={0.3} />
      <Sfx at={at("s9", s9.m2)} file="flip.wav" volume={0.5} />
      <Sfx at={at("s9", s9.m3)} file="flip.wav" volume={0.5} />
      <Sfx at={at("s9", s9.brand)} file="final-click.wav" volume={0.75} />
    </>
  );
};

export const SilentScoreboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s9 = scene(fps, "s9");
  const b = s9Beats(fps);
  const lights = interpolate(frame, [s9.from + b.m3, s9.from + b.brand], [1, 0.35], { easing: theme.ease.inOut, ...CLAMP });
  return (
    <AbsoluteFill style={{ background: theme.colors.board, fontFamily: theme.fonts.body }}>
      <Backdrop lights={lights} />
      {allScenes.map((id) => {
        const s = scene(fps, id);
        const Comp = SCENES[id];
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      <Masthead />
      <SubtitleStrip hidden={["s9"]} />
      <Grain />
      <Vignette />
      <Blackout flickerEnd={6} fadeLength={Math.round(fps * 0.6)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};

