// SCENE 4 — SUPERVISED COMES IN TWO FLAVOURS. Two house panels: REGRESSION (answer = a NUMBER: a dot sliding along a
// price scale to Rs 55L) and CLASSIFICATION (answer = a CATEGORY: an email dropping into the SPAM bin, not NOT SPAM);
// then yesterday's poll answered: bank + "fraud / not fraud, labelled" → SUPERVISED CLASSIFICATION ✓ (answer A).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bank, Envelope } from "../components/Doodles";
import { Header } from "../components/NB";
import { Icon, Panel, Pill, Pop, T1, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const REG = C.cyan;
const CLS = C.green;

export const S4Flavours: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const R = s.sent(1).from;
  const NUM = s.cueS(1, "number,");
  const RW = s.cueS(1, "regression.");
  const K = s.sent(2).from;
  const CAT = s.cueS(2, "category,");
  const CW = s.cueS(2, "classification.");
  const POLL = s.sent(3).from;
  const FR = s.cueS(3, "Fraud");
  const SC = s.cueS(3, "supervised");
  const slide = ease(frame, [NUM, NUM + 30], [0, 1]);
  const drop = ease(frame, [CAT + 4, CAT + 22], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill>
      <Header text="supervised · 2 flavours" at={s.sent(0).from - 4} color={T1} y={230} />
      {/* REGRESSION */}
      <Pop x={290} y={680} at={R - 6}>
        <Panel w={470} h={600} color={REG}>
          <Txt size={30} color={C.dim} font="body">answer is a</Txt>
          <Txt size={64} color={REG} glow>NUMBER</Txt>
          <div style={{ position: "relative", width: 380, height: 150, marginTop: 30 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 90, height: 6, borderRadius: 3, background: alpha(C.text, 0.5) }} />
            {["20L", "40L", "60L", "80L"].map((t, i) => (
              <div key={t} style={{ position: "absolute", left: 20 + i * 113, top: 104, transform: "translateX(-50%)", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim }}>{t}</div>
            ))}
            <div style={{ position: "absolute", left: interpolate(slide, [0, 1], [20, 20 + 113 * 1.75]), top: 93, transform: "translate(-50%, -50%)", width: 34, height: 34, borderRadius: 17, background: REG, boxShadow: `0 0 18px ${REG}` }} />
            <div style={{ position: "absolute", left: interpolate(slide, [0, 1], [20, 20 + 113 * 1.75]), top: 22, transform: "translateX(-50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap", opacity: slide }}>Rs 55L</div>
          </div>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: ease(frame, [RW - 4, RW + 6], [0, 1]) }}>
            <Txt size={30} color={C.dim} font="body">any value on a scale</Txt>
            <Pill color={REG} size={40} solid>REGRESSION</Pill>
          </div>
        </Panel>
      </Pop>
      {/* CLASSIFICATION */}
      <Pop x={790} y={680} at={K - 6}>
        <Panel w={470} h={600} color={CLS}>
          <Txt size={30} color={C.dim} font="body">answer is a</Txt>
          <Txt size={64} color={CLS} glow>CATEGORY</Txt>
          <div style={{ position: "relative", width: 380, height: 190, marginTop: 10 }}>
            <div style={{ position: "absolute", left: interpolate(drop, [0, 1], [190, 95]), top: interpolate(drop, [0, 1], [0, 92]), transform: `translate(-50%, -50%) scale(${1 - drop * 0.35})`, opacity: 1 - ease(frame, [CAT + 22, CAT + 28], [0, 1]) }}>
              <Icon size={90}>
                <Envelope x={45} y={45} s={90} at={K - 2} />
              </Icon>
            </div>
            {[
              { x: 95, t: "SPAM", c: C.red },
              { x: 285, t: "NOT SPAM", c: CLS },
            ].map((b, i) => (
              <div key={b.t} style={{ position: "absolute", left: b.x, top: 120, transform: "translateX(-50%)", width: 170, height: 70, borderRadius: "0 0 18px 18px", border: `3px solid ${b.c}`, borderTop: "none", background: alpha(b.c, i === 0 ? 0.08 + drop * 0.2 : 0.08), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text }}>{b.t}</div>
            ))}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 14, opacity: ease(frame, [CAT + 10, CAT + 18], [0, 1]) }}>
            <Pill color={C.dim} size={24}>YES / NO</Pill>
            <Pill color={C.dim} size={24}>CAT / DOG</Pill>
          </div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: ease(frame, [CW - 4, CW + 6], [0, 1]) }}>
            <Pill color={CLS} size={36} solid>CLASSIFICATION</Pill>
          </div>
        </Panel>
      </Pop>
      {/* yesterday's poll */}
      <Pop x={540} y={1170} at={POLL - 4}>
        <Txt size={30} color={C.yellow} font="body" style={{ letterSpacing: "0.18em" }}>YESTERDAY&apos;S POLL</Txt>
      </Pop>
      <Pop x={540} y={1290} at={FR - 4}>
        <Panel w={960} h={140} color={CLS} style={{ flexDirection: "row", gap: 22, padding: "0 26px", justifyContent: "flex-start" }}>
          <Icon size={100}>
            <Bank x={50} y={50} s={96} at={FR - 4} />
          </Icon>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Txt size={32} font="body">fraud / not fraud, labelled</Txt>
            <Txt size={42} color={CLS} glow style={{ opacity: ease(frame, [SC - 2, SC + 6], [0, 1]) }}>
              = SUPERVISED CLASSIFICATION
            </Txt>
          </div>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
