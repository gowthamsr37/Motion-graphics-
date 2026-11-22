// Hand-drawn doodle icons for the notebook look. Each icon is drawn in a 100×100 box, placed at centre (x, y) with size s,
// and draws itself on from frame `at` (parts staggered so it looks like someone sketching it).
import React from "react";
import { Sketch, SketchOpts } from "./NB";
import { nb } from "../theme";

type IconProps = { x: number; y: number; s: number; at: number; c?: string; accent?: string; speed?: number };

const Box: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <g transform={`translate(${x - s / 2} ${y - s / 2}) scale(${s / 100})`}>{children}</g>
);
const o = (c: string, extra: SketchOpts = {}): SketchOpts => ({ color: c, width: 3.2, rough: 0.9, ...extra });

export const PhoneFace: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.blue }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "path", d: "M30 6 H70 Q80 6 80 16 V84 Q80 94 70 94 H30 Q20 94 20 84 V16 Q20 6 30 6 Z" }} at={at} dur={14} o={o(c, { fill: nb.sky, fillStyle: "hachure", hachureGap: 7, seed: 2 })} />
    <Sketch s={{ k: "line", x1: 42, y1: 13, x2: 58, y2: 13 }} at={at + 10} dur={4} o={o(c)} />
    <Sketch s={{ k: "circle", x: 50, y: 48, d: 30 }} at={at + 12} dur={8} o={o(accent, { seed: 4 })} />
    <Sketch s={{ k: "path", d: "M43 52 Q50 59 57 52" }} at={at + 18} dur={5} o={o(accent)} />
    <Sketch s={{ k: "circle", x: 44, y: 44, d: 3 }} at={at + 18} dur={3} o={o(accent, { fill: accent, fillStyle: "solid" })} />
    <Sketch s={{ k: "circle", x: 56, y: 44, d: 3 }} at={at + 19} dur={3} o={o(accent, { fill: accent, fillStyle: "solid" })} />
    {/* face-scan corners */}
    {[
      "M30 32 V28 H34",
      "M66 28 H70 V32",
      "M30 64 V68 H34",
      "M66 68 H70 V64",
    ].map((d, i) => (
      <Sketch key={i} s={{ k: "path", d }} at={at + 20 + i * 2} dur={4} o={o(nb.green, { width: 3.6 })} />
    ))}
  </Box>
);

export const Envelope: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.sticky }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "rect", x: 8, y: 22, w: 84, h: 58 }} at={at} dur={12} o={o(c, { fill: accent, fillStyle: "solid", seed: 3 })} />
    <Sketch s={{ k: "lines", pts: [[8, 24], [50, 56], [92, 24]] }} at={at + 10} dur={8} o={o(c)} />
  </Box>
);

export const PlayBtn: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.red }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "path", d: "M18 22 H82 Q94 22 94 34 V66 Q94 78 82 78 H18 Q6 78 6 66 V34 Q6 22 18 22 Z" }} at={at} dur={12} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 6, seed: 6 })} />
    <Sketch s={{ k: "poly", pts: [[41, 36], [64, 50], [41, 64]] }} at={at + 10} dur={7} o={o(c, { fill: "#FFFFFF", fillStyle: "solid" })} />
  </Box>
);

export const MapPin: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.green }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "curve", pts: [[4, 88], [30, 74], [58, 82], [96, 64]] }} at={at} dur={10} o={o(nb.pencil, { width: 6, seed: 8 })} />
    <Sketch s={{ k: "path", d: "M50 74 C34 52 26 42 26 30 A24 24 0 0 1 74 30 C74 42 66 52 50 74 Z" }} at={at + 6} dur={12} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 6, seed: 9 })} />
    <Sketch s={{ k: "circle", x: 50, y: 30, d: 14 }} at={at + 16} dur={5} o={o(c, { fill: "#FFFFFF", fillStyle: "solid" })} />
  </Box>
);

export const House: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.orange }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "poly", pts: [[14, 44], [50, 12], [86, 44]] }} at={at} dur={9} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 6, seed: 11 })} />
    <Sketch s={{ k: "rect", x: 22, y: 44, w: 56, h: 44 }} at={at + 7} dur={10} o={o(c, { seed: 12 })} />
    <Sketch s={{ k: "rect", x: 42, y: 62, w: 16, h: 26 }} at={at + 14} dur={6} o={o(c, { seed: 13 })} />
    <Sketch s={{ k: "rect", x: 28, y: 52, w: 10, h: 10 }} at={at + 16} dur={4} o={o(nb.blue)} />
    <Sketch s={{ k: "rect", x: 62, y: 52, w: 10, h: 10 }} at={at + 17} dur={4} o={o(nb.blue, { seed: 14 })} />
  </Box>
);

export const Robot: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.sky }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "line", x1: 50, y1: 6, x2: 50, y2: 20 }} at={at} dur={4} o={o(c)} />
    <Sketch s={{ k: "circle", x: 50, y: 6, d: 9 }} at={at + 3} dur={4} o={o(nb.red, { fill: nb.red, fillStyle: "solid" })} />
    <Sketch s={{ k: "rect", x: 18, y: 20, w: 64, h: 50 }} at={at + 4} dur={12} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 7, seed: 15 })} />
    <Sketch s={{ k: "circle", x: 37, y: 40, d: 13 }} at={at + 12} dur={5} o={o(c, { fill: "#FFFFFF", fillStyle: "solid" })} />
    <Sketch s={{ k: "circle", x: 63, y: 40, d: 13 }} at={at + 13} dur={5} o={o(c, { fill: "#FFFFFF", fillStyle: "solid", seed: 16 })} />
    <Sketch s={{ k: "circle", x: 38, y: 41, d: 4 }} at={at + 16} dur={3} o={o(c, { fill: c, fillStyle: "solid" })} />
    <Sketch s={{ k: "circle", x: 64, y: 41, d: 4 }} at={at + 16} dur={3} o={o(c, { fill: c, fillStyle: "solid" })} />
    <Sketch s={{ k: "path", d: "M38 56 Q50 64 62 56" }} at={at + 17} dur={4} o={o(c)} />
    <Sketch s={{ k: "rect", x: 30, y: 72, w: 40, h: 22 }} at={at + 18} dur={8} o={o(c, { seed: 17 })} />
    <Sketch s={{ k: "line", x1: 12, y1: 50, x2: 18, y2: 50 }} at={at + 20} dur={3} o={o(c)} />
    <Sketch s={{ k: "line", x1: 82, y1: 50, x2: 88, y2: 50 }} at={at + 20} dur={3} o={o(c)} />
  </Box>
);

export const Gamepad: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.purple }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "path", d: "M24 30 H76 Q94 30 96 52 Q98 76 84 76 Q76 76 70 66 H30 Q24 76 16 76 Q2 76 4 52 Q6 30 24 30 Z" }} at={at} dur={14} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 7, seed: 18 })} />
    <Sketch s={{ k: "line", x1: 18, y1: 50, x2: 34, y2: 50 }} at={at + 12} dur={4} o={o(c, { width: 4 })} />
    <Sketch s={{ k: "line", x1: 26, y1: 42, x2: 26, y2: 58 }} at={at + 13} dur={4} o={o(c, { width: 4 })} />
    <Sketch s={{ k: "circle", x: 70, y: 46, d: 8 }} at={at + 14} dur={3} o={o(nb.red, { fill: nb.red, fillStyle: "solid" })} />
    <Sketch s={{ k: "circle", x: 80, y: 56, d: 8 }} at={at + 15} dur={3} o={o(nb.green, { fill: nb.green, fillStyle: "solid" })} />
  </Box>
);

export const Bank: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.mint }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "poly", pts: [[8, 34], [50, 8], [92, 34]] }} at={at} dur={9} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 6, seed: 19 })} />
    {[20, 40, 60, 80].map((cx, i) => (
      <Sketch key={cx} s={{ k: "line", x1: cx, y1: 40, x2: cx, y2: 80 }} at={at + 8 + i * 2} dur={4} o={o(c, { width: 4, seed: 20 + i })} />
    ))}
    <Sketch s={{ k: "rect", x: 6, y: 82, w: 88, h: 10 }} at={at + 16} dur={6} o={o(c, { seed: 25 })} />
  </Box>
);

export const Computer: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.sky }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "rect", x: 8, y: 10, w: 84, h: 58 }} at={at} dur={12} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 8, seed: 26 })} />
    <Sketch s={{ k: "lines", pts: [[40, 70], [36, 86], [64, 86], [60, 70]] }} at={at + 10} dur={6} o={o(c)} />
    <Sketch s={{ k: "line", x1: 26, y1: 90, x2: 74, y2: 90 }} at={at + 14} dur={4} o={o(c)} />
  </Box>
);

export const Plane: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = "#FFFFFF" }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "poly", pts: [[6, 46], [94, 12], [62, 88], [46, 58]] }} at={at} dur={10} o={o(c, { fill: accent, fillStyle: "solid", seed: 27 })} />
    <Sketch s={{ k: "lines", pts: [[46, 58], [94, 12]] }} at={at + 8} dur={5} o={o(c)} />
  </Box>
);

export const Star: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.yellow }) => {
  const pts: [number, number][] = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 20 : 46;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return [50 + r * Math.cos(a), 52 + r * Math.sin(a)];
  });
  return (
    <Box x={x} y={y} s={s}>
      <Sketch s={{ k: "poly", pts }} at={at} dur={10} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 6, seed: 28 })} />
    </Box>
  );
};

export const Person: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.orange }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "circle", x: 50, y: 24, d: 26 }} at={at} dur={7} o={o(c, { fill: "#F6D2B0", fillStyle: "solid", seed: 29 })} />
    <Sketch s={{ k: "path", d: "M24 92 Q24 46 50 46 Q76 46 76 92" }} at={at + 6} dur={9} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 6, seed: 30 })} />
  </Box>
);

// three hand-drawn clusters of dots (unsupervised learning)
export const Clusters: React.FC<IconProps> = ({ x, y, s, at }) => {
  const groups = [
    { cx: 26, cy: 30, c: nb.blue },
    { cx: 72, cy: 34, c: nb.orange },
    { cx: 46, cy: 76, c: nb.green },
  ];
  return (
    <Box x={x} y={y} s={s}>
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          {[[0, 0], [-8, 6], [7, 5], [-4, -8], [6, -7]].map(([dx, dy], i) => (
            <Sketch key={i} s={{ k: "circle", x: g.cx + dx, y: g.cy + dy, d: 6 }} at={at + gi * 3 + i} dur={3} o={o(g.c, { fill: g.c, fillStyle: "solid", seed: 31 + i })} />
          ))}
          <Sketch s={{ k: "ellipse", x: g.cx, y: g.cy, w: 36, h: 30 }} at={at + 16 + gi * 4} dur={8} o={o(g.c, { rough: 1.6, seed: 40 + gi })} />
        </React.Fragment>
      ))}
    </Box>
  );
};

// flash cards with answers (supervised learning)
export const Flashcards: React.FC<IconProps> = ({ x, y, s, at }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "rect", x: 20, y: 8, w: 62, h: 44 }} at={at} dur={8} o={o(nb.ink, { fill: nb.stickyBlue, fillStyle: "solid", seed: 44 })} />
    <Sketch s={{ k: "rect", x: 10, y: 22, w: 62, h: 44 }} at={at + 4} dur={8} o={o(nb.ink, { fill: nb.sticky, fillStyle: "solid", seed: 45 })} />
    <Sketch s={{ k: "lines", pts: [[28, 44], [36, 52], [54, 34]] }} at={at + 12} dur={5} o={o(nb.green, { width: 4.5 })} />
    <Sketch s={{ k: "rect", x: 26, y: 66, w: 62, h: 28 }} at={at + 14} dur={7} o={o(nb.ink, { fill: nb.stickyPink, fillStyle: "solid", seed: 46 })} />
    <Sketch s={{ k: "line", x1: 48, y1: 74, x2: 66, y2: 86 }} at={at + 20} dur={3} o={o(nb.red, { width: 4.5 })} />
    <Sketch s={{ k: "line", x1: 66, y1: 74, x2: 48, y2: 86 }} at={at + 22} dur={3} o={o(nb.red, { width: 4.5, seed: 47 })} />
  </Box>
);

// trophy (reward)
export const Trophy: React.FC<IconProps> = ({ x, y, s, at, c = nb.ink, accent = nb.yellow }) => (
  <Box x={x} y={y} s={s}>
    <Sketch s={{ k: "path", d: "M28 10 H72 V36 Q72 60 50 62 Q28 60 28 36 Z" }} at={at} dur={10} o={o(c, { fill: accent, fillStyle: "hachure", hachureGap: 6, seed: 48 })} />
    <Sketch s={{ k: "path", d: "M28 18 Q10 18 14 34 Q18 44 30 44" }} at={at + 8} dur={5} o={o(c)} />
    <Sketch s={{ k: "path", d: "M72 18 Q90 18 86 34 Q82 44 70 44" }} at={at + 9} dur={5} o={o(c)} />
    <Sketch s={{ k: "lines", pts: [[46, 62], [44, 78], [56, 78], [54, 62]] }} at={at + 12} dur={4} o={o(c)} />
    <Sketch s={{ k: "rect", x: 32, y: 78, w: 36, h: 12 }} at={at + 14} dur={5} o={o(c, { seed: 49 })} />
  </Box>
);
