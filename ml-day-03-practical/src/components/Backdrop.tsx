import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { alpha, theme } from "../theme";
import { rng } from "./Motion";

// Layer 1: deep-navy mesh — two drifting colour fields whose tints follow the scene's category colours.
export const Backdrop: React.FC<{ a: string; b: string; energy?: number }> = ({ a, b, energy = 1 }) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 80) * 70;
  const d2 = Math.cos(frame / 95) * 60;
  const d3 = Math.sin(frame / 120 + 1) * 40;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 75% at 50% 32%, ${theme.colors.navy} 0%, ${theme.colors.bg} 55%, ${theme.colors.bgDeep} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          left: -620 + d1,
          top: -420 + d3,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(a, 0.2 * energy)} 0%, ${alpha(a, 0.06 * energy)} 38%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          right: -640 - d2,
          bottom: -360 + d3,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(b, 0.18 * energy)} 0%, ${alpha(b, 0.05 * energy)} 40%, transparent 62%)`,
        }}
      />
      <DotGrid />
      <Particles />
    </AbsoluteFill>
  );
};

const DotGrid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${alpha("#9DB4FF", 0.16)} 1.6px, transparent 1.9px)`,
        backgroundSize: "54px 54px",
        backgroundPosition: `${(frame * 0.25) % 54}px ${(frame * 0.6) % 54}px`,
        WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)",
        maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)",
      }}
    />
  );
};

const PARTS = (() => {
  const r = rng(11);
  const cols = [theme.colors.cyan, theme.colors.violet, "#DCE6FF", theme.colors.green];
  return Array.from({ length: 44 }).map((_, i) => ({
    x: r() * 1080,
    y: r() * 1920,
    v: 0.25 + r() * 0.9,
    s: 2 + r() * 4.5,
    ph: r() * Math.PI * 2,
    sway: 10 + r() * 26,
    c: cols[i % cols.length],
  }));
})();

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {PARTS.map((p, i) => {
        const y = (((p.y - frame * p.v) % 2000) + 2000) % 2000 - 40;
        const x = p.x + Math.sin(frame / 60 + p.ph) * p.sway;
        const tw = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(frame / 18 + p.ph * 3));
        return <circle key={i} cx={x} cy={y} r={p.s} fill={p.c} opacity={tw * 0.6} />;
      })}
    </svg>
  );
};

// Layer 4: colour grade — unifies everything into one cool, slightly violet navy.
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: "#3B2F9E", mixBlendMode: "soft-light", opacity: 0.2 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,5,26,0.35), transparent 18%, transparent 80%, rgba(2,5,26,0.45))" }} />
  </AbsoluteFill>
);

// Layer 5: grain + vignette.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "240px",
        backgroundPosition: `${(frame * 37) % 240}px ${(frame * 71) % 240}px`,
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 85% 70% at 50% 46%, transparent 55%, rgba(0,2,14,0.55) 100%)" }} />
);
