// theme.ts — single source of truth. Look: warm night-time storybook (flat illustration over a city at dusk).
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#14112B",
    bgHi: "#231C45",
    card: "#1E1A3C",
    cardHi: "#2A2452",
    edge: "rgba(246, 239, 230, 0.12)",
    grid: "rgba(246, 239, 230, 0.08)",
    text: "#F6EFE6",
    dim: "#B3A9C9",
    faint: "rgba(179, 169, 201, 0.45)",
    arjun: "#5AA9FF", // Arjun — the buyer
    arjunGlow: "rgba(90, 169, 255, 0.4)",
    meera: "#FFB547", // Meera — the renter
    meeraGlow: "rgba(255, 181, 71, 0.45)",
    red: "#FF5A6A", // crash / panic
    redGlow: "rgba(255, 90, 106, 0.45)",
    green: "#45D49A",
    skin1: "#C98B5B",
    skin2: "#B97A4C",
    hair: "#1E1410",
    black: "#000000",
  },
  fonts: {
    story: "Fraunces",
    body: "Inter",
    num: "Space Grotesk",
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
