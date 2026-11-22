import { Easing } from "remotion";

export const ACCENTS = ["#d6332f", "#2f6fd6", "#1f9d6b", "#e8871e", "#7b4bd1", "#0f9aa8"];

export const theme = {
  paper: "#fbf8f1",
  paperEdge: "#efe8d8",
  card: "#fffdf8",
  ink: "#1b1a18",
  inkSoft: "#8a8377",
  water: "#cfe6f2",
  waterDeep: "#a9d0e6",
  soil: "#e9d8b8",
  skin: "#f3d2b0",
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
