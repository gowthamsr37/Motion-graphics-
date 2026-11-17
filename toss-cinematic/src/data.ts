// Every number shown on screen lives here, with where it comes from. Nothing else in the project hard-codes a statistic.

// 1) Toss winner's win rate in DECIDED matches (draws, ties and no-results excluded).
//    Published historical analysis; internationals = men's matches between ICC Full Members.
export const FORMATS = [
  { key: "tests", name: "TESTS", pct: 54.3, n: 725 },
  { key: "odis", name: "ODIs", pct: 49.6, n: 1946 },
  { key: "t20is", name: "T20Is", pct: 50.3, n: 1073 },
  { key: "ipl", name: "IPL", pct: 51.6, n: 1218 },
] as const;

// 2) IPL, by what the toss winner chose. Observed association, not a causal effect of the choice.
//    Counts (decided matches) are from the Cricsheet analysis in ../toss-myth/analysis/summary.json: 443/810 and 185/408.
export const IPL_DECISION = {
  bowl: { label: "BOWL FIRST", pct: 54.7, n: 810 },
  bat: { label: "BAT FIRST", pct: 45.3, n: 408 },
} as const;

// 3) IPL seasons. "About 44%" of 71 decided matches is 31 wins; "about 61%" of 70 is 43 (Cricsheet: 43.7% and 61.4%).
export const IPL_SEASONS = [
  { year: 2024, pct: 44, n: 71, wins: 31 },
  { year: 2025, pct: 61, n: 70, wins: 43 },
] as const;

// What a perfectly fair coin does over a 70-match season: 95% of seasons land inside 50 ± 1.96·√(0.25/70).
export const CHANCE_BAND_70 = { lo: 38, hi: 62 } as const;

// 4) Estimated effect of winning the toss on win probability, in percentage points
//    (Sood & Willis, "Fairly Random"). A different statistic from the win rates above.
export const TOSS_EFFECT = {
  day: { label: "DAYTIME", value: 0, text: "~0" },
  dayNight: { label: "DAY-NIGHT", value: 3.3, text: "+3.3" },
  tests: { label: "TEST CRICKET", value: 4.9, text: "+4.9" },
} as const;

export const SOURCES = {
  rates: "Decided matches only · internationals: men's Full Member matches",
  ipl: "IPL · decided matches",
  paper: "Sood & Willis, “Fairly Random” · estimated effect on win probability",
} as const;

// Seeded RNG so the simulated seasons are the same on every render.
export const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// 36 simulated seasons of 70 fair coin flips: toss-winner win %, to show how far chance alone swings.
export const SIM_SEASONS: number[] = (() => {
  const r = mulberry(2024);
  return Array.from({ length: 36 }, () => {
    let w = 0;
    for (let i = 0; i < 70; i++) if (r() < 0.5) w++;
    return (100 * w) / 70;
  });
})();
