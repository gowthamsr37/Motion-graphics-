// City panels: one shared instant (12:00 UTC, 16 Nov) seen at four local times.
// Tokyo 21:00 (night), Bengaluru 17:30 (dusk), London 12:00 (overcast noon), New York 07:00 (sunrise).
import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, theme } from "../theme";
import { AIR, makeCrowd, Person, seeded } from "./Person";

export type CityId = "tokyo" | "bengaluru" | "london" | "newyork";

type CityStyle = {
  name: string;
  local: string;
  sky: [string, string, string];
  ground: [string, string];
  building: string;
  haze: string;
  crowd: string;
  windows: number; // share of lit windows
  sun?: { x: number; y: number; r: number; color: string };
  moon?: { x: number; y: number };
  stars?: boolean;
  clouds?: boolean;
  landmark: (x: number, base: number, H: number, c: string) => React.ReactNode;
  landmarkX: number;
  seed: number;
};

const tvTower = (x: number, b: number, H: number, c: string) => (
  <g fill={c}>
    <polygon points={`${x - 0.07 * H},${b} ${x - 0.016 * H},${b - 0.6 * H} ${x + 0.016 * H},${b - 0.6 * H} ${x + 0.07 * H},${b}`} />
    <rect x={x - 0.05 * H} y={b - 0.66 * H} width={0.1 * H} height={0.055 * H} rx={0.01 * H} />
    <polygon points={`${x - 0.016 * H},${b - 0.62 * H} ${x - 0.009 * H},${b - 0.86 * H} ${x + 0.009 * H},${b - 0.86 * H} ${x + 0.016 * H},${b - 0.62 * H}`} />
    <rect x={x - 0.03 * H} y={b - 0.83 * H} width={0.06 * H} height={0.03 * H} rx={0.008 * H} />
    <rect x={x - 0.003 * H} y={b - H} width={0.006 * H} height={0.16 * H} />
    <circle cx={x} cy={b - H} r={0.006 * H} fill="#FF4D4D" />
  </g>
);

const domeHall = (x: number, b: number, H: number, c: string) => (
  <g fill={c}>
    <rect x={x - 0.5 * H} y={b - 0.24 * H} width={H} height={0.24 * H} />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={x - 0.44 * H + i * 0.08 * H} y={b - 0.2 * H} width={0.02 * H} height={0.2 * H} fill="rgba(0,0,0,0.25)" />
    ))}
    <rect x={x - 0.17 * H} y={b - 0.4 * H} width={0.34 * H} height={0.17 * H} />
    <polygon points={`${x - 0.2 * H},${b - 0.4 * H} ${x},${b - 0.47 * H} ${x + 0.2 * H},${b - 0.4 * H}`} />
    <rect x={x - 0.09 * H} y={b - 0.56 * H} width={0.18 * H} height={0.12 * H} />
    <ellipse cx={x} cy={b - 0.56 * H} rx={0.11 * H} ry={0.12 * H} />
    <rect x={x - 0.004 * H} y={b - 0.74 * H} width={0.008 * H} height={0.08 * H} />
    {[-0.4, 0.4].map((k) => (
      <g key={k}>
        <rect x={x + k * H - 0.05 * H} y={b - 0.31 * H} width={0.1 * H} height={0.08 * H} />
        <ellipse cx={x + k * H} cy={b - 0.31 * H} rx={0.055 * H} ry={0.06 * H} />
      </g>
    ))}
  </g>
);

const palm = (x: number, b: number, H: number, c: string) => (
  <g stroke={c} fill="none" strokeLinecap="round">
    <path d={`M ${x} ${b} Q ${x + 0.03 * H} ${b - 0.5 * H} ${x - 0.02 * H} ${b - H}`} strokeWidth={0.035 * H} />
    {[-150, -115, -70, -35, -5, 30].map((a, i) => {
      const r = 0.38 * H, ax = (a * Math.PI) / 180;
      const ex = x - 0.02 * H + Math.cos(ax) * r, ey = b - H + Math.sin(ax) * r * 0.6 + 0.12 * H;
      return <path key={i} d={`M ${x - 0.02 * H} ${b - H} Q ${(x - 0.02 * H + ex) / 2} ${b - H - 0.12 * H} ${ex} ${ey}`} strokeWidth={0.03 * H} />;
    })}
  </g>
);

const clockTower = (x: number, b: number, H: number, c: string) => (
  <g fill={c}>
    <rect x={x - 0.055 * H} y={b - 0.62 * H} width={0.11 * H} height={0.62 * H} />
    <rect x={x - 0.068 * H} y={b - 0.76 * H} width={0.136 * H} height={0.15 * H} />
    <circle cx={x} cy={b - 0.69 * H} r={0.048 * H} fill="rgba(235,225,200,0.55)" />
    <line x1={x} y1={b - 0.69 * H} x2={x} y2={b - 0.725 * H} stroke={c} strokeWidth={0.008 * H} />
    <line x1={x} y1={b - 0.69 * H} x2={x + 0.025 * H} y2={b - 0.69 * H} stroke={c} strokeWidth={0.008 * H} />
    <rect x={x - 0.058 * H} y={b - 0.84 * H} width={0.116 * H} height={0.08 * H} />
    <polygon points={`${x - 0.062 * H},${b - 0.84 * H} ${x},${b - 0.99 * H} ${x + 0.062 * H},${b - 0.84 * H}`} />
    <rect x={x - 0.003 * H} y={b - H} width={0.006 * H} height={0.03 * H} />
  </g>
);

const wheel = (x: number, b: number, H: number, c: string) => {
  const R = 0.36 * H, cy = b - 0.42 * H;
  return (
    <g stroke={c} fill="none">
      <circle cx={x} cy={cy} r={R} strokeWidth={0.012 * H} />
      <circle cx={x} cy={cy} r={R * 0.93} strokeWidth={0.004 * H} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <line key={i} x1={x} y1={cy} x2={x + Math.cos(a) * R} y2={cy + Math.sin(a) * R} strokeWidth={0.003 * H} />;
      })}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <ellipse key={"p" + i} cx={x + Math.cos(a) * R} cy={cy + Math.sin(a) * R} rx={0.016 * H} ry={0.011 * H} fill={c} stroke="none" />;
      })}
      <line x1={x} y1={cy} x2={x - 0.16 * H} y2={b} strokeWidth={0.016 * H} />
      <line x1={x} y1={cy} x2={x + 0.05 * H} y2={b} strokeWidth={0.012 * H} />
    </g>
  );
};

const decoTower = (x: number, b: number, H: number, c: string) => (
  <g fill={c}>
    <rect x={x - 0.12 * H} y={b - 0.58 * H} width={0.24 * H} height={0.58 * H} />
    <rect x={x - 0.085 * H} y={b - 0.72 * H} width={0.17 * H} height={0.15 * H} />
    <rect x={x - 0.055 * H} y={b - 0.8 * H} width={0.11 * H} height={0.09 * H} />
    <rect x={x - 0.03 * H} y={b - 0.86 * H} width={0.06 * H} height={0.07 * H} />
    <polygon points={`${x - 0.016 * H},${b - 0.86 * H} ${x},${b - H} ${x + 0.016 * H},${b - 0.86 * H}`} />
  </g>
);

export const CITIES: Record<CityId, CityStyle> = {
  tokyo: {
    name: "TOKYO",
    local: "21:00",
    sky: ["#030714", "#0B1638", "#2D2858"],
    ground: ["#231C44", "#0A0A1A"],
    building: "#070B1A",
    haze: "#1C1F45",
    crowd: "#020308",
    windows: 0.55,
    moon: { x: 0.82, y: 0.16 },
    stars: true,
    landmark: tvTower,
    landmarkX: 0.7,
    seed: 3,
  },
  bengaluru: {
    name: "BENGALURU",
    local: "17:30",
    sky: ["#2A3A72", "#C9665E", "#FFAA5E"],
    ground: ["#8A5640", "#3A2420"],
    building: "#2A1712",
    haze: "#B5605A",
    crowd: "#140806",
    windows: 0.25,
    sun: { x: 0.24, y: 0.66, r: 0.075, color: "#FFD08A" },
    landmark: (x, b, H, c) => (
      <g>
        {domeHall(x, b, H * 0.82, c)}
        {palm(x - 0.62 * H, b, H * 0.55, c)}
        {palm(x + 0.6 * H, b, H * 0.48, c)}
      </g>
    ),
    landmarkX: 0.58,
    seed: 7,
  },
  london: {
    name: "LONDON",
    local: "12:00",
    sky: ["#6F87A6", "#A9B8CA", "#DCE2E9"],
    ground: ["#8D949C", "#4C535C"],
    building: "#3C4553",
    haze: "#98A6B8",
    crowd: "#0D1118",
    windows: 0,
    clouds: true,
    landmark: (x, b, H, c) => (
      <g>
        {wheel(x + 0.52 * H, b, H * 0.85, c)}
        {clockTower(x - 0.18 * H, b, H, c)}
      </g>
    ),
    landmarkX: 0.42,
    seed: 11,
  },
  newyork: {
    name: "NEW YORK",
    local: "07:00",
    sky: ["#3A5C94", "#B992A4", "#FFD1A0"],
    ground: ["#9C7E74", "#3E3236"],
    building: "#1E1E2E",
    haze: "#A28AA0",
    crowd: "#07070D",
    windows: 0.12,
    sun: { x: 0.82, y: 0.7, r: 0.06, color: "#FFE2B0" },
    landmark: decoTower,
    landmarkX: 0.36,
    seed: 19,
  },
};

const Skyline: React.FC<{ w: number; hz: number; seed: number; color: string; minH: number; maxH: number; windows: number; winColor: string }> = ({
  w,
  hz,
  seed,
  color,
  minH,
  maxH,
  windows,
  winColor,
}) => {
  const items = useMemo(() => {
    const r = seeded(seed);
    const out: { x: number; bw: number; bh: number; ant: boolean; wins: { x: number; y: number }[] }[] = [];
    let x = -20;
    while (x < w + 20) {
      const bw = 28 + r() * 70;
      const bh = minH + r() * (maxH - minH);
      const wins: { x: number; y: number }[] = [];
      if (windows > 0) {
        for (let yy = hz - bh + 8; yy < hz - 6; yy += 11) for (let xx = x + 5; xx < x + bw - 6; xx += 9) if (r() < windows) wins.push({ x: xx, y: yy });
      }
      out.push({ x, bw, bh, ant: r() < 0.2, wins });
      x += bw + r() * 6 - 2;
    }
    return out;
  }, [w, hz, seed, minH, maxH, windows]);
  return (
    <g>
      {items.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={hz - b.bh} width={b.bw} height={b.bh + 2} fill={color} />
          {b.ant ? <rect x={b.x + b.bw / 2 - 1} y={hz - b.bh - 18} width={2} height={18} fill={color} /> : null}
          {b.wins.map((wv, k) => (
            <rect key={k} x={wv.x} y={wv.y} width={4} height={5} fill={winColor} opacity={0.75} />
          ))}
        </g>
      ))}
    </g>
  );
};

export const CityPanel: React.FC<{
  city: CityId;
  w: number;
  h: number;
  t: number; // seconds relative to take-off (may be frozen/remapped)
  label?: number; // 0..1 label reveal
  ripples?: boolean;
  crowdSeed?: number;
  zoom?: number;
  dense?: boolean;
}> = ({ city, w, h, t, label = 1, ripples = false, crowdSeed = 1, zoom = 1, dense = false }) => {
  const frame = useCurrentFrame();
  const c = CITIES[city];
  const hz = h * 0.7;
  const unit = Math.min(w, h * 1.1);
  const crowd = useMemo(
    () =>
      makeCrowd(
        c.seed * 13 + crowdSeed,
        w,
        dense
          ? [
              { n: Math.round(w / 40), H: h * 0.095 },
              { n: Math.round(w / 58), H: h * 0.145 },
              { n: Math.round(w / 85), H: h * 0.215 },
              { n: Math.round(w / 140), H: h * 0.33 },
            ]
          : [
              { n: 11, H: h * 0.12 },
              { n: 8, H: h * 0.2 },
              { n: 5, H: h * 0.32 },
            ],
      ),
    [c.seed, crowdSeed, w, h, dense],
  );
  const rowGround = dense ? [hz + h * 0.035, hz + h * 0.095, hz + h * 0.17, h * 0.975] : [hz + h * 0.05, hz + h * 0.15, h * 0.975];
  const rowShade = dense ? [0.62, 0.44, 0.22, 0] : [0.5, 0.25, 0];
  const drift = Math.sin(frame / 50) * 4;
  const id = `${city}-${w}-${h}-${crowdSeed}`;
  const mixHex = (a: string, b: string, k: number) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  };
  const stars = useMemo(() => {
    const r = seeded(c.seed + 99);
    return Array.from({ length: 50 }, () => ({ x: r() * w, y: r() * hz * 0.7, s: 0.6 + r() * 1.3, a: 0.3 + r() * 0.6 }));
  }, [c.seed, w, hz]);
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.sky[0]} />
          <stop offset="0.55" stopColor={c.sky[1]} />
          <stop offset="1" stopColor={c.sky[2]} />
        </linearGradient>
        <linearGradient id={`gr-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.ground[0]} />
          <stop offset="1" stopColor={c.ground[1]} />
        </linearGradient>
        <radialGradient id={`sun-${id}`}>
          <stop offset="0" stopColor={c.sun?.color ?? "#fff"} stopOpacity={0.95} />
          <stop offset="0.25" stopColor={c.sun?.color ?? "#fff"} stopOpacity={0.5} />
          <stop offset="1" stopColor={c.sun?.color ?? "#fff"} stopOpacity={0} />
        </radialGradient>
        <filter id={`blur-${id}`}>
          <feGaussianBlur stdDeviation={unit * 0.03} />
        </filter>
      </defs>
      <g transform={`translate(${w / 2} ${h * 0.75}) scale(${zoom}) translate(${-w / 2 + drift} ${-h * 0.75})`}>
        <rect x={-40} y={-40} width={w + 80} height={hz + 42} fill={`url(#sky-${id})`} />
        {c.stars ? stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#DDE6FF" opacity={s.a * (0.75 + 0.25 * Math.sin(frame / 9 + i))} />) : null}
        {c.moon ? (
          <g>
            <circle cx={c.moon.x * w} cy={c.moon.y * h} r={unit * 0.09} fill="#BFD0FF" opacity={0.12} />
            <circle cx={c.moon.x * w} cy={c.moon.y * h} r={unit * 0.035} fill="#EEF2FF" />
          </g>
        ) : null}
        {c.sun ? (
          <g>
            <circle cx={c.sun.x * w} cy={c.sun.y * h} r={c.sun.r * unit * 4} fill={`url(#sun-${id})`} />
            <circle cx={c.sun.x * w} cy={c.sun.y * h} r={c.sun.r * unit} fill={c.sun.color} />
          </g>
        ) : null}
        {c.clouds ? (
          <g filter={`url(#blur-${id})`} opacity={0.75}>
            {[0.15, 0.45, 0.8].map((k, i) => (
              <ellipse key={i} cx={k * w + drift * 3} cy={h * (0.14 + 0.08 * i)} rx={w * 0.28} ry={h * 0.05} fill={i === 1 ? "#E9EDF2" : "#C5CFDB"} />
            ))}
          </g>
        ) : null}
        {/* far skyline, hazy */}
        <Skyline w={w} hz={hz} seed={c.seed} color={mixHex(c.building, c.haze, 0.55)} minH={h * 0.06} maxH={h * 0.2} windows={c.windows * 0.5} winColor="#FFC870" />
        {c.landmark(c.landmarkX * w, hz, h * 0.58, mixHex(c.building, c.haze, 0.25))}
        {/* near skyline */}
        <g transform={`translate(${-drift * 0.6} 0)`}>
          <Skyline w={w} hz={hz} seed={c.seed + 5} color={c.building} minH={h * 0.03} maxH={h * 0.12} windows={c.windows} winColor="#FFD58A" />
        </g>
        <rect x={-40} y={hz} width={w + 80} height={h - hz + 40} fill={`url(#gr-${id})`} />
        {/* crowd, back to front; far rows pick up the haze colour */}
        {rowGround.map((_, row) =>
          crowd
            .filter((p) => p.row === row)
            .map((p, i) => (
              <g key={`${row}-${i}`}>
                {ripples && t > AIR ? (
                  <ellipse
                    cx={p.x}
                    cy={rowGround[row]}
                    rx={p.H * (0.15 + (t - AIR) * 0.9)}
                    ry={p.H * (0.035 + (t - AIR) * 0.2)}
                    fill="none"
                    stroke={theme.colors.cyan}
                    strokeWidth={Math.max(1, p.H * 0.012)}
                    opacity={interpolate(t - AIR, [0, 0.05, 0.9], [0, 0.8, 0], CLAMP) * (1 - row * 0.25)}
                  />
                ) : null}
                <Person x={p.x} ground={rowGround[row]} H={p.H} t={t} dir={p.dir} look={p.look} color={mixHex(c.crowd, c.haze, rowShade[row])} />
              </g>
            )),
        )}
      </g>
      {/* label */}
      <g opacity={label} transform={`translate(${interpolate(label, [0, 1], [-14, 0])} 0)`}>
        <rect x={16} y={16} width={Math.max(150, c.name.length * 17 + 112)} height={46} rx={8} fill="rgba(3,6,14,0.62)" stroke="rgba(160,200,255,0.18)" />
        <text x={30} y={48} fill={theme.colors.ink} fontFamily={theme.fonts.display} fontWeight={700} fontSize={27} letterSpacing="0.06em">
          {c.name}
        </text>
        <text x={36 + c.name.length * 15.5} y={47} fill={theme.colors.cyan} fontFamily={theme.fonts.mono} fontWeight={700} fontSize={21}>
          {c.local}
        </text>
      </g>
    </svg>
  );
};
