"""Rishabh Pant's impact on a Test, from Cricsheet ball-by-ball JSON (treated as untrusted input).

For every Pant innings: the score when he walked in, India's scoring rate while he was at the crease v the rest of the innings,
and the match result. Plus a baseline strike rate for all Test batters (positions 1-7) over the same years.
Usage: python3 analysis/impact.py <tests_male_json dir>      -> analysis/impact.json
"""
import collections
import glob
import json
import pathlib
import sys

RAW = sys.argv[1]
NAME = "RR Pant"
FIRST = "2018-08-18"
HERE = pathlib.Path(__file__).resolve().parent

inns_out = []
base_r = base_b = 0
for f in sorted(glob.glob(f"{RAW}/*.json")):
    d = json.load(open(f))
    info = d["info"]
    date = info["dates"][0]
    if date < FIRST:
        continue
    # baseline: every batter in positions 1-7, all Tests since Pant's debut
    for inn in d.get("innings", []):
        order = []
        for ov in inn.get("overs", []):
            for dl in ov["deliveries"]:
                for b in (dl["batter"], dl["non_striker"]):
                    if b not in order:
                        order.append(b)
                if order.index(dl["batter"]) < 7 and "wides" not in dl.get("extras", {}):
                    base_r += dl["runs"]["batter"]
                    base_b += 1
    if not any(NAME in v for v in info.get("players", {}).values()):
        continue
    team = next(t for t, v in info["players"].items() if NAME in v)
    winner = info.get("outcome", {}).get("winner")
    res = "W" if winner == team else ("L" if winner else "D")
    for mi, inn in enumerate(d.get("innings", []), 1):
        if inn.get("team") != team:
            continue
        score = wk = 0
        arrived = None
        gone = False
        with_r = with_b = wo_r = wo_b = 0
        pr = pb = 0
        sixes = 0
        for ov in inn.get("overs", []):
            for dl in ov["deliveries"]:
                legal = "wides" not in dl.get("extras", {}) and "noballs" not in dl.get("extras", {})
                involved = NAME in (dl["batter"], dl["non_striker"])
                if involved and arrived is None:
                    arrived = (score, wk)
                at_crease = arrived is not None and not gone and involved
                if at_crease:
                    with_r += dl["runs"]["total"]
                    with_b += legal
                else:
                    wo_r += dl["runs"]["total"]
                    wo_b += legal
                if dl["batter"] == NAME:
                    pr += dl["runs"]["batter"]
                    pb += "wides" not in dl.get("extras", {})
                    sixes += dl["runs"]["batter"] == 6 and not dl["runs"].get("non_boundary", False)
                score += dl["runs"]["total"]
                for w in dl.get("wickets", []):
                    if w["kind"] not in ("retired hurt", "retired not out"):
                        wk += 1
                    if w["player_out"] == NAME:
                        gone = True
        if arrived is None:
            continue
        inns_out.append({"date": date, "opp": next(t for t in info["teams"] if t != team), "city": info.get("city", ""), "mi": mi,
                         "arrive": arrived, "final": [score, wk], "runs": pr, "balls": pb, "sixes": sixes, "out": gone,
                         "with": [with_r, with_b], "without": [wo_r, wo_b], "result": res, "file": pathlib.Path(f).stem})

inns_out.sort(key=lambda x: (x["date"], x["mi"]))
W = [sum(x["with"][0] for x in inns_out), sum(x["with"][1] for x in inns_out)]
WO = [sum(x["without"][0] for x in inns_out), sum(x["without"][1] for x in inns_out)]
pr = sum(x["runs"] for x in inns_out); pb = sum(x["balls"] for x in inns_out)
base_sr = 100 * base_r / base_b

# results by Test: did Pant make 50+ in the match?
tests = collections.OrderedDict()
for x in inns_out:
    t = tests.setdefault(x["file"], {"date": x["date"], "opp": x["opp"], "result": x["result"], "best": 0})
    t["best"] = max(t["best"], x["runs"])
def wdl(ts):
    c = collections.Counter(t["result"] for t in ts)
    return {"W": c["W"], "D": c["D"], "L": c["L"], "n": len(ts), "win_pct": round(100 * c["W"] / max(1, len(ts)), 1)}
fifty = [t for t in tests.values() if t["best"] >= 50]
rest = [t for t in tests.values() if t["best"] < 50]

# rescue acts: walked in with 4+ down and fewer than 150 on the board
rescues = [x for x in inns_out if x["arrive"][1] >= 4 and x["arrive"][0] < 150]
out = {
    "innings": len(inns_out), "tests": len(tests), "last": inns_out[-1]["date"],
    "pant_sr": round(100 * pr / pb, 1), "base_sr_top7": round(base_sr, 1),
    "rr_with": round(6 * W[0] / W[1], 2), "rr_without": round(6 * WO[0] / WO[1], 2),
    "balls_saved_vs_base": round(pr / (base_sr / 100) - pb), "overs_saved_vs_base": round((pr / (base_sr / 100) - pb) / 6),
    "arrive_avg": [round(sum(x["arrive"][0] for x in inns_out) / len(inns_out)), round(sum(x["arrive"][1] for x in inns_out) / len(inns_out), 1)],
    "results_50plus": wdl(fifty), "results_other": wdl(rest),
    "rescues": {"n": len(rescues), "runs": sum(x["runs"] for x in rescues), "balls": sum(x["balls"] for x in rescues),
                "outs": sum(x["out"] for x in rescues), "list": [(x["date"], x["city"], x["opp"], x["arrive"], x["runs"], x["balls"], x["final"], x["result"]) for x in rescues if x["runs"] >= 50]},
    "key": [(x["date"], x["city"], x["mi"], x["arrive"], x["runs"], x["balls"], x["sixes"], x["final"], x["result"]) for x in inns_out if x["runs"] >= 85],
}
json.dump(out, open(HERE / "impact.json", "w"), indent=1)
print(json.dumps({k: v for k, v in out.items() if k not in ("rescues", "key")}, indent=1))
print("rescues", out["rescues"]["n"], "runs", out["rescues"]["runs"], "SR", round(100 * out["rescues"]["runs"] / out["rescues"]["balls"], 1), "avg", round(out["rescues"]["runs"] / max(1, out["rescues"]["outs"]), 1))
for r in out["rescues"]["list"]:
    print("   rescue", r)
for r in out["key"]:
    print("   key", r)
