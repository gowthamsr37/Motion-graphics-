import csv, collections, math, json
rows = list(csv.DictReader(open("matches.csv")))
def ci(k, n):  # Wilson 95% interval
    if n == 0: return (0, 0)
    p = k / n; z = 1.96; d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d; h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return (round(100 * (c - h), 1), round(100 * (c + h), 1))
def pval(k, n):  # two-sided normal approx vs 50%
    if n == 0: return 1
    z = (k - n / 2) / math.sqrt(n / 4); return round(math.erfc(abs(z) / math.sqrt(2)), 4)
out = {}
def summary(name, sub):
    dec = [r for r in sub if r["result"] == "win"]
    k = sum(1 for r in dec if r["toss_winner"] == r["winner"]); n = len(dec)
    res = {"matches": len(sub), "decisive": n, "toss_wins": k, "pct": round(100 * k / n, 1) if n else None, "ci": ci(k, n), "p": pval(k, n)}
    out[name] = res; print(f"{name:28s} {res}")
    return res
print("== 1. toss winner's win % (decisive matches) ==")
for comp in ["TEST", "ODI", "T20I", "IPL"]:
    summary(comp, [r for r in rows if r["comp"] == comp])
summary("T20I full members", [r for r in rows if r["comp"] == "T20I" and r["full_members"] == "1"])
summary("ALL (limited overs+tests)", rows)
# tests incl draws
t = [r for r in rows if r["comp"] == "TEST"]
tw = sum(1 for r in t if r["result"] == "win" and r["winner"] == r["toss_winner"]); tl = sum(1 for r in t if r["result"] == "win" and r["winner"] != r["toss_winner"]); td = sum(1 for r in t if r["result"] == "draw")
out["tests_wld"] = {"won": tw, "lost": tl, "drawn": td, "n": len(t)}; print("Tests toss winner W/L/D:", tw, tl, td)
print("== 2. by decision (toss winner's win %) ==")
for comp in ["TEST", "ODI", "T20I", "IPL"]:
    for dec in ["bat", "field"]:
        summary(f"{comp} chose {dec}", [r for r in rows if r["comp"] == comp and r["decision"] == dec])
print("== 3. batting first v chasing (ignoring toss) ==")
for comp in ["ODI", "T20I", "IPL"]:
    dec = [r for r in rows if r["comp"] == comp and r["result"] == "win" and r["method"] == ""]
    # team batting first = toss winner if chose bat, else the other team
    def bat1(r): return r["toss_winner"] if r["decision"] == "bat" else (r["team2"] if r["toss_winner"] == r["team1"] else r["team1"])
    k = sum(1 for r in dec if r["winner"] != bat1(r)); n = len(dec)
    out[f"{comp}_chasing"] = {"chasing_wins": k, "n": n, "pct": round(100 * k / n, 1), "ci": ci(k, n)}
    print(comp, "chasing team win %", round(100 * k / n, 1), ci(k, n), "n", n)
json.dump(out, open("summary.json", "w"), indent=1)
