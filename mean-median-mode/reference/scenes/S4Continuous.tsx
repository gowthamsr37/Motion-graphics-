// SCENE 3b — NUMERICAL → CONTINUOUS. A height glides 165.0 → 165.8, a thermometer rises, a range zooms open,
// then discrete dots melt into one smooth continuous scale.
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { ease, exitP, Mark, Pop, Rolling, useSpr } from "../components/Motion";
import { Person, Thermometer } from "../components/Icons";
import { Pill, TreeHeader } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { NUM_HEADER } from "./S3Discrete";

const C = theme.colors;
const PANEL_Y = 548;
const PANEL_H = 760;

const Panel: React.FC<{ x: number; w: number; title: string; color: string; p: number; out: number }> = ({ x, w, title, color, p, out }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x,
        top: PANEL_Y,
        width: w,
        height: PANEL_H,
        borderRadius: 32,
        background: `linear-gradient(180deg, ${alpha("#173066", 0.62)}, ${alpha("#0B1240", 0.55)})`,
        border: `2px solid ${alpha(color, 0.3)}`,
        boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7)",
        opacity: p * (1 - out),
        transform: `translateY(${(1 - p) * 70}px) scale(${(0.94 + 0.06 * p) * (1 - out * 0.06)})`,
      }}
    />
    <div style={{ position: "absolute", left: x + 30, top: PANEL_Y + 26, opacity: p * (1 - out), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim }}>{title}</div>
  </>
);

// Zoom lens over the height rod: the scale scrolls smoothly under a fixed pointer.
const Lens: React.FC<{ x: number; y: number; r: number; value: number; p: number }> = ({ x, y, r, value, p }) => {
  const step = 24; // px per 0.1 cm
  const ticks = Array.from({ length: 31 }).map((_, i) => 164 + i * 0.1);
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `scale(${p})`, opacity: Math.min(1, p * 2) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "#081038", border: `4px solid ${C.green}`, boxShadow: `0 0 30px ${alpha(C.green, 0.4)}` }}>
        {ticks.map((u) => {
          const yy = r + (value - u) * step * 10;
          const major = Math.abs(u - Math.round(u)) < 0.001;
          const half = Math.abs(u * 10 - Math.round(u * 10)) < 0.001 && Math.round(u * 10) % 5 === 0;
          return (
            <React.Fragment key={u.toFixed(1)}>
              <div style={{ position: "absolute", left: 18, top: yy - 1.5, width: major ? 70 : half ? 50 : 32, height: 3, background: major ? C.text : alpha(C.text, 0.6) }} />
              {major ? <div style={{ position: "absolute", left: 96, top: yy - 16, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text }}>{Math.round(u)}</div> : null}
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: r - 2, height: 4, background: C.green, boxShadow: `0 0 12px ${C.green}` }} />
      </div>
      <div style={{ position: "absolute", left: -14, top: r - 12, width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `18px solid ${C.green}` }} />
    </div>
  );
};

export const S4Continuous: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const CONT = s.cue("continuous.");
  const H = s.sent(1).from;
  const V0 = s.cue("165");
  const V1 = s.cue("165.8.");
  const TEMP = s.sent(2).from;
  const MEAS = s.sent(3).from;
  const MEASW = s.cue("measured.");
  const ANY = s.cue("any");
  const RANGE = s.cue("range,");
  const ROUND = s.cue("round");
  const JUMP = s.cue("jumps");
  const FLOW = s.sent(6).from;
  const END = s.duration;
  const PAN = END - 12;

  const pan = ease(frame, [PAN, END], [0, 1], theme.ease.in);

  // ---- phase A: height + temperature ----
  const aOut = exitP(frame, MEAS - 6, 10);
  const lp = spr(H - 8, theme.spring.smooth);
  const rp = spr(TEMP - 10, theme.spring.smooth);
  const height = 165 + 0.8 * ease(frame, [V0, V1 + 14], [0, 1], theme.ease.inOut);
  const tempP = ease(frame, [TEMP + 2, TEMP + 84], [0, 1], theme.ease.inOut);
  const temp = 24 + 7.6 * tempP;
  const level = (temp - 15) / 25;
  const THERMO = { left: 588, top: 800, h: 450 };
  const tubeY = (lv: number) => THERMO.top + (318 / 400) * THERMO.h - ((318 - 40) / 400) * THERMO.h * lv;
  const graph = { x0: 800, x1: 985, y0: 1190, y1: 930 };
  const curve = (t: number) => {
    const x = graph.x0 + (graph.x1 - graph.x0) * t;
    const v = theme.ease.inOut(t) * 0.9 + Math.sin(t * Math.PI * 3) * 0.03;
    return [x, graph.y0 - (graph.y0 - graph.y1) * v] as const;
  };
  const pts = Array.from({ length: 41 }).map((_, i) => curve((i / 40) * tempP));
  const gPath = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

  // ---- phase B: any value in a range ----
  const bIn = frame >= MEAS - 4;
  const bOut = exitP(frame, JUMP - 8, 9);
  const L0 = 140;
  const L1 = 940;
  const vx = (u: number) => L0 + (u - 165) * (L1 - L0);
  const wobble = 165.5 + 0.38 * Math.sin((frame - ANY) / 11) + 0.08 * Math.sin((frame - ANY) / 4.3);
  const settle = ease(frame, [ROUND - 8, ROUND + 2], [0, 1], theme.ease.inOut);
  const knob = frame < ANY ? 165.5 : interpolate(settle, [0, 1], [wobble, 165.372]);
  const knobIn = spr(ANY - 2, theme.spring.pop);
  const rounded = spr(ROUND + 4, theme.spring.pop);
  const FLOATS = [
    { u: "165.25", x: 250, y: 800, d: 0 },
    { u: "165.5", x: 830, y: 795, d: 5 },
    { u: "165.371…", x: 330, y: 1162, d: 10 },
    { u: "165.8", x: 820, y: 1166, d: 15 },
    { u: "165.06", x: 570, y: 1240, d: 20 },
  ];

  // ---- phase C: steps vs flow ----
  const cIn = frame >= JUMP - 8;
  const morph = ease(frame, [FLOW - 4, FLOW + 12], [0, 1], theme.ease.inOut);
  const DOTS = [220, 380, 540, 700, 860];
  const ROW = 960;
  const hopT = (frame - JUMP) / 9;
  const roll = ease(frame, [FLOW + 10, FLOW + 52], [0, 1], theme.ease.inOut);
  let ballX = DOTS[0];
  let ballY = ROW - 46;
  if (frame < FLOW - 4) {
    if (hopT > 0) {
      const k = Math.min(3.999, hopT);
      const i = Math.floor(k);
      const f = theme.ease.soft(k - i);
      ballX = hopT >= 4 ? DOTS[4] : interpolate(f, [0, 1], [DOTS[i], DOTS[i + 1]]);
      ballY = ROW - 46 - (hopT >= 4 ? 0 : Math.sin(f * Math.PI) * 110);
    }
  } else if (frame < FLOW + 10) {
    // one long, smooth arc back to the start while the dots melt into a bar
    const t = ease(frame, [FLOW - 4, FLOW + 10], [0, 1], theme.ease.inOut);
    ballX = interpolate(t, [0, 1], [DOTS[4], DOTS[0]]);
    ballY = interpolate(t, [0, 1], [ROW - 46, ROW - 33]) - Math.sin(t * Math.PI) * 170;
  } else {
    ballX = interpolate(roll, [0, 1], [DOTS[0], DOTS[4]]);
    ballY = ROW - 33;
  }
  const labelCol = interpolateColors(morph, [0, 1], [C.cyan, C.green]);

  return (
    <AbsoluteFill style={{ transform: `translateX(${-pan * 720}px)`, opacity: 1 - pan }}>
      <TreeHeader {...NUM_HEADER} parentIn={-60} kidsIn={-60} activeAt={CONT} activeIdx={1} prevIdx={0} />

      {/* ---------- phase A ---------- */}
      {aOut < 1 ? (
        <>
          <Panel x={70} w={460} title="HEIGHT" color={C.green} p={lp} out={aOut} />
          <Panel x={550} w={460} title="TEMPERATURE" color={C.green} p={rp} out={aOut} />
          <AbsoluteFill style={{ opacity: 1 - aOut }}>
            {lp > 0.01 ? (
              <>
                <div style={{ position: "absolute", left: 300, top: 672, transform: "translate(-50%, -50%)", display: "flex", alignItems: "baseline", gap: 10, opacity: lp }}>
                  <Rolling value={height} decimals={1} height={84} size={72} color={C.text} />
                  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 38, color: C.green }}>cm</span>
                </div>
                <div style={{ position: "absolute", left: 165 - 103, top: 1286 - 412, opacity: lp, transform: `translateY(${(1 - lp) * 60}px)` }}>
                  <Person height={420} shirt={C.violet} skin={C.skin[2]} hair={C.hair[1]} blink={frame % 75 > 71} />
                </div>
                <div style={{ position: "absolute", left: 296, top: 860, width: 10, height: 1290 - 860, borderRadius: 5, background: alpha(C.green, 0.5), opacity: lp }} />
                <div style={{ position: "absolute", left: 120, top: 893, width: 196, height: 10, borderRadius: 5, background: C.green, boxShadow: `0 0 18px ${alpha(C.green, 0.7)}`, opacity: lp }} />
                <div style={{ position: "absolute", left: 312, top: 897, width: 30, borderTop: `3px dashed ${alpha(C.green, 0.9)}`, opacity: lp }} />
                <Lens x={432} y={898} r={88} value={height} p={spr(H + 4, theme.spring.bouncy)} />
              </>
            ) : null}
            {rp > 0.01 ? (
              <>
                <div style={{ position: "absolute", left: 780, top: 672, transform: "translate(-50%, -50%)", display: "flex", alignItems: "baseline", gap: 8, opacity: rp }}>
                  <Rolling value={temp} decimals={1} height={84} size={72} color={C.text} />
                  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 38, color: C.green }}>°C</span>
                </div>
                <div style={{ position: "absolute", left: THERMO.left, top: THERMO.top, opacity: rp, transform: `translateY(${(1 - rp) * 60}px)` }}>
                  <Thermometer height={THERMO.h} level={level} color={interpolateColors(tempP, [0, 1], [C.green, C.orange])} />
                </div>
                {[20, 25, 30, 35].map((d) => (
                  <React.Fragment key={d}>
                    <div style={{ position: "absolute", left: THERMO.left + 128, top: tubeY((d - 15) / 25) - 1.5, width: 18, height: 3, background: alpha(C.text, 0.6), opacity: rp }} />
                    <div style={{ position: "absolute", left: THERMO.left + 152, top: tubeY((d - 15) / 25) - 15, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: rp }}>{d}°</div>
                  </React.Fragment>
                ))}
                {/* smooth, unbroken temperature-over-time line: no gaps */}
                <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: rp }}>
                  <path d={`M${graph.x0} ${graph.y1 - 20} V${graph.y0} H${graph.x1 + 6}`} stroke={alpha(C.text, 0.4)} strokeWidth={3} fill="none" />
                  {tempP > 0.001 ? <path d={gPath} stroke={C.green} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${alpha(C.green, 0.8)})` }} /> : null}
                  {tempP > 0.001 ? <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={9} fill="#FFFFFF" /> : null}
                  <text x={graph.x1} y={graph.y0 + 34} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={700} fontSize={22} fill={C.dim}>
                    TIME →
                  </text>
                </svg>
                <Pop at={s.cue("gaps.") - 2} x={890} y={872} from="down" dist={20}>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.green, whiteSpace: "nowrap" }}>NO GAPS</div>
                </Pop>
              </>
            ) : null}
          </AbsoluteFill>
        </>
      ) : null}

      {/* ---------- phase B ---------- */}
      {bIn && bOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - bOut, transform: `scale(${1 - bOut * 0.05})` }}>
          <Pop at={MEASW - 4} x={540} y={604} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
            <Pill label="MEASURED" color={C.green} size={40} glow={0.7} />
          </Pop>
          <Pop at={ANY - 2} x={540} y={690} from="up" dist={24}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
              any value <span style={{ color: C.green }}>in a range</span>
            </div>
          </Pop>
          {(() => {
            const ln = ease(frame, [MEAS + 4, MEAS + 22], [0, 1], theme.ease.inOut);
            const fine = ease(frame, [RANGE - 4, RANGE + 14], [0, 1]);
            return (
              <>
                <div style={{ position: "absolute", left: L0, top: 988, width: (L1 - L0) * ln, height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${alpha(C.green, 0.6)}, ${C.green})`, boxShadow: `0 0 20px ${alpha(C.green, 0.5)}` }} />
                {Array.from({ length: 101 }).map((_, i) => {
                  const major = i % 10 === 0;
                  const on = major ? ease(frame, [MEAS + 8 + i * 0.25, MEAS + 14 + i * 0.25], [0, 1]) : fine * (0.5 + 0.5 * Math.sin(i * 1.3 + frame / 6) ** 2);
                  const end = i === 0 || i === 100;
                  return <div key={i} style={{ position: "absolute", left: vx(165 + i / 100) - 1.5, top: 992 - (end ? 40 : major ? 26 : 12), width: 3, height: end ? 80 : major ? 52 : 24, background: major ? C.text : alpha(C.green, 0.9), opacity: on }} />;
                })}
                {[165, 166].map((u, i) => (
                  <Pop key={u} at={MEAS + 10 + i * 4} x={vx(u)} y={1080} from="up" dist={20}>
                    <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 52, color: C.text }}>{u}</div>
                  </Pop>
                ))}
              </>
            );
          })()}
          {FLOATS.map((f, i) => (
            <Pop key={f.u} at={ANY + 4 + f.d} out={ROUND - 4} x={f.x} y={f.y + Math.sin(frame / 20 + i) * 6} from="scale" scaleFrom={0.4} cfg={theme.spring.pop}>
              <div style={{ padding: "8px 16px", borderRadius: 14, background: alpha(C.green, 0.12), border: `2px solid ${alpha(C.green, 0.45)}`, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 30, color: alpha(C.text, 0.9) }}>{f.u}</div>
            </Pop>
          ))}
          {knobIn > 0.01 ? (
            <>
              <div style={{ position: "absolute", left: vx(knob), top: 992, width: 44, height: 44, borderRadius: 22, transform: `translate(-50%, -50%) scale(${knobIn})`, background: "#FFFFFF", border: `6px solid ${C.green}`, boxShadow: `0 0 30px ${alpha(C.green, 0.9)}` }} />
              <div
                style={{
                  position: "absolute",
                  left: vx(knob),
                  top: 908,
                  transform: `translate(-50%, -50%) scale(${knobIn})`,
                  padding: "10px 18px",
                  borderRadius: 16,
                  background: C.green,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 800,
                  fontSize: 36,
                  color: C.ink,
                  whiteSpace: "nowrap",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {knob.toFixed(3)}
                {settle >= 1 ? "…" : ""}
              </div>
            </>
          ) : null}
          {rounded > 0.01 ? (
            <div style={{ position: "absolute", left: 540, top: 1205, transform: `translate(-50%, -50%) scale(${interpolate(rounded, [0, 1], [0.6, 1])})`, opacity: Math.min(1, rounded * 2), textAlign: "center" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 66, color: C.green, textShadow: glowText(C.green, 0.7), whiteSpace: "nowrap" }}>≈ 165.4 cm</div>
              <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>ROUNDED · STILL CONTINUOUS</div>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* ---------- phase C ---------- */}
      {cIn ? (
        <AbsoluteFill>
          <Pop at={JUMP - 6} x={540} y={700} from="up" dist={30}>
            <div style={{ position: "relative", width: 700, height: 130, textAlign: "center" }}>
              {[
                { t: "DISCRETE", sub: "jumps in steps", o: 1 - morph, dy: -24 * morph },
                { t: "CONTINUOUS", sub: "flows smoothly", o: morph, dy: 24 * (1 - morph) },
              ].map((l) => (
                <div key={l.t} style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: l.o, transform: `translateY(${l.dy}px)` }}>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 70, color: labelCol, textShadow: glowText(labelCol, 0.6), letterSpacing: "0.02em", lineHeight: 1.1 }}>{l.t}</div>
                  <div style={{ marginTop: 6, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 34, color: C.dim }}>{l.sub}</div>
                </div>
              ))}
            </div>
          </Pop>
          {DOTS.map((x, i) => {
            const p = spr(JUMP - 6 + i * 3, theme.spring.pop);
            const w = interpolate(morph, [0, 1], [52, 164]);
            const h = interpolate(morph, [0, 1], [52, 26]);
            const col = interpolateColors(morph, [0, 1], [C.cyan, interpolateColors(i / 4, [0, 1], [C.cyan, C.green])]);
            return (
              <React.Fragment key={x}>
                <div style={{ position: "absolute", left: x, top: ROW, width: w, height: h, borderRadius: 26, transform: `translate(-50%, -50%) scale(${p})`, background: col, boxShadow: `0 0 24px ${alpha(col, 0.7)}` }} />
                <div style={{ position: "absolute", left: x, top: ROW + 66, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 32, color: C.dim, opacity: p }}>{i + 1}</div>
              </React.Fragment>
            );
          })}
          {morph > 0.6 ? (
            <div
              style={{
                position: "absolute",
                left: DOTS[0] - 82,
                top: ROW - 13,
                width: DOTS[4] - DOTS[0] + 164,
                height: 26,
                borderRadius: 13,
                background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`,
                opacity: ease(morph, [0.6, 1], [0, 1]),
                boxShadow: `0 0 26px ${alpha(C.green, 0.6)}`,
              }}
            />
          ) : null}
          {frame >= JUMP - 2 ? (
            <>
              <div style={{ position: "absolute", left: ballX, top: ballY, width: 40, height: 40, borderRadius: 20, transform: "translate(-50%, -50%)", background: "radial-gradient(circle at 35% 30%, #FFFFFF, #CFE8FF)", boxShadow: "0 0 26px rgba(255,255,255,0.9)" }} />
              {frame >= FLOW + 8 ? (
                <div style={{ position: "absolute", left: ballX, top: ballY - 70, transform: "translate(-50%, -50%)", padding: "8px 16px", borderRadius: 14, background: C.green, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: C.ink, fontVariantNumeric: "tabular-nums", opacity: ease(frame, [FLOW + 8, FLOW + 14], [0, 1]) }}>
                  {interpolate(roll, [0, 1], [1, 5]).toFixed(2)}
                </div>
              ) : null}
            </>
          ) : null}
          <Pop at={FLOW + 54} x={540} y={1170} from="up" dist={24} cfg={theme.spring.bouncy}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
              <Mark kind="check" at={FLOW + 56} size={52} color={C.green} />
              every value in between
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
