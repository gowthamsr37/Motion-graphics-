import sys
import json,glob,collections as C
T=C.defaultdict(C.Counter); inns=C.Counter()
for f in glob.glob(sys.argv[1]+'/*.json'):
    d=json.load(open(f)); i=d['info']
    if not i['dates'][0].startswith('2026'): continue
    for inn in d['innings'][:2]:
        bat=inn['team']; bowl=[t for t in i['teams'] if t!=bat][0]
        inns[bat]+=1
        for ov in inn['overs']:
            o=ov['over']; ph='PP' if o<6 else ('MID' if o<15 else 'DTH')
            for dl in ov['deliveries']:
                ex=dl.get('extras',{}); legal='wides' not in ex and 'noballs' not in ex
                r=dl['runs']['total']; br=dl['runs']['batter']; wk=len(dl.get('wickets',[]))
                for side,t in (('bat',bat),('bowl',bowl)):
                    c=T[(t,side,ph)]
                    c['R']+=r; c['B']+=legal; c['W']+=wk; c['dot']+=(legal and r==0); c['4']+=br==4; c['6']+=br==6
teams=sorted(inns)
mets=[('RR',lambda c:6*c['R']/c['B']),('dot%',lambda c:100*c['dot']/c['B']),('bnd%',lambda c:100*(c['4']+c['6'])/c['B']),('6/inn',None),('wk/inn',None)]
def val(t,side,ph,m):
    c=T[(t,side,ph)]
    if m=='RR': return 6*c['R']/c['B']
    if m=='dot%': return 100*c['dot']/c['B']
    if m=='bnd%': return 100*(c['4']+c['6'])/c['B']
    if m=='6/inn': return c['6']/inns[t]
    if m=='wk/inn': return c['W']/inns[t]
good={('bat','RR'):1,('bat','dot%'):-1,('bat','bnd%'):1,('bat','6/inn'):1,('bat','wk/inn'):-1,('bowl','RR'):-1,('bowl','dot%'):1,('bowl','bnd%'):-1,('bowl','6/inn'):-1,('bowl','wk/inn'):1}
R='Royal Challengers Bengaluru'; out={}
for side in ('bat','bowl'):
  for ph in ('PP','MID','DTH'):
    for m in ('RR','dot%','bnd%','6/inn','wk/inn'):
      vs=sorted(teams,key=lambda t:-good[(side,m)]*val(t,side,ph,m))
      rk=vs.index(R)+1; out[(side,ph,m)]=rk
      best=vs[0]
      print(f"{side:4} {ph:3} {m:6} RCB {val(R,side,ph,m):6.2f} rank {rk:2}  | best {best[:22]:22} {val(best,side,ph,m):6.2f} | avg {sum(val(t,side,ph,m) for t in teams)/10:6.2f}")
ranks=C.Counter()
for t in teams:
  s=0
  for side in ('bat','bowl'):
    for ph in ('PP','MID','DTH'):
      for m in ('RR','dot%','bnd%','6/inn','wk/inn'):
        vs=sorted(teams,key=lambda x:-good[(side,m)]*val(x,side,ph,m)); s+=vs.index(t)+1
  ranks[t]=s/30
print("\nAverage rank across all 30 phase KPIs:")
for t,v in sorted(ranks.items(),key=lambda kv:kv[1]): print(f"  {t:28} {v:.2f}")
print("RCB top-3 count:",sum(1 for v in out.values() if v<=3),"of 30; worst:",max(out.values()))

# export matrix for the reel
order=[(s,p,m) for s in ('bat','bowl') for p in ('PP','MID','DTH') for m in ('RR','dot%','bnd%','6/inn','wk/inn')]
mat={}
for t in teams:
    mat[t]=[sorted(teams,key=lambda x:-good[(s,m)]*val(x,s,p,m)).index(t)+1 for s,p,m in order]
json.dump({"order":[f"{s} {p} {m}" for s,p,m in order],"ranks":mat,"avg":{t:round(v,2) for t,v in ranks.items()}},open("analysis/ranks.json","w"),indent=1)
