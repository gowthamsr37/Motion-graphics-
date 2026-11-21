// SCENE 11 — THE ONE-TAILED VERSION. ONE-TAILED · H1: µ < 200. z = −2 (same); p = LEFT TAIL ONLY = 0.0228 (NO
// DOUBLING); the one-tailed zone curve with the critical value −1.645 (all 5% on the left); z = −2 beyond it, two checks,
// REJECT AGAIN: THE MACHINE IS UNDER-FILLING, and a SAVE bookmark.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { gx, Marker } from "../components/Curve";
import { Bookmark } from "../components/Guide";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { MEAN, SE, StepTracker, TAIL, zGeo } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ZoneCurve } from "./S9Critical";

const C = theme.colors;
const G = zGeo(840, 260);

export const S11OneTail: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s11");
  const ZW = s.sent(1).from;
  const PW = s.cueS(1, "0.0228.");
  const CV = s.cueS(2, "-1.645.");
  const DEC = s.sent(3).from;
  const REJ = s.cueS(3, "Reject");
  const SAVE = s.cueS(3, "Save");
  const draw = ease(frame, [ZW - 4, ZW + 24], [0, 1], theme.ease.inOut);
  const zones = ease(frame, [s.cueS(2, "left") - 6, s.cueS(2, "left") + 12], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={4} />
      <Pop at={s.sent(0).from - 2} x={540} y={410} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 36px", borderRadius: 999, background: alpha(TAIL, 0.18), border: `3px solid ${TAIL}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          NOW ONE-TAILED · <span style={{ color: TAIL }}>H1: µ &lt; 200</span>
        </div>
      </Pop>
      {frame >= ZW - 6 ? <ZoneCurve g={G} p={draw} zones={zones} oneTail /> : null}
      <Marker x={gx(G, -2)} base={G.base} top={G.base - 250} p={spr(ZW + 4, theme.spring.bouncy)} color={MEAN} label="z = −2 (SAME)" size={26} />
      <Pop at={PW - 6} x={540} y={960} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          p = LEFT TAIL ONLY = <span style={{ fontFamily: theme.fonts.mono, color: TAIL, textShadow: glowText(TAIL, 0.5) }}>0.0228</span> <span style={{ fontSize: 26, color: C.dim }}>(NO DOUBLING)</span>
        </div>
      </Pop>
      <Pop at={CV - 6} x={540} y={1040} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
          CRITICAL VALUE = <span style={{ fontFamily: theme.fonts.mono, color: TAIL, textShadow: glowText(TAIL, 0.5) }}>−1.645</span>
        </div>
      </Pop>
      {[
        { y: 1125, at: DEC, t: <>−2 is beyond <span style={{ color: TAIL }}>−1.645</span></> },
        { y: 1200, at: s.cueS(3, "p"), t: <>p = 0.0228 &lt; <span style={{ color: TAIL }}>0.05</span></> },
      ].map((r, i) => (
        <Pop key={i} at={r.at - 4} x={i === 0 ? 300 : 780} y={1135} from="left" dist={24} cfg={theme.spring.bouncy}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 18, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(SE, 0.7)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
            <Mark kind="check" at={r.at + 4} size={30} color={SE} />
            {r.t}
          </div>
        </Pop>
      ))}
      <Pop at={REJ - 4} x={540} y={1230} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Tag color={TAIL} size={32}>
          REJECT AGAIN: THE MACHINE IS UNDER-FILLING
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
