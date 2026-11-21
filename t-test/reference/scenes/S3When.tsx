// SCENE 3 — WHEN TO USE IT. Checklist: TESTING AN AVERAGE · SIGMA KNOWN · OR n 30+ ticks on the words; then our case:
// SIGMA = 10 ml and n = 100 chips fly in, BOTH BOXES TICKED.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Mark, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { CLAIM, MEAN, SE, Sigma } from "../components/ZKit";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Row: React.FC<{ y: number; at: number; c: string; children: React.ReactNode; tickAt?: number }> = ({ y, at, c, children, tickAt }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y - 60, width: 900, height: 120, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(c, 0.18)}, rgba(14,24,64,0.9) 60%)`, border: `3px solid ${c}`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -50}px)`, display: "flex", alignItems: "center", gap: 26, paddingLeft: 30 }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, border: `3px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Mark kind="check" at={tickAt ?? at + 4} size={44} color={C.green} />
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 14 }}>{children}</div>
    </div>
  );
};

export const S3When: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s3");
  const T10 = s.cueS(1, "10");
  const N100 = s.cueS(1, "100.");
  const chip = (at: number) => spr(at - 4, theme.spring.pop);
  return (
    <AbsoluteFill>
      <SceneTitle label="WHEN TO USE IT" color={SE} at={2} />
      <Row y={480} at={s.cueS(0, "average")} c={MEAN}>
        TESTING AN AVERAGE
      </Row>
      <Row y={630} at={s.cueS(0, "sigma,")} c={SE}>
        <Sigma size={52} color={SE} /> IS KNOWN
      </Row>
      <Pop at={s.cueS(0, "30") - 10} x={540} y={735} from="up" dist={8}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>OR</div>
      </Pop>
      <Row y={840} at={s.cueS(0, "30")} c={CLAIM}>
        SAMPLE SIZE <span style={{ fontFamily: theme.fonts.mono, color: CLAIM }}>n = 30+</span>
      </Row>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", gap: 28 }}>
        {[
          { at: T10, el: <><Sigma size={46} color={SE} /> = <span style={{ fontFamily: theme.fonts.mono, color: SE }}>10 ml</span></>, c: SE },
          { at: N100, el: <>n = <span style={{ fontFamily: theme.fonts.mono, color: CLAIM }}>100</span></>, c: CLAIM },
        ].map((k, i) => {
          const p = chip(k.at);
          return (
            <div key={i} style={{ opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 80}px) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, display: "flex", alignItems: "center", gap: 12, padding: "16px 34px", borderRadius: 999, background: alpha(k.c, 0.18), border: `3px solid ${k.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>{k.el}</div>
          );
        })}
      </div>
      <Pop at={s.sent(1).to + 2} x={540} y={1170} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={C.green} size={32}>
          BOTH BOXES TICKED: USE A Z-TEST
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
