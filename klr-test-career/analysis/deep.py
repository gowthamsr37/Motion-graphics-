# Ball-level KL Rahul Test analysis (Cricsheet JSON treated as untrusted input).
import json, glob, collections, statistics
RAW = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/raw/tests_male_json"
NAME = "KL Rahul"
HOME = {"Chennai","Bengaluru","Bangalore","Kolkata","Delhi","Mumbai","Pune","Ranchi","Dharamsala","Nagpur","Hyderabad","Rajkot","Visakhapatnam","Mohali","Indore","Kanpur","Ahmedabad","Guwahati","Lucknow","Chandigarh"}
inns = []
for f in glob.glob(f"{RAW}/*.json"):
    d = json.load(open(f)); info = d["info"]
    if not any(NAME in v for v in info.get("players", {}).values()): continue
    team = next(t for t, v in info["players"].items() if NAME in v)
    date = info["dates"][0]; city = info.get("city", ""); venue = info.get("venue", "")
    home = city in HOME or any(k in venue for k in ["Chinnaswamy","Wankhede","Eden","Feroz","Jaitley","Punjab","Narendra","Holkar","Green Park","Rajiv Gandhi","Saurashtra","Vidarbha","Maharashtra","JSCA","Himachal","Barsapara","Chidambaram"])
    for mi, inn in enumerate(d.get("innings", []), 1):
        if inn.get("team") != team: continue
        balls = []  # his legal balls: (team_over, runs, out)
        part = collections.defaultdict(int)  # partner -> runs scored while together (opening stand only)
        opening = None; wk_fallen = 0; stand_runs = 0; first_pair = None
        out_kind = None; present = False; order = []
        for ov in inn.get("overs", []):
            for dl in ov["deliveries"]:
                for b in (dl["batter"], dl["non_striker"]):
                    if b not in order: order.append(b)
                if first_pair is None: first_pair = {dl["batter"], dl["non_striker"]}
                if wk_fallen == 0: stand_runs += dl["runs"]["total"]
                if dl["batter"] == NAME:
                    present = True
                    legal = "wides" not in dl.get("extras", {})
                    o = any(w["player_out"] == NAME for w in dl.get("wickets", []))
                    if legal or o: balls.append((ov["over"], dl["runs"]["batter"], o, legal))
                for w in dl.get("wickets", []):
                    if w["player_out"] == NAME: out_kind = w["kind"]
                    wk_fallen += 1
        if NAME not in order: continue
        pos = order.index(NAME) + 1
        partner = next(iter(first_pair - {NAME}), None) if first_pair and NAME in first_pair else None
        inns.append({"date": date, "match_inn": mi, "home": home, "pos": pos, "balls": balls, "out": out_kind is not None, "kind": out_kind,
                     "runs": sum(b[1] for b in balls), "legal": sum(1 for b in balls if b[3]), "partner": partner, "stand": stand_runs if partner else None})
inns.sort(key=lambda x: (x["date"], x["match_inn"]))
# manual: Afghanistan 2018 (54 off 64, b), Afghanistan 2026 (100 off ~165), Wellington today (136 off 290, b) -- no ball detail
extra = [{"date": "2018-06-14", "runs": 54, "legal": 64, "out": True, "home": True, "pos": 3, "match_inn": 1},
         {"date": "2026-06-06", "runs": 100, "legal": 165, "out": True, "home": True, "pos": 2, "match_inn": 1},
         {"date": "2026-11-19", "runs": 136, "legal": 290, "out": True, "home": False, "pos": 1, "match_inn": 2}]
allx = inns + extra
def era(a, b): return [x for x in allx if a <= x["date"] < b]
def summ(rows):
    r = sum(x["runs"] for x in rows); b = sum(x["legal"] for x in rows); o = sum(x["out"] for x in rows)
    return {"n": len(rows), "runs": r, "balls": b, "outs": o, "avg": round(r / o, 1), "bpd": round(b / o, 1), "sr": round(100 * r / b, 1), "bpi": round(b / len(rows), 1)}
E = {"2014-17": era("2014", "2018"), "2018-19": era("2018", "2020"), "2021-24": era("2021", "2025-06"), "2025-26": era("2025-06", "2027")}
print("== balls per dismissal / strike rate by era ==")
for k, v in E.items(): print(k, summ(v))
print("career", summ(allx))
# the start: dismissed within first N balls (ball-level innings only)
print("== the first balls ==")
for k, v in {**E, "career": allx}.items():
    bl = [x for x in v if "balls" in x]
    early20 = sum(1 for x in bl if x["out"] and x["legal"] <= 20) / len(bl)
    early10 = sum(1 for x in bl if x["out"] and x["legal"] <= 10) / len(bl)
    print(k, f"out within 10 balls {early10:.0%}, within 20 balls {early20:.0%}  (n={len(bl)})")
# average once set: innings that reached 30 balls, runs scored after ball 30 / dismissals after ball 30
bl = [x for x in allx if "balls" in x]
def after(rows, k):
    runs = outs = 0; n = 0
    for x in rows:
        if x["legal"] < k: continue
        n += 1; seen = 0
        for (ov, r, o, legal) in x["balls"]:
            if seen >= k: runs += r; outs += int(o)
            if legal: seen += 1
    return n, runs, outs, round(runs / outs, 1) if outs else None
for k in (0, 10, 20, 30, 50):
    print(f"from ball {k}: innings {after(bl,k)[0]}, runs {after(bl,k)[1]}, outs {after(bl,k)[2]}, avg {after(bl,k)[3]}")
# first-20-ball survival rate and outcome
surv = [x for x in bl if x["legal"] >= 20 or not x["out"]]
died = [x for x in bl if x["out"] and x["legal"] < 20]
print("dismissed before 20 balls:", len(died), "of", len(bl), f"{len(died)/len(bl):.0%}", "| their total runs", sum(x["runs"] for x in died))
# new ball: as opener, runs and dismissals in team overs 0-19 vs 20+
op = [x for x in bl if x["pos"] in (1, 2)]
nb = {"r": 0, "b": 0, "o": 0}; ob = {"r": 0, "b": 0, "o": 0}
for x in op:
    for (ov, r, o, legal) in x["balls"]:
        t = nb if ov < 20 else ob
        t["r"] += r; t["b"] += int(legal); t["o"] += int(o)
print("== new ball (opener) ==", "overs 1-20:", nb, "avg", round(nb["r"] / nb["o"], 1), "| overs 21+:", ob, "avg", round(ob["r"] / ob["o"], 1))
for k, v in E.items():
    nb = {"r": 0, "b": 0, "o": 0}
    for x in v:
        if "balls" not in x or x["pos"] not in (1, 2): continue
        for (ov, r, o, legal) in x["balls"]:
            if ov < 20: nb["r"] += r; nb["b"] += int(legal); nb["o"] += int(o)
    print("  new-ball", k, nb, "avg", round(nb["r"] / nb["o"], 1) if nb["o"] else None, "balls/out", round(nb["b"] / nb["o"], 1) if nb["o"] else None)
# conversion: 50+ scores turned into 100s, home v away, by era
print("== conversion ==")
for k, v in {"home": [x for x in allx if x["home"]], "away": [x for x in allx if not x["home"]], **E}.items():
    f = sum(50 <= x["runs"] < 100 for x in v); h = sum(x["runs"] >= 100 for x in v)
    print(k, f"{h} of {h+f} fifty-plus scores became hundreds ({h/(h+f):.0%})" if h + f else "-")
# innings of the match
print("== match innings ==")
for mi in (1, 2, 3, 4):
    v = [x for x in allx if x["match_inn"] == mi]
    r = sum(x["runs"] for x in v); o = sum(x["out"] for x in v)
    print(mi, len(v), "inns", r, "runs", "avg", round(r / o, 1) if o else None, "100s", sum(x["runs"] >= 100 for x in v))
# first vs second innings of HIS team (1st/2nd match inn vs 3rd/4th)
v1 = [x for x in allx if x["match_inn"] in (1, 2)]; v2 = [x for x in allx if x["match_inn"] in (3, 4)]
for nm, v in (("team 1st inns", v1), ("team 2nd inns", v2)):
    r = sum(x["runs"] for x in v); o = sum(x["out"] for x in v); print(nm, len(v), r, round(r / o, 1), "100s", sum(x["runs"] >= 100 for x in v))
# opening partners
print("== opening stands by partner ==")
ps = collections.defaultdict(list)
for x in inns:
    if x.get("partner") and x["pos"] in (1, 2): ps[x["partner"]].append(x["stand"])
for p, v in sorted(ps.items(), key=lambda kv: -len(kv[1])):
    print(p, len(v), "stands, avg", round(statistics.mean(v), 1), "50+ stands", sum(s >= 50 for s in v), "100+", sum(s >= 100 for s in v), "best", max(v))
# hundreds: balls faced
print("hundreds balls:", [(x["date"], x["runs"], x["legal"]) for x in allx if x["runs"] >= 100])

# ---- exact figures for the reel ----
out = {}
def early(rows): return [bool(x["out"] and x["legal"] < 20) if "balls" in x else False for x in rows]
out["dots"] = {k: early(v) for k, v in E.items()}
pre = E["2014-17"] + E["2018-19"]
out["pre2020_early"] = [sum(early(pre)), len(pre)]
out["since_leeds_early"] = [sum(early(E["2025-26"])), len(E["2025-26"])]
out["since_leeds_early_case"] = [(x["date"], x["runs"], x["legal"]) for x in E["2025-26"] if "balls" in x and x["out"] and x["legal"] < 20]
out["eras"] = {k: summ(v) for k, v in E.items()}
nb = {}
for k, v in {"2014-17": E["2014-17"], "2018-24": E["2018-19"] + E["2021-24"], "2025-26": E["2025-26"], "2018-19": E["2018-19"], "2021-24": E["2021-24"]}.items():
    t = {"r": 0, "b": 0, "o": 0}
    for x in v:
        if "balls" not in x or x["pos"] not in (1, 2): continue
        for (ov, r, o, legal) in x["balls"]:
            if ov < 20: t["r"] += r; t["b"] += int(legal); t["o"] += int(o)
    nb[k] = {**t, "avg": round(t["r"] / t["o"], 1)}
out["newball"] = nb
json.dump(out, open("/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/klr/deep.json", "w"), indent=1)
print(json.dumps({k: v for k, v in out.items() if k != "dots"}, indent=1)); print({k: (sum(v), len(v)) for k, v in out["dots"].items()})
