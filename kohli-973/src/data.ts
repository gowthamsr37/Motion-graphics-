// Virat Kohli, IPL 2016 (Royal Challengers Bangalore). Every number here appears on screen.
export const season = {
  runs: 973,
  innings: 16,
  average: "81.08", // 973 ÷ 12 dismissals (4 not outs)
  strikeRate: "152.03", // 973 runs off 640 balls
  hundreds: "04",
  fifties: "07",
};

// Running total after each innings, in order. Innings 15 = Qualifier 1 duck; 16 = the final.
// (75, 79, 33, 80, 100*, 14, 52, 108*, 20, 7, 109, 75*, 113, 54*, 0, 54)
export const cumulative = [75, 154, 187, 267, 367, 381, 433, 541, 561, 568, 677, 752, 865, 919, 919, 973];
export const centuryInnings = [5, 8, 11, 13]; // 1-based
export const duckInnings = 15;

// Team names as they were in 2016.
export const centuries = [
  { score: "100", notOut: true, balls: 63, opponent: "GUJARAT LIONS", date: "24 APR 2016" },
  { score: "108", notOut: true, balls: 58, opponent: "RISING PUNE SUPERGIANTS", date: "07 MAY 2016" },
  { score: "109", notOut: false, balls: 55, opponent: "GUJARAT LIONS", date: "14 MAY 2016" },
  { score: "113", notOut: false, balls: 50, opponent: "KINGS XI PUNJAB", date: "18 MAY 2016" },
];

export const final = {
  date: "29 MAY 2016",
  srh: { name: "SUNRISERS HYDERABAD", runs: 208, wkts: 7 },
  rcb: { name: "ROYAL CHALLENGERS BANGALORE", runs: 200, wkts: 7 },
  kohli: { runs: 54, balls: 35 },
  margin: 8,
};
