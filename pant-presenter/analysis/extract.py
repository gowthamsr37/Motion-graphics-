# Rishabh Pant's Test innings, ball by ball (Cricsheet JSON treated as untrusted input).
import json, glob, collections, csv
RAW = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/raw/tests_male_json"
NAME = "RR Pant"
out = []; bowlers = collections.Counter()
for f in glob.glob(f"{RAW}/*.json"):
    d = json.load(open(f)); info = d["info"]
    if not any(NAME in v for v in info.get("players", {}).values()): continue
    team = next(t for t, v in info["players"].items() if NAME in v)
    opp = next(t for t in info["teams"] if t != team)
    for mi, inn in enumerate(d.get("innings", []), 1):
        if inn.get("team") != team: continue
        balls = []; order = []; kind = None; bowler_out = None
        for ov in inn.get("overs", []):
            for dl in ov["deliveries"]:
                for b in (dl["batter"], dl["non_striker"]):
                    if b not in order: order.append(b)
                if dl["batter"] == NAME:
                    legal = "wides" not in dl.get("extras", {})
                    o = any(w["player_out"] == NAME and w["kind"] not in ("run out",) for w in dl.get("wickets", []))
                    balls.append({"bowler": dl["bowler"], "r": dl["runs"]["batter"], "legal": legal, "out": o, "over": ov["over"], "nb4": dl["runs"].get("non_boundary", False)})
                    bowlers[dl["bowler"]] += 1
                for w in dl.get("wickets", []):
                    if w["player_out"] == NAME: kind = w["kind"]; bowler_out = dl["bowler"]
        if NAME not in order: continue
        out.append({"date": info["dates"][0], "opp": opp, "city": info.get("city", ""), "venue": info.get("venue", ""), "mi": mi, "pos": order.index(NAME) + 1,
                    "balls": balls, "kind": kind, "bowler_out": bowler_out, "runs": sum(b["r"] for b in balls), "result": info.get("outcome", {}).get("winner", "draw"), "file": f.split("/")[-1]})
out.sort(key=lambda x: (x["date"], x["mi"]))
json.dump(out, open("/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/pant/innings.json", "w"))
runs = sum(x["runs"] for x in out); outs = sum(1 for x in out if x["kind"])
print(len({x["file"] for x in out}), "tests", len(out), "inns", runs, "runs", outs, "outs", round(runs / outs, 2), "100s", sum(x["runs"] >= 100 for x in out), "90s", [(x["date"], x["runs"], x["city"]) for x in out if 90 <= x["runs"] < 100])
print("first", out[0]["date"], "last", out[-1]["date"], out[-1]["opp"])
print(len(bowlers), "bowlers faced")
json.dump(bowlers.most_common(), open("/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/pant/bowlers.json", "w"))
