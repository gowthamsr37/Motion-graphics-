// Word-synced captions: 1–3 words at a time, the spoken word lit, inside the 9:16 safe zone.
import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, theme } from "../theme";
import { captionPages } from "../timing";

const C = theme.colors;

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(() => captionPages(fps), [fps]);
  const page = pages.find((p) => frame >= p.from && frame < p.to);
  if (!page) return null;
  const p = spring({ frame: frame - page.from, fps, config: theme.spring.snappy });
  const out = interpolate(frame, [page.to - 3, page.to], [1, 0.0], CLAMP);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: theme.safe.captionY - 60, height: 120, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, p * 1.6) * (0.4 + 0.6 * out), transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})` }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 14 }}>
        {page.words.map((w, i) => {
          const live = frame >= w.from - 1;
          const now = frame >= w.from - 1 && frame < Math.max(w.to, w.from + 6);
          const k = spring({ frame: frame - w.from + 1, fps, config: theme.spring.bouncy, durationInFrames: 10 });
          return (
            <span
              key={i}
              style={{
                fontFamily: theme.fonts.body,
                fontWeight: 900,
                fontSize: 58,
                letterSpacing: "-0.01em",
                color: live ? C.ink : C.inkSoft,
                padding: "2px 14px 6px",
                borderRadius: 14,
                background: now ? "rgba(244,241,234,0.14)" : "transparent",
                transform: `scale(${now ? 1 + 0.06 * Math.min(1, k) : 1})`,
                textShadow: "0 4px 18px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)",
                display: "inline-block",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
