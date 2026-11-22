// theme.ts — single source of truth. Look: deep-navy studio explainer with a 4-accent category code.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#050A1F",
    bgDeep: "#02051A",
    navy: "#0C1640",
    navyHi: "#16225A",
    panel: "rgba(14, 24, 64, 0.74)",
    panelHi: "rgba(26, 40, 98, 0.82)",
    edge: "rgba(150, 180, 255, 0.16)",
    edgeHi: "rgba(170, 200, 255, 0.32)",
    text: "#F3F7FF",
    dim: "#A3B0D6",
    faint: "rgba(190, 205, 255, 0.4)",
    ghost: "rgba(190, 205, 255, 0.12)",
    ink: "#071033", // dark text on bright fills
    cyan: "#22D3EE",
    violet: "#A78BFA",
    green: "#34D399",
    orange: "#FB923C",
    red: "#FB5C7A", // "wrong" marks only
    yellow: "#FCD34D", // quiz badge only
    blood: "#F2557A",
    skin: ["#F5CDA7", "#DDA57E", "#B97C58", "#8E5B3E"],
    hair: ["#1D1838", "#3A2620", "#141226", "#4A2E1E"],
    trousers: "#26305E",
    white: "#FFFFFF",
  },
  fonts: {
    display: "Sora",
    body: "Inter",
    mono: "JetBrains Mono",
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
    bouncy: { damping: 10, stiffness: 170, mass: 0.7 },
    pop: { damping: 12, stiffness: 220, mass: 0.5 },
    soft: { damping: 26, stiffness: 70, mass: 1 },
  },
} as const;

// The category colour code, used identically in every scene.
export type Kind = "data" | "numerical" | "discrete" | "continuous" | "categorical" | "nominal" | "ordinal" | "mean" | "median" | "mode" | "outlier" | "range" | "variance" | "sd" | "centre" | "spread" | "mistake" | "rare";
export const kindColor: Record<Kind, string> = {
  // this video: outliers = orange, ordinary data = white-blue, mistakes = violet, real-but-rare = cyan,
  // mean = cyan, median = green, spread / IQR / fences = violet (the series meanings)
  mistake: theme.colors.violet,
  rare: theme.colors.cyan,
  centre: theme.colors.cyan,
  spread: theme.colors.violet,
  range: theme.colors.cyan,
  variance: theme.colors.green,
  sd: theme.colors.violet,
  mean: theme.colors.cyan,
  median: theme.colors.green,
  mode: theme.colors.violet,
  outlier: theme.colors.orange,
  data: "#E4EEFF",
  numerical: theme.colors.cyan,
  discrete: theme.colors.cyan,
  continuous: theme.colors.green,
  categorical: theme.colors.violet,
  nominal: theme.colors.violet,
  ordinal: theme.colors.orange,
};

export const alpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const BAT_A = "#E4EEFF";
export const BAT_B = theme.colors.orange;
export const HANDLE = "@curious_datascientist";

export const glowText = (c: string, k = 1) => `0 0 ${18 * k}px ${alpha(c, 0.55)}, 0 0 ${48 * k}px ${alpha(c, 0.3)}`;
export const glowBox = (c: string, k = 1) => `0 0 ${30 * k}px ${alpha(c, 0.42)}, 0 0 ${80 * k}px ${alpha(c, 0.2)}`;

// ---------- 100 Days of ML: the NOTEBOOK look (user's pick, Nov 2026) ----------
// Cream lined paper, ink + coloured pens, marker highlights, hand-drawn (rough.js) sketches, handwriting fonts.
export const nb = {
  paper: "#F7F1E3",
  paperDeep: "#EFE6D2",
  rule: "#C7D7EA",
  margin: "#E59A9A",
  ink: "#1E2433",
  pencil: "#6B7280",
  faint: "rgba(30, 36, 51, 0.32)",
  blue: "#2457D6",
  red: "#D7263D",
  green: "#178A4C",
  orange: "#E8590C",
  purple: "#7048E8",
  yellow: "#FDE047",
  pink: "#F9A8D4",
  mint: "#9AE6B4",
  sky: "#A5D8FF",
  sticky: "#FFF3A3",
  stickyPink: "#FFD6E5",
  stickyBlue: "#D3ECFF",
  stickyGreen: "#D8F5DC",
};
export const hand = { title: "Caveat", body: "Patrick Hand", mono: "JetBrains Mono" };
