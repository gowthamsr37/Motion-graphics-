"""Rishabh Pant against Indian and world wicketkeepers, from Cricsheet Test ball-by-ball (Dec 2001 onward).

Per keeper (all Tests he played in the data): average, strike rate, hundreds, sixes, home v away, fourth innings,
"in trouble" innings (walked in with 4+ wickets down and fewer than 150 on the board) and how those Tests ended,
and his strike rate against his own top-order teammates in the same innings ("tempo gap").
Usage: python3 analysis/keepers.py <tests_male_json dir>   -> analysis/keepers.json
"""
import collections
import glob
import json
import pathlib
import sys

RAW = sys.argv[1]
HERE = pathlib.Path(__file__).resolve().parent
KEEPERS = {
    "RR Pant": "India", "MS Dhoni": "India", "WP Saha": "India", "Dhruv Jurel": "India", "KS Bharat": "India",
    "AC Gilchrist": "Australia", "BJ Haddin": "Australia", "TD Paine": "Australia", "AT Carey": "Australia",
    "MJ Prior": "England", "BT Foakes": "England", "JM Bairstow": "England",
    "MV Boucher": "South Africa", "Q de Kock": "South Africa", "BJ Watling": "New Zealand", "TA Blundell": "New Zealand",
    "Kamran Akmal": "Pakistan", "Sarfaraz Ahmed": "Pakistan", "Mohammad Rizwan": "Pakistan", "N Dickwella": "Sri Lanka",
    "J da Silva": "West Indies", "SD Hope": "West Indies", "Mushfiqur Rahim": "Bangladesh",
}
CITY = {}
def put(c, *names):
    for n in names:
        CITY[n] = c
put("Australia", "Adelaide", "Brisbane", "Canberra", "Darwin", "Hobart", "Cairns", "Melbourne", "Perth", "Sydney")
put("England", "Birmingham", "Bristol", "Cardiff", "Chester-le-Street", "Leeds", "London", "Manchester", "Nottingham", "Southampton", "Lord's")
put("South Africa", "Bloemfontein", "Cape Town", "Centurion", "Durban", "Gqeberha", "Johannesburg", "Port Elizabeth", "Potchefstroom", "East London", "Paarl")
put("New Zealand", "Auckland", "Christchurch", "Dunedin", "Hamilton", "Mount Maunganui", "Napier", "Wellington", "Queenstown", "Nelson")
put("India", "Ahmedabad", "Bangalore", "Bengaluru", "Chandigarh", "Mohali", "Chennai", "Delhi", "Dharamsala", "Guwahati", "Hyderabad", "Indore", "Kanpur", "Kolkata", "Mumbai", "Nagpur", "Pune", "Rajkot", "Ranchi", "Visakhapatnam", "Lucknow", "Cuttack", "Mullanpur")
put("Pakistan", "Faisalabad", "Karachi", "Lahore", "Multan", "Rawalpindi", "Peshawar")
put("Sri Lanka", "Colombo", "Galle", "Kandy", "Pallekele", "Moratuwa")
put("Bangladesh", "Bogra", "Chattogram", "Chittagong", "Dhaka", "Fatullah", "Khulna", "Mirpur", "Sylhet")
put("West Indies", "Antigua", "Barbados", "Bridgetown", "Dominica", "Grenada", "Gros Islet", "Guyana", "Jamaica", "Kingston", "North Sound", "Port of Spain", "Providence", "Roseau", "St George's", "St John's", "St Kitts", "Basseterre", "St Lucia", "St Vincent", "Kingstown", "Tarouba", "Trinidad")
put("Zimbabwe", "Harare", "Bulawayo")
put("UAE", "Abu Dhabi", "Dubai", "Sharjah")
put("Ireland", "Belfast", "Dublin", "Malahide")
VENUE = {"Adelaide": "Australia", "Melbourne": "Australia", "Perth": "Australia", "Sydney": "Australia", "Galle": "Sri Lanka", "Pallekele": "Sri Lanka", "Harare": "Zimbabwe", "Multan": "Pakistan", "Dubai": "UAE", "Sharjah": "UAE", "Sylhet": "Bangladesh", "Lord's": "England", "Oval": "England", "Edgbaston": "England", "Wanderers": "South Africa", "Newlands": "South Africa", "Eden Park": "New Zealand", "Basin Reserve": "New Zealand"}
SENA = {"Australia", "England", "South Africa", "New Zealand"}


def country(info):
    c = info.get("city")
    if c in CITY:
        return CITY[c]
    v = info.get("venue", "")
    for k, val in VENUE.items():
        if k in v:
            return val
    return "?"


def blank():
    return collections.Counter()


agg = {k: collections.defaultdict(blank) for k in KEEPERS}
tests = {k: set() for k in KEEPERS}
unknown = collections.Counter()
for f in sorted(glob.glob(f"{RAW}/*.json")):
    d = json.load(open(f))
    info = d["info"]
    ctry = country(info)
    if ctry == "?":
        unknown[(info.get("city"), info.get("venue"))] += 1
    winner = info.get("outcome", {}).get("winner")
    for team, ps in info.get("players", {}).items():
        for p in ps:
            if p not in KEEPERS:
                continue
            tests[p].add(f)
            res = "W" if winner == team else ("L" if winner else "D")
            away = ctry != KEEPERS[p]
            agg[p]["results"][res] += 1
            for mi, inn in enumerate(d.get("innings", []), 1):
                if inn.get("team") != team or inn.get("super_over"):
                    continue
                score = wk = 0
                arrived = None
                r = b = six = 0
                out = False
                mates_r = mates_b = 0
                order = []
                for ov in inn.get("overs", []):
                    for dl in ov["deliveries"]:
                        for x in (dl["batter"], dl["non_striker"]):
                            if x not in order:
                                order.append(x)
                        if p in (dl["batter"], dl["non_striker"]) and arrived is None:
                            arrived = (score, wk)
                        legal_faced = "wides" not in dl.get("extras", {})
                        if dl["batter"] == p:
                            r += dl["runs"]["batter"]
                            b += legal_faced
                            six += dl["runs"]["batter"] == 6 and not dl["runs"].get("non_boundary", False)
                        elif order.index(dl["batter"]) < 7:
                            mates_r += dl["runs"]["batter"]
                            mates_b += legal_faced
                        score += dl["runs"]["total"]
                        for w in dl.get("wickets", []):
                            if w["kind"] not in ("retired hurt", "retired not out"):
                                wk += 1
                            if w["player_out"] == p and w["kind"] not in ("retired hurt", "retired not out"):
                                out = True
                if arrived is None:
                    continue
                keys = ["all", "away" if away else "home"] + (["sena"] if away and ctry in SENA else [])
                if mi == 4:
                    keys.append("fourth")
                trouble = arrived[1] >= 4 and arrived[0] < 150
                if trouble:
                    keys.append("trouble")
                for k in keys:
                    c = agg[p][k]
                    c["inns"] += 1; c["runs"] += r; c["balls"] += b; c["outs"] += out; c["sixes"] += six
                    c["100s"] += r >= 100; c["50s"] += 50 <= r < 100
                    c["mates_r"] += mates_r; c["mates_b"] += mates_b
                if trouble and r >= 50:
                    agg[p]["trouble50"][res] += 1
                    agg[p]["trouble50_list"].update({f"{info['dates'][0]}|{ctry}|{r}|{arrived[0]}/{arrived[1]}|{res}": 1})


def line(c):
    return {
        "inns": c["inns"], "runs": c["runs"], "outs": c["outs"], "balls": c["balls"], "100s": c["100s"], "50s": c["50s"], "sixes": c["sixes"],
        "avg": round(c["runs"] / c["outs"], 1) if c["outs"] else None,
        "sr": round(100 * c["runs"] / c["balls"], 1) if c["balls"] else None,
        "mates_sr": round(100 * c["mates_r"] / c["mates_b"], 1) if c["mates_b"] else None,
    }


out = {}
for p in KEEPERS:
    a = agg[p]
    out[p] = {"country": KEEPERS[p], "tests": len(tests[p]), "results": dict(a["results"])}
    for k in ("all", "home", "away", "sena", "fourth", "trouble"):
        out[p][k] = line(a[k])
    out[p]["trouble50"] = dict(a["trouble50"])
    out[p]["trouble50_list"] = sorted(a["trouble50_list"].keys())
    out[p]["tempo_gap"] = round(out[p]["all"]["sr"] - out[p]["all"]["mates_sr"], 1) if out[p]["all"]["sr"] and out[p]["all"]["mates_sr"] else None
json.dump(out, open(HERE / "keepers.json", "w"), indent=1)

print("unknown venues:", unknown.most_common(5))
hdr = f"{'keeper':17}{'T':>4}{'avg':>6}{'sr':>6}{'100':>4}{'6s':>4} | {'home':>5}{'away':>6}{'sena':>6} | {'4th':>5}{'n':>4} | {'troub':>6}{'n':>4}{'50+':>4} W/D/L | {'gap':>5}"
print(hdr)
for p, r in sorted(out.items(), key=lambda kv: -(kv[1]["all"]["avg"] or 0)):
    t50 = r["trouble50"]
    print(f"{p:17}{r['tests']:>4}{r['all']['avg'] or 0:>6}{r['all']['sr'] or 0:>6}{r['all']['100s']:>4}{r['all']['sixes']:>4} | {r['home']['avg'] or 0:>5}{r['away']['avg'] or 0:>6}{r['sena']['avg'] or 0:>6} | {r['fourth']['avg'] or 0:>5}{r['fourth']['inns']:>4} | {r['trouble']['avg'] or 0:>6}{r['trouble']['inns']:>4}{t50.get('W',0)+t50.get('D',0)+t50.get('L',0):>4} {t50.get('W',0)}/{t50.get('D',0)}/{t50.get('L',0)} | {r['tempo_gap'] or 0:>5}")
print("\nPant trouble 50+:", out["RR Pant"]["trouble50_list"])
print("Dhoni trouble 50+:", out["MS Dhoni"]["trouble50_list"][:12])
