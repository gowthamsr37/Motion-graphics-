// All timing comes from src/timeline.json (scripts/gen-voice.py): every scene is lead-in + narration + hold.
// Visual beats are keyed to the spoken words, so re-voicing re-times the whole film automatically.
import { useVideoConfig } from "remotion";
import timeline from "./timeline.json";

export type SceneId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8";
export const SCENE_IDS: SceneId[] = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

const get = (id: SceneId) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`no scene ${id}`);
  return s;
};

export const totalFrames = (fps: number) => Math.round(timeline.total * fps);

export const sceneRange = (fps: number, id: SceneId) => {
  const s = get(id);
  const from = Math.round(s.start * fps);
  return { from, duration: Math.round((s.start + s.duration) * fps) - from };
};

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

export const sceneTiming = (fps: number, id: SceneId) => {
  const s = get(id);
  const vo = Math.round((s.vo.at - s.start) * fps);
  const toks = s.vo.captions.flatMap((c) => c.words);
  const find = (token: string, nth: number) => {
    const hits = toks.filter((w) => norm(w.w) === norm(token));
    const w = hits[nth];
    if (!w) throw new Error(`${id}: no spoken token "${token}" (#${nth})`);
    return w;
  };
  return {
    duration: sceneRange(fps, id).duration,
    vo,
    voEnd: vo + Math.round(s.vo.duration * fps),
    // sentence i, frames relative to the scene start
    sent: (i: number) => ({ from: vo + Math.round(s.vo.segments[i].s * fps), to: vo + Math.round(s.vo.segments[i].e * fps) }),
    // frame (relative to scene start) at which a spoken word begins / ends
    cue: (token: string, nth = 0) => vo + Math.round(find(token, nth).s * fps),
    cueEnd: (token: string, nth = 0) => vo + Math.round(find(token, nth).e * fps),
    // same, but only searching inside sentence i (for words spoken more than once in a scene)
    cueS: (i: number, token: string) => {
      const g = s.vo.segments[i];
      const w = toks.find((x) => norm(x.w) === norm(token) && x.s >= g.s - 0.3 && x.s <= g.e + 0.3);
      if (!w) throw new Error(`${id}: no spoken token "${token}" in sentence ${i}`);
      return vo + Math.round(w.s * fps);
    },
  };
};

export const useScene = (id: SceneId) => {
  const { fps } = useVideoConfig();
  return { fps, ...sceneTiming(fps, id) };
};

// Absolute subtitle pages.
export const captionPages = (fps: number) =>
  timeline.scenes.flatMap((s) =>
    s.vo.captions.map((c) => ({
      scene: s.id as SceneId,
      from: Math.round((s.vo.at + c.s) * fps),
      to: Math.round((s.vo.at + c.e) * fps),
      words: c.words.map((w) => ({ w: w.w, from: Math.round((s.vo.at + w.s) * fps), to: Math.round((s.vo.at + w.e) * fps) })),
    })),
  );

export const voCues = (fps: number) =>
  timeline.scenes.map((s) => ({ id: s.id as SceneId, from: Math.round(s.vo.at * fps), duration: Math.round(s.vo.duration * fps) }));
