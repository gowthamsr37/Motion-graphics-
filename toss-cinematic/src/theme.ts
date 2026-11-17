// theme.ts — single source of truth for the 2D layer. Look: night-broadcast documentary —
// floodlit navy, warm off-white type, one hero gold (the coin), a cool "reference" ice-blue.
import { Easing } from "remotion";

export const theme = {
  colors: {
    night: "#04070D",
    ink: "#0A111C",
    glass: "rgba(8, 14, 24, 0.62)",
    glassEdge: "rgba(255, 255, 255, 0.14)",
    white: "#F6F2E8",
    dim: "rgba(246, 242, 232, 0.72)",
    faint: "rgba(246, 242, 232, 0.34)",
    hair: "rgba(246, 242, 232, 0.16)",
    gold: "#F6BC45", // hero: the coin, the number that matters in each frame
    goldDeep: "#C98B1F",
    goldGlow: "rgba(246, 188, 69, 0.55)",
    ice: "#9AD8FF", // the 50% / zero reference
    iceGlow: "rgba(154, 216, 255, 0.5)",
    coral: "#FF7A62", // below the reference
    grass: "#3FA65A",
    shadow: "rgba(0, 0, 0, 0.55)",
  },
  fonts: {
    display: "Barlow Condensed",
    body: "Inter",
    serif: "Instrument Serif",
  },
  // Physics-aware curves. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.45, 0, 0.25, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 170, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 10, stiffness: 180, mass: 0.7 },
    slam: { damping: 13, stiffness: 260, mass: 0.7 },
    heavy: { damping: 17, stiffness: 110, mass: 1.4 },
  },
  // Instagram Reels safe area on a 1080×1920 frame (UI covers the top bar, the caption block and the right rail).
  safe: { left: 64, right: 1016, top: 236, bottom: 1500, railX: 940, railTop: 1080 },
} as const;

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
