// All timing comes from src/timeline.json (scripts/gen-voice.py).
import timeline from "./timeline.json";
import type { Who } from "./theme";

export type SceneId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8";
type Seg = { who: string; caption: string; s: number; e: number };
type Scene = { id: string; start: number; duration: number; vo: { at: number; duration: number; words: { w: string; s: number; e: number; who: string }[]; segments: Seg[]; env: number[] } };
const T = timeline as { total: number; scenes: Scene[] };

const get = (id: SceneId) => {
  const s = T.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`no scene ${id}`);
  return s;
};
export const totalFrames = (fps: number) => Math.round(T.total * fps);
export const scene = (fps: number, id: SceneId) => {
  const s = get(id);
  const from = Math.round(s.start * fps);
  return { from, duration: Math.round((s.start + s.duration) * fps) - from };
};
export const voStart = (fps: number, id: SceneId) => Math.round((get(id).vo.at - get(id).start) * fps);
// Line i of a scene, frames relative to the scene start.
export const line = (fps: number, id: SceneId, i: number) => {
  const g = get(id).vo.segments[i];
  return { from: voStart(fps, id) + Math.round(g.s * fps), to: voStart(fps, id) + Math.round(g.e * fps), who: g.who as Who, caption: g.caption };
};
export const voCues = (fps: number) => T.scenes.map((s) => ({ id: s.id as SceneId, from: Math.round(s.vo.at * fps), duration: Math.round(s.vo.duration * fps) }));
export const captions = (fps: number) =>
  T.scenes.flatMap((s) => s.vo.segments.map((g) => ({ from: Math.round((s.vo.at + g.s) * fps), to: Math.round((s.vo.at + g.e) * fps), text: g.caption, who: g.who as Who })));
export const captionWords = (fps: number) => T.scenes.flatMap((s) => s.vo.words.map((w) => ({ from: Math.round((s.vo.at + w.s) * fps), w: w.w })));

// Mouth openness (0..1) for a speaker at an absolute frame: loudness while that speaker's line plays.
export const mouth = (fps: number, absFrame: number, who: Who) => {
  const t = absFrame / fps;
  for (const s of T.scenes) {
    if (t < s.vo.at || t > s.vo.at + s.vo.duration) continue;
    const rel = t - s.vo.at;
    const seg = s.vo.segments.find((g) => rel >= g.s && rel <= g.e);
    if (!seg || seg.who !== who) return 0;
    return s.vo.env[Math.min(s.vo.env.length - 1, Math.floor(rel * fps))] ?? 0;
  }
  return 0;
};
export const speaking = (fps: number, absFrame: number) => {
  const t = absFrame / fps;
  for (const s of T.scenes) {
    const rel = t - s.vo.at;
    const seg = s.vo.segments.find((g) => rel >= g.s && rel <= g.e + 0.2);
    if (seg) return seg.who as Who;
  }
  return null;
};
