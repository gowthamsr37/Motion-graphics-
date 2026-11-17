// theme.ts — "night match" look: floodlit navy, gold coin, electric green for luck, hot red for myths.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg0: "#05080F",
    bg1: "#0B1630",
    navy: "#122347",
    card: "rgba(16, 28, 56, 0.82)",
    cardHi: "rgba(30, 48, 88, 0.9)",
    line: "rgba(244, 246, 251, 0.12)",
    white: "#F4F6FB",
    dim: "#93A0B8",
    faint: "rgba(244, 246, 251, 0.18)",
    gold: "#FFC83D",
    goldGlow: "rgba(255, 200, 61, 0.55)",
    green: "#2BE59A",
    greenGlow: "rgba(43, 229, 154, 0.5)",
    red: "#FF4D5E",
    redGlow: "rgba(255, 77, 94, 0.5)",
    blue: "#5AB8FF",
    black: "#000000",
  },
  fonts: {
    display: "Anton",
    body: "Inter Display",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.45, 0, 0.25, 1),
  },
  spring: {
    pop: { damping: 12, stiffness: 220, mass: 0.6 },
    snappy: { damping: 15, stiffness: 170, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    needle: { damping: 9, stiffness: 70, mass: 1 },
    heavy: { damping: 16, stiffness: 120, mass: 1.4 },
  },
} as const;
