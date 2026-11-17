// Story beats on the film clock (seconds), derived from the narration timings.
// The 3D director, the 2D overlays and the sound mix all read these, so a re-recorded voice-over re-times everything.
import { E, S, sentence, TOTAL, W } from "./timing";

// The opening coin: spun at OMEGA0 rad/s (slow motion), it decelerates to a stop at FREEZE showing heads to the lens.
// FREEZE is chosen so the first frame's coin angle equals the angle the re-toss at the very end arrives at (seamless loop).
export const OMEGA0 = 16;
export const FACE = Math.PI / 2 + 0.1;
export const RETOSS = 0.85; // length of the re-toss that closes the loop
const loopPhase = OMEGA0 * RETOSS - (OMEGA0 / (2 * RETOSS)) * RETOSS * RETOSS; // angle travelled during the re-toss
export const FREEZE = (2 * (FACE - (loopPhase % (2 * Math.PI)) + 6 * Math.PI)) / OMEGA0;

export const B = {
  s1: {
    freeze: FREEZE,
    stat: W("s1", "barely") + 0.05, // IPL — 51.6%
    statOut: sentence("s1", 1).from - 0.32,
    title: sentence("s1", 1).from - 0.1, // DOES THE TOSS REALLY MATTER?
    go: W("s1", "let's") + 0.05, // time restarts
    end: E("s1"),
  },
  s2: {
    // [rise starts, value reached] for each pillar
    rise: [
      [W("s2", "toss") - 0.2, W("s2", "54.3") + 0.55],
      [W("s2", "odis") - 0.1, W("s2", "49.6") + 0.55],
      [W("s2", "t20") + 0.1, W("s2", "50.3") + 0.45],
      [W("s2", "ipl") - 0.1, W("s2", "51.6") + 0.45],
    ] as [number, number][],
    ref: [W("s2", "54.3") + 0.7, W("s2", "54.3") + 1.7] as [number, number],
    wide: W("s2", "51.6") + 0.2,
  },
  s3: {
    lights: W("s3", "under") - 0.3, // first tower strikes; the others follow 0.42 s apart
    dew: W("s3", "dew") - 0.15,
    won: W("s3", "you've") - 0.1,
    choose: W("s3", "what") - 0.1,
    bat: W("s3", "bat") - 0.1,
    bowl: W("s3", "bowl") - 0.1,
    think: sentence("s3", 5).to + 0.1, // countdown runs from here to the end of the scene
    end: E("s3"),
  },
  s4: {
    bowlBar: W("s4", "nearly") - 0.05,
    batBar: W("s4", "only") - 0.05,
    shot: W("s4", "bat") - 0.25,
    doubt: sentence("s4", 2).from - 0.15,
    stamp: sentence("s4", 3).from - 0.05, // CORRELATION ≠ CAUSATION
  },
  s5: {
    y24: W("s5", "2024") - 0.1,
    v24: W("s5", "44") - 0.05,
    y25: W("s5", "2025") - 0.1,
    v25: W("s5", "61") - 0.05,
    same: sentence("s5", 3).from - 0.1,
    why: W("s5", "different") - 0.1,
  },
  s6: {
    dayLabel: W("s6", "daytime") - 0.2,
    lapse: [W("s6", "daytime") + 0.9, W("s6", "estimated") + 0.6] as [number, number], // the afternoon-to-night time-lapse
    lights: W("s6", "day-night") - 0.25,
    down: W("s6", "estimated"),
    reveal: W("s6", "3.3") - 0.05,
  },
  s7: {
    reveal: W("s7", "4.9") - 0.05,
    over: sentence("s7", 1).from,
    day3: W("s7", "wear") - 0.35,
    day5: W("s7", "cracks") - 0.2,
    bounce: W("s7", "batting") - 0.1,
  },
  s8: {
    montage: [S("s8") + 0.05, sentence("s8", 1).to + 0.25] as [number, number], // seven shots share this window
    nodes: [sentence("s8", 2).from - 0.15, W("s8", "weather") - 0.1, W("s8", "match") - 0.1, W("s8", "play") - 0.1], // TOSS, CHOICE, CONDITIONS, OUTCOME
    feedback: W("s8", "captain's") - 0.1,
  },
  s9: {
    values: sentence("s9", 1).from - 0.1,
    valuesOut: sentence("s9", 1).to + 0.3,
    line1: sentence("s9", 2).from - 0.05, // THE TOSS DOESN'T GUARANTEE VICTORY.
    line2: W("s9", "right") + 0.15, // CONDITIONS CHANGE EVERYTHING.
    linesOut: sentence("s9", 2).to + 0.25,
    fall: sentence("s9", 3).from - 0.1,
    land: W("s9", "winner") + 0.12,
    lockup: sentence("s9", 5).from - 0.12,
    retoss: TOTAL - RETOSS,
  },
} as const;
