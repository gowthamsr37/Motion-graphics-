// SCENE 7 — WHERE IT'S USED. On the standard bell: about 95% of z-scores fall between −2 and 2; beyond ±3 is the
// outlier flag. Then machine learning: on one raw scale, salary drowns out age; as z-scores both share one scale.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Axis, Bell, type BellGeo, vx } from "../components/Bell";
import { Rupee } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { Bracket, ruleBands } from "../components/Rule";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = C.orange;
const G: BellGeo = { x0: 110, x1: 970, vmin: -3.8, vmax: 3.8, base: 900, peakH: 260, sigmaRef: 1 };
// five people: age in years, salary in ₹ per month
export const AGE = [22, 30, 38, 47, 60];
export const SAL = [25000, 50000, 80000, 120000, 180000];
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const sd = (a: number[]) => Math.sqrt(mean(a.map((v) => (v - mean(a)) ** 2)));
export const zs = (a: number[]) => a.map((v) => (v - mean(a)) / sd(a));
const RAW_MAX = 200000; // one shared raw ruler, 0 … 2,00,000: ages (22–60) all land at the far left
const X0 = 150;
const X1 = 930;
const rawX = (v: number) => X0 + (v / RAW_MAX) * (X1 - X0);
const zX = (z: number) => 540 + (z / 2.2) * 390;

export const S7Uses: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const W95 = s.cueS(0, "95");
  const BEY = s.sent(1).from;
  const FLAG = s.cueS(1, "flag.");
  const ML = s.sent(2).from;
  const AGEW = s.cueS(2, "age");
  const SALW = s.cueS(2, "salary");
  const ZW = s.cueS(2, "zscores,");
  const SHARE = s.cueS(2, "share");
  const band = ease(frame, [W95 - 4, W95 + 16], [0, 1], theme.ease.inOut);
  const tails = ease(frame, [BEY - 2, BEY + 12], [0, 1]);
  const bellOut = exitP(frame, ML - 10, 10);
  const mlIn = ease(frame, [ML - 2, ML + 12], [0, 1]);
  const toZ = ease(frame, [ZW - 2, ZW + 22], [0, 1], theme.ease.inOut);
  const zA = zs(AGE);
  const zS = zs(SAL);

  return (
    <AbsoluteFill>
      <SceneTitle label="WHERE IT'S USED" color={O} at={2} />
      {bellOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - bellOut }}>
          <Pop at={W95 - 4} out={BEY - 6} x={540} y={430} from="up" dist={16} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: C.violet, textShadow: glowText(C.violet, 0.5) }}>95%</span> BETWEEN <span style={{ fontFamily: theme.fonts.mono }}>-2</span> AND <span style={{ fontFamily: theme.fonts.mono }}>2</span>
            </div>
          </Pop>
          <Pop at={BEY - 2} x={540} y={430} from="up" dist={16} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
              BEYOND <span style={{ fontFamily: theme.fonts.mono }}>±3</span>: <span style={{ color: O, textShadow: glowText(O, 0.5) }}>OUTLIER FLAG</span>
            </div>
          </Pop>
          <Bell g={G} mu={0} sigma={1} p={ease(frame, [2, 20], [0, 1], theme.ease.inOut)} color={C.text} fill={0.06} width={5} bands={ruleBands([band, band])} />
          <Axis g={G} ticks={[-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: v === 0 ? "0" : `${v > 0 ? "+" : "-"}${Math.abs(v)}`, big: true, color: Math.abs(v) === 3 && tails > 0.5 ? O : Math.abs(v) === 2 && band > 0.5 ? C.violet : undefined }))} />
          <div style={{ position: "absolute", left: vx(G, 3.8) + 4, top: G.base + 34, transform: "translateY(-50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.green }}>z</div>
          <Bracket g={G} a={-2} b={2} y={G.base + 100} p={ease(frame, [W95 + 6, W95 + 20], [0, 1])} color={C.violet} label="95%" />
          {[-1, 1].map((sg) => {
            const x3 = vx(G, 3 * sg);
            const xe = vx(G, 3.8 * sg);
            return (
              <React.Fragment key={sg}>
                <div style={{ position: "absolute", left: x3 - 2, top: G.base - 280 * tails, height: 280 * tails, borderLeft: `4px dashed ${O}` }} />
                <div style={{ position: "absolute", left: Math.min(x3, xe), top: G.base - 280, width: Math.abs(xe - x3), height: 280, background: `linear-gradient(${sg < 0 ? 270 : 90}deg, ${alpha(O, 0.32)}, ${alpha(O, 0.04)})`, borderRadius: 12, opacity: tails }} />
                <div style={{ position: "absolute", left: Math.min(x3, xe), top: G.base - 7, width: Math.abs(xe - x3), height: 14, borderRadius: 7, background: O, boxShadow: `0 0 16px ${O}`, opacity: tails }} />
              </React.Fragment>
            );
          })}
          {[-1, 1].map((sg) => (
            <Pop key={sg} at={FLAG - 4} x={(vx(G, 3 * sg) + vx(G, 3.8 * sg)) / 2} y={G.base - 140} from="down" dist={12} cfg={theme.spring.pop}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: O, textShadow: glowText(O, 0.5), whiteSpace: "nowrap" }}>FLAG</div>
            </Pop>
          ))}
        </AbsoluteFill>
      ) : null}

      {/* machine learning: one shared scale */}
      {mlIn > 0.01 ? (
        <AbsoluteFill style={{ opacity: mlIn }}>
          <Pop at={ML - 2} x={540} y={410} from="up" dist={14}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>IN MACHINE LEARNING</div>
          </Pop>
          <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ opacity: 1 - toZ }}>{"RAW: SALARY DROWNS OUT AGE"}</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap", opacity: toZ }}>
            AS <span style={{ color: C.green, textShadow: glowText(C.green, 0.5) }}>Z-SCORES</span>: ONE SCALE
          </div>
          {[
            { label: "AGE", unit: "years", vals: AGE, z: zA, c: C.cyan, y: 700, at: AGEW },
            { label: "SALARY", unit: " per month", vals: SAL, z: zS, c: C.violet, y: 960, at: SALW },
          ].map((row, ri) => {
            const p = spr(ML + ri * 5, theme.spring.smooth);
            if (p <= 0.001) return null;
            return (
              <div key={row.label} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) }}>
                <div style={{ position: "absolute", left: 90, top: row.y - 130, width: 900, height: 220, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(row.c, 0.14)}, rgba(14,24,64,0.88) 45%)`, border: `2px solid ${alpha(row.c, 0.5)}` }} />
                <div style={{ position: "absolute", left: 124, top: row.y - 104, display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: row.c, whiteSpace: "nowrap" }}>
                  {row.label}
                  <span style={{ display: "flex", alignItems: "center", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 20, color: C.dim, letterSpacing: "0.08em", opacity: 1 - toZ }}>
                    ({row.label === "SALARY" ? <Rupee size={18} color={C.dim} /> : null}
                    {row.unit})
                  </span>
                </div>
                <div style={{ position: "absolute", left: X0, top: row.y + 28, width: X1 - X0, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
                {row.vals.map((v, i) => {
                  const x = interpolate(toZ, [0, 1], [rawX(v) + (row.label === "AGE" ? i * 7 : 0), zX(row.z[i])]);
                  return <div key={i} style={{ position: "absolute", left: x - 16, top: row.y - 4, width: 32, height: 32, borderRadius: 16, background: row.c, boxShadow: `0 0 12px ${alpha(row.c, 0.8)}`, transform: `scale(${ease(frame, [row.at - 4 + i * 3, row.at + 4 + i * 3], [0, 1])})` }} />;
                })}
                {row.label === "AGE" ? (
                  <div style={{ position: "absolute", left: rawX(0) + 70, top: row.y + 12, transform: "translateY(-50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.cyan, whiteSpace: "nowrap", opacity: (1 - toZ) * ease(frame, [row.at + 14, row.at + 24], [0, 1]) }}>ALL SQUASHED AT 0!</div>
                ) : null}
                {/* axis labels: raw 0 … 2,00,000, then z −2 … 2 */}
                {["0", "1,00,000", "2,00,000"].map((l, i) => (
                  <div key={l} style={{ position: "absolute", left: rawX(i * 100000), top: row.y + 60, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim, opacity: 1 - toZ }}>{l}</div>
                ))}
                {["-2", "0", "+2"].map((l, i) => (
                  <div key={l} style={{ position: "absolute", left: zX(-2 + i * 2), top: row.y + 60, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.green, opacity: toZ }}>{l}</div>
                ))}
              </div>
            );
          })}
          <Pop at={SHARE - 2} x={540} y={1200} from="up" dist={20} cfg={theme.spring.bouncy}>
            <div style={{ padding: "12px 30px", borderRadius: 999, background: alpha(C.green, 0.18), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap", boxShadow: `0 0 26px ${alpha(C.green, 0.35)}` }}>FAIR TO COMPARE</div>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
