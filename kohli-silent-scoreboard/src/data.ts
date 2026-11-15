import { Tone } from "./theme";

// Calendar-year Test batting (not rolling averages). Average = runs ÷ dismissals.
//   2019: 612 ÷ 9 · 2020: 116 ÷ 6 · 2021: 536 ÷ 19 · 2022: 265 ÷ 10 · 2023: 671 ÷ 12
export const averages: { year: number; tests: number; avg: number; tone: Tone }[] = [
  { year: 2019, tests: 8, avg: 68.0, tone: "amber" },
  { year: 2020, tests: 3, avg: 19.33, tone: "red" },
  { year: 2021, tests: 11, avg: 28.21, tone: "red" },
  { year: 2022, tests: 6, avg: 26.5, tone: "red" },
  { year: 2023, tests: 8, avg: 55.92, tone: "green" },
];

// Same calendar years, T20 internationals: 2021 299 ÷ 4 · 2022 781 ÷ 14.
export const formatCompare = [
  { year: 2021, test: 28.21, t20i: 74.75 },
  { year: 2022, test: 26.5, t20i: 55.79 },
];

export const verdicts: { format: string; verdict: string; tone: Tone }[] = [
  { format: "TESTS", verdict: "STRUGGLING", tone: "red" },
  { format: "ODIs", verdict: "MIXED", tone: "amber" },
  { format: "T20Is", verdict: "STILL PRODUCING", tone: "green" },
];
