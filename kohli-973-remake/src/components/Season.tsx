// IPL 2016 graphics: full-bleed photos, the season graph, Orange Cap leaderboard, century cards,
// the nine-stitch illustration and the final's innings comparison. Every chart uses a true linear scale.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PhotoId, photos } from "../photos";
import { theme } from "../theme";
import { CLAMP } from "./Motion";
import { Lamp, Lettering } from "./Panel";

const C = theme.colors;
export const RCB_RED = "#D1342F";
export const GREY = "#8E8A7C";

/* ---------- full-bleed photograph: no frame, feathered into the board, Ken Burns + parallax ---------- */
export const FullBleed: React.FC<{
  id: PhotoId;
  y: number;
  h: number;
  inAt?: number;
  outAt?: number;
  focus?: string;
  zoom?: [number, number];
  pan?: [number, number];
  life?: number;
  tint?: "red" | "amber" | "cold" | "none";
  dim?: number; // 0..1 extra darkening so panels read on top
  captionY?: number; // caption plate position (absolute), default bottom of the photo
}> = ({ id, y, h, inAt = 0, outAt, focus = "50% 50%", zoom = [1.05, 1.15], pan = [0, 0], life = 240, tint = "red", dim = 0.25, captionY }) => {
  const frame = useCurrentFrame();
  const p = photos[id];
  const fadeIn = interpolate(frame, [inAt, inAt + 12], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const fadeOut = outAt === undefined ? 0 : interpolate(frame, [outAt, outAt + 12], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const t = interpolate(frame, [inAt, inAt + life], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const tintBg =
    tint === "red"
      ? "linear-gradient(180deg, rgba(160,30,25,0.28), rgba(30,6,6,0.35))"
      : tint === "amber"
        ? "radial-gradient(ellipse at 40% 20%, rgba(242,169,59,0.35), rgba(20,12,4,0.25) 70%)"
        : tint === "cold"
          ? "linear-gradient(180deg, rgba(40,60,80,0.4), rgba(8,14,20,0.45))"
          : "transparent";
  if (fadeIn <= 0 || fadeOut >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1080, height: h, overflow: "hidden", opacity: fadeIn * (1 - fadeOut) }}>
      <Img
        src={staticFile(p.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focus,
          transform: `translateX(${interpolate(t, [0, 1], pan)}px) scale(${interpolate(t, [0, 1], zoom)})`,
          filter: `saturate(${tint === "cold" ? 0.5 : 1.08}) contrast(1.06) brightness(${0.9 - dim * 0.4})`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: tintBg, mixBlendMode: tint === "amber" ? "soft-light" : "multiply" }} />
      {/* feather into the scoreboard above and below */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.board} 0%, transparent 16%, transparent 78%, ${C.board} 100%)` }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 160px rgba(0,0,0,0.6)" }} />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: (captionY ?? y + h - 74) - y,
          padding: "7px 14px 6px",
          borderRadius: 6,
          background: "rgba(10,15,12,0.78)",
          boxShadow: `inset 0 0 0 1px ${C.panelEdge}`,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Lettering size={18} font="body" weight={600} spacing="0.12em">
          {p.place}
        </Lettering>
        <Lettering size={12} font="body" weight={400} color={C.creamDim} spacing="0.1em">
          {p.credit}
        </Lettering>
      </div>
    </div>
  );
};

/* ---------- Graph: the season — cumulative total (top) over the 16 innings (bottom), shared x-axis ---------- */
export const SeasonGraph: React.FC<{
  scores: number[];
  w: number;
  h: number;
  barsAt: number;
  fiftyAt?: number; // light every 50+ score
  tonsAt?: number; // pulse the four hundreds
  lineAt: number; // cumulative line starts drawing
  lineLen?: number;
  lineTo?: number; // last innings index the line reaches (inclusive)
  markers?: { i: number; at: number; label: string; dy?: number }[];
  compact?: boolean;
}> = ({ scores, w, h, barsAt, fiftyAt = 1e9, tonsAt = 1e9, lineAt, lineLen = 60, lineTo, markers = [], compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = scores.length;
  const cum = scores.reduce<number[]>((a, x) => [...a, (a[a.length - 1] ?? 0) + x], []);
  const last = lineTo ?? n - 1;
  const L = 78, R = 30;
  const pw = w - L - R;
  const slot = pw / n;
  const X = (i: number) => L + slot * i + slot / 2;
  // top: cumulative 0–1000
  const T0 = 20, TH = compact ? h - 70 : h * 0.42;
  const Yc = (v: number) => T0 + TH * (1 - v / 1000);
  // bottom: innings 0–120
  const B0 = T0 + TH + 70, BH = h - B0 - 64;
  const Yb = (v: number) => B0 + BH * (1 - v / 120);
  const prog = interpolate(frame, [lineAt, lineAt + lineLen], [0, last], { easing: theme.ease.inOut, ...CLAMP });
  const pts = cum.slice(0, last + 1).map((v, i) => ({ x: X(i), y: Yc(v) }));
  const k = Math.floor(prog);
  const fr = prog - k;
  const drawn = pts.slice(0, k + 1);
  if (k < last) drawn.push({ x: pts[k].x + (pts[k + 1].x - pts[k].x) * fr, y: pts[k].y + (pts[k + 1].y - pts[k].y) * fr });
  const path = drawn.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = drawn.length > 1 ? `${path} L${drawn[drawn.length - 1].x.toFixed(1)},${Yc(0)} L${drawn[0].x.toFixed(1)},${Yc(0)} Z` : "";
  const fifty = interpolate(frame, [fiftyAt, fiftyAt + 10], [0, 1], CLAMP);
  const tonPulse = frame >= tonsAt ? 0.5 + 0.5 * Math.sin((frame - tonsAt) / 4) : 0;
  const head = drawn[drawn.length - 1];
  const headVal = Math.round(k < last ? cum[k] + (cum[k + 1] - cum[k]) * fr : cum[last]);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {/* cumulative axis */}
      {[0, 500, 1000].map((v) => (
        <g key={`c${v}`}>
          <line x1={L} x2={L + pw} y1={Yc(v)} y2={Yc(v)} stroke={v === 0 ? C.creamDim : C.panelEdge} strokeWidth={v === 0 ? 2 : 1.5} />
          <text x={L - 12} y={Yc(v) + 9} textAnchor="end" fontFamily={theme.fonts.display} fontSize={28} fill={C.creamDim}>
            {v}
          </text>
        </g>
      ))}
      <text x={L} y={T0 - 2} fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.2em" fill={C.amber}>
        SEASON TOTAL
      </text>
      {area && <path d={area} fill="url(#cumFill)" opacity={0.35} />}
      <defs>
        <linearGradient id="cumFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
        </linearGradient>
      </defs>
      {drawn.length > 1 && <path d={path} fill="none" stroke={C.amber} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.amberGlow})` }} />}
      {frame >= lineAt && (
        <g>
          <circle cx={head.x} cy={head.y} r={9} fill={C.amber} />
          <rect x={head.x - 44} y={head.y - 52} width={88} height={38} rx={6} fill="rgba(10,15,12,0.9)" stroke={C.amber} strokeWidth={1.5} />
          <text x={head.x} y={head.y - 23} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={32} fill={C.amber}>
            {headVal}
          </text>
        </g>
      )}
      {markers.map((m) => {
        const on = interpolate(frame, [m.at, m.at + 10], [0, 1], CLAMP);
        const cx = X(m.i), cy = Yc(cum[m.i]);
        return (
          <g key={m.label} opacity={on}>
            <line x1={cx} x2={cx} y1={cy + 12} y2={Yc(0)} stroke={C.cream} strokeWidth={2} strokeDasharray="5 6" opacity={0.6} />
            <circle cx={cx} cy={cy} r={8} fill={C.board} stroke={C.cream} strokeWidth={3} />
            <text x={cx - 14} y={cy + (m.dy ?? 40)} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={18} letterSpacing="0.06em" fill={C.cream}>
              {m.label}
            </text>
          </g>
        );
      })}
      {!compact && (
        <>
          {/* innings bars */}
          {[50, 100].map((v) => (
            <g key={`b${v}`}>
              <line x1={L} x2={L + pw} y1={Yb(v)} y2={Yb(v)} stroke={v === 50 ? C.cream : C.amber} strokeWidth={2} strokeDasharray="8 8" opacity={v === 50 ? 0.25 + 0.5 * fifty : 0.45} />
              <text x={L - 12} y={Yb(v) + 9} textAnchor="end" fontFamily={theme.fonts.display} fontSize={28} fill={v === 50 ? C.cream : C.amber}>
                {v}
              </text>
            </g>
          ))}
          <line x1={L} x2={L + pw} y1={Yb(0)} y2={Yb(0)} stroke={C.creamDim} strokeWidth={2} />
          <text x={L} y={B0 - 30} fontFamily={theme.fonts.body} fontWeight={600} fontSize={17} letterSpacing="0.2em" fill={C.cream}>
            RUNS EACH INNINGS
          </text>
          {scores.map((v, i) => {
            const g = spring({ frame: frame - barsAt - i * 3, fps, config: theme.spring.smooth });
            const ton = v >= 100;
            const fiftyPlus = v >= 50;
            const col = ton ? C.amber : fiftyPlus ? C.cream : GREY;
            const bh = Math.max(3, (BH * v) / 120) * Math.min(1, g);
            const lit = ton ? 0.8 + 0.2 * tonPulse : fiftyPlus ? 0.55 + 0.45 * fifty : 0.55 - 0.15 * fifty;
            return (
              <g key={i} opacity={lit}>
                <rect x={X(i) - slot * 0.32} y={Yb(0) - bh} width={slot * 0.64} height={bh} rx={3} fill={col} style={ton ? { filter: `drop-shadow(0 0 ${8 + 10 * tonPulse}px ${C.amberGlow})` } : undefined} />
                <text x={X(i)} y={Yb(0) - bh - 8} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={v >= 100 ? 26 : 23} fill={col} opacity={interpolate(g, [0.4, 0.9], [0, 1], CLAMP)}>
                  {v}
                </text>
                {fiftyPlus && <circle cx={X(i)} cy={Yb(0) + 18} r={5} fill={ton ? C.amber : C.cream} opacity={fifty} />}
              </g>
            );
          })}
        </>
      )}
      {scores.map((_, i) => (
        <text key={`x${i}`} x={X(i)} y={h - 14} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={22} fill={C.creamDim}>
          {i + 1}
        </text>
      ))}
      <text x={L + pw} y={h + 12} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={600} fontSize={14} letterSpacing="0.2em" fill={C.creamDim}>
        INNINGS
      </text>
    </svg>
  );
};

/* ---------- Orange Cap leaderboard: one common 0–1000 scale ---------- */
export const Leaderboard: React.FC<{ rows: { name: string; runs: number; kohli?: boolean }[]; at: number; w: number }> = ({ rows, at, w }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nameW = 230, valW = 120;
  const barMax = w - nameW - valW - 20;
  return (
    <div style={{ position: "relative", width: w }}>
      {/* scale ticks */}
      <div style={{ position: "relative", marginLeft: nameW, width: barMax, height: 30 }}>
        {[0, 250, 500, 750, 1000].map((v) => (
          <div key={v} style={{ position: "absolute", left: (barMax * v) / 1000 - 30, width: 60, textAlign: "center" }}>
            <Lettering size={20} color={C.creamDim}>
              {v}
            </Lettering>
          </div>
        ))}
      </div>
      {rows.map((r, i) => {
        const p = spring({ frame: frame - at - i * 8, fps, config: { damping: 18, stiffness: 70, mass: 1 } });
        const col = r.kohli ? C.amber : C.cream;
        return (
          <div key={r.name} style={{ display: "flex", alignItems: "center", height: 92, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
            <div style={{ width: nameW, display: "flex", alignItems: "center", gap: 12 }}>
              <Lettering size={34} color={C.creamDim}>
                {i + 1}
              </Lettering>
              <Lettering size={40} color={col}>
                {r.name}
              </Lettering>
            </div>
            <div style={{ position: "relative", width: barMax, height: 46 }}>
              {[250, 500, 750].map((v) => (
                <div key={v} style={{ position: "absolute", left: (barMax * v) / 1000, top: -8, bottom: -8, width: 1, background: C.panelEdge }} />
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: (barMax * r.runs * Math.min(1, p)) / 1000,
                  borderRadius: 5,
                  background: r.kohli ? `linear-gradient(90deg, #c76a12, ${C.amber})` : `linear-gradient(90deg, ${GREY}, ${C.cream})`,
                  boxShadow: r.kohli ? `0 0 22px ${C.amberGlow}` : undefined,
                }}
              />
              {r.kohli && (
                <div style={{ position: "absolute", left: (barMax * r.runs * Math.min(1, p)) / 1000 - 150, top: 9, opacity: interpolate(p, [0.8, 1], [0, 1], CLAMP) }}>
                  <Lettering size={22} font="body" color={C.board} spacing="0.16em">
                    ORANGE CAP
                  </Lettering>
                </div>
              )}
            </div>
            <div style={{ width: valW, textAlign: "right" }}>
              <Lettering size={50} color={col}>
                {Math.round(r.runs * Math.min(1, p))}
              </Lettering>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- original cricket graphic: a raised bat with a burst (no photo, no likeness) ---------- */
export const RaisedBat: React.FC<{ size: number; color?: string; burst?: number }> = ({ size, color = C.cream, burst = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    {Array.from({ length: 16 }).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <line key={i} x1={100 + Math.cos(a) * 52} y1={92 + Math.sin(a) * 52} x2={100 + Math.cos(a) * (70 + 18 * burst)} y2={92 + Math.sin(a) * (70 + 18 * burst)} stroke={C.amber} strokeWidth={4} strokeLinecap="round" opacity={0.35 + 0.4 * burst} />;
    })}
    <g transform="rotate(-28 100 100)">
      <rect x={93} y={22} width={14} height={50} rx={6} fill={color} opacity={0.85} />
      <rect x={90} y={30} width={20} height={6} rx={2} fill={C.board} opacity={0.5} />
      <rect x={90} y={44} width={20} height={6} rx={2} fill={C.board} opacity={0.5} />
      <path d="M80 72 L120 72 L122 168 Q100 184 78 168 Z" fill={color} />
      <path d="M96 78 L104 78 L104 160 L96 160 Z" fill={C.board} opacity={0.12} />
    </g>
    <circle cx={148} cy={150} r={13} fill={RCB_RED} />
    <path d="M138 146 Q148 152 158 146" stroke={C.cream} strokeWidth={2} fill="none" opacity={0.8} />
  </svg>
);

/* ---------- the nine stitches: an explanatory illustration of a left hand (not a photograph) ---------- */
export const HandStitches: React.FC<{ at: number; w: number; h: number }> = ({ at, w, h }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at - 20, at], [0, 1], { easing: theme.ease.out, ...CLAMP });
  // stitches across the webbing between thumb and index finger
  const stitches = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    return { x: 128 + t * 46, y: 168 - t * 58 };
  });
  return (
    <svg width={w} height={h} viewBox="0 0 320 320" style={{ overflow: "visible" }}>
      <g opacity={draw} fill="none" stroke={C.cream} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        {/* palm and wrist (left hand, back of the hand towards us) */}
        <path d="M120 300 L118 230 Q100 210 98 180 L92 140 Q88 118 104 116 Q118 115 122 136 L132 172" />
        <path d="M122 136 L124 64 Q126 44 142 44 Q158 46 158 66 L158 120" />
        <path d="M158 120 L160 40 Q162 20 178 20 Q194 22 194 42 L192 120" />
        <path d="M192 120 L196 52 Q198 34 214 34 Q230 36 228 56 L222 128" />
        <path d="M222 128 L232 86 Q238 70 252 74 Q264 80 258 98 L240 170 Q232 214 210 236 L206 300" />
      </g>
      {/* the wound line */}
      <path d="M126 172 Q150 150 176 108" fill="none" stroke={C.red} strokeWidth={4} strokeLinecap="round" opacity={draw * 0.9} style={{ filter: `drop-shadow(0 0 6px ${C.redGlow})` }} />
      {stitches.map((s, i) => {
        const on = interpolate(frame, [at + i * 5, at + i * 5 + 4], [0, 1], CLAMP);
        return (
          <g key={i} opacity={on} transform={`translate(${s.x} ${s.y}) rotate(38)`}>
            <line x1={-11} x2={11} y1={0} y2={0} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
            <circle cx={-11} cy={0} r={2.5} fill={C.amber} />
            <circle cx={11} cy={0} r={2.5} fill={C.amber} />
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- final: SRH 208 v RCB 200 on one 0–220 scale, the 8-run gap marked ---------- */
export const FinalBars: React.FC<{ srhAt: number; rcbAt: number; gapAt: number; w: number }> = ({ srhAt, rcbAt, gapAt, w }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const MAX = 220;
  const nameW = 120, valW = 150;
  const barMax = w - nameW - valW - 10;
  const rows = [
    { team: "SRH", runs: 208, wk: 7, at: srhAt, col: "#F07A2B" },
    { team: "RCB", runs: 200, wk: 7, at: rcbAt, col: RCB_RED },
  ];
  const gap = interpolate(frame, [gapAt, gapAt + 10], [0, 1], CLAMP);
  return (
    <div style={{ position: "relative", width: w }}>
      {rows.map((r) => {
        const p = spring({ frame: frame - r.at, fps, config: { damping: 18, stiffness: 60, mass: 1.1 } });
        const v = Math.round(r.runs * Math.min(1, p));
        return (
          <div key={r.team} style={{ display: "flex", alignItems: "center", height: 84, opacity: interpolate(p, [0, 0.2], [0.25, 1], CLAMP) }}>
            <div style={{ width: nameW }}>
              <Lettering size={50} color={C.cream}>
                {r.team}
              </Lettering>
            </div>
            <div style={{ position: "relative", width: barMax, height: 44, background: C.plate, borderRadius: 5, boxShadow: `inset 0 0 0 1px ${C.panelEdge}` }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (barMax * v) / MAX, borderRadius: 5, background: r.col, opacity: 0.9 }} />
            </div>
            <div style={{ width: valW, textAlign: "right" }}>
              <Lettering size={54} color={C.cream}>
                {v}/{r.wk}
              </Lettering>
            </div>
          </div>
        );
      })}
      {/* scale */}
      <div style={{ position: "relative", marginLeft: nameW, width: barMax, height: 30, marginTop: 4 }}>
        {[0, 50, 100, 150, 200].map((v) => (
          <div key={v} style={{ position: "absolute", left: (barMax * v) / MAX - 30, width: 60, textAlign: "center" }}>
            <Lettering size={20} color={C.creamDim}>
              {v}
            </Lettering>
          </div>
        ))}
      </div>
      {/* the 8-run gap */}
      <div
        style={{
          position: "absolute",
          left: nameW + (barMax * 200) / MAX,
          top: 10,
          width: (barMax * 8) / MAX,
          height: 150,
          borderLeft: `3px solid ${C.red}`,
          borderRight: `3px solid ${C.red}`,
          background: "rgba(196,81,63,0.22)",
          opacity: gap,
        }}
      />
      <div style={{ position: "absolute", left: nameW + (barMax * 200) / MAX - 200, top: 166, width: 220, textAlign: "right", opacity: gap }}>
        <Lettering size={30} color={C.red}>
          8 RUNS
        </Lettering>
      </div>
    </div>
  );
};

/* ---------- small helpers ---------- */
export const Chip: React.FC<{ on: number; color?: string; children: React.ReactNode; size?: number }> = ({ on, color = C.amber, children, size = 26 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.3 + 0.7 * on }}>
    <Lamp color={color} glow={color === C.amber ? C.amberGlow : C.redGlow} on={on} size={size * 0.7} />
    <Lettering size={size} font="body" color={on > 0.5 ? C.cream : C.creamDim} spacing="0.16em">
      {children}
    </Lettering>
  </div>
);
