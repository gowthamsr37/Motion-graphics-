// Cover in The File style: Day 1 of 100 · WHAT IS MACHINE LEARNING? · the hook
// "You use it 12 times a day" · three headline stats · the series and handle. Key content inside the 3:4 grid crop.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Disp, Grain, Label, Paper, Seam, Serif, Vignette } from "./components/Ed";
import { config } from "./config";
import { theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Paper warm={0.5} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={28} color={C.red} spacing="0.34em">
        100 Days of ML · Day 1
      </Label>
    </div>
    <div style={{ position: "absolute", left: 80, top: 390 }}>
      <Disp size={170}>What is</Disp>
    </div>
    <div style={{ position: "absolute", left: 80, top: 570 }}>
      <Disp size={200} color={C.accent}>
        Machine
      </Disp>
    </div>
    <div style={{ position: "absolute", left: 80, top: 780 }}>
      <Disp size={200} color={C.accent}>
        Learning?
      </Disp>
    </div>
    <Seam x={80} y={1030} w={920} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 1060 }}>
      <Serif size={66} weight={900}>
        You use it <span style={{ color: C.red }}>12 times a day.</span>
      </Serif>
      <div style={{ marginTop: 6 }}>
        <Serif size={50} weight={700} color={C.ink2}>
          Do you know what it actually is?
        </Serif>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1310, display: "flex", justifyContent: "center", gap: 70 }}>
      {[
        ["12×", "A DAY"],
        ["3", "TYPES"],
        ["0", "RULES WRITTEN"],
      ].map(([v, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Disp size={96}>{v}</Disp>
          <Label size={18} color={C.mute}>
            {l}
          </Label>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1520, textAlign: "center" }}>
      <Serif size={46} weight={900}>
        {config.handle}
      </Serif>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
