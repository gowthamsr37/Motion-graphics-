// theme.ts — the single source of truth. Look: a floodlit night match. Ink-black sky, floodlight
// beams, one gold coin. Gold is the hero colour; mint marks a real edge, red marks the myth.
import { Easing } from "remotion";

export const theme = {
  colors: {
    sky: "#05060B",
    skyHi: "#0C1124",
    indigo: "#3C42D9",
    flood: "#C9D8FF",
    ink: "#F4F1EA",
    inkDim: "rgba(244, 241, 234, 0.62)",
    inkSoft: "rgba(244, 241, 234, 0.38)",
    inkFaint: "rgba(244, 241, 234, 0.12)",
    line: "rgba(244, 241, 234, 0.16)",
    card: "rgba(255, 255, 255, 0.045)",
    cardEdge: "rgba(255, 255, 255, 0.10)",
    gold: "#FFC63A",
    goldHi: "#FFE6A1",
    goldDeep: "#B97A0E",
    goldGlow: "rgba(255, 198, 58, 0.45)",
    mint: "#2EE6A6",
    mintGlow: "rgba(46, 230, 166, 0.42)",
    red: "#FF4A5C",
    redGlow: "rgba(255, 74, 92, 0.42)",
    pitch: "#B99B6B",
    pitchDark: "#7E6440",
    shadow: "rgba(0, 0, 0, 0.55)",
  },
  fonts: {
    display: "Anton",
    body: "Inter",
  },
  // Physics-aware curves only. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    soft: Easing.bezier(0.45, 0, 0.25, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 170, mass: 0.6 },
    smooth: { damping: 20, stiffness: 95, mass: 1 },
    bouncy: { damping: 10, stiffness: 180, mass: 0.7 },
    slam: { damping: 13, stiffness: 260, mass: 0.8 },
    count: { damping: 30, stiffness: 55, mass: 1 },
  },
  safe: { top: 250, bottom: 1340, captionY: 1452 },
} as const;

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
