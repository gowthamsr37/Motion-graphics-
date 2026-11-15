import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

// One number plate, like the tins hung on the Adelaide Oval board.
const Tin: React.FC<{ w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, children, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      width: w,
      height: h,
      borderRadius: w * 0.05,
      background: `linear-gradient(180deg, ${theme.colors.plateHi} 0%, ${theme.colors.plate} 48%, ${theme.colors.board} 100%)`,
      boxShadow: `inset 0 0 0 2px ${theme.colors.plateEdge}, 0 ${h * 0.05}px ${h * 0.12}px ${theme.colors.shadow}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backfaceVisibility: "hidden",
      ...style,
    }}
  >
    {/* hanging hooks */}
    {[0.22, 0.78].map((x) => (
      <span
        key={x}
        style={{
          position: "absolute",
          top: h * 0.035,
          left: w * x - 5,
          width: 10,
          height: 10,
          borderRadius: 10,
          background: theme.colors.board,
          boxShadow: `inset 0 1px 0 ${theme.colors.plateEdge}`,
        }}
      />
    ))}
    {children}
  </div>
);

// A row of plates. Each changed digit flips over (old plate down, new plate up) with its own progress.
export const YearTins: React.FC<{
  prev: string;
  cur: string;
  progress: (digitIndex: number) => number;
  w: number;
  h: number;
  gap: number;
  color?: string;
  glow?: boolean;
}> = ({ prev, cur, progress, w, h, gap, color = theme.colors.primary, glow = true }) => {
  const digitStyle: React.CSSProperties = {
    fontFamily: theme.fonts.display,
    fontSize: h * 0.9,
    lineHeight: 1,
    marginTop: h * 0.06,
    color,
    textShadow: glow ? `0 0 ${h * 0.12}px ${theme.colors.glow}` : undefined,
  };
  return (
    <div style={{ display: "flex", gap }}>
      {cur.split("").map((digit, d) => {
        const old = prev[d] ?? digit;
        const p = progress(d);
        const changed = old !== digit;
        const oldAngle = interpolate(p, [0, 0.5], [0, -90], CLAMP);
        const newAngle = interpolate(p, [0.5, 1, 1.2], [90, 0, -8]);
        return (
          <div key={d} style={{ position: "relative", width: w, height: h }}>
            {changed && p < 0.5 ? (
              <Tin w={w} h={h} style={{ transform: `perspective(${h * 3}px) rotateX(${oldAngle}deg)`, transformOrigin: "50% 100%" }}>
                <span style={digitStyle}>{old}</span>
              </Tin>
            ) : (
              <Tin
                w={w}
                h={h}
                style={changed ? { transform: `perspective(${h * 3}px) rotateX(${p >= 0.5 ? newAngle : 90}deg)`, transformOrigin: "50% 0%" } : undefined}
              >
                <span style={digitStyle}>{digit}</span>
              </Tin>
            )}
          </div>
        );
      })}
    </div>
  );
};
