// SCENE 2 — WHAT IT IS. A number line with the MEAN and a VALUE. How far apart? Not in marks (struck out) but in
// standard deviations: SD-sized blocks hop from the mean to the value → 2 SD away.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const Y = 940;
const MX = 280;
const UNIT = 230; // one SD in px
const VX = MX + 2 * UNIT;
const SD = kindColor.sd;

export const S2What: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const FAR = s.cueS(0, "far");
  const MARKS = s.cueS(1, "marks,");
  const STD = s.cueS(1, "standard");
  const line = ease(frame, [2, 18], [0, 1], theme.ease.inOut);
  const dist = ease(frame, [FAR - 2, FAR + 14], [0, 1], theme.ease.inOut);
  const strike = ease(frame, [MARKS + 4, MARKS + 12], [0, 1]);
  const hop = [0, 1].map((k) => ease(frame, [STD - 2 + k * 12, STD + 10 + k * 12], [0, 1], theme.ease.inOut));

  return (
    <AbsoluteFill>
      <Pop at={4} out={MARKS - 6} x={540} y={430} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1 }}>
          HOW FAR FROM
          <br />
          <span style={{ color: kindColor.mean, textShadow: glowText(kindColor.mean, 0.5) }}>THE MEAN?</span>
        </div>
      </Pop>
      {/* not in marks… */}
      <Pop at={MARKS - 4} out={STD - 4} x={540} y={430} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ position: "relative", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: alpha("#F3F7FF", 0.8), whiteSpace: "nowrap" }}>
          IN MARKS?
          <div style={{ position: "absolute", left: -8, top: "52%", width: `calc(${strike * 100}% + 16px)`, height: 9, borderRadius: 5, background: C.red, boxShadow: `0 0 12px ${alpha(C.red, 0.8)}` }} />
        </div>
      </Pop>
      {/* …but in standard deviations */}
      <Pop at={STD - 2} x={540} y={430} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1 }}>
          IN <span style={{ color: SD, textShadow: glowText(SD, 0.6) }}>STANDARD</span>
          <br />
          <span style={{ color: SD, textShadow: glowText(SD, 0.6) }}>DEVIATIONS</span>
        </div>
      </Pop>

      {/* the number line */}
      <div style={{ position: "absolute", left: 120, top: Y - 2.5, width: 840 * line, height: 5, borderRadius: 3, background: alpha(C.text, 0.4) }} />
      <Pop at={4} x={MX} y={Y} from="scale" cfg={theme.spring.pop}>
        <div style={{ width: 8, height: 90, borderRadius: 4, background: kindColor.mean, boxShadow: `0 0 14px ${kindColor.mean}` }} />
      </Pop>
      <Pop at={6} x={MX} y={Y + 80} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: kindColor.mean, whiteSpace: "nowrap" }}>MEAN</div>
      </Pop>
      <Pop at={10} x={VX} y={Y} from="scale" cfg={theme.spring.pop}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: C.text, boxShadow: `0 0 20px ${alpha("#F3F7FF", 0.8)}` }} />
      </Pop>
      <Pop at={12} x={VX} y={Y + 80} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>VALUE</div>
      </Pop>
      {/* how far? */}
      {dist > 0.01 && hop[0] < 0.5 ? (
        <>
          <div style={{ position: "absolute", left: MX, top: Y - 120, width: (VX - MX) * dist, height: 0, borderTop: `5px dashed ${C.text}`, opacity: 1 - hop[0] * 2 }} />
          <div style={{ position: "absolute", left: (MX + VX) / 2, top: Y - 160, transform: "translate(-50%, -50%)", opacity: dist * (1 - hop[0] * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
            HOW FAR<span style={{ color: C.yellow }}>?</span>
          </div>
        </>
      ) : null}
      {/* SD blocks hop from the mean to the value */}
      {hop.map((h, k) => {
        if (h <= 0.001) return null;
        const x0 = MX + k * UNIT;
        const arc = Math.sin(h * Math.PI) * 60;
        return (
          <div key={k} style={{ position: "absolute", left: x0 + 6, top: Y - 110 - arc, width: (UNIT - 12) * Math.min(1, h * 1.3), height: 80, borderRadius: 18, background: alpha(SD, 0.28), border: `3px solid ${SD}`, boxShadow: `0 0 18px ${alpha(SD, 0.4)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap", overflow: "hidden" }}>
            {k + 1} SD
          </div>
        );
      })}
      {(() => {
        const p = spr(STD + 30, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: "absolute", left: VX, top: Y - 250, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), padding: "8px 26px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap", boxShadow: `0 0 26px ${alpha(C.green, 0.4)}` }}>
            z = <span style={{ color: C.green }}>2</span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
