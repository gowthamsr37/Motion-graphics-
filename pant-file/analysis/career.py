import json, collections
D = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/pant/"
inns = json.load(open(D + "innings.json"))
HOME = {"Chennai","Bengaluru","Bangalore","Kolkata","Delhi","Mumbai","Pune","Ranchi","Dharamsala","Nagpur","Hyderabad","Rajkot","Visakhapatnam","Mohali","Indore","Kanpur","Ahmedabad","Guwahati","Lucknow","Chandigarh"}
rows = [{"date": x["date"], "opp": x["opp"], "city": x["city"] or x["venue"], "runs": x["runs"], "out": int(bool(x["kind"])), "balls": sum(int(b["legal"]) for b in x["balls"]), "home": x["city"] in HOME, "mi": x["mi"], "sixes": sum(b["r"] == 6 for b in x["balls"])} for x in inns]
rows.append({"date": "2026-06-06", "opp": "Afghanistan", "city": "New Chandigarh", "runs": 81, "out": 1, "balls": None, "home": True, "mi": 1, "sixes": None})
rows.append({"date": "2026-11-19", "opp": "New Zealand", "city": "Wellington", "runs": 128, "out": 1, "balls": 153, "home": False, "mi": 2, "sixes": None})
rows.sort(key=lambda r: (r["date"], r["mi"]))
def agg(rs):
    r = sum(x["runs"] for x in rs); o = sum(x["out"] for x in rs)
    return {"inns": len(rs), "runs": r, "outs": o, "avg": round(r / o, 2) if o else None, "100s": sum(x["runs"] >= 100 for x in rs), "50s": sum(50 <= x["runs"] < 100 for x in rs), "90s": sum(90 <= x["runs"] < 100 for x in rs)}
out = {"career": agg(rows), "home": agg([x for x in rows if x["home"]]), "away": agg([x for x in rows if not x["home"]])}
out["career"]["tests"] = 53
out["by_year"] = {y: agg([x for x in rows if x["date"][:4] == y]) for y in sorted({x["date"][:4] for x in rows})}
# gaps between consecutive Tests
dates = sorted({x["date"] for x in rows})
import datetime as dt
gaps = sorted(((dt.date.fromisoformat(b) - dt.date.fromisoformat(a)).days, a, b) for a, b in zip(dates, dates[1:]))[-4:]
out["gaps"] = gaps
# Australia 2024-25
aus = [x for x in rows if "2024-11-01" <= x["date"] <= "2025-01-10"]
out["bgt_2024"] = agg(aus)
out["leeds"] = [x for x in rows if x["date"] == "2025-06-20"]
out["gabba"] = [x for x in rows if x["date"].startswith("2021-01-15")]
out["sydney21"] = [x for x in rows if x["date"].startswith("2021-01-07")]
out["first"] = rows[:2]
# hundreds
out["hundreds"] = [(x["date"], x["opp"], x["city"], x["runs"], x["balls"]) for x in rows if x["runs"] >= 100]
# rolling series
ser = []
for i, x in enumerate(rows):
    w = rows[max(0, i - 9): i + 1]; o = sum(y["out"] for y in w)
    ser.append({"i": i, "date": x["date"], "runs": x["runs"], "out": x["out"], "home": x["home"], "host": "", "pos": None, "roll": round(sum(y["runs"] for y in w) / o, 1) if o else None})
json.dump(ser, open(D + "series.json", "w"))
json.dump(out, open(D + "career.json", "w"), indent=1, default=str)
for k, v in out.items(): print(k, ":", v)
# Pant away with today's innings
k = json.load(open(D + "keepers.json"))["RR Pant"]["away"]
print("away incl. Wellington:", k["runs"] + 128, "runs", k["outs"] + 1, "outs", round((k["runs"] + 128) / (k["outs"] + 1), 2), "100s", k["100s"] + 1, "tests", k["tests"] + 1)
s = json.load(open(D + "keepers.json"))["RR Pant"]["sena"]
print("SENA incl. Wellington:", s["runs"] + 128, s["outs"] + 1, round((s["runs"] + 128) / (s["outs"] + 1), 2), "100s", s["100s"] + 1, "tests", s["tests"] + 1)
