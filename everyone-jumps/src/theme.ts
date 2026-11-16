// theme.ts — single source of truth. Look: premium space documentary.
// Deep navy space, blue-white planet, cyan for science, warm orange for force & energy.
import { Easing } from "remotion";

export const theme = {
  colors: {
    space: "#02040A",
    navy: "#050A18",
    navyHi: "#0B1630",
    panel: "rgba(8, 16, 36, 0.72)",
    panelEdge: "rgba(160, 200, 255, 0.16)",
    ink: "#EAF2FF", // cool white text
    inkDim: "rgba(234, 242, 255, 0.62)",
    inkFaint: "rgba(234, 242, 255, 0.28)",
    cyan: "#58DAFF", // science highlights & data
    cyanDeep: "#1E8FD0",
    cyanGlow: "rgba(88, 218, 255, 0.45)",
    orange: "#FF8B3D", // force & energy
    orangeHi: "#FFB476",
    orangeGlow: "rgba(255, 139, 61, 0.5)",
    silhouette: "#03060E",
    black: "#000000",
    white: "#FFFFFF",
  },
  fonts: {
    display: "Barlow Condensed", // headlines, 600–800, uppercase
    body: "Inter", // captions & labels
    mono: "JetBrains Mono", // numbers & data readouts
  },
  // Natural easing only. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.45, 0, 0.25, 1),
    cam: Easing.bezier(0.37, 0, 0.18, 1), // camera moves: gentle start, long settle
  },
  spring: {
    snappy: { damping: 15, stiffness: 170, mass: 0.6 },
    smooth: { damping: 20, stiffness: 95, mass: 1 },
    bouncy: { damping: 11, stiffness: 160, mass: 0.7 },
    heavy: { damping: 16, stiffness: 110, mass: 1.4 },
  },
  // 9:16 safe layout (px). YouTube Shorts UI covers the top ~200px, the bottom ~420px
  // and a button rail at the right from y≈900. Key content stays inside these bounds.
  safe: {
    top: 250,
    bottom: 1460,
    left: 70,
    right: 930,
    captionY: 1300, // vertical centre of the subtitle block
  },
} as const;

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
