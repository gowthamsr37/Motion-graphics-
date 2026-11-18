// Burned-in subtitles: one short phrase at a time, each word brightening as it is spoken.
// Sits in the lower safe band (above Instagram's caption block, clear of the right-hand button rail).
import React from "react";
import { interpolate } from "remotion";
import { B } from "../beats";
import { CLAMP, theme } from "../theme";
import { captions } from "../timing";
import { useTime } from "./kit";

export const SUB_Y = 1392; // centre line of the subtitle band

export const Subtitles: React.FC = () => {
  const t = useTime();
  if (t >= B.s9.lockup - 0.05) return null; // the brand lockup says it
  const c = captions.find((x) => t >= x.from - 0.06 && t < x.to);
  if (!c) return null;
  const inP = interpolate(t, [c.from - 0.06, c.from + 0.12], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const outP = interpolate(t, [c.to - 0.08, c.to], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return (
    <div style={{ position: "absolute", left: 120, width: 840, top: SUB_Y - 60, height: 120, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 840,
          textAlign: "center",
          padding: "10px 26px 14px",
          borderRadius: 18,
          background: "radial-gradient(closest-side, rgba(0,0,0,0.42), rgba(0,0,0,0))",
          opacity: inP * (1 - outP),
          transform: `translateY(${(1 - inP) * 14}px)`,
          fontFamily: theme.fonts.body,
          fontWeight: 700,
          fontSize: 52,
          lineHeight: 1.12,
          letterSpacing: "-0.01em",
          color: theme.colors.white,
          textShadow: "0 2px 12px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)",
        }}
      >
        {c.words.map((w, i) => {
          const spoken = interpolate(t, [w.s - 0.05, w.s + 0.08], [0, 1], CLAMP);
          return (
            <span key={i} style={{ opacity: 0.46 + 0.54 * spoken, display: "inline-block", transform: `translateY(${(1 - spoken) * 3}px)` }}>
              {w.w}
              {i < c.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
