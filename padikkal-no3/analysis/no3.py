# India's No.3s in Tests: Pujara benchmark and everyone since his last Test (June 2023).
import json, glob, collections
RAW = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/raw/tests_male_json"
rows = []
for f in glob.glob(f"{RAW}/*.json"):
    d = json.load(open(f)); info = d["info"]
    if "India" not in info.get("teams", []): continue
    for mi, inn in enumerate(d.get("innings", []), 1):
        if inn.get("team") != "India": continue
        order = []; sc = collections.Counter(); bl = collections.Counter(); outs = set()
        for ov in inn.get("overs", []):
            for dl in ov["deliveries"]:
                for x in (dl["batter"], dl["non_striker"]):
                    if x not in order: order.append(x)
                sc[dl["batter"]] += dl["runs"]["batter"]; bl[dl["batter"]] += int("wides" not in dl.get("extras", {}))
                for w in dl.get("wickets", []): outs.add(w["player_out"])
        if len(order) >= 3:
            p = order[2]
            rows.append({"date": info["dates"][0], "player": p, "runs": sc[p], "balls": bl[p], "out": p in outs})
def agg(rs):
    r = sum(x["runs"] for x in rs); o = sum(x["out"] for x in rs); b = sum(x["balls"] for x in rs)
    return {"inns": len(rs), "runs": r, "outs": o, "avg": round(r / o, 1) if o else None, "100s": sum(x["runs"] >= 100 for x in rs), "50s": sum(50 <= x["runs"] < 100 for x in rs), "bpd": round(b / o, 1) if o else None}
puj = [x for x in rows if x["player"] == "CA Pujara"]
print("Pujara at No.3:", agg(puj), puj[0]["date"], puj[-1]["date"])
last_puj = max(x["date"] for x in puj)
since = [x for x in rows if x["date"] > last_puj]
print("since Pujara's last Test", last_puj, ":", agg(since))
by = collections.defaultdict(list)
for x in since: by[x["player"]].append(x)
for p, v in sorted(by.items(), key=lambda kv: -len(kv[1])): print(f"  {p:20}", agg(v), v[0]["date"], "→", v[-1]["date"])
# Padikkal first six innings at 3 v Pujara's first six at 3, Dravid partial (data from 2002)
print("Pujara first 6 at 3:", agg(puj[:6]))
drv = [x for x in rows if x["player"] == "R Dravid"]
print("Dravid at 3 (Dec 2001 on):", agg(drv))
print("Gill at 3:", agg([x for x in rows if x["player"] == "Shubman Gill"]))

# ---- exact figures for the reel ----
out = {}
pad3 = [x for x in since if x["player"] == "D Padikkal"]
others = [x for x in since if x["player"] != "D Padikkal"]
def full(rs, extra_runs=0, extra_outs=0, extra_balls=0, extra_inns=0):
    r = sum(x["runs"] for x in rs) + extra_runs; o = sum(x["out"] for x in rs) + extra_outs; b = sum(x["balls"] for x in rs) + extra_balls
    return {"inns": len(rs) + extra_inns, "runs": r, "outs": o, "avg": round(r / o, 1), "balls": b, "bpd": round(b / o, 1), "sr": round(100 * r / b, 1) if b else None}
out["padikkal_at3_incl_wellington"] = full(pad3, 80, 1, 175, 1)
out["others_since_pujara_runs_avg_incl_afg81"] = full(others, 81, 1, 0, 1)
out["others_since_pujara_bpd_ballbyball"] = full(others)
pj = sorted(puj, key=lambda x: x["date"])
out["pujara_at3"] = full(pj)
out["players_tried"] = sorted({x["player"] for x in since})
per = {}
for p in out["players_tried"]:
    v = [x for x in since if x["player"] == p]
    per[p] = full(v)
per["B Sai Sudharsan"] = full([x for x in since if x["player"] == "B Sai Sudharsan"], 81, 1, 0, 1)
per["D Padikkal"] = out["padikkal_at3_incl_wellington"]
out["per_player"] = per
json.dump(out, open("/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/padikkal/no3.json", "w"), indent=1)
print(json.dumps(out, indent=1))
