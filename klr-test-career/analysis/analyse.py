import csv, json, collections, statistics
D = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/klr/"
r = list(csv.DictReader(open(D + "klr_innings.csv")))
for x in r:
    for k in ("runs", "balls", "out", "pos", "match_inns", "fours", "sixes"):
        x[k] = int(x[k]) if x[k] not in ("", None) else None
HOME_CITIES = {"Chennai","Bengaluru","Bangalore","Kolkata","Delhi","Mumbai","Pune","Ranchi","Dharamsala","Nagpur","Hyderabad","Rajkot","Visakhapatnam","Mohali","Indore","Kanpur","Ahmedabad","Guwahati","Lucknow","Dharmasala","Chandigarh"}
for x in r:
    x["home"] = x["city"] in HOME_CITIES or (x["venue"] and any(c in x["venue"] for c in ["Chinnaswamy","Wankhede","Eden","Feroz","Arun Jaitley","Punjab","Narendra","Holkar","Green Park","Rajiv Gandhi","Saurashtra","Vidarbha","Maharashtra","JSCA","Himachal","Barsapara","Visakhapatnam","Chidambaram"]))
# manual additions (Afghanistan matches withheld by Cricsheet; today's innings)
r.append({"date": "2018-06-14", "opp": "Afghanistan", "city": "Bengaluru", "venue": "M Chinnaswamy Stadium", "match_inns": 1, "pos": 3, "runs": 54, "balls": 64, "out": 1, "how": "bowled", "bowler": "Yamin Ahmadzai", "result": "won", "home": True, "file": "afg2018", "fours": 8, "sixes": 0})
r.append({"date": "2026-06-06", "opp": "Afghanistan", "city": "New Chandigarh", "venue": "Mullanpur", "match_inns": 1, "pos": 2, "runs": 100, "balls": None, "out": 1, "how": "out", "bowler": "", "result": "won", "home": True, "file": "afg2026", "fours": None, "sixes": None})
r.append({"date": "2026-11-19", "opp": "New Zealand", "city": "Wellington", "venue": "Basin Reserve", "match_inns": 2, "pos": 1, "runs": 136, "balls": 290, "out": 1, "how": "bowled", "bowler": "Nathan Smith", "result": "", "home": False, "file": "nz2026", "fours": 9, "sixes": 2})
r.sort(key=lambda x: (x["date"], x["match_inns"]))
def agg(rows):
    runs = sum(x["runs"] for x in rows); outs = sum(x["out"] for x in rows)
    return {"inns": len(rows), "runs": runs, "outs": outs, "avg": round(runs / outs, 2) if outs else None, "100s": sum(x["runs"] >= 100 for x in rows), "50s": sum(50 <= x["runs"] < 100 for x in rows), "ducks": sum(x["runs"] == 0 and x["out"] for x in rows)}
out = {}
out["career"] = agg(r); out["career"]["tests"] = len({x["file"] for x in r}) + 1  # +1: Trinidad 2016, picked but did not bat
out["home"] = agg([x for x in r if x["home"]]); out["away"] = agg([x for x in r if not x["home"]])
SENA = {"Australia","England","South Africa","New Zealand"}
def host(x):
    if x["home"]: return "India"
    c = x["city"]; v = x["venue"]
    m = {"Sydney":"Australia","Melbourne":"Australia","Adelaide":"Australia","Perth":"Australia","Brisbane":"Australia","London":"England","Nottingham":"England","Birmingham":"England","Southampton":"England","Leeds":"England","Manchester":"England","Centurion":"South Africa","Johannesburg":"South Africa","Cape Town":"South Africa","Wellington":"New Zealand","Colombo":"Sri Lanka","Galle":"Sri Lanka","Pallekele":"Sri Lanka","Kandy":"Sri Lanka","Jamaica":"West Indies","Kingston":"West Indies","St Lucia":"West Indies","Gros Islet":"West Indies","Trinidad":"West Indies","North Sound":"West Indies","Antigua":"West Indies","Basseterre":"West Indies","Chattogram":"Bangladesh","Dhaka":"Bangladesh","Mirpur":"Bangladesh","Chittagong":"Bangladesh"}
    if c in m: return m[c]
    if "Galle" in v or "Sinhalese" in v or "Saravanamuttu" in v or "Pallekele" in v: return "Sri Lanka"
    if "Sydney" in v or "Gabba" in v or "Adelaide" in v or "Melbourne" in v or "Perth" in v: return "Australia"
    if "Shere Bangla" in v or "Zahur" in v: return "Bangladesh"
    if "Sabina" in v or "Daren Sammy" in v or "Queen's Park" in v or "Sir Vivian" in v: return "West Indies"
    return "?" + c + "|" + v
for x in r: x["host"] = host(x)
out["by_host"] = {h: agg([x for x in r if x["host"] == h]) for h in sorted({x["host"] for x in r})}
out["sena"] = agg([x for x in r if x["host"] in SENA])
out["opening"] = agg([x for x in r if x["pos"] in (1, 2)]); out["middle"] = agg([x for x in r if x["pos"] and x["pos"] >= 3])
out["by_year"] = {y: agg([x for x in r if x["date"][:4] == y]) for y in sorted({x["date"][:4] for x in r})}
# streak of consecutive 50+ innings
best = cur = 0; s_end = None; seq = []
for i, x in enumerate(r):
    cur = cur + 1 if x["runs"] >= 50 else 0
    if cur > best: best, s_end = cur, i
out["streak50"] = {"len": best, "innings": [(r[j]["date"], r[j]["city"], r[j]["runs"]) for j in range(s_end - best + 1, s_end + 1)]}
# hundreds list
out["hundreds"] = [(x["date"], x["opp"], x["host"], x["city"], x["runs"], x["balls"]) for x in r if x["runs"] >= 100]
# eras
def era(a, b): return agg([x for x in r if a <= x["date"] < b])
out["eras"] = {
    "2014-17 rise": era("2014-01-01", "2018-01-01"),
    "2018-19 slump": era("2018-01-01", "2019-12-31"),
    "2021-22 comeback": era("2021-01-01", "2023-01-01"),
    "2023-24 middle order": era("2023-01-01", "2024-11-01"),
    "since Perth 2024": era("2024-11-01", "2027-01-01"),
    "since Leeds 2025": era("2025-06-01", "2027-01-01"),
}
slump = [x for x in r if "2018-08-01" <= x["date"] < "2019-12-31"]
out["slump_detail"] = {"from": slump[0]["date"], "to": slump[-1]["date"], **agg(slump), "without_149": agg([x for x in slump if x["runs"] != 149]), "below20": sum(x["runs"] < 20 for x in slump)}
last19 = max(x["date"] for x in r if x["date"] < "2021-01-01"); first21 = min(x["date"] for x in r if x["date"] >= "2020-01-01")
out["gap"] = {"last_before": last19, "return": first21}
out["dismissals"] = collections.Counter(x["how"] for x in r if x["out"]).most_common()
out["bowlers"] = collections.Counter(x["bowler"] for x in r if x["out"] and x["bowler"]).most_common(6)
out["first_test"] = [(x["date"], x["city"], x["runs"], x["how"]) for x in r[:4]]
out["nineties"] = [(x["date"], x["city"], x["runs"]) for x in r if 90 <= x["runs"] < 100]
# rolling 10-innings average for the timeline chart
seqout = []
for i, x in enumerate(r):
    w = r[max(0, i - 9): i + 1]
    o = sum(y["out"] for y in w)
    seqout.append({"i": i, "date": x["date"], "runs": x["runs"], "out": x["out"], "home": x["home"], "host": x["host"], "pos": x["pos"], "roll": round(sum(y["runs"] for y in w) / o, 1) if o else None})
json.dump(seqout, open(D + "series.json", "w"))
json.dump(out, open(D + "summary.json", "w"), indent=1, default=str)
for k, v in out.items():
    print(k, ":", v if not isinstance(v, dict) or len(str(v)) < 300 else json.dumps(v, default=str)[:900])
