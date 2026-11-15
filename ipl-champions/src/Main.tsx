import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Backdrop, FadeOut, Grade, Grain, Vignette } from "./components/Layers";
import { seasons } from "./data";
import { Intro, INTRO_TITLE_DELAY } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { SeasonsSection } from "./scenes/Seasons";
import { CALLOUT_DELAY, Tally, tallyLandings } from "./scenes/Tally";
import { theme } from "./theme";
import { framesPerBar, sections } from "./timing";

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`audio/${file}`)} volume={volume} />
  </Sequence>
);

// SFX start 2–3 frames BEFORE the visual lands; that reads as in sync.
const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = sections(fps);
  const bar = framesPerBar(fps);
  const lead = 3;
  return (
    <>
      <Audio src={staticFile("audio/track.wav")} volume={0.78} />
      <Sfx at={s.intro.from} file="impact.wav" volume={0.75} />
      <Sfx at={s.intro.from + INTRO_TITLE_DELAY - lead} file="whoosh.wav" volume={0.35} />
      {seasons.map((_, i) => (
        <Sfx key={i} at={s.seasons.from + i * bar - lead} file="whoosh.wav" volume={0.42} />
      ))}
      <Sfx at={s.tally.from} file="impact.wav" volume={0.6} />
      {tallyLandings().map((d, i) => (
        <Sfx key={`t${i}`} at={s.tally.from + d - 2} file="tick.wav" volume={0.3} />
      ))}
      <Sfx at={s.tally.from + CALLOUT_DELAY - lead} file="shimmer.wav" volume={0.3} />
      <Sfx at={s.outro.from} file="impact.wav" volume={0.75} />
      <Sfx at={s.outro.from + 4} file="shimmer.wav" volume={0.45} />
    </>
  );
};

export const IPLChampions: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = sections(fps);
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      {/* 1. background mesh */}
      <Backdrop />
      {/* 2–3. assets + graphics/type, per section */}
      <Sequence from={s.intro.from} durationInFrames={s.intro.duration} name="Intro">
        <Intro />
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
