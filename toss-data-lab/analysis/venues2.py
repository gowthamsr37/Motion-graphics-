# Venue "toss ground" regression test with renamed grounds merged.
import csv, collections, statistics, json, re, sys
W = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/work"
rows = [r for r in csv.DictReader(open(f"{W}/matches.csv")) if r["comp"] in ("ODI", "T20I", "IPL") and r["result"] == "win"]
ALIAS = {
    "feroz shah kotla": "arun jaitley stadium",
    "sardar patel stadium": "narendra modi stadium",
    "punjab cricket association is bindra stadium": "punjab cricket association stadium",
    "national bank cricket arena": "national stadium karachi",
    "westpac stadium": "wellington regional stadium", "sky stadium": "wellington regional stadium", "hnry stadium": "wellington regional stadium",
    "jade stadium": "lancaster park", "ami stadium": "lancaster park",
    "dr ys rajasekhara reddy aca-vdca cricket stadium": "andhra cricket association-visakhapatnam district cricket association stadium",
    "subrata roy sahara stadium": "maharashtra cricket association stadium",
    "beausejour stadium": "daren sammy national cricket stadium",
}
def key(r):
    v = r["venue"].split(",")[0].strip().lower().replace(".", "")
    v = re.sub(r"\s+", " ", v)
    if v == "national stadium": v += " " + (r["city"] or "").lower()
    return ALIAS.get(v, v)
allnames = collections.defaultdict(set)
byv = collections.defaultdict(list)
for r in rows:
    k = key(r); byv[k].append(r); allnames[k].add(r["venue"])
pairs = []
for v, ms in byv.items():
    if len(ms) < 40: continue
    ms.sort(key=lambda r: r["date"]); h = len(ms) // 2
    a = 100 * sum(r["winner"] == r["toss_winner"] for r in ms[:h]) / h
    b = 100 * sum(r["winner"] == r["toss_winner"] for r in ms[h:]) / (len(ms) - h)
    pairs.append((v, len(ms), round(a, 1), round(b, 1), ms[0]["date"][:4], ms[h]["date"][:4], ms[-1]["date"][:4]))
pairs.sort(key=lambda x: -x[2])
corr = statistics.correlation([p[2] for p in pairs], [p[3] for p in pairs])
top = pairs[:8]
print("venues >=40:", len(pairs), "corr", round(corr, 2))
for p in top: print(p, sorted(allnames[p[0]]))
f = statistics.mean(p[2] for p in top); s = statistics.mean(p[3] for p in top)
print("top8 first", round(f, 1), "second", round(s, 1))
# pooled (match-weighted) version too
fw = sum(round(p[2] * (p[1] // 2) / 100) for p in top); fn = sum(p[1] // 2 for p in top)
sw = sum(round(p[3] * (p[1] - p[1] // 2) / 100) for p in top); sn = sum(p[1] - p[1] // 2 for p in top)
print("pooled first", fw, "/", fn, round(100 * fw / fn, 1), "second", sw, "/", sn, round(100 * sw / sn, 1))
bot = pairs[-8:]
print("bottom8 first", round(statistics.mean(p[2] for p in bot), 1), "second", round(statistics.mean(p[3] for p in bot), 1))
for p in bot: print("  ", p)
d = json.load(open(f"{W}/summary.json"))
d["venues_v2"] = {"n_venues": len(pairs), "corr": round(corr, 2), "top8": top, "top8_first": round(f, 1), "top8_second": round(s, 1),
                  "pooled": [fw, fn, sw, sn], "bottom8": bot, "bottom8_first": round(statistics.mean(p[2] for p in bot), 1), "bottom8_second": round(statistics.mean(p[3] for p in bot), 1)}
json.dump(d, open(f"{W}/summary.json", "w"), indent=1)
