// The 100 Days of ML cover, template v2 (user, Nov 2026): a framed blue panel on a dark navy page; a yellow
// "100 DAYS OF ML" banner with rules either side; a cyan-edged "DAY 0n" badge; the topic in heavy italic caps
// (first line white, the rest yellow) with a yellow swoosh; a subtitle on a yellow brush stroke; a BEFORE → AFTER
// pair of light tables; a 4-item bar with icons; the handle between rules.
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

const Y = "#FFD60A";
const CY = "#38BDF8";
const INK = "#0A1A3A";
const F = theme.fonts.display;
const it: React.CSSProperties = { fontFamily: F, fontWeight: 800, fontStyle: "italic", whiteSpace: "nowrap" };

export type Tbl = { head: string; good: boolean; rows: string[][]; hc?: string };
export type IconName = "trash" | "bars" | "grid" | "flag" | "key" | "shield" | "layers" | "tag" | "hash" | "target" | "question" | "copy";

const Ico: React.FC<{ n: IconName }> = ({ n }) => {
  const s = { fill: "none", stroke: Y, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const g: Record<IconName, React.ReactNode> = {
    trash: <><path d="M14 22 H58 M28 22 V14 H44 V22" {...s} /><path d="M20 22 L24 62 H48 L52 22" {...s} stroke={CY} /></>,
    bars: <><rect x={12} y={40} width={12} height={22} rx={2} fill={CY} /><rect x={30} y={28} width={12} height={34} rx={2} fill={Y} /><rect x={48} y={14} width={12} height={48} rx={2} fill={CY} /></>,
    grid: <>{[0, 1, 2].map((i) => [0, 1, 2].map((j) => <circle key={`${i}${j}`} cx={18 + i * 18} cy={18 + j * 18} r={6} fill={(i + j) % 2 ? CY : Y} />))}</>,
    flag: <><path d="M18 64 V10" {...s} stroke={CY} /><path d="M18 12 H56 L48 26 L56 40 H18" fill={Y} /></>,
    key: <><circle cx={24} cy={36} r={12} {...s} /><path d="M36 36 H62 M54 36 V46 M62 36 V44" {...s} stroke={CY} /></>,
    shield: <><path d="M36 10 L60 18 V36 Q60 54 36 64 Q12 54 12 36 V18 Z" {...s} stroke={CY} /><path d="M26 36 L33 43 L47 28" {...s} /></>,
    layers: <><path d="M36 12 L62 26 L36 40 L10 26 Z" fill={Y} /><path d="M10 38 L36 52 L62 38" {...s} stroke={CY} /><path d="M10 50 L36 64 L62 50" {...s} /></>,
    tag: <><path d="M12 14 H38 L62 38 L38 62 L12 36 Z" {...s} stroke={CY} /><circle cx={26} cy={28} r={5} fill={Y} /></>,
    hash: <><path d="M28 12 L22 62 M50 12 L44 62" {...s} stroke={CY} /><path d="M12 28 H62 M10 46 H60" {...s} /></>,
    target: <><circle cx={36} cy={36} r={24} {...s} stroke={CY} /><circle cx={36} cy={36} r={12} {...s} /><circle cx={36} cy={36} r={4} fill={Y} /></>,
    question: <><circle cx={36} cy={36} r={26} {...s} stroke={CY} /><path d="M27 28 Q28 18 37 18 Q46 18 46 27 Q46 33 37 37 V43" {...s} /><circle cx={37} cy={53} r={4} fill={Y} /></>,
    copy: <><rect x={12} y={12} width={32} height={36} rx={5} {...s} stroke={CY} /><rect x={28} y={26} width={32} height={36} rx={5} {...s} /></>,
  };
  return <svg width={72} height={72} viewBox="0 0 72 72">{g[n]}</svg>;
};

const Table: React.FC<{ t: Tbl; x: number; y: number; w: number }> = ({ t, x, y, w }) => {
  const c = t.hc ?? (t.good ? "#16A34A" : "#DC2626");
  const glow = t.good ? "#22C55E" : CY;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 26, padding: 12, boxSizing: "border-box", background: "rgba(8,30,70,0.6)", border: `4px solid ${glow}`, boxShadow: `0 0 34px ${glow}aa, inset 0 0 20px ${glow}55` }}>
      <div style={{ borderRadius: 16, overflow: "hidden", background: "#E8EEF7" }}>
        <div style={{ background: t.hc ?? `linear-gradient(180deg, ${c}, ${t.good ? "#15803D" : "#B91C1C"})`, color: "#FFFFFF", textAlign: "center", padding: "6px 0", ...it, fontSize: 40 }}>{t.head}</div>
        {t.rows.map((r, i) => (
          <div key={i} style={{ display: "flex", borderTop: "3px solid #B9C6DA" }}>
            {r.map((v, j) => (
              <div key={j} style={{ flex: 1, textAlign: "center", padding: "5px 0", borderLeft: j ? "3px solid #B9C6DA" : undefined, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 34, color: INK }}>{v}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Rule: React.FC<{ y: number; w: number; c?: string }> = ({ y, w, c = "#FFFFFF" }) => (
  <>
    <div style={{ position: "absolute", left: 130, width: w, top: y, height: 3, background: c }} />
    <div style={{ position: "absolute", right: 130, width: w, top: y, height: 3, background: c }} />
  </>
);

export const MLCover2: React.FC<{
  day: number;
  lines: string[]; // topic lines: the first white, the rest yellow
  sub: string[]; // 1–2 subtitle lines on the yellow brush
  left: Tbl;
  right: Tbl;
  bar: { t: string[]; i: IconName }[];
}> = ({ day, lines, sub, left, right, bar }) => {
  const size = (s: string) => Math.min(140, Math.floor(820 / (s.length * 0.8)));
  let ty = 560;
  const topic = lines.map((l, k) => {
    const fs = size(l);
    const el = (
      <div key={k} style={{ position: "absolute", left: 0, right: 0, top: ty, textAlign: "center", ...it, fontSize: fs, lineHeight: 1, letterSpacing: "-0.02em", color: k === 0 ? "#FFFFFF" : Y, textShadow: "0 8px 0 rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.5)" }}>{l}</div>
    );
    ty += fs * 0.98;
    return el;
  });
  const swoosh = ty + 18;
  const subY = swoosh + 50;
  const subH = sub.length > 1 ? 140 : 96;
  const tabY = subY + subH + 40;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #14233A 0%, #0A1830 30%, #071226 100%)" }}>
      {/* the framed panel */}
      <div style={{ position: "absolute", left: 80, top: 218, width: 920, height: 1634, borderRadius: 18, border: "2px solid rgba(56,189,248,0.55)", overflow: "hidden", background: "radial-gradient(90% 60% at 50% 40%, #0B4A9C 0%, #083A80 45%, #062A5E 100%)" }}>
        <div style={{ position: "absolute", right: -240, top: 120, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.25), transparent 65%)" }} />
        <div style={{ position: "absolute", left: -200, bottom: 160, width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.2), transparent 65%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 380, backgroundImage: "radial-gradient(rgba(125,211,252,0.45) 1.6px, transparent 2px)", backgroundSize: "16px 16px", WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 10% 100%, black, transparent), radial-gradient(ellipse 60% 70% at 90% 100%, black, transparent)" }} />
      </div>
      {/* 1. series banner */}
      <Rule y={344} w={80} />
      <div style={{ position: "absolute", left: 220, right: 220, top: 296, height: 96, borderRadius: 22, background: Y, boxShadow: `0 0 40px ${Y}66`, display: "flex", alignItems: "center", justifyContent: "center", ...it, fontSize: 70, letterSpacing: "-0.03em", color: INK }}>100 DAYS OF ML</div>
      {/* 2. day badge */}
      <div style={{ position: "absolute", left: 330, right: 330, top: 418, height: 106, borderRadius: 22, background: "#071A3A", border: `5px solid ${CY}`, boxShadow: `0 0 26px ${CY}, inset 0 0 14px ${CY}66`, transform: "skewX(-6deg)", display: "flex", alignItems: "center", justifyContent: "center", gap: 22, ...it, fontSize: 92 }}>
        <span style={{ color: "#FFFFFF" }}>DAY</span>
        <span style={{ color: Y }}>{String(day).padStart(2, "0")}</span>
      </div>
      {/* 3. topic + swoosh */}
      {topic}
      <svg style={{ position: "absolute", left: 320, top: swoosh }} width={440} height={30} viewBox="0 0 440 30">
        <path d="M6 22 Q220 0 434 12 Q220 8 10 28 Z" fill={Y} />
      </svg>
      {/* 4. subtitle on a brush stroke */}
      <div style={{ position: "absolute", left: 175, right: 175, top: subY, height: subH, background: Y, transform: "rotate(-2deg)", clipPath: "polygon(2% 8%, 10% 0, 35% 6%, 60% 0, 88% 5%, 100% 0, 97% 30%, 100% 55%, 98% 100%, 70% 94%, 40% 100%, 12% 95%, 0 100%, 3% 60%, 0 30%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {sub.map((l) => (
          <div key={l} style={{ ...it, fontSize: 50, lineHeight: 1.12, color: INK }}>{l}</div>
        ))}
      </div>
      {/* 5. before → after tables */}
      <Table t={left} x={160} y={tabY} w={330} />
      <Table t={right} x={590} y={tabY} w={330} />
      <svg style={{ position: "absolute", left: 500, top: tabY + 150 }} width={80} height={70} viewBox="0 0 80 70" overflow="visible">
        <path d="M6 24 H44 V8 L76 35 L44 62 V46 H6 Z" fill={Y} style={{ filter: `drop-shadow(0 0 12px ${Y})` }} />
      </svg>
      {/* 6. the 4-item bar */}
      <div style={{ position: "absolute", left: 130, right: 130, top: 1480, height: 170, borderRadius: 34, background: "rgba(6,30,70,0.75)", border: `4px solid ${CY}`, boxShadow: `0 0 30px ${CY}aa`, display: "flex", alignItems: "center" }}>
        {bar.map((b, k) => (
          <div key={k} style={{ flex: 1, height: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, borderLeft: k ? "2px solid rgba(125,211,252,0.5)" : undefined }}>
            <Ico n={b.i} />
            {b.t.map((l) => (
              <div key={l} style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, lineHeight: 1.08, color: "#FFFFFF", whiteSpace: "nowrap" }}>{l}</div>
            ))}
          </div>
        ))}
      </div>
      {/* 7. handle */}
      <Rule y={1746} w={110} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1720, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: "#FFFFFF" }}>
        <span style={{ color: Y }}>@</span>curious_datascientist
      </div>
    </AbsoluteFill>
  );
};
