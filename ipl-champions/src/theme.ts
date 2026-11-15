// theme.ts — single source of truth. NEVER inline colors, easings, or spring configs in components.
import { Easing } from "remotion";

export type Team = {
  code: string;
  name: string;
  color: string; // identity color (badge fill, rail dot, bar)
  alt: string; // secondary (badge ring, background blob)
  on: string; // text color on top of `color`
};

export const theme = {
  colors: {
    bg: "#060913", // night-stadium navy
    bgAlt: "#0D1322",
    primary: "#F6B935", // THE hero color (trophy gold) — max one element per frame
    primaryLight: "#FFE29A",
    primaryDark: "#A8700F",
    accent: "#4F5BD5", // indigo — background mesh only
    text: "#F5F3EE",
    textDim: "#98A1B3",
    textFaint: "rgba(245, 243, 238, 0.30)",
    line: "rgba(245, 243, 238, 0.14)",
    surface: "rgba(245, 243, 238, 0.05)",
    glow: "rgba(246, 185, 53, 0.45)",
    shadow: "rgba(0, 0, 0, 0.55)",
    vignette: "rgba(0, 0, 0, 0.42)",
    black: "#000000",
    white: "#FFFFFF",
  },
  // Team identity colors are data encoding: each franchise keeps its own color everywhere.
  teams: {
    RR: { code: "RR", name: "Rajasthan Royals", color: "#E6197F", alt: "#2A4FB0", on: "#FFFFFF" },
    DCH: { code: "DC", name: "Deccan Chargers", color: "#9FBCE6", alt: "#1D3C6E", on: "#0B1F3A" },
    CSK: { code: "CSK", name: "Chennai Super Kings", color: "#F9CD05", alt: "#1A5FB4", on: "#0B2350" },
    KKR: { code: "KKR", name: "Kolkata Knight Riders", color: "#6B3FB8", alt: "#C9A43A", on: "#FFFFFF" },
    MI: { code: "MI", name: "Mumbai Indians", color: "#0B5CD5", alt: "#D1AB3E", on: "#FFFFFF" },
    SRH: { code: "SRH", name: "Sunrisers Hyderabad", color: "#F7661C", alt: "#B8320B", on: "#1A0D05" },
    GT: { code: "GT", name: "Gujarat Titans", color: "#2F4F86", alt: "#D8B76A", on: "#FFFFFF" },
    RCB: { code: "RCB", name: "Royal Challengers Bengaluru", color: "#E0232B", alt: "#C9A34E", on: "#FFFFFF" },
  } satisfies Record<string, Team>,
  fonts: {
    display: "Barlow Condensed",
    body: "Inter",
  },
  // THE easing curves. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — moves, color shifts
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // words, small pops
    smooth: { damping: 20, stiffness: 90, mass: 1 }, // big elements, odometer
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // badges, trophy
    roll: { damping: 18, stiffness: 190, mass: 0.6 }, // odometer digits
  },
} as const;

export type TeamKey = keyof typeof theme.teams;
