// Every figure on screen, exactly as supplied in the brief (verified research). Nothing is derived
// here except the coin-flip simulation, which is labelled as a simulation.

// Toss winner also won the match (decided men's matches; draws, ties and no-results excluded;
// international samples are matches between ICC Full Members).
export const FORMATS = [
  { key: "TEST", label: "TESTS", n: 725, pct: 54.3 },
  { key: "ODI", label: "ODIs", n: 1946, pct: 49.6 },
  { key: "T20I", label: "T20Is", n: 1073, pct: 50.3 },
  { key: "IPL", label: "IPL", n: 1218, pct: 51.6 },
] as const;

// IPL: match-win rate of toss-winning captains by their decision (observational, not causal).
export const IPL_DECISION = { field: 54.7, bat: 45.3 };

// IPL seasons (approximate, decided matches).
export const SEASONS = [
  { year: "2024", pct: 44, n: 71 },
  { year: "2025", pct: 61, n: 70 },
];

// 2023 study, 35,000+ matches: estimated toss effect on winning probability (percentage points).
export const STUDY = { dayLimited: 0, dayNightLimited: 3.3, test: 4.9, matches: "35,000+" };

// Fair-coin seasons of 70 matches: the 95% range is 50 ± 1.96·√(0.25/70) ≈ 50 ± 11.7 points.
export const COIN_RANGE = { lo: 38.3, hi: 61.7, n: 70 };

// Deterministic simulation of fair-coin seasons for the sampling-variation graphic.
export const simulateSeasons = (count: number, n = 70, seed = 2024) => {
  let s = seed;
  const r = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => {
    let w = 0;
    for (let i = 0; i < n; i++) if (r() < 0.5) w++;
    return (w / n) * 100;
  });
};
