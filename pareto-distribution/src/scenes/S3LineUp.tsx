// SCENE 3 — LINE THEM UP. Customers line up from the biggest spender (left) to the smallest (right), then split into
// 10 equal groups of 10% each.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Arrow, Crown } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { theme } from "../theme";
import { useScene } from "../timing";
import { COLX, GroupRow } from "./Groups";
import { FEW, MANY } from "./S1Hook";

const C = theme.colors;

export const S3LineUp: React.FC = () => {
  const s = useScene("s3");
  const LINE = s.cueS(0, "line");
  const SPLIT = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="LINE THEM UP" color={FEW} at={2} />
      <GroupRow appearAt={8} boxAt={SPLIT + 4} labels />
      <Pop at={LINE - 2} x={540} y={980} from="up" dist={14}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.text, whiteSpace: "nowrap" }}>
          <Crown size={34} color={FEW} />
          <span style={{ color: FEW }}>BIGGEST SPENDER</span>
          <div style={{ width: 200, height: 4, background: C.dim, borderRadius: 2 }} />
          <Arrow size={34} color={C.dim} />
          <span style={{ color: MANY }}>SMALLEST</span>
        </div>
      </Pop>
      <Pop at={SPLIT + 2} x={540} y={430} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Pill label="10 GROUPS · 10% OF CUSTOMERS EACH" color={MANY} size={30} glow={0.4} />
      </Pop>
      {/* group numbers */}
      {Array.from({ length: 10 }, (_, k) => (
        <Pop key={k} at={SPLIT + 6 + k * 2} x={COLX(k)} y={1080} from="scale" scaleFrom={0.4}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim }}>{k + 1}</div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
