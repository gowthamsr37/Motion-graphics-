// theme.ts — Beyond The Scoreboard. Brand typography (League Gothic + Oswald) on a night-stadium
// documentary palette: deep navy, floodlight cream, coin gold as the hero colour.
import { Easing } from "remotion";

export const theme = {
  colors: {
    night: "#05080E",
    navy: "#0A111C",
    navyHi: "#132033",
    panel: "rgba(6, 10, 18, 0.78)",
    panelEdge: "rgba(237, 228, 204, 0.14)",
    cream: "#EDE4CC", // brand lettering
    creamDim: "rgba(237, 228, 204, 0.64)",
    creamFaint: "rgba(237, 228, 204, 0.28)",
    gold: "#F2B544", // coin / hero
    goldDeep: "#C98A22",
    goldGlow: "rgba(242, 181, 68, 0.45)",
    green: "#3FBF83", // bowl first
    greenGlow: "rgba(63, 191, 131, 0.42)",
    blue: "#5AA2E6", // bat first
    blueGlow: "rgba(90, 162, 230, 0.42)",
    red: "#E0604B",
    white: "#FFFFFF",
    black: "#000000",
  },
  fonts: {
    display: "League Gothic",
    body: "Oswald",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    cam: Easing.bezier(0.37, 0, 0.2, 1),
  },
  spring: {
    snappy: { damping: 15, stiffness: 170, mass: 0.6 },
    smooth: { damping: 20, stiffness: 95, mass: 1 },
    bouncy: { damping: 11, stiffness: 160, mass: 0.7 },
    heavy: { damping: 16, stiffness: 110, mass: 1.4 },
  },
  // Instagram Reels safe area (1080×1920): top ~220 px (header), bottom ~420 px (caption, audio,
  // profile), right ~140 px from y≈1050 (like/comment/share rail).
  safe: { top: 230, bottom: 1480, left: 64, right: 936, subY: 1392 },
} as const;

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
