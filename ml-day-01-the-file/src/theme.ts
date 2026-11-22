// "The File" — Beyond The Scoreboard's editorial look: cricket-whites paper, navy ink,
// one accent colour for the hero (India saffron by default — swap per team), red-ball seam as the thread.
import { Easing } from "remotion";

export const theme = {
  colors: {
    paper: "#F2EDE3",
    paperHi: "#FBF8F1",
    paperLo: "#E6DFD0",
    ink: "#0F1A33",
    ink2: "#3A4458",
    mute: "#9A9282",
    line: "rgba(15, 26, 51, 0.14)",
    accent: "#EE7D1E", // the hero colour: saffron, as in the Pant reel (user: "it looks better")
    accentSoft: "rgba(238, 125, 30, 0.22)", // same hue at ~22% — caption highlighter
    red: "#B3202C", // the seam. Keep it red: it is the series thread
    white: "#FFFFFF",
  },
  fonts: {
    display: "Anton", // numbers, names, headlines (always uppercase)
    body: "Inter Display", // labels, captions
    serif: "Fraunces", // the editorial voice (italic)
    mono: "Inter Display",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.45, 0, 0.25, 1),
  },
  spring: {
    pop: { damping: 13, stiffness: 200, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    heavy: { damping: 18, stiffness: 110, mass: 1.3 },
    // used by the illustration kit
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    bouncy: { damping: 10, stiffness: 170, mass: 0.7 },
    soft: { damping: 26, stiffness: 70, mass: 1 },
  },
} as const;

// ---------- illustrations (the doodle kit from the ML classroom version, drawn as clean editorial ink) ----------
// STYLE "comic" = clean low-roughness ink outlines with flat fills (the kit's crisp mode); colours tuned to the paper look.
export const STYLE = "comic" as "notebook" | "chalk" | "comic";
export const nb = {
  paper: "#F2EDE3",
  paperDeep: "#E6DFD0",
  rule: "rgba(15,26,51,0.0)",
  margin: "#0F1A33",
  ink: "#0F1A33",
  pencil: "#8A8475",
  faint: "rgba(15, 26, 51, 0.3)",
  blue: "#2F5DA8",
  red: "#B3202C",
  green: "#3C8D5A",
  orange: "#EE7D1E",
  purple: "#6B54B8",
  yellow: "#F2C14E",
  pink: "#F2B8C2",
  mint: "#BFE3CB",
  sky: "#C9DCF2",
  sticky: "#FBEFC6",
  stickyPink: "#F6D5DA",
  stickyBlue: "#D8E6F6",
  stickyGreen: "#D6ECDC",
  card: "#FBF8F1",
  cardBorder: "#0F1A33",
  modelFill: "#FBF8F1",
  hlOrange: "#F6C79A",
  hlPurple: "#D6CCF0",
  ellAI: "#FBF8F1",
  ellML: "#FBF8F1",
  ellDL: "#FBF8F1",
  voteBg: "#FBEFC6",
  hand: "#FFF7EC",
};
export const hand = { title: "Anton", body: "Inter Display", mono: "Inter Display", titleScale: 1, bodyScale: 1, titleWeight: 400, bodyWeight: 800 };

// hex → rgba helper used by the illustration kit
export const alpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
