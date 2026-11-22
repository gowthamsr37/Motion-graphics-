import json, collections, statistics, glob
D = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/pant/"
inns = json.load(open(D + "innings.json"))
SPIN = {"NM Lyon","Shoaib Bashir","JE Root","Mehedi Hasan Miraz","MM Ali","K Nuwantha","MJ Leach","RL Chase","GD Phillips","AY Patel","M Labuschagne","DM Bess","AU Rashid","Shakib Al Hasan","DM de Silva","NGRP Jayasuriya","KA Maharaj","L Embuldeniya","D Bishoo","SR Harmer","Taijul Islam","TM Head","P Jayawickrama","R Ravindra","JA Warrican","LA Dawson","KC Brathwaite","MJ Santner","KIC Asalanka","RRS Cornwall","IS Sodhi","AJ Finch"}
UNKNOWN = {"UT Khawaja"}
HOME = {"Chennai","Bengaluru","Bangalore","Kolkata","Delhi","Mumbai","Pune","Ranchi","Dharamsala","Nagpur","Hyderabad","Rajkot","Visakhapatnam","Mohali","Indore","Kanpur","Ahmedabad","Guwahati","Lucknow","Chandigarh"}
def is_home(x): return x["city"] in HOME
def ball_stats(filter_fn):
    r = b = o = s6 = s4 = 0
    for x in inns:
        for bl in x["balls"]:
            if not filter_fn(bl): continue
            r += bl["r"]; b += int(bl["legal"]); o += int(bl["out"]); s6 += int(bl["r"] == 6); s4 += int(bl["r"] == 4 and not bl["nb4"])
    return {"runs": r, "balls": b, "outs": o, "avg": round(r / o, 1) if o else None, "sr": round(100 * r / b, 1), "bpd": round(b / o, 1) if o else None, "sixes": s6, "fours": s4, "bp6": round(b / s6, 1) if s6 else None}
res = {}
res["vs_spin"] = ball_stats(lambda bl: bl["bowler"] in SPIN)
res["vs_pace"] = ball_stats(lambda bl: bl["bowler"] not in SPIN and bl["bowler"] not in UNKNOWN)
res["all_balls"] = ball_stats(lambda bl: True)
# spin home v away
def spin_split(home):
    r = b = o = s6 = 0
    for x in inns:
        if is_home(x) != home: continue
        for bl in x["balls"]:
            if bl["bowler"] not in SPIN: continue
            r += bl["r"]; b += int(bl["legal"]); o += int(bl["out"]); s6 += int(bl["r"] == 6)
    return {"runs": r, "balls": b, "outs": o, "avg": round(r / o, 1) if o else None, "sr": round(100 * r / b, 1), "sixes": s6}
res["spin_home"] = spin_split(True); res["spin_away"] = spin_split(False)
# vs Lyon
res["vs_lyon"] = ball_stats(lambda bl: bl["bowler"] == "NM Lyon")
res["top_bowlers_out"] = collections.Counter(x["bowler_out"] for x in inns if x["kind"] and x["kind"] != "run out").most_common(6)
res["kinds"] = collections.Counter(x["kind"] for x in inns if x["kind"]).most_common()
# sixes
res["sixes_data"] = res["all_balls"]["sixes"]
# nineties
ninety = [x for x in inns if 90 <= x["runs"] < 100]
res["nineties"] = [(x["date"], x["opp"], x["city"], x["runs"], sum(int(b["legal"]) for b in x["balls"]), x["kind"], x["bowler_out"], "spin" if x["bowler_out"] in SPIN else "pace") for x in ninety]
# balls spent in the 90s and scoring rate there
r = b = o = 0
for x in inns:
    sc = 0
    for bl in x["balls"]:
        if 90 <= sc < 100:
            r += bl["r"]; b += int(bl["legal"]); o += int(bl["out"])
        sc += bl["r"]
res["in_90s"] = {"runs": r, "balls": b, "outs": o, "sr": round(100 * r / b, 1)}
r = b = 0
for x in inns:
    sc = 0
    for bl in x["balls"]:
        if 70 <= sc < 90: r += bl["r"]; b += int(bl["legal"])
        sc += bl["r"]
res["in_70_89_sr"] = round(100 * r / b, 1)
# baseline: across all Test innings since 2002, share of 90+ scores that stopped in the 90s
RAW = "/tmp/claude-0/-home-user/7982a385-b50f-5a9c-aa51-ba8044d937bc/scratchpad/toss/raw/tests_male_json"
cnt90 = cnt100 = 0; per = collections.Counter(); per100 = collections.Counter()
for f in glob.glob(f"{RAW}/*.json"):
    d = json.load(open(f))
    for inn in d.get("innings", []):
        sc = collections.Counter()
        for ov in inn.get("overs", []):
            for dl in ov["deliveries"]: sc[dl["batter"]] += dl["runs"]["batter"]
        for p, v in sc.items():
            if 90 <= v < 100: cnt90 += 1; per[p] += 1
            elif v >= 100: cnt100 += 1; per100[p] += 1
res["baseline_90s_share"] = round(cnt90 / (cnt90 + cnt100), 3)
res["most_90s_2002_on"] = per.most_common(12)
res["pant_90s_share"] = round(7 / (7 + 9), 3)
json.dump(res, open(D + "summary.json", "w"), indent=1)
for k, v in res.items(): print(k, ":", v)
