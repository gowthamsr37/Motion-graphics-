import json, math
PRICE=90e5; DOWN=0.20*PRICE; COSTS=7e5; UPFRONT=DOWN+COSTS
LOAN=PRICE-DOWN; RATE=0.085; N=240
r=RATE/12; EMI=LOAN*r*(1+r)**N/((1+r)**N-1)
RENT0=21000; RENT_G=0.07; MAINT0=4000; MAINT_G=0.05
RET=[14,9,12,16,8,-35,42,18,10,13,6,15,11,9,14,12,8,13,10,11]
def run(house_g=0.05, mode="base", invest_share=1.0):
    port=UPFRONT; bal=LOAN; out=[]
    for y in range(20):
        rent=RENT0*(1+RENT_G)**y; maint=MAINT0*(1+MAINT_G)**y
        mr=(1+RET[y]/100)**(1/12)-1
        fdm=1.07**(1/12)-1
        for m in range(12):
            bal-=EMI-bal*r
            diff=(EMI+maint-rent)
            if mode=="panic" and 6<=y<=8:   # sold at the bottom, sat in FD for 3 years, spent the difference
                port*=1+fdm
            else:
                c = diff*invest_share if diff>0 else diff
                port=port*(1+mr)+c
        house=PRICE*(1+house_g)**(y+1)
        out.append(dict(y=y+1, arjun=round(house-max(bal,0)), meera=round(port), house=round(house), loan=round(max(bal,0)), rent=round(rent)))
    return out
res={"base":run(),"panic":run(mode="panic"),"half":run(invest_share=0.5),"h7":run(house_g=0.07)}
for k,v in res.items(): print(k, "Y6",round(v[5]['meera']/1e5,1),"Y7",round(v[6]['meera']/1e5,1), "Y20 A",round(v[-1]['arjun']/1e7,2),"M",round(v[-1]['meera']/1e7,2))
# break-even house growth vs base meera
lo,hi=0.0,0.15
for _ in range(40):
    mid=(lo+hi)/2
    if run(house_g=mid)[-1]['arjun']<res['base'][-1]['meera']: lo=mid
    else: hi=mid
print("breakeven house growth",round(mid*100,2))
print("yr5 vs yr6 drop", res['base'][4]['meera'], res['base'][5]['meera'])
print([ (d['y'],round(d['arjun']/1e5),round(d['meera']/1e5)) for d in res['base']])
json.dump(res,open("model2.json","w"))
