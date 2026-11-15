// theme.ts — single source of truth. NEVER inline colors, easings, or spring configs in components.
// Look: the heritage Adelaide Oval scoreboard — black boards, yellow headings and number plates, white names.
import { Easing } from "remotion";

export type Team = {
  name: string;
  short: string; // how the voiceover/fans say it
  logo: string; // file in public/logos
  color: string; // identity color (rail dot, tally plates, glow)
  glow?: string; // light behind the logo when `color` would wash it out
  plate?: boolean; // logo is drawn for a white background (uses negative space)
  on: string; // text color on top of `color`
};

export const theme = {
  colors: {
    board: "#0B0D0C",
    boardAlt: "#151916",
    plate: "#1B1F1C", // number tin
    plateHi: "#262B27",
    plateEdge: "rgba(243, 241, 231, 0.10)",
    seam: "rgba(243, 241, 231, 0.035)",
    primary: "#F6B800", // scoreboard yellow — number plates
    cap: "#FF7A1A", // the Orange Cap itself
    capLight: "#FFB566",
    capDark: "#B84800",
    capGlow: "rgba(255, 122, 26, 0.5)",
    primaryLight: "#FFD54D",
    primaryDark: "#A87800",
    text: "#F3F1E7", // board white paint
    textDim: "#A6ABA3",
    textFaint: "rgba(243, 241, 231, 0.28)",
    line: "rgba(243, 241, 231, 0.14)",
    glow: "rgba(246, 184, 0, 0.45)",
    shadow: "rgba(0, 0, 0, 0.6)",
    vignette: "rgba(0, 0, 0, 0.5)",
    outline: "rgba(255, 255, 255, 0.75)",
    black: "#000000",
    white: "#FFFFFF",
  },
  teams: {
    RR: { name: "Rajasthan Royals", short: "RR", logo: "rr.svg", color: "#E6197F", on: "#FFFFFF" },
    DCH: { name: "Deccan Chargers", short: "DC", logo: "dch.png", color: "#9FBCE6", on: "#0B1F3A" },
    CSK: { name: "Chennai Super Kings", short: "CSK", logo: "csk.svg", color: "#F9CD05", glow: "#1A5FB4", plate: true, on: "#0B2350" },
    KKR: { name: "Kolkata Knight Riders", short: "KKR", logo: "kkr.svg", color: "#6B3FB8", on: "#FFFFFF" },
    MI: { name: "Mumbai Indians", short: "MI", logo: "mi.svg", color: "#0B5CD5", on: "#FFFFFF" },
    SRH: { name: "Sunrisers Hyderabad", short: "SRH", logo: "srh.svg", color: "#F7661C", on: "#1A0D05" },
    GT: { name: "Gujarat Titans", short: "GT", logo: "gt.svg", color: "#3A5C96", on: "#FFFFFF" },
    RCB: { name: "Royal Challengers Bengaluru", short: "RCB", logo: "rcb.svg", color: "#E0232B", on: "#FFFFFF" },
    DC: { name: "Delhi Capitals", short: "DC", logo: "dc.svg", color: "#17449B", on: "#FFFFFF" },
    PBKS: { name: "Punjab Kings", short: "PBKS", logo: "pbks.svg", color: "#DD1F2D", on: "#FFFFFF" },
    RPS: { name: "Rising Pune Supergiant", short: "RPS", logo: "rps.png", color: "#6A2C91", on: "#FFFFFF" },
  } satisfies Record<string, Team>,
  // Closest free match to the Adelaide board's painted condensed gothic.
  fonts: {
    display: "League Gothic",
    body: "Oswald",
  },
  // THE easing curves. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    flip: { damping: 16, stiffness: 210, mass: 0.6 }, // number plates
  },
} as const;

export type TeamKey = keyof typeof theme.teams;
