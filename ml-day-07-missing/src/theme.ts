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

// ---------- 100 Days of ML, Day 1, in the STATISTICS HOUSE STYLE (user, Nov 2026: "give the same kind we used for the
// statistics videos, just make the cover a different background colour"). The scene kit (NB.tsx) renders in "navy"
// mode: house backdrop, Sora / Inter, the neon accents, crisp glowing line icons, house panels and pills.
export const STYLE = "navy" as "notebook" | "chalk" | "comic" | "navy";
export const nb = {
  paper: "#050A1F",
  paperDeep: "#02051A",
  rule: "rgba(255,255,255,0.0)",
  margin: "rgba(255,255,255,0.0)",
  ink: "#F3F7FF",
  pencil: "#A3B0D6",
  faint: "rgba(190, 205, 255, 0.4)",
  blue: "#22D3EE",
  red: "#FB5C7A",
  green: "#34D399",
  orange: "#FB923C",
  purple: "#A78BFA",
  yellow: "#FCD34D",
  pink: "#F0ABFC",
  mint: "rgba(52,211,153,0.35)",
  sky: "rgba(34,211,238,0.30)",
  sticky: "#FCD34D",
  stickyPink: "#F0ABFC",
  stickyBlue: "#22D3EE",
  stickyGreen: "#34D399",
  card: "rgba(14, 24, 64, 0.85)",
  cardBorder: "rgba(150, 180, 255, 0.35)",
  modelFill: "rgba(167,139,250,0.14)",
  hlOrange: "#FB923C",
  hlPurple: "#A78BFA",
  ellAI: "rgba(251,146,60,0.06)",
  ellML: "rgba(34,211,238,0.07)",
  ellDL: "rgba(167,139,250,0.16)",
  voteBg: "rgba(252,211,77,0.14)",
  hand: "#F3F7FF",
};
export const hand = { title: "Sora", body: "Inter", mono: "JetBrains Mono", titleScale: 0.62, bodyScale: 0.8, titleWeight: 800, bodyWeight: 700 };
