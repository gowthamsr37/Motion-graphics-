import { TeamKey } from "./theme";

export type Season = {
  year: number;
  player: string;
  team: TeamKey;
  teamName: string; // as it was that season
  runs: number;
  note: string;
};

// The Orange Cap: the season's leading run-scorer, 2008–2026.
export const seasons: Season[] = [
  { year: 2008, player: "Shaun Marsh", team: "PBKS", teamName: "Kings XI Punjab", runs: 616, note: "The first-ever Orange Cap" },
  { year: 2009, player: "Matthew Hayden", team: "CSK", teamName: "Chennai Super Kings", runs: 572, note: "Season played in South Africa" },
  { year: 2010, player: "Sachin Tendulkar", team: "MI", teamName: "Mumbai Indians", runs: 618, note: "First Indian to win it" },
  { year: 2011, player: "Chris Gayle", team: "RCB", teamName: "Royal Challengers Bangalore", runs: 608, note: "Joined mid-season as a replacement" },
  { year: 2012, player: "Chris Gayle", team: "RCB", teamName: "Royal Challengers Bangalore", runs: 733, note: "First to win it twice" },
  { year: 2013, player: "Michael Hussey", team: "CSK", teamName: "Chennai Super Kings", runs: 733, note: "Same total as Gayle: 733" },
  { year: 2014, player: "Robin Uthappa", team: "KKR", teamName: "Kolkata Knight Riders", runs: 660, note: "KKR won the title too" },
  { year: 2015, player: "David Warner", team: "SRH", teamName: "Sunrisers Hyderabad", runs: 562, note: "His first of three" },
  { year: 2016, player: "Virat Kohli", team: "RCB", teamName: "Royal Challengers Bangalore", runs: 973, note: "4 centuries · season record" },
  { year: 2017, player: "David Warner", team: "SRH", teamName: "Sunrisers Hyderabad", runs: 641, note: "Cap No. 2" },
  { year: 2018, player: "Kane Williamson", team: "SRH", teamName: "Sunrisers Hyderabad", runs: 735, note: "As SRH captain" },
  { year: 2019, player: "David Warner", team: "SRH", teamName: "Sunrisers Hyderabad", runs: 692, note: "Record third cap" },
  { year: 2020, player: "KL Rahul", team: "PBKS", teamName: "Kings XI Punjab", runs: 670, note: "Season played in the UAE" },
  { year: 2021, player: "Ruturaj Gaikwad", team: "CSK", teamName: "Chennai Super Kings", runs: 635, note: "CSK won the title too" },
  { year: 2022, player: "Jos Buttler", team: "RR", teamName: "Rajasthan Royals", runs: 863, note: "4 centuries, like Kohli in 2016" },
  { year: 2023, player: "Shubman Gill", team: "GT", teamName: "Gujarat Titans", runs: 890, note: "3 centuries in the season" },
  { year: 2024, player: "Virat Kohli", team: "RCB", teamName: "Royal Challengers Bengaluru", runs: 741, note: "His second cap" },
  { year: 2025, player: "Sai Sudharsan", team: "GT", teamName: "Gujarat Titans", runs: 759, note: "Youngest winner at the time" },
  { year: 2026, player: "Vaibhav Sooryavanshi", team: "RR", teamName: "Rajasthan Royals", runs: 776, note: "Youngest ever, at 15 · 72 sixes" },
];

// Distinct winners, in the order they first won it.
export const players: string[] = [...new Set(seasons.map((s) => s.player))];

export type TallyRow = { team: TeamKey; years: number[] };

// Orange Caps per franchise, most first; ties ordered by who got there first.
export const tally: TallyRow[] = (() => {
  const map = new Map<TeamKey, number[]>();
  for (const s of seasons) map.set(s.team, [...(map.get(s.team) ?? []), s.year]);
  return [...map.entries()]
    .map(([team, years]) => ({ team, years }))
    .sort((a, b) => b.years.length - a.years.length || a.years[a.years.length - 1] - b.years[b.years.length - 1]);
})();
