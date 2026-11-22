export type Format = "pile" | "squiggle" | "iceberg" | "compound" | "valley" | "bamboo" | "domino";

export type Post = {
  id: string; // e.g. "001"
  format: Format;
  topic: string;
  title: string; // headline at the top
  music: number; // 0..5
  accent: number; // index into ACCENTS
  end: [string, string]; // closing card; wrap a phrase in *stars* to highlight it
  pile?: { unit: string; count: number; winWord: string };
  squiggle?: { goal: string; setbacks: string[] };
  iceberg?: { see: string; hidden: string[] };
  compound?: { habit: string; perDay: number; unit: string; unitOne?: string };
  valley?: { quit: string; win: string };
  bamboo?: { years: string[]; win: string };
  domino?: { steps: string[] };
};

export type FormatModule = {
  duration: (p: Post) => number;
  cover: (p: Post) => number;
  Comp: React.FC<{ p: Post; accent: string }>;
};

// deterministic per-post random
export const rng = (key: string) => {
  let s = 0;
  for (const c of key) s = (Math.imul(s, 31) + c.charCodeAt(0)) | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
