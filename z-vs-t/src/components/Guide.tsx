// Complete-guide kit (cheat sheet v3): the twelve distribution cards (family, shape, use-it-when line, three examples,
// key numbers and the SciPy / scikit-learn one-liner), the full-screen DistCard template with a 12-step progress bar,
// the small MiniCard used by the hook and the cover, and a bookmark ("save") icon.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease, useSpr } from "./Motion";
import { type Kind, Shape } from "./Pick";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import type { SceneId } from "../timing";

const C = theme.colors;
export const COUNTS = C.cyan;
export const MEAS = C.violet;
export const TEST = C.orange;
export const BONUS = C.green;

export type Dist = {
  kind: Kind;
  name: string; // on the card
  short: string; // on the mini cards / cheat sheet
  fam: "COUNT" | "MEASUREMENT" | "TESTING TOOL" | "BONUS";
  c: string;
  use: string;
  ex: [string, string, string];
  key: string;
  lib: "SCIPY" | "SKLEARN";
  py: string;
  q: string; // the cheat-sheet question
};

export const DIST: Dist[] = [
  { kind: "bernoulli", name: "BERNOULLI", short: "BERNOULLI", fam: "COUNT", c: COUNTS, use: "ONE try, two outcomes: yes or no", ex: ["Coin flip", "Buy or not", "Spam or not"], key: "p = chance of yes  ·  mean = p", lib: "SCIPY", py: "stats.bernoulli(p)", q: "One yes/no try?" },
  { kind: "binomial", name: "BINOMIAL", short: "BINOMIAL", fam: "COUNT", c: COUNTS, use: "Number of YESES in a fixed number of tries", ex: ["Heads in 10 flips", "Buyers out of 100", "Defects in a batch"], key: "n tries, chance p  ·  mean = n × p", lib: "SCIPY", py: "stats.binom(n, p)", q: "Yeses in n tries?" },
  { kind: "geometric", name: "GEOMETRIC", short: "GEOMETRIC", fam: "COUNT", c: COUNTS, use: "Number of TRIES until the first success", ex: ["Calls until a sale", "Rolls until a 6", "Ads until a click"], key: "chance p  ·  mean = 1 / p tries", lib: "SCIPY", py: "stats.geom(p)", q: "Tries until a success?" },
  { kind: "poisson", name: "POISSON", short: "POISSON", fam: "COUNT", c: COUNTS, use: "How many EVENTS in a stretch of time", ex: ["Calls per hour", "Visits per minute", "Typos per page"], key: "rate = average count  ·  mean = variance", lib: "SCIPY", py: "stats.poisson(mu)", q: "Events per time?" },
  { kind: "uniform", name: "UNIFORM", short: "UNIFORM", fam: "COUNT", c: COUNTS, use: "EVERY outcome equally likely", ex: ["Fair dice roll", "Random number", "Lottery draw"], key: "range a to b  ·  mean = (a + b) / 2", lib: "SCIPY", py: "stats.randint(1, 7)", q: "All outcomes equal?" },
  { kind: "normal", name: "NORMAL", short: "NORMAL", fam: "MEASUREMENT", c: MEAS, use: "Values CLUSTER around an average", ex: ["Heights", "Exam scores", "Measurement errors"], key: "mean and SD  ·  68-95-99.7 rule", lib: "SCIPY", py: "stats.norm(mean, sd)", q: "Clusters around an average?" },
  { kind: "exp", name: "EXPONENTIAL", short: "EXPONENTIAL", fam: "MEASUREMENT", c: MEAS, use: "The WAITING time until the next event", ex: ["Between customers", "Until a failure", "Between calls"], key: "mean wait = 1 / rate  ·  memoryless", lib: "SCIPY", py: "stats.expon(scale=1/rate)", q: "Waiting time?" },
  { kind: "lognormal", name: "LOG-NORMAL", short: "LOG-NORMAL", fam: "MEASUREMENT", c: MEAS, use: "POSITIVE values, long right tail, growth that multiplies", ex: ["Incomes", "House prices", "Stock prices"], key: "log(x) is normal  ·  mean > median", lib: "SCIPY", py: "stats.lognorm(s, scale=median)", q: "Positive, long right tail?" },
  { kind: "pareto", name: "PARETO", short: "PARETO", fam: "MEASUREMENT", c: MEAS, use: "A FEW GIANTS hold most of the total", ex: ["Wealth", "City sizes", "Sales per product"], key: "heavy tail  ·  the 80/20 rule", lib: "SCIPY", py: "stats.pareto(b, scale=xmin)", q: "A few giants hold most?" },
  { kind: "t", name: "t-DISTRIBUTION", short: "t-DIST", fam: "TESTING TOOL", c: TEST, use: "Like the bell, FATTER tails, for small samples", ex: ["Small-sample means", "t-tests", "Confidence intervals"], key: "df = n − 1  ·  near normal by about 30", lib: "SCIPY", py: "stats.t(df)", q: "Small-sample average?" },
  { kind: "chisq", name: "CHI-SQUARE", short: "CHI-SQUARE", fam: "TESTING TOOL", c: TEST, use: "Do COUNTS match what you expected?", ex: ["Is a dice fair?", "Category vs category", "Goodness of fit"], key: "df  ·  always positive  ·  skewed right", lib: "SCIPY", py: "stats.chi2(df)", q: "Counts vs expected?" },
  { kind: "bimodal", name: "BIMODAL", short: "BIMODAL", fam: "BONUS", c: BONUS, use: "TWO humps: two groups mixed together", ex: ["Lunch + dinner rush", "Two customer types", "Mixed batches"], key: "split the groups first", lib: "SKLEARN", py: "GaussianMixture(2)", q: "Two humps?" },
];

export const Bookmark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size * 0.78} height={size} viewBox="0 0 78 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 10px ${alpha(color, 0.6)})` }}>
    <path d="M8 6 H70 V94 L39 70 L8 94 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

export const MiniCard: React.FC<{ d: Dist; x: number; y: number; p: number; w?: number; h?: number; wob?: number }> = ({ d, x, y, p, w = 280, h = 140, wob = 0 }) =>
  p > 0.001 ? (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])}) rotate(${wob}deg)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 22, background: `linear-gradient(180deg, ${alpha(d.c, 0.16)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(d.c, 0.8)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <Shape kind={d.kind} w={w * 0.55} h={h * 0.36} color={d.c} p={Math.min(1, p)} />
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: d.short.length > 9 ? w * 0.079 : w * 0.093, color: C.text }}>{d.short}</div>
    </div>
  ) : null;

// 12-step progress bar (cards 1–12)
const Progress: React.FC<{ idx: number }> = ({ idx }) => {
  const frame = useCurrentFrame();
  const fill = ease(frame, [2, 14], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 90, top: 196, width: 900, display: "flex", gap: 6 }}>
      {DIST.map((d, i) => (
        <div key={d.kind} style={{ flex: 1, height: 10, borderRadius: 5, background: i < idx ? alpha(DIST[i].c, 0.55) : i === idx ? alpha(d.c, 0.25 + 0.75 * fill) : alpha(C.text, 0.14), boxShadow: i === idx ? `0 0 12px ${alpha(d.c, 0.7 * fill)}` : "none" }} />
      ))}
    </div>
  );
};

const Label: React.FC<{ y: number; p: number; children: React.ReactNode; color?: string }> = ({ y, p, children, color = C.dim }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.22em", color }}>{children}</div>
);

// the full-screen card for distribution idx (0–11); sentence 0 = its name, 1 = use it when, 2 = examples
export const DistCard: React.FC<{ id: SceneId; idx: number }> = ({ id, idx }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene(id);
  const d = DIST[idx];
  const N = s.sent(0).from;
  const U = s.sent(1).from;
  const E = s.sent(2).from;
  const EL = Math.max(30, s.sent(2).to - E);
  const panel = spr(N - 8, theme.spring.smooth);
  const name = spr(N - 4, theme.spring.pop);
  const shape = ease(frame, [N - 2, N + 30], [0, 1], theme.ease.inOut);
  const use = spr(U - 4, theme.spring.bouncy);
  const key = spr(U + 16, theme.spring.pop);
  const py = spr(E + 4, theme.spring.pop);
  const fs = d.name.length > 11 ? 82 : 100;
  return (
    <>
      <Progress idx={idx} />
      <div style={{ position: "absolute", left: 90, top: 280, transform: "translateY(-50%)", opacity: Math.min(1, spr(2, theme.spring.smooth) * 2), padding: "8px 20px", borderRadius: 999, background: alpha(d.c, 0.2), border: `2px solid ${d.c}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: d.c }}>{d.fam}</div>
      <div style={{ position: "absolute", right: 90, top: 280, transform: "translateY(-50%)", opacity: Math.min(1, spr(2, theme.spring.smooth) * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text }}>
        {String(idx + 1).padStart(2, "0")}
        <span style={{ color: C.dim }}> / 12</span>
      </div>
      {name > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 392, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, name), [0, 1], [1.35, 1])})`, opacity: Math.min(1, name * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: fs, letterSpacing: "-0.02em", color: C.text, textShadow: glowText(d.c, 0.55), whiteSpace: "nowrap" }}>{d.name}</div>
      ) : null}
      {/* the card panel */}
      <div style={{ position: "absolute", left: 90, top: 480, width: 900, height: 910, boxSizing: "border-box", borderRadius: 36, background: `linear-gradient(180deg, ${alpha(d.c, 0.14)}, rgba(14,24,64,0.9) 45%)`, border: `2px solid ${alpha(d.c, 0.6)}`, opacity: Math.min(1, panel * 1.5), transform: `translateY(${(1 - Math.min(1, panel)) * 30}px)` }} />
      <div style={{ position: "absolute", left: 190, top: 520 }}>
        <Shape kind={d.kind} w={700} h={240} color={d.c} p={shape} />
      </div>
      <Label y={808} p={use} color={d.c}>
        USE IT WHEN
      </Label>
      {use > 0.001 ? (
        <div style={{ position: "absolute", left: 130, width: 820, top: 846, textAlign: "center", opacity: Math.min(1, use * 2), transform: `translateY(${(1 - Math.min(1, use)) * 14}px)`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: d.use.length > 40 ? 34 : 38, lineHeight: 1.2, color: C.text }}>{d.use}</div>
      ) : null}
      <Label y={984} p={spr(E - 6, theme.spring.smooth)}>
        REAL EXAMPLES
      </Label>
      <div style={{ position: "absolute", left: 120, width: 840, top: 1026, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {d.ex.map((t, i) => {
          const p = spr(E - 4 + Math.round((i * EL) / 3), theme.spring.pop);
          return (
            <div key={t} style={{ opacity: Math.min(1, p * 2), transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, padding: "10px 22px", borderRadius: 999, background: alpha(d.c, 0.16), border: `2px solid ${alpha(d.c, 0.8)}`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{t}</div>
          );
        })}
      </div>
      {key > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1196, textAlign: "center", opacity: Math.min(1, key * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 20, letterSpacing: "0.22em", color: d.c }}>KEY </span> {d.key}
        </div>
      ) : null}
      {py > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1300, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, py), [0, 1], [0.7, 1])})`, opacity: Math.min(1, py * 2), display: "flex", alignItems: "center", gap: 16, padding: "12px 24px", borderRadius: 16, background: "rgba(4,10,32,0.85)", border: `2px solid ${alpha(C.text, 0.2)}`, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: C.dim }}>{d.lib}</span>
          <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 30, color: C.green }}>{d.py}</span>
        </div>
      ) : null}
    </>
  );
};
