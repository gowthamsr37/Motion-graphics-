// ACC Men's U19 Asia Cup 2026 final — India U19 v Pakistan U19, Al Amerat (Oman), 14 November 2026.
// Verified against Cricinfo/ESPN match report + scorecard, PTI, Outlook, Open Magazine (see README).
export const match = { title: "U19 ASIA CUP FINAL", date: "14 NOV 2026", venue: "AL AMERAT, OMAN" };

export const pakistan = {
  total: 337,
  wickets: 9,
  batters: [
    { name: "USMAN KHAN", runs: 107, balls: 111, hundred: true },
    { name: "ABDUL QADIR", runs: 80, balls: 54 },
    { name: "FARHAN YOUSAF (C)", runs: 60, balls: 63 }, // PTI: "a 63-ball 60"
  ],
};

export const india = {
  target: 338,
  chase: [
    { name: "AARYAVIR SEHWAG", runs: 58, balls: 61 },
    { name: "LAKSHYA RAICHANDANI (C)", runs: 80, balls: 101 },
  ],
  collapse: { runs: 252, wickets: 8 },
  manal: { name: "MANAL CHAUHAN", runs: 47, balls: 32 },
  ulva: { name: "MOHIT ULVA", runs: 49, balls: 26 },
  ninthStand: 57, // 252/8 → 309/9
  ninthDown: { runs: 309, wickets: 9 },
  final: { runs: 339, wickets: 9 },
};

// The 50th over, bowled by legspinner Ahmed Hussain. A wide is not a legal delivery.
export const finalOver: { label: string; ball: string; score: string; need: string; runs: number; balls: number }[] = [
  { label: "START", ball: "", score: "330/9", need: "8 OFF 6", runs: 8, balls: 6 },
  { label: "49.1", ball: "0", score: "330/9", need: "8 OFF 5", runs: 8, balls: 5 },
  { label: "WIDE", ball: "WD", score: "331/9", need: "7 OFF 5", runs: 7, balls: 5 },
  { label: "49.2", ball: "1", score: "332/9", need: "6 OFF 4", runs: 6, balls: 4 },
  { label: "49.3", ball: "1", score: "333/9", need: "5 OFF 3", runs: 5, balls: 3 },
  { label: "49.4", ball: "1", score: "334/9", need: "4 OFF 2", runs: 4, balls: 2 },
  { label: "49.5", ball: "1", score: "335/9", need: "3 OFF 1", runs: 3, balls: 1 },
  { label: "49.6", ball: "4", score: "339/9", need: "INDIA WIN", runs: 0, balls: 0 },
];

// Graph A — milestones of the chase (a timeline, not an invented ball-by-ball curve).
export const milestones = [
  { score: "252/8", caption: "COLLAPSE", tone: "red" as const },
  { score: "309/9", caption: "NINTH WICKET FALLS", tone: "cream" as const },
  { score: "330/9", caption: "FINAL OVER BEGINS", tone: "cream" as const },
  { score: "335/9", caption: "ONE BALL LEFT", tone: "cream" as const },
  { score: "339/9", caption: "INDIA WIN", tone: "amber" as const },
];
