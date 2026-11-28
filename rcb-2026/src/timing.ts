// All timing comes from src/timeline.json (scripts/gen-voice.py): every scene is lead-in + narration + hold.
import timeline from "./timeline.json";

// Scene ids come from scripts/voiceover.json ("s1", "s2", …).
export type SceneId = string;

const get = (id: SceneId) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`no scene ${id}`);
  return s;
};

export const totalFrames = (fps: number) => Math.round(timeline.total * fps);

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
export const wordAt = (fps: number, id: SceneId, prefix: string, fallbackSec: number, nth = 0) => {
  const s = get(id);
  const hits = s.vo.words.filter((w) => norm(w.w).startsWith(norm(prefix)));
  const w = hits[nth];
  return voStart(fps, id) + Math.round((w ? w.s : fallbackSec) * fps);
};

// Sentence i of a scene, relative frames.
export const sentence = (fps: number, id: SceneId, i: number) => {
  const g = get(id).vo.segments[i];
  return { from: voStart(fps, id) + Math.round(g.s * fps), to: voStart(fps, id) + Math.round(g.e * fps), caption: g.caption };
};

export const voEnd = (fps: number, id: SceneId) => voStart(fps, id) + Math.round(get(id).vo.duration * fps);

export const allScenes = timeline.scenes.map((s) => s.id as SceneId);

// Absolute captions for the subtitle strip.
export const captions = (fps: number) =>
  timeline.scenes.flatMap((s) =>
    s.vo.segments.map((g) => ({
      scene: s.id as SceneId,
      from: Math.round((s.vo.at + g.s) * fps),
      to: Math.round((s.vo.at + g.e) * fps),
      text: g.caption,
    })),
  );

export const voCues = (fps: number) =>
  timeline.scenes.map((s) => ({ id: s.id as SceneId, from: Math.round(s.vo.at * fps), duration: Math.round(s.vo.duration * fps) }));

// Every caption token with absolute frames, for the karaoke captions.
export const captionWords = (fps: number) =>
  timeline.scenes.flatMap((s) =>
    s.vo.segments.flatMap((g, gi) =>
      ((g as { words?: { t: string; s: number; e: number }[] }).words ?? []).map((w) => ({
        t: w.t,
        seg: `${s.id}-${gi}`,
        from: Math.round((s.vo.at + Math.max(w.s, g.s - 0.08)) * fps),
        to: Math.round((s.vo.at + Math.max(w.e, g.s)) * fps),
      })),
    ),
  );
