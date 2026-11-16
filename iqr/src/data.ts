// The running example: ten days of commute times (minutes).
// sorted 18 20 22 22 25 | 27 30 30 35 60 → median (25 + 27) / 2 = 26, Q1 = 22 (middle of the lower five),
// Q3 = 30 (middle of the upper five), IQR = 8, range = 42, fences 22 − 12 = 10 and 30 + 12 = 42 → 60 is an outlier.
export const COMMUTE = [25, 30, 18, 60, 22, 27, 35, 20, 30, 22]; // in the order the days happened
export const SORTED = [...COMMUTE].sort((a, b) => a - b);
export const Q1 = 22;
export const MED = 26;
export const Q3 = 30;
export const IQR = Q3 - Q1;
export const JAM = 60;
// equal values stack upward in dot plots
export const stackIdx = (vals: number[], i: number) => vals.slice(0, i).filter((v) => v === vals[i]).length;
