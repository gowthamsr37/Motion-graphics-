// Virat Kohli in England: the 2014 and 2018 Test series. Figures supplied as verified in the brief — do not change.
export const tour2014 = {
  year: 2014,
  tests: 5,
  innings: 10,
  runs: 134,
  average: "13.40",
  highest: 39,
  fifties: 0,
  hundreds: 0,
  ducks: 2,
  andersonDismissals: 4,
  series: "ENGLAND WON 3–1",
  scores: [1, 8, 25, 0, 39, 28, 0, 7, 6, 20],
  grounds: ["TRENT BRIDGE", "LORD'S", "SOUTHAMPTON", "OLD TRAFFORD", "THE OVAL"],
};

export const tour2018 = {
  year: 2018,
  tests: 5,
  innings: 10,
  runs: 593,
  average: "59.30",
  hundreds: 2,
  fifties: 3,
  andersonDismissals: 0,
  series: "ENGLAND WON 4–1",
  scores: [149, 51, 23, 17, 97, 103, 46, 58, 49, 0],
  edgbaston: { runs: 149, balls: 225 },
};

export const cumulative = (xs: number[]) => xs.reduce<number[]>((a, x) => [...a, (a[a.length - 1] ?? 0) + x], []);
