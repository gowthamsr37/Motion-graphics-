// All timing comes from src/timeline.json (scripts/gen-voice.py): every scene is lead-in + narration + hold.
// Word timings are exact (taken from the TTS model's own duration predictor).
import timeline from "./timeline.json";

export type SceneId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6";

const get = (id: SceneId) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`no scene ${id}`);
  return s;
};

export const totalFrames = (fps: number) => Math.round(timeline.total * fps);

// Absolute frame range of a scene.
export const scene = (fps: number, id: SceneId) => {
  const s = get(id);
  const from = Math.round(s.start * fps);
  return { from, duration: Math.round((s.start + s.duration) * fps) - from };
};

// Frame (relative to scene start) where narration begins.
export const voStart = (fps: number, id: SceneId) => {
  const s = get(id);
  return Math.round((s.vo.at - s.start) * fps);
};

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

// Frame (relative to scene start) at which the nth spoken word starting with `prefix` begins.
export const wordAt = (fps: number, id: SceneId, prefix: string, nth = 0) => {
  const s = get(id);
  // exact matches win ("No" must not hit "noise"); otherwise fall back to a prefix match
  const exact = s.vo.words.filter((w) => norm(w.w) === norm(prefix));
  const hits = exact.length ? exact : s.vo.words.filter((w) => norm(w.w).startsWith(norm(prefix)));
  const w = hits[nth];
  if (!w) throw new Error(`no word "${prefix}"#${nth} in ${id}`);
  return voStart(fps, id) + Math.round(w.s * fps);
};

// Sentence i of a scene, relative frames.
export const sentence = (fps: number, id: SceneId, i: number) => {
  const g = get(id).vo.segments[i];
  return { from: voStart(fps, id) + Math.round(g.s * fps), to: voStart(fps, id) + Math.round(g.e * fps) };
};

// Absolute word list for captions.
export const allWords = (fps: number) =>
  timeline.scenes.flatMap((s) =>
    s.vo.segments.map((g, gi) => ({
      scene: s.id as SceneId,
      seg: gi,
      words: s.vo.words
        .filter((w) => w.s >= g.s - 0.001 && w.s <= g.e + 0.001)
        .map((w) => ({ w: w.w, from: Math.round((s.vo.at + w.s) * fps), to: Math.round((s.vo.at + w.e) * fps) })),
      from: Math.round((s.vo.at + g.s) * fps),
      to: Math.round((s.vo.at + g.e) * fps),
    })),
  );

export const voCues = (fps: number) =>
  timeline.scenes.map((s) => ({ id: s.id as SceneId, from: Math.round(s.vo.at * fps), duration: Math.round(s.vo.duration * fps) }));
