// Word-synced subtitles. Pages of ≤4 words; the spoken word lights up exactly on its audio onset.
import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, theme } from "../theme";
import { allWords } from "../timing";

type Page = { words: { w: string; from: number; to: number }[]; from: number; to: number };

const buildPages = (fps: number): Page[] => {
  const segs = allWords(fps);
  const pages: Page[] = [];
  segs.forEach((seg, si) => {
    // split at punctuation into phrases, then cut each phrase into evenly sized pages (no orphans)
    const phrases: Page["words"][] = [];
    let cur: Page["words"] = [];
    seg.words.forEach((w) => {
      cur.push(w);
      if (/[,.?!]$/.test(w.w)) {
        phrases.push(cur);
        cur = [];
      }
    });
    if (cur.length) phrases.push(cur);
    phrases.forEach((ph) => {
      const chars = ph.reduce((n, x) => n + x.w.length + 1, -1);
      const k = Math.max(Math.ceil(ph.length / 4), Math.ceil(chars / 24));
      let i0 = 0;
      for (let j = 0; j < k; j++) {
        const i1 = Math.round(((j + 1) * ph.length) / k);
        const words = ph.slice(i0, i1);
        if (words.length) pages.push({ words, from: words[0].from - 2, to: 0 });
        i0 = i1;
      }
    });
    const next = segs[si + 1];
    // close the last page of this segment
    const segEndCap = next ? Math.min(seg.to + 12, next.from - 3) : seg.to + 24;
    for (let i = pages.length - 1; i >= 0 && pages[i].to === 0; i--) pages[i].to = segEndCap;
  });
  for (let i = 0; i < pages.length - 1; i++) pages[i].to = Math.min(pages[i].to, pages[i + 1].from);
  return pages;
};

const clean = (w: string) => w.replace(/[,.]$/, "");

export const Captions: React.FC<{ hideFrom?: number }> = ({ hideFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(() => buildPages(fps), [fps]);
  const page = pages.find((p) => frame >= p.from && frame < p.to);
  if (!page || (hideFrom !== undefined && frame >= hideFrom)) return null;
  const pin = spring({ frame: frame - page.from, fps, config: theme.spring.snappy });
  const pout = interpolate(frame, [page.to - 4, page.to], [1, 0], { easing: theme.ease.in, ...CLAMP });
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        width: 800,
        top: theme.safe.captionY - 50,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        columnGap: 15,
        opacity: pin * pout,
        transform: `translateY(${interpolate(pin, [0, 1], [16, 0])}px)`,
      }}
    >
      {page.words.map((w, i) => {
        const active = frame >= w.from - 1 && frame < (page.words[i + 1]?.from ?? page.to) - 1;
        const spoken = frame >= w.from - 1;
        const a = spring({ frame: frame - w.from + 1, fps, config: { damping: 14, stiffness: 220, mass: 0.5 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 54,
              letterSpacing: "-0.01em",
              color: spoken ? theme.colors.white : "rgba(234,242,255,0.45)",
              transform: `scale(${active ? 1 + 0.06 * a : 1})`,
              textShadow: "0 3px 0 rgba(0,0,0,0.35), 0 0 22px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)",
            }}
          >
            {clean(w.w)}
          </span>
        );
      })}
    </div>
  );
};
