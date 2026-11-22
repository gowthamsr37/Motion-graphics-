// SCENE 10 — THE CHEAT SHEET (save moment). Five rows: icon · USE · RAW DATA (messy) · THE AVERAGE (normal) · WHAT IT GIVES
// YOU; SAVE and SEND badges drop on their words; held ~6 s.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { USES } from "../components/Uses";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Badge: React.FC<{ x: number; at: number; label: string; color: string; icon?: React.ReactNode }> = ({ x, at, label, color, icon }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.pop);
  if (p <= 0.001) return null;
  const wig = Math.sin((frame - at) / 3) * 6 * Math.max(0, 1 - (frame - at) / 30);
  return (
    <div style={{ position: "absolute", left: x, top: 286, transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, p)) * -60}px) rotate(${wig}deg) scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: alpha(color, 0.2), border: `2px solid ${color}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.text }}>
      {icon}
      {label}
    </div>
  );
};

export const S10Sheet: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s10");
  const S0 = s.sent(0).from;
  const y0 = 470, rh = 168;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE CLT CHEAT SHEET" color={C.green} at={2} />
      <Badge x={170} at={s.cueS(1, "send")} label="SEND" color={C.cyan} />
      <Badge x={910} at={s.cueS(1, "Save")} label="SAVE" color={C.green} icon={<Bookmark size={24} color={C.green} />} />
      <div style={{ position: "absolute", left: 90, top: y0 - 60, width: 900, display: "flex", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.dim, opacity: Math.min(1, spr(S0 - 4, theme.spring.smooth) * 2) }}>
        <div style={{ width: 330, paddingLeft: 110 }}>USE</div>
        <div style={{ width: 300 }}>RAW DATA, THEN AVERAGE</div>
        <div style={{ width: 270 }}>WHAT IT GIVES YOU</div>
      </div>
      {USES.map((u, i) => {
        const p = spr(S0 + i * 6, theme.spring.bouncy);
        return (
          <div key={u.n} style={{ position: "absolute", left: 90, top: y0 + i * rh, width: 900, height: rh - 16, boxSizing: "border-box", borderRadius: 24, background: `linear-gradient(90deg, ${alpha(u.c, 0.16)}, rgba(14,24,64,0.92) 40%)`, border: `2px solid ${alpha(u.c, 0.7)}`, display: "flex", alignItems: "center", opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -50}px)` }}>
            <div style={{ width: 110, display: "flex", justifyContent: "center" }}>
              <u.Icon size={70} color={u.c} />
            </div>
            <div style={{ width: 220, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: u.title.length > 12 ? 24 : 28, color: C.text }}>{u.title}</div>
            <div style={{ width: 300, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 22, lineHeight: 1.3, color: C.dim }}>
              {u.raw}
              <br />
              <span style={{ color: u.c }}>{u.avg}</span>
            </div>
            <div style={{ width: 260, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, color: C.text }}>{u.win}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
