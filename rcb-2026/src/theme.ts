// "The File" — Beyond The Scoreboard's editorial look: cricket-whites paper, navy ink,
// one accent colour for the hero (India saffron by default — swap per team), red-ball seam as the thread.
import { Easing } from "remotion";

export const theme = {
  colors: {
    paper: "#0A0D1A",
    paperHi: "#151B30",
    paperLo: "#05070F",
    ink: "#F5F2EA",
    ink2: "#AEB5C8",
    mute: "#5D6580",
    line: "rgba(255, 255, 255, 0.10)",
    accent: "#E8283B", // RCB red
    accentSoft: "rgba(232, 40, 59, 0.45)",
    red: "#C9A227", // seam in RCB gold for this reel
    white: "#FFFFFF",
  },
  fonts: {
    display: "Anton", // numbers, names, headlines (always uppercase)
    body: "Inter Display", // labels, captions
    serif: "Fraunces", // the editorial voice (italic)
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
  },
} as const;
