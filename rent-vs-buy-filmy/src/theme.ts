// theme.ts — single source of truth. Look: Bollywood drama — velvet maroon, gold, spotlights, film grain.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#14040A",
    maroon: "#4A0B1E",
    velvet: "#7A1030",
    velvetHi: "#A8183F",
    gold: "#F2C14E",
    goldHi: "#FFE7A3",
    goldDeep: "#B8862B",
    cream: "#FFF4DE",
    dim: "#D8B9A8",
    faint: "rgba(255, 244, 222, 0.45)",
    arjun: "#4FA3FF",
    meera: "#2EC4A6",
    papa: "#F2C14E",
    maa: "#FF6F91",
    narrator: "#FFF4DE",
    red: "#FF3B4E",
    redGlow: "rgba(255, 59, 78, 0.5)",
    green: "#5BE38F",
    ink: "#2A0A12",
    skin1: "#C98656",
    skin2: "#B87548",
    hair: "#1A0F0B",
    black: "#000000",
  },
  fonts: {
    poster: "Rozha One",
    filmy: "Yatra One",
    body: "Poppins",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 170, mass: 0.6 },
    smooth: { damping: 20, stiffness: 95, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    stamp: { damping: 13, stiffness: 220, mass: 0.9 },
  },
} as const;

export type Who = "narrator" | "arjun" | "papa" | "meera" | "maa";
export const whoColor = (w: Who) => theme.colors[w];
export const whoName: Record<Who, string> = { narrator: "", arjun: "ARJUN", papa: "PAPA", meera: "MEERA", maa: "MAA" };
