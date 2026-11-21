// SCENE 3 — WHEN TO USE IT. TWO SEPARATE GROUPS · σ UNKNOWN · SMALL SAMPLES tick on their words; then our case:
// n = 5 PER BRAND, σ UNKNOWN → USE A TWO-SAMPLE t-TEST.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Mark, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { BA, BB, SE } from "../components/TKit";
import { Sigma } from "../components/ZKit";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Row: React.FC<{ y: number; at: number; c: string; children: React.ReactNode }> = ({ y, at, c, children }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y - 60, width: 900, height: 120, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(c, 0.18)}, rgba(14,24,64,0.9) 60%)`, border: `3px solid ${c}`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -50}px)`, display: "flex", alignItems: "center", gap: 26, paddingLeft: 30 }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, border: `3px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Mark kind="check" at={at + 4} size={44} color={C.green} />
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 14 }}>{children}</div>
    </div>
  );
};

export const S3When: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s3");
  const chips = [
    { at: s.cueS(1, "5"), el: <>n = <span style={{ fontFamily: theme.fonts.mono, color: BA }}>5</span> PER BRAND</>, c: BA },
    { at: s.cueS(1, "sigma"), el: <><Sigma size={46} color={SE} /> UNKNOWN</>, c: SE },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle label="WHEN TO USE IT" color={SE} at={2} />
      <Row y={480} at={s.cueS(0, "separate")} c={BB}>
        TWO SEPARATE GROUPS
      </Row>
      <Row y={630} at={s.cueS(0, "sigma")} c={SE}>
        <Sigma size={52} color={SE} /> UNKNOWN
      </Row>
      <Row y={780} at={s.cueS(0, "small.")} c={BA}>
        SMALL SAMPLES
      </Row>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", gap: 28 }}>
        {chips.map((k, i) => {
          const p = spr(k.at - 4, theme.spring.pop);
          return (
            <div key={i} style={{ opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 80}px) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, display: "flex", alignItems: "center", gap: 12, padding: "16px 34px", borderRadius: 999, background: alpha(k.c, 0.18), border: `3px solid ${k.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>{k.el}</div>
          );
        })}
      </div>
      <Pop at={s.cueS(1, "us.") - 6} x={540} y={1120} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={C.green} size={32}>
          USE A TWO-SAMPLE t-TEST
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
