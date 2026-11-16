// SCENE 2 — STEP ZERO: ASK WHY. A magnifier over the outlier → OUTLIERS branches into MISTAKES and REAL BUT RARE,
// and the seven treatments drop in under their branch (fix · fill · remove | cap · transform · robust · keep & study).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LensGlyph, TREATS } from "../components/Kit";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { Chip, TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
export const OUT_HEADER = {
  parent: { label: "OUTLIERS", color: O },
  kids: [
    { label: "MISTAKES", color: kindColor.mistake },
    { label: "REAL BUT RARE", color: kindColor.rare },
  ],
};

export const S2Why: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const KIND = s.sent(1).from;
  const MIS = s.cueS(1, "mistake,");
  const PICK = s.sent(2).from;
  const END = s.duration;

  const qOut = exitP(frame, KIND - 6, 10);
  const lens = ease(frame, [4, 30], [0, 1], theme.ease.inOut);
  const chipsOut = exitP(frame, END - 10, 10);

  return (
    <AbsoluteFill>
      {/* step zero: ask why */}
      {qOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - qOut }}>
          <Pop at={2} x={540} y={420} from="up" dist={20}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.3em", color: C.dim }}>STEP 0</div>
          </Pop>
          <Pop at={6} x={540} y={540} from="up" dist={24} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 84, color: C.text, whiteSpace: "nowrap" }}>
              ASK <span style={{ color: O, textShadow: glowText(O, 0.6) }}>WHY</span>
            </div>
          </Pop>
          <div style={{ position: "absolute", left: 540 - 22, top: 900 - 22, width: 44, height: 44, borderRadius: 22, background: O, boxShadow: `0 0 26px ${alpha(O, 0.9)}`, transform: `scale(${spr(4, theme.spring.pop)})` }} />
          <div style={{ position: "absolute", left: 540 - 70 + interpolate(lens, [0, 0.5, 1], [-200, 30, 0]), top: 900 - 70 + interpolate(lens, [0, 0.5, 1], [120, -30, 0]), opacity: Math.min(1, lens * 3) }}>
            <LensGlyph size={190} color={C.text} />
          </div>
          <Pop at={20} x={540} y={1130} from="up" dist={16}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
              why is it <span style={{ color: O }}>there?</span>
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {/* the fork */}
      {frame >= KIND - 8 ? <TreeHeader {...OUT_HEADER} parentIn={KIND - 8} zoomFrom={1.4} kidsIn={MIS - 14} activeAt={99999} activeIdx={0} prevIdx={null} /> : null}
      {/* the two kinds, with examples, while the question is asked */}
      {[
        { x: 290, at: MIS - 2, col: kindColor.mistake, title: "MISTAKE?", ex: ["a typo: age 250", "a sensor glitch", "a test entry"] },
        { x: 790, at: s.cueS(1, "real") - 2, col: kindColor.rare, title: "REAL BUT RARE?", ex: ["a billionaire", "a fraud payment", "a festival spike"] },
      ].map((k) => (
        <Pop key={k.title} at={k.at} out={PICK - 8} x={k.x} y={780} from="up" dist={30} cfg={theme.spring.bouncy}>
          <div style={{ width: 400, boxSizing: "border-box", padding: "24px 26px", borderRadius: 28, background: `linear-gradient(180deg, ${alpha(k.col, 0.2)}, rgba(14,24,64,0.9))`, border: `2.5px solid ${alpha(k.col, 0.8)}`, textAlign: "center" }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: k.col, textShadow: glowText(k.col, 0.4), whiteSpace: "nowrap" }}>{k.title}</div>
            {k.ex.map((e) => (
              <div key={e} style={{ marginTop: 12, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>{e}</div>
            ))}
          </div>
        </Pop>
      ))}
      {chipsOut < 1
        ? TREATS.map((t, i) => {
            const isM = t.kind === "mistake";
            const col = isM ? kindColor.mistake : kindColor.rare;
            const row = isM ? i : i - 3;
            const x = isM ? 290 : 790;
            const at = PICK - 6 + i * 4;
            const p = spr(at, theme.spring.bouncy);
            if (p <= 0.001) return null;
            const G = t.glyph;
            return (
              <div key={t.label} style={{ position: "absolute", left: x, top: 620 + row * 110 + Math.sin(frame / 24 + i) * 3, transform: `translate(-50%, -50%) translateY(${(1 - p) * 40}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2) * (1 - chipsOut) }}>
                <Chip icon={<G size={34} color={col} />} text={`${t.n}  ${t.label}`} color={col} width={380} size={30} />
              </div>
            );
          })
        : null}
    </AbsoluteFill>
  );
};
