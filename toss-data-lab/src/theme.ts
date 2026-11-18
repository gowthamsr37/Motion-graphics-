// theme.ts — single source of truth. Look: a dark data-science notebook (Jupyter in a night IDE).
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#080C14",
    bgHi: "#0E1524",
    panel: "#0F1726",
    panelHi: "#152036",
    edge: "rgba(148, 170, 205, 0.16)",
    grid: "rgba(148, 170, 205, 0.09)",
    gridHi: "rgba(148, 170, 205, 0.2)",
    text: "#E7EDF7",
    dim: "#8D9AB3",
    faint: "rgba(141, 154, 179, 0.45)",
    cyan: "#5CC8FF", // data / neutral series
    cyanGlow: "rgba(92, 200, 255, 0.35)",
    amber: "#FFB547", // the observed value — hero, one per frame
    amberGlow: "rgba(255, 181, 71, 0.45)",
    green: "#4ADE9A", // inside the noise band / fail to reject
    greenGlow: "rgba(74, 222, 154, 0.32)",
    coral: "#FF6B7F", // significant / pitfall
    coralGlow: "rgba(255, 107, 127, 0.4)",
    violet: "#B79BFF",
    // syntax highlighting
    kw: "#C792EA",
    fn: "#82AAFF",
    str: "#C3E88D",
    num: "#F78C6C",
    comment: "#5D6B85",
    black: "#000000",
  },
  fonts: {
    display: "Space Grotesk",
    body: "Inter",
    mono: "JetBrains Mono",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.45, 0, 0.25, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 170, mass: 0.6 },
    smooth: { damping: 20, stiffness: 95, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    stamp: { damping: 13, stiffness: 220, mass: 0.9 },
  },
} as const;

export type Tone = "cyan" | "amber" | "green" | "coral" | "dim" | "text";
export const tone = (t: Tone) => theme.colors[t];
export const glow = (t: Tone) =>
  t === "amber" ? theme.colors.amberGlow : t === "green" ? theme.colors.greenGlow : t === "coral" ? theme.colors.coralGlow : t === "cyan" ? theme.colors.cyanGlow : "transparent";
