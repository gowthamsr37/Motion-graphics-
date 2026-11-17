import React from "react";

export const BatIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#EDE4CC" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g transform="rotate(35 50 50)" fill={color}>
      <rect x="43" y="4" width="14" height="30" rx="5" />
      <rect x="45.5" y="2" width="9" height="6" rx="2" opacity={0.7} />
      <path d="M35 34 h30 v54 q0 8 -15 8 q-15 0 -15 -8 z" />
      <rect x="47" y="40" width="6" height="46" rx="3" fill="rgba(0,0,0,0.25)" />
    </g>
  </svg>
);

export const BallIcon: React.FC<{ size?: number; color?: string; seam?: string }> = ({ size = 120, color = "#C8322A", seam = "#F3E7CF" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="36" fill={color} />
    <circle cx="50" cy="50" r="36" fill="url(#shine)" />
    <defs>
      <radialGradient id="shine" cx="35%" cy="30%" r="70%">
        <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#000" stopOpacity="0.25" />
      </radialGradient>
    </defs>
    <path d="M26 24 Q50 50 26 76" stroke={seam} strokeWidth="3" fill="none" />
    <path d="M32 22 Q56 50 32 78" stroke={seam} strokeWidth="3" fill="none" strokeDasharray="3 3" />
    <path d="M20 28 Q44 50 20 72" stroke={seam} strokeWidth="3" fill="none" strokeDasharray="3 3" />
  </svg>
);

export const DropIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "#9fd0ff" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M20 4 C26 14 32 20 32 27 a12 12 0 0 1 -24 0 C8 20 14 14 20 4 z" fill={color} opacity={0.9} />
    <ellipse cx="15" cy="26" rx="3" ry="5" fill="#fff" opacity={0.5} />
  </svg>
);
