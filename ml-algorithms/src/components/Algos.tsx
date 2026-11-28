// The 12 algorithm animations (one svg 900×480 each) and the algorithm scene layout.
// Every animation is driven by t = frames since the explanation sentence starts, and T = that scene's cue frames
// (relative to the same start), so each move lands on its word.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "./D2";
import { ease } from "./Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const SUP = C.cyan;
export const UNS = C.orange;
export const REI = C.violet;
const A = C.cyan;
const B = C.orange;

const mul = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pts = (seed: number, n: number, cx: number, cy: number, sx: number, sy: number) => {
  const r = mul(seed);
  const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  return Array.from({ length: n }, () => ({ x: cl(cx + (r() + r() + r() - 1.5) * sx, 40, 860), y: cl(cy + (r() + r() + r() - 1.5) * sy, 40, 440) }));
};
const e = (t: number, a: number, b: number) => ease(t, [a, b], [0, 1]);
const Dot: React.FC<{ x: number; y: number; c: string; r?: number; o?: number }> = ({ x, y, c, r = 11, o = 1 }) => <circle cx={x} cy={y} r={r} fill={c} opacity={o} />;
const Label: React.FC<{ x: number; y: number; c?: string; s?: number; children: React.ReactNode; o?: number; a?: "middle" | "start" | "end" }> = ({ x, y, c = C.text, s = 30, children, o = 1, a = "middle" }) => (
  <text x={x} y={y} textAnchor={a} dominantBaseline="central" fontFamily={theme.fonts.display} fontWeight={800} fontSize={s} fill={c} opacity={o}>{children}</text>
);
const Box: React.FC<{ x: number; y: number; w: number; t: string; c: string; o: number; solid?: boolean }> = ({ x, y, w, t, c, o, solid }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${0.8 + 0.2 * o})`}>
    <rect x={-w / 2} y={-34} width={w} height={68} rx={16} fill={solid ? c : alpha(c, 0.18)} stroke={c} strokeWidth={4} />
    <Label x={0} y={2} s={28} c={solid ? C.ink : C.text}>{t}</Label>
  </g>
);
const Axes: React.FC<{ xl: string; yl: string }> = ({ xl, yl }) => (
  <g>
    <line x1={40} y1={450} x2={870} y2={450} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
    <line x1={40} y1={450} x2={40} y2={20} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
    <Label x={860} y={472} s={22} c={C.dim} a="end">{xl}</Label>
    <Label x={58} y={30} s={22} c={C.dim} a="start">{yl}</Label>
  </g>
);

// 1 linear regression: points, then the best-fit line draws, then the residuals
const LIN = (() => { const r = mul(11); return Array.from({ length: 14 }, (_, i) => { const x = 80 + i * 56; return { x, y: 410 - (x - 60) * 0.38 + (r() - 0.5) * 80 }; }); })();
const Lin: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const p = e(t, T[0] - 4, T[0] + 26);
  const ly = (x: number) => 418 - (x - 60) * 0.38;
  return (
    <g>
      <Axes xl="flat size →" yl="rent ↑" />
      {LIN.map((d, i) => <Dot key={i} x={d.x} y={d.y} c={A} o={e(t, i * 1.5 - 30, i * 1.5 - 24 + 6)} />)}
      {LIN.map((d, i) => <line key={`r${i}`} x1={d.x} y1={d.y} x2={d.x} y2={ly(d.x)} stroke={C.yellow} strokeWidth={2} strokeDasharray="4 4" opacity={e(t, T[0] + 26, T[0] + 36) * 0.7} />)}
      <line x1={50} y1={ly(50)} x2={50 + 810 * p} y2={ly(50 + 810 * p)} stroke={C.yellow} strokeWidth={7} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.yellow})` }} />
      <g opacity={e(t, T[1] - 4, T[1] + 6)}>
        <circle cx={760} cy={ly(760)} r={16} fill="none" stroke={C.green} strokeWidth={5} />
        <Label x={760} y={ly(760) - 46} c={C.green} s={30}>predicted rent</Label>
      </g>
    </g>
  );
};

// 2 logistic regression: 0 / 1 points, the S-curve draws, a point rides it to 80% → YES
const sig = (x: number) => 1 / (1 + Math.exp(-(x - 450) / 60));
const LOG = (() => { const r = mul(5); return Array.from({ length: 22 }, (_, i) => { const x = 70 + i * 36 + (r() - 0.5) * 20; const one = r() < sig(x) ; return { x, y: one ? 70 : 430 }; }); })();
const Logi: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const p = e(t, T[0] - 4, T[0] + 30);
  const path = Array.from({ length: 83 }, (_, i) => { const x = 50 + i * 10; return `${i ? "L" : "M"}${x} ${430 - 360 * sig(x)}`; }).join(" ");
  const ride = e(t, T[1] - 10, T[1] + 6);
  const x = 200 + (533 - 200) * ride;
  return (
    <g>
      <Axes xl="time on website →" yl="P(buy)" />
      <Label x={20} y={430} s={24} c={C.dim}>0</Label>
      <Label x={20} y={70} s={24} c={C.dim}>1</Label>
      {LOG.map((d, i) => <Dot key={i} x={d.x} y={d.y} c={d.y < 200 ? C.green : C.red} o={0.85} r={10} />)}
      <path d={path} fill="none" stroke={C.yellow} strokeWidth={7} pathLength={1} strokeDasharray={`${p} 1`} style={{ filter: `drop-shadow(0 0 8px ${C.yellow})` }} />
      <g opacity={ride}>
        <circle cx={x} cy={430 - 360 * sig(x)} r={18} fill={C.text} />
        <Label x={x + 30} y={430 - 360 * sig(x) + 50} s={36} c={C.green} a="start">{Math.round(sig(x) * 100)}% → YES</Label>
      </g>
    </g>
  );
};

// 3 decision tree: questions branch on their words
const Tree: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const o = [e(t, T[0] - 4, T[0] + 6), e(t, T[1] - 4, T[1] + 6), e(t, T[2] - 4, T[2] + 6)];
  const edge = (x1: number, y1: number, x2: number, y2: number, l: string, op: number) => (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={alpha(C.text, 0.6)} strokeWidth={4} />
      <Label x={(x1 + x2) / 2 + (x2 < x1 ? -26 : 26)} y={(y1 + y2) / 2} s={22} c={l === "yes" ? C.green : C.red}>{l}</Label>
    </g>
  );
  return (
    <g>
      {edge(450, 94, 250, 196, "yes", o[1])}
      {edge(450, 94, 660, 196, "no", o[1])}
      {edge(250, 264, 130, 366, "no", o[2])}
      {edge(250, 264, 380, 366, "yes", o[2])}
      <Box x={450} y={60} w={360} t="salary > 50,000?" c={C.cyan} o={o[0]} />
      <Box x={250} y={230} w={300} t="existing loans?" c={C.cyan} o={o[1]} />
      <Box x={660} y={230} w={200} t="REJECT" c={C.red} o={o[1]} solid />
      <Box x={130} y={400} w={210} t="APPROVE" c={C.green} o={o[2]} solid />
      <Box x={390} y={400} w={200} t="REJECT" c={C.red} o={o[2]} solid />
    </g>
  );
};

// a small tree icon
const TreeIcon: React.FC<{ x: number; y: number; s: number; c: string; o?: number }> = ({ x, y, s, c, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-6} y={20} width={12} height={34} rx={3} fill="#8B5A2B" />
    <polygon points="0,-46 40,0 18,0 46,30 -46,30 -18,0 -40,0" fill={c} />
  </g>
);

// 4 random forest: 5 trees pop in, each votes, the majority wins
const Forest: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const votes = [true, true, false, true, true];
  return (
    <g>
      {votes.map((v, i) => {
        const x = 110 + i * 170;
        const o = e(t, T[0] + i * 4 - 4, T[0] + i * 4 + 4);
        const vo = e(t, T[1] + i * 4 - 4, T[1] + i * 4 + 4);
        return (
          <g key={i}>
            <TreeIcon x={x} y={150} s={1.5} c={C.green} o={o} />
            <g opacity={vo}>
              <rect x={x - 70} y={262} width={140} height={56} rx={14} fill={v ? alpha(C.red, 0.25) : alpha(C.green, 0.2)} stroke={v ? C.red : C.green} strokeWidth={3} />
              <Label x={x} y={291} s={26}>{v ? "FRAUD" : "OK"}</Label>
            </g>
          </g>
        );
      })}
      <g opacity={e(t, T[1] + 24, T[1] + 32)}>
        <rect x={250} y={360} width={400} height={80} rx={20} fill={C.red} />
        <Label x={450} y={401} s={38} c={C.ink}>FRAUD · 4 votes to 1</Label>
      </g>
    </g>
  );
};

// 5 gradient boosting: trees in a row, each one's error bar shorter
const Boost: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const err = [100, 58, 32, 14];
  return (
    <g>
      {err.map((er, i) => {
        const x = 120 + i * 220;
        const o = e(t, T[0] + i * 12 - 4, T[0] + i * 12 + 4);
        return (
          <g key={i} opacity={o}>
            <TreeIcon x={x} y={120} s={1.3} c={C.green} />
            {i < 3 ? <path d={`M${x + 70} 130 H${x + 150} M${x + 136} 116 L${x + 152} 130 L${x + 136} 144`} stroke={C.yellow} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
            <rect x={x - 70} y={300} width={140} height={34} rx={8} fill={alpha(C.text, 0.1)} />
            <rect x={x - 70} y={300} width={140 * (er / 100)} height={34} rx={8} fill={i === 3 ? C.green : C.red} />
            <Label x={x} y={370} s={26} c={C.dim}>error {er}%</Label>
            <Label x={x} y={240} s={24} c={C.text}>tree {i + 1}</Label>
          </g>
        );
      })}
      <Label x={450} y={440} s={30} c={C.yellow} o={e(t, T[1] - 4, T[1] + 6)}>each tree fixes the last one's mistakes</Label>
    </g>
  );
};

// 6 KNN: a new grey point, a circle grows, 3 nearest light up, it takes the majority colour
const KA = pts(21, 9, 250, 240, 220, 200);
const KB = pts(22, 9, 650, 240, 220, 200);
const NEW = { x: 470, y: 230 };
const Knn: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const all = [...KA.map((p) => ({ ...p, c: A })), ...KB.map((p) => ({ ...p, c: B }))].map((p) => ({ ...p, d: Math.hypot(p.x - NEW.x, p.y - NEW.y) }));
  const near = [...all].sort((a, b) => a.d - b.d).slice(0, 3);
  const rad = near[2].d + 16;
  const g = e(t, T[0] - 6, T[0] + 14);
  const decide = e(t, T[1] - 4, T[1] + 4);
  const maj = near.filter((n) => n.c === A).length >= 2 ? A : B;
  return (
    <g>
      {all.map((p, i) => <Dot key={i} x={p.x} y={p.y} c={p.c} r={13} />)}
      <circle cx={NEW.x} cy={NEW.y} r={rad * g} fill={alpha(C.yellow, 0.08)} stroke={C.yellow} strokeWidth={3} strokeDasharray="10 8" />
      {near.map((n, i) => <line key={i} x1={NEW.x} y1={NEW.y} x2={n.x} y2={n.y} stroke={C.yellow} strokeWidth={4} opacity={g} />)}
      <circle cx={NEW.x} cy={NEW.y} r={20} fill={decide > 0.5 ? maj : "#9CA3AF"} stroke="#FFFFFF" strokeWidth={4} />
      <Label x={NEW.x} y={NEW.y - 48} s={28} c={C.text}>{decide > 0.5 ? "→ majority" : "new ?"}</Label>
    </g>
  );
};

// 7 naive Bayes: an email whose spammy words light up; the spam meter fills
const Bayes: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const w = [{ t: "FREE", x: 90, y: 150, at: T[0] }, { t: "WINNER", x: 230, y: 220, at: T[1] }, { t: "URGENT", x: 120, y: 290, at: T[2] }];
  const fill = Math.max(...w.map((k, i) => e(t, k.at - 2, k.at + 6) * [0.55, 0.82, 0.97][i]));
  return (
    <g>
      <rect x={40} y={40} width={460} height={400} rx={20} fill="#F8FAFC" />
      <Label x={70} y={84} s={26} c="#0A1A3A" a="start">✉ New message</Label>
      {[130, 200, 270, 340, 400].map((y, i) => <rect key={i} x={70} y={y} width={i % 2 ? 300 : 380} height={14} rx={7} fill="#CBD5E1" />)}
      {w.map((k) => {
        const o = e(t, k.at - 2, k.at + 4);
        return (
          <g key={k.t} opacity={0.15 + 0.85 * o}>
            <rect x={k.x - 10} y={k.y - 24} width={k.t.length * 24 + 20} height={48} rx={10} fill={o > 0.5 ? C.red : "#94A3B8"} />
            <Label x={k.x} y={k.y + 1} s={30} c="#FFFFFF" a="start">{k.t}</Label>
          </g>
        );
      })}
      <rect x={600} y={60} width={110} height={360} rx={20} fill={alpha(C.text, 0.1)} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
      <rect x={600} y={60 + 360 * (1 - fill)} width={110} height={360 * fill} rx={20} fill={fill > 0.9 ? C.red : C.orange} />
      <Label x={655} y={40} s={26} c={C.dim}>P(spam)</Label>
      <Label x={800} y={240} s={46} c={fill > 0.9 ? C.red : C.text}>{Math.round(fill * 100)}%</Label>
    </g>
  );
};

// 8 SVM: two classes, the widest street opens between them, support vectors ringed
const NX = -0.43, NY = 0.9;
const sd = (p: { x: number; y: number }) => (p.x - 450) * NX + (p.y - 245) * NY;
const push = (arr: { x: number; y: number }[], sign: number) => {
  const out = arr.map((p) => { const d = sd(p) * sign; const need = 95 + (Math.abs(p.x * 7 + p.y) % 50); return d >= need ? p : { x: p.x + NX * sign * (need - d), y: p.y + NY * sign * (need - d) }; });
  // the support vector: the point nearest the street sits exactly on its edge (distance 70)
  let k = 0; out.forEach((p, i) => { if (sd(p) * sign < sd(out[k]) * sign) k = i; });
  const d = sd(out[k]) * sign; out[k] = { x: out[k].x - NX * sign * (d - 70), y: out[k].y - NY * sign * (d - 70) };
  return { pts: out, sv: out[k] };
};
const SAx = push(pts(31, 10, 300, 130, 300, 120), -1);
const SBx = push(pts(32, 10, 600, 360, 300, 120), 1);
const SA = SAx.pts;
const SB = SBx.pts;
const Svm: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const w = 70 * e(t, T[0] - 4, T[0] + 20);
  const ring = e(t, T[1] - 4, T[1] + 6);
  // street along the line through (450,245) with direction (1, 0.475)
  const L = (off: number) => {
    const nx = -0.43, ny = 0.9; // unit normal
    const ox = 450 + nx * off, oy = 245 + ny * off;
    return { x1: ox - 500, y1: oy - 500 * 0.475, x2: ox + 500, y2: oy + 500 * 0.475 };
  };
  const m = L(0), u = L(-w), d = L(w);
  const sv = [SA[0], SB[0]].map((p, i) => ({ ...p, c: i ? B : A }));
  return (
    <g>
      <svg x={0} y={0} width={900} height={480} overflow="hidden">
        <polygon points={`${u.x1},${u.y1} ${u.x2},${u.y2} ${d.x2},${d.y2} ${d.x1},${d.y1}`} fill={alpha(C.yellow, 0.12)} />
        <line {...u} stroke={C.yellow} strokeWidth={3} strokeDasharray="12 8" />
        <line {...d} stroke={C.yellow} strokeWidth={3} strokeDasharray="12 8" />
        <line {...m} stroke={C.yellow} strokeWidth={6} />
      </svg>
      {SA.map((p, i) => <Dot key={`a${i}`} x={p.x} y={p.y} c={A} r={13} />)}
      {SB.map((p, i) => <Dot key={`b${i}`} x={p.x} y={p.y} c={B} r={13} />)}
      <g opacity={ring}>
        <circle cx={SAx.sv.x} cy={SAx.sv.y} r={24} fill="none" stroke="#FFFFFF" strokeWidth={4} />
        <circle cx={SBx.sv.x} cy={SBx.sv.y} r={24} fill="none" stroke="#FFFFFF" strokeWidth={4} />
        <Label x={760} y={60} s={28} c={C.text}>support vectors</Label>
      </g>
      {sv.length ? null : null}
    </g>
  );
};

// 9 K-means: grey points; 3 centres drop and move; points take the nearest centre's colour
const KC = [pts(41, 12, 200, 140, 200, 160), pts(42, 12, 680, 140, 200, 160), pts(43, 12, 440, 360, 220, 140)].flat();
const KCOL = [C.cyan, C.orange, C.green];
const START = [{ x: 420, y: 90 }, { x: 480, y: 120 }, { x: 450, y: 180 }];
const END = [{ x: 200, y: 140 }, { x: 680, y: 140 }, { x: 440, y: 360 }];
const Kmeans: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const drop = e(t, T[0] - 4, T[0] + 6);
  const mv = e(t, T[1] - 10, T[1] + 40);
  const cs = START.map((s, i) => ({ x: s.x + (END[i].x - s.x) * mv, y: s.y + (END[i].y - s.y) * mv }));
  return (
    <g>
      {KC.map((p, i) => {
        const k = cs.map((c) => Math.hypot(c.x - p.x, c.y - p.y)).reduce((bi, d, j, arr) => (d < arr[bi] ? j : bi), 0);
        return <Dot key={i} x={p.x} y={p.y} c={drop > 0.5 ? KCOL[k] : "#9CA3AF"} r={12} />;
      })}
      {cs.map((c, i) => (
        <g key={i} opacity={drop} transform={`translate(${c.x} ${c.y})`}>
          <path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" />
          <path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke={KCOL[i]} strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};

// 10 PCA: a tilted cloud, the main direction arrow draws, the points slide onto it
const PC = (() => { const r = mul(51); return Array.from({ length: 30 }, () => { const a = (r() - 0.5) * 640, b = (r() - 0.5) * 120; return { a, b }; }); })();
const Pca: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const ar = e(t, T[0] - 6, T[0] + 14);
  const sq = e(t, T[0] + 14, T[0] + 40);
  const c = Math.cos(-0.45), s = Math.sin(-0.45);
  const P = (a: number, b: number) => ({ x: 450 + a * c - b * s, y: 240 + a * s + b * c });
  const e1 = P(-360, 0), e2 = P(-360 + 720 * ar, 0);
  return (
    <g>
      {PC.map((p, i) => { const q = P(p.a, p.b * (1 - sq)); return <Dot key={i} x={q.x} y={q.y} c={C.cyan} r={11} />; })}
      <line x1={e1.x} y1={e1.y} x2={e2.x} y2={e2.y} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
      <Label x={450} y={445} s={30} c={C.text} o={e(t, T[1] - 4, T[1] + 6)}>100 columns → 2 that keep ~90% of the info</Label>
    </g>
  );
};

// 11 neural network: 3-5-5-2, signals pulse forward along the edges
const LAY = [3, 5, 5, 2];
const Nn: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const P = (l: number, i: number) => ({ x: 110 + l * 230, y: 240 + (i - (LAY[l] - 1) / 2) * 86 });
  const on = e(t, T[0] - 6, T[0] + 6);
  const edges: { a: { x: number; y: number }; b: { x: number; y: number }; k: number }[] = [];
  LAY.slice(0, -1).forEach((n, l) => { for (let i = 0; i < n; i++) for (let j = 0; j < LAY[l + 1]; j++) edges.push({ a: P(l, i), b: P(l + 1, j), k: l * 7 + i * 3 + j }); });
  return (
    <g>
      {edges.map((ed, i) => <line key={i} x1={ed.a.x} y1={ed.a.y} x2={ed.b.x} y2={ed.b.y} stroke={alpha(C.text, 0.18)} strokeWidth={2} />)}
      {edges.map((ed, i) => {
        const ph = (((t + ed.k * 5) % 36) + 36) % 36 / 36;
        return <circle key={`p${i}`} cx={ed.a.x + (ed.b.x - ed.a.x) * ph} cy={ed.a.y + (ed.b.y - ed.a.y) * ph} r={5} fill={C.yellow} opacity={on * (i % 3 === 0 ? 1 : 0)} />;
      })}
      {LAY.map((n, l) => Array.from({ length: n }, (_, i) => { const p = P(l, i); return <circle key={`${l}${i}`} cx={p.x} cy={p.y} r={24} fill={l === 0 ? C.cyan : l === 3 ? C.green : C.violet} stroke="#FFFFFF" strokeWidth={3} />; }))}
      <Label x={110} y={460} s={24} c={C.dim}>input</Label>
      <Label x={455} y={460} s={24} c={C.dim}>hidden layers</Label>
      <Label x={800} y={460} s={24} c={C.dim}>output</Label>
    </g>
  );
};

// 12 reinforcement learning: a grid world; try 1 falls in the pit (−1), try 2 reaches the trophy (+10)
const RL1 = [[0, 3], [1, 3], [2, 3], [2, 2]];
const RL2 = [[0, 3], [0, 2], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0]];
const Rl: React.FC<{ t: number; T: number[] }> = ({ t, T }) => {
  const cell = 116, ox = 102, oy = 4;
  const at = (c: number[]) => ({ x: ox + c[0] * cell + cell / 2, y: oy + c[1] * cell + cell / 2 });
  const t2 = T[1] - 8;
  const pos = (path: number[][], k: number) => { const i = Math.min(path.length - 1, Math.floor(k)); const j = Math.min(path.length - 1, i + 1); const f = Math.min(1, k - i); const a = at(path[i]), b = at(path[j]); return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }; };
  const run2 = t >= t2;
  const k = run2 ? (t - t2) / 7 : Math.max(0, (t - T[0] + 4) / 7);
  const ag = run2 ? pos(RL2, k) : pos(RL1, k);
  const fell = !run2 && k >= RL1.length - 1;
  const won = run2 && k >= RL2.length - 1;
  return (
    <g>
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={ox + (i % 6) * cell + 3} y={oy + Math.floor(i / 6) * cell + 3} width={cell - 6} height={cell - 6} rx={12} fill="rgba(255,255,255,0.05)" stroke={alpha(C.text, 0.15)} strokeWidth={2} />)}
      <rect x={ox + 2 * cell + 3} y={oy + 2 * cell + 3} width={cell - 6} height={cell - 6} rx={12} fill={alpha(C.red, 0.35)} stroke={C.red} strokeWidth={3} />
      <Label x={ox + 2.5 * cell} y={oy + 2.5 * cell} s={26} c={C.text}>PIT</Label>
      <rect x={ox + 5 * cell + 3} y={oy + 3} width={cell - 6} height={cell - 6} rx={12} fill={alpha(C.yellow, 0.3)} stroke={C.yellow} strokeWidth={3} />
      <Label x={ox + 5.5 * cell} y={oy + 0.5 * cell} s={26} c={C.text}>GOAL</Label>
      <circle cx={ag.x} cy={ag.y} r={30} fill={C.violet} stroke="#FFFFFF" strokeWidth={4} />
      {fell ? <Label x={ag.x + 70} y={ag.y - 40} s={44} c={C.red}>−1</Label> : null}
      {won ? <Label x={ag.x - 60} y={ag.y + 70} s={44} c={C.green}>+10</Label> : null}
      <Label x={90} y={30} s={24} c={C.dim} a="end">{run2 ? "try 2" : "try 1"}</Label>
    </g>
  );
};

export type VizKind = "lin" | "log" | "tree" | "forest" | "boost" | "knn" | "bayes" | "svm" | "kmeans" | "pca" | "nn" | "rl";
const VIZ: Record<VizKind, React.FC<{ t: number; T: number[] }>> = { lin: Lin, log: Logi, tree: Tree, forest: Forest, boost: Boost, knn: Knn, bayes: Bayes, svm: Svm, kmeans: Kmeans, pca: Pca, nn: Nn, rl: Rl };
export const Viz: React.FC<{ kind: VizKind; t: number; T: number[]; w?: number }> = ({ kind, t, T, w = 900 }) => {
  const V = VIZ[kind];
  return (
    <svg width={w} height={(w * 480) / 900} viewBox="0 0 900 480" style={{ overflow: "visible", display: "block" }}>
      <V t={t} T={T} />
    </svg>
  );
};

// the algorithm scene: #n/12 + family pill, the name, the animation, the one-line takeaway, "used in" chips
export const AlgoScene: React.FC<{ id: string; n: number; name: string; fam: string; c: string; kind: VizKind; cues: string[]; take: React.ReactNode; takeW: string; uses: string[] }> = ({ id, n, name, fam, c, kind, cues, take, takeW, uses }) => {
  const frame = useCurrentFrame();
  const s = useScene(id as never);
  const S = s.sent(1).from;
  const T = cues.map((w) => s.cueS(1, w) - S);
  const fs = Math.min(84, Math.floor(980 / (name.length * 0.62)));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", justifyContent: "center", gap: 14 }}>
        <Pill color={C.yellow} size={30} solid>#{n} / 12</Pill>
        <Pill color={c} size={30}>{fam}</Pill>
      </div>
      <Pop x={540} y={345} at={0}>
        <Txt size={fs} color={C.text} style={{ textShadow: glowText(c, 0.5) }}>{name}</Txt>
      </Pop>
      <Pop x={540} y={720} at={4}>
        <Panel w={1000} h={560} color={c}>
          <Viz kind={kind} t={frame - S} T={T} />
        </Panel>
      </Pop>
      <Pop x={540} y={1065} at={s.cueS(1, takeW) - 4}>
        <Txt size={40} font="body" style={{ textAlign: "center" }}>{take}</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1140, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, opacity: ease(frame, [s.cueS(1, takeW) + 8, s.cueS(1, takeW) + 18], [0, 1]) }}>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim }}>USED IN</span>
        {uses.map((u) => <Pill key={u} color={c} size={28}>{u}</Pill>)}
      </div>
    </AbsoluteFill>
  );
};
