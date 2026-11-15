import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Blackout, Grain, Vignette } from "./components/Board";
import { CLAMP } from "./components/Motion";
import { Lettering } from "./components/Panel";
import { SubtitleStrip } from "./components/Pieces";
import { S1, s1Beats, S2, s2Beats, S3, s3Beats } from "./scenes/Act1";
import { S4, s4Beats } from "./scenes/Act2";
import { FinalOver, overBeats, S7, s7Beats } from "./scenes/Act3";
import { theme } from "./theme";
import { scene, SceneId, sentence, voCues } from "./timing";

// Brand rail across the top from frame one (no logo sting) until the final lockup.
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
      <Lettering size={22} font="body" weight={500} color={theme.colors.creamDim} spacing="0.16em">
        IND v PAK · U19 ASIA CUP FINAL
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
  const music = useDuck(0.72, 0.16);
  const crowd = useDuck(0.34, 0.14);
  const under = useDuck(1, 0.12); // effects that ring on under a line drop out of its way
  const s1 = s1Beats(fps, scene(fps, "s1").duration);
  const s2 = s2Beats(fps);
  const s3 = s3Beats(fps);
  const s4 = s4Beats(fps);
  const ov = overBeats(fps);
  const s7 = s7Beats(fps);
  const s1Ticks = Array.from({ length: Math.floor(s1.rewind / 15) }, (_, i) => i * 15);
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      <Audio src={staticFile("audio/crowd-ambience.wav")} volume={crowd} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {/* S1: rattling counters, a deep click on each number, the clock ticking louder, silence, rewind */}
      <Sfx at={0} file="rattle-hook.wav" volume={0.38} />
      {[s1.runs, s1.ball, s1.wicket].map((t, i) => (
        <Sfx key={`s1c${i}`} at={t} file="clunk.wav" volume={0.85} />
      ))}
      {s1Ticks.map((t, i) => (
        <Sfx key={`s1t${i}`} at={t} file={i % 2 ? "tock.wav" : "tick.wav"} volume={0.12 + 0.3 * (t / s1.rewind)} />
      ))}
      <Sfx at={at("s1", s1.rewind)} file="rewind.wav" volume={0.55} />
      {/* S2 */}
      <Sfx at={at("s2", 10)} file="rattle-count.wav" volume={0.32} />
      <Sfx at={at("s2", s2.total)} file="clunk.wav" volume={0.6} />
      <Sfx at={at("s2", sentence(fps, "s2", 1).from - 10)} file="slide.wav" volume={0.14} />
      <Sfx at={at("s2", sentence(fps, "s2", 1).to + 2)} file="boom.wav" volume={0.55} />
      {[0, 1, 2].map((i) => (
        <Sfx key={`t${i}`} at={at("s2", sentence(fps, "s2", 1).to + 2 + i * 3)} file="flip.wav" volume={0.4} />
      ))}
      {/* S3: eight wicket clicks, a deep impact at 252/8 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={`w${i}`} at={at("s3", s3.collapse + 4 + i * 3)} file="click-low.wav" volume={0.42} />
      ))}
      <Sfx at={at("s3", s3.at252 + 2)} file="boom.wav" volume={0.5} />
      <Sfx at={at("s3", s3.need - 8)} file="slide.wav" volume={0.18} />
      {/* S4 */}
      <Sfx at={at("s4", s4.ulva - 10)} file="slide.wav" volume={0.18} />
      <Sfx at={at("s4", s4.fell + 2)} file="click-low.wav" volume={0.55} />
      {/* S5–S6: every delivery clicks; the freeze; bat on ball; the roar */}
      {ov.rows.slice(1, 7).map((t, i) => (
        // the first two flips wait until the narrator has finished "dot!" / "a wide…"
        <Sfx key={`d${i}`} at={at("s5", i < 2 ? sentence(fps, "s5", 2 + i).to + 2 : t + 6)} file="flip.wav" volume={0.42 + i * 0.04} />
      ))}
      <Sfx at={at("s5", ov.freeze)} file="clunk.wav" volume={0.7} />
      <Sfx at={at("s5", ov.rows[7] - 2)} file="bat.wav" volume={0.9} />
      <Sfx at={at("s5", ov.rows[7])} file="cheer-roar.wav" volume={(f) => 0.5 * under(at("s5", ov.rows[7]) + f)} />
      <Sfx at={at("s6", sentence(fps, "s6", 2).to + 2)} file="cheer-big.wav" volume={0.3} />
      <Sfx at={at("s5", ov.rows[7] + 3)} file="clunk.wav" volume={0.7} />
      {/* S7 */}
      <Sfx at={at("s7", s7.heroes - 4)} file="flip.wav" volume={0.35} />
      <Sfx at={at("s7", s7.brand)} file="final-click.wav" volume={0.75} />
    </>
  );
};

export const LastBallMiracle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s5 = scene(fps, "s5");
  const s6 = scene(fps, "s6");
  const ov = overBeats(fps);
  const freezeAbs = s5.from + ov.freeze;
  const fourAbs = s5.from + ov.rows[7];
  // the stadium lights dim for the final-ball freeze and flare on the four
  const lights = interpolate(frame, [freezeAbs - 6, freezeAbs + 10, fourAbs - 2, fourAbs + 6], [1, 0.55, 0.55, 1.3], { easing: theme.ease.inOut, ...CLAMP });
  const SCENES: [SceneId, React.FC][] = [
    ["s1", S1],
    ["s2", S2],
    ["s3", S3],
    ["s4", S4],
  ];
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
      <Sequence from={s5.from} durationInFrames={s5.duration + s6.duration} name="final over">
        <FinalOver />
      </Sequence>
      <Sequence from={scene(fps, "s7").from} durationInFrames={scene(fps, "s7").duration} name="s7">
        <S7 />
      </Sequence>
      <Masthead />
      <SubtitleStrip hidden={["s1", "s7"]} />
      <Grain />
      <Vignette />
      <Blackout flickerEnd={0} fadeLength={Math.round(fps * 0.45)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
