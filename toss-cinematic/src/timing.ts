// All timing comes from src/timeline.json (scripts/gen-voice.py): every scene is lead-in + narration + hold,
// and every spoken word carries the time the recogniser heard it. Everything here is in SECONDS on the film clock,
// so the 3D director, the 2D overlays and the audio script all read the same numbers.
import timeline from "./timeline.json";

export const FPS = 30;
export type SceneId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8" | "s9";

type Word = { w: string; s: number; e: number; c: number };
type Segment = { s: number; e: number; chunks: string[]; words: Word[] };
type Scene = { id: string; start: number; duration: number; vo: { at: number; duration: number; segments: Segment[] } };

const scenes = timeline.scenes as Scene[];
const get = (id: SceneId) => {
  const s = scenes.find((x) => x.id === id);
  if (!s) throw new Error(`no scene ${id}`);
  return s;
};

export const TOTAL = timeline.total;
export const totalFrames = Math.round(TOTAL * FPS);
export const allScenes = scenes.map((s) => s.id as SceneId);

// Scene window on the film clock.
export const S = (id: SceneId) => get(id).start;
export const E = (id: SceneId) => get(id).start + get(id).duration;
export const sceneFrames = (id: SceneId) => {
  const from = Math.round(S(id) * FPS);
  return { from, duration: Math.round(E(id) * FPS) - from };
};
export const sceneAt = (t: number): SceneId => {
  for (const s of scenes) if (t < s.start + s.duration) return s.id as SceneId;
  return "s9";
};

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

// Film time at which the nth spoken word starting with `prefix` begins (e.g. W("s2", "54.3")).
export const W = (id: SceneId, prefix: string, nth = 0): number => {
  const sc = get(id);
  const hits = sc.vo.segments.flatMap((g) => g.words).filter((w) => norm(w.w).startsWith(norm(prefix)));
  const w = hits[nth];
  if (!w) throw new Error(`no word "${prefix}" #${nth} in ${id}`);
  return sc.vo.at + w.s;
};

// Sentence i of a scene: film-time start and end.
export const sentence = (id: SceneId, i: number) => {
  const sc = get(id);
  const g = sc.vo.segments[i];
  return { from: sc.vo.at + g.s, to: sc.vo.at + g.e };
};

export const voCues = scenes.map((s) => ({ id: s.id as SceneId, from: s.vo.at, duration: s.vo.duration }));

// Subtitle chunks with per-word times, absolute.
export type Caption = { from: number; to: number; words: { w: string; s: number }[] };
export const captions: Caption[] = scenes.flatMap((sc) =>
  sc.vo.segments.flatMap((g) =>
    g.chunks.map((_, ci) => {
      const ws = g.words.filter((w) => w.c === ci);
      const next = g.words.find((w) => w.c === ci + 1);
      return {
        from: sc.vo.at + ws[0].s,
        to: sc.vo.at + (next ? next.s : g.e + 0.28),
        words: ws.map((w) => ({ w: w.w, s: sc.vo.at + w.s })),
      };
    }),
  ),
);
