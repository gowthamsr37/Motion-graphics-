import { TeamKey, theme } from "./theme";

export type Season = {
  year: number;
  winner: TeamKey;
  runnerUp: string;
  captain: string;
  note: string;
};

// Every IPL final, 2008–2026.
export const seasons: Season[] = [
  { year: 2008, winner: "RR", runnerUp: "Chennai Super Kings", captain: "Shane Warne", note: "The first-ever champions" },
  { year: 2009, winner: "DCH", runnerUp: "Royal Challengers Bangalore", captain: "Adam Gilchrist", note: "Season played in South Africa" },
  { year: 2010, winner: "CSK", runnerUp: "Mumbai Indians", captain: "MS Dhoni", note: "CSK's first title" },
  { year: 2011, winner: "CSK", runnerUp: "Royal Challengers Bangalore", captain: "MS Dhoni", note: "First team to go back-to-back" },
  { year: 2012, winner: "KKR", runnerUp: "Chennai Super Kings", captain: "Gautam Gambhir", note: "KKR's first title" },
  { year: 2013, winner: "MI", runnerUp: "Chennai Super Kings", captain: "Rohit Sharma", note: "MI's first title" },
  { year: 2014, winner: "KKR", runnerUp: "Kings XI Punjab", captain: "Gautam Gambhir", note: "Second title in three seasons" },
  { year: 2015, winner: "MI", runnerUp: "Chennai Super Kings", captain: "Rohit Sharma", note: "Title No. 2" },
  { year: 2016, winner: "SRH", runnerUp: "Royal Challengers Bangalore", captain: "David Warner", note: "SRH's first title" },
  { year: 2017, winner: "MI", runnerUp: "Rising Pune Supergiant", captain: "Rohit Sharma", note: "Title No. 3 · won the final by 1 run" },
  { year: 2018, winner: "CSK", runnerUp: "Sunrisers Hyderabad", captain: "MS Dhoni", note: "Back from a two-season suspension" },
  { year: 2019, winner: "MI", runnerUp: "Chennai Super Kings", captain: "Rohit Sharma", note: "Won the final by 1 run — again" },
  { year: 2020, winner: "MI", runnerUp: "Delhi Capitals", captain: "Rohit Sharma", note: "Back-to-back · played in the UAE" },
  { year: 2021, winner: "CSK", runnerUp: "Kolkata Knight Riders", captain: "MS Dhoni", note: "Title No. 4" },
  { year: 2022, winner: "GT", runnerUp: "Rajasthan Royals", captain: "Hardik Pandya", note: "Champions in their debut season" },
  { year: 2023, winner: "CSK", runnerUp: "Gujarat Titans", captain: "MS Dhoni", note: "Title No. 5 · level with MI" },
  { year: 2024, winner: "KKR", runnerUp: "Sunrisers Hyderabad", captain: "Shreyas Iyer", note: "Title No. 3" },
  { year: 2025, winner: "RCB", runnerUp: "Punjab Kings", captain: "Rajat Patidar", note: "First title in their 18th season" },
  { year: 2026, winner: "RCB", runnerUp: "Gujarat Titans", captain: "Rajat Patidar", note: "Back-to-back champions" },
];

export type TallyRow = { team: TeamKey; years: number[] };

// Titles per franchise, most first; ties ordered by who got there first.
export const tally: TallyRow[] = (() => {
  const map = new Map<TeamKey, number[]>();
  for (const s of seasons) map.set(s.winner, [...(map.get(s.winner) ?? []), s.year]);
  return [...map.entries()]
    .map(([team, years]) => ({ team, years }))
    .sort((a, b) => b.years.length - a.years.length || a.years[a.years.length - 1] - b.years[b.years.length - 1]);
})();

export const teamOf = (key: TeamKey) => theme.teams[key];
