// Space backdrop: deep navy gradient + deterministic star field with gentle twinkle and parallax.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number; depth: number; warm: boolean };

export const Space: React.FC<{ drift?: number; dim?: number; seed?: number }> = ({ drift = 0, dim = 1, seed = 11 }) => {
  const frame = useCurrentFrame();
  const stars = useMemo<Star[]>(() => {
    const r = rng(seed);
    return Array.from({ length: 420 }, () => {
      const big = r() < 0.06;
      return {
        x: r() * 1200 - 60,
        y: r() * 2040 - 60,
        r: big ? 1.6 + r() * 1.4 : 0.5 + r() * 1.0,
        a: big ? 0.75 + r() * 0.25 : 0.25 + r() * 0.5,
        tw: 0.04 + r() * 0.09,
        ph: r() * 6.28,
        depth: 0.3 + r() * 0.7,
        warm: r() < 0.25,
      };
    });
  }, [seed]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 40%, ${theme.colors.navyHi} 0%, ${theme.colors.navy} 45%, ${theme.colors.space} 100%)` }}>
      {/* faint milky band for depth */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(115deg, transparent 30%, rgba(90,120,200,0.07) 46%, rgba(140,120,220,0.05) 54%, transparent 70%)",
          transform: `translateX(${drift * 0.15}px)`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {stars.map((s, i) => {
          const tw = 0.7 + 0.3 * Math.sin(frame * s.tw + s.ph);
          const x = ((s.x + drift * s.depth) % 1200 + 1200) % 1200 - 60;
          return <circle key={i} cx={x} cy={s.y} r={s.r} fill={s.warm ? "#FFE9D2" : "#DCE8FF"} opacity={s.a * tw * dim} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
