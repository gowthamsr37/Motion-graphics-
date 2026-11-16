// Every frame number in the Reel comes from src/timeline.json (written by scripts/gen-voice.py).
import timeline from "./timeline.json";

export type SceneId = "hook" | "proof" | "answer" | "formats" | "dubai" | "after" | "tests" | "ipl" | "verdict";
export const SCENE_IDS: SceneId[] = ["hook", "proof", "answer", "formats", "dubai", "after", "tests", "ipl", "verdict"];

type Tok = { t: string; line: number; s: number; e: number };
type Scene = { id: string; start: number; duration: number; vo: { at: number; duration: number }; lines: { show: string; s: number; e: number }[]; tokens: Tok[] };

const get = (id: SceneId): Scene => {
  const s = (timeline.scenes as Scene[]).find((x) => x.id === id);
  if (!s) throw new Error(`no scene ${id}`);
  return s;
};

export const BPM = timeline.bpm;
export const totalFrames = (fps: number) => Math.round(timeline.total * fps);

export const span = (fps: number, id: SceneId) => {
  const s = get(id);
  const from = Math.round(s.start * fps);
  return { from, duration: Math.round((s.start + s.duration) * fps) - from };
};

// frame (relative to the scene) where the narration starts
export const voFrom = (fps: number, id: SceneId) => {
  const s = get(id);
  return Math.round((s.vo.at - s.start) * fps);
};

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9.%'-]/g, "");

// frame (relative to the scene) where the nth caption word starting with `prefix` is spoken
export const tok = (fps: number, id: SceneId, prefix: string, nth = 0) => {
  const hits = get(id).tokens.filter((t) => clean(t.t).startsWith(clean(prefix)));
  const h = hits[nth];
  if (!h) throw new Error(`token "${prefix}" #${nth} not found in ${id}`);
  return voFrom(fps, id) + Math.round(h.s * fps);
};

export const lineSpan = (fps: number, id: SceneId, i: number) => {
  const l = get(id).lines[i];
  return { from: voFrom(fps, id) + Math.round(l.s * fps), to: voFrom(fps, id) + Math.round(l.e * fps) };
};

export const voCues = (fps: number) =>
  SCENE_IDS.map((id) => {
    const s = get(id);
    return { id, from: Math.round(s.vo.at * fps), duration: Math.round(s.vo.duration * fps) };
  });

// Lines whose words are already the scene's big headline: no caption for them.
const HIDDEN: Partial<Record<SceneId, number[]>> = { hook: [0, 1], verdict: [1] };

export type CapWord = { text: string; from: number; to: number };
export type CapPage = { from: number; to: number; words: CapWord[] };

// TikTok-style caption pages: ≤3 words (≤18 characters) each, timed to the spoken words.
export const captionPages = (fps: number): CapPage[] => {
  const pages: CapPage[] = [];
  for (const id of SCENE_IDS) {
    const s = get(id);
    const base = s.vo.at;
    s.lines.forEach((line, li) => {
      if (HIDDEN[id]?.includes(li)) return;
      const toks = s.tokens.filter((t) => t.line === li);
      const groups: Tok[][] = [];
      let cur: Tok[] = [];
      for (const t of toks) {
        const len = cur.reduce((a, x) => a + x.t.length + 1, 0) + t.t.length;
        if (cur.length && (cur.length >= 3 || len > 20)) {
          groups.push(cur);
          cur = [];
        }
        cur.push(t);
        // always break at the end of a sentence; break at a comma only if the page has 2+ words
        if (/[.?!]$/.test(t.t) || (/[,:]$/.test(t.t) && cur.length >= 2)) {
          groups.push(cur);
          cur = [];
        }
      }
      if (cur.length) groups.push(cur);
      // fold a lone last word back into the page before it when it fits
      const last = groups[groups.length - 1];
      const prev = groups[groups.length - 2];
      if (last?.length === 1 && prev && prev.length <= 3 && [...prev, ...last].map((x) => x.t).join(" ").length <= 22) {
        groups.splice(groups.length - 2, 2, [...prev, ...last]);
      }
      const lineEnd = Math.round((base + line.e) * fps) + 6;
      groups.forEach((g, gi) => {
        const from = Math.round((base + g[0].s) * fps) - 1;
        const next = groups[gi + 1];
        const to = next ? Math.round((base + next[0].s) * fps) - 1 : lineEnd;
        pages.push({
          from,
          to,
          words: g.map((t) => ({
            text: t.t.replace(/[.,:]+$/, "").toUpperCase(),
            from: Math.round((base + t.s) * fps),
            to: Math.round((base + t.e) * fps),
          })),
        });
      });
    });
  }
  return pages;
};
