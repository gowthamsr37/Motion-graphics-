import { TeamKey } from "./theme";

export type Season = {
  year: number;
  winner: TeamKey;
  runnerUp: { name: string; team: TeamKey }; // name as it was that season
  captain: string;
  note: string;
};

// Every IPL final, 2008–2026.
export const seasons: Season[] = [
  { year: 2008, winner: "RR", runnerUp: { name: "Chennai Super Kings", team: "CSK" }, captain: "Shane Warne", note: "The first-ever champions" },
  { year: 2009, winner: "DCH", runnerUp: { name: "Royal Challengers Bangalore", team: "RCB" }, captain: "Adam Gilchrist", note: "Played in South Africa" },
  { year: 2010, winner: "CSK", runnerUp: { name: "Mumbai Indians", team: "MI" }, captain: "MS Dhoni", note: "CSK's first title" },
  { year: 2011, winner: "CSK", runnerUp: { name: "Royal Challengers Bangalore", team: "RCB" }, captain: "MS Dhoni", note: "First team to go back-to-back" },
  { year: 2012, winner: "KKR", runnerUp: { name: "Chennai Super Kings", team: "CSK" }, captain: "Gautam Gambhir", note: "KKR's first title" },
  { year: 2013, winner: "MI", runnerUp: { name: "Chennai Super Kings", team: "CSK" }, captain: "Rohit Sharma", note: "MI's first title" },
  { year: 2014, winner: "KKR", runnerUp: { name: "Kings XI Punjab", team: "PBKS" }, captain: "Gautam Gambhir", note: "Title No. 2" },
  { year: 2015, winner: "MI", runnerUp: { name: "Chennai Super Kings", team: "CSK" }, captain: "Rohit Sharma", note: "Title No. 2" },
  { year: 2016, winner: "SRH", runnerUp: { name: "Royal Challengers Bangalore", team: "RCB" }, captain: "David Warner", note: "SRH's first title" },
  { year: 2017, winner: "MI", runnerUp: { name: "Rising Pune Supergiant", team: "RPS" }, captain: "Rohit Sharma", note: "Won the final by 1 run" },
  { year: 2018, winner: "CSK", runnerUp: { name: "Sunrisers Hyderabad", team: "SRH" }, captain: "MS Dhoni", note: "Back from a two-year ban" },
  { year: 2019, winner: "MI", runnerUp: { name: "Chennai Super Kings", team: "CSK" }, captain: "Rohit Sharma", note: "By 1 run — again" },
  { year: 2020, winner: "MI", runnerUp: { name: "Delhi Capitals", team: "DC" }, captain: "Rohit Sharma", note: "Back-to-back · in the UAE" },
  { year: 2021, winner: "CSK", runnerUp: { name: "Kolkata Knight Riders", team: "KKR" }, captain: "MS Dhoni", note: "Title No. 4" },
  { year: 2022, winner: "GT", runnerUp: { name: "Rajasthan Royals", team: "RR" }, captain: "Hardik Pandya", note: "Won in their debut season" },
  { year: 2023, winner: "CSK", runnerUp: { name: "Gujarat Titans", team: "GT" }, captain: "MS Dhoni", note: "Title No. 5 · level with MI" },
  { year: 2024, winner: "KKR", runnerUp: { name: "Sunrisers Hyderabad", team: "SRH" }, captain: "Shreyas Iyer", note: "Title No. 3" },
  { year: 2025, winner: "RCB", runnerUp: { name: "Punjab Kings", team: "PBKS" }, captain: "Rajat Patidar", note: "First title, 18 seasons in" },
  { year: 2026, winner: "RCB", runnerUp: { name: "Gujarat Titans", team: "GT" }, captain: "Rajat Patidar", note: "Back-to-back champions" },
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

export const champions = tally.map((r) => r.team);
