// The five-layer stack: floodlit sky (bottom) … grade, grain and vignette (top).
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, theme } from "../theme";

const C = theme.colors;

const Floodlight: React.FC<{ side: "left" | "right"; frame: number; boost: number }> = ({ side, frame, boost }) => {
  const sx = side === "left" ? 70 : 1010;
  const sy = 120;
  const dir = side === "left" ? 1 : -1;
  const sway = Math.sin(frame / 70 + (side === "left" ? 0 : 2)) * 2.2;
  return (
    <>
      {/* beams: long soft wedges from the lamp */}
      {[0, 1, 2].map((i) => {
        const ang = dir * (28 + i * 13) + sway;
        const flick = 0.85 + 0.15 * Math.sin(frame / (9 + i * 3) + i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sx - 160,
              top: sy,
              width: 320,
              height: 2300,
              transformOrigin: "50% 0%",
              transform: `rotate(${-ang}deg)`,
              background: `linear-gradient(180deg, rgba(201,216,255,${0.13 * boost * flick}) 0%, rgba(201,216,255,${0.04 * boost}) 45%, transparent 85%)`,
              clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
              filter: "blur(14px)",
            }}
          />
        );
      })}
      {/* lamp glow + bulb grid */}
      <div style={{ position: "absolute", left: sx - 260, top: sy - 260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(201,216,255,${0.32 * boost}) 0%, transparent 62%)`, filter: "blur(10px)" }} />
      <div style={{ position: "absolute", left: sx - 52, top: sy - 30, display: "grid", gridTemplateColumns: "repeat(4, 18px)", gap: 8 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ width: 18, height: 14, borderRadius: 4, background: C.flood, opacity: (0.55 + 0.45 * Math.sin(frame / 6 + i * 1.7) ** 2) * boost, boxShadow: `0 0 18px ${C.flood}` }} />
        ))}
      </div>
    </>
  );
};

export const Sky: React.FC<{ boost?: number }> = ({ boost = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const d1 = Math.sin(frame / 80) * 60;
  const d2 = Math.cos(frame / 95) * 50;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.skyHi} 0%, ${C.sky} 55%, #030409 100%)`, overflow: "hidden" }}>
      {/* mesh blobs */}
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", left: -420 + d1, top: 380, background: `radial-gradient(circle, ${C.indigo}38 0%, transparent 62%)`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", right: -460 - d2, top: 1050, background: `radial-gradient(circle, ${C.indigo}26 0%, transparent 64%)`, filter: "blur(70px)" }} />
      {/* faint field grid in perspective at the bottom */}
      <div style={{ position: "absolute", left: -200, right: -200, bottom: -120, height: 760, transform: "perspective(700px) rotateX(62deg)", transformOrigin: "50% 100%", backgroundImage: `linear-gradient(${C.inkFaint} 1px, transparent 1px), linear-gradient(90deg, ${C.inkFaint} 1px, transparent 1px)`, backgroundSize: "120px 120px", backgroundPosition: `0 ${(frame * 1.2) % 120}px`, opacity: 0.28, maskImage: "linear-gradient(180deg, transparent, black 60%)", WebkitMaskImage: "linear-gradient(180deg, transparent, black 60%)" }} />
      <Floodlight side="left" frame={frame} boost={boost} />
      <Floodlight side="right" frame={frame} boost={boost} />
      {/* dust in the light */}
      {Array.from({ length: 46 }).map((_, i) => {
        const x = random(`x${i}`) * width;
        const sp = 0.25 + random(`s${i}`) * 0.6;
        const y = (((random(`y${i}`) * height - frame * sp) % height) + height) % height;
        const tw = 0.25 + 0.75 * Math.abs(Math.sin(frame / (14 + random(`t${i}`) * 20) + i));
        const r = 1.5 + random(`r${i}`) * 2.5;
        return <div key={i} style={{ position: "absolute", left: x + Math.sin(frame / 40 + i) * 10, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: C.flood, opacity: 0.32 * tw * boost }} />;
      })}
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.indigo, mixBlendMode: "soft-light", opacity: 0.16 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 18%, transparent 78%, rgba(0,0,0,0.42) 100%)" }} />
  </AbsoluteFill>
);

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: NOISE,
        backgroundSize: "240px",
        backgroundPosition: `${(frame * 37) % 240}px ${(frame * 61) % 240}px`,
        opacity: 0.09,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 80% 70% at 50% 46%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
);

// White flash + horizontal streaks that hide each cut (a whip pan).
export const Whip: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const near = at.find((c) => frame >= c - 6 && frame <= c + 6);
  if (near === undefined) return null;
  const u = (frame - (near - 6)) / 12; // 0..1 across the cut
  const flash = interpolate(frame, [near - 2, near, near + 5], [0, 0.16, 0], CLAMP);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 9 }).map((_, i) => {
        const y = 180 + random(`wy${near}${i}`) * 1500;
        const w = 300 + random(`ww${near}${i}`) * 700;
        const x = interpolate(theme.ease.inOut(Math.min(1, Math.max(0, u))), [0, 1], [1300, -w - 200]);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: 3 + random(`wh${near}${i}`) * 6, borderRadius: 6, background: `linear-gradient(90deg, transparent, rgba(201,216,255,0.5), transparent)`, filter: "blur(2px)" }} />;
      })}
      <AbsoluteFill style={{ background: theme.colors.flood, opacity: flash }} />
    </AbsoluteFill>
  );
};

export const Progress: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 7, width: `${(frame / total) * 100}%`, background: "rgba(244,241,234,0.55)", borderRadius: "0 4px 4px 0" }} />
  );
};

export const Brand: React.FC<{ hideFrom: number }> = ({ hideFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = interpolate(frame, [4, 4 + fps * 0.5], [0, 1], { easing: theme.ease.out, ...CLAMP }) * interpolate(frame, [hideFrom - 8, hideFrom], [1, 0], CLAMP);
  return (
    <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: on, transform: `translateY(${(1 - on) * -12}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: "rgba(0,0,0,0.35)", border: `1px solid ${C.cardEdge}` }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.gold, boxShadow: `0 0 12px ${C.goldGlow}` }} />
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.inkDim }}>BEYOND THE SCOREBOARD</span>
      </div>
    </div>
  );
};
