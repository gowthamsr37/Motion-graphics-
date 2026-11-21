// SCENE 9 — METHOD 2, THE CRITICAL VALUE (table: area → z). 5% → 2.5% PER TAIL; the 0.0250 cell lights, then its row
// (−1.9) and column (0.06): −1.96 = THE CRITICAL VALUE. Then the table gives way to the curve: the CRITICAL REGION
// (REJECTION REGION) beyond ±1.96 in orange, total area = ALPHA = 5%, and the middle 95% FAIL TO REJECT.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bracket, FnCurve, gx, type Geo, ValueAxis } from "../components/Curve";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { CLAIM, SE, StepTracker, TAIL, zf, ZFMAX, zGeo, ZTable } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

// the curve split into REJECT · FAIL TO REJECT · REJECT; p animates the draw, z the zone labels
export const ZoneCurve: React.FC<{ g: Geo; p: number; zones: number; cut?: number; oneTail?: boolean; labels?: boolean }> = ({ g, p, zones, cut = 1.96, oneTail = false, labels = true }) => {
  const left = oneTail ? 1.645 : cut;
  return (
    <>
      <FnCurve g={g} f={zf} fmax={ZFMAX} p={p} color={CLAIM} fill={0.1} bands={[{ a: -3.6, b: -left, color: TAIL, opacity: 0.7, p: zones }, ...(oneTail ? [] : [{ a: cut, b: 3.6, color: TAIL, opacity: 0.7, p: zones }]), { a: -left, b: oneTail ? 3.6 : cut, color: SE, opacity: 0.18, p: zones }]} />
      <ValueAxis g={g} p={p} ticks={[{ v: -left, label: oneTail ? "−1.645" : "−1.96", color: TAIL, big: true }, { v: 0, label: "0" }, ...(oneTail ? [] : [{ v: cut, label: "+1.96", color: TAIL, big: true }])]} />
      {labels ? (
        <>
          <div style={{ position: "absolute", left: gx(g, -2.9), top: g.base - g.h * 0.55, transform: "translateX(-50%)", opacity: zones, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 19, lineHeight: 1.25, letterSpacing: "0.1em", color: TAIL }}>REJECT<br />{oneTail ? "5%" : "2.5%"}</div>
          {oneTail ? null : <div style={{ position: "absolute", left: gx(g, 2.9), top: g.base - g.h * 0.55, transform: "translateX(-50%)", opacity: zones, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 19, lineHeight: 1.25, letterSpacing: "0.1em", color: TAIL }}>REJECT<br />2.5%</div>}
          <div style={{ position: "absolute", left: gx(g, oneTail ? 0.6 : 0), top: g.base - g.h * 0.42, transform: "translateX(-50%)", opacity: zones, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 19, lineHeight: 1.25, letterSpacing: "0.1em", color: SE }}>FAIL TO REJECT<br />{oneTail ? "95%" : "95%"}</div>
        </>
      ) : null}
    </>
  );
};

const G = zGeo(1060, 300);

export const S9Critical: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const HALF = s.cueS(1, "2.5%");
  const FIND = s.cueS(1, "0.0250");
  const CUT = s.cueS(1, "-1.96.");
  const CV = s.cueS(1, "critical");
  const REG = s.sent(2).from;
  const RR = s.cueS(2, "rejection");
  const AREA = s.cueS(2, "alpha,");
  const MID = s.cueS(2, "95%");
  const tblOut = exitP(frame, REG - 10, 12);
  const draw = ease(frame, [REG - 4, REG + 24], [0, 1], theme.ease.inOut);
  const zones = ease(frame, [s.cueS(2, "critical") - 6, s.cueS(2, "critical") + 12], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={3} />
      <Pop at={s.sent(0).from - 2} x={540} y={400} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>
          METHOD 2 · CRITICAL VALUE · TABLE: <span style={{ color: TAIL }}>AREA → z</span>
        </div>
      </Pop>
      {tblOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - tblOut }}>
          <ZTable x={540} y={450} p={Math.min(1, spr(s.sent(0).from + 4, theme.spring.smooth))} row={2} col={6} rowP={ease(frame, [CUT - 10, CUT], [0, 1])} colP={ease(frame, [CUT - 6, CUT + 4], [0, 1])} cell={[2, 6]} cellP={ease(frame, [FIND - 6, FIND + 6], [0, 1])} />
          <Pop at={HALF - 4} x={540} y={810} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
              ALPHA 5% ÷ 2 = <span style={{ fontFamily: theme.fonts.mono, color: TAIL }}>0.0250</span> PER TAIL
            </div>
          </Pop>
          <Pop at={CUT - 4} x={540} y={900} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
              ROW −1.9 + COLUMN 0.06 = <span style={{ fontFamily: theme.fonts.mono, color: TAIL, textShadow: glowText(TAIL, 0.6) }}>−1.96</span>
            </div>
          </Pop>
          <Pop at={CV - 4} x={540} y={1000} from="up" dist={12} cfg={theme.spring.bouncy}>
            <div style={{ padding: "10px 30px", borderRadius: 999, background: alpha(TAIL, 0.2), border: `3px solid ${TAIL}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
              THE <span style={{ color: TAIL }}>CRITICAL VALUE</span>
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= REG - 6 ? (
        <>
          <Pop at={REG + 2} x={540} y={520} from="up" dist={12} cfg={theme.spring.bouncy}>
            <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap", lineHeight: 1.15 }}>
              THE <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.5) }}>CRITICAL REGION</span>
              <div style={{ fontSize: 28, color: C.dim }}>(ALSO CALLED THE REJECTION REGION)</div>
            </div>
          </Pop>
          <ZoneCurve g={G} p={draw} zones={zones} />
          <Bracket x0={gx(G, -3.6)} x1={gx(G, -1.96)} y={G.base + 70} p={spr(AREA - 6, theme.spring.bouncy)} color={TAIL} down />
          <Bracket x0={gx(G, 1.96)} x1={gx(G, 3.6)} y={G.base + 70} p={spr(AREA - 6, theme.spring.bouncy)} color={TAIL} down />
          <Pop at={AREA - 4} x={540} y={1190} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
              2.5% + 2.5% = <span style={{ color: TAIL }}>ALPHA = 5%</span>
            </div>
          </Pop>
          <Pop at={MID - 4} x={540} y={1270} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: SE, whiteSpace: "nowrap" }}>MIDDLE 95%: FAIL TO REJECT H0</div>
          </Pop>
          <div style={{ display: "none" }}>{RR}</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
