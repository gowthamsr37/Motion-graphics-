import { Easing } from "remotion";

export const theme = {
  paper: "#fbf8f1",
  paperEdge: "#efe8d8",
  ink: "#1b1a18",
  inkSoft: "#6d675c",
  ball: "#c8202f",
  ballDark: "#8f1420",
  seam: "#fff4e6",
  shirt: "#2f5fb3",
  helmet: "#24324f",
  grass: "#9cc27a",
  fonts: { title: "InterBlack", hand: "PatrickHand", script: "CaveatBold" },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.5, 0, 0.75, 0),
  },
  spring: {
    pop: { damping: 11, stiffness: 180, mass: 0.6 },
    soft: { damping: 18, stiffness: 120, mass: 0.8 },
  },
} as const;
