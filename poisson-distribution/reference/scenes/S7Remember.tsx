// SCENE 7 — REMEMBER. COUNTS SUCCESSES → FIXED TRIES, SAME CHANCE → AVERAGE = TRIES × CHANCE.
// Uses: defective products, ad clicks, penalty shots.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BarsIcon, RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Mark, useSpr } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { AVGC, BARS, FAIL, SUCC } from "./S1Hook";
import { binom } from "./S4Test";

const C = theme.colors;

export const S7Remember: React.FC = () => {
  useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const uses = [
    { t: "DEFECTIVE PRODUCTS", at: s.cueS(2, "defective"), c: FAIL },
    { t: "AD CLICKS", at: s.cueS(2, "ad"), c: C.cyan },
    { t: "PENALTY SHOTS", at: s.cueS(2, "penalty"), c: SUCC },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="BINOMIAL DISTRIBUTION" color={BARS} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={560}
        gap={170}
        size={36}
        items={[
          { t: "COUNTS SUCCESSES", c: SUCC, at: s.cueS(0, "counts"), icon: <div style={{ display: "flex", gap: 2 }}>{[0, 1, 2].map((i) => <Mark key={i} kind="check" at={s.cueS(0, "counts") + i * 4} size={32} color={SUCC} width={7} />)}</div> },
          { t: "FIXED TRIES, SAME CHANCE", c: BARS, at: s.cueS(0, "fixed"), icon: <BarsIcon color={BARS} vals={binom(10, 0.5)} w={110} h={50} /> },
          { t: "AVERAGE = TRIES × CHANCE", c: AVGC, at: s.cueS(1, "average"), icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: AVGC, whiteSpace: "nowrap" }}>n × p</div> },
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", gap: 16 }}>
        {uses.map((u) => {
          const p = spr(u.at - 6, theme.spring.bouncy);
          return (
            <div key={u.t} style={{ transform: `translateY(${(1 - p) * 30}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), padding: "12px 20px", borderRadius: 999, border: `3px solid ${u.c}`, background: alpha(u.c, 0.16), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>{u.t}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
