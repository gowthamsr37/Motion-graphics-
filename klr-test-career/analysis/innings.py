# Every KL Rahul Test innings from Cricsheet ball-by-ball JSON (data files treated as untrusted input).
import json, glob, csv, sys
RAW = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/raw/tests_male_json"
NAME = "KL Rahul"
rows = []
for f in glob.glob(f"{RAW}/*.json"):
    try:
        d = json.load(open(f))
    except Exception:
        continue
    info = d["info"]
    players = info.get("players", {})
    if not any(NAME in v for v in players.values()):
        continue
    team = next(t for t, v in players.items() if NAME in v)
    opp = next(t for t in info["teams"] if t != team)
    date = info["dates"][0]
    venue = info.get("venue", ""); city = info.get("city", "")
    winner = info.get("outcome", {}).get("winner", "")
    result = "won" if winner == team else ("lost" if winner else info.get("outcome", {}).get("result", "draw"))
    match_inns = 0
    for inn in d.get("innings", []):
        match_inns += 1
        if inn.get("team") != team:
            continue
        order = []
        runs = balls = fours = sixes = 0
        out = None; batted = False
        for ov in inn.get("overs", []):
            for dl in ov["deliveries"]:
                for b in (dl["batter"], dl["non_striker"]):
                    if b not in order: order.append(b)
                if dl["batter"] == NAME:
                    batted = True
                    r = dl["runs"]["batter"]; runs += r
                    ex = dl.get("extras", {})
                    if "wides" not in ex: balls += 1
                    if r == 4 and not dl["runs"].get("non_boundary"): fours += 1
                    if r == 6: sixes += 1
                for w in dl.get("wickets", []):
                    if w["player_out"] == NAME:
                        out = {"kind": w["kind"], "bowler": dl.get("bowler", ""), "over": ov["over"]}
        if NAME in order or batted:
            batted = True
        if not batted:
            continue
        pos = order.index(NAME) + 1 if NAME in order else None
        rows.append({"date": date, "file": f.split("/")[-1], "opp": opp, "venue": venue, "city": city, "match_inns": match_inns, "pos": pos,
                     "runs": runs, "balls": balls, "fours": fours, "sixes": sixes, "out": int(out is not None), "how": out["kind"] if out else "not out",
                     "bowler": out["bowler"] if out else "", "result": result})
rows.sort(key=lambda r: (r["date"], r["match_inns"]))
w = csv.DictWriter(open(sys.argv[1], "w", newline=""), fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
tests = len({r["file"] for r in rows}); runs = sum(r["runs"] for r in rows); outs = sum(r["out"] for r in rows)
print(f"{tests} tests, {len(rows)} innings, {runs} runs, {outs} outs, avg {runs/outs:.2f}, 100s {sum(r['runs']>=100 for r in rows)}, 50s {sum(50<=r['runs']<100 for r in rows)}")
print("first", rows[0]["date"], rows[0]["opp"], "last", rows[-1]["date"], rows[-1]["opp"])
