// Word-synced subtitles: one line per page, words light up as they are spoken, the current word takes the scene accent.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { captionPages } from "../timing";
import { ease } from "./Motion";

export const CAPTION_Y = 1452; // centre line, inside the 9:16 safe area (above the caption/username overlay)

export const Captions: React.FC<{ accent: (frame: number) => string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = captionPages(fps);
  const i = pages.findIndex((p, k) => frame >= p.from - 1 && frame < (pages[k + 1] && pages[k + 1].from - p.to < 4 ? pages[k + 1].from - 1 : p.to + 2));
  if (i < 0) return null;
  const page = pages[i];
  const prev = pages[i - 1];
  const chained = prev && page.from - prev.to < 4; // page follows another directly: swap without the full pop
  const p = spring({ frame: frame - page.from + 1, fps, config: theme.spring.pop });
  const next = pages[i + 1];
  const endsAlone = !next || next.from - page.to >= 4;
  const out = endsAlone ? ease(frame, [page.to - 2, page.to + 2], [0, 1], theme.ease.in) : 0;
  const col = accent(frame);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: CAPTION_Y, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          transform: `translateY(-50%) translateY(${(chained ? 6 : 18) * (1 - p)}px) scale(${(chained ? 0.97 : 0.9) + (chained ? 0.03 : 0.1) * p})`,
          opacity: Math.min(1, p * 1.6) * (1 - out),
          maxWidth: 860,
          padding: "14px 30px 16px",
          borderRadius: 24,
          background: "rgba(4, 8, 30, 0.72)",
          border: `1.5px solid ${theme.colors.edge}`,
          boxShadow: "0 18px 50px -20px rgba(0,0,0,0.8)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 13,
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        {page.words.map((w, k) => {
          const spoken = frame >= w.from - 1;
          const nextW = page.words[k + 1];
          // only one word is highlighted at a time: two scaled neighbours would eat the gap between them
          const active = spoken && frame <= Math.max(w.to, w.from + 4) && !(nextW && frame >= nextW.from - 1);
          const a = ease(frame, [w.from - 2, w.from + 3], [0, 1]);
          return (
            <span
              key={k}
              style={{
                display: "inline-block",
                color: active ? col : theme.colors.text,
                opacity: 0.42 + 0.58 * a,
                transform: `translateY(${active ? -2 : 0}px) scale(${active ? 1.05 : 1})`,
                textShadow: active ? `0 0 18px ${alpha(col, 0.55)}` : "none",
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
