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
    accent: "#EE7D1E", // the hero's colour. CSK yellow #F2B705, RCB red #C8102E, Australia gold #E8B321 …
    accentSoft: "rgba(238, 125, 30, 0.22)", // same hue at ~22% — caption highlighter
    red: "#B3202C", // the seam. Keep it red: it is the series thread
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
