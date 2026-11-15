// All timing comes from src/timeline.json, written by scripts/gen-voice.py:
// each scene is as long as its voiceover line, rounded up to whole beats of the 120 BPM track.
import timeline from "./timeline.json";

export const BPM = timeline.bpm;
export const framesPerBeat = (fps: number) => (fps * 60) / BPM;
const beatsToFrames = (beats: number, fps: number) => Math.round(beats * framesPerBeat(fps));

export type Section = { from: number; duration: number };

export const sections = (fps: number) => {
  const s = timeline.sections;
  const mk = (x: { start: number; beats: number }): Section => ({
    from: beatsToFrames(x.start, fps),
    duration: beatsToFrames(x.beats, fps),
  });
  return {
    hook: mk(s.hook),
    seasons: mk(s.seasons),
    tally: mk(s.tally),
    outro: mk(s.outro),
    total: beatsToFrames(timeline.totalBeats, fps),
  };
};

// Season slots, relative to the start of the seasons section.
export const seasonSlots = (fps: number) => {
  const base = timeline.sections.seasons.start;
  return timeline.seasons.map((s) => ({
    year: s.year,
    from: beatsToFrames(s.start - base, fps),
    duration: beatsToFrames(s.beats, fps),
  }));
};

export type Cue = { id: string; from: number; duration: number; words: { w: string; s: number; e: number }[] };

export const voCues = (fps: number): Cue[] =>
  timeline.vo.map((c) => ({
    id: c.id,
    from: Math.round(c.at * fps),
    duration: Math.round(c.duration * fps),
    words: c.words,
  }));

// Absolute frame at which a spoken word starts (first word beginning with `prefix`), or a fallback.
export const wordFrame = (fps: number, cueId: string, prefix: string, fallbackSec: number) => {
  const cue = voCues(fps).find((c) => c.id === cueId);
  if (!cue) return Math.round(fallbackSec * fps);
  const w = cue.words.find((x) => x.w.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(prefix.toLowerCase()));
  return cue.from + Math.round((w ? w.s : fallbackSec) * fps);
};

// Exits are fast: a third of a second.
export const exitFrames = (fps: number) => Math.round(fps / 3);
