# Test innings for Padikkal and Sai Sudharsan (Cricsheet JSON treated as untrusted input).
import json, glob, collections, sys
RAW = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/raw/tests_male_json"
names = collections.Counter()
for f in glob.glob(f"{RAW}/*.json"):
    info = json.load(open(f))["info"]
    for t, ps in info.get("players", {}).items():
        for p in ps:
            if "Padikkal" in p or "Sudharsan" in p: names[p] += 1
print(names)
out = {}
for NAME in names:
    rows = []
    for f in glob.glob(f"{RAW}/*.json"):
        d = json.load(open(f)); info = d["info"]
        if not any(NAME in v for v in info.get("players", {}).values()): continue
        team = next(t for t, v in info["players"].items() if NAME in v)
        opp = next(t for t in info["teams"] if t != team)
        batted_any = False
        for mi, inn in enumerate(d.get("innings", []), 1):
            if inn.get("team") != team: continue
            order = []; r = b = f4 = s6 = 0; kind = None; bowler = None; ent = None; fow_at_entry = 0; wk = 0; team_runs = 0
            for ov in inn.get("overs", []):
                for dl in ov["deliveries"]:
                    for x in (dl["batter"], dl["non_striker"]):
                        if x not in order: order.append(x)
                    if ent is None and NAME in (dl["batter"], dl["non_striker"]): ent = (ov["over"], team_runs, wk)
                    team_runs += dl["runs"]["total"]
                    if dl["batter"] == NAME:
                        r += dl["runs"]["batter"]; b += int("wides" not in dl.get("extras", {}))
                        f4 += int(dl["runs"]["batter"] == 4 and not dl["runs"].get("non_boundary")); s6 += int(dl["runs"]["batter"] == 6)
                    for w in dl.get("wickets", []):
                        wk += 1
                        if w["player_out"] == NAME: kind = w["kind"]; bowler = dl["bowler"]
            if NAME not in order: continue
            batted_any = True
            rows.append({"date": info["dates"][0], "opp": opp, "city": info.get("city") or info.get("venue", ""), "venue": info.get("venue", ""), "mi": mi,
                         "pos": order.index(NAME) + 1, "runs": r, "balls": b, "fours": f4, "sixes": s6, "out": kind is not None, "kind": kind, "bowler": bowler,
                         "entry_over": ent[0] if ent else None, "entry_score": f"{ent[1]}/{ent[2]}" if ent else None, "result": info.get("outcome", {}).get("winner", "draw")})
        if not batted_any:
            rows.append({"date": info["dates"][0], "opp": opp, "city": info.get("city") or "", "dnb": True})
    rows.sort(key=lambda x: (x["date"], x.get("mi", 0)))
    out[NAME] = rows
    bat = [x for x in rows if not x.get("dnb")]
    runs = sum(x["runs"] for x in bat); outs = sum(x["out"] for x in bat); balls = sum(x["balls"] for x in bat)
    print(f"\n== {NAME}: {len({x['date'] for x in rows})} tests, {len(bat)} inns, {runs} runs, avg {runs/max(1,outs):.2f}, SR {100*runs/max(1,balls):.1f}, 100s {sum(x['runs']>=100 for x in bat)}, 50s {sum(50<=x['runs']<100 for x in bat)}")
    for x in rows:
        if x.get("dnb"): print("  ", x["date"], x["opp"], "DNB"); continue
        print("  ", x["date"], x["opp"][:12], x["city"][:12], "inn", x["mi"], "pos", x["pos"], f"{x['runs']}({x['balls']})", x["kind"], x["bowler"], "entry", x["entry_score"], "ov", x["entry_over"])
json.dump(out, open("/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/padikkal/innings.json", "w"), indent=1)
