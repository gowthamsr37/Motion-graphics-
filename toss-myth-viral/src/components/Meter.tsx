// The Toss-o-meter: a half-dial from 40% to 60%. Green = just luck, gold = a real edge.
import React from "react";
import { theme } from "../theme";

const C = theme.colors;
export type Needle = { v: number; color: string; label?: string; ghost?: boolean; labelSide?: 1 | -1 };

export const Meter: React.FC<{ w: number; needles: Needle[]; zone?: [number, number]; zoneGlow?: number; edgeGlow?: number; lo?: number; hi?: number }> = ({ w, needles, zone = [48, 52], zoneGlow = 0, edgeGlow = 0, lo = 40, hi = 60 }) => {
  const R = w / 2 - 60;
  const cx = w / 2, cy = R + 70;
  const h = cy + 40;
  const ang = (v: number) => Math.PI - ((Math.min(hi + 1.5, Math.max(lo - 1.5, v)) - lo) / (hi - lo)) * Math.PI;
  const pt = (v: number, r: number) => [cx + r * Math.cos(ang(v)), cy - r * Math.sin(ang(v))];
  const arc = (a: number, b: number, r: number) => {
    const [x1, y1] = pt(a, r), [x2, y2] = pt(b, r);
    return `M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}`;
  };
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="edgeG" x1="0" x2="1">
          <stop offset="0" stopColor={C.gold} stopOpacity={0.55} />
          <stop offset="1" stopColor={C.gold} stopOpacity={1} />
        </linearGradient>
        <filter id="glowF" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <path d={arc(lo, hi, R)} stroke="rgba(255,255,255,0.08)" strokeWidth={64} fill="none" />
      <path d={arc(lo, zone[0], R)} stroke={C.red} strokeOpacity={0.45} strokeWidth={50} fill="none" />
      <path d={arc(zone[1], hi, R)} stroke="url(#edgeG)" strokeOpacity={0.55 + 0.45 * edgeGlow} strokeWidth={50} fill="none" />
      {edgeGlow > 0 && <path d={arc(zone[1], hi, R)} stroke={C.gold} strokeOpacity={0.6 * edgeGlow} strokeWidth={60} fill="none" filter="url(#glowF)" />}
      <path d={arc(zone[0], zone[1], R)} stroke={C.green} strokeOpacity={0.6 + 0.4 * zoneGlow} strokeWidth={50} fill="none" />
      {zoneGlow > 0 && <path d={arc(zone[0], zone[1], R)} stroke={C.green} strokeOpacity={0.7 * zoneGlow} strokeWidth={70} fill="none" filter="url(#glowF)" />}
      {/* ticks */}
      {Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map((v) => {
        const big = v % 5 === 0;
        const [x1, y1] = pt(v, R - 40);
        const [x2, y2] = pt(v, R - (big ? 70 : 56));
        const [tx, ty] = pt(v, R - (v === lo || v === hi ? 118 : 104));
        return (
          <g key={v}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.white} strokeOpacity={big ? 0.85 : 0.35} strokeWidth={big ? 5 : 3} strokeLinecap="round" />
            {big && (
              <text x={tx} y={ty + (v === lo || v === hi ? -14 : 12)} textAnchor={v === lo ? "start" : v === hi ? "end" : "middle"} fontFamily={theme.fonts.display} fontSize={36} fill={C.dim}>
                {v}%
              </text>
            )}
          </g>
        );
      })}
      {/* zone labels on the arc */}
      {[
        { v: (zone[0] + zone[1]) / 2, t: "JUST LUCK", c: "#04140D" },
        { v: 56, t: "REAL EDGE", c: "#2A1C00" },
        { v: 44, t: "TOSS HURTS", c: "#2A0A0E" },
      ].map((z) => {
        const [x, y] = pt(z.v, R);
        const rot = 90 - (ang(z.v) * 180) / Math.PI;
        return (
          <text key={z.t} x={x} y={y + 7} textAnchor="middle" transform={`rotate(${rot}, ${x}, ${y})`} fontFamily={theme.fonts.body} fontWeight={900} fontSize={z.t === "JUST LUCK" ? 19 : 20} letterSpacing="0.08em" fill={z.c}>
            {z.t}
          </text>
        );
      })}
      {/* needles: ghosts first */}
      {[...needles].sort((a, b) => Number(!a.ghost) - Number(!b.ghost)).map((n, i) => {
        const a = ang(n.v);
        const L = R - 20;
        const tip = [cx + L * Math.cos(a), cy - L * Math.sin(a)];
        const bl = [cx + 16 * Math.cos(a + Math.PI / 2), cy - 16 * Math.sin(a + Math.PI / 2)];
        const br = [cx + 16 * Math.cos(a - Math.PI / 2), cy - 16 * Math.sin(a - Math.PI / 2)];
        const lab = [cx + (R + 54) * Math.cos(a), cy - (R + 54) * Math.sin(a)];
        return (
          <g key={i} opacity={n.ghost ? 0.55 : 1}>
            <polygon points={`${tip[0]},${tip[1]} ${bl[0]},${bl[1]} ${br[0]},${br[1]}`} fill={n.color} style={{ filter: n.ghost ? undefined : `drop-shadow(0 0 14px ${n.color})` }} />
            {n.label && (
              <text x={lab[0]} y={lab[1]} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={900} fontSize={24} letterSpacing="0.06em" fill={n.color}>
                {n.label}
              </text>
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={30} fill={C.navy} stroke={C.white} strokeOpacity={0.5} strokeWidth={4} />
      <circle cx={cx} cy={cy} r={10} fill={C.gold} />
    </svg>
  );
};
