// Analytics graphics for Abhishek Sharma vs KL Rahul. Every chart is drawn to a true linear scale from zero.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { A_COL, R_COL } from "../data";
import { theme } from "../theme";
import { CLAMP } from "./Motion";
import { Lamp, Lettering } from "./Panel";

const C = theme.colors;
const F = theme.fonts;

/* ---------- emblem: a bat and ball (original graphic — no likeness of either player) ---------- */
export const BatEmblem: React.FC<{ size: number; color: string; glow?: number }> = ({ size, color, glow = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx={100} cy={100} r={92} fill="none" stroke={color} strokeWidth={4} opacity={0.35 + 0.4 * glow} />
    <g transform="rotate(-32 100 100)">
      <rect x={93} y={24} width={14} height={46} rx={6} fill={C.cream} opacity={0.85} />
      <path d="M80 70 L120 70 L122 164 Q100 180 78 164 Z" fill={color} />
      <path d="M96 76 L104 76 L104 156 L96 156 Z" fill={C.board} opacity={0.15} />
    </g>
    <circle cx={150} cy={148} r={13} fill={C.cream} />
    <path d="M140 144 Q150 150 160 144" stroke={C.red} strokeWidth={2.5} fill="none" />
  </svg>
);

/* ---------- Graph 1: career runs v balls faced — same height, 473 balls apart ---------- */
export const RunsBallsChart: React.FC<{ w: number; h: number; at: number; bracketAt: number }> = ({ w, h, at, bracketAt }) => {
  const frame = useCurrentFrame();
  const L = 92, R = 40, T = 40, B = 62;
  const pw = w - L - R, ph = h - T - B;
  const X = (b: number) => L + (pw * b) / 1700;
  const Y = (r: number) => T + ph * (1 - r / 2500);
  const pa = interpolate(frame, [at, at + 26], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const pr = interpolate(frame, [at + 6, at + 36], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const br = interpolate(frame, [bracketAt, bracketAt + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const lines = [
    { b: 1155, r: 2268, col: A_COL, p: pa, name: "ABHISHEK" },
    { b: 1628, r: 2265, col: R_COL, p: pr, name: "RAHUL" },
  ];
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {[0, 500, 1000, 1500, 2000, 2500].map((v) => (
        <g key={`y${v}`}>
          <line x1={L} x2={L + pw} y1={Y(v)} y2={Y(v)} stroke={v === 0 ? C.creamDim : C.panelEdge} strokeWidth={v === 0 ? 2.5 : 1.2} />
          <text x={L - 12} y={Y(v) + 8} textAnchor="end" fontFamily={F.display} fontSize={24} fill={C.creamDim}>
            {v}
          </text>
        </g>
      ))}
      {[0, 400, 800, 1200, 1600].map((v) => (
        <text key={`x${v}`} x={X(v)} y={T + ph + 32} textAnchor="middle" fontFamily={F.display} fontSize={24} fill={C.creamDim}>
          {v}
        </text>
      ))}
      <text x={L} y={T - 14} fontFamily={F.body} fontWeight={600} fontSize={16} letterSpacing="0.2em" fill={C.cream}>
        CAREER RUNS
      </text>
      <text x={L + pw} y={h - 4} textAnchor="end" fontFamily={F.body} fontWeight={600} fontSize={16} letterSpacing="0.2em" fill={C.cream}>
        BALLS FACED →
      </text>
      {lines.map((l) => (
        <g key={l.name}>
          <line x1={X(0)} y1={Y(0)} x2={X(l.b * l.p)} y2={Y(l.r * l.p)} stroke={l.col} strokeWidth={7} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${l.col}88)` }} />
          {l.p >= 1 && (
            <g>
              <circle cx={X(l.b)} cy={Y(l.r)} r={11} fill={l.col} />
              <line x1={X(l.b)} x2={X(l.b)} y1={Y(l.r) + 14} y2={Y(0)} stroke={l.col} strokeWidth={2} strokeDasharray="6 6" opacity={0.7} />
              <text x={X(l.b)} y={Y(0) - 12} textAnchor="middle" fontFamily={F.display} fontSize={30} fill={l.col}>
                {l.b}
              </text>
            </g>
          )}
        </g>
      ))}
      {/* the gap */}
      <g opacity={br}>
        <line x1={X(1155)} x2={X(1155) + (X(1628) - X(1155)) * br} y1={Y(2266) - 46} y2={Y(2266) - 46} stroke={C.cream} strokeWidth={3} />
        <line x1={X(1155)} x2={X(1155)} y1={Y(2266) - 58} y2={Y(2266) - 34} stroke={C.cream} strokeWidth={3} />
        <line x1={X(1628)} x2={X(1628)} y1={Y(2266) - 58} y2={Y(2266) - 34} stroke={C.cream} strokeWidth={3} opacity={br >= 1 ? 1 : 0} />
        <text x={(X(1155) + X(1628)) / 2} y={Y(2266) - 64} textAnchor="middle" fontFamily={F.display} fontSize={40} fill={C.cream}>
          473 BALLS
        </text>
      </g>
    </svg>
  );
};

/* ---------- Graph 2: strike-rate gauge (0–250) ---------- */
export const Gauge: React.FC<{ value: number; label: string; col: string; at: number; size: number }> = ({ value, label, col, at, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 50, mass: 1.2 } });
  const v = value * Math.min(1.02, p);
  const cx = size / 2, cy = size * 0.62, r = size * 0.42;
  const ang = (x: number) => Math.PI + (Math.PI * Math.min(250, x)) / 250;
  const pt = (x: number, rr: number) => ({ x: cx + Math.cos(ang(x)) * rr, y: cy + Math.sin(ang(x)) * rr });
  const arc = (x0: number, x1: number, rr: number) => {
    const a = pt(x0, rr), b = pt(x1, rr);
    return `M${a.x},${a.y} A${rr},${rr} 0 0 1 ${b.x},${b.y}`;
  };
  const tip = pt(v, r * 0.86);
  return (
    <svg width={size} height={size * 0.78} style={{ overflow: "visible" }}>
      <path d={arc(0, 250, r)} fill="none" stroke={C.plate} strokeWidth={26} strokeLinecap="round" />
      <path d={arc(0, Math.max(0.1, v), r)} fill="none" stroke={col} strokeWidth={26} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${col}99)` }} />
      {[0, 50, 100, 150, 200, 250].map((t) => {
        const a = pt(t, r + 26), b = pt(t, r + 40);
        const lab = pt(t, r + 62);
        return (
          <g key={t}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.creamDim} strokeWidth={2} />
            <text x={lab.x} y={lab.y + 8} textAnchor="middle" fontFamily={F.display} fontSize={22} fill={C.creamDim}>
              {t}
            </text>
          </g>
        );
      })}
      <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={C.cream} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={12} fill={C.cream} />
      <text x={cx} y={cy + 66} textAnchor="middle" fontFamily={F.display} fontSize={64} fill={col}>
        {v.toFixed(2)}
      </text>
      <text x={cx} y={cy + 100} textAnchor="middle" fontFamily={F.body} fontWeight={600} fontSize={20} letterSpacing="0.2em" fill={C.cream}>
        {label}
      </text>
    </svg>
  );
};

/* ---------- equal-ball race: runs from the same 100 balls at career strike rate ---------- */
export const BallRace: React.FC<{ from: number; to: number; w: number }> = ({ from, to, w }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, to], [0, 1], CLAMP);
  const balls = Math.round(100 * t);
  const rows = [
    { name: "ABHISHEK", sr: 196.36, col: A_COL },
    { name: "RAHUL", sr: 139.13, col: R_COL },
  ];
  const nameW = 190, valW = 120, barMax = w - nameW - valW - 20;
  return (
    <div style={{ width: w }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
        <Lettering size={22} font="body" color={C.creamDim} spacing="0.22em">
          SAME BALLS FACED
        </Lettering>
        <Lettering size={56} color={C.cream}>
          {String(balls).padStart(3, " ")}
        </Lettering>
        <Lettering size={22} font="body" color={C.creamDim} spacing="0.22em">
          / 100
        </Lettering>
      </div>
      {rows.map((r) => {
        const runs = (r.sr * balls) / 100;
        return (
          <div key={r.name} style={{ display: "flex", alignItems: "center", height: 74 }}>
            <div style={{ width: nameW }}>
              <Lettering size={40} color={r.col}>
                {r.name}
              </Lettering>
            </div>
            <div style={{ position: "relative", width: barMax, height: 40, background: C.plate, borderRadius: 5, boxShadow: `inset 0 0 0 1px ${C.panelEdge}` }}>
              {[50, 100, 150].map((v) => (
                <div key={v} style={{ position: "absolute", left: (barMax * v) / 200, top: -6, bottom: -6, width: 1, background: C.panelEdge }} />
              ))}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (barMax * runs) / 200, borderRadius: 5, background: r.col, boxShadow: `0 0 14px ${r.col}77` }} />
            </div>
            <div style={{ width: valW, textAlign: "right" }}>
              <Lettering size={50} color={r.col}>
                {Math.round(runs)}
              </Lettering>
            </div>
          </div>
        );
      })}
      <div style={{ position: "relative", marginLeft: nameW, width: barMax, height: 26 }}>
        {[0, 50, 100, 150, 200].map((v) => (
          <div key={v} style={{ position: "absolute", left: (barMax * v) / 200 - 30, width: 60, textAlign: "center" }}>
            <Lettering size={18} color={C.creamDim}>
              {v}
            </Lettering>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- six frequency: balls tick by; a six lands every 7.26 / 16.44 balls (career rate) ---------- */
export const SixStrip: React.FC<{ every: number; col: string; at: number; n: number; w: number; label: string }> = ({ every, col, at, n, w, label }) => {
  const frame = useCurrentFrame();
  const shown = Math.floor(interpolate(frame, [at, at + 40], [0, n], CLAMP));
  const sixes = new Set(Array.from({ length: Math.floor(n / every) }, (_, k) => Math.round((k + 1) * every)));
  const gap = 4;
  const d = (w - 230 - gap * (n - 1)) / n;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 214 }}>
        <Lettering size={34} color={col}>
          {label}
        </Lettering>
      </div>
      <div style={{ display: "flex", gap }}>
        {Array.from({ length: n }).map((_, i) => {
          const ball = i + 1;
          const on = ball <= shown;
          const six = sixes.has(ball);
          return (
            <div
              key={i}
              style={{
                width: d,
                height: d,
                borderRadius: d,
                background: on ? (six ? col : "#3a463e") : C.plate,
                boxShadow: on && six ? `0 0 14px ${col}` : `inset 0 0 0 1px ${C.panelEdge}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: on && six ? `scale(${1.35})` : undefined,
              }}
            >
              {on && six && (
                <span style={{ fontFamily: F.display, fontSize: d * 0.8, color: C.board, lineHeight: 1 }}>6</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- paired comparison row on one scale ---------- */
export const PairRow: React.FC<{ label: string; a: number; r: number; max: number; at: number; w: number; fmt?: (v: number) => string; note?: string }> = ({ label, a, r, max, at, w, fmt = (v) => String(Math.round(v)), note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 70, mass: 1 } });
  const on = interpolate(p, [0, 0.25], [0, 1], CLAMP);
  const labelW = 300, valW = 116;
  const barMax = w - labelW - valW;
  const bar = (v: number, col: string) => (
    <div style={{ display: "flex", alignItems: "center", height: 34 }}>
      <div style={{ width: barMax, height: 22, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (barMax * v * Math.min(1, p)) / max, background: col, borderRadius: 4, boxShadow: `0 0 10px ${col}66` }} />
      </div>
      <div style={{ width: valW, textAlign: "right" }}>
        <Lettering size={36} color={col}>
          {fmt(v * Math.min(1, p))}
        </Lettering>
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", opacity: on, width: w }}>
      <div style={{ width: labelW, paddingRight: 14 }}>
        <Lettering size={30} color={C.cream}>
          {label}
        </Lettering>
        {note && (
          <div style={{ marginTop: 4 }}>
            <Lettering size={15} font="body" color={C.creamDim} spacing="0.12em">
              {note}
            </Lettering>
          </div>
        )}
      </div>
      <div>
        {bar(a, A_COL)}
        {bar(r, R_COL)}
      </div>
    </div>
  );
};

/* ---------- share ring ---------- */
export const Ring: React.FC<{ pct: number; col: string; at: number; size: number; label: string }> = ({ pct, col, at, size, label }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const r = size / 2 - 16, c = 2 * Math.PI * r;
  const v = pct * p;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.plate} strokeWidth={22} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={22} strokeDasharray={`${(c * v) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="butt" style={{ filter: `drop-shadow(0 0 8px ${col}88)` }} />
        <text x={size / 2} y={size / 2 + 18} textAnchor="middle" fontFamily={F.display} fontSize={size * 0.26} fill={col}>
          {v.toFixed(1)}%
        </text>
      </svg>
      <Lettering size={28} color={col}>
        {label}
      </Lettering>
    </div>
  );
};

/* ---------- Graph 5: strike rate by balls faced (available-match SAMPLE) ---------- */
export const PhaseChart: React.FC<{ a: number[]; r: number[]; labels: string[]; atA: number; atR: number; focusAt: number; w: number; h: number }> = ({ a, r, labels, atA, atR, focusAt, w, h }) => {
  const frame = useCurrentFrame();
  const L = 84, R = 40, T = 36, B = 70;
  const pw = w - L - R, ph = h - T - B;
  const n = labels.length;
  const X = (i: number) => L + (pw * (i + 0.5)) / n;
  const Y = (v: number) => T + ph * (1 - v / 250);
  const focus = interpolate(frame, [focusAt, focusAt + 12], [0, 1], CLAMP);
  const series = [
    { v: a, col: A_COL, at: atA },
    { v: r, col: R_COL, at: atR },
  ];
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {/* first ten balls highlight */}
      <rect x={L} y={T} width={(pw * 2) / n} height={ph} fill={C.amber} opacity={0.05 + 0.1 * focus} />
      <text x={L + pw / n} y={T + 30} textAnchor="middle" fontFamily={F.body} fontWeight={600} fontSize={20} letterSpacing="0.22em" fill={C.amber} opacity={0.4 + 0.6 * focus}>
        FIRST 10 BALLS
      </text>
      {[0, 50, 100, 150, 200, 250].map((v) => (
        <g key={v}>
          <line x1={L} x2={L + pw} y1={Y(v)} y2={Y(v)} stroke={v === 0 ? C.creamDim : C.panelEdge} strokeWidth={v === 0 ? 2.5 : 1.2} />
          <text x={L - 12} y={Y(v) + 8} textAnchor="end" fontFamily={F.display} fontSize={24} fill={C.creamDim}>
            {v}
          </text>
        </g>
      ))}
      <text x={L} y={T - 12} fontFamily={F.body} fontWeight={600} fontSize={16} letterSpacing="0.2em" fill={C.cream}>
        STRIKE RATE
      </text>
      {labels.map((l, i) => (
        <text key={l} x={X(i)} y={T + ph + 34} textAnchor="middle" fontFamily={F.display} fontSize={28} fill={C.cream}>
          {l}
        </text>
      ))}
      <text x={L + pw / 2} y={h + 4} textAnchor="middle" fontFamily={F.body} fontWeight={600} fontSize={16} letterSpacing="0.2em" fill={C.creamDim}>
        BALLS FACED IN THE INNINGS
      </text>
      {series.map((s, k) => {
        const p = interpolate(frame, [s.at, s.at + 40], [0, n - 1], { easing: theme.ease.inOut, ...CLAMP });
        const pts = s.v.map((v, i) => ({ x: X(i), y: Y(v) }));
        const i0 = Math.floor(p), fr = p - i0;
        const drawn = pts.slice(0, i0 + 1);
        if (i0 < n - 1) drawn.push({ x: pts[i0].x + (pts[i0 + 1].x - pts[i0].x) * fr, y: pts[i0].y + (pts[i0 + 1].y - pts[i0].y) * fr });
        if (frame < s.at) return null;
        return (
          <g key={k}>
            <path d={drawn.map((q, i) => `${i ? "L" : "M"}${q.x},${q.y}`).join(" ")} fill="none" stroke={s.col} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${s.col}88)` }} />
            {pts.slice(0, Math.floor(p + 0.001) + 1).map((q, i) => (
              <g key={i}>
                <circle cx={q.x} cy={q.y} r={9} fill={s.col} />
                <text x={q.x} y={q.y + (k === 0 ? -18 : 38)} textAnchor="middle" fontFamily={F.display} fontSize={26} fill={s.col}>
                  {s.v[i] % 1 === 0 ? s.v[i].toFixed(1) : s.v[i].toFixed(2).replace(/0$/, "")}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- simulation board: balls 0→18, runs at the batter's powerplay strike rate ---------- */
export const SimBoard: React.FC<{ name: string; col: string; target: number; from: number; to: number; w: number; h: number }> = ({ name, col, target, from, to, w, h }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, to], [0, 1], CLAMP);
  const balls = Math.round(18 * t);
  const runs = target * t;
  return (
    <div style={{ width: w, height: h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Lettering size={44} color={col}>
        {name}
      </Lettering>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: F.display, fontSize: 130, color: col, textShadow: `0 0 ${20 * t}px ${col}88`, lineHeight: 1 }}>{runs.toFixed(1)}</span>
      </div>
      <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
        RUNS
      </Lettering>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", width: 6 * 30, justifyContent: "center" }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{ width: 24, height: 24, borderRadius: 24, background: i < balls ? col : C.plate, boxShadow: `inset 0 0 0 1px ${C.panelEdge}`, opacity: i < balls ? 0.9 : 1 }} />
        ))}
      </div>
      <Lettering size={22} font="body" color={C.cream} spacing="0.2em">
        {balls} / 18 BALLS
      </Lettering>
    </div>
  );
};

export const Tag: React.FC<{ text: string; col?: string; on?: number; size?: number }> = ({ text, col = C.creamDim, on = 1, size = 16 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 5px", borderRadius: 5, boxShadow: `inset 0 0 0 1.5px ${col}`, background: "rgba(10,15,12,0.7)", opacity: on }}>
    <Lamp color={col} glow="transparent" on={1} size={size * 0.6} />
    <Lettering size={size} font="body" weight={600} color={col} spacing="0.16em">
      {text}
    </Lettering>
  </div>
);
