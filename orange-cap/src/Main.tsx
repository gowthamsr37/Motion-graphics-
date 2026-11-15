import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Backdrop, FadeOut, Grade, Grain, Vignette } from "./components/Layers";
import { CLAMP } from "./components/Motion";
import { players } from "./data";
import { Hook, hookBeats } from "./scenes/Hook";
import { Outro, outroBeats } from "./scenes/Outro";
import { SeasonsSection } from "./scenes/Seasons";
import { calloutDelay, Tally, tallyLandings } from "./scenes/Tally";
import { theme } from "./theme";
import { seasonSlots, sections, voCues } from "./timing";

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`audio/${file}`)} volume={volume} />
  </Sequence>
);

const MUSIC = { open: 0.5, ducked: 0.2 };

// Music dips under the voice (eased, never a hard step).
const useMusicVolume = () => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps / 6);
  return (f: number) => {
    let duck = 0;
    for (const c of cues) {
      const a = c.from - 2;
      const b = c.from + c.duration + 4;
      if (f < a - ramp || f > b + ramp) continue;
      duck = Math.max(duck, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP }));
    }
    return interpolate(duck, [0, 1], [MUSIC.open, MUSIC.ducked]);
  };
};

const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = sections(fps);
  const slots = seasonSlots(fps);
  const hook = hookBeats(fps);
  const outro = outroBeats(fps);
  const musicVolume = useMusicVolume();
  return (
    <>
      <Audio src={staticFile("audio/track.wav")} volume={musicVolume} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {/* hook */}
      <Sfx at={s.hook.from} file="impact.wav" volume={0.7} />
      <Sfx at={s.hook.from + hook.fifteen - 1} file="clack.wav" volume={0.55} />
      {players.map((_, i) => (
        <Sfx key={`l${i}`} at={s.hook.from + hook.names + i * 2 + 1} file="tick.wav" volume={0.18} />
      ))}
      {/* seasons: the number plates clack over on every cut */}
      {slots.map((slot, i) => (
        <React.Fragment key={slot.year}>
          <Sfx at={s.seasons.from + slot.from - 4} file="whoosh.wav" volume={0.18} />
          {i > 0 && <Sfx at={s.seasons.from + slot.from} file="clack.wav" volume={0.32} />}
        </React.Fragment>
      ))}
      {/* tally */}
      <Sfx at={s.tally.from} file="impact.wav" volume={0.55} />
      {tallyLandings().map((d, i) => (
        <Sfx key={`t${i}`} at={s.tally.from + d - 2} file="tick.wav" volume={0.26} />
      ))}
      <Sfx at={s.tally.from + calloutDelay(fps) - 2} file="shimmer.wav" volume={0.25} />
      {/* outro */}
      <Sfx at={s.outro.from} file="impact.wav" volume={0.65} />
      <Sfx at={s.outro.from + outro.year + 1} file="clack.wav" volume={0.5} />
      <Sfx at={s.outro.from + outro.year + 4} file="shimmer.wav" volume={0.4} />
    </>
  );
};

export const OrangeCapReel: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = sections(fps);
  return (
    <AbsoluteFill style={{ background: theme.colors.board, fontFamily: theme.fonts.body }}>
      {/* 1. board + glow */}
      <Backdrop />
      {/* 2–3. assets + graphics/type */}
      <Sequence from={s.hook.from} durationInFrames={s.hook.duration} name="Hook">
        <Hook />
      </Sequence>
      <Sequence from={s.seasons.from} durationInFrames={s.seasons.duration} name="Seasons">
        <SeasonsSection />
      </Sequence>
      <Sequence from={s.tally.from} durationInFrames={s.tally.duration} name="Tally">
        <Tally />
      </Sequence>
      <Sequence from={s.outro.from} durationInFrames={s.outro.duration} name="Outro">
        <Outro />
      </Sequence>
      {/* 4. grade, 5. grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />
      <FadeOut length={Math.round(fps * 0.4)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
