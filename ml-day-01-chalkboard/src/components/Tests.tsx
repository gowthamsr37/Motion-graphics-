// Which-test kit: the seven test cards (family, name, use-it-when, an everyday example, H0 and the Python one-liner),
// a small animated diagram per test (TestViz), the full-screen TestCard with a 7-step progress bar, and the
// cheat-sheet row. Colour code: 1 group = cyan, 2 groups = violet, 3+ groups = green, categories (counts) = orange.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease, rng, useSpr } from "./Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import type { SceneId } from "../timing";

const C = theme.colors;
export const G1 = C.cyan;
export const G2 = C.violet;
export const G3 = C.green;
export const CAT = C.orange;
const PALE = "#E4EEFF";

export type VizKind = "z" | "t1" | "t2" | "paired" | "anova" | "chiInd" | "chiFit";
export type Test = {
  kind: VizKind;
  name: string;
  sub?: string;
  sheet: string; // name on the cheat sheet
  q: string; // cheat-sheet question
  fam: string;
  c: string;
  use: [string, string];
  ex: [string, string];
  h0: string;
  lib: string;
  py: string;
};

export const TESTS: Test[] = [
  { kind: "z", name: "Z-TEST", sheet: "Z-TEST", q: "Average vs a claim, SIGMA known or n 30+", fam: "AVERAGES · 1 GROUP", c: G1, use: ["One average vs a claim", "SIGMA known, or a big sample (30+)"], ex: ["Do juice bottles really hold 200 ml?", "500 students vs the national average"], h0: "average = 200 ml", lib: "STATSMODELS", py: "ztest(x, value=200)" },
  { kind: "t1", name: "ONE-SAMPLE", sub: "t-TEST", sheet: "1-SAMPLE t", q: "Average vs a claim, small sample", fam: "AVERAGES · 1 GROUP", c: G1, use: ["One average vs a claim", "SMALL sample, SIGMA unknown"], ex: ["Do 10 phones really last 20 hours?", "Is a café's average wait really 5 min?"], h0: "average = 20 hours", lib: "SCIPY", py: "stats.ttest_1samp(x, 20)" },
  { kind: "t2", name: "TWO-SAMPLE", sub: "t-TEST", sheet: "2-SAMPLE t", q: "Two SEPARATE groups", fam: "AVERAGES · 2 GROUPS", c: G2, use: ["Two SEPARATE groups", "Are their averages different?"], ex: ["Battery life: brand A vs brand B", "Exam scores: online vs classroom"], h0: "average A = average B", lib: "SCIPY", py: "stats.ttest_ind(a, b)" },
  { kind: "paired", name: "PAIRED", sub: "t-TEST", sheet: "PAIRED t", q: "SAME people, before vs after", fam: "AVERAGES · 2 GROUPS", c: G2, use: ["The SAME people, measured twice", "Before vs after"], ex: ["Typing speed before vs after a course", "Runners' times: old shoes vs new shoes"], h0: "average change = 0", lib: "SCIPY", py: "stats.ttest_rel(before, after)" },
  { kind: "anova", name: "ANOVA", sub: "ANALYSIS OF VARIANCE", sheet: "ANOVA", q: "THREE or more groups", fam: "AVERAGES · 3+ GROUPS", c: G3, use: ["THREE or more groups", "Is any average different?"], ex: ["Waiting times at 3 coffee shops", "Sales under 4 ad designs"], h0: "all averages are equal", lib: "SCIPY", py: "stats.f_oneway(a, b, c)" },
  { kind: "chiInd", name: "CHI-SQUARE", sub: "TEST OF INDEPENDENCE", sheet: "CHI-SQ INDEPENDENCE", q: "Are two CATEGORIES linked?", fam: "COUNTS · 2 CATEGORIES", c: CAT, use: ["Two CATEGORIES", "Are they linked?"], ex: ["Does tea vs coffee depend on age?", "Is phone brand linked to city?"], h0: "no link (independent)", lib: "SCIPY", py: "stats.chi2_contingency(table)" },
  { kind: "chiFit", name: "CHI-SQUARE", sub: "GOODNESS OF FIT", sheet: "CHI-SQ GOODNESS OF FIT", q: "Do counts match what you EXPECTED?", fam: "COUNTS · 1 CATEGORY", c: CAT, use: ["One CATEGORY", "Do counts match what you expected?"], ex: ["Is this dice fair? (60 rolls)", "Visits spread evenly over 7 days?"], h0: "counts match expected", lib: "SCIPY", py: "stats.chisquare(observed)" },
];

// seeded normal samples
const normals = (seed: number, n: number, mu: number, sd: number) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => {
    const u = Math.max(1e-9, r());
    const v = r();
    return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  });
};
const jit = (seed: number, n: number) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => r());
};
const Z_RAW = normals(11, 40, 198, 7);
const Z_X = Z_RAW.map((v) => v - Z_RAW.reduce((a, b) => a + b, 0) / Z_RAW.length + 198); // average exactly 198
const Z_J = jit(12, 40);
const T1_X = [18.1, 19.6, 20.4, 18.8, 19.0, 21.0, 18.4, 19.9, 18.6, 19.2];
const T1_J = jit(13, 10);
const T2_A = normals(14, 9, 7, 1.4);
const T2_B = normals(15, 9, 10, 1.4);
const PAIRS: [number, number][] = [[38, 46], [45, 51], [30, 41], [52, 55], [41, 50], [35, 39]];
const SHOPS = [[2, 3, 4, 2.6, 3.4], [4, 5, 6, 4.5, 5.5], [6, 7, 8, 6.4, 7.6]];
const DICE = [8, 12, 9, 11, 7, 13];

const T = (x: number, y: number, s: string, size: number, fill: string, anchor: "start" | "middle" | "end" = "middle", op = 1) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={theme.fonts.body} fontWeight={800} fontSize={size} fill={fill} opacity={op} letterSpacing="0.06em">
    {s}
  </text>
);

// p: 0→1 draw-in progress; tiny = no labels (for cheat-sheet thumbnails)
export const TestViz: React.FC<{ kind: VizKind; w: number; h: number; color: string; p: number; tiny?: boolean }> = ({ kind, w, h, color, p, tiny = false }) => {
  const frame = useCurrentFrame();
  const k = (i: number, n: number) => interpolate(p * (n + 6), [i, i + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lab = tiny ? 0 : interpolate(p, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob = (i: number) => Math.sin(frame / 14 + i) * 2;
  let body: React.ReactNode = null;
  if (kind === "z" || kind === "t1") {
    const xs = kind === "z" ? Z_X : T1_X;
    const js = kind === "z" ? Z_J : T1_J;
    const [lo, hi, claim] = kind === "z" ? [176, 220, 200] : [16, 22, 20];
    const X = (v: number) => 40 + ((v - lo) / (hi - lo)) * 620;
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const r = kind === "z" ? 9 : 17;
    body = (
      <>
        <line x1={30} x2={670} y1={200} y2={200} stroke={alpha(C.text, 0.35)} strokeWidth={4} strokeLinecap="round" opacity={k(0, 4)} />
        {xs.map((v, i) => {
          const a = k(i, xs.length);
          return <circle key={i} cx={X(v)} cy={60 + js[i] * 120 + bob(i) - (1 - a) * 30} r={r * a} fill={alpha(color, 0.55)} stroke={color} strokeWidth={3} />;
        })}
        <line x1={X(claim)} x2={X(claim)} y1={28} y2={214} stroke={PALE} strokeWidth={5} strokeDasharray="12 10" opacity={k(xs.length, xs.length)} />
        <line x1={X(mean)} x2={X(mean)} y1={40} y2={214} stroke={color} strokeWidth={7} strokeLinecap="round" opacity={k(xs.length + 3, xs.length)} />
        {T(X(claim) + 12, 62, kind === "z" ? "CLAIM 200" : "CLAIM 20 h", 22, PALE, "start", lab)}
        {T(X(mean) - 12, 244, kind === "z" ? `AVERAGE ${Math.round(mean)}` : `AVERAGE ${mean.toFixed(1)}`, 22, color, "end", lab)}
        {T(30, 30, kind === "z" ? "n = 100 · SIGMA KNOWN" : "n = 10 · SIGMA ?", 20, alpha(C.text, 0.8), "start", lab)}
      </>
    );
  } else if (kind === "t2") {
    const X = (v: number) => 60 + ((v - 3) / 11) * 600;
    const ma = T2_A.reduce((a, b) => a + b, 0) / T2_A.length;
    const mb = T2_B.reduce((a, b) => a + b, 0) / T2_B.length;
    body = (
      <>
        {[T2_A, T2_B].map((row, g) =>
          row.map((v, i) => {
            const a = k(g * 9 + i, 18);
            return <circle key={`${g}${i}`} cx={X(v)} cy={(g === 0 ? 70 : 170) + bob(i + g * 3)} r={15 * a} fill={alpha(g === 0 ? color : PALE, 0.5)} stroke={g === 0 ? color : PALE} strokeWidth={3} />;
          }),
        )}
        <line x1={X(ma)} x2={X(ma)} y1={34} y2={106} stroke={color} strokeWidth={7} strokeLinecap="round" opacity={k(18, 18)} />
        <line x1={X(mb)} x2={X(mb)} y1={134} y2={206} stroke={PALE} strokeWidth={7} strokeLinecap="round" opacity={k(19, 18)} />
        {T(30, 78, "A", 30, color, "start", lab)}
        {T(30, 178, "B", 30, PALE, "start", lab)}
        <path d={`M${X(ma)} 120 H${X(mb) - 14}`} stroke={C.text} strokeWidth={4} opacity={lab} />
        <path d={`M${X(mb) - 20} 110 L${X(mb) - 4} 120 L${X(mb) - 20} 130 Z`} fill={C.text} opacity={lab} />
        {T((X(ma) + X(mb)) / 2, 244, "DIFFERENT?", 22, C.text, "middle", lab)}
      </>
    );
  } else if (kind === "paired") {
    const Y = (v: number) => 220 - ((v - 25) / 35) * 190;
    body = (
      <>
        {PAIRS.map(([b, a2], i) => {
          const a = k(i, PAIRS.length);
          const x1 = 210, x2 = 490;
          return (
            <g key={i} opacity={Math.min(1, a * 2)}>
              <line x1={x1} y1={Y(b)} x2={x1 + (x2 - x1) * a} y2={Y(b) + (Y(a2) - Y(b)) * a} stroke={alpha(color, 0.7)} strokeWidth={4} />
              <circle cx={x1} cy={Y(b)} r={13} fill={alpha(PALE, 0.5)} stroke={PALE} strokeWidth={3} />
              <circle cx={x1 + (x2 - x1) * a} cy={Y(b) + (Y(a2) - Y(b)) * a} r={13} fill={alpha(color, 0.6)} stroke={color} strokeWidth={3} />
            </g>
          );
        })}
        {T(210, 246, "BEFORE", 22, PALE, "middle", lab)}
        {T(490, 246, "AFTER", 22, color, "middle", lab)}
        {T(620, 120, "SAME", 20, C.text, "middle", lab)}
        {T(620, 146, "PEOPLE", 20, C.text, "middle", lab)}
      </>
    );
  } else if (kind === "anova") {
    const Y = (v: number) => 210 - ((v - 1) / 8) * 180;
    body = (
      <>
        {SHOPS.map((vals, g) => {
          const cx = 170 + g * 180;
          const m = vals.reduce((a, b) => a + b, 0) / vals.length;
          return (
            <g key={g}>
              {vals.map((v, i) => {
                const a = k(g * 5 + i, 15);
                return <circle key={i} cx={cx + (i - 2) * 16} cy={Y(v) + bob(i + g)} r={12 * a} fill={alpha(color, 0.5)} stroke={color} strokeWidth={3} />;
              })}
              <line x1={cx - 56} x2={cx + 56} y1={Y(m)} y2={Y(m)} stroke={PALE} strokeWidth={6} strokeLinecap="round" opacity={k(15 + g, 15)} />
              {T(cx, 246, ["SHOP A", "SHOP B", "SHOP C"][g], 22, C.text, "middle", lab)}
            </g>
          );
        })}
      </>
    );
  } else if (kind === "chiInd") {
    const cells = [[40, 60], [60, 40]];
    body = (
      <>
        {T(330, 30, "TEA", 22, C.text, "middle", lab)}
        {T(530, 30, "COFFEE", 22, C.text, "middle", lab)}
        {T(200, 104, "UNDER 30", 22, C.text, "end", lab)}
        {T(200, 194, "30 AND UP", 22, C.text, "end", lab)}
        {cells.map((row, r) =>
          row.map((v, c) => {
            const a = k(r * 2 + c, 4);
            return (
              <g key={`${r}${c}`} opacity={Math.min(1, a * 2)}>
                <rect x={240 + c * 200} y={50 + r * 90} width={180} height={78} rx={14} fill={alpha(color, 0.12 + 0.2 * a)} stroke={color} strokeWidth={3} />
                <text x={330 + c * 200} y={102 + r * 90} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={40} fill={C.text}>
                  {Math.round(v * a)}
                </text>
              </g>
            );
          }),
        )}
      </>
    );
  } else if (kind === "chiFit") {
    const Y = (v: number) => 210 - (v / 14) * 180;
    body = (
      <>
        {DICE.map((v, i) => {
          const a = k(i, 6);
          const x = 120 + i * 85;
          return (
            <g key={i}>
              <rect x={x} y={Y(v * a)} width={60} height={210 - Y(v * a)} rx={8} fill={alpha(color, 0.5)} stroke={color} strokeWidth={3} />
              {T(x + 30, 244, `${i + 1}`, 24, C.text, "middle", lab)}
            </g>
          );
        })}
        <line x1={100} x2={640} y1={Y(10)} y2={Y(10)} stroke={PALE} strokeWidth={5} strokeDasharray="12 10" opacity={k(6, 6)} />
        {T(650, Y(10) + 8, "EXPECTED 10", 20, PALE, "start", lab)}
      </>
    );
  }
  return (
    <svg width={w} height={h} viewBox="0 0 700 250" style={{ display: "block", overflow: "visible" }}>
      {body}
    </svg>
  );
};

// 7-step progress bar
const Progress: React.FC<{ idx: number }> = ({ idx }) => {
  const frame = useCurrentFrame();
  const fill = ease(frame, [2, 14], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 90, top: 196, width: 900, display: "flex", gap: 8 }}>
      {TESTS.map((d, i) => (
        <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: i < idx ? alpha(d.c, 0.55) : i === idx ? alpha(d.c, 0.25 + 0.75 * fill) : alpha(C.text, 0.14), boxShadow: i === idx ? `0 0 12px ${alpha(d.c, 0.7 * fill)}` : "none" }} />
      ))}
    </div>
  );
};

const Label: React.FC<{ y: number; p: number; children: React.ReactNode; color?: string }> = ({ y, p, children, color = C.dim }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.22em", color }}>{children}</div>
);

// the full-screen card for test idx (0–6); sentence 0 = its name, 1 = use it when, 2 = the example
export const TestCard: React.FC<{ id: SceneId; idx: number }> = ({ id, idx }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene(id);
  const d = TESTS[idx];
  const N = s.sent(0).from;
  const U = s.sent(1).from;
  const E = s.sent(2).from;
  const panel = spr(N - 8, theme.spring.smooth);
  const name = spr(N - 4, theme.spring.pop);
  const sub = spr(N + 4, theme.spring.pop);
  const viz = ease(frame, [N, N + 40], [0, 1], theme.ease.inOut);
  const use1 = spr(U - 4, theme.spring.bouncy);
  const use2 = spr(U + 18, theme.spring.bouncy);
  const E2 = s.sent(3).from;
  const ex = spr(E - 4, theme.spring.bouncy);
  const ex2 = spr(E2 - 4, theme.spring.bouncy);
  const h0 = spr(E2 + 18, theme.spring.pop);
  const py = spr(E2 + 32, theme.spring.pop);
  const fs = d.name.length > 9 ? 88 : 100;
  return (
    <>
      <Progress idx={idx} />
      <div style={{ position: "absolute", left: 90, top: 260, transform: "translateY(-50%)", opacity: Math.min(1, spr(2, theme.spring.smooth) * 2), padding: "8px 20px", borderRadius: 999, background: alpha(d.c, 0.2), border: `2px solid ${d.c}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: d.c, whiteSpace: "nowrap" }}>{d.fam}</div>
      <div style={{ position: "absolute", right: 90, top: 260, transform: "translateY(-50%)", opacity: Math.min(1, spr(2, theme.spring.smooth) * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text }}>
        {String(idx + 1).padStart(2, "0")}
        <span style={{ color: C.dim }}> / 07</span>
      </div>
      {name > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: d.sub ? 352 : 380, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, name), [0, 1], [1.35, 1])})`, opacity: Math.min(1, name * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: fs, letterSpacing: "-0.02em", color: C.text, textShadow: glowText(d.c, 0.55), whiteSpace: "nowrap" }}>{d.name}</div>
      ) : null}
      {d.sub && sub > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 428, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, sub), [0, 1], [0.7, 1])})`, opacity: Math.min(1, sub * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: d.sub.length > 10 ? 34 : 46, letterSpacing: d.sub.length > 10 ? "0.08em" : "0", color: d.c, whiteSpace: "nowrap" }}>{d.sub}</div>
      ) : null}
      <div style={{ position: "absolute", left: 90, top: 480, width: 900, height: 910, boxSizing: "border-box", borderRadius: 36, background: `linear-gradient(180deg, ${alpha(d.c, 0.14)}, rgba(14,24,64,0.9) 45%)`, border: `2px solid ${alpha(d.c, 0.6)}`, opacity: Math.min(1, panel * 1.5), transform: `translateY(${(1 - Math.min(1, panel)) * 30}px)` }} />
      <div style={{ position: "absolute", left: 190, top: 524 }}>
        <TestViz kind={d.kind} w={700} h={250} color={d.c} p={viz} />
      </div>
      <Label y={822} p={use1} color={d.c}>
        USE IT WHEN
      </Label>
      {use1 > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 858, textAlign: "center", opacity: Math.min(1, use1 * 2), transform: `translateY(${(1 - Math.min(1, use1)) * 14}px)`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>{d.use[0]}</div>
      ) : null}
      {use2 > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 916, textAlign: "center", opacity: Math.min(1, use2 * 2), transform: `translateY(${(1 - Math.min(1, use2)) * 14}px)`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: d.use[1].length > 30 ? 30 : 34, color: d.c, whiteSpace: "nowrap" }}>{d.use[1]}</div>
      ) : null}
      <Label y={986} p={ex}>
        EXAMPLES
      </Label>
      {[ex, ex2].map((k, i) =>
        k > 0.001 ? (
          <div key={i} style={{ position: "absolute", left: 540, top: 1046 + i * 74, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, k), [0, 1], [0.7, 1])})`, opacity: Math.min(1, k * 2), display: "flex", alignItems: "center", gap: 14, padding: "10px 26px 10px 12px", borderRadius: 999, background: alpha(d.c, 0.16), border: `2px solid ${alpha(d.c, 0.8)}`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: d.ex[i].length > 34 ? 27 : 30, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ width: 36, height: 36, borderRadius: 18, background: d.c, color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>{i + 1}</span>
            {d.ex[i]}
          </div>
        ) : null,
      )}
      {h0 > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1196, textAlign: "center", opacity: Math.min(1, h0 * 2), transform: `translateY(${(1 - Math.min(1, h0)) * 10}px)`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: d.c }}>H0: </span>
          {d.h0}
        </div>
      ) : null}
      {py > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1300, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, py), [0, 1], [0.7, 1])})`, opacity: Math.min(1, py * 2), display: "flex", alignItems: "center", gap: 16, padding: "12px 24px", borderRadius: 16, background: "rgba(4,10,32,0.85)", border: `2px solid ${alpha(C.text, 0.2)}`, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: C.dim }}>{d.lib}</span>
          <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: d.py.length > 24 ? 26 : 30, color: C.green }}>{d.py}</span>
        </div>
      ) : null}
    </>
  );
};

// cheat-sheet row: question → test name + a tiny diagram
export const SheetRow: React.FC<{ y: number; t: Test; at: number; h?: number }> = ({ y, t, at, h = 80 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const ghost = ease(frame, [6, 16], [0, 1]);
  const p = spr(at - 6, theme.spring.bouncy);
  const n = spr(at, theme.spring.pop);
  const hot = frame >= at - 4 && frame < at + 24;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: y - h / 2, width: 900, height: h, boxSizing: "border-box", borderRadius: 22, background: p > 0.01 ? `linear-gradient(90deg, rgba(14,24,64,0.92) 48%, ${alpha(t.c, 0.18)})` : "transparent", border: p > 0.01 ? `3px solid ${n > 0.5 ? t.c : alpha(t.c, 0.45)}` : `3px dashed ${alpha(C.text, 0.18)}`, boxShadow: hot ? `0 0 26px ${alpha(t.c, 0.45)}` : "none", opacity: Math.max(ghost * 0.55, Math.min(1, p * 2)), transform: `translateX(${(1 - Math.min(1, p)) * -40}px)` }} />
      {p > 0.01 ? <div style={{ position: "absolute", left: 116, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), width: 420, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 23, color: C.text, lineHeight: 1.15 }}>{t.q}</div> : null}
      {n > 0.01 ? (
        <div style={{ position: "absolute", left: 556, top: y, transform: `translateY(-50%) scale(${interpolate(Math.min(1, n), [0, 1], [1.4, 1])})`, transformOrigin: "left center", opacity: Math.min(1, n * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: t.sheet.length > 12 ? 24 : 32, lineHeight: 1.05, color: t.c, textShadow: glowText(t.c, 0.45), width: t.sheet.length > 12 ? 230 : undefined, whiteSpace: t.sheet.length > 12 ? "normal" : "nowrap" }}>{t.sheet}</div>
      ) : null}
      {n > 0.01 ? (
        <div style={{ position: "absolute", left: 846, top: y - 24, opacity: Math.min(1, n * 2) }}>
          <TestViz kind={t.kind} w={124} h={44} color={t.c} p={Math.min(1, n)} tiny />
        </div>
      ) : null}
    </>
  );
};
