# Keeper-batters away from home (Cricsheet Tests from Dec 2001), plus Pant's own splits and career series.
import json, glob, collections, statistics
RAW = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/raw/tests_male_json"
D = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/pant/"
C = {}
def put(country, *names):
    for nm in names: C[nm] = country
put("Australia", "Adelaide", "Brisbane", "Canberra", "Darwin", "Hobart", "Mackay", "Melbourne", "Perth", "Sydney")
put("England", "Birmingham", "Cardiff", "Chester-le-Street", "Leeds", "London", "Manchester", "Nottingham", "Southampton")
put("South Africa", "Bloemfontein", "Cape Town", "Centurion", "Durban", "Gqeberha", "Johannesburg", "Port Elizabeth", "Potchefstroom")
put("New Zealand", "Auckland", "Christchurch", "Dunedin", "Hamilton", "Mount Maunganui", "Napier", "Wellington")
put("India", "Ahmedabad", "Bangalore", "Bengaluru", "Chandigarh", "Chennai", "Delhi", "Dharamsala", "Guwahati", "Hyderabad", "Indore", "Kanpur", "Kolkata", "Mumbai", "Nagpur", "Pune", "Rajkot", "Ranchi", "Visakhapatnam", "Lucknow")
put("Pakistan", "Faisalabad", "Karachi", "Lahore", "Multan", "Rawalpindi")
put("Sri Lanka", "Colombo", "Galle", "Kandy", "Pallekele")
put("Bangladesh", "Bogra", "Chattogram", "Chittagong", "Dhaka", "Fatullah", "Khulna", "Mirpur", "Sylhet")
put("West Indies", "Antigua", "Barbados", "Bridgetown", "Dominica", "Grenada", "Gros Islet", "Guyana", "Jamaica", "Kingston", "North Sound", "Port of Spain", "Providence", "Roseau", "St George's", "St John's", "St Kitts", "St Lucia", "St Vincent", "Tarouba", "Trinidad")
put("Zimbabwe", "Harare", "Bulawayo")
put("UAE", "Abu Dhabi", "Dubai", "Sharjah")
put("Ireland", "Belfast", "Dublin")
VENUE = {"Adelaide": "Australia", "Melbourne": "Australia", "Perth": "Australia", "Sydney": "Australia", "Galle": "Sri Lanka", "Pallekele": "Sri Lanka", "Harare": "Zimbabwe", "Multan": "Pakistan", "Dubai": "UAE", "Sharjah": "UAE", "Bir Shrestha": "Bangladesh", "Sylhet": "Bangladesh"}
def country(info):
    c = info.get("city")
    if c and c in C: return C[c]
    v = info.get("venue", "")
    for k, val in VENUE.items():
        if k in v: return val
    return "?"
SENA = {"Australia", "England", "South Africa", "New Zealand"}
KEEPERS = {"RR Pant": "India", "MS Dhoni": "India", "WP Saha": "India", "Q de Kock": "South Africa", "AT Carey": "Australia", "TD Paine": "Australia", "BJ Watling": "New Zealand",
           "TA Blundell": "New Zealand", "Mohammad Rizwan": "Pakistan", "Sarfaraz Ahmed": "Pakistan", "Kamran Akmal": "Pakistan", "N Dickwella": "Sri Lanka", "BT Foakes": "England", "JL Smith": "England",
           "MV Boucher": "South Africa", "AC Gilchrist": "Australia", "Mushfiqur Rahim": "Bangladesh", "SD Hope": "West Indies", "J da Silva": "West Indies", "BJ Haddin": "Australia", "MJ Prior": "England"}
agg = {k: {"away": collections.Counter(), "sena": collections.Counter(), "all": collections.Counter(), "first": None, "last": None} for k in KEEPERS}
for f in glob.glob(f"{RAW}/*.json"):
    d = json.load(open(f)); info = d["info"]; ctry = country(info)
    present = {p: t for t, ps in info.get("players", {}).items() for p in ps if p in KEEPERS}
    if not present: continue
    for p, team in present.items():
        a = agg[p]; dt = info["dates"][0]
        a["first"] = min(a["first"] or dt, dt); a["last"] = max(a["last"] or dt, dt)
        away = ctry != KEEPERS[p]
        for key in (["all"] + (["away"] if away else []) + (["sena"] if (away and ctry in SENA) else [])):
            a[key]["tests"] += 1
        for inn in d.get("innings", []):
            if inn.get("team") != team: continue
            r = b = 0; out = False; batted = False
            for ov in inn.get("overs", []):
                for dl in ov["deliveries"]:
                    if p in (dl["batter"], dl["non_striker"]): batted = True
                    if dl["batter"] == p:
                        r += dl["runs"]["batter"]; b += int("wides" not in dl.get("extras", {}))
                    for w in dl.get("wickets", []):
                        if w["player_out"] == p: out = True
            if not batted: continue
            for key in (["all"] + (["away"] if away else []) + (["sena"] if (away and ctry in SENA) else [])):
                c = a[key]; c["inns"] += 1; c["runs"] += r; c["balls"] += b; c["outs"] += int(out); c["100s"] += int(r >= 100); c["50s"] += int(50 <= r < 100)
res = {}
for p, a in agg.items():
    row = {"first": a["first"], "last": a["last"]}
    for key in ("all", "away", "sena"):
        c = a[key]
        row[key] = {**c, "avg": round(c["runs"] / c["outs"], 1) if c["outs"] else None, "sr": round(100 * c["runs"] / c["balls"], 1) if c["balls"] else None}
    res[p] = row
json.dump(res, open(D + "keepers.json", "w"), indent=1)
print(f"{'keeper':18}{'span':12}{'away tests':>11}{'inns':>6}{'avg':>7}{'sr':>7}{'100s':>6} | SENA tests avg 100s")
for p, r in sorted(res.items(), key=lambda kv: -(kv[1]['away']['avg'] or 0)):
    a = r["away"]; s = r["sena"]
    print(f"{p:18}{(r['first'] or '')[:4]}-{(r['last'] or '')[:4]}  {a.get('tests',0):>9}{a.get('inns',0):>6}{a['avg'] or 0:>7}{a['sr'] or 0:>7}{a.get('100s',0):>6} | {s.get('tests',0):>4} {s['avg'] or 0:>6} {s.get('100s',0):>3}")
