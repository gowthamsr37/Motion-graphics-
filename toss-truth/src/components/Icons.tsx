// Glyphs drawn in theme colours (no emoji).
import React from "react";
import { theme } from "../theme";

const C = theme.colors;

export const Check: React.FC<{ size?: number; color?: string; draw?: number }> = ({ size = 40, color = C.mint, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M8 21 L17 30 L33 11" fill="none" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
  </svg>
);

export const Cross: React.FC<{ size?: number; color?: string; draw?: number }> = ({ size = 40, color = C.red, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M10 10 L30 30" fill="none" stroke={color} strokeWidth="5.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, draw * 2)} />
    <path d="M30 10 L10 30" fill="none" stroke={color} strokeWidth="5.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.max(0, draw * 2 - 1)} />
  </svg>
);

export const Pin: React.FC<{ size?: number; color?: string }> = ({ size = 44, color = C.red }) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <path d="M22 41 C22 41 8 26 8 17 A14 14 0 0 1 36 17 C36 26 22 41 22 41 Z" fill={color} />
    <circle cx="22" cy="17" r="5.5" fill={C.sky} />
  </svg>
);

export const Trophy: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = C.gold }) => (
  <svg width={size} height={size} viewBox="0 0 90 90">
    <path d="M27 12 H63 V34 A18 18 0 0 1 27 34 Z" fill={color} />
    <path d="M27 18 H14 Q13 36 30 42 M63 18 H76 Q77 36 60 42" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    <rect x="41" y="51" width="8" height="14" fill={color} />
    <rect x="28" y="65" width="34" height="8" rx="2" fill={color} />
    <rect x="23" y="73" width="44" height="8" rx="2" fill={color} />
    <path d="M36 18 Q36 34 44 39" fill="none" stroke={C.goldHi} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
  </svg>
);

export const Ball: React.FC<{ size?: number; spin?: number }> = ({ size = 80, spin = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ transform: `rotate(${spin}deg)` }}>
    <defs>
      <radialGradient id="ballg" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#F07A6E" />
        <stop offset="55%" stopColor="#C2342C" />
        <stop offset="100%" stopColor="#6E1714" />
      </radialGradient>
    </defs>
    <circle cx="40" cy="40" r="36" fill="url(#ballg)" />
    <path d="M22 9 Q40 40 22 71 M58 9 Q40 40 58 71" fill="none" stroke="#F5E6D0" strokeWidth="2.4" strokeDasharray="3 3" opacity="0.9" />
  </svg>
);

export const Lock: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = C.inkDim }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <rect x="8" y="18" width="24" height="18" rx="4" fill={color} />
    <path d="M13 18 V13 A7 7 0 0 1 27 13 V18" fill="none" stroke={color} strokeWidth="4" />
  </svg>
);

export const Arrow: React.FC<{ size?: number; color?: string }> = ({ size = 60, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <path d="M30 8 V48 M14 34 L30 50 L46 34" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
