// The map engine: a camera-driven Mercator projection over real Natural Earth coastlines,
// drawn as an inked portolan chart, plus geo-anchored routes, markers, labels and ships.
import { geoGraticule10, geoMercator, geoPath, GeoProjection } from "d3-geo";
import React, { createContext, useContext, useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { feature } from "topojson-client";
import countries50 from "world-atlas/countries-50m.json";
import land50 from "world-atlas/land-50m.json";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

const C = theme.colors;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LAND = feature(land50 as any, (land50 as any).objects.land) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COUNTRIES = (feature(countries50 as any, (countries50 as any).objects.countries) as any).features as any[];
export const country = (id: string) => COUNTRIES.find((c) => c.id === id);
const GRAT = geoGraticule10();

export type LonLat = [number, number];
export type Cam = { lon: number; lat: number; w: number }; // w = degrees of longitude across the frame
export type Key = { f: number; cam: Cam };

// Mercator works in a linear space for y; interpolate the camera there so pans feel even.
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const invY = (y: number) => (360 / Math.PI) * Math.atan(Math.exp(y)) - 90;

export const camAt = (keys: Key[], f: number): Cam => {
  if (f <= keys[0].f) return keys[0].cam;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) {
      const t = theme.ease.inOut(Math.min(1, Math.max(0, (f - a.f) / Math.max(1, b.f - a.f))));
      const lw = Math.log(a.cam.w) + (Math.log(b.cam.w) - Math.log(a.cam.w)) * t; // zoom in log space
      return {
        lon: a.cam.lon + (b.cam.lon - a.cam.lon) * t,
        lat: invY(mercY(a.cam.lat) + (mercY(b.cam.lat) - mercY(a.cam.lat)) * t),
        w: Math.exp(lw),
      };
    }
  }
  return keys[keys.length - 1].cam;
};

export const makeProjection = (cam: Cam): GeoProjection => {
  const k = WIDTH / ((cam.w * Math.PI) / 180);
  const p = geoMercator().scale(k).translate([0, 0]);
  const [cx, cy] = p([cam.lon, cam.lat]) as [number, number];
  return p.translate([WIDTH / 2 - cx, HEIGHT / 2 - cy]).clipExtent([[-80, -80], [WIDTH + 80, HEIGHT + 80]]);
};

type Ctx = { proj: GeoProjection; cam: Cam; zoom: number };
const MapCtx = createContext<Ctx | null>(null);
export const MapProvider: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => {
  const value = useMemo(() => ({ proj: makeProjection(cam), cam, zoom: 60 / cam.w }), [cam.lon, cam.lat, cam.w]); // eslint-disable-line react-hooks/exhaustive-deps
  return <MapCtx.Provider value={value}>{children}</MapCtx.Provider>;
};
export const useMap = () => {
  const c = useContext(MapCtx);
  if (!c) throw new Error("useMap outside MapProvider");
  return c;
};
export const useProject = () => {
  const { proj } = useMap();
  return (ll: LonLat) => proj(ll) as [number, number];
};

// ---------------- base chart ----------------
export const Parchment: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 65% at 50% 48%, ${C.parchmentHi} 0%, ${C.parchment} 55%, ${C.parchmentLo} 100%)` }} />
    {/* fibres + stains, static */}
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.55 }}>
      <filter id="paper">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="7" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.15  0 0 0 0.55 -0.12" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper)" />
    </svg>
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.35 }}>
      <filter id="fibre">
        <feTurbulence type="turbulence" baseFrequency="0.9 0.03" numOctaves="2" seed="3" />
        <feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.15  0 0 0 0.35 -0.05" />
      </filter>
      <rect width="100%" height="100%" filter="url(#fibre)" />
    </svg>
  </AbsoluteFill>
);

export const BaseMap: React.FC<{ highlight?: { id: string; color: string; p: number }[] }> = ({ highlight = [] }) => {
  const { proj, zoom } = useMap();
  const path = geoPath(proj);
  const land = path(LAND) ?? "";
  const grat = path(GRAT) ?? "";
  const z = Math.min(2.2, Math.max(0.6, Math.sqrt(zoom)));
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <path id="land" d={land} />
        <filter id="inkbleed" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" />
        </filter>
        <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={C.ottoman} strokeWidth="3" opacity="0.55" />
        </pattern>
        <radialGradient id="landShade" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor={C.landHi} />
          <stop offset="100%" stopColor={C.land} />
        </radialGradient>
      </defs>
      {/* sea wash: a blue-grey tint over the whole chart; land is then painted back over it */}
      <rect width={WIDTH} height={HEIGHT} fill={C.seaWash} opacity={0.34} style={{ mixBlendMode: "multiply" }} />
      <path d={grat} fill="none" stroke={C.inkFaint} strokeWidth={1} strokeDasharray="2 6" />
      {/* engraved coastal ripples: the coastline stroked wide, fading outward */}
      {[34, 22, 12].map((w, i) => (
        <use key={w} href="#land" fill="none" stroke={C.sea} strokeWidth={w * z} strokeOpacity={0.1 + i * 0.07} strokeLinejoin="round" />
      ))}
      <use href="#land" fill="url(#landShade)" stroke="none" opacity={0.9} />
      {highlight.map((h) => {
        const d = path(country(h.id)) ?? "";
        return <path key={h.id} d={d} fill={h.color} opacity={0.5 * h.p} />;
      })}
      <use href="#land" fill="none" stroke={C.coast} strokeWidth={1.6} strokeLinejoin="round" filter="url(#inkbleed)" />
    </svg>
  );
};

// Region fill (country set) with hatching, e.g. Ottoman lands.
export const Region: React.FC<{ ids: string[]; p: number; color: string; hatch?: boolean }> = ({ ids, p, color, hatch }) => {
  const { proj } = useMap();
  const path = geoPath(proj);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity: p }}>
      {ids.map((id) => {
        const d = path(country(id)) ?? "";
        return (
          <g key={id}>
            <path d={d} fill={hatch ? "url(#hatch)" : color} opacity={hatch ? 1 : 0.45} />
            <path d={d} fill="none" stroke={color} strokeWidth={2} opacity={0.7} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------------- portolan compass rose + rhumb lines ----------------
export const CompassRose: React.FC<{ at: LonLat; size?: number; lines?: boolean; spin?: number; opacity?: number }> = ({ at, size = 150, lines = true, spin = 0, opacity = 1 }) => {
  const project = useProject();
  const frame = useCurrentFrame();
  const [x, y] = project(at);
  const pts = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity }}>
      {lines &&
        Array.from({ length: 32 }, (_, i) => {
          const a = (i / 32) * Math.PI * 2;
          const col = i % 4 === 0 ? C.ink : i % 2 === 0 ? C.green : C.red;
          return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * 2600} y2={y + Math.sin(a) * 2600} stroke={col} strokeWidth={0.9} opacity={0.18} />;
        })}
      <g transform={`translate(${x},${y}) rotate(${spin + Math.sin(frame / 90) * 1.5})`}>
        <circle r={size * 0.62} fill="none" stroke={C.ink} strokeWidth={1.5} opacity={0.6} />
        <circle r={size * 0.56} fill="none" stroke={C.ink} strokeWidth={0.8} opacity={0.5} strokeDasharray="2 4" />
        {pts.map((i) => {
          const long = i % 4 === 0, mid = i % 2 === 0;
          const r = long ? size * 0.75 : mid ? size * 0.5 : size * 0.32;
          const a = (i / 16) * 360;
          return (
            <g key={i} transform={`rotate(${a})`}>
              <path d={`M0 ${-r} L${r * 0.11} 0 L0 0 Z`} fill={long ? C.red : C.ink} opacity={0.85} />
              <path d={`M0 ${-r} L${-r * 0.11} 0 L0 0 Z`} fill={C.parchmentHi} stroke={C.ink} strokeWidth={0.6} opacity={0.9} />
            </g>
          );
        })}
        <circle r={size * 0.06} fill={C.gold} stroke={C.ink} strokeWidth={1} />
        <text y={-size * 0.82} textAnchor="middle" fontFamily={theme.fonts.title} fontSize={size * 0.17} fill={C.ink}>N</text>
      </g>
    </svg>
  );
};

// ---------------- routes ----------------
// Catmull-Rom through projected waypoints → dense polyline in screen space.
const smooth = (pts: [number, number][], steps = 14) => {
  if (pts.length < 3) return pts;
  const out: [number, number][] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

export const useRoute = (way: LonLat[]) => {
  const project = useProject();
  const pts = smooth(way.map(project));
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  // point + heading at progress p (0..1)
  const at = (p: number) => {
    const d = Math.min(1, Math.max(0, p)) * total;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < d) i++;
    const seg = cum[i] - cum[i - 1] || 1;
    const t = (d - cum[i - 1]) / seg;
    const a = pts[i - 1], b = pts[i];
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, ang: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI, i };
  };
  const partial = (p: number) => {
    if (p <= 0) return "";
    const end = at(p);
    const sub = pts.slice(0, end.i);
    return "M" + [...sub, [end.x, end.y]].map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join("L");
  };
  return { at, partial, total };
};

export const Route: React.FC<{
  way: LonLat[];
  p: number;
  color?: string;
  width?: number;
  dash?: string;
  opacity?: number;
  ship?: boolean;
  shipScale?: number;
  arrow?: boolean;
}> = ({ way, p, color = C.red, width = 4, dash = "14 9", opacity = 1, ship = false, shipScale = 1, arrow = false }) => {
  const r = useRoute(way);
  const frame = useCurrentFrame();
  const head = r.at(p);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity }}>
      <path d={r.partial(p)} fill="none" stroke={C.parchmentHi} strokeWidth={width + 5} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      <path d={r.partial(p)} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" />
      {arrow && p > 0.02 && !ship && (
        <g transform={`translate(${head.x},${head.y}) rotate(${head.ang})`}>
          <path d="M-16,-11 L6,0 L-16,11 Z" fill={color} />
        </g>
      )}
      {ship && p > 0 && (
        <g transform={`translate(${head.x},${head.y + Math.sin(frame / 9) * 2}) scale(${shipScale * (Math.cos((head.ang * Math.PI) / 180) < 0 ? -1 : 1)}, ${shipScale}) rotate(${Math.sin(frame / 13) * 3})`}>
          <Caravel />
        </g>
      )}
    </svg>
  );
};

// A small inked caravel with Order-of-Christ crosses on the sails. Origin = waterline centre.
export const Caravel: React.FC<{ color?: string }> = ({ color = C.ink }) => (
  <g>
    <path d="M-34,-2 Q-30,12 -18,14 L22,14 Q34,10 38,-4 L20,0 L-26,0 Z" fill="#7A5230" stroke={color} strokeWidth={1.6} />
    <line x1={-6} y1={0} x2={-6} y2={-56} stroke={color} strokeWidth={2.2} />
    <line x1={16} y1={0} x2={16} y2={-42} stroke={color} strokeWidth={2} />
    <path d="M-24,-50 Q-6,-44 12,-50 L12,-14 Q-6,-8 -24,-14 Z" fill={C.parchmentHi} stroke={color} strokeWidth={1.4} />
    <path d="M4,-38 Q16,-34 28,-38 L28,-10 Q16,-6 4,-10 Z" fill={C.parchmentHi} stroke={color} strokeWidth={1.3} />
    <path d="M-12,-40 h10 M-7,-45 v24" stroke={C.red} strokeWidth={4} />
    <path d="M12,-30 h8 M16,-34 v18" stroke={C.red} strokeWidth={3} />
    <path d="M-6,-56 l10,3 l-10,3 Z" fill={C.red} />
    <path d="M-40,16 q8,-4 16,0 t16,0 t16,0 t16,0 t16,0" fill="none" stroke={C.sea} strokeWidth={1.6} opacity={0.7} />
  </g>
);

// ---------------- markers + labels ----------------
export const Marker: React.FC<{ at: LonLat; delay: number; label?: string; sub?: string; side?: "r" | "l" | "t" | "b"; color?: string; size?: number; exit?: number }> = ({
  at,
  delay,
  label,
  sub,
  side = "r",
  color = C.red,
  size = 30,
  exit,
}) => {
  const project = useProject();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [x, y] = project(at);
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 10], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const o = interpolate(p, [0, 0.3], [0, 1], CLAMP) * (1 - out);
  const ring = ((frame - delay) % 50) / 50;
  const dx = side === "r" ? 26 : side === "l" ? -26 : 0;
  const dy = side === "t" ? -30 : side === "b" ? 46 : 10;
  const anchor = side === "r" ? "start" : side === "l" ? "end" : "middle";
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity: o }}>
      <circle cx={x} cy={y} r={9 + ring * 26} fill="none" stroke={color} strokeWidth={2} opacity={(1 - ring) * 0.6} />
      <circle cx={x} cy={y} r={9 * p} fill={color} stroke={C.parchmentHi} strokeWidth={2.5} />
      {label && (
        <g transform={`translate(${x + dx},${y + dy + (1 - p) * 14})`}>
          <text textAnchor={anchor} fontFamily={theme.fonts.hand} fontStyle="italic" fontSize={size} fill={C.ink} stroke={C.parchmentHi} strokeWidth={6} paintOrder="stroke" strokeLinejoin="round">
            {label}
          </text>
          {sub && (
            <text y={size * 0.95} textAnchor={anchor} fontFamily={theme.fonts.body} fontSize={size * 0.62} fill={C.inkDim} stroke={C.parchmentHi} strokeWidth={5} paintOrder="stroke" letterSpacing="0.06em">
              {sub}
            </text>
          )}
        </g>
      )}
    </svg>
  );
};

// Spaced capitals for seas and regions, letters fading in one by one.
export const GeoLabel: React.FC<{ at: LonLat; text: string; delay: number; size?: number; color?: string; spacing?: number; exit?: number; italic?: boolean }> = ({
  at,
  text,
  delay,
  size = 30,
  color = C.inkDim,
  spacing = 0.4,
  exit,
  italic,
}) => {
  const project = useProject();
  const frame = useCurrentFrame();
  const [x, y] = project(at);
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 12], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        fontFamily: italic ? theme.fonts.hand : theme.fonts.title,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        letterSpacing: `${spacing}em`,
        color,
        whiteSpace: "nowrap",
        opacity: 1 - out,
        textShadow: `0 0 6px ${C.parchmentHi}, 0 0 14px ${C.parchmentHi}`,
      }}
    >
      {text.split("").map((ch, i) => {
        const p = interpolate(frame, [delay + i * 1.5, delay + i * 1.5 + 12], [0, 1], { easing: theme.ease.out, ...CLAMP });
        return (
          <span key={i} style={{ opacity: p, display: "inline-block", transform: `translateY(${(1 - p) * 8}px)`, filter: `blur(${(1 - p) * 3}px)` }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
};
