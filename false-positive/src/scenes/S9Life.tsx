// SCENE 9 — IT'S EVERYWHERE: three panels on their sentences: BANK FRAUD ALERT (card blocked… it was just you) ·
// AIRPORT SCANNER (beeps at an innocent bag) · SPAM FILTER (real email in spam); rule: RARE TARGET → MOST ALARMS FALSE.
import React from "react";
import { AbsoluteFill } from "remotion";
import { HOT } from "../components/BKit";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S9Life: React.FC = () => {
  const s = useScene("s9");
  const rows = [
    { t: "FRAUD ALERT", d: "card blocked… it was just you", c: C.red, at: s.cueS(1, "bank"), icon: <div style={{ width: 120, height: 80, borderRadius: 12, background: C.red, position: "relative" }}><div style={{ position: "absolute", left: 0, right: 0, top: 18, height: 14, background: "#111827" }} /></div> },
    { t: "AIRPORT SCANNER", d: "beeps at an innocent bag", c: C.yellow, at: s.cueS(1, "Airport"), icon: <div style={{ width: 110, height: 80, borderRadius: 12, border: `5px solid ${C.yellow}` }} /> },
    { t: "SPAM FILTER", d: "a real email lands in spam", c: C.cyan, at: s.cueS(1, "Spam"), icon: <div style={{ width: 110, height: 80, borderRadius: 8, background: C.cyan }} /> },
  ];
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={58}>it&apos;s <span style={{ color: HOT }}>everywhere</span></Txt>
      </Pop>
      {rows.map((r, i) => (
        <Pop key={r.t} x={540} y={460 + i * 230} at={r.at - 6}>
          <Panel w={960} h={200} color={r.c} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 40, padding: "0 40px" }}>
            <div style={{ width: 130, display: "flex", justifyContent: "center" }}>{r.icon}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Txt size={46} color={r.c}>{r.t}</Txt>
              <Txt size={34} font="body">{r.d}</Txt>
            </div>
          </Panel>
        </Pop>
      ))}
      <Pop x={540} y={1200} at={s.sent(2).from - 2}>
        <Pill color={HOT} size={42} solid>RARE TARGET → MOST ALARMS ARE FALSE</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
