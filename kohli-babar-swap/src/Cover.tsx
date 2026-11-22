// Cover: the title card's final frame. Key content inside the 1080×1350 grid crop (y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BigGlyph, Disp, Grain, Label, Paper, Serif, Vignette } from "./components/Ed";
import { config } from "./config";
import { theme } from "./theme";

const C = theme.colors;

const Print: React.FC<{ src: string; pos: string; frame: string; rotate: number; x: number; y: number }> = ({ src, pos, frame, rotate, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 380, height: 465, background: C.paperHi, padding: 15, boxSizing: "border-box", borderBottom: `18px solid ${frame}`, boxShadow: "0 26px 50px rgba(40,30,10,0.30)", transform: `rotate(${rotate}deg)` }}>
    <Img src={staticFile(`photos/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block" }} />
  </div>
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Paper />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={24} color={C.red} spacing="0.34em">
        {config.file}
      </Label>
    </div>
    {[
      { x: 290, name: "India", c: C.accent },
      { x: 790, name: "Pakistan", c: C.green },
    ].map((s) => (
      <div key={s.name} style={{ position: "absolute", left: s.x - 220, width: 440, top: 360, textAlign: "center" }}>
        <Disp size={46} color={s.c}>
          {s.name}
        </Disp>
        <div style={{ margin: "8px auto 0", width: 120, height: 5, background: s.c }} />
      </div>
    ))}
    <BigGlyph char="56" x={50} y={440} size={500} width={480} draw={1} fill={0} stroke={C.accent} />
    <BigGlyph char="18" x={550} y={440} size={500} width={480} draw={1} fill={0} stroke={C.green} />
    <Print src="babar-2020.jpg" pos="62% 35%" frame={C.accent} rotate={-3} x={100} y={530} />
    <Print src="kohli-wc2015.jpg" pos="38% 30%" frame={C.green} rotate={3} x={600} y={530} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1050, textAlign: "center" }}>
      <Disp size={230}>
        The <span style={{ color: C.red }}>Swap</span>
      </Disp>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 1280, textAlign: "center" }}>
      <Serif size={46} color={C.ink2}>
        What if Kohli played for Pakistan,
        <br />
        and Babar for India?
      </Serif>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center" }}>
      <Label size={24} color={C.ink} weight={900}>
        292 ODIs · 10,000 replays each
      </Label>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1700, textAlign: "center" }}>
      <Disp size={50}>{config.series}</Disp>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
