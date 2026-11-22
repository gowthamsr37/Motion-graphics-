"""The Swap: replay every ODI since 31 May 2015 with Virat Kohli playing for Pakistan and Babar Azam for India.

Model, per match (10,000 simulations each):
  * The swap applies to every match the original man played: Babar takes Kohli's place in India's XI, Kohli takes Babar's
    in Pakistan's. In India v Pakistan both swaps happen at once.
  * Remove the original man's innings (runs k off kb balls). Drop in one of the other man's ODI innings (b off bb), drawn at
    random from his innings since May 2015 in the same situation (batting first or chasing) against the same tier of
    opponent (top-10 nations v the rest; falls back to the situation alone if fewer than 15 such innings).
  * His teammates bat the balls he leaves (or lose the balls he uses) at their own scoring rate in that innings:
        new total = total - k + b - (bb - kb) * teammates' runs per ball
  * A chasing side that won had batting in hand, so its total is "potential": runs + average runs still to come from its
    position (overs left, wickets down), from an empirical table built from every completed 50-over first innings since 2010.
  * Replay: the side batting second wins if its (potential) total reaches the (adjusted) target. DLS targets scale with the
    share of overs. No-results are skipped; ties count half.
If the original man did not bat in a match, nothing changes. Matches against Afghanistan are not in Cricsheet's data.

Usage: python3 analysis/sim.py      (reads matches.json + future.json, writes sim.json)
"""
import json
import pathlib

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
M = json.load(open(HERE / "matches.json"))
F = {tuple(map(int, k.split(","))): v for k, v in json.load(open(HERE / "future.json")).items()}
STAR = {"India": "V Kohli", "Pakistan": "Babar Azam"}
SWAP = {"India": "Babar Azam", "Pakistan": "V Kohli"}  # the swap
SELF = {"India": "V Kohli", "Pakistan": "Babar Azam"}  # the placebo: each man replaced by a random innings of his own
N = 10_000
rng = np.random.default_rng(18_56)


def fut(overs_left, wkts):
    if overs_left <= 0 or wkts >= 10:
        return 0.0
    for o in range(overs_left, 0, -1):  # nearest populated state
        if (o, wkts) in F:
            return F[(o, wkts)] * (overs_left / o)
    return 0.0


# ---------- innings pools ----------
def role_of(m, team):
    inns = m["innings"]
    return 0 if inns and inns[0]["team"] == team else 1


pools = {}
for m in M:
    t = m["team"]
    if m["result"] == "NR" and len(m["innings"]) < 2:
        pass
    for i, inn in enumerate(m["innings"][:2]):
        if inn["team"] != t:
            continue
        for b in inn["batters"]:
            if b["name"] == STAR[t]:
                pools.setdefault((b["name"], i, m["tier"]), []).append((b["r"], b["b"]))


def pool(player, role, tier):
    p = pools.get((player, role, tier), [])
    if len(p) < 15:
        p = pools.get((player, role, "top"), []) + pools.get((player, role, "other"), [])
    return np.array(p, dtype=float)


def star_innings(inn, name):
    for b in inn["batters"]:
        if b["name"] == name:
            return b
    return None


def delta(m_team, inn, opp_tier, role, rep):
    """Simulated change in this innings' total from the swap (array of N), or zeros if the star didn't bat."""
    st = star_innings(inn, STAR[m_team])
    if st is None:
        return np.zeros(N), None
    p = pool(rep[m_team], role, opp_tier)
    draw = p[rng.integers(0, len(p), N)]
    b, bb = draw[:, 0], draw[:, 1]
    others_balls = max(1, inn["legal"] - st["b"])
    others_runs = inn["runs"] - inn["extras"] - st["r"]
    r_o = others_runs / others_balls if others_balls >= 30 else 0.85
    shift = np.clip(bb - st["b"], -1e9, others_balls)  # can't take more balls than teammates faced
    return -st["r"] + b - shift * r_o, st


def potential(inn, won_chase):
    if not won_chase:
        return float(inn["runs"])
    overs_left = int(np.ceil((inn["overs"] * 6 - inn["legal"]) / 6))
    return inn["runs"] + fut(overs_left, inn["wkts"])


def replay(m, swap_opp, rep):
    """P(team wins) under the swap, plus the per-sim win array."""
    t, inns = m["team"], m["innings"]
    if m["result"] == "NR" or len(inns) < 2:
        return None
    ix = 0 if inns[0]["team"] == t else 1
    io = 1 - ix
    X, O = inns[ix], inns[io]
    opp_team = O["team"]
    opp_tier_for_x = m["tier"]
    dX, stX = delta(t, X, opp_tier_for_x, ix, rep)
    if swap_opp and opp_team in STAR:
        dO, stO = delta(opp_team, O, "top", io, rep)
    else:
        dO, stO = np.zeros(N), None
    second, first = (X, O) if ix == 1 else (O, X)
    d_first, d_second = (dO, dX) if ix == 1 else (dX, dO)
    chase_won = (m["result"] == "W") == (ix == 1)  # did the side batting second win in reality?
    if m["result"] == "T":
        chase_won = False
    base_target = second["target"] or (first["runs"] + 1)
    scale = (second["overs"] / first["overs"]) if m["method"] and first["overs"] else 1.0
    target = base_target + d_first * scale
    pot = potential(second, chase_won) + d_second
    second_wins = pot >= target - 1e-9
    tie = np.abs(pot - (target - 1)) < 0.5
    x_wins = second_wins if ix == 1 else ~second_wins
    score = np.where(tie, 0.5, x_wins.astype(float))
    margin = float(potential(second, chase_won) - base_target)  # >= 0: side batting second won, in runs
    return float(score.mean()), score, stX, stO, margin


rows = []
sims, base = {}, {}
for m in sorted(M, key=lambda x: x["date"]):
    if not m["star_played"]:
        continue
    r = replay(m, swap_opp=True, rep=SWAP)
    if r is None:
        continue
    p, score, stX, stO, margin = r
    pb, score_b, *_ = replay(m, swap_opp=True, rep=SELF)
    actual = {"W": 1.0, "L": 0.0, "T": 0.5}[m["result"]]
    key = f'{m["file"]}:{m["team"]}'
    sims[key], base[key] = score, score_b
    rows.append({
        "key": key, "date": m["date"], "team": m["team"], "opp": m["opp"], "event": m["event"], "stage": str(m["stage"]),
        "venue": m["venue"], "city": m["city"], "result": m["result"], "by": m["by"], "method": m["method"],
        "star": None if stX is None else {"r": stX["r"], "b": stX["b"], "out": stX["out"]},
        "opp_star": None if stO is None else {"r": stO["r"], "b": stO["b"], "out": stO["out"]},
        "actual": actual, "p_swap": round(p, 4), "p_base": round(pb, 4), "effect": round(p - pb, 4),
        "margin_runs": round(abs(margin), 1),
        "batting": "first" if m["innings"][0]["team"] == m["team"] else "second",
        "score": f'{m["innings"][0]["team"]} {m["innings"][0]["runs"]}/{m["innings"][0]["wkts"]} v {m["innings"][1]["team"]} {m["innings"][1]["runs"]}/{m["innings"][1]["wkts"]}',
    })

out = {"n_sims": N, "teams": {}, "matches": rows}
for t in ["India", "Pakistan"]:
    xs = [r for r in rows if r["team"] == t]
    tot = np.sum([sims[r["key"]] for r in xs], axis=0)
    totb = np.sum([base[r["key"]] for r in xs], axis=0)
    act = sum(r["actual"] for r in xs)
    eff = tot - totb[rng.permutation(N)]
    out["teams"][t] = {
        "matches": len(xs),
        "actual_wins": act,
        "base_wins_mean": round(float(totb.mean()), 2),
        "effect_mean": round(float(tot.mean() - totb.mean()), 2),
        "effect_p10": float(np.percentile(eff, 10)),
        "effect_p90": float(np.percentile(eff, 90)),
        "p_effect_sign": round(float((eff < 0).mean() if t == "India" else (eff > 0).mean()), 4),
        "close_13": sum(r["margin_runs"] < 13.1 for r in xs),
        "swap_wins_mean": round(float(tot.mean()), 2),
        "swap_wins_p10": float(np.percentile(tot, 10)),
        "swap_wins_p90": float(np.percentile(tot, 90)),
        "p_fewer": round(float((tot < act).mean()), 4),
        "p_more": round(float((tot > act).mean()), 4),
        "batting_first": {"n": sum(r["batting"] == "first" for r in xs), "actual": sum(r["actual"] for r in xs if r["batting"] == "first"), "swap": round(sum(r["p_swap"] for r in xs if r["batting"] == "first"), 2), "base": round(sum(r["p_base"] for r in xs if r["batting"] == "first"), 2)},
        "chasing": {"n": sum(r["batting"] == "second" for r in xs), "actual": sum(r["actual"] for r in xs if r["batting"] == "second"), "swap": round(sum(r["p_swap"] for r in xs if r["batting"] == "second"), 2), "base": round(sum(r["p_base"] for r in xs if r["batting"] == "second"), 2)},
        "biggest_effects": sorted(xs, key=lambda r: r["effect"] if t == "India" else -r["effect"])[:8],
        "lost_wins": sorted([r for r in xs if r["actual"] == 1], key=lambda r: r["p_swap"])[:8],
        "gained_wins": sorted([r for r in xs if r["actual"] == 0], key=lambda r: -r["p_swap"])[:8],
    }

# India v Pakistan, both stars playing
h2h = [r for r in rows if r["team"] == "India" and r["opp"] == "Pakistan" and r["opp_star"] is not None]
out["h2h"] = {"matches": h2h, "actual_india": sum(r["actual"] for r in h2h), "swap_india": round(sum(r["p_swap"] for r in h2h), 2)}


# Tournament sliding doors
def wc(team, event_sub, year):
    return [r for r in rows if r["team"] == team and event_sub in r["event"] and r["date"].startswith(year)]


def p_at_least(rs, k_extra):
    """P(team wins at least k_extra more matches than in reality) across these matches."""
    tot = np.sum([sims[r["key"]] for r in rs], axis=0)
    act = sum(r["actual"] for r in rs)
    return round(float((tot >= act + k_extra).mean()), 4), act, round(float(tot.mean()), 2)


pak19 = wc("Pakistan", "World Cup", "2019")
pak23 = wc("Pakistan", "World Cup", "2023")
ind19 = wc("India", "World Cup", "2019")
ind23 = wc("India", "World Cup", "2023")
out["tournaments"] = {
    "pak_wc2019": {"matches": pak19, "p_one_more_win": p_at_least(pak19, 1)},
    "pak_wc2023": {"matches": pak23, "p_one_more_win": p_at_least(pak23, 1)},
    "ind_wc2019": {"matches": ind19},
    "ind_wc2023": {"matches": ind23},
}
out["all_close_13"] = sum(r["margin_runs"] < 13.1 for r in rows)
out["all_matches"] = len(rows)
json.dump(out, open(HERE / "sim.json", "w"), indent=1)

for t, v in out["teams"].items():
    print(f"{t}: {v['matches']} matches, actual {v['actual_wins']}, placebo {v['base_wins_mean']}, swap {v['swap_wins_mean']} -> effect {v['effect_mean']} (80% {v['effect_p10']}..{v['effect_p90']}, P(sign) {v['p_effect_sign']}); close<13 runs: {v['close_13']}")
    print("   batting first", v["batting_first"], " chasing", v["chasing"])
print("H2H India actual", out["h2h"]["actual_india"], "swap", out["h2h"]["swap_india"])
for r in h2h:
    print("  ", r["date"], r["event"], r["stage"], r["score"], "result", r["result"], "Kohli", r["star"], "Babar", r["opp_star"], "P(India) swap", r["p_swap"])
for k in ["pak_wc2019", "pak_wc2023"]:
    print(k, out["tournaments"][k]["p_one_more_win"])
    for r in out["tournaments"][k]["matches"]:
        print("    ", r["date"], r["opp"], r["result"], r["star"], r["p_swap"])
for k in ["ind_wc2019", "ind_wc2023"]:
    print(k)
    for r in out["tournaments"][k]["matches"]:
        print("    ", r["date"], r["opp"], r["stage"], r["result"], r["star"], r["p_swap"])
print("close matches (<13.1 runs) overall:", out["all_close_13"], "of", out["all_matches"])
for t in ["India", "Pakistan"]:
    print(t, "BIGGEST EFFECTS (swap - placebo)")
    for r in out["teams"][t]["biggest_effects"]:
        print("    ", r["date"], r["opp"], r["event"], r["score"], r["result"], r["star"], "base", r["p_base"], "swap", r["p_swap"])
for t in ["India", "Pakistan"]:
    print(t, "LOST WINS")
    for r in out["teams"][t]["lost_wins"]:
        print("    ", r["date"], r["opp"], r["event"], r["score"], r["star"], r["p_swap"])
    print(t, "GAINED WINS")
    for r in out["teams"][t]["gained_wins"]:
        print("    ", r["date"], r["opp"], r["event"], r["score"], r["star"], r["p_swap"])
