// 9:16 cover. The headline sits inside the centre 1:1 square so it survives the profile-grid crop.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Display, Kicker } from "./overlay/kit";
import { Stage3D } from "./Stage3D";
import { coverDirect } from "./three/cover";
import { theme } from "./theme";

const C = theme.colors;
const direct = (e: Parameters<typeof coverDirect>[0]) => coverDirect(e);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Stage3D time={4} direct={direct} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,7,13,0.55) 0%, rgba(4,7,13,0) 22%, rgba(4,7,13,0) 50%, rgba(4,7,13,0.78) 76%, rgba(4,7,13,0.9) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
      <div style={{ width: 90, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold})` }} />
      <Kicker color={C.white} size={30} style={{ letterSpacing: "0.42em", marginRight: "-0.42em" }}>
        Beyond the Scoreboard
      </Kicker>
      <div style={{ width: 90, height: 2, background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1066, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <Display size={150} style={{ letterSpacing: "0.005em" }}>
        DOES THE TOSS
      </Display>
      <Display size={150} color={C.gold} glow style={{ letterSpacing: "0.005em", marginTop: 4 }}>
        REALLY MATTER?
      </Display>
      <div style={{ width: 560, height: 3, margin: "26px 0 22px", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 36, letterSpacing: "0.22em", color: C.white, textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}>TESTS • ODIs • T20Is • IPL</div>
    </div>
  </AbsoluteFill>
);
