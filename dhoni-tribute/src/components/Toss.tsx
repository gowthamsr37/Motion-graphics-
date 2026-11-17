// Graphics for "Does winning the toss win matches?" — every number on screen comes from the analysis (see README).
import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";
import { Lamp, Lettering } from "./Panel";

const C = theme.colors;
export const GREEN = "#38B47A";
export const RED = "#D9483B";
export const AMBER = "#F2A93B";
export const DEW = "#9CC9E3";

const fmt = (n: number) => n.toLocaleString("en-US");

/* ---------- verdict / emphasis stamp ---------- */
export const Stamp: React.FC<{ text: string; at: number; color?: string; size?: number; rotate?: number }> = ({ text, at, color = C.cream, size = 120, rotate = -6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 220, mass: 0.7 } });
  if (frame < at) return null;
  return (
    <div style={{ display: "inline-block", padding: `${size * 0.1}px ${size * 0.22}px ${size * 0.06}px`, border: `${Math.max(5, size * 0.05)}px solid ${color}`, borderRadius: size * 0.1, background: "rgba(10,15,12,0.92)", boxShadow: `0 0 40px ${color}66`, transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) rotate(${rotate}deg)`, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
      <Lettering size={size} color={color}>
        {text}
      </Lettering>
    </div>
  );
};

/* ---------- the coin ---------- */
const CoinFace: React.FC<{ size: number; side: "H" | "T" }> = ({ size, side }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block" }}>
    <defs>
      <radialGradient id="coinG" cx="36%" cy="30%" r="80%">
        <stop offset="0" stopColor="#FCE7A8" />
        <stop offset="0.42" stopColor="#E2AB45" />
        <stop offset="1" stopColor="#94601A" />
      </radialGradient>
      <path id="coinRing" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0" />
    </defs>
    <circle cx={100} cy={100} r={98} fill="url(#coinG)" stroke="#6E450F" strokeWidth={3} />
    <circle cx={100} cy={100} r={88} fill="none" stroke="#8A5A1A" strokeWidth={2.5} opacity={0.8} />
    <circle cx={100} cy={100} r={60} fill="none" stroke="#8A5A1A" strokeWidth={2} strokeDasharray="3 5" opacity={0.7} />
    <text fontFamily={theme.fonts.body} fontWeight={600} fontSize={12.5} letterSpacing={4} fill="#6E450F">
      <textPath href="#coinRing">BEYOND THE SCOREBOARD · MYTH BUSTERS ·</textPath>
    </text>
    <text x={100} y={131} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={92} fill="#6E450F" style={{ paintOrder: "stroke" }} stroke="#FCE7A8" strokeWidth={1.2}>
      {side}
    </text>
  </svg>
);

// angle: rotation about the horizontal axis (radians). The rim shows when the coin is edge-on.
export const Coin: React.FC<{ size: number; angle: number; glow?: number }> = ({ size, angle, glow = 0 }) => {
  const c = Math.cos(angle);
  const sy = Math.max(0.035, Math.abs(c));
  const thick = size * 0.075 * Math.abs(Math.sin(angle)) + size * 0.012;
  const layers = 7;
  return (
    <div style={{ position: "relative", width: size, height: size, filter: glow > 0 ? `drop-shadow(0 0 ${30 * glow}px ${C.amberGlow})` : undefined }}>
      {Array.from({ length: layers }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            top: (size - size * sy) / 2 + (thick * (i + 1)) / layers,
            width: size,
            height: size * sy,
            borderRadius: "50%",
            background: i === layers - 1 ? "#5E3B0C" : "#8A5A1A",
          }}
        />
      ))}
      <div style={{ position: "absolute", inset: 0, transform: `scaleY(${sy})` }}>
        <CoinFace size={size} side={c >= 0 ? "H" : "T"} />
      </div>
    </div>
  );
};

/* ---------- coin-flip simulation: running % heads for many sequences of flips ---------- */
const mulberry = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const Funnel: React.FC<{ w: number; h: number; drawAt: number; drawLen: number; bandAt: number; zoneAt: number; N?: number; runs?: number }> = ({ w, h, drawAt, drawLen, bandAt, zoneAt, N = 2500, runs = 14 }) => {
  const frame = useCurrentFrame();
  const L = 96, R = 40, T = 30, B = 76;
  const pw = w - L - R, ph = h - T - B;
  const lo = 25, hi = 75;
  const X = (n: number) => L + pw * Math.sqrt(n / N); // square-root scale so the early wobble is visible
  const Y = (p: number) => T + ph * (1 - (Math.min(hi, Math.max(lo, p)) - lo) / (hi - lo));
  const step = 5;
  const series = useMemo(() => {
    const out: number[][] = [];
    for (let r = 0; r < runs; r++) {
      const rnd = mulberry(1013 + r * 7919);
      let heads = 0;
      const pts: number[] = [];
      for (let n = 1; n <= N; n++) {
        heads += rnd() < 0.5 ? 1 : 0;
        if (n % step === 0) pts.push((100 * heads) / n);
      }
      out.push(pts);
    }
    return out;
  }, [N, runs]);
  const p = theme.ease.soft(interpolate(frame, [drawAt, drawAt + drawLen], [0, 1], CLAMP));
  const nNow = Math.round(N * p * p);
  const k = Math.max(1, Math.floor(nNow / step));
  const band = interpolate(frame, [bandAt, bandAt + 14], [0, 1], CLAMP);
  const zone = interpolate(frame, [zoneAt, zoneAt + 12], [0, 1], CLAMP);
  const env = (sgn: number) =>
    Array.from({ length: 120 }, (_, i) => {
      const n = 10 + ((N - 10) * (i / 119) ** 2);
      return `${X(n).toFixed(1)},${Y(50 + sgn * (98 / Math.sqrt(n))).toFixed(1)}`;
    }).join(" ");
  const ends = series.map((s) => s[s.length - 1]);
  const inside = ends.filter((e) => e >= 48 && e <= 52).length;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {/* coin-flip zone */}
      <rect x={L} y={Y(52)} width={pw} height={Y(48) - Y(52)} fill={GREEN} opacity={0.1 + 0.18 * band + 0.1 * zone} />
      <line x1={L} x2={L + pw} y1={Y(52)} y2={Y(52)} stroke={GREEN} strokeWidth={2.5} opacity={band} />
      <line x1={L} x2={L + pw} y1={Y(48)} y2={Y(48)} stroke={GREEN} strokeWidth={2.5} opacity={band} />
      {[30, 40, 50, 60, 70].map((v) => (
        <g key={v}>
          <line x1={L} x2={L + pw} y1={Y(v)} y2={Y(v)} stroke={v === 50 ? C.creamDim : C.panelEdge} strokeWidth={v === 50 ? 2 : 1.2} strokeDasharray={v === 50 ? "8 8" : undefined} />
          <text x={L - 12} y={Y(v) + 9} textAnchor="end" fontFamily={theme.fonts.display} fontSize={28} fill={C.creamDim}>
            {v}%
          </text>
        </g>
      ))}
      {[0, 100, 500, 1000, 2500].map((n) => (
        <text key={n} x={X(n)} y={T + ph + 36} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={28} fill={C.creamDim}>
          {fmt(n)}
        </text>
      ))}
      <text x={L + pw / 2} y={h + 6} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={600} fontSize={18} letterSpacing="0.2em" fill={C.cream}>
        COIN FLIPS
      </text>
      <text x={L} y={T - 12} fontFamily={theme.fonts.body} fontWeight={600} fontSize={18} letterSpacing="0.2em" fill={C.cream}>
        % HEADS SO FAR
      </text>
      {/* the 95% envelope: where chance alone keeps you */}
      <polyline points={env(1)} fill="none" stroke={GREEN} strokeWidth={2} strokeDasharray="5 7" opacity={0.75 * band} />
      <polyline points={env(-1)} fill="none" stroke={GREEN} strokeWidth={2} strokeDasharray="5 7" opacity={0.75 * band} />
      {series.map((s, r) => {
        const pts = s.slice(0, k).map((v, i) => `${X((i + 1) * step).toFixed(1)},${Y(v).toFixed(1)}`);
        if (pts.length < 2) return null;
        const last = s[k - 1];
        return (
          <g key={r}>
            <polyline points={pts.join(" ")} fill="none" stroke={r === 0 ? AMBER : C.cream} strokeWidth={r === 0 ? 4 : 2} opacity={r === 0 ? 1 : 0.45} strokeLinejoin="round" />
            <circle cx={X(k * step)} cy={Y(last)} r={r === 0 ? 8 : 4} fill={r === 0 ? AMBER : C.cream} opacity={r === 0 ? 1 : 0.7} />
          </g>
        );
      })}
      <g opacity={band}>
        <text x={L + pw - 10} y={Y(52) - 16} textAnchor="end" fontFamily={theme.fonts.display} fontSize={40} fill={GREEN}>
          48–52%
        </text>
      </g>
      <g opacity={zone}>
        <text x={L + pw - 6} y={Y(43)} textAnchor="end" fontFamily={theme.fonts.display} fontSize={44} fill={GREEN}>
          ↑ THE COIN-FLIP ZONE
        </text>
      </g>
      {/* live counter */}
      <g opacity={interpolate(frame, [drawAt, drawAt + 6], [0, 1], CLAMP)}>
        <text x={L + pw - 6} y={T + 40} textAnchor="end" fontFamily={theme.fonts.display} fontSize={44} fill={C.cream}>
          {fmt(nNow)} FLIPS
        </text>
        <text x={L + pw - 6} y={T + 78} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={18} letterSpacing="0.16em" fill={C.creamDim}>
          {runs} SEPARATE COINS
        </text>
      </g>
      <g opacity={band * (p >= 1 ? 1 : 0)}>
        <text x={L + pw - 6} y={Y(39)} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={18} letterSpacing="0.14em" fill={C.creamDim}>
          {inside} OF {runs} END INSIDE · 95% DO IN THEORY
        </text>
      </g>
    </svg>
  );
};

/* ---------- one format on its own coin-flip scale ---------- */
export const ZoneRow: React.FC<{
  w: number;
  label: string;
  sub: string;
  band: [number, number];
  value: number;
  at: number;
  lo?: number;
  hi?: number;
  hidden?: boolean;
  glowAt?: number;
  ticks?: boolean;
}> = ({ w, label, sub, band, value, at, lo = 40, hi = 62, hidden = false, glowAt = 1e9, ticks = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const LW = 210, pad = 30;
  const sw = w - LW - pad * 2;
  const X = (v: number) => LW + pad + (sw * (v - lo)) / (hi - lo);
  const drop = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 170, mass: 0.7 } });
  const inside = value >= band[0] && value <= band[1];
  const col = inside ? GREEN : AMBER;
  const glow = interpolate(frame, [glowAt, glowAt + 8, glowAt + 30], [0, 1, 0.5], CLAMP);
  const cy = 74;
  return (
    <svg width={w} height={150} style={{ overflow: "visible" }}>
      <text x={20} y={86} fontFamily={theme.fonts.display} fontSize={64} fill={C.cream}>
        {label}
      </text>
      <text x={22} y={118} fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.12em" fill={C.creamDim}>
        {sub}
      </text>
      <line x1={X(lo)} x2={X(hi)} y1={cy} y2={cy} stroke={C.creamFaint} strokeWidth={3} />
      <rect x={X(band[0])} y={cy - 26} width={X(band[1]) - X(band[0])} height={52} rx={6} fill={GREEN} opacity={0.2 + 0.25 * glow} stroke={GREEN} strokeWidth={2.5} />
      <line x1={X(50)} x2={X(50)} y1={cy - 34} y2={cy + 34} stroke={C.creamDim} strokeWidth={2} strokeDasharray="5 5" />
      {ticks &&
        [40, 45, 50, 55, 60].map((v) => (
          <text key={v} x={X(v)} y={cy + 62} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={24} fill={C.creamDim}>
            {v}%
          </text>
        ))}
      {hidden ? (
        <g opacity={interpolate(drop, [0, 0.3], [0, 1], CLAMP)}>
          <rect x={X(50) - 70} y={cy - 30} width={140} height={60} rx={8} fill={C.plate} stroke={AMBER} strokeWidth={3} />
          <text x={X(50)} y={cy + 17} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={48} fill={AMBER}>
            ???
          </text>
        </g>
      ) : (
        frame >= at && (
          <g transform={`translate(${X(value)}, ${interpolate(drop, [0, 1], [cy - 90, cy])})`} opacity={interpolate(drop, [0, 0.2], [0, 1], CLAMP)}>
            <circle r={15} fill={col} stroke={C.board} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${col})` }} />
            <text y={-28} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={46} fill={col}>
              {value.toFixed(1)}%
            </text>
          </g>
        )
      )}
    </svg>
  );
};

/* ---------- vertical bars (World Cups) ---------- */
export const VBars: React.FC<{ w: number; h: number; items: { label: string; sub: string; value: number; at: number; color: string }[]; lo?: number; hi?: number; lineAt?: number }> = ({
  w,
  h,
  items,
  lo = 0,
  hi = 80,
  lineAt = -100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = 70, R = 120, T = 60, B = 96;
  const pw = w - L - R, ph = h - T - B;
  const Y = (v: number) => T + ph * (1 - (v - lo) / (hi - lo));
  const slot = pw / items.length;
  const bw = slot * 0.56;
  const line = interpolate(frame, [lineAt, lineAt + 12], [0, 1], CLAMP);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {[0, 20, 40, 60, 80].map((v) => (
        <g key={v}>
          <line x1={L} x2={L + pw} y1={Y(v)} y2={Y(v)} stroke={C.panelEdge} strokeWidth={1.2} />
          <text x={L - 12} y={Y(v) + 9} textAnchor="end" fontFamily={theme.fonts.display} fontSize={26} fill={C.creamDim}>
            {v}%
          </text>
        </g>
      ))}
      {items.map((it, i) => {
        const g = spring({ frame: frame - it.at, fps, config: theme.spring.snappy });
        const v = it.value * Math.min(1, g);
        const x = L + slot * i + (slot - bw) / 2;
        return (
          <g key={it.label} opacity={interpolate(g, [0, 0.15], [0, 1], CLAMP)}>
            <rect x={x} y={Y(v)} width={bw} height={Y(lo) - Y(v)} rx={6} fill={it.color} opacity={0.92} style={{ filter: `drop-shadow(0 0 10px ${it.color}55)` }} />
            <text x={x + bw / 2} y={Y(v) - 14} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={54} fill={it.color}>
              {Math.round(v)}%
            </text>
            <text x={x + bw / 2} y={Y(lo) + 44} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={40} fill={C.cream}>
              {it.label}
            </text>
            <text x={x + bw / 2} y={Y(lo) + 74} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.1em" fill={C.creamDim}>
              {it.sub}
            </text>
          </g>
        );
      })}
      <g opacity={line}>
        <line x1={L} x2={L + pw} y1={Y(50)} y2={Y(50)} stroke={GREEN} strokeWidth={3} strokeDasharray="10 8" />
        <text x={L + pw + 14} y={Y(50) - 8} fontFamily={theme.fonts.body} fontWeight={600} fontSize={20} letterSpacing="0.14em" fill={GREEN}>
          COIN
        </text>
        <text x={L + pw + 14} y={Y(50) + 20} fontFamily={theme.fonts.body} fontWeight={600} fontSize={20} letterSpacing="0.14em" fill={GREEN}>
          FLIP 50%
        </text>
      </g>
    </svg>
  );
};

/* ---------- horizontal bars (decision splits) ---------- */
export const HBars: React.FC<{ w: number; items: { label: string; sub: string; value: number; at: number; color: string }[]; hi?: number; rowH?: number }> = ({ w, items, hi = 70, rowH = 128 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = 30, R = 30;
  const pw = w - L - R;
  const X = (v: number) => L + (pw * v) / hi;
  const h = items.length * rowH + 30;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {items.map((it, i) => {
        const g = spring({ frame: frame - it.at, fps, config: theme.spring.snappy });
        const v = it.value * Math.min(1, g);
        const y = i * rowH;
        return (
          <g key={it.label} opacity={interpolate(g, [0, 0.15], [0, 1], CLAMP)}>
            <text x={L} y={y + 34} fontFamily={theme.fonts.display} fontSize={42} fill={C.cream}>
              {it.label}
            </text>
            <text x={L + pw} y={y + 34} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.12em" fill={C.creamDim}>
              {it.sub}
            </text>
            <rect x={L} y={y + 48} width={pw} height={58} rx={8} fill={C.plate} />
            <rect x={L} y={y + 48} width={Math.max(0, X(v) - L)} height={58} rx={8} fill={it.color} style={{ filter: `drop-shadow(0 0 10px ${it.color}66)` }} />
            <text x={L + 18} y={y + 94} fontFamily={theme.fonts.display} fontSize={50} fill={C.board} opacity={interpolate(g, [0.3, 0.6], [0, 1], CLAMP)}>
              {v.toFixed(1)}%
            </text>
          </g>
        );
      })}
      <line x1={X(50)} x2={X(50)} y1={36} y2={h - 6} stroke={C.cream} strokeWidth={3} strokeDasharray="8 7" />
      <text x={X(50)} y={h + 22} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={600} fontSize={18} letterSpacing="0.16em" fill={C.cream}>
        COIN FLIP · 50%
      </text>
    </svg>
  );
};

/* ---------- the Dubai tiles: 13 matches, who won? ---------- */
export const DUBAI_2021: { m: string; chased: boolean }[] = [
  { m: "ENG v WI", chased: true },
  { m: "IND v PAK", chased: true },
  { m: "SA v WI", chased: true },
  { m: "AUS v SL", chased: true },
  { m: "AFG v PAK", chased: true },
  { m: "AUS v ENG", chased: true },
  { m: "IND v NZ", chased: true },
  { m: "NZ v SCO", chased: false },
  { m: "AUS v BAN", chased: true },
  { m: "IND v SCO", chased: true },
  { m: "IND v NAM", chased: true },
  { m: "SF · PAK v AUS", chased: true },
  { m: "FINAL · NZ v AUS", chased: true },
];

export const Tiles: React.FC<{ at: number; per: number; cols?: number; tw?: number; th?: number }> = ({ at, per, cols = 5, tw = 170, th = 104 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${tw}px)`, gap: 12 }}>
      {DUBAI_2021.map((d, i) => {
        const t = at + i * per;
        const p = spring({ frame: frame - t, fps, config: theme.spring.flip });
        const col = d.chased ? GREEN : RED;
        const wide = d.m.includes("·");
        return (
          <div
            key={d.m}
            style={{
              width: wide ? tw * 2 + 12 : tw,
              gridColumn: wide ? "span 2" : undefined,
              height: th,
              borderRadius: 8,
              background: C.plate,
              boxShadow: `inset 0 0 0 2px ${p > 0.5 ? col + "aa" : C.panelEdge}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transform: `perspective(400px) rotateX(${interpolate(p, [0, 1], [90, 0], CLAMP)}deg)`,
              opacity: interpolate(p, [0, 0.2], [0.25, 1], CLAMP),
            }}
          >
            <Lettering size={30} color={C.cream}>
              {d.m}
            </Lettering>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Lamp color={col} glow={`${col}88`} on={p > 0.5 ? 1 : 0} size={16} />
              <Lettering size={17} font="body" color={p > 0.5 ? col : C.creamDim} spacing="0.14em">
                {d.chased ? "CHASED" : "DEFENDED"}
              </Lettering>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- dew on the panel glass ---------- */
export const Dew: React.FC<{ on: number; w: number; h: number }> = ({ on, w, h }) => {
  const frame = useCurrentFrame();
  if (on <= 0.01) return null;
  const drops = Array.from({ length: 34 }, (_, i) => {
    const r1 = ((i * 9301 + 49297) % 233280) / 233280;
    const r2 = ((i * 4253 + 1361) % 9973) / 9973;
    const appear = r2 * 0.8;
    const o = interpolate(on, [appear, Math.min(1, appear + 0.2)], [0, 1], CLAMP);
    const slide = r1 > 0.75 ? Math.max(0, frame % 90 - 40) * 0.6 : 0;
    return { x: r1 * w, y: (r2 * 0.9 + 0.05) * h + slide, r: 5 + 9 * ((r1 * 7) % 1), o };
  });
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {drops.map((d, i) => (
        <g key={i} opacity={d.o * 0.9}>
          <circle cx={d.x} cy={d.y} r={d.r} fill={DEW} opacity={0.22} />
          <circle cx={d.x} cy={d.y} r={d.r} fill="none" stroke={DEW} strokeWidth={1.5} opacity={0.6} />
          <circle cx={d.x - d.r * 0.35} cy={d.y - d.r * 0.35} r={d.r * 0.28} fill="#FFFFFF" opacity={0.75} />
        </g>
      ))}
    </svg>
  );
};

/* ---------- toss grounds: first half v second half ---------- */
export const GROUNDS = [
  { name: "Kensington Oval", a: 71.0, b: 58.1 },
  { name: "Kingsmead", a: 67.9, b: 39.3 },
  { name: "Trent Bridge", a: 65.0, b: 40.0 },
  { name: "Dambulla", a: 64.0, b: 36.0 },
  { name: "Pune (MCA)", a: 63.6, b: 41.2 },
  { name: "Newlands", a: 61.5, b: 50.0 },
  { name: "Eden Park", a: 60.7, b: 28.6 },
  { name: "Kerava", a: 59.1, b: 45.5 },
];

export const Slope: React.FC<{ w: number; h: number; leftAt: number; lineAt: number; avgAAt: number; avgBAt: number; hiAt: number; hiIdx: number }> = ({ w, h, leftAt, lineAt, avgAAt, avgBAt, hiAt, hiIdx }) => {
  const frame = useCurrentFrame();
  const T = 70, B = 40;
  const ph = h - T - B;
  const lo = 20, hi = 80;
  const Y = (v: number) => T + ph * (1 - (v - lo) / (hi - lo));
  const xa = 250, xb = w - 250;
  const draw = theme.ease.inOut(interpolate(frame, [lineAt, lineAt + 26], [0, 1], CLAMP));
  const hl = interpolate(frame, [hiAt, hiAt + 10], [0, 1], CLAMP);
  const avgA = GROUNDS.reduce((s, g) => s + g.a, 0) / GROUNDS.length;
  const avgB = GROUNDS.reduce((s, g) => s + g.b, 0) / GROUNDS.length;
  const oA = interpolate(frame, [avgAAt, avgAAt + 10], [0, 1], CLAMP);
  const oB = interpolate(frame, [avgBAt, avgBAt + 10], [0, 1], CLAMP);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {[20, 35, 50, 65, 80].map((v) => (
        <g key={v}>
          <line x1={xa - 40} x2={xb + 40} y1={Y(v)} y2={Y(v)} stroke={v === 50 ? GREEN : C.panelEdge} strokeWidth={v === 50 ? 3 : 1.2} strokeDasharray={v === 50 ? "10 8" : undefined} />
          {v === 50 && (
            <text x={(xa + xb) / 2} y={Y(v) - 12} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={600} fontSize={18} letterSpacing="0.16em" fill={GREEN}>
              COIN FLIP 50%
            </text>
          )}
        </g>
      ))}
      <text x={xa} y={30} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={600} fontSize={22} letterSpacing="0.18em" fill={C.cream}>
        FIRST HALF
      </text>
      <text x={xb} y={30} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={600} fontSize={22} letterSpacing="0.18em" fill={C.cream}>
        SECOND HALF
      </text>
      {GROUNDS.map((g, i) => {
        const o = interpolate(frame, [leftAt + i * 3, leftAt + i * 3 + 8], [0, 1], CLAMP);
        const isHi = i === hiIdx;
        const col = isHi && hl > 0 ? AMBER : C.cream;
        const xe = xa + (xb - xa) * draw;
        const ye = Y(g.a + (g.b - g.a) * draw);
        const dim = hl > 0 && !isHi ? 1 - 0.65 * hl : 1;
        return (
          <g key={g.name} opacity={o * dim}>
            {draw > 0 && <line x1={xa} y1={Y(g.a)} x2={xe} y2={ye} stroke={col} strokeWidth={isHi && hl > 0 ? 6 : 3} opacity={isHi && hl > 0 ? 1 : 0.6} />}
            <circle cx={xa} cy={Y(g.a)} r={isHi && hl > 0 ? 11 : 8} fill={col} />
            {draw >= 1 && <circle cx={xb} cy={Y(g.b)} r={isHi && hl > 0 ? 11 : 8} fill={col} />}
          </g>
        );
      })}
      {/* averages */}
      <g opacity={oA}>
        <text x={xa - 70} y={Y(avgA) - 30} textAnchor="end" fontFamily={theme.fonts.display} fontSize={76} fill={AMBER}>
          {Math.round(avgA)}%
        </text>
        <text x={xa - 70} y={Y(avgA) - 104} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.14em" fill={C.creamDim}>
          AVERAGE
        </text>
      </g>
      <g opacity={oB}>
        <text x={xb + 70} y={Y(avgB) + 26} fontFamily={theme.fonts.display} fontSize={76} fill={AMBER}>
          {Math.round(avgB)}%
        </text>
        <text x={xb + 72} y={Y(avgB) + 54} fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.14em" fill={C.creamDim}>
          AVERAGE
        </text>
      </g>
      <g opacity={hl}>
        <text x={xa - 24} y={Y(GROUNDS[hiIdx].a) + 16} textAnchor="end" fontFamily={theme.fonts.display} fontSize={40} fill={AMBER}>
          EDEN PARK {Math.round(GROUNDS[hiIdx].a)}%
        </text>
        <text x={xb - 18} y={Y(GROUNDS[hiIdx].b) + 50} textAnchor="end" fontFamily={theme.fonts.display} fontSize={40} fill={AMBER}>
          {Math.round(GROUNDS[hiIdx].b)}%
        </text>
      </g>
    </svg>
  );
};

/* ---------- a Test pitch wearing out from day 1 to day 5 ---------- */
const CRACKS = [
  "M120,60 L160,72 L190,66 L230,84 L262,80",
  "M300,40 L318,70 L350,82 L372,118 L400,126",
  "M450,150 L480,130 L520,138 L548,116 L590,122",
  "M610,50 L640,76 L676,70 L700,98",
  "M700,150 L730,128 L770,140 L800,118",
  "M210,140 L240,124 L276,132 L300,112",
  "M520,40 L540,64 L572,60 L596,84",
  "M380,170 L410,150 L436,160",
];
export const Pitch: React.FC<{ w: number; wear: number; day: number }> = ({ w, wear, day }) => {
  const h = 200;
  const sx = w / 900;
  const base = interpolate(wear, [0, 1], [0, 1], CLAMP);
  return (
    <svg width={w} height={h} viewBox={`0 0 900 ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="pitchG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgb(${206 - 30 * base}, ${186 - 40 * base}, ${120 - 40 * base})`} />
          <stop offset="1" stopColor={`rgb(${170 - 30 * base}, ${150 - 40 * base}, ${92 - 30 * base})`} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={900} height={h} rx={10} fill="url(#pitchG)" />
      {[60, 840].map((x) => (
        <g key={x}>
          <line x1={x} x2={x} y1={10} y2={h - 10} stroke="#F4EFE0" strokeWidth={4} />
          <line x1={x + (x < 450 ? 34 : -34)} x2={x + (x < 450 ? 34 : -34)} y1={10} y2={h - 10} stroke="#F4EFE0" strokeWidth={3} opacity={0.9} />
          {[-16, 0, 16].map((d) => (
            <rect key={d} x={x - 3} y={h / 2 + d - 3} width={6} height={6} fill="#F4EFE0" />
          ))}
        </g>
      ))}
      {/* rough patches and footmarks */}
      {[
        [150, 50],
        [190, 150],
        [710, 46],
        [740, 152],
        [420, 100],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={34} ry={20} fill="#6B5530" opacity={0.45 * interpolate(wear, [0.2 + i * 0.1, 0.6 + i * 0.08], [0, 1], CLAMP)} />
      ))}
      {CRACKS.map((d, i) => {
        const p = interpolate(wear, [i * 0.09, i * 0.09 + 0.3], [0, 1], CLAMP);
        return <path key={i} d={d} fill="none" stroke="#3A2A12" strokeWidth={3.2 / Math.max(0.6, sx)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
      })}
      <text x={450} y={h + 44} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={46} fill={wear > 0.85 ? AMBER : C.cream}>
        DAY {day}
      </text>
    </svg>
  );
};

/* ---------- a beam that tilts toward the better decision ---------- */
export const Beam: React.FC<{ w: number; tilt: number; on: number }> = ({ w, tilt, on }) => {
  const cx = w / 2;
  const bw = w - 120;
  return (
    <div style={{ position: "relative", width: w, height: 300, opacity: on }}>
      <svg width={w} height={300} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <polygon points={`${cx},150 ${cx - 70},280 ${cx + 70},280`} fill={C.plateHi} stroke={C.panelEdge} strokeWidth={3} />
        <g transform={`rotate(${-tilt}, ${cx}, 140)`}>
          <rect x={cx - bw / 2} y={128} width={bw} height={24} rx={10} fill={C.trimCream} />
          <rect x={cx - bw / 2 + 10} y={56} width={200} height={72} rx={10} fill={GREEN} />
          <text x={cx - bw / 2 + 110} y={108} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={44} fill={C.board}>
            BOWL 55%
          </text>
          <rect x={cx + bw / 2 - 210} y={56} width={200} height={72} rx={10} fill={RED} />
          <text x={cx + bw / 2 - 110} y={108} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={44} fill={C.board}>
            BAT 45%
          </text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: cx - 50, top: 40 }}>
        <Coin size={100} angle={0} />
      </div>
    </div>
  );
};

/* ---------- 100 decided matches ---------- */
export const Hundred: React.FC<{ at: number; extraAt: number; cell?: number; gap?: number }> = ({ at, extraAt, cell = 44, gap = 8 }) => {
  const frame = useCurrentFrame();
  const extra = interpolate(frame, [extraAt, extraAt + 18], [0, 0.9], { easing: theme.ease.out, ...CLAMP });
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(10, ${cell}px)`, gap }}>
      {Array.from({ length: 100 }).map((_, i) => {
        const lit = i < 50 ? interpolate(frame, [at + i * 0.5, at + i * 0.5 + 4], [0, 1], CLAMP) : 0;
        return (
          <div key={i} style={{ position: "relative", width: cell, height: cell, borderRadius: 6, background: C.plate, boxShadow: `inset 0 0 0 2px ${C.panelEdge}`, overflow: "hidden" }}>
            {i < 50 && <div style={{ position: "absolute", inset: 0, background: C.cream, opacity: 0.85 * lit }} />}
            {i === 50 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${extra * 100}%`, background: AMBER, boxShadow: `0 0 16px ${AMBER}` }} />}
          </div>
        );
      })}
    </div>
  );
};
