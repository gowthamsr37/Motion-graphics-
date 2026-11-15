// theme.ts — single source of truth. Look: the heritage Adelaide Oval manual scoreboard.
import { Easing } from "remotion";

export const theme = {
  colors: {
    board: "#0A0F0C", // charcoal with a green cast
    boardGreen: "#18271E", // faded scoreboard green
    boardGreenHi: "#203327",
    panel: "#0F1612",
    panelHi: "#17211B",
    panelEdge: "rgba(237, 228, 204, 0.11)",
    seam: "rgba(237, 228, 204, 0.045)",
    plate: "#141B16",
    plateHi: "#212A23",
    cream: "#EDE4CC", // aged cream lettering
    creamDim: "#A39D8A",
    creamFaint: "rgba(237, 228, 204, 0.26)",
    amber: "#F2A93B", // milestones
    amberGlow: "rgba(242, 169, 59, 0.5)",
    red: "#C4513F", // decline
    redGlow: "rgba(196, 81, 63, 0.45)",
    green: "#38B47A", // recovery
    greenGlow: "rgba(56, 180, 122, 0.45)",
    trimCream: "#CFC6A6",
    trimGreen: "#3B5644",
    shadow: "rgba(0, 0, 0, 0.6)",
    black: "#000000",
    white: "#FFFFFF",
  },
  fonts: {
    display: "League Gothic",
    body: "Oswald",
  },
  // Physics-aware curves. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.45, 0, 0.25, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    flip: { damping: 16, stiffness: 210, mass: 0.6 }, // number plates
    heavy: { damping: 15, stiffness: 120, mass: 1.5 }, // big wooden panels
  },
} as const;

export type Tone = "cream" | "amber" | "red" | "green";
export const toneColor = (t: Tone) => theme.colors[t];
export const toneGlow = (t: Tone) =>
  t === "amber" ? theme.colors.amberGlow : t === "red" ? theme.colors.redGlow : t === "green" ? theme.colors.greenGlow : "transparent";
