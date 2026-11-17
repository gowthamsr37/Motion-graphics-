// Data graphics. Every percentage chart uses a true 0–100 % scale with the 50 % coin-flip line,
// so differences are never exaggerated; effect sizes use percentage points on a labelled 0–5 scale.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COIN_RANGE, FORMATS, IPL_DECISION, SEASONS, simulateSeasons, STUDY } from "../data";
import { CLAMP, theme } from "../theme";
import { Source } from "./UI";

const C = theme.colors;
const fmt = (v: number, d = 1) => v.toFixed(d);

const useGrow = (at: number, cfg = { damping: 22, stiffness: 70, mass: 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

// ---------- S2: four formats on one honest 0–100 % scale ----------
export const FormatBars: React.FC<{ at: number[]; top: number; active?: number; dim?: number }> = ({ at, top, active = -1, dim = 0 }) => {
  const frame = useCurrentFrame();
  const x0 = 300, W = 640; // 0 % → 100 %
  const rowH = 168;
  const axisIn = interpolate(frame, [at[0] - 18, at[0] - 4], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const x50 = x0 + W * 0.5;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: rowH * 4 + 90, opacity: 1 - dim * 0.6 }}>
      <svg width={1080} height={rowH * 4 + 90} style={{ position: "absolute", inset: 0 }}>
        {/* 50 % line */}
        <line x1={x50} x2={x50} y1={6} y2={rowH * 4 + 30} stroke={C.cream} strokeWidth={2.5} strokeDasharray="7 9" opacity={0.75 * axisIn} />
        {/* axis ticks */}
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t} opacity={axisIn}>
            <line x1={x0 + (W * t) / 100} x2={x0 + (W * t) / 100} y1={rowH * 4 + 30} y2={rowH * 4 + 42} stroke={C.creamDim} strokeWidth={2} />
            <text x={x0 + (W * t) / 100} y={rowH * 4 + 72} textAnchor="middle" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={22}>
              {t}%
            </text>
          </g>
        ))}
        <line x1={x0} x2={x0 + W} y1={rowH * 4 + 30} y2={rowH * 4 + 30} stroke={C.creamFaint} strokeWidth={2} opacity={axisIn} />
      </svg>
      <div style={{ position: "absolute", left: x50 - 120, top: -40, width: 240, textAlign: "center", opacity: axisIn, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 21, letterSpacing: "0.2em", color: C.cream }}>
        50% = COIN FLIP
      </div>
      {FORMATS.map((f, i) => (
        <FormatRow key={f.key} i={i} f={f} at={at[i]} x0={x0} W={W} y={i * rowH + 26} hot={active === i} />
      ))}
    </div>
  );
};

const FormatRow: React.FC<{ i: number; f: (typeof FORMATS)[number]; at: number; x0: number; W: number; y: number; hot: boolean }> = ({ f, at, x0, W, y, hot }) => {
  const g = useGrow(at);
  const lab = useGrow(at - 6, theme.spring.snappy);
  const v = f.pct * g;
  const delta = f.pct - 50;
  const col = hot ? C.gold : C.cream;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1080, height: 150, opacity: lab }}>
      <div style={{ position: "absolute", left: 70, top: 6, fontFamily: theme.fonts.display, fontSize: 70, color: C.cream, lineHeight: 1 }}>{f.label}</div>
      <div style={{ position: "absolute", left: 72, top: 84, fontFamily: theme.fonts.body, fontSize: 20, color: C.creamDim, letterSpacing: "0.06em" }}>{f.n.toLocaleString("en-US")} decided matches</div>
      {/* track + fill */}
      <div style={{ position: "absolute", left: x0, top: 74, width: W, height: 30, borderRadius: 4, background: "rgba(237,228,204,0.10)" }} />
      <div
        style={{
          position: "absolute",
          left: x0,
          top: 74,
          width: (W * v) / 100,
          height: 30,
          borderRadius: 4,
          background: hot ? `linear-gradient(90deg, ${C.goldDeep}, ${C.gold})` : `linear-gradient(90deg, rgba(237,228,204,0.55), ${C.cream})`,
          boxShadow: hot ? `0 0 24px ${C.goldGlow}` : "none",
        }}
      />
      <div style={{ position: "absolute", left: x0 + (W * v) / 100 - 160, width: 160, top: -2, textAlign: "right", fontFamily: theme.fonts.display, fontSize: 66, color: col, lineHeight: 1, opacity: g, textShadow: hot ? `0 0 26px ${C.goldGlow}` : "none" }}>
        {fmt(v)}%
      </div>
      <div style={{ position: "absolute", left: x0 + (W * f.pct) / 100 + 14, top: 77, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 20, color: delta >= 0 ? C.gold : C.blue, opacity: interpolate(g, [0.8, 1], [0, 1], CLAMP), whiteSpace: "nowrap" }}>
        {delta >= 0 ? "+" : "−"}
        {fmt(Math.abs(delta))} PTS
      </div>
    </div>
  );
};

// ---------- S4: IPL decision outcome chart ----------
export const DecisionBars: React.FC<{ at: [number, number]; top: number }> = ({ at, top }) => {
  const x0 = 120, W = 840;
  const rows = [
    { label: "CHOSE TO BOWL FIRST", pct: IPL_DECISION.field, col: C.green, glow: C.greenGlow, at: at[0] },
    { label: "CHOSE TO BAT FIRST", pct: IPL_DECISION.bat, col: C.blue, glow: C.blueGlow, at: at[1] },
  ];
  const frame = useCurrentFrame();
  const axisIn = interpolate(frame, [at[0] - 12, at[0]], [0, 1], CLAMP);
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: 380 }}>
      <svg width={1080} height={380} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0 + W / 2} x2={x0 + W / 2} y1={0} y2={330} stroke={C.cream} strokeWidth={2.5} strokeDasharray="7 9" opacity={0.7 * axisIn} />
        <text x={x0 + W / 2} y={362} textAnchor="middle" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={21} letterSpacing="3" opacity={axisIn}>
          50%
        </text>
        <text x={x0} y={362} textAnchor="middle" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={21} opacity={axisIn}>
          0%
        </text>
        <text x={x0 + W} y={362} textAnchor="middle" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={21} opacity={axisIn}>
          100%
        </text>
      </svg>
      {rows.map((r, i) => (
        <DecisionRow key={r.label} r={r} y={i * 165 + 10} x0={x0} W={W} />
      ))}
    </div>
  );
};

const DecisionRow: React.FC<{ r: { label: string; pct: number; col: string; glow: string; at: number }; y: number; x0: number; W: number }> = ({ r, y, x0, W }) => {
  const g = useGrow(r.at);
  const lab = useGrow(r.at - 6, theme.spring.snappy);
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1080, height: 150, opacity: lab }}>
      <div style={{ position: "absolute", left: x0, top: 0, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 26, letterSpacing: "0.2em", color: r.col }}>{r.label}</div>
      <div style={{ position: "absolute", left: x0, top: 48, width: W, height: 64, borderRadius: 6, background: "rgba(237,228,204,0.08)" }} />
      <div style={{ position: "absolute", left: x0, top: 48, width: (W * r.pct * g) / 100, height: 64, borderRadius: 6, background: r.col, boxShadow: `0 0 30px ${r.glow}` }} />
      <div style={{ position: "absolute", left: x0 + 18, top: 46, fontFamily: theme.fonts.display, fontSize: 64, color: theme.colors.night, lineHeight: 1.05, opacity: interpolate(g, [0.3, 0.7], [0, 1], CLAMP) }}>
        {fmt(r.pct * g)}%
      </div>
    </div>
  );
};

// ---------- S5: two IPL seasons, equally scaled ----------
export const SeasonBars: React.FC<{ at: [number, number]; top: number; height?: number }> = ({ at, top, height = 560 }) => {
  const frame = useCurrentFrame();
  const axisIn = interpolate(frame, [at[0] - 14, at[0]], [0, 1], CLAMP);
  const bw = 230, xs = [150, 700];
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: height + 140 }}>
      <svg width={1080} height={height + 20} style={{ position: "absolute", inset: 0 }}>
        <line x1={90} x2={990} y1={height / 2} y2={height / 2} stroke={C.cream} strokeWidth={2.5} strokeDasharray="7 9" opacity={0.75 * axisIn} />
        <line x1={90} x2={990} y1={height} y2={height} stroke={C.creamFaint} strokeWidth={2} opacity={axisIn} />
        <text x={540} y={height / 2 - 14} textAnchor="middle" fill={C.cream} fontFamily={theme.fonts.body} fontWeight={600} fontSize={21} letterSpacing="4" opacity={axisIn}>
          50% LINE
        </text>
      </svg>
      {SEASONS.map((s, i) => {
        const g = useGrowInline(frame, at[i]);
        const h = (height * s.pct * g) / 100;
        const col = s.pct > 50 ? C.gold : C.blue;
        return (
          <div key={s.year} style={{ position: "absolute", left: xs[i], top: 0, width: bw, height: height + 140 }}>
            <div style={{ position: "absolute", left: 0, bottom: 140, width: bw, height: h, borderRadius: "8px 8px 0 0", background: `linear-gradient(180deg, ${col}, ${col}88)`, boxShadow: `0 0 34px ${col}55` }} />
            <div style={{ position: "absolute", left: 0, width: bw, bottom: 140 + h + 6, textAlign: "center", fontFamily: theme.fonts.display, fontSize: 104, color: col, lineHeight: 1, opacity: g }}>{Math.round(s.pct * g)}%</div>
            <div style={{ position: "absolute", left: 0, width: bw, bottom: 70, textAlign: "center", fontFamily: theme.fonts.display, fontSize: 64, color: C.cream, lineHeight: 1, opacity: interpolate(frame, [at[i] - 8, at[i]], [0, 1], CLAMP) }}>IPL {s.year}</div>
            <div style={{ position: "absolute", left: 0, width: bw, bottom: 34, textAlign: "center", fontFamily: theme.fonts.body, fontSize: 21, color: C.creamDim, opacity: interpolate(frame, [at[i] - 8, at[i]], [0, 1], CLAMP) }}>{s.n} decided matches</div>
          </div>
        );
      })}
    </div>
  );
};

const useGrowInline = (frame: number, at: number) => {
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping: 22, stiffness: 70, mass: 1 } });
};

// ---------- S5: what pure chance looks like over 70-match seasons ----------
export const SamplingDots: React.FC<{ at: number; top: number; count?: number; per?: number }> = ({ at, top, count = 48, per = 1.5 }) => {
  const frame = useCurrentFrame();
  const sims = React.useMemo(() => simulateSeasons(count, COIN_RANGE.n), [count]);
  const x0 = 110, W = 860; // 30 % → 70 %
  const X = (v: number) => x0 + ((v - 30) / 40) * W;
  const base = 330;
  const stacks: Record<number, number> = {};
  const bandIn = interpolate(frame, [at + count * per * 0.6, at + count * per * 0.6 + 14], [0, 1], CLAMP);
  const markIn = interpolate(frame, [at + count * per + 6, at + count * per + 18], [0, 1], CLAMP);
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: 520 }}>
      <svg width={1080} height={520} style={{ position: "absolute", inset: 0 }}>
        <rect x={X(COIN_RANGE.lo)} y={40} width={X(COIN_RANGE.hi) - X(COIN_RANGE.lo)} height={base - 30} fill="rgba(242,181,68,0.10)" stroke={C.gold} strokeDasharray="6 8" strokeWidth={2} opacity={bandIn} />
        <line x1={X(50)} x2={X(50)} y1={30} y2={base + 10} stroke={C.cream} strokeWidth={2} strokeDasharray="6 8" opacity={0.6} />
        <line x1={x0} x2={x0 + W} y1={base + 10} y2={base + 10} stroke={C.creamFaint} strokeWidth={2} />
        {[30, 40, 50, 60, 70].map((t) => (
          <text key={t} x={X(t)} y={base + 46} textAnchor="middle" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={22}>
            {t}%
          </text>
        ))}
        {sims.map((v, i) => {
          const b = Math.round(v / 1.4286) * 1.4286; // 1-match buckets (1/70)
          const key = Math.round(b * 10);
          stacks[key] = (stacks[key] ?? 0) + 1;
          const k = stacks[key];
          const t0 = at + i * per;
          const p = interpolate(frame, [t0, t0 + 8], [0, 1], { ...CLAMP, easing: theme.ease.out });
          if (p <= 0) return null;
          const y = base - 6 - (k - 1) * 17;
          return <circle key={i} cx={X(b)} cy={y - (1 - p) * 120} r={7} fill={C.cream} opacity={p * 0.9} />;
        })}
        {SEASONS.map((s, i) => (
          <g key={s.year} opacity={markIn}>
            <line x1={X(s.pct)} x2={X(s.pct)} y1={base + 10} y2={60} stroke={s.pct > 50 ? C.gold : C.blue} strokeWidth={4} />
            <rect x={X(s.pct) - 58} y={8} width={116} height={44} rx={6} fill={theme.colors.night} stroke={s.pct > 50 ? C.gold : C.blue} strokeWidth={2} />
            <text x={X(s.pct)} y={40} textAnchor="middle" fill={s.pct > 50 ? C.gold : C.blue} fontFamily={theme.fonts.display} fontSize={30}>
              {s.year} · {s.pct}%
            </text>
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 80, width: 920, top: base + 70, textAlign: "center", opacity: bandIn }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 27, letterSpacing: "0.08em", color: C.cream }}>EACH DOT: A SIMULATED 70-MATCH SEASON OF FAIR COIN TOSSES</div>
        <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontSize: 24, color: C.gold }}>95% of them land between 38% and 62%</div>
      </div>
    </div>
  );
};

// ---------- S6 / S7: estimated toss effect, in percentage points ----------
export const EffectBars: React.FC<{ rows: { label: string; v: number; at: number; approx?: boolean; hot?: boolean }[]; top: number; title?: string; titleAt?: number }> = ({ rows, top, title = "ESTIMATED TOSS EFFECT", titleAt }) => {
  const frame = useCurrentFrame();
  const x0 = 110, W = 860, max = 5;
  const t0 = titleAt ?? rows[0].at - 14;
  const axisIn = interpolate(frame, [t0, t0 + 12], [0, 1], CLAMP);
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: rows.length * 128 + 120, opacity: axisIn }}>
      <div style={{ position: "absolute", left: x0, top: 0, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, letterSpacing: "0.24em", color: C.gold }}>{title}</div>
      <div style={{ position: "absolute", left: x0, top: 36, fontFamily: theme.fonts.body, fontSize: 20, color: C.creamDim, letterSpacing: "0.04em" }}>change in win probability, percentage points · 2023 study, {STUDY.matches} matches</div>
      {rows.map((r, i) => {
        const g = useGrowInline(frame, r.at);
        const lab = interpolate(frame, [r.at - 8, r.at], [0, 1], CLAMP);
        const w = Math.max(6, (W * r.v * g) / max);
        const col = r.hot ? C.gold : C.cream;
        return (
          <div key={r.label} style={{ position: "absolute", left: 0, top: 84 + i * 128, width: 1080, height: 120, opacity: lab }}>
            <div style={{ position: "absolute", left: x0, top: 0, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 25, letterSpacing: "0.12em", color: C.cream }}>{r.label}</div>
            <div style={{ position: "absolute", left: x0, top: 42, width: W, height: 40, background: "rgba(237,228,204,0.08)", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: x0, top: 42, width: w, height: 40, borderRadius: 4, background: col, boxShadow: r.hot ? `0 0 28px ${C.goldGlow}` : "none" }} />
            <div style={{ position: "absolute", left: x0 + w + 16, top: 30, fontFamily: theme.fonts.display, fontSize: 60, color: col, lineHeight: 1 }}>
              {r.approx ? "≈0" : `+${fmt(r.v * g)}`}
              <span style={{ fontFamily: theme.fonts.body, fontSize: 22, marginLeft: 8, letterSpacing: "0.1em" }}>PTS</span>
            </div>
          </div>
        );
      })}
      <svg width={1080} height={40} style={{ position: "absolute", left: 0, top: 84 + rows.length * 128 - 6 }}>
        {[0, 1, 2, 3, 4, 5].map((t) => (
          <text key={t} x={x0 + (W * t) / max} y={24} textAnchor="middle" fill={C.creamDim} fontFamily={theme.fonts.body} fontSize={19}>
            {t}
          </text>
        ))}
      </svg>
    </div>
  );
};

// ---------- S8: how the pieces connect ----------
export const Flow: React.FC<{ at: number; top: number }> = ({ at, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const node = (i: number) => spring({ frame: frame - at - i * 7, fps, config: theme.spring.snappy });
  const N = [
    { t: "TOSS", sub: "50–50", x: 540, y: 60, col: C.gold },
    { t: "CHOICE", sub: "bat or bowl", x: 540, y: 300, col: C.cream },
    { t: "MATCH", sub: "result", x: 540, y: 540, col: C.cream },
    { t: "CONDITIONS", sub: "pitch · weather · format · dew", x: 300, y: 420, col: C.green },
  ];
  const arrow = (x1: number, y1: number, x2: number, y2: number, p: number, col: string, key: string, dashed = false) => {
    const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
    const a = Math.atan2(y2 - y1, x2 - x1);
    return (
      <g key={key} opacity={p > 0.02 ? 1 : 0}>
        <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={col} strokeWidth={5} strokeDasharray={dashed ? "10 9" : undefined} strokeLinecap="round" />
        <polygon points={`${ex},${ey} ${ex - Math.cos(a - 0.45) * 22},${ey - Math.sin(a - 0.45) * 22} ${ex - Math.cos(a + 0.45) * 22},${ey - Math.sin(a + 0.45) * 22}`} fill={col} opacity={p > 0.9 ? 1 : 0} />
      </g>
    );
  };
  const p = (i: number) => interpolate(frame, [at + 10 + i * 7, at + 24 + i * 7], [0, 1], { ...CLAMP, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: 700 }}>
      <svg width={1080} height={700} style={{ position: "absolute", inset: 0 }}>
        {arrow(540, 120, 540, 236, p(0), C.cream, "a1")}
        {arrow(540, 360, 540, 476, p(1), C.cream, "a2")}
        {arrow(380, 386, 470, 330, p(3), C.green, "a3")}
        {arrow(380, 452, 470, 526, p(4), C.green, "a4", true)}
      </svg>
      {N.map((n, i) => {
        const s = node(i === 3 ? 2.6 : i);
        return (
          <div key={n.t} style={{ position: "absolute", left: n.x - 170, top: n.y - 56, width: 340, height: 112, borderRadius: 14, background: theme.colors.panel, border: `2px solid ${n.col}`, boxShadow: `0 0 26px ${n.col}33`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: s, transform: `scale(${0.85 + 0.15 * s})` }}>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 58, color: n.col, lineHeight: 1 }}>{n.t}</div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 20, color: C.creamDim, letterSpacing: "0.08em", marginTop: 4 }}>{n.sub}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 640, top: 384, width: 380, opacity: p(4) }}>
        <Source style={{ fontSize: 21, color: C.cream }}>Conditions shape the choice <br />and how much it is worth</Source>
      </div>
    </div>
  );
};
