// Notebook subtitles: handwritten words in ink on a torn strip of paper; spoken words go from faint pencil to full ink,
// and the word being spoken gets a yellow marker swipe behind it.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { captionPages } from "../timing";
import { ease } from "./Motion";
import { hand, nb, theme } from "../theme";

export const CAPTION_Y = 1462;

export const NBCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = captionPages(fps);
  const i = pages.findIndex((p, k) => frame >= p.from - 1 && frame < (pages[k + 1] && pages[k + 1].from - p.to < 4 ? pages[k + 1].from - 1 : p.to + 2));
  if (i < 0) return null;
  const page = pages[i];
  const prev = pages[i - 1];
  const chained = prev && page.from - prev.to < 4;
  const p = spring({ frame: frame - page.from + 1, fps, config: theme.spring.pop });
  const next = pages[i + 1];
  const endsAlone = !next || next.from - page.to >= 4;
  const out = endsAlone ? ease(frame, [page.to - 2, page.to + 2], [0, 1], theme.ease.in) : 0;
  const tilt = ((i * 37) % 5) - 2; // each page sits at a slightly different angle, like torn strips
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: CAPTION_Y, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          transform: `translateY(-50%) translateY(${(chained ? 4 : 14) * (1 - p)}px) rotate(${tilt * 0.35}deg) scale(${(chained ? 0.98 : 0.92) + (chained ? 0.02 : 0.08) * p})`,
          opacity: Math.min(1, p * 1.6) * (1 - out),
          maxWidth: 880,
          padding: "10px 30px 14px",
          background: "#FFFDF6",
          boxShadow: "0 10px 22px -12px rgba(70, 50, 20, 0.5), 0 1px 2px rgba(70,50,20,0.2)",
          clipPath: "polygon(0% 6%, 4% 0%, 9% 5%, 15% 1%, 22% 6%, 30% 0%, 37% 5%, 45% 1%, 52% 6%, 60% 0%, 67% 4%, 75% 0%, 82% 5%, 90% 1%, 96% 6%, 100% 2%, 100% 94%, 96% 100%, 89% 95%, 82% 100%, 74% 96%, 66% 100%, 58% 95%, 50% 100%, 42% 95%, 34% 100%, 26% 96%, 18% 100%, 10% 95%, 4% 100%, 0% 95%)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 14,
          fontFamily: hand.body,
          fontSize: 54,
          lineHeight: 1.18,
        }}
      >
        {page.words.map((w, k) => {
          const spoken = frame >= w.from - 1;
          const nextW = page.words[k + 1];
          const active = spoken && frame <= Math.max(w.to, w.from + 4) && !(nextW && frame >= nextW.from - 1);
          const a = ease(frame, [w.from - 2, w.from + 3], [0, 1]);
          const hl = active ? ease(frame, [w.from - 2, w.from + 3], [0, 1]) : 0;
          return (
            <span key={k} style={{ position: "relative", display: "inline-block", color: nb.ink, opacity: 0.38 + 0.62 * a }}>
              <span style={{ position: "absolute", left: -5, right: -5, top: "26%", bottom: "4%", background: nb.yellow, opacity: 0.9 * hl, transform: `scaleX(${hl}) rotate(-1.5deg)`, transformOrigin: "left center", borderRadius: "5px 10px 6px 12px", mixBlendMode: "multiply" }} />
              <span style={{ position: "relative" }}>{w.w}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
