// Tree vocabulary: pills (category nodes), the glowing DATA orb, animated connectors, example chips, concept tags.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { alpha, glowBox, glowText, theme } from "../theme";
import { CLAMP, ease, useSpr } from "./Motion";

const C = theme.colors;

export const Pill: React.FC<{
  label: string;
  color: string;
  size?: number;
  glow?: number;
  sub?: string;
  subOn?: number;
  icon?: React.ReactNode;
}> = ({ label, color, size = 40, glow = 0, sub, subOn = 1, icon }) => (
  <div style={{ position: "relative" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.35,
        padding: `${size * 0.42}px ${size * 0.8}px`,
        borderRadius: 999,
        background: `linear-gradient(180deg, ${alpha(color, 0.3)}, ${alpha(color, 0.1)})`,
        border: `3px solid ${alpha(color, 0.9)}`,
        boxShadow: `${glow > 0 ? `${glowBox(color, glow)}, ` : ""}inset 0 0 22px ${alpha(color, 0.22)}`,
        fontFamily: theme.fonts.display,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.04em",
        color: C.text,
        whiteSpace: "nowrap",
        lineHeight: 1,
        textShadow: glow > 0 ? glowText(color, glow * 0.6) : undefined,
      }}
    >
      {icon}
      {label}
    </div>
    {sub ? (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          marginTop: size * 0.32,
          transform: `translateX(-50%) translateY(${(1 - subOn) * 10}px)`,
          opacity: subOn,
          fontFamily: theme.fonts.body,
          fontWeight: 700,
          fontSize: size * 0.56,
          letterSpacing: "0.14em",
          color: alpha(color, 0.95),
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        {sub}
      </div>
    ) : null}
  </div>
);

// The glowing DATA particle.
export const Orb: React.FC<{ size: number; label?: string; pulse?: number; spin?: number; labelSize?: number }> = ({ size, label, pulse = 0, spin = 0, labelSize }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 14) * 0.03 + pulse * 0.18;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          inset: -size * 0.9,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(C.cyan, 0.34 + pulse * 0.3)} 0%, ${alpha(C.violet, 0.14)} 32%, transparent 62%)`,
          transform: `scale(${breathe})`,
        }}
      />
      <svg width={size * 1.7} height={size * 1.7} viewBox="-85 -85 170 170" style={{ position: "absolute", left: -size * 0.35, top: -size * 0.35, overflow: "visible" }}>
        <g transform={`rotate(${frame * 1.6 + spin})`}>
          <ellipse rx={78} ry={26} fill="none" stroke={alpha(C.cyan, 0.55)} strokeWidth={1.6} strokeDasharray="6 9" />
          <circle cx={78} cy={0} r={4} fill={C.cyan} />
        </g>
        <g transform={`rotate(${-frame * 1.1 + 60 + spin})`}>
          <ellipse rx={74} ry={30} fill="none" stroke={alpha(C.violet, 0.5)} strokeWidth={1.6} strokeDasharray="4 10" />
          <circle cx={-74} cy={0} r={3.6} fill={C.violet} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 38% 34%, #FFFFFF 0%, #DDF7FF 22%, ${C.cyan} 58%, ${C.violet} 100%)`,
          boxShadow: `0 0 ${size * 0.35}px ${alpha(C.cyan, 0.7)}, 0 0 ${size * 0.9}px ${alpha(C.violet, 0.35)}, inset 0 -${size * 0.08}px ${size * 0.2}px ${alpha(C.violet, 0.6)}`,
          transform: `scale(${breathe})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label ? (
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: labelSize ?? size * 0.24, color: C.ink, letterSpacing: "0.03em" }}>{label}</span>
        ) : null}
      </div>
    </div>
  );
};

type Pt = [number, number];
export const bezier = (a: Pt, b: Pt, bend = 0.55) => {
  const c1: Pt = [a[0], a[1] + (b[1] - a[1]) * bend];
  const c2: Pt = [b[0], b[1] - (b[1] - a[1]) * bend];
  const at = (t: number): Pt => {
    const u = 1 - t;
    return [
      u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
      u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1],
    ];
  };
  return { d: `M${a[0]} ${a[1]} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`, at };
};

// A full-frame SVG layer of connectors that draw on, then carry travelling light pulses.
export const Wires: React.FC<{
  wires: { d: string; color: string; p: number; at?: (t: number) => Pt; pulseFrom?: number; dim?: number; width?: number }[];
}> = ({ wires }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      {wires.map((w, i) => {
        const o = w.dim ?? 1;
        const loop = w.pulseFrom !== undefined && frame > w.pulseFrom ? ((frame - w.pulseFrom) % 45) / 45 : -1;
        const pt = w.at && loop >= 0 ? w.at(theme.ease.soft(loop)) : null;
        return (
          <g key={i} opacity={o}>
            <path d={w.d} stroke={alpha(w.color, 0.28)} strokeWidth={(w.width ?? 5) + 8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - w.p} />
            <path d={w.d} stroke={w.color} strokeWidth={w.width ?? 5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - w.p} />
            {pt && w.p >= 1 ? <circle cx={pt[0]} cy={pt[1]} r={7} fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 8px ${w.color})` }} opacity={Math.sin(loop * Math.PI)} /> : null}
          </g>
        );
      })}
    </svg>
  );
};

// Example value chip: icon disc + text.
export const Chip: React.FC<{ icon: React.ReactNode; text: string; color: string; width?: number; size?: number; dim?: number }> = ({ icon, text, color, width = 370, size = 34, dim = 1 }) => (
  <div
    style={{
      width,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "12px 22px 12px 12px",
      borderRadius: 26,
      background: `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`,
      border: `2px solid ${alpha(color, 0.35)}`,
      boxShadow: "0 18px 40px -18px rgba(0,0,0,0.6)",
      opacity: dim,
    }}
  >
    <div style={{ width: 62, height: 62, borderRadius: 18, background: alpha(color, 0.16), border: `2px solid ${alpha(color, 0.5)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icon}
    </div>
    <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>{text}</span>
  </div>
);

// Concept tag, e.g. "COUNTED · WHOLE NUMBERS".
export const Tag: React.FC<{ color: string; children: React.ReactNode; size?: number; icon?: React.ReactNode }> = ({ color, children, size = 32, icon }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 18,
      background: alpha(color, 0.14),
      border: `2px solid ${alpha(color, 0.6)}`,
      fontFamily: theme.fonts.display,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.06em",
      color: C.text,
      whiteSpace: "nowrap",
      lineHeight: 1,
    }}
  >
    {icon}
    {children}
  </div>
);

// Header used by the four sub-type scenes: parent pill with two children. Identical geometry everywhere,
// so consecutive scenes cut seamlessly.
export const HEAD = { parent: [540, 292] as Pt, kids: [[290, 452] as Pt, [790, 452] as Pt] };

export const TreeHeader: React.FC<{
  parent: { label: string; color: string };
  kids: { label: string; color: string }[];
  parentIn: number;
  kidsIn: number;
  activeAt: number;
  activeIdx: 0 | 1;
  prevIdx?: 0 | 1 | null;
  zoomFrom?: number; // parent arrives scaled-up from the previous scene's zoom
}> = ({ parent, kids, parentIn, kidsIn, activeAt, activeIdx, prevIdx = null, zoomFrom }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const pIn = spr(parentIn, theme.spring.smooth);
  const zoom = zoomFrom !== undefined ? ease(frame, [parentIn, parentIn + 22], [zoomFrom, 1], theme.ease.out) : 1;
  const zoomY = zoomFrom !== undefined ? ease(frame, [parentIn, parentIn + 22], [640, HEAD.parent[1]], theme.ease.out) : HEAD.parent[1];
  const sw = ease(frame, [activeAt - 2, activeAt + 12], [0, 1], theme.ease.out);
  const level = (i: number) => {
    const before = prevIdx === null ? 0.5 : prevIdx === i ? 1 : 0;
    const after = activeIdx === i ? 1 : 0;
    return interpolate(sw, [0, 1], [before, after]);
  };
  const wires = kids.map((k, i) => {
    const b = bezier([HEAD.parent[0], HEAD.parent[1] + 30], [HEAD.kids[i][0], HEAD.kids[i][1] - 28], 0.6);
    const p = ease(frame, [kidsIn + i * 3, kidsIn + i * 3 + 16], [0, 1], theme.ease.inOut);
    return { d: b.d, at: b.at, color: k.color, p, pulseFrom: kidsIn + 30 + i * 20, dim: interpolate(level(i), [0, 0.5, 1], [0.35, 0.8, 1]) };
  });
  return (
    <AbsoluteFill>
      <Wires wires={wires} />
      <div
        style={{
          position: "absolute",
          left: HEAD.parent[0],
          top: zoomY,
          opacity: zoomFrom !== undefined ? 1 : pIn,
          transform: `translate(-50%, -50%) scale(${zoom * interpolate(pIn, [0, 1], [zoomFrom !== undefined ? 1 : 0.8, 1])})`,
        }}
      >
        <Pill label={parent.label} color={parent.color} size={40} glow={0.5} />
      </div>
      {kids.map((k, i) => {
        const p = spr(kidsIn + 12 + i * 4, theme.spring.bouncy);
        const lv = level(i);
        if (p <= 0.001) return null;
        return (
          <div
            key={k.label}
            style={{
              position: "absolute",
              left: HEAD.kids[i][0],
              top: HEAD.kids[i][1],
              opacity: Math.min(1, p) * interpolate(lv, [0, 0.5, 1], [0.38, 0.9, 1], CLAMP),
              transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1]) * interpolate(lv, [0, 0.5, 1], [0.92, 1, 1.1])})`,
            }}
          >
            <Pill label={k.label} color={k.color} size={30} glow={lv > 0.5 ? (lv - 0.5) * 2 : 0} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
