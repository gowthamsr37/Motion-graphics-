// SCENE 2 — HOOK: two cards: COURSES (clean table, happy ending ✓) vs REAL PROJECTS (messy table with blanks and typos,
// "?"); then the project card: PREDICT FLAT PRICES in Bangalore · what actually goes wrong.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { House } from "../components/Doodles";
import { Icon, Panel, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const clean = [["1,200", "2", "Rs 98L"], ["850", "1", "Rs 62L"], ["1,600", "3", "Rs 1.4Cr"]];
const messy = [["1200 sqft", "2bhk", "—"], ["79 sq m", "two", "1.2 Cr?"], ["1,200", "2 BHK", "98 L"]];

const Mini: React.FC<{ rows: string[][]; bad?: boolean }> = ({ rows, bad }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {rows.map((r, i) => (
      <div key={i} style={{ display: "flex", gap: 8 }}>
        {r.map((v, j) => (
          <div key={j} style={{ width: 120, padding: "8px 0", textAlign: "center", borderRadius: 8, background: bad && (v === "—" || v.includes("?") || v.includes("m")) ? "rgba(251,92,122,0.25)" : "rgba(255,255,255,0.06)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.text }}>{v}</div>
        ))}
      </div>
    ))}
  </div>
);

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const REAL = s.cueS(0, "Real");
  const P2 = s.sent(1).from;
  const top = 1 - ease(frame, [P2 - 8, P2], [0, 1]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={520} at={2}>
          <Panel w={960} h={330} color={C.green}>
            <Txt size={40} color={C.green}>COURSES</Txt>
            <Mini rows={clean} />
            <Txt size={30} font="body">clean data, happy ending</Txt>
          </Panel>
        </Pop>
        <Pop x={540} y={930} at={REAL - 4}>
          <Panel w={960} h={330} color={C.red}>
            <Txt size={40} color={C.red}>REAL PROJECTS</Txt>
            <Mini rows={messy} bad />
            <Txt size={30} font="body">nothing like the course</Txt>
          </Panel>
        </Pop>
      </div>
      {frame >= P2 - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={300} at={P2}>
            <Txt size={44} font="body">one real project</Txt>
          </Pop>
          <Pop x={540} y={660} at={P2 + 4}>
            <Panel w={920} h={480} color={C.orange}>
              <Icon size={200}>
                <House x={100} y={100} s={190} at={P2 + 4} />
              </Icon>
              <Txt size={60}>PREDICT FLAT PRICES</Txt>
              <Txt size={54} color={C.orange} glow>in Bangalore</Txt>
            </Panel>
          </Pop>
          <Pop x={540} y={1020} at={s.cueS(1, "wrong.") - 6}>
            <Txt size={48}>…and what actually goes <span style={{ color: C.red }}>wrong</span></Txt>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
