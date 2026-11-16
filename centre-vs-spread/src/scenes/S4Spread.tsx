// SCENE 4 — WHEN SPREAD MATTERS. Consistency or risk: the river's depth ranges 1 to 8 ft (the range warns you);
// two delivery apps both average 30 min, SD 3 vs SD 15 — pick the consistent one.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Mark, Pop, useSpr } from "../components/Motion";
import { Tag, TreeHeader } from "../components/Nodes";
import { River, type RiverGeo } from "../components/River";
import { alpha, BAT_A, BAT_B, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { CVS_HEADER } from "./S3Centre";

const C = theme.colors;
const V = kindColor.spread;
const RG: RiverGeo = { x0: 100, x1: 980, surface: 690, ft: 52 };
const TX = (m: number) => 150 + (m / 60) * 780;
const APP_A = [25, 27, 29, 29, 31, 31, 33, 35]; // mean 30, SD 3
const APP_B = [5, 15, 25, 25, 35, 35, 45, 55]; // mean 30, SD 15
const ROW_A = 850;
const ROW_B = 1090;

const DepthArrow: React.FC<{ x: number; d: number; p: number; label: string; color: string }> = ({ x, d, p, label, color }) => (
  <>
    <div style={{ position: "absolute", left: x - 3, top: RG.surface, width: 6, height: d * RG.ft * p, borderRadius: 3, background: color, boxShadow: `0 0 12px ${alpha(color, 0.9)}` }} />
    <div style={{ position: "absolute", left: x + 14, top: RG.surface + d * RG.ft * p - 22, opacity: p, padding: "4px 12px", borderRadius: 12, background: "rgba(8,14,44,0.9)", border: `2px solid ${color}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{label}</div>
  </>
);

const Band: React.FC<{ y: number; sd: number; p: number; label: string }> = ({ y, sd, p, label }) => {
  if (p <= 0.001) return null;
  const half = ((TX(30 + sd) - TX(30 - sd)) / 2) * p;
  return (
    <>
      <div style={{ position: "absolute", left: TX(30) - half, top: y - 32, width: half * 2, height: 64, borderRadius: 18, background: alpha(V, 0.22), border: `3px solid ${alpha(V, 0.9)}`, boxShadow: `0 0 24px ${alpha(V, 0.4)}` }} />
      <div style={{ position: "absolute", left: TX(30), top: y - 92, transform: "translate(-50%, -50%)", opacity: p, padding: "5px 14px", borderRadius: 14, background: alpha(V, 0.22), border: `2px solid ${V}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>{label}</div>
    </>
  );
};

export const S4Spread: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const SPRW = s.cueS(0, "spread?");
  const RISK = s.sent(1).from;
  const RIVER = s.sent(2).from;
  const R1 = s.cueS(2, "1");
  const R8 = s.cueS(2, "8.");
  const WARN = s.cueS(2, "warns");
  const APPS = s.sent(3).from;
  const SD3 = s.cueS(4, "3");
  const SD15 = s.cueS(4, "15.");
  const PICK = s.sent(5).from;

  const riverIn = ease(frame, [RIVER - 10, RIVER + 6], [0, 1]);
  const riverOut = exitP(frame, APPS - 8, 10);
  const appsIn = ease(frame, [APPS - 4, APPS + 10], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <TreeHeader {...CVS_HEADER} parentIn={-60} kidsIn={-60} activeAt={SPRW} activeIdx={1} prevIdx={0} />

      <Pop at={4} out={RISK - 8} x={540} y={760} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, textAlign: "center", lineHeight: 1.08 }}>
          WHEN DOES
          <br />
          <span style={{ color: V, textShadow: glowText(V, 0.6) }}>SPREAD</span> MATTER?
        </div>
      </Pop>
      <Pop at={RISK - 2} out={RIVER - 8} x={540} y={760} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center" }}>
          <Tag color={V} size={34}>
            CONSISTENCY · RISK
          </Tag>
          <div style={{ marginTop: 22, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.text }}>
            How reliable? <span style={{ color: V }}>How risky?</span>
          </div>
        </div>
      </Pop>

      {/* the river: its range warns you */}
      {riverIn > 0.01 && riverOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - riverOut }}>
          <River g={RG} p={riverIn} avg={0.4} personIn={riverIn} worried={frame >= WARN} deepGlow={ease(frame, [WARN - 4, WARN + 8], [0, 1])} />
          <DepthArrow x={RG.x0 + 0.08 * (RG.x1 - RG.x0)} d={1.1} p={ease(frame, [R1 - 4, R1 + 8], [0, 1])} label="1 FT" color={V} />
          <DepthArrow x={RG.x0 + 0.56 * (RG.x1 - RG.x0)} d={8} p={ease(frame, [R8 - 4, R8 + 12], [0, 1])} label="8 FT" color={C.orange} />
          <Pop at={WARN - 2} x={540} y={600} from="down" dist={20} cfg={theme.spring.bouncy}>
            <Tag color={V} size={32}>
              RANGE: 1 TO 8 FT
            </Tag>
          </Pop>
          <Pop at={WARN + 4} x={RG.x0 + 0.18 * (RG.x1 - RG.x0) + 88} y={RG.surface - 180} from="down" dist={14} cfg={theme.spring.pop}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: C.red, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38 }}>!</div>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {/* two delivery apps */}
      {appsIn > 0.01 ? (
        <AbsoluteFill style={{ opacity: appsIn }}>
          {[
            { y: ROW_A, name: "APP A", data: APP_A, col: BAT_A, at: APPS },
            { y: ROW_B, name: "APP B", data: APP_B, col: BAT_B, at: APPS + 6 },
          ].map((r) => (
            <React.Fragment key={r.name}>
              <Pop at={r.at - 2} x={200} y={r.y - 96} from="left" dist={24}>
                <div style={{ padding: "6px 16px", borderRadius: 999, background: alpha(r.col, 0.14), border: `2px solid ${alpha(r.col, 0.8)}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.text }}>{r.name}</div>
              </Pop>
              <div style={{ position: "absolute", left: TX(0) - 20, top: r.y - 2, width: TX(60) - TX(0) + 40, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
              {[0, 15, 30, 45, 60].map((m) => (
                <div key={m} style={{ position: "absolute", left: TX(m), top: r.y + 32, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.dim }}>{m}m</div>
              ))}
              {r.data.map((t, i) => {
                const p = spr(r.at + 2 + i * 2, theme.spring.pop);
                if (p <= 0.001) return null;
                const up = i > 0 && r.data[i - 1] === t ? 1 : 0;
                return <div key={i} style={{ position: "absolute", left: TX(t) - 15, top: r.y - 15 - up * 34, width: 30, height: 30, borderRadius: 15, background: r.col, boxShadow: `0 0 14px ${alpha(r.col, 0.8)}`, transform: `scale(${p})`, zIndex: 3 }} />;
              })}
            </React.Fragment>
          ))}
          <div style={{ position: "absolute", left: TX(30) - 2, top: ROW_A - 120, height: ROW_B - ROW_A + 160, borderLeft: `4px dashed ${alpha(C.text, 0.7)}` }} />
          <Pop at={APPS + 10} x={TX(30)} y={ROW_A - 150} from="down" dist={16}>
            <div style={{ padding: "6px 16px", borderRadius: 14, background: "rgba(8,14,44,0.9)", border: `2px solid ${alpha(C.text, 0.6)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>BOTH AVERAGE 30 MIN</div>
          </Pop>
          <Band y={ROW_A} sd={3} p={spr(SD3 - 2, theme.spring.bouncy)} label="SD 3 MIN" />
          <Band y={ROW_B} sd={15} p={spr(SD15 - 2, theme.spring.bouncy)} label="SD 15 MIN" />
          <Pop at={PICK - 2} x={830} y={ROW_A - 96} from="right" dist={30} cfg={theme.spring.bouncy}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, boxShadow: `0 0 26px ${alpha(C.green, 0.5)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text }}>
              <Mark kind="check" at={PICK} size={34} color={C.green} width={13} />
              PICK ME
            </div>
          </Pop>
          <Burst at={PICK} x={830} y={ROW_A - 96} color={C.green} count={14} radius={140} seed={9} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
