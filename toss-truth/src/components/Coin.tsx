// A gold coin that flips end over end like a real toss. `flip` is the rotation about the horizontal
// axis (radians): the face squashes with |cos|, the reeded edge shows with |sin|, and the face
// switches between heads (crossed bats and ball) and tails (TOSS) as it turns over.
import React, { useId } from "react";
import { theme } from "../theme";

const C = theme.colors;

const Face: React.FC<{ heads: boolean; shine: number; id: string }> = ({ heads, shine, id }) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }}>
    <defs>
      <radialGradient id={`f${id}`} cx="38%" cy="30%" r="75%">
        <stop offset="0%" stopColor={C.goldHi} />
        <stop offset="42%" stopColor={C.gold} />
        <stop offset="100%" stopColor={C.goldDeep} />
      </radialGradient>
      <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset={Math.max(0, shine - 0.18)} stopColor="#fff" stopOpacity="0" />
        <stop offset={shine} stopColor="#fff" stopOpacity="0.55" />
        <stop offset={Math.min(1, shine + 0.18)} stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="98" fill={`url(#f${id})`} />
    <circle cx="100" cy="100" r="85" fill="none" stroke="#A86D0A" strokeWidth="3" opacity="0.8" />
    {Array.from({ length: 40 }).map((_, i) => {
      const a = (i / 40) * Math.PI * 2;
      return <circle key={i} cx={100 + Math.cos(a) * 92} cy={100 + Math.sin(a) * 92} r="1.9" fill="#A86D0A" opacity="0.75" />;
    })}
    {heads ? (
      <g fill="#A86D0A" stroke="#8C5806" strokeWidth="1.5">
        {[-27, 27].map((r) => (
          <g key={r} transform={`rotate(${r} 100 108)`}>
            <rect x="89" y="48" width="22" height="76" rx="8" />
            <rect x="96" y="22" width="8" height="30" rx="3" />
          </g>
        ))}
        <circle cx="100" cy="146" r="15" />
        <path d="M89 140 Q100 146 111 140 M89 152 Q100 146 111 152" fill="none" stroke={C.goldHi} strokeWidth="1.6" opacity="0.8" />
      </g>
    ) : (
      <g>
        <text x="100" y="122" textAnchor="middle" fontFamily={theme.fonts.display} fontSize="62" fill="#A86D0A" letterSpacing="2">
          TOSS
        </text>
        {[-1, 1].map((d) => (
          <path key={d} d={`M${100 + d * 22} 150 Q${100 + d * 60} 140 ${100 + d * 66} 92`} fill="none" stroke="#A86D0A" strokeWidth="5" strokeLinecap="round" />
        ))}
        <circle cx="100" cy="62" r="5" fill="#A86D0A" />
      </g>
    )}
    <circle cx="100" cy="100" r="98" fill={`url(#s${id})`} />
  </svg>
);

export const Coin: React.FC<{ size: number; flip: number; spin?: number; glow?: number; blur?: number }> = ({ size, flip, spin = 0, glow = 0, blur = 0 }) => {
  const id = useId().replace(/:/g, "");
  const c = Math.cos(flip);
  const s = Math.sin(flip);
  const sy = Math.max(0.04, Math.abs(c));
  const thick = size * 0.075;
  const shine = 0.5 + 0.45 * Math.sin(flip * 0.5 + 0.6);
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `rotate(${spin}rad)`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      {glow > 0 && <div style={{ position: "absolute", inset: -size * 0.45, borderRadius: "50%", background: `radial-gradient(circle, ${C.goldGlow} 0%, transparent 62%)`, opacity: glow }} />}
      {/* reeded edge: a darker disc behind the face, offset by the coin's thickness */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${s * thick * 0.5}px) scaleY(${sy})` }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }}>
          <circle cx="100" cy="100" r="98" fill="#8C5806" />
          <circle cx="100" cy="100" r="98" fill="none" stroke="#6E4504" strokeWidth="5" strokeDasharray="3 3" />
        </svg>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-s * thick * 0.5}px) scaleY(${sy})` }}>
        <Face heads={c >= 0} shine={shine} id={id} />
      </div>
    </div>
  );
};
