"""Collect every number the reel shows into src/data.json (run after sim.py)."""
import json
import pathlib

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
M = json.load(open(HERE / "matches.json"))
S = json.load(open(HERE / "sim.json"))
F = {tuple(map(int, k.split(","))): v for k, v in json.load(open(HERE / "future.json")).items()}
STAR = {"India": "V Kohli", "Pakistan": "Babar Azam"}


def innings_of(player, team):
    out = []
    for m in M:
        if m["team"] != team:
            continue
        for i, inn in enumerate(m["innings"][:2]):
            if inn["team"] != team:
                continue
            for b in inn["batters"]:
                if b["name"] == player:
                    out.append({"role": i, "tier": m["tier"], "r": b["r"], "b": b["b"], "out": b["out"], "date": m["date"], "opp": m["opp"]})
    return out


def line(inns):
    r = sum(x["r"] for x in inns); o = sum(x["out"] for x in inns); b = sum(x["b"] for x in inns)
    return {"inns": len(inns), "runs": r, "avg": round(r / o, 1), "sr": round(100 * r / b, 1), "hundreds": sum(x["r"] >= 100 for x in inns), "fifties_plus": sum(x["r"] >= 50 for x in inns)}


tape = {}
for team, p in STAR.items():
    inns = innings_of(p, team)
    tape[p] = {"all": line(inns), "first": line([x for x in inns if x["role"] == 0]), "chasing": line([x for x in inns if x["role"] == 1])}

# --- Mohali 2016, the worked example ---
mo = next(m for m in M if m["team"] == "India" and m["date"] == "2016-10-23")
ind = mo["innings"][1]
k = next(b for b in ind["batters"] if b["name"] == "V Kohli")
others_runs = ind["runs"] - ind["extras"] - k["r"]
others_balls = ind["legal"] - k["b"]
r_o = others_runs / others_balls
overs_left = int(np.ceil((ind["overs"] * 6 - ind["legal"]) / 6))
pot = ind["runs"] + F[(overs_left, ind["wkts"])] * 1.0
babar_chase_top = [x for x in innings_of("Babar Azam", "Pakistan") if x["role"] == 1 and x["tier"] == "top"]
med = sorted(babar_chase_top, key=lambda x: x["r"])[len(babar_chase_top) // 2]
new_total = pot - k["r"] + med["r"] - (med["b"] - k["b"]) * r_o
rng = np.random.default_rng(56)
flicks = [babar_chase_top[i] for i in rng.choice(len(babar_chase_top), 7, replace=False)]
mohali_row = next(r for r in S["matches"] if r["key"].startswith(mo["file"]) and r["team"] == "India")
mohali = {
    "target": ind["target"] or mo["innings"][0]["runs"] + 1, "nz": mo["innings"][0]["runs"], "india": ind["runs"], "wkts": ind["wkts"],
    "legal": ind["legal"], "kohli": {"r": k["r"], "b": k["b"]}, "others": {"r": others_runs, "b": others_balls, "rpb": round(r_o, 2)},
    "extras": ind["extras"], "potential": round(pot), "in_hand": round(pot - ind["runs"]),
    "babar_pool": len(babar_chase_top), "flicks": [{"r": x["r"], "b": x["b"], "opp": x["opp"], "year": x["date"][:4]} for x in flicks],
    "landed": {"r": med["r"], "b": med["b"], "opp": med["opp"], "year": med["date"][:4]},
    "extra_balls": others_balls and (k["b"] - med["b"]), "extra_runs": round((k["b"] - med["b"]) * r_o),
    "new_total": round(new_total), "p_swap": mohali_row["p_swap"],
}

T = S["teams"]
door_keys = {"colombo": ("Pakistan", "2023-09-14"), "chennai": ("Pakistan", "2023-10-27"), "manchester": ("India", "2019-07-09")}
doors = {}
for name, (team, date) in door_keys.items():
    r = next(x for x in S["matches"] if x["team"] == team and x["date"] == date)
    doors[name] = {k2: r[k2] for k2 in ("date", "team", "opp", "event", "stage", "venue", "score", "result", "by", "method", "star", "p_swap", "p_base")}

data = {
    "window": "31 May 2015 – 2 Nov 2026",
    "tape": tape,
    "control": {t: {"matches": T[t]["matches"], "actual": T[t]["actual_wins"], "base": T[t]["base_wins_mean"], "swap": T[t]["swap_wins_mean"], "effect": T[t]["effect_mean"],
                    "range": [T[t]["effect_p10"], T[t]["effect_p90"]], "p_sign": T[t]["p_effect_sign"],
                    "first": T[t]["batting_first"], "chasing": T[t]["chasing"]} for t in T},
    "margins": [{"t": r["team"][0], "m": min(r["margin_runs"], 240)} for r in S["matches"]],
    "close13": S["all_close_13"],
    "n_matches": S["all_matches"],
    "mohali": mohali,
    "doors": doors,
    "h2h": [{"date": r["date"], "event": r["event"], "stage": r["stage"], "venue": r["venue"], "score": r["score"], "result": r["result"], "p_swap": r["p_swap"],
             "kohli": r["star"], "babar": r["opp_star"]} for r in S["h2h"]["matches"]],
}
json.dump(data, open(HERE.parent / "src" / "data.json", "w"), indent=1)
print(json.dumps({k: data[k] for k in ("tape", "control", "close13", "n_matches", "mohali")}, indent=1)[:3500])
for k2, v in doors.items():
    print(k2, v["date"], v["score"], v["result"], v["star"], v["p_swap"], v["p_base"])
