// SCENE 3 — THE TWO HYPOTHESES (chips example). H0 · THE NULL: nothing special, packets really average 50 g.
// H1 · THE ALTERNATIVE: something is going on, packets average LESS than 50 g. → ALWAYS START BY ASSUMING H0 IS TRUE.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, LINE, NULLC, Packet } from "./S1Hook";

const C = theme.colors;

export const HCard: React.FC<{ y: number; at: number; tag: string; name: string; c: string; line1: string; line2: React.ReactNode; icon: React.ReactNode }> = ({ y, at, tag, name, c, line1, line2, icon }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 260, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${c}`, boxShadow: `0 0 26px ${alpha(c, 0.25)}` }}>
      <div style={{ position: "absolute", left: 36, top: 30, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ padding: "6px 16px", borderRadius: 999, background: c, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.ink }}>{tag}</span>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: c, textShadow: glowText(c, 0.4) }}>{name}</span>
      </div>
      <div style={{ position: "absolute", left: 36, top: 104, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>{line1}</div>
      <div style={{ position: "absolute", left: 36, top: 168, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 32, color: C.text }}>{line2}</div>
      <div style={{ position: "absolute", right: 40, top: 130, transform: `translateY(-50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})` }}>{icon}</div>
    </div>
  );
};

export const S3Hypotheses: React.FC = () => {
  const s = useScene("s3");
  return (
    <AbsoluteFill>
      <SceneTitle label="THE TWO HYPOTHESES" color={NULLC} at={2} />
      <HCard
        y={560}
        at={s.sent(0).from}
        tag="H0"
        name="THE NULL"
        c={NULLC}
        line1="Nothing special is going on"
        line2={
          <>
            packets really average <span style={{ color: NULLC }}>50 g</span>
          </>
        }
        icon={<Packet w={110} label="50 g" color={NULLC} />}
      />
      <HCard
        y={880}
        at={s.sent(1).from}
        tag="H1"
        name="THE ALTERNATIVE"
        c={ALT}
        line1="Something is going on"
        line2={
          <>
            packets average <span style={{ color: ALT }}>LESS</span> than 50 g
          </>
        }
        icon={<Packet w={110} label="< 50" color={ALT} />}
      />
      <Pop at={s.sent(2).from - 4} x={540} y={1170} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={LINE} size={32}>
          ALWAYS START BY ASSUMING H0 IS TRUE
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
