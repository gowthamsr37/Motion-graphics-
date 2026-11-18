// theme.ts — single source of truth. Look: a hand-inked 15th-century portolan chart on aged parchment.
import { Easing } from "remotion";

export const theme = {
  colors: {
    parchment: "#E8D6AE",
    parchmentHi: "#F3E6C6",
    parchmentLo: "#C9AE7A",
    burn: "#5A3A17",
    sea: "#56767A", // coastal ripple ink (blue-grey)
    seaWash: "#8FB0AC",
    land: "#E6D2A2",
    landHi: "#F1E3BE",
    coast: "#4A3219",
    ink: "#2E1F10",
    inkDim: "rgba(46, 31, 16, 0.6)",
    inkFaint: "rgba(46, 31, 16, 0.22)",
    red: "#9E2A1E", // route ink / hero — one per frame
    redGlow: "rgba(158, 42, 30, 0.35)",
    gold: "#B8862B",
    goldGlow: "rgba(184, 134, 43, 0.45)",
    green: "#46613A",
    ottoman: "#6B4A7A",
    black: "#000000",
  },
  fonts: {
    title: "Cinzel",
    body: "EB Garamond",
    hand: "IM Fell English",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.45, 0, 0.25, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    stamp: { damping: 13, stiffness: 220, mass: 0.9 },
  },
} as const;
