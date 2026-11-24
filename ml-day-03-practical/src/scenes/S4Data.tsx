// SCENE 4 — STEP 2: GET THE DATA. Step bar (2). Three free-source tiles (KAGGLE · DATA.GOV.IN · YOUR SPREADSHEET), "a few
// thousand rows is plenty", then the code window: import pandas, read_csv, df.shape → (10000, 5), and a peek table.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Code } from "../components/Code";
import { Panel, Pop, Txt } from "../components/D2";
import { JargonTag, StepBar } from "../components/Steps";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S4Data: React.FC = () => {
  const s = useScene("s4");
  const SRC = s.sent(1).from;
  const LOAD = s.sent(3).from;
  const tiles = [
    { t: "KAGGLE", c: C.cyan, at: s.cueS(1, "Kaggle,") },
    { t: "DATA.GOV.IN", c: C.green, at: s.cueS(1, "data.gov.in,") },
    { t: "YOUR SHEET", c: C.orange, at: s.cueS(1, "spreadsheet.") },
  ];
  return (
    <AbsoluteFill>
      <StepBar cur={1} at={0} />
      <JargonTag i={1} at={s.cueS(0, "data")} />
      <Pop x={540} y={440} at={s.sent(0).from}>
        <Txt size={66}>get the <span style={{ color: C.violet }}>data</span></Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", gap: 18 }}>
        {tiles.map((k) => (
          <Pop key={k.t} x={0} y={0} at={k.at - 4} anchor="left" style={{ position: "relative", transform: "none" }}>
            <Panel w={300} h={120} color={k.c}>
              <Txt size={36}>{k.t}</Txt>
            </Panel>
          </Pop>
        ))}
      </div>
      <Pop x={540} y={690} at={s.sent(2).from - 2}>
        <Txt size={36} font="body">a few thousand rows is <span style={{ color: C.green }}>plenty</span></Txt>
      </Pop>
      <Pop x={540} y={960} at={LOAD - 6}>
        <Code lines={["import pandas as pd", "df = pd.read_csv(\"bangalore_flats.csv\")", "df.shape"]} at={[LOAD - 4, LOAD + 8, s.cueS(3, "10,000") - 10]} out={{ at: s.cueS(3, "10,000"), text: <span>(10000, 5)  <span style={{ color: C.dim }}>← 10,000 flats, 5 columns</span></span> }} />
      </Pop>
    </AbsoluteFill>
  );
};
