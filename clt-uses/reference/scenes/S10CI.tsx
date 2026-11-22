// SCENE 10 — CONFIDENCE INTERVALS TOO. z interval x̄ ± 1.96 · σ/√n (cyan) and t interval x̄ ± t · s/√n (violet), drawn as
// two bars on one line; the t bar is a little wider: SMALL-SAMPLE t INTERVALS ARE WIDER.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Sigma, XBar } from "../components/ZKit";
import { TC, TL, ZC } from "../components/ZT";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Interval: React.FC<{ y: number; half: number; c: string; at: number; label: React.ReactNode }> = ({ y, half, c, at, label }) => {
  const frame = useCurrentFrame();
  const k = ease(frame, [at - 4, at + 18], [0, 1], theme.ease.out);
  const w = half * k;
  return (
    <>
      <div style={{ position: "absolute", left: 540 - w, top: y - 6, width: w * 2, height: 12, borderRadius: 6, background: c, boxShadow: `0 0 16px ${alpha(c, 0.6)}` }} />
      <div style={{ position: "absolute", left: 540 - w - 4, top: y - 26, width: 8, height: 52, borderRadius: 4, background: c, opacity: k }} />
      <div style={{ position: "absolute", left: 540 + w - 4, top: y - 26, width: 8, height: 52, borderRadius: 4, background: c, opacity: k }} />
      <div style={{ position: "absolute", left: 532, top: y - 12, width: 16, height: 24, borderRadius: 8, background: C.text, opacity: k }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 100, textAlign: "center", opacity: k, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap", display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>{label}</div>
    </>
  );
};

export const S10CI: React.FC = () => {
  const s = useScene("s10");
  const S0 = s.sent(0).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="CONFIDENCE INTERVALS TOO" color={TL} at={2} />
      <Interval
        y={640}
        half={260}
        c={ZC}
        at={S0 + 30}
        label={
          <>
            <span style={{ color: ZC }}>z:</span> <XBar color={C.text} /> ± 1.96 · <Sigma size={40} color={ZC} />/
            <Radical color={C.text} size={34}>
              n
            </Radical>
          </>
        }
      />
      <Interval
        y={900}
        half={320}
        c={TC}
        at={S0 + 70}
        label={
          <>
            <span style={{ color: TC }}>t:</span> <XBar color={C.text} /> ± t · <span style={{ color: TC, fontStyle: "italic" }}>s</span>/
            <Radical color={C.text} size={34}>
              n
            </Radical>
          </>
        }
      />
      <Pop at={s.sent(1).from - 4} x={540} y={1100} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={TC} size={30}>
          SMALL-SAMPLE t INTERVALS ARE A LITTLE WIDER
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
