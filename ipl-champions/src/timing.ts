// Everything is cut to the music: 120 BPM, 4/4. One bar = one season.
// Keep BPM and SECTION_BARS in sync with scripts/gen-audio.mjs.
export const BPM = 120;
export const SECTION_BARS = { intro: 2, seasons: 19, tally: 4, outro: 2 } as const;

export const framesPerBeat = (fps: number) => (fps * 60) / BPM;
export const framesPerBar = (fps: number) => framesPerBeat(fps) * 4;

export type Section = { from: number; duration: number };

export const sections = (fps: number) => {
  const bar = framesPerBar(fps);
  let cursor = 0;
  const take = (bars: number): Section => {
    const s = { from: cursor, duration: bars * bar };
    cursor += s.duration;
    return s;
  };
  const intro = take(SECTION_BARS.intro);
  const seasons = take(SECTION_BARS.seasons);
  const tally = take(SECTION_BARS.tally);
  const outro = take(SECTION_BARS.outro);
  return { intro, seasons, tally, outro, total: cursor };
};

// Exits are fast: a third of a second.
export const exitFrames = (fps: number) => Math.round(fps / 3);
