// Cover: a film poster. Key content inside the 1080×1350 grid crop (y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Disp, Grain, Label, Paper, Seam, Serif, Vignette } from "./components/Ed";
import { config } from "./config";
import { theme } from "./theme";

const C = theme.colors;
const cut = (src: string, style: React.CSSProperties) => (
  <Img src={staticFile(`photos/${src}`)} style={{ position: "absolute", filter: "drop-shadow(0 24px 30px rgba(40,30,10,0.3))", WebkitMaskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)", ...style }} />
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Paper warm={0.5} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={24} color={C.red} spacing="0.34em">
        Australia v India · 9–13 Dec 2014
      </Label>
    </div>
    {cut("kohli-chest-cut.png", { left: 70, top: 380, height: 860 })}
    {cut("lyon-stump-cut.png", { right: 70, top: 360, height: 880 })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center" }}>
      <Disp size={110}>The</Disp>
      <div style={{ marginTop: -8 }}>
        <Disp size={200} color={C.accent}>
          Adelaide
        </Disp>
      </div>
      <div style={{ marginTop: -8 }}>
        <Disp size={110}>Test</Disp>
      </div>
    </div>
    <Seam x={200} y={1556} w={680} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1574, textAlign: "center" }}>
      <Serif size={40} color={C.ink2}>
        Five days that had everything
      </Serif>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1690, textAlign: "center" }}>
      <Label size={22} color={C.mute}>
        For Phillip Hughes · 63* · {config.series}
      </Label>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
