# Build a tidy match table from Cricsheet JSON "info" blocks (data files are treated as untrusted input).
import json, glob, os, csv, sys
RAW = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/raw"
FULL = {"Afghanistan", "Australia", "Bangladesh", "England", "India", "Ireland", "New Zealand", "Pakistan", "South Africa", "Sri Lanka", "West Indies", "Zimbabwe"}
rows = []
for comp, folder in [("TEST", "tests_male_json"), ("ODI", "odis_male_json"), ("T20I", "t20s_male_json"), ("IPL", "ipl_male_json")]:
    for f in glob.glob(f"{RAW}/{folder}/*.json"):
        try:
            info = json.load(open(f))["info"]
        except Exception:
            continue
        toss = info.get("toss", {}); out = info.get("outcome", {})
        teams = info.get("teams", [])
        if len(teams) != 2 or "winner" not in toss: continue
        winner = out.get("winner")
        result = "win" if winner else (out.get("result") or "unknown")  # draw / tie / no result
        if out.get("eliminator"): result = "tie"  # super over / bowl-out decided: treat as a tie
        date = (info.get("dates") or [""])[0]
        rows.append({
            "comp": comp, "date": date, "year": date[:4], "season": str(info.get("season", "")),
            "team1": teams[0], "team2": teams[1], "full_members": int(set(teams) <= FULL),
            "toss_winner": toss["winner"], "decision": toss.get("decision", ""),
            "winner": winner or "", "result": result, "method": out.get("method", ""),
            "venue": info.get("venue", ""), "city": info.get("city", ""), "event": (info.get("event") or {}).get("name", ""),
            "match_number": (info.get("event") or {}).get("match_number", ""), "stage": (info.get("event") or {}).get("stage", ""),
            "overs": info.get("overs", ""),
        })
w = csv.DictWriter(open(sys.argv[1], "w", newline=""), fieldnames=list(rows[0].keys()))
w.writeheader(); w.writerows(rows)
print(len(rows), "matches written")
