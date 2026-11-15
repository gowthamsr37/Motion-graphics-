import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

// One tin number plate, hung on two hooks like the Adelaide board's.
const Tin: React.FC<{ w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, children, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      width: w,
      height: h,
      borderRadius: Math.max(3, w * 0.05),
      background: `linear-gradient(180deg, ${theme.colors.plateHi} 0%, ${theme.colors.plate} 50%, ${theme.colors.board} 100%)`,
      boxShadow: `inset 0 0 0 2px ${theme.colors.panelEdge}, 0 ${h * 0.05}px ${h * 0.12}px ${theme.colors.shadow}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backfaceVisibility: "hidden",
      ...style,
    }}
  >
    {w > 30 &&
      [0.24, 0.76].map((x) => (
        <span
          key={x}
          style={{
            position: "absolute",
            top: h * 0.04,
            left: w * x - Math.max(3, w * 0.04),
            width: Math.max(6, w * 0.08),
            height: Math.max(6, w * 0.08),
            borderRadius: 10,
            background: theme.colors.board,
            boxShadow: `inset 0 1px 0 ${theme.colors.panelEdge}`,
          }}
        />
      ))}
    {children}
  </div>
);

const narrow = (c: string) => c === "." || c === "*" || c === " " || c === ":";

// A row of plates. Each changed character flips over (old plate folds down, new plate swings up).
export const Plates: React.FC<{
  text: string;
  prev?: string;
  progress?: (i: number) => number;
  w: number;
  h: number;
  gap?: number;
  color?: string;
  glow?: string;
  glowOn?: number;
  blur?: number; // motion blur while digits spin
}> = ({ text, prev, progress = () => 1, w, h, gap = 10, color = theme.colors.cream, glow, glowOn = 1, blur = 0 }) => {
  const style = (c: string): React.CSSProperties => ({
    fontFamily: theme.fonts.display,
    fontSize: h * (c === "*" ? 0.7 : 0.9),
    lineHeight: 1,
    marginTop: c === "*" ? -h * 0.18 : h * 0.06,
    color,
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
    textShadow: glow ? `0 0 ${h * 0.14 * glowOn}px ${glow}` : `0 1px 0 ${theme.colors.black}`,
  });
  return (
    <div style={{ display: "flex", gap }}>
      {text.split("").map((ch, i) => {
        const pw = narrow(ch) ? w * 0.42 : w;
        const old = prev?.[i] ?? ch;
        const p = progress(i);
        const changed = old !== ch;
        const oldA = interpolate(p, [0, 0.5], [0, -90], CLAMP);
        const newA = interpolate(p, [0.5, 1, 1.2], [90, 0, -8]);
        return (
          <div key={i} style={{ position: "relative", width: pw, height: h }}>
            {changed && p < 0.5 ? (
              <Tin w={pw} h={h} style={{ transform: `perspective(${h * 3}px) rotateX(${oldA}deg)`, transformOrigin: "50% 100%" }}>
                <span style={style(old)}>{old === " " ? "" : old}</span>
              </Tin>
            ) : (
              <Tin w={pw} h={h} style={changed ? { transform: `perspective(${h * 3}px) rotateX(${p >= 0.5 ? newA : 90}deg)`, transformOrigin: "50% 0%" } : undefined}>
                <span style={style(ch)}>{ch === " " ? "" : ch}</span>
              </Tin>
            )}
          </div>
        );
      })}
    </div>
  );
};
