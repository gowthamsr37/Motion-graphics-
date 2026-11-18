// SCENE 3 — THE SETUP. 10,000 visitors (100 dots, 100 visitors each) split at random: 5,000 see the green button (A),
// 5,000 see the orange one (B). Random means the groups are alike in every other way → ONLY THE BUTTON DIFFERS.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AC, BC, BuyButton, NULLC, SPLIT } from "../components/AB";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const RANDOM = s.cueS(0, "random.");
  const FIVE = s.sent(1).from;
  const ORANGE = s.cueS(1, "orange");
  const ONLY = s.cueS(2, "only");
  const split = ease(frame, [RANDOM - 6, RANDOM + 30], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE SETUP" color={NULLC} at={2} />
      <Pop at={6} out={RANDOM + 20} x={540} y={410} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.mono, color: NULLC }}>10,000</span> VISITORS
        </div>
      </Pop>
      <Pop at={RANDOM + 20} x={540} y={410} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          SPLIT AT <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>RANDOM</span>
        </div>
      </Pop>
      {Array.from({ length: 100 }, (_, i) => {
        const p = spr(8 + (i % 10) + Math.floor(i / 10), theme.spring.pop);
        if (p <= 0.01) return null;
        const x0 = 540 + ((i % 10) - 4.5) * 44;
        const y0 = 760 + (Math.floor(i / 10) - 4.5) * 44;
        const side = SPLIT.side[i];
        const k = SPLIT.slot[i];
        const x1 = (side ? 780 : 300) + ((k % 5) - 2) * 44;
        const y1 = 720 + (Math.floor(k / 5) - 4.5) * 40;
        const d = Math.min(1, Math.max(0, split * 1.3 - (i % 7) * 0.05));
        const col = d > 0.5 ? (side ? BC : AC) : C.text;
        return <div key={i} style={{ position: "absolute", left: interpolate(d, [0, 1], [x0, x1]) - 13, top: interpolate(d, [0, 1], [y0, y1]) - 13, width: 26, height: 26, borderRadius: 13, background: alpha(col, d > 0.5 ? 0.85 : 0.6), boxShadow: d > 0.5 ? `0 0 10px ${alpha(col, 0.6)}` : "none", transform: `scale(${Math.min(1, p)})` }} />;
      })}
      {[
        { x: 300, at: FIVE, color: AC, l: "SEE GREEN (A)" },
        { x: 780, at: ORANGE - 6, color: BC, l: "SEE ORANGE (B)" },
      ].map((g) => {
        const p = spr(g.at - 4, theme.spring.bouncy);
        return p > 0.01 ? (
          <div key={g.l} style={{ position: "absolute", left: g.x, top: 1050, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text }}>5,000</div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: g.color, whiteSpace: "nowrap" }}>{g.l}</div>
            <BuyButton color={g.color} w={200} />
          </div>
        ) : null;
      })}
      <Pop at={ONLY - 6} x={540} y={1270} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={C.yellow} size={30}>
          ALIKE IN EVERY WAY, BUT THE BUTTON
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
