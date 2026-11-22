// The presenter: an original illustrated host in the paper-and-ink style, lip-synced to the narration.
// Mouth opening/shape come from src/mouth.json (analysis/mouth.py); blinks, brow lifts on spoken numbers,
// glances up at the chart when a scene starts, and a gentle head sway are computed per frame.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import mouth from "../mouth.json";
import { theme } from "../theme";
import { captionWords } from "../timing";
import { CLAMP } from "./Ed";

const C = theme.colors;
const SKIN = "#C98F6B", SKIN_SH = "#B27654", SKIN_LINE = "#8E5840";
const HAIR = "#1D1922", HAIR_HI = "#3B3344";
const LIP = "#B4505B", LIP_DK = "#7C2836", MOUTH_IN = "#4A1820";
const GOLD = "#E3A63C";

// deterministic blink times (every ~3-5 s)
const blinkStarts = (() => {
  const out: number[] = [];
  let f = 40, s = 7;
  while (f < 20000) {
    out.push(f);
    s = (s * 9301 + 49297) % 233280;
    f += 95 + Math.floor((s / 233280) * 70);
  }
  return out;
})();

const Mouth: React.FC<{ open: number; shape: number; smile: number }> = ({ open, shape, smile }) => {
  const cx = 200, cy = 262;
  const closed = shape === 3;
  const o = closed ? 0 : open;
  const w = shape === 1 ? 52 : shape === 2 ? 34 + 8 * (1 - o) : 46;
  const h = o * (shape === 2 ? 17 : shape === 1 ? 12 : 19) + (shape === 4 ? 2.5 : 0);
  const L = cx - w / 2, R = cx + w / 2;
  const top = cy + 1;
  const corner = -2.5 * smile;
  const inner = `M ${L + 2} ${top + corner} Q ${cx} ${top + 2 * h} ${R - 2} ${top + corner} Q ${cx} ${top + 1.2} ${L + 2} ${top + corner} Z`;
  const upper = `M ${L} ${top + corner} C ${cx - w / 3} ${cy - 7} ${cx - 6} ${cy - 9} ${cx} ${cy - 5.5} C ${cx + 6} ${cy - 9} ${cx + w / 3} ${cy - 7} ${R} ${top + corner} Q ${cx} ${top + 3.5} ${L} ${top + corner} Z`;
  const lower = `M ${L + 1} ${top + corner} Q ${cx} ${top + 2 * h} ${R - 1} ${top + corner} Q ${cx} ${top + 2 * h + 21} ${L + 1} ${top + corner} Z`;
  const teeth = Math.min(h, 5.5);
  return (
    <g>
      <path d={lower} fill={LIP} />
      {h > 0.6 && (
        <>
          <path d={inner} fill={MOUTH_IN} />
          <clipPath id="mouthClip">
            <path d={inner} />
          </clipPath>
          <rect x={L} y={top} width={w} height={teeth} fill="#F7F1EA" clipPath="url(#mouthClip)" />
        </>
      )}
      <path d={upper} fill={LIP} />
      <path d={`M ${L + 3} ${top + corner + 0.5} Q ${cx} ${top + 2 * h + 0.5} ${R - 3} ${top + corner + 0.5}`} stroke={LIP_DK} strokeWidth={1.6} fill="none" opacity={0.7} />
      <path d={`M ${cx - 10} ${top + 2 * h + 15} Q ${cx} ${top + 2 * h + 17} ${cx + 10} ${top + 2 * h + 15}`} stroke="#ffffff" strokeOpacity={0.35} strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Eye: React.FC<{ cx: number; gx: number; gy: number; lid: number; mirror?: boolean }> = ({ cx, gx, gy, lid, mirror }) => {
  const cy = 196;
  const m = (x: number) => (mirror ? 2 * cx - x : x); // mirror around the eye centre; outer corner first
  const white = `M ${m(cx - 22)} ${cy + 1} C ${m(cx - 13)} ${cy - 13} ${m(cx + 10)} ${cy - 15} ${m(cx + 20)} ${cy - 1} C ${m(cx + 10)} ${cy + 9} ${m(cx - 10)} ${cy + 11} ${m(cx - 22)} ${cy + 1} Z`;
  const id = `eye${cx}`;
  return (
    <g>
      {/* soft lid shadow */}
      <path d={`M ${m(cx - 23)} ${cy} C ${m(cx - 13)} ${cy - 22} ${m(cx + 12)} ${cy - 23} ${m(cx + 21)} ${cy - 3} C ${m(cx + 10)} ${cy - 13} ${m(cx - 12)} ${cy - 12} ${m(cx - 23)} ${cy} Z`} fill="#8A4A36" opacity={0.28} />
      <g transform={`translate(0 ${cy}) scale(1 ${Math.max(0.06, lid)}) translate(0 ${-cy})`}>
        <clipPath id={id}>
          <path d={white} />
        </clipPath>
        <path d={white} fill="#FBF6EF" />
        <g clipPath={`url(#${id})`}>
          <circle cx={cx + gx} cy={cy - 1 + gy} r={11} fill="#5C3521" />
          <circle cx={cx + gx} cy={cy - 1 + gy} r={11} fill="none" stroke="#2C170D" strokeWidth={2} />
          <circle cx={cx + gx} cy={cy - 1 + gy} r={5.6} fill="#1A0D07" />
          <circle cx={cx + gx - 3.5} cy={cy - 5 + gy} r={2.8} fill="#FFFFFF" opacity={0.92} />
          <circle cx={cx + gx + 3.5} cy={cy + 2 + gy} r={1.2} fill="#FFFFFF" opacity={0.6} />
        </g>
        {/* upper lash line, wing and lashes on the outer side */}
        <path d={`M ${m(cx - 23)} ${cy + 1} C ${m(cx - 13)} ${cy - 14} ${m(cx + 10)} ${cy - 16} ${m(cx + 21)} ${cy - 1}`} stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d={`M ${m(cx - 23)} ${cy + 1} L ${m(cx - 30)} ${cy - 6}`} stroke={C.ink} strokeWidth={3.4} strokeLinecap="round" />
        <path d={`M ${m(cx - 17)} ${cy - 7} l ${mirror ? 4 : -4} -6 M ${m(cx - 11)} ${cy - 10} l ${mirror ? 3 : -3} -6`} stroke={C.ink} strokeWidth={2.2} strokeLinecap="round" />
        <path d={`M ${m(cx - 17)} ${cy + 5} C ${m(cx - 6)} ${cy + 11} ${m(cx + 8)} ${cy + 10} ${m(cx + 18)} ${cy + 3}`} stroke={SKIN_LINE} strokeWidth={1.3} fill="none" opacity={0.55} />
      </g>
      <path d={`M ${m(cx - 16)} ${cy - 13} C ${m(cx - 6)} ${cy - 22} ${m(cx + 9)} ${cy - 22} ${m(cx + 17)} ${cy - 12}`} stroke={SKIN_LINE} strokeWidth={1.4} fill="none" opacity={0.45} />
    </g>
  );
};

export const PresenterFace: React.FC<{ open: number; shape: number; blink: number; brow: number; gx: number; gy: number; tilt: number; bob: number; smile: number }> = ({ open, shape, blink, brow, gx, gy, tilt, bob, smile }) => (
  <svg viewBox="34 52 332 332" width="100%" height="100%">
    <defs>
      <radialGradient id="pbg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#FFF6E6" />
        <stop offset="100%" stopColor="#F1DFC4" />
      </radialGradient>
      <radialGradient id="pskin" cx="44%" cy="36%" r="68%">
        <stop offset="0%" stopColor="#D9A27D" />
        <stop offset="70%" stopColor={SKIN} />
        <stop offset="100%" stopColor="#BD8160" />
      </radialGradient>
      <linearGradient id="phair" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2A2330" />
        <stop offset="100%" stopColor={HAIR} />
      </linearGradient>
      <filter id="psoft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
    <rect width="400" height="400" fill="url(#pbg)" />
    <circle cx="300" cy="90" r="120" fill={C.accent} opacity={0.12} />
    <g transform={`translate(0 ${bob}) rotate(${tilt} 200 330)`}>
      {/* back hair: long, past the shoulders */}
      <path d="M 104 200 C 84 116 140 60 206 60 C 276 62 324 118 308 206 C 300 262 314 318 332 384 L 66 384 C 88 322 112 262 104 200 Z" fill="url(#phair)" />
      {/* blazer and top */}
      <path d="M 24 400 C 40 332 104 308 160 302 L 200 354 L 240 302 C 296 308 360 332 376 400 Z" fill={C.ink} />
      <path d="M 166 302 L 200 358 L 234 302 L 224 298 L 200 336 L 176 298 Z" fill={C.accent} />
      <path d="M 160 302 L 186 372 M 240 302 L 214 372" stroke="#2A3656" strokeWidth={3} />
      {/* neck with jaw shadow */}
      <path d="M 174 262 L 226 262 L 232 304 Q 200 330 168 304 Z" fill={SKIN_SH} />
      <path d="M 172 278 Q 200 300 228 278 L 228 266 L 172 266 Z" fill="#9C6447" opacity={0.35} />
      {/* ears + earrings */}
      <ellipse cx="121" cy="206" rx="10" ry="18" fill={SKIN_SH} />
      <ellipse cx="279" cy="206" rx="10" ry="18" fill={SKIN_SH} />
      <circle cx="119" cy="231" r="5.5" fill={GOLD} />
      <circle cx="281" cy="231" r="5.5" fill={GOLD} />
      <path d="M 119 236 L 119 246" stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M 281 236 L 281 246" stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" />
      {/* face: oval with a softer jaw */}
      <path d="M 200 98 C 250 98 280 138 279 190 C 278 234 260 274 231 294 C 215 304 185 304 169 294 C 140 274 122 234 121 190 C 120 138 150 98 200 98 Z" fill="url(#pskin)" />
      {/* blush */}
      <ellipse cx="152" cy="238" rx="18" ry="11" fill="#E0706A" opacity={0.22} filter="url(#psoft)" />
      <ellipse cx="248" cy="238" rx="18" ry="11" fill="#E0706A" opacity={0.22} filter="url(#psoft)" />
      {/* front hair: side part, sweep across the forehead, strands framing the face */}
      <path d="M 120 196 C 112 126 150 84 200 82 C 256 80 296 122 288 196 C 282 160 268 134 246 120 C 224 128 196 124 176 108 C 158 130 138 156 120 196 Z" fill="url(#phair)" />
      <path d="M 120 196 C 116 236 122 270 136 300 C 126 270 124 236 128 200 Z" fill={HAIR} />
      <path d="M 288 196 C 292 236 286 270 272 300 C 280 270 282 236 278 200 Z" fill={HAIR} />
      <path d="M 180 96 C 214 92 252 104 274 138" stroke={HAIR_HI} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M 160 112 C 146 128 134 150 126 176" stroke={HAIR_HI} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d="M 210 112 C 236 116 256 128 268 148" stroke={HAIR_HI} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.5} />
      {/* brows: tapered, arched */}
      <g transform={`translate(0 ${-brow})`}>
        <path d="M 142 176 C 152 161 174 156 192 166 C 175 163 156 166 145 179 Z" fill={HAIR} />
        <path d="M 258 176 C 248 161 226 156 208 166 C 225 163 244 166 255 179 Z" fill={HAIR} />
      </g>
      {/* eyes */}
      <Eye cx={167} gx={gx} gy={gy} lid={1 - blink} />
      <Eye cx={233} gx={gx} gy={gy} lid={1 - blink} mirror />
      {/* nose: short and soft */}
      <path d="M 203 217 Q 201 228 196 234" stroke={SKIN_LINE} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.75} />
      <path d="M 191 238 Q 200 244 210 239" stroke={SKIN_LINE} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.75} />
      <Mouth open={open} shape={shape} smile={smile} />
    </g>
  </svg>
);

/* The framed host, bottom-left beside the captions. */
export const Presenter: React.FC<{ x?: number; y?: number; size?: number; sceneStarts: number[]; hideAfter?: number }> = ({ x = 44, y = 1290, size = 250, sceneStarts, hideAfter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = Math.min(mouth.open.length - 1, Math.max(0, frame));
  // a 3-frame average keeps the lips from jittering
  const avg = (k: number) => mouth.open[Math.min(mouth.open.length - 1, Math.max(0, k))] / 100;
  const open = (avg(i - 1) + avg(i) * 2 + avg(i + 1)) / 4;
  const shape = mouth.shape[i];
  const talking = open > 0.06;
  // blink
  const b = blinkStarts.find((s) => frame >= s && frame < s + 6);
  const blink = b === undefined ? 0 : interpolate(frame - b, [0, 2, 3, 6], [0, 1, 1, 0], CLAMP);
  // brows lift while a number is being spoken
  const words = captionWords(fps);
  const w = words.find((x) => frame >= x.from && frame < x.to);
  const num = w && /\d/.test(w.t) ? 1 : 0;
  const brow = interpolate(num, [0, 1], [0, 7]);
  // glance up at the chart for ~1 s after each scene starts
  const since = Math.min(...sceneStarts.map((s) => (frame >= s ? frame - s : 9999)));
  const look = interpolate(since, [0, 6, 26, 34], [0, 1, 1, 0], CLAMP);
  const gx = interpolate(look, [0, 1], [0, 5]) + Math.sin(frame / 53) * 1.2;
  const gy = interpolate(look, [0, 1], [0, -6]);
  // head: slow sway, a little more alive while talking
  const tilt = Math.sin(frame / 41) * 1.6 + (talking ? Math.sin(frame / 9) * 0.6 : 0) - look * 2;
  const bob = Math.sin(frame / 37) * 2 + (talking ? Math.sin(frame / 6.5) * 1.1 * open : 0);
  const smile = talking ? 0.35 : 1;
  const pin = spring({ frame: frame - 6, fps, config: theme.spring.pop });
  const out = hideAfter === undefined ? 0 : interpolate(frame, [hideAfter, hideAfter + 10], [0, 1], CLAMP);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, zIndex: 46, opacity: interpolate(pin, [0, 0.3], [0, 1], CLAMP) * (1 - out), transform: `scale(${interpolate(pin, [0, 1], [0.6, 1])})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: C.paperHi, boxShadow: "0 16px 36px rgba(40,30,10,0.28)" }} />
      <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `5px solid ${C.accent}` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
        <PresenterFace open={open} shape={shape} blink={blink} brow={brow} gx={gx} gy={gy} tilt={tilt} bob={bob} smile={smile} />
      </div>
      {/* live dot while she speaks */}
      <div style={{ position: "absolute", right: 14, top: 10, width: 22, height: 22, borderRadius: 22, background: C.red, boxShadow: `0 0 0 5px ${C.paperHi}`, opacity: talking ? 1 : 0.25 }} />
    </div>
  );
};
