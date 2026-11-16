// Figures used on screen. Source: Cricsheet open data (men's Tests & ODIs from 2002, T20Is from 2005,
// IPL 2008–2026). "Decided" = a match with a winner: ties, draws and no-results are left out.
export const DATA = {
  total: 8408,
  formats: [
    { k: "TESTS", n: 899 },
    { k: "ODIs", n: 2617 },
    { k: "T20Is", n: 3649 },
    { k: "IPL", n: 1243 },
  ],
  overall: { pct: 50.9, won: 4051, decided: 7965 },
  // band = the 95% range a fair coin gives over the same number of decided matches
  rows: [
    { k: "ODIs", sub: "2,487 DECIDED", pct: 50.0, band: [48.0, 52.0] },
    { k: "T20Is", sub: "3,530 DECIDED", pct: 50.5, band: [48.4, 51.6] },
    { k: "IPL", sub: "1,218 DECIDED", pct: 51.6, band: [47.2, 52.8] },
  ],
  wc2021: { dubaiChased: 12, dubaiN: 13, tossWon: 30, n: 45 },
  // toss winners' wins / decided games at each T20 World Cup (2021 includes the 5 Afghanistan games)
  wcs: [
    { y: "2021", pct: (30 / 45) * 100 },
    { y: "2022", pct: (15 / 38) * 100 },
    { y: "2024", pct: (23 / 41) * 100 },
    { y: "2026", pct: (21 / 49) * 100 },
  ],
  tests: { bat: 57.1, bowl: 48.3 },
  ipl: { bowl: 54.7, bat: 45.3, n: 1218 },
} as const;
