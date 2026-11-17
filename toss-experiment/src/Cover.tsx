// 9:16 Instagram cover. Essential text sits inside the profile-grid crop (centre 1080×1440, y 240–1680).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Vignette } from "./components/UI";
import { theme } from "./theme";
import { CoinView, StadiumView } from "./three/views";

const C = theme.colors;
// face the coin toward the camera: its flip axis must be perpendicular to the view direction
const YAW = Math.PI / 2 - Math.atan2(-0.38, 0.5);

export const Cover: React.FC = () => {
  const cam = { pos: [0.5, 1.42, -0.38] as [number, number, number], target: [0, 1.66, 0] as [number, number, number], fov: 46 };
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <StadiumView cam={cam} tod={0.6} time={4} scale={0.5} shadows={false} style={{ filter: "blur(5px)", transform: "scale(1.04)" }} />
      {/* a hint of motion: two faint ghost exposures behind the sharp coin */}
      <CoinView cam={cam} pose={{ y: 1.6, flip: 1.15, tilt: 0.12, yaw: YAW }} style={{ opacity: 0.16, filter: "blur(2px)" }} />
      <CoinView cam={cam} pose={{ y: 1.63, flip: 1.32, tilt: 0.12, yaw: YAW }} style={{ opacity: 0.28, filter: "blur(1px)" }} />
      <CoinView cam={cam} pose={{ y: 1.66, flip: 1.5, tilt: 0.12, yaw: YAW }} glow={0.35} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,6,12,0.86) 0%, rgba(4,6,12,0.55) 30%, transparent 46%, transparent 64%, rgba(4,6,12,0.82) 86%)" }} />
      <div style={{ position: "absolute", top: 300, width: 1080, textAlign: "center" }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 168, lineHeight: 0.9, color: C.cream, textShadow: "0 6px 34px rgba(0,0,0,0.75)" }}>
          DOES THE TOSS
          <br />
          <span style={{ color: C.gold, textShadow: `0 0 40px ${C.goldGlow}` }}>REALLY MATTER?</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1360, width: 1080, textAlign: "center" }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 40, letterSpacing: "0.22em", color: C.cream }}>TESTS • ODIs • T20Is • IPL</div>
        <div style={{ width: 90, height: 4, background: C.gold, margin: "30px auto 26px" }} />
        <div style={{ fontFamily: theme.fonts.display, fontSize: 84, letterSpacing: "0.03em", color: C.cream }}>BEYOND THE SCOREBOARD</div>
      </div>
      <Grain />
      <Vignette k={0.45} />
    </AbsoluteFill>
  );
};
