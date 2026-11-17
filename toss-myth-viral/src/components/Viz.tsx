// Story graphics. Every number comes from the analysis (see README).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import fixtures from "../fixtures.json";
import { theme } from "../theme";
import { Txt } from "./Kit";
import { CLAMP } from "./Motion";

const C = theme.colors;

/* ---------- hook: a wall of real fixtures from the dataset ---------- */
export const FixtureWall: React.FC<{ at: number; rate?: number; cols?: number; dim?: number }> = ({ at, rate = 1.6, cols = 4, dim = 1 }) => {
  const frame = useCurrentFrame();
  const tw = 228, th = 78, gap = 12;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${tw}px)`, gap, opacity: dim }}>
      {(fixtures as { f: string; y: string; c: string }[]).slice(0, cols * 12).map((m, i) => {
        const order = (i * 37) % (cols * 12);
        const t = at + order / rate;
        const p = interpolate(frame, [t, t + 6], [0, 1], CLAMP);
        const col = m.c === "IPL" ? C.blue : m.c === "TEST" ? C.white : m.c === "ODI" ? C.green : C.gold;
        return (
          <div key={i} style={{ height: th, borderRadius: 14, background: C.card, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", opacity: p, transform: `perspective(500px) rotateX(${(1 - p) * 80}deg)` }}>
            <Txt size={30}>{m.f}</Txt>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              <Txt size={15} font="body" weight={900} color={col} spacing="0.08em">
                {m.c}
              </Txt>
              <Txt size={15} font="body" weight={800} color={C.dim}>
                {m.y}
              </Txt>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Dubai 2021: 13 matches ---------- */
const DUBAI: { m: string; chased: boolean }[] = [
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
  { m: "SEMI · PAK v AUS", chased: true },
  { m: "FINAL · NZ v AUS", chased: true },
];

export const DubaiTiles: React.FC<{ at: number; per: number; fall?: number }> = ({ at, per, fall = -1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tw = 168, th = 112, gap = 14;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${tw}px)`, gap }}>
      {DUBAI.map((d, i) => {
        const p = spring({ frame: frame - at - i * per, fps, config: theme.spring.pop });
        const col = d.chased ? C.green : C.red;
        const wide = d.m.includes("·");
        const f = fall >= 0 ? interpolate(frame, [fall + ((i * 7) % 13) * 1.2, fall + ((i * 7) % 13) * 1.2 + 16], [0, 1], { easing: theme.ease.in, ...CLAMP }) : 0;
        return (
          <div
            key={d.m}
            style={{
              gridColumn: wide ? "span 2" : undefined,
              height: th,
              borderRadius: 16,
              background: p > 0.5 ? `linear-gradient(180deg, ${col}33, ${col}14)` : C.card,
              border: `3px solid ${p > 0.5 ? col : C.line}`,
              boxShadow: p > 0.5 ? `0 0 24px ${col}55` : undefined,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: interpolate(p, [0, 0.2], [0.2, 1], CLAMP) * (1 - f),
              transform: `scale(${interpolate(p, [0, 1], [0.6, 1])}) translateY(${f * 700}px) rotate(${f * ((i % 2) * 2 - 1) * 30}deg)`,
            }}
          >
            <Txt size={32}>{d.m}</Txt>
            <Txt size={18} font="body" weight={900} color={p > 0.5 ? col : C.dim} spacing="0.12em">
              {d.chased ? "✓ CHASED" : "✕ DEFENDED"}
            </Txt>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- dew drops ---------- */
export const Dew: React.FC<{ on: number; w: number; h: number }> = ({ on, w, h }) => {
  const frame = useCurrentFrame();
  if (on <= 0.01) return null;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {Array.from({ length: 40 }, (_, i) => {
        const r1 = ((i * 9301 + 49297) % 233280) / 233280;
        const r2 = ((i * 4253 + 1361) % 9973) / 9973;
        const o = interpolate(on, [r2 * 0.7, r2 * 0.7 + 0.25], [0, 1], CLAMP);
        const slide = r1 > 0.7 ? Math.max(0, (frame + i * 9) % 80 - 30) * 0.8 : 0;
        const r = 6 + 10 * ((r1 * 7) % 1);
        const x = r1 * w, y = r2 * h + slide;
        return (
          <g key={i} opacity={o}>
            <circle cx={x} cy={y} r={r} fill={C.blue} opacity={0.25} />
            <circle cx={x} cy={y} r={r} fill="none" stroke={C.blue} strokeWidth={1.6} opacity={0.7} />
            <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill="#FFFFFF" opacity={0.8} />
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- World Cups: toss winners' win % ---------- */
export const WCBars: React.FC<{ w: number; h: number; items: { label: string; sub: string; value: number; at: number; color: string }[]; lineAt: number }> = ({ w, h, items, lineAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = 70, B = 110;
  const ph = h - T - B;
  const Y = (v: number) => T + ph * (1 - v / 75);
  const slot = w / items.length;
  const bw = slot * 0.62;
  const line = interpolate(frame, [lineAt, lineAt + 10], [0, 1], CLAMP);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {items.map((it, i) => {
        const g = spring({ frame: frame - it.at, fps, config: theme.spring.snappy });
        const v = it.value * Math.min(1, g);
        const x = slot * i + (slot - bw) / 2;
        return (
          <g key={it.label} opacity={interpolate(g, [0, 0.12], [0, 1], CLAMP)}>
            <rect x={x} y={Y(v)} width={bw} height={Y(0) - Y(v)} rx={14} fill={it.color} style={{ filter: `drop-shadow(0 0 18px ${it.color}66)` }} />
            <text x={x + bw / 2} y={Y(v) - 18} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={78} fill={it.color}>
              {Math.round(v)}%
            </text>
            <text x={x + bw / 2} y={Y(0) + 58} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={52} fill={C.white}>
              {it.label}
            </text>
            <text x={x + bw / 2} y={Y(0) + 92} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={800} fontSize={20} letterSpacing="0.06em" fill={C.dim}>
              {it.sub}
            </text>
          </g>
        );
      })}
      <g opacity={line}>
        <line x1={-10} x2={w + 10} y1={Y(50)} y2={Y(50)} stroke={C.green} strokeWidth={4} strokeDasharray="14 10" />
        <line x1={w - 290} x2={w - 230} y1={22} y2={22} stroke={C.green} strokeWidth={4} strokeDasharray="12 8" />
        <text x={w} y={30} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={900} fontSize={22} letterSpacing="0.08em" fill={C.green}>
          COIN FLIP · 50%
        </text>
      </g>
    </svg>
  );
};

/* ---------- a Test pitch wearing out from day 1 to day 5 ---------- */
const CRACKS = ["M120,60 L160,72 L190,66 L230,84 L262,80", "M300,40 L318,70 L350,82 L372,118 L400,126", "M450,150 L480,130 L520,138 L548,116 L590,122", "M610,50 L640,76 L676,70 L700,98", "M700,150 L730,128 L770,140 L800,118", "M210,140 L240,124 L276,132 L300,112", "M520,40 L540,64 L572,60 L596,84", "M380,170 L410,150 L436,160"];
export const Pitch: React.FC<{ w: number; wear: number }> = ({ w, wear }) => {
  const h = 200;
  const day = Math.min(5, 1 + Math.floor(wear * 5));
  return (
    <svg width={w} height={h + 70} viewBox={`0 0 900 ${h + 70}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="pitchV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgb(${214 - 34 * wear}, ${192 - 46 * wear}, ${124 - 44 * wear})`} />
          <stop offset="1" stopColor={`rgb(${176 - 34 * wear}, ${154 - 44 * wear}, ${94 - 32 * wear})`} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={900} height={h} rx={14} fill="url(#pitchV)" />
      {[60, 840].map((x) => (
        <g key={x}>
          <line x1={x} x2={x} y1={10} y2={h - 10} stroke="#F6F1E2" strokeWidth={4} />
          <line x1={x + (x < 450 ? 34 : -34)} x2={x + (x < 450 ? 34 : -34)} y1={10} y2={h - 10} stroke="#F6F1E2" strokeWidth={3} />
          {[-16, 0, 16].map((d) => (
            <rect key={d} x={x - 3} y={h / 2 + d - 3} width={6} height={6} fill="#F6F1E2" />
          ))}
        </g>
      ))}
      {[[150, 50], [190, 150], [710, 46], [740, 152], [420, 100]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={36} ry={22} fill="#5E4824" opacity={0.5 * interpolate(wear, [0.2 + i * 0.1, 0.6 + i * 0.08], [0, 1], CLAMP)} />
      ))}
      {CRACKS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#33240E" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - interpolate(wear, [i * 0.09, i * 0.09 + 0.3], [0, 1], CLAMP)} />
      ))}
      <text x={450} y={h + 56} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={50} fill={wear > 0.85 ? C.gold : C.white}>
        DAY {day}
      </text>
    </svg>
  );
};

/* ---------- 100 decided matches ---------- */
export const Hundred: React.FC<{ at: number; extraAt: number; cell?: number; gap?: number }> = ({ at, extraAt, cell = 46, gap = 9 }) => {
  const frame = useCurrentFrame();
  const extra = interpolate(frame, [extraAt, extraAt + 18], [0, 0.9], { easing: theme.ease.out, ...CLAMP });
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(10, ${cell}px)`, gap }}>
      {Array.from({ length: 100 }).map((_, i) => {
        const lit = i < 50 ? interpolate(frame, [at + i * 0.45, at + i * 0.45 + 4], [0, 1], CLAMP) : 0;
        return (
          <div key={i} style={{ position: "relative", width: cell, height: cell, borderRadius: cell, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            {i < 50 && <div style={{ position: "absolute", inset: 0, borderRadius: cell, background: C.white, opacity: 0.9 * lit }} />}
            {i === 50 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${extra * 100}%`, background: C.gold, boxShadow: `0 0 18px ${C.gold}` }} />}
          </div>
        );
      })}
    </div>
  );
};
