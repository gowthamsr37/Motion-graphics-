import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as T } from "./theme";
import brand from "../../brand.json";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number, from: number, to: number, e: (t: number) => number = T.ease.out) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: e });
export type Pt = { x: number; y: number };

export const FontFaces = () => (
  <style>{`
    @font-face { font-family: InterBlack; src: url(${staticFile("fonts/InterDisplay-Black.otf")}); }
    @font-face { font-family: PatrickHand; src: url(${staticFile("fonts/patrick-hand-latin-400-normal.woff2")}); }
    @font-face { font-family: CaveatBold; src: url(${staticFile("fonts/caveat-latin-700-normal.woff2")}); }
  `}</style>
);

// one-shot sound effect at a frame
export const Sfx: React.FC<{ at: number; name: string; vol?: number }> = ({ at, name, vol = 0.7 }) =>
  at < 0 ? null : (
    <Sequence from={Math.round(at)} durationInFrames={110} layout="none">
      <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
    </Sequence>
  );

// hand-drawn line "boil": displacement reseeded every 4 frames
export const Wobble: React.FC<{ id: string; scale?: number }> = ({ id, scale = 3.2 }) => {
  const f = useCurrentFrame();
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={Math.floor(f / 4)} />
      <feDisplacementMap in="SourceGraphic" scale={scale} />
    </filter>
  );
};

export const Hand: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; rot?: number; show: number; color?: string; weight?: "hand" | "script"; halo?: boolean }> = ({ x, y, size = 44, children, anchor = "start", rot = 0, show, color = T.ink, weight = "hand", halo }) =>
  show <= 0 ? null : (
    <text x={x} y={y} fontFamily={weight === "hand" ? T.fonts.hand : T.fonts.script} fontSize={size} fill={color} textAnchor={anchor} stroke={halo ? T.card : undefined} strokeWidth={halo ? 10 : 0} paintOrder="stroke" strokeLinejoin="round"
      opacity={Math.min(1, show * 1.5)} transform={`rotate(${rot} ${x} ${y}) translate(0 ${(1 - show) * 14})`}>{children}</text>
  );

export const Arrow: React.FC<{ from: Pt; to: Pt; bend?: number; draw: number; color?: string; width?: number }> = ({ from, to, bend = 0.25, draw, color = T.ink, width = 3.2 }) => {
  if (draw <= 0) return null;
  const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
  const dx = to.x - from.x, dy = to.y - from.y;
  const c = { x: mx - dy * bend, y: my + dx * bend };
  const ang = Math.atan2(to.y - c.y, to.x - c.x);
  const h = 16, a1 = ang + Math.PI - 0.5, a2 = ang + Math.PI + 0.5;
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${from.x},${from.y} Q${c.x},${c.y} ${to.x},${to.y}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {draw > 0.95 && <path d={`M${to.x + Math.cos(a1) * h},${to.y + Math.sin(a1) * h} L${to.x},${to.y} L${to.x + Math.cos(a2) * h},${to.y + Math.sin(a2) * h}`} />}
    </g>
  );
};

// generic stick person, facing right. pose: arm angles in degrees (SVG clockwise from +x)
export const Person: React.FC<{ x: number; y: number; s?: number; shirt: string; armFront?: number; armBack?: number; bob?: number; walk?: number; sad?: boolean }> = ({ x, y, s = 1, shirt, armFront = 70, armBack = 110, bob = 0, walk = 0, sad }) => {
  const ink = { stroke: T.ink, strokeWidth: 4.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const sh = { x: 0, y: -150 };
  const arm = (deg: number) => { const a = (deg * Math.PI) / 180; return `M${sh.x},${sh.y} L${sh.x + Math.cos(a) * 62},${sh.y + Math.sin(a) * 62}`; };
  const leg = (sw: number) => `M0,-80 L${sw * 18},0`;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={2 - bob} rx={40} ry={5} fill={T.ink} opacity={0.12} />
      <path d={leg(-1 + walk)} {...ink} />
      <path d={leg(1 - walk)} {...ink} />
      <path d={arm(armBack)} {...ink} />
      <path d="M-22,-158 Q0,-168 22,-158 L18,-78 L-18,-78 Z" fill={shirt} stroke={T.ink} strokeWidth={4} strokeLinejoin="round" />
      <path d={arm(armFront)} {...ink} />
      <circle cx={0} cy={-192} r={25} fill={T.skin} stroke={T.ink} strokeWidth={4} />
      <circle cx={10} cy={-197} r={2.8} fill={T.ink} />
      <path d={sad ? "M4,-180 Q12,-186 18,-180" : "M4,-184 Q12,-176 18,-184"} {...ink} strokeWidth={2.6} />
      <path d="M-25,-196 Q-24,-222 2,-220 Q20,-218 24,-204 Q8,-212 -10,-206 Z" fill={T.ink} />
    </g>
  );
};

// framed sketch panel with a label, drawn in
export const Panel: React.FC<{ f: number; start: number; label: string; w?: number; h?: number; ground?: number; children: React.ReactNode; id: string }> = ({ f, start, label, w = 960, h = 520, ground, children, id }) => {
  const draw = ease(f, start, start + 16, 0, 1, T.ease.inOut);
  const lab = ease(f, start + 6, start + 18, 0, 1);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`clip${id}`}><rect x={8} y={8} width={w - 16} height={h - 16} /></clipPath>
        <Wobble id={`wob${id}`} />
      </defs>
      <g filter={`url(#wob${id})`}>
        <rect x={4} y={4} width={w - 8} height={h - 8} fill={T.card} opacity={draw} />
        <rect x={4} y={4} width={w - 8} height={h - 8} fill="none" stroke={T.ink} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {ground !== undefined && <path d={`M24,${ground} L${w - 24},${ground}`} stroke={T.ink} strokeWidth={3.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, start + 4, start + 20, 0, 1, T.ease.inOut)} />}
        <Hand x={36} y={70} size={52} show={lab}>{label}</Hand>
        <g clipPath={`url(#clip${id})`}>{f >= start + 8 ? children : null}</g>
      </g>
    </svg>
  );
};

// big headline at the top, words spring in
export const Title: React.FC<{ text: string; top?: number; size?: number; start?: number }> = ({ text, top = 240, size, start = 2 }) => {
  const f = useCurrentFrame();
  size = size ?? (text.length > 40 ? 62 : text.length > 28 ? 70 : 80);
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, display: "flex", flexWrap: "wrap", columnGap: 20, rowGap: 0, fontFamily: T.fonts.title, fontSize: size, lineHeight: 1.08, color: T.ink, letterSpacing: -1.5 }}>
      {words.map((w, i) => {
        const s = spring({ frame: f - start - i * 4, fps, config: T.spring.pop });
        return <span key={i} style={{ display: "inline-block", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 50}px) scale(${0.8 + 0.2 * s})` }}>{w}</span>;
      })}
    </div>
  );
};

// the closing card: a big line and a handwritten line, with the accent on a highlighted phrase in *stars*
const Rich: React.FC<{ text: string; accent: string; under: number }> = ({ text, accent, under }) => (
  <>
    {text.split(/(\*[^*]+\*)/).map((part, i) =>
      part.startsWith("*") ? (
        <span key={i} style={{ position: "relative", color: accent, display: "inline-block" }}>
          {part.slice(1, -1)}
          <svg viewBox="0 0 200 20" preserveAspectRatio="none" style={{ position: "absolute", left: -6, bottom: -6, width: "calc(100% + 12px)", height: 18 }}>
            <path d="M4,12 Q60,4 120,10 T196,8" fill="none" stroke={T.ink} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - under} />
          </svg>
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

export const EndCard: React.FC<{ at: number; lines: [string, string]; accent: string }> = ({ at, lines, accent }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f - at;
  if (t < 0) return null;
  const line = (i: number) => spring({ frame: t - 6 - i * 14, fps, config: T.spring.soft });
  const st = (i: number) => ({ opacity: line(i), transform: `translateY(${(1 - line(i)) * 40}px) scale(${0.94 + 0.06 * line(i)})` });
  const b = spring({ frame: t - 50, fps, config: T.spring.soft });
  const under = ease(t, 30, 46, 0, 1, T.ease.inOut);
  const name = brand.handle || brand.name;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px", textAlign: "center" }}>
      <div style={{ marginTop: -120 }}>
        <div style={{ fontFamily: T.fonts.title, fontSize: 88, lineHeight: 1.06, color: T.ink, letterSpacing: -1, ...st(0) }}><Rich text={lines[0]} accent={accent} under={under} /></div>
        <div style={{ height: 46 }} />
        <div style={{ fontFamily: T.fonts.script, fontSize: 80, lineHeight: 1.12, color: T.ink, ...st(1) }}><Rich text={lines[1]} accent={accent} under={under} /></div>
      </div>
      {name ? <div style={{ position: "absolute", top: 1330, fontFamily: T.fonts.title, fontSize: 30, letterSpacing: 6, color: T.ink, opacity: b, transform: `translateY(${(1 - b) * 20}px)` }}>{name.toUpperCase()}</div> : null}
    </AbsoluteFill>
  );
};

// texture stack
export const Ground: React.FC = () => <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${T.paper} 60%, ${T.paperEdge} 100%)` }} />;
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "rgba(255,190,110,0.05)", mixBlendMode: "multiply", pointerEvents: "none" }} />
      <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: 0.16, pointerEvents: "none" }}>
        <svg width="100%" height="100%">
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 7} /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(60,40,10,0.22) 100%)", pointerEvents: "none" }} />
    </>
  );
};

// fade + lift the main stage out as the end card arrives
export const StageExit: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const k = ease(f - at, -8, 4, 0, 1, T.ease.in);
  return <AbsoluteFill style={{ opacity: 1 - k, transform: `translateY(${-k * 80}px) scale(${1 - k * 0.04})` }}>{children}</AbsoluteFill>;
};

export const fmt = (n: number) => n.toLocaleString("en-US");
