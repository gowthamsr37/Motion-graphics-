// Abhishek Sharma vs KL Rahul — T20 INTERNATIONALS ONLY. Cut-off 15 November 2026.
// Career figures: supplied as verified from ICC player records. Do not change.
export const A_COL = "#F2A93B"; // Abhishek — amber
export const R_COL = "#6FA8DC"; // Rahul — India blue

export const career = {
  abhishek: { name: "ABHISHEK SHARMA", short: "ABHISHEK", era: "T20Is · 2024–2026", matches: 72, innings: 71, runs: 2268, balls: 1155, average: 32.87, sr: 196.36, fours: 216, sixes: 159, hundreds: 4, fifties: 14, bp4: 5.35, bp6: 7.26, bpb: 3.08, boundaryShare: 80.2, ballsPerDismissal: 16.7 },
  rahul: { name: "KL RAHUL", short: "RAHUL", era: "T20Is · 2016–2022", matches: 72, innings: 68, runs: 2265, balls: 1628, average: 37.75, sr: 139.13, fours: 191, sixes: 99, hundreds: 2, fifties: 22, bp4: 8.52, bp6: 16.44, bpb: 5.61, boundaryShare: 60.0, ballsPerDismissal: 27.1 },
};

// Ball-by-ball SAMPLE statistics (available matches only — not complete career datasets).
export const sample = {
  phases: ["1–5", "6–10", "11–20", "21–30", "31+"],
  phaseSR: { abhishek: [161.69, 204.18, 205.0, 171.22, 239.02], rahul: [103.74, 133.81, 148.2, 154.24, 155.59] },
  firstTen: { abhishek: 180.3, rahul: 117.8 },
  powerplaySR: { abhishek: 191.4, rahul: 128.9 },
  powerplayRuns: { abhishek: 1470, rahul: 1097 },
  dot: { pace: { abhishek: 37, rahul: 38 }, spin: { abhishek: 32, rahul: 26 }, overall: { abhishek: 35, rahul: 34 } },
};

// Derived from career totals (boundary balls ÷ balls faced).
export const boundaryBallPct = {
  abhishek: Math.round(((216 + 159) / 1155) * 1000) / 10, // 32.5
  rahul: Math.round(((191 + 99) / 1628) * 1000) / 10, // 17.8
};

// Hypothetical scoring-rate model: 18 balls at each batter's powerplay strike rate.
export const model = { balls: 18, abhishek: 34.5, rahul: 23.2, diff: 11.3, teamFrom: 180, teamTo: 191 };
