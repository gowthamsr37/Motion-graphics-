// Stage: night-city backdrop, grade/grain/vignette, header, karaoke captions, cards, chips, the race chart.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import model from "../model.json";
import { theme } from "../theme";
import { captionWords, captions } from "../timing";
import { CLAMP } from "./Motion";

const C = theme.colors;

export const Backdrop: React.FC<{ flash?: number }> = ({ flash = 0 }) => {
  const frame = useCurrentFrame();
  const towers = Array.from({ length: 16 }, (_, i) => ({
    x: i * 72 - 20 + random(`tx${i}`) * 20,
    w: 60 + random(`tw${i}`) * 50,
    h: 180 + random(`th${i}`) * 300,
  }));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at 50% 20%, ${C.bgHi}, ${C.bg} 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(700px 500px at ${50 + Math.sin(frame / 160) * 12}% 85%, rgba(255,140,90,0.16), transparent 70%)` }} />
      {/* stars */}
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`sx${i}`) * 1080, top: random(`sy${i}`) * 900, width: 3, height: 3, borderRadius: 2, background: C.text, opacity: 0.15 + 0.25 * Math.abs(Math.sin(frame / (30 + i) + i)) }} />
      ))}
      {/* skyline, drifting very slowly */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `translateX(${-((frame * 0.15) % 72)}px)` }}>
        {towers.map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={1920 - t.h} width={t.w} height={t.h} fill="#0E0B22" />
            {Array.from({ length: Math.floor(t.h / 40) }).map((_, r) =>
              [0, 1].map((c) => (random(`w${i}-${r}-${c}`) > 0.6 ? <rect key={`${r}-${c}`} x={t.x + 12 + c * (t.w / 2 - 6)} y={1920 - t.h + 16 + r * 40} width={t.w / 2 - 22} height={16} fill="#FFCF7A" opacity={0.18} /> : null)),
            )}
          </g>
        ))}
      </svg>
      <AbsoluteFill style={{ background: C.red, opacity: flash * 0.28, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.06, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />;
export const Grade: React.FC = () => <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", background: "linear-gradient(180deg, rgba(255,200,150,0.12), rgba(80,40,140,0.12))" }} />;

export const FadeEdges: React.FC<{ fadeIn: number; fadeOut: number; total: number }> = ({ fadeIn, fadeOut, total }) => {
  const frame = useCurrentFrame();
  const o = Math.max(interpolate(frame, [0, fadeIn], [1, 0], CLAMP), interpolate(frame, [total - fadeOut, total], [0, 1], CLAMP));
  return <AbsoluteFill style={{ background: "#000", opacity: o, pointerEvents: "none" }} />;
};

export const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 4, fps, config: theme.spring.smooth });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 130, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: p, transform: `translateY(${(1 - p) * -20}px)` }}>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, letterSpacing: "0.18em", color: C.text }}>
        MONEY STORIES <span style={{ color: C.meera }}>· EP 01</span>
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: C.dim, letterSpacing: "0.08em" }}>
        <span style={{ color: C.arjun }}>BUY</span> vs <span style={{ color: C.meera }}>RENT</span>
      </div>
    </div>
  );
};

export const Captions: React.FC<{ hideAfter: number }> = ({ hideAfter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cur = captions(fps).find((c) => frame >= c.from - 2 && frame <= c.to + 8);
  if (!cur || frame > hideAfter) return null;
  const ws = captionWords(fps).filter((w) => w.from >= cur.from - 1 && w.from <= cur.to);
  const inP = interpolate(frame, [cur.from - 2, cur.from + 5], [0, 1], CLAMP);
  const outP = interpolate(frame, [cur.to + 2, cur.to + 8], [0, 1], CLAMP);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1500, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 14, rowGap: 2, maxWidth: 940, opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 14}px)`, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 46, lineHeight: 1.25, textAlign: "center", textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>
        {ws.map((w, i) => {
          const said = frame >= w.from;
          const now = said && (i === ws.length - 1 || frame < ws[i + 1].from);
          return (
            <span key={i} style={{ color: now ? C.meera : said ? C.text : "rgba(246,239,230,0.45)" }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color, style }) => (
  <div style={{ background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`, borderRadius: 32, boxShadow: `inset 0 0 0 2px ${color ?? C.edge}, 0 24px 60px rgba(0,0,0,0.4)`, padding: "30px 36px", ...style }}>{children}</div>
);

export const Pop: React.FC<{ delay: number; exit?: number; children: React.ReactNode; style?: React.CSSProperties; y?: number; config?: { damping: number; stiffness: number; mass: number } }> = ({ delay, exit, children, style, y = 40, config = theme.spring.smooth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config });
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 9], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return (
    <div style={{ opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP) * (1 - out), transform: `translateY(${(1 - p) * y - out * 24}px) scale(${interpolate(p, [0, 1], [0.92, 1]) - out * 0.04})`, ...style }}>{children}</div>
  );
};

export const lakh = (v: number) => (v >= 1e7 ? `₹${(v / 1e7).toFixed(1)} Cr` : `₹${Math.round(v / 1e5)} L`);

// Net-worth race: Arjun's home equity vs Meera's portfolio, revealed up to `year` (fractional).
type Row = { y: number; arjun: number; meera: number };
const ROWS: Row[] = [{ y: 0, arjun: 18e5, meera: 25e5 }, ...(model as { base: Row[] }).base.map((r) => ({ y: r.y, arjun: r.arjun, meera: r.meera }))];
const valAt = (key: "arjun" | "meera", t: number) => {
  const i = Math.min(ROWS.length - 2, Math.max(0, Math.floor(t)));
  const f = t - i;
  return ROWS[i][key] + (ROWS[i + 1][key] - ROWS[i][key]) * Math.min(1, Math.max(0, f));
};

export const Race: React.FC<{ year: number; yMax: number; xMax: number; width?: number; height?: number; crash?: number }> = ({ year, yMax, xMax, width = 960, height = 760, crash = 0 }) => {
  const frame = useCurrentFrame();
  const padL = 30, padR = 170, padT = 40, padB = 70;
  const x = (t: number) => padL + (t / xMax) * (width - padL - padR);
  const y = (v: number) => height - padB - (v / yMax) * (height - padT - padB);
  const line = (key: "arjun" | "meera") => {
    const pts: string[] = [];
    for (let t = 0; t <= year + 1e-6; t += 0.1) pts.push(`${x(t).toFixed(1)},${y(valAt(key, t)).toFixed(1)}`);
    pts.push(`${x(year).toFixed(1)},${y(valAt(key, year)).toFixed(1)}`);
    return "M" + pts.join("L");
  };
  const ticks = xMax <= 6 ? [0, 1, 2, 3, 4, 5, 6] : [0, 5, 10, 15, 20];
  const yt = yMax <= 1.2e7 ? [0, 25e5, 50e5, 75e5, 1e7].filter((v) => v <= yMax) : [0, 1e7, 2e7, 3e7, 4e7];
  // keep the two value labels apart when the lines meet
  const ya = y(valAt("arjun", year)), ym = y(valAt("meera", year));
  const gap = 46 - Math.abs(ya - ym);
  const push = gap > 0 ? gap / 2 : 0;
  const labelDy = { arjun: ya >= ym ? push : -push, meera: ym > ya ? push : -push };
  const head = (key: "arjun" | "meera", color: string) => {
    const v = valAt(key, year);
    return (
      <g transform={`translate(${x(year)}, ${y(v)})`}>
        <circle r={22 + Math.sin(frame / 6) * 3} fill={color} opacity={0.25} />
        <circle r={13} fill={color} stroke={C.bg} strokeWidth={4} />
        <text x={26} y={10 + labelDy[key]} fontFamily={theme.fonts.num} fontWeight={700} fontSize={36} fill={color}>
          {lakh(v)}
        </text>
      </g>
    );
  };
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {yt.map((v) => (
        <g key={v}>
          <line x1={padL} x2={width - padR + 20} y1={y(v)} y2={y(v)} stroke={C.grid} strokeWidth={2} />
          <text x={width - padR + 30} y={y(v) + 8} fontFamily={theme.fonts.num} fontSize={22} fill={C.faint}>{v === 0 ? "0" : lakh(v)}</text>
        </g>
      ))}
      {ticks.map((t) => (
        <text key={t} x={x(t)} y={height - padB + 46} fontFamily={theme.fonts.num} fontSize={26} fill={C.dim} textAnchor="middle">
          {t === 0 ? "Start" : `Yr ${t}`}
        </text>
      ))}
      {crash > 0 && <rect x={x(5)} y={padT - 20} width={x(6) - x(5)} height={height - padT - padB + 20} fill={C.red} opacity={0.12 * crash} rx={10} />}
      <path d={line("arjun")} fill="none" stroke={C.arjun} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={line("meera")} fill="none" stroke={C.meera} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      {head("arjun", C.arjun)}
      {head("meera", C.meera)}
    </svg>
  );
};

export const Legend: React.FC = () => (
  <div style={{ display: "flex", gap: 34, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 28 }}>
    <span style={{ color: C.arjun }}>● Arjun · his share of the flat</span>
    <span style={{ color: C.meera }}>● Meera · investments</span>
  </div>
);
