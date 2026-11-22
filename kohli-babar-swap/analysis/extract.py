"""Extract every India and Pakistan ODI since Babar Azam's debut (31 May 2015) from Cricsheet ball-by-ball JSON,
plus an empirical "runs still to come" table from all first innings, for the swap simulator.

Usage: python3 analysis/extract.py <cricsheet odis_male_json dir>
Writes analysis/matches.json and analysis/future.json.
"""
import collections
import glob
import json
import pathlib
import sys

RAW = sys.argv[1]
OUT = pathlib.Path(__file__).resolve().parent
START = "2015-05-31"  # Babar Azam's ODI debut, v Zimbabwe at Lahore
TEAMS = {"India", "Pakistan"}
STAR = {"India": "V Kohli", "Pakistan": "Babar Azam"}
# Opposition tiers: the 12 full members v the rest
FULL = {"Afghanistan", "Australia", "Bangladesh", "England", "India", "Ireland", "New Zealand", "Pakistan", "South Africa", "Sri Lanka", "West Indies", "Zimbabwe"}
TOP = {"Australia", "England", "India", "New Zealand", "Pakistan", "South Africa", "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan"}


def innings_summary(inn, allotted_overs):
    runs = wk = legal = extras = 0
    bat = collections.OrderedDict()
    for ov in inn.get("overs", []):
        for d in ov["deliveries"]:
            ex = d.get("extras", {})
            wide, nb = "wides" in ex, "noballs" in ex
            for name in (d["batter"], d["non_striker"]):
                bat.setdefault(name, {"r": 0, "b": 0, "out": False})
            b = bat[d["batter"]]
            b["r"] += d["runs"]["batter"]
            if not wide:
                b["b"] += 1
            if not wide and not nb:
                legal += 1
            runs += d["runs"]["total"]
            extras += d["runs"]["extras"]
            for w in d.get("wickets", []):
                if w["kind"] not in ("retired hurt", "retired not out"):
                    wk += 1
                if w["player_out"] in bat:
                    bat[w["player_out"]]["out"] = True
                else:
                    bat[w["player_out"]] = {"r": 0, "b": 0, "out": True}
    tgt = inn.get("target", {})
    overs = tgt.get("overs", allotted_overs)
    return {
        "team": inn["team"],
        "runs": runs,
        "wkts": wk,
        "legal": legal,
        "extras": extras,
        "overs": overs,
        "target": tgt.get("runs"),
        "batters": [{"name": n, **v, "pos": i + 1} for i, (n, v) in enumerate(bat.items())],
    }


matches = []
future = collections.defaultdict(lambda: [0.0, 0])  # (overs_left, wkts) -> [sum future runs, n]
for f in sorted(glob.glob(f"{RAW}/*.json")):
    m = json.load(open(f))
    info = m["info"]
    date = info["dates"][0]
    allotted = info.get("overs", 50)
    out = info.get("outcome", {})
    inns = [i for i in m.get("innings", []) if not i.get("super_over")]
    # --- future-runs table: completed, unreduced first innings, 2010+ ---
    if date >= "2010-01-01" and inns and allotted == 50 and "method" not in out and out.get("result") != "no result":
        first = inns[0]
        seq = []
        tot = wk = legal = 0
        for ov in first.get("overs", []):
            for d in ov["deliveries"]:
                ex = d.get("extras", {})
                is_legal = "wides" not in ex and "noballs" not in ex
                if is_legal:
                    seq.append((300 - legal, wk, tot))
                tot += d["runs"]["total"]
                wk += sum(1 for w in d.get("wickets", []) if w["kind"] not in ("retired hurt", "retired not out"))
                if is_legal:
                    legal += 1
        if legal == 300 or wk == 10:
            for balls_left, w, t in seq:
                k = (balls_left + 5) // 6, w
                future[k][0] += tot - t
                future[k][1] += 1
    # --- India / Pakistan matches since Babar's debut ---
    teams = info["teams"]
    if date < START or not (set(teams) & TEAMS):
        continue
    summ = [innings_summary(i, allotted) for i in inns]
    for team in set(teams) & TEAMS:
        opp = [t for t in teams if t != team][0]
        if out.get("winner") == team:
            res = "W"
        elif out.get("winner"):
            res = "L"
        elif out.get("result") == "tie":
            res = "T"
        else:
            res = "NR"
        matches.append({
            "file": pathlib.Path(f).stem,
            "date": date,
            "team": team,
            "opp": opp,
            "tier": "top" if opp in TOP else "other",
            "event": info.get("event", {}).get("name", ""),
            "stage": info.get("event", {}).get("stage", info.get("event", {}).get("match_number", "")),
            "venue": info.get("venue", ""),
            "city": info.get("city", ""),
            "result": res,
            "by": out.get("by", {}),
            "method": out.get("method", ""),
            "eliminator": out.get("eliminator", ""),
            "allotted": allotted,
            "star_played": STAR[team] in info.get("players", {}).get(team, []),
            "other_star_played": STAR.get(opp) in info.get("players", {}).get(opp, []) if opp in STAR else False,
            "innings": summ,
        })

table = {f"{k[0]},{k[1]}": round(v[0] / v[1], 2) for k, v in sorted(future.items()) if v[1] >= 30}
json.dump(matches, open(OUT / "matches.json", "w"), indent=0)
json.dump(table, open(OUT / "future.json", "w"), indent=0)
ind = [x for x in matches if x["team"] == "India"]
pak = [x for x in matches if x["team"] == "Pakistan"]
print(f"India {len(ind)} ODIs (Kohli in {sum(x['star_played'] for x in ind)}), Pakistan {len(pak)} (Babar in {sum(x['star_played'] for x in pak)})")
print("first-innings states in table:", len(table), "e.g. 50 overs/0 wkts:", table.get("50,0"), " 10 overs/3 wkts:", table.get("10,3"))
