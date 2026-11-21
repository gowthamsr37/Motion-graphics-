// SCENE 11 — THE CHEAT SHEET. AVERAGES (NUMBERS): 5 rows, COUNTS (CATEGORIES): 2 rows, revealed on "Averages? One…
// Two… Three… Counts?"; a NOT NORMAL? footer; SAVE and SEND badges on their words; a SAVE THIS bookmark that drops in.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { CAT, G1, G3, SheetRow, TESTS } from "../components/Tests";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Plane: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 10px ${alpha(color, 0.6)})` }}>
    <path d="M8 46 L92 10 L66 90 L48 58 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <path d="M48 58 L92 10" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

const Badge: React.FC<{ x: number; at: number; label: string; color: string; icon: React.ReactNode }> = ({ x, at, label, color, icon }) => {
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

const Head: React.FC<{ y: number; at: number; t: string; c: string }> = ({ y, at, t, c }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.smooth);
  return <div style={{ position: "absolute", left: 96, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: c }}>{t}</div>;
};

export const S11Sheet: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s11");
  const AV = s.cueS(1, "Averages?");
  const ONE = s.cueS(1, "One");
  const TWO = s.cueS(1, "Two");
  const THREE = s.cueS(1, "Three");
  const CNT = s.cueS(1, "Counts?");
  const at = [ONE, ONE + 8, TWO, TWO + 8, THREE, CNT, CNT + 8];
  const ys = [480, 568, 656, 744, 832, 970, 1058];
  const foot = spr(s.sent(2).from - 10, theme.spring.smooth);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE CHEAT SHEET" pill="WHICH TEST?" color={G3} at={2} pillAt={s.sent(0).from + 6} />
      <Badge x={170} at={s.cueS(2, "send")} label="SEND" color={C.cyan} icon={<Plane size={26} color={C.cyan} />} />
      <Badge x={910} at={s.cueS(2, "Save")} label="SAVE" color={G3} icon={<Bookmark size={26} color={G3} />} />
      <Head y={420} at={Math.min(AV, s.sent(0).from + 10)} t="AVERAGES (NUMBERS)" c={G1} />
      <Head y={910} at={Math.min(CNT, s.sent(0).from + 16)} t="COUNTS (CATEGORIES)" c={CAT} />
      {TESTS.map((t, i) => (
        <SheetRow key={i} y={ys[i]} t={t} at={at[i]} />
      ))}
      {foot > 0.001 ? (
        <div style={{ position: "absolute", left: 90, top: 1150, width: 900, height: 80, boxSizing: "border-box", borderRadius: 22, border: `2px dashed ${alpha(G3, 0.6)}`, opacity: Math.min(1, foot * 2), display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: G3, letterSpacing: "0.14em" }}>NOT NORMAL?</span> Mann-Whitney · Wilcoxon · Kruskal-Wallis
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", opacity: Math.min(1, spr(s.cueS(2, "Save") + 4, theme.spring.smooth) * 2), transform: `scale(${1 + Math.sin(frame / 8) * 0.02})`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim }}>SCREENSHOT OR SAVE FOR YOUR INTERVIEW</div>
    </AbsoluteFill>
  );
};
