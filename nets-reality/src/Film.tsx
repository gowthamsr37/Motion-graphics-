import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as T } from "./theme";
import S from "./schedule.json";

// ---------- fonts ----------
const FontFaces = () => (
  <style>{`
    @font-face { font-family: InterBlack; src: url(${staticFile("fonts/InterDisplay-Black.otf")}); }
    @font-face { font-family: PatrickHand; src: url(${staticFile("fonts/patrick-hand-latin-400-normal.woff2")}); }
    @font-face { font-family: CaveatBold; src: url(${staticFile("fonts/caveat-latin-700-normal.woff2")}); }
  `}</style>
);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number, from: number, to: number, e = T.ease.out) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

// ---------- panel geometry (SVG units, panel is 960 x 520) ----------
const PW = 960, PH = 520;
const GROUND = 455;
const HANDS = { x: 186, y: 322 };
const BS = 1.35; // batter scale, around the feet
const SH = { x: 150 + (HANDS.x - 150) * BS, y: GROUND + (HANDS.y - GROUND) * BS }; // hands in panel space
const CA = (47 * Math.PI) / 180;
const CONTACT = { x: SH.x + 0.72 * 112 * BS * Math.cos(CA), y: SH.y + 0.72 * 112 * BS * Math.sin(CA) };
const BOUNCE = { x: 560, y: GROUND - 10 };
const RELEASE = { x: 1000, y: 250 };
const ROPE_X = 790;
const SIX_LAND = { x: 905, y: GROUND - 10 };
const R = 13;

type Shot = { bowl: number; hit: number; land: number };
type Pt = { x: number; y: number };

// pile slots: a triangle, bottom row first
const PILE: Pt[] = (() => {
  const out: Pt[] = [];
  for (let row = 0; row < 9; row++) {
    const n = 9 - row;
    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => Math.abs(a - (n - 1) / 2) - Math.abs(b - (n - 1) / 2));
    for (const i of order) out.push({ x: 520 + (i - (n - 1) / 2) * 2 * R + (row % 2 ? 0 : 0), y: GROUND - R - row * R * 1.74 });
  }
  return out;
})();

// ball position for a shot at frame f (null when not yet bowled)
function ballAt(s: Shot, f: number, target: Pt, apex: number): Pt | null {
  if (f < s.bowl) return null;
  if (f < s.hit) {
    const u = (f - s.bowl) / (s.hit - s.bowl);
    const ub = 0.62; // pitches just over half-way
    if (u < ub) {
      const k = u / ub;
      return { x: RELEASE.x + (BOUNCE.x - RELEASE.x) * k, y: RELEASE.y + (BOUNCE.y - RELEASE.y) * k * k };
    }
    const k = (u - ub) / (1 - ub);
    return { x: BOUNCE.x + (CONTACT.x - BOUNCE.x) * k, y: BOUNCE.y + (CONTACT.y - BOUNCE.y) * Math.sin((k * Math.PI) / 2) };
  }
  const u = Math.min(1, (f - s.hit) / (s.land - s.hit));
  return arcPoint(u, target, apex);
}
function arcPoint(u: number, target: Pt, apex: number): Pt {
  const x = CONTACT.x + (target.x - CONTACT.x) * u;
  // quadratic bezier in y through an apex control point
  const c = 2 * apex - (CONTACT.y + target.y) / 2;
  const y = (1 - u) ** 2 * CONTACT.y + 2 * (1 - u) * u * c + u * u * target.y;
  return { x, y };
}
function arcPath(target: Pt, apex: number, upTo = 1) {
  const pts: string[] = [];
  const steps = 40;
  for (let i = 0; i <= steps * upTo; i++) {
    const p = arcPoint(i / steps, target, apex);
    pts.push(`${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return pts.join(" ");
}

// bat angle (deg, SVG clockwise from +x): stance 100, backlift 225, contact 47, follow-through -70
function batAngle(f: number, shots: Shot[]) {
  let s: Shot | undefined;
  for (const x of shots) if (x.hit - 8 <= f) s = x;
  if (!s) return 100 + 3 * Math.sin(f / 9);
  const u = f - s.hit;
  if (u < -3) return ease(u, -8, -3, 100, 222, T.ease.inOut);
  if (u < 0) return ease(u, -3, 0, 222, 47, T.ease.in);
  if (u < 5) return ease(u, 0, 5, 47, -70);
  return ease(u, 8, 22, -70, 100, T.ease.inOut) + 3 * Math.sin(f / 9);
}

// ---------- drawing pieces ----------
const Ball: React.FC<{ p: Pt; spin?: number }> = ({ p, spin = 0 }) => (
  <g transform={`translate(${p.x},${p.y}) rotate(${spin})`}>
    <circle r={R} fill={T.ball} stroke={T.ink} strokeWidth={2.4} />
    <path d={`M${-R + 2},-2 Q0,-5 ${R - 2},-2 M${-R + 2},2 Q0,-1 ${R - 2},2`} stroke={T.seam} strokeWidth={1.4} fill="none" />
  </g>
);

const Batter: React.FC<{ angle: number; f: number }> = ({ angle, f }) => {
  const bob = Math.sin(f / 11) * 1.5;
  const a = (angle * Math.PI) / 180;
  const L = 112;
  const tip = { x: HANDS.x + Math.cos(a) * L, y: HANDS.y + Math.sin(a) * L };
  const ink = { stroke: T.ink, strokeWidth: 4.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <g transform={`translate(150 ${GROUND}) scale(${BS}) translate(-150 ${-GROUND}) translate(0,${bob})`}>
      {/* shadow */}
      <ellipse cx={152} cy={GROUND + 2 - bob} rx={56} ry={6} fill={T.ink} opacity={0.12} />
      {/* legs + pads */}
      <path d={`M150,356 L132,${GROUND - 4}`} {...ink} />
      <path d={`M152,356 L172,${GROUND - 4}`} {...ink} />
      <rect x={121} y={392} width={20} height={56} rx={6} fill="#fff" stroke={T.ink} strokeWidth={3.5} transform="rotate(10 131 420)" />
      <rect x={162} y={392} width={20} height={56} rx={6} fill="#fff" stroke={T.ink} strokeWidth={3.5} transform="rotate(-12 172 420)" />
      <path d={`M118,${GROUND - 2} l22,0 M162,${GROUND - 2} l24,0`} {...ink} strokeWidth={7} />
      {/* shirt */}
      <path d="M128,282 Q151,272 174,282 L170,360 L132,360 Z" fill={T.shirt} stroke={T.ink} strokeWidth={4} strokeLinejoin="round" />
      <text x={151} y={330} fontFamily={T.fonts.hand} fontSize={30} fill="#fff" textAnchor="middle">7</text>
      {/* arms to hands */}
      <path d={`M160,292 Q182,300 ${HANDS.x},${HANDS.y}`} {...ink} />
      <path d={`M140,294 Q160,318 ${HANDS.x - 2},${HANDS.y + 2}`} {...ink} />
      {/* bat: handle + blade */}
      <g transform={`translate(${HANDS.x},${HANDS.y}) rotate(${angle})`}>
        <rect x={-6} y={-4} width={34} height={8} rx={3} fill="#3b3b3b" stroke={T.ink} strokeWidth={2.5} />
        <path d={`M28,-9 L${L},-11 Q${L + 6},0 ${L},11 L28,9 Z`} fill="#e9cf98" stroke={T.ink} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
      <circle cx={HANDS.x} cy={HANDS.y} r={7} fill="#f2f2f2" stroke={T.ink} strokeWidth={3} />
      {/* head + helmet with grille, facing right */}
      <circle cx={151} cy={252} r={24} fill="#f3d2b0" stroke={T.ink} strokeWidth={4} />
      <path d="M125,252 Q126,222 152,222 Q178,222 180,250 L192,252 Q186,244 178,244" fill={T.helmet} stroke={T.ink} strokeWidth={4} strokeLinejoin="round" />
      <path d="M174,250 Q184,262 176,276 M168,256 L180,256 M168,265 L182,265 M166,274 L176,274" {...ink} strokeWidth={2.8} />
      <circle cx={160} cy={257} r={2.8} fill={T.ink} />
      {void tip}
    </g>
  );
};

const Rope: React.FC = () => (
  <g>
    <path d={`M${ROPE_X - 20},${GROUND - 3} q12,-10 24,0 t24,0 t24,0`} fill="none" stroke={T.ink} strokeWidth={4} strokeLinecap="round" />
    <path d={`M${ROPE_X},${GROUND} L${ROPE_X},${GROUND - 70}`} stroke={T.ink} strokeWidth={4} strokeLinecap="round" />
    <path d={`M${ROPE_X},${GROUND - 70} L${ROPE_X + 40},${GROUND - 60} L${ROPE_X},${GROUND - 48} Z`} fill={T.ball} stroke={T.ink} strokeWidth={3.5} strokeLinejoin="round" />
  </g>
);

const Hand: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; rot?: number; show: number }> = ({ x, y, size = 44, children, anchor = "start", rot = 0, show }) => (
  <text x={x} y={y} fontFamily={T.fonts.hand} fontSize={size} fill={T.ink} textAnchor={anchor}
    opacity={Math.min(1, show * 1.5)} transform={`rotate(${rot} ${x} ${y}) translate(0 ${(1 - show) * 14})`}>{children}</text>
);

const Arrow: React.FC<{ d: string; head: string; draw: number }> = ({ d, head, draw }) => (
  <g fill="none" stroke={T.ink} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    <path d={head} opacity={draw > 0.95 ? 1 : 0} />
  </g>
);

const Burst: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t <= 0) return null;
  const k = ease(t, 0, 10, 0, 1);
  const fade = ease(t, 14, 26, 1, 0);
  return (
    <g stroke={T.ink} strokeWidth={3.5} strokeLinecap="round" opacity={fade}>
      {[-150, -110, -70, -30, 10].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const r0 = 22 + 20 * k, r1 = 40 + 34 * k;
        return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} />;
      })}
    </g>
  );
};

// the SIX! callout
const Six: React.FC<{ t: number; x: number; y: number; size?: number }> = ({ t, x, y, size = 64 }) => {
  const { fps } = useVideoConfig();
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: T.spring.pop });
  return (
    <g transform={`translate(${x},${y}) rotate(${-8 + 3 * Math.sin(t / 7)}) scale(${0.4 + 0.6 * s})`} opacity={Math.min(1, t / 4)}>
      <text x={0} y={0} fontFamily={T.fonts.script} fontSize={size} fill={T.ball} textAnchor="middle" stroke={T.ink} strokeWidth={1.5} paintOrder="stroke">SIX!</text>
    </g>
  );
};

// ---------- panels ----------
const PanelFrame: React.FC<{ f: number; start: number; label: string; children: React.ReactNode }> = ({ f, start, label, children }) => {
  const draw = ease(f, start, start + 16, 0, 1, T.ease.inOut);
  const lab = ease(f, start + 6, start + 18, 0, 1);
  const seed = Math.floor(f / 4); // hand-drawn "boil": the line wobble changes every 4 frames
  const id = `wob${label}`;
  return (
    <svg viewBox={`0 0 ${PW} ${PH}`} width={PW} height={PH} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`clip${label}`}><rect x={8} y={8} width={PW - 16} height={PH - 16} /></clipPath>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale={3.2} />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <rect x={4} y={4} width={PW - 8} height={PH - 8} fill="#fffdf8" stroke="none" opacity={draw} />
        <rect x={4} y={4} width={PW - 8} height={PH - 8} fill="none" stroke={T.ink} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={`M24,${GROUND} L${PW - 24},${GROUND}`} stroke={T.ink} strokeWidth={3.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, start + 4, start + 20, 0, 1, T.ease.inOut)} />
        <Hand x={36} y={70} size={56} show={lab}>{label}</Hand>
        <g clipPath={`url(#clip${label})`}>{f >= start + 8 ? children : null}</g>
      </g>
    </svg>
  );
};

const Expectation: React.FC<{ f: number }> = ({ f }) => {
  const e = S.exp as Shot;
  const apex = 70;
  const p = ballAt(e, f, SIX_LAND, apex);
  const flying = f >= e.hit;
  const trail = flying ? Math.min(1, (f - e.hit) / (e.land - e.hit)) : 0;
  const pop = ease(f - 14, 0, 14, 0, 1);
  return (
    <>
      <g opacity={pop} transform={`translate(0 ${(1 - pop) * 20})`}>
        <Rope />
        <Batter angle={batAngle(f, [e])} f={f} />
      </g>
      {flying && <path d={arcPath(SIX_LAND, apex, trail)} fill="none" stroke={T.ink} strokeWidth={3} strokeDasharray="14 12" strokeLinecap="round" />}
      {p && f < e.land + 200 && <Ball p={f >= e.land ? { x: SIX_LAND.x + Math.min(30, (f - e.land) * 1.5), y: SIX_LAND.y } : p} spin={f * 25} />}
      <Hand x={330} y={140} show={ease(f, e.hit + 2, e.hit + 12, 0, 1)} rot={-6}>1 ball</Hand>
      <Arrow d="M360,152 Q375,182 360,214" head="M348,200 L360,216 L374,204" draw={ease(f, e.hit + 6, e.hit + 16, 0, 1)} />
      <Burst x={SIX_LAND.x - 10} y={SIX_LAND.y - 30} t={f - e.land} />
      <Six t={f - e.land} x={830} y={300} />
    </>
  );
};

const fmt = (n: number) => n.toLocaleString("en-US");

const Reality: React.FC<{ f: number }> = ({ f }) => {
  const shots = S.shots as Shot[];
  const fin = S.fin as Shot;
  const all = [...shots, fin];
  const landed = shots.filter((s) => f >= s.land).length;
  const pFrac = landed / shots.length;
  const count = landed === shots.length ? 9999 : Math.round(9999 * Math.pow(pFrac, 1.6));
  const pop = ease(f - S.panel2 - 10, 0, 14, 0, 1);
  const finApex = 10;
  const finFly = f >= fin.hit;
  const labelShow = ease(f, shots[0].land, shots[0].land + 12, 0, 1);
  return (
    <>
      <g opacity={pop} transform={`translate(0 ${(1 - pop) * 20})`}>
        <Rope />
        <Batter angle={batAngle(f, all)} f={f} />
      </g>
      {/* the pile */}
      {shots.map((s, i) => (f >= s.land ? <Ball key={i} p={PILE[i]} spin={i * 47} /> : null))}
      {/* recent trails + balls in flight */}
      {shots.map((s, i) => {
        if (f < s.bowl || f >= s.land + 6) return null;
        const apex = Math.min(PILE[i].y - 30, 185 + ((i * 37) % 70));
        const fly = f >= s.hit;
        const u = fly ? Math.min(1, (f - s.hit) / (s.land - s.hit)) : 0;
        const fade = f >= s.land ? ease(f, s.land, s.land + 6, 0.8, 0) : 0.8;
        const p = ballAt(s, f, PILE[i], apex);
        return (
          <g key={i}>
            {fly && <path d={arcPath(PILE[i], apex, u)} fill="none" stroke={T.ink} strokeWidth={2.4} strokeDasharray="10 10" opacity={fade} />}
            {p && f < s.land && <Ball p={p} spin={f * 30} />}
          </g>
        );
      })}
      {/* the counter */}
      <g opacity={labelShow} transform={`translate(0 ${(1 - labelShow) * 12})`}>
        <text x={500} y={162} fontFamily={T.fonts.hand} fontSize={50} fill={T.ball} textAnchor="end" stroke={T.ink} strokeWidth={0.8}>{fmt(count)}</text>
        <text x={512} y={162} fontFamily={T.fonts.hand} fontSize={44} fill={T.ink}>balls in the nets</text>
      </g>
      <Arrow d="M640,180 Q620,212 568,240" head="M570,220 L566,241 L588,240" draw={ease(f, shots[0].land + 6, shots[0].land + 18, 0, 1)} />
      {/* the one that finally goes */}
      {finFly && <path d={arcPath(SIX_LAND, finApex, Math.min(1, (f - fin.hit) / (fin.land - fin.hit)))} fill="none" stroke={T.ink} strokeWidth={3} strokeDasharray="14 12" strokeLinecap="round" />}
      {f >= fin.bowl && (() => { const p = ballAt(fin, f, SIX_LAND, finApex)!; return <Ball p={f >= fin.land ? { x: SIX_LAND.x + Math.min(30, (f - fin.land) * 1.5), y: SIX_LAND.y } : p} spin={f * 25} />; })()}
      <Burst x={SIX_LAND.x - 10} y={SIX_LAND.y - 30} t={f - fin.land} />
      <Six t={f - fin.land} x={830} y={300} size={76} />
    </>
  );
};

// ---------- texture layers ----------
const Grain: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: 0.16, pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 7} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);
const Vignette = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(60,40,10,0.22) 100%)", pointerEvents: "none" }} />
);
const Grade = () => <AbsoluteFill style={{ background: "rgba(255,190,110,0.05)", mixBlendMode: "multiply", pointerEvents: "none" }} />;

// ---------- end card ----------
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const t = f - S.endCard;
  if (t < 0) return null;
  const line = (i: number) => spring({ frame: t - 6 - i * 14, fps, config: T.spring.soft });
  const st = (i: number) => ({ opacity: line(i), transform: `translateY(${(1 - line(i)) * 40}px) scale(${0.94 + 0.06 * line(i)})` });
  const brand = spring({ frame: t - 56, fps, config: T.spring.soft });
  const under = ease(t, 30, 46, 0, 1, T.ease.inOut);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px", textAlign: "center" }}>
      <div style={{ marginTop: -120 }}>
        <div style={{ fontFamily: T.fonts.title, fontSize: 92, lineHeight: 1.05, color: T.ink, letterSpacing: -1, ...st(0) }}>Everyone wants<br />the six.</div>
        <div style={{ height: 50 }} />
        <div style={{ fontFamily: T.fonts.script, fontSize: 84, lineHeight: 1.1, color: T.ink, ...st(1) }}>
          Nobody sees the{" "}
          <span style={{ position: "relative", color: T.ball, display: "inline-block" }}>
            9,999
            <svg viewBox="0 0 200 20" preserveAspectRatio="none" style={{ position: "absolute", left: -6, right: -6, bottom: -6, width: "calc(100% + 12px)", height: 18 }}>
              <path d="M4,12 Q60,4 120,10 T196,8" fill="none" stroke={T.ink} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - under} />
            </svg>
          </span>
          <br />balls before it.
        </div>
      </div>
      <div style={{ position: "absolute", top: 1330, display: "flex", alignItems: "center", gap: 18, opacity: brand, transform: `translateY(${(1 - brand) * 20}px)` }}>
        <svg width={34} height={34} viewBox="-12 -12 24 24"><circle r={R} fill={T.ball} stroke={T.ink} strokeWidth={2.4} /><path d="M-9,-2 Q0,-5 9,-2 M-9,2 Q0,-1 9,2" stroke={T.seam} strokeWidth={1.4} fill="none" /></svg>
        <div style={{ fontFamily: T.fonts.title, fontSize: 30, letterSpacing: 6, color: T.ink }}>BEYOND THE SCOREBOARD</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- the film ----------
export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = ["Getting", "good", "at", "cricket:"];
  const exitT = f - S.endCard;
  const exitK = exitT < 0 ? 0 : ease(exitT, -8, 4, 0, 1, T.ease.in);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${T.paper} 60%, ${T.paperEdge} 100%)` }}>
      <FontFaces />
      <Audio src={staticFile("audio/music.wav")} volume={0.55} />
      <Audio src={staticFile("audio/sfx.wav")} volume={0.9} />
      <AbsoluteFill style={{ opacity: 1 - exitK, transform: `translateY(${-exitK * 80}px) scale(${1 - exitK * 0.04})` }}>
        <div style={{ position: "absolute", top: 290, left: 60, right: 60, display: "flex", gap: 20, fontFamily: T.fonts.title, fontSize: 82, color: T.ink, letterSpacing: -1.5 }}>
          {words.map((w, i) => {
            const s = spring({ frame: f - 2 - i * 4, fps, config: T.spring.pop });
            return <span key={i} style={{ display: "inline-block", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 50}px) scale(${0.8 + 0.2 * s})` }}>{w}</span>;
          })}
        </div>
        <div style={{ position: "absolute", top: 430, left: 60 }}><PanelFrame f={f} start={14} label="Expectation"><Expectation f={f} /></PanelFrame></div>
        <div style={{ position: "absolute", top: 990, left: 60 }}><PanelFrame f={f} start={S.panel2} label="Reality"><Reality f={f} /></PanelFrame></div>
      </AbsoluteFill>
      <EndCard f={f} />
      <Grade />
      <Grain f={f} />
      <Vignette />
    </AbsoluteFill>
  );
};
