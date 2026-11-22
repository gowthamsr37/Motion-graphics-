// SCENE 11 — THE ONE-TAILED VERSION. NOW ONE-TAILED · H1: µB > µA; t = 3 (SAME); the one-tailed column of the t table
// → 1.860; p = 0.017 ÷ 2 = 0.0085; the right-tailed zone curve; ✓ 3 is beyond 1.860 · ✓ p < 0.05; REJECT AGAIN: BRAND B
// REALLY LASTS LONGER; SAVE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { gx, Marker } from "../components/Curve";
import { Bookmark } from "../components/Guide";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { BB, SE, StepTracker, TAIL, tGeo, TZone } from "../components/TKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = tGeo(840, 260);
const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => <sub style={{ fontSize: "0.5em", verticalAlign: "-0.25em" }}>{children}</sub>;

export const S11OneTail: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s11");
  const T3 = s.cueS(0, "3.");
  const CV = s.cueS(1, "1.860,");
  const PW = s.cueS(1, "0.0085.");
  const DEC = s.sent(2).from;
  const REJ = s.cueS(2, "reject");
  const SAVE = s.cueS(2, "Save");
  const draw = ease(frame, [T3 - 6, T3 + 20], [0, 1], theme.ease.inOut);
  const zones = ease(frame, [CV - 8, CV + 10], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={4} />
      <Pop at={s.sent(0).from - 2} x={540} y={410} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 36px", borderRadius: 999, background: alpha(TAIL, 0.18), border: `3px solid ${TAIL}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          NOW ONE-TAILED · <span style={{ color: TAIL }}>H1: µ<Sub>B</Sub> &gt; µ<Sub>A</Sub></span>
        </div>
      </Pop>
      {frame >= T3 - 8 ? <TZone g={G} p={draw} zones={zones} side="right" /> : null}
      <Marker x={gx(G, 3)} base={G.base} top={G.base - 230} p={spr(T3, theme.spring.bouncy)} color={BB} label="t = 3 (SAME)" size={26} />
      <Pop at={CV - 6} x={540} y={960} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 31, color: C.text, whiteSpace: "nowrap" }}>
          ONE-TAILED 0.05, 8 DEGREES OF FREEDOM: <span style={{ fontFamily: theme.fonts.mono, color: TAIL, textShadow: glowText(TAIL, 0.5) }}>1.860</span>
        </div>
      </Pop>
      <Pop at={PW - 6} x={540} y={1040} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          p = 0.017 ÷ 2 = <span style={{ fontFamily: theme.fonts.mono, color: TAIL, textShadow: glowText(TAIL, 0.5) }}>0.0085</span>
        </div>
      </Pop>
      {[
        { x: 300, at: DEC, t: <>3 is beyond <span style={{ color: TAIL }}>1.860</span></> },
        { x: 780, at: DEC + 12, t: <>p = 0.0085 &lt; <span style={{ color: TAIL }}>0.05</span></> },
      ].map((r, i) => (
        <Pop key={i} at={r.at - 4} x={r.x} y={1135} from="left" dist={24} cfg={theme.spring.bouncy}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 18, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(SE, 0.7)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
            <Mark kind="check" at={r.at + 4} size={30} color={SE} />
            {r.t}
          </div>
        </Pop>
      ))}
      <Pop at={REJ - 4} x={540} y={1230} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Tag color={TAIL} size={32}>
          REJECT AGAIN: BRAND B REALLY LASTS LONGER
        </Tag>
      </Pop>
      <Pop at={SAVE - 4} x={540} y={1330} from="up" dist={60} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap", transform: `rotate(${frame > SAVE + 4 ? Math.sin((frame - SAVE) / 4) * 4 * Math.max(0, 1 - (frame - SAVE) / 40) : 0}deg)` }}>
          <Bookmark size={34} color={C.green} />
          SAVE FOR YOUR INTERVIEW
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
