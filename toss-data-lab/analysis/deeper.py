import csv, collections, math, json, statistics
rows = list(csv.DictReader(open("matches.csv")))
def ci(k, n):
    p = k / n; z = 1.96; d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d; h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return (round(100 * (c - h), 1), round(100 * (c + h), 1))
out = json.load(open("summary.json"))
# 4. trends: % of toss winners choosing to field, and chasing-team win %, by era
def bat1(r): return r["toss_winner"] if r["decision"] == "bat" else (r["team2"] if r["toss_winner"] == r["team1"] else r["team1"])
eras = {"IPL": [("2008-12", 2008, 2012), ("2013-17", 2013, 2017), ("2018-22", 2018, 2022), ("2023-26", 2023, 2026)],
        "T20I": [("2005-12", 2005, 2012), ("2013-17", 2013, 2017), ("2018-22", 2018, 2022), ("2023-26", 2023, 2026)],
        "ODI": [("2002-07", 2002, 2007), ("2008-13", 2008, 2013), ("2014-19", 2014, 2019), ("2020-26", 2020, 2026)]}
out["trends"] = {}
print("== 4. trends ==")
for comp, es in eras.items():
    out["trends"][comp] = []
    for label, a, b in es:
        sub = [r for r in rows if r["comp"] == comp and a <= int(r["year"] or 0) <= b and (comp != "T20I" or r["full_members"] == "1")]
        field = sum(1 for r in sub if r["decision"] == "field"); n = len(sub)
        dec = [r for r in sub if r["result"] == "win"]
        tw = sum(1 for r in dec if r["winner"] == r["toss_winner"])
        dl = [r for r in dec if r["method"] == ""]
        ch = sum(1 for r in dl if r["winner"] != bat1(r))
        row = {"era": label, "n": n, "field_pct": round(100 * field / n, 1), "toss_win_pct": round(100 * tw / len(dec), 1), "chase_win_pct": round(100 * ch / len(dl), 1), "chase_ci": ci(ch, len(dl))}
        out["trends"][comp].append(row); print(comp, row)
# IPL season by season (for a chart)
out["ipl_seasons"] = []
for y in range(2008, 2027):
    sub = [r for r in rows if r["comp"] == "IPL" and int(r["year"] or 0) == y]
    if not sub: continue
    dec = [r for r in sub if r["result"] == "win"]
    out["ipl_seasons"].append({"year": y, "n": len(sub), "field_pct": round(100 * sum(1 for r in sub if r["decision"] == "field") / len(sub), 1), "toss_win_pct": round(100 * sum(1 for r in dec if r["winner"] == r["toss_winner"]) / len(dec), 1)})
print("IPL seasons:", [(s["year"], s["field_pct"], s["toss_win_pct"]) for s in out["ipl_seasons"]])
# 5. the 2021 T20 World Cup
print("== 5. T20 World Cups ==")
out["wc"] = {}
for r0 in sorted({(r["event"], r["season"]) for r in rows if r["comp"] == "T20I" and "World Cup" in r["event"] and "Qualifier" not in r["event"] and "Sub" not in r["event"] and "Region" not in r["event"]}):
    sub = [r for r in rows if (r["event"], r["season"]) == r0 and r["comp"] == "T20I"]
    dec = [r for r in sub if r["result"] == "win"]
    if len(dec) < 10: continue
    tw = sum(1 for r in dec if r["winner"] == r["toss_winner"]); dl = [r for r in dec if r["method"] == ""]
    ch = sum(1 for r in dl if r["winner"] != bat1(r))
    out["wc"][f"{r0[0]} {r0[1]}"] = {"decisive": len(dec), "toss_wins": tw, "pct": round(100 * tw / len(dec), 1), "chase": ch, "chase_n": len(dl)}
    print(r0, len(dec), "toss winners won", tw, f"({round(100*tw/len(dec),1)}%)", "chasers won", ch, "of", len(dl))
# Dubai at the 2021 WC
sub = [r for r in rows if r["comp"] == "T20I" and r["season"].startswith("2021") and "World Cup" in r["event"] and "Dubai" in r["venue"] and r["result"] == "win"]
tw = sum(1 for r in sub if r["winner"] == r["toss_winner"]); ch = sum(1 for r in sub if r["method"] == "" and r["winner"] != bat1(r))
out["wc2021_dubai"] = {"n": len(sub), "toss_wins": tw, "chase_wins": ch}
print("2021 WC at Dubai:", len(sub), "decisive; toss winners won", tw, "; chasers won", ch)
final = [r for r in rows if r["comp"] == "T20I" and r["season"].startswith("2021") and "World Cup" in r["event"] and r["stage"].lower() == "final"]
print("2021 final:", [(r["date"], r["toss_winner"], r["decision"], r["winner"], r["venue"]) for r in final])
# 6. venues: the small-sample trap — first half v second half of each venue's matches
print("== 6. venue regression ==")
lim = [r for r in rows if r["comp"] in ("ODI", "T20I", "IPL") and r["result"] == "win"]
byv = collections.defaultdict(list)
for r in lim: byv[r["venue"].split(",")[0].strip()].append(r)
pairs = []
for v, ms in byv.items():
    if len(ms) < 40: continue
    ms.sort(key=lambda r: r["date"]); h = len(ms) // 2
    a = 100 * sum(1 for r in ms[:h] if r["winner"] == r["toss_winner"]) / h
    b = 100 * sum(1 for r in ms[h:] if r["winner"] == r["toss_winner"]) / (len(ms) - h)
    pairs.append((v, len(ms), round(a, 1), round(b, 1)))
pairs.sort(key=lambda x: -x[2])
corr = statistics.correlation([p[2] for p in pairs], [p[3] for p in pairs])
top = pairs[:8]
print("venues >=40 decisive:", len(pairs), "corr first-half v second-half:", round(corr, 2))
for p in top: print("  TOP first half", p)
top8_first = statistics.mean(p[2] for p in top); top8_second = statistics.mean(p[3] for p in top)
print("top-8 venues: first half avg", round(top8_first, 1), "-> second half avg", round(top8_second, 1))
out["venues"] = {"n_venues": len(pairs), "corr": round(corr, 2), "top8": top, "top8_first": round(top8_first, 1), "top8_second": round(top8_second, 1)}
json.dump(out, open("summary.json", "w"), indent=1)
