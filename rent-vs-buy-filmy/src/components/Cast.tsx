// The cast, Bollywood-poster style: outlined, gold rim-lit, lip-synced to their own lines.
import React, { createContext, useContext } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, Who } from "../theme";
import { mouth } from "../timing";
import { CLAMP } from "./Motion";

const C = theme.colors;
const INK = C.ink;

// Absolute frame offset of the current scene, so characters can read the lip-sync envelope.
export const SceneFrom = createContext(0);

export type Mood = "happy" | "neutral" | "worried" | "smug" | "calm" | "shocked" | "angry";
type Person = Exclude<Who, "narrator">;

export const Character: React.FC<{ who: Person; mood?: Mood; size?: number; delay?: number; flip?: boolean; glow?: boolean; style?: React.CSSProperties }> = ({
  who,
  mood = "neutral",
  size = 420,
  delay = 0,
  flip = false,
  glow = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const from = useContext(SceneFrom);
  const open = mouth(fps, from + frame, who);
  const talking = open > 0.05;
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const seed = { arjun: 0, meera: 1, papa: 2, maa: 3 }[who];
  const blink = (frame + seed * 41) % 120 < 4 ? 0.1 : 1;
  const sway = Math.sin((frame + seed * 30) / 22) * 1.5 + (talking ? Math.sin(frame / 3.2) * 1.2 : 0);
  const brow = mood === "worried" || mood === "shocked" ? -9 : mood === "angry" ? 9 : mood === "smug" ? 5 : 0;
  const skin = who === "arjun" || who === "papa" ? C.skin1 : C.skin2;
  const mh = 3 + open * 22; // mouth height
  const smile = mood === "happy" || mood === "smug" || mood === "calm";
  return (
    <div
      style={{
        width: size,
        height: size * 1.2,
        opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP),
        transform: `translateY(${(1 - p) * 80}px) scale(${interpolate(p, [0, 1], [0.85, 1]) * (flip ? -1 : 1)}, ${interpolate(p, [0, 1], [0.85, 1])})`,
        filter: glow ? `drop-shadow(0 0 18px rgba(242,193,78,0.35)) drop-shadow(0 20px 30px rgba(0,0,0,0.5))` : undefined,
        ...style,
      }}
    >
      <svg viewBox="0 0 240 288" width={size} height={size * 1.2}>
        <g transform={`rotate(${sway * 0.6} 120 260)`}>
          {/* hair behind */}
          {who === "meera" && <path d="M58,120 Q50,40 120,36 Q190,40 182,120 L192,240 Q120,262 48,240 Z" fill={C.hair} stroke={INK} strokeWidth={3} />}
          {/* ---------- body ---------- */}
          {who === "arjun" && (
            <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
              <path d="M28,288 Q30,214 120,204 Q210,214 212,288 Z" fill={C.arjun} />
              <path d="M96,206 L120,240 L144,206 L132,200 L120,214 L108,200 Z" fill="#E8F2FF" />
              <path d="M120,240 L120,288" stroke="#2F6DB5" strokeWidth={3} />
              <circle cx={120} cy={258} r={3} fill="#E8F2FF" stroke="none" />
            </g>
          )}
          {who === "meera" && (
            <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
              <path d="M30,288 Q32,214 120,204 Q208,214 210,288 Z" fill={C.meera} />
              <path d="M92,206 Q120,236 148,206" fill="none" stroke={C.gold} strokeWidth={5} />
              <path d="M150,210 Q190,230 196,288 L160,288 Q150,240 130,214 Z" fill={C.maa} opacity={0.95} />
              <path d="M150,214 Q182,234 186,288" fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="4 5" />
            </g>
          )}
          {who === "papa" && (
            <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
              <path d="M26,288 Q28,212 120,202 Q212,212 214,288 Z" fill="#F4ECDC" />
              <path d="M70,214 Q96,206 104,210 L112,288 L58,288 Q58,240 70,214 Z M170,214 Q144,206 136,210 L128,288 L182,288 Q182,240 170,214 Z" fill={C.velvet} />
              <path d="M120,214 L120,288" stroke="#C9BFA9" strokeWidth={3} />
            </g>
          )}
          {who === "maa" && (
            <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
              <path d="M30,288 Q32,214 120,204 Q208,214 210,288 Z" fill="#B3123D" />
              <path d="M40,288 Q60,220 160,206 Q200,214 206,250 L190,288 Z" fill="#E0284F" />
              <path d="M44,288 Q66,226 160,212" fill="none" stroke={C.gold} strokeWidth={6} />
              <path d="M98,212 Q120,232 142,212" fill="none" stroke={C.gold} strokeWidth={2.5} />
              <circle cx={120} cy={232} r={4} fill={C.gold} stroke="none" />
            </g>
          )}
          <rect x={106} y={182} width={28} height={30} rx={10} fill={skin} stroke={INK} strokeWidth={3} />
          {/* ---------- head ---------- */}
          <g transform={`translate(0, ${talking ? Math.sin(frame / 2.6) * 1.2 : 0})`}>
            <ellipse cx={64} cy={128} rx={9} ry={14} fill={skin} stroke={INK} strokeWidth={3} />
            <ellipse cx={176} cy={128} rx={9} ry={14} fill={skin} stroke={INK} strokeWidth={3} />
            <path d="M66,118 Q64,58 120,56 Q176,58 174,118 Q176,180 120,194 Q64,180 66,118 Z" fill={skin} stroke={INK} strokeWidth={3} />
            {/* hair / headwear */}
            {who === "arjun" && (
              <>
                <path d="M64,116 Q56,46 116,40 Q178,36 178,104 Q170,78 146,74 Q150,58 128,62 Q104,50 92,72 Q74,80 64,116 Z" fill={C.hair} stroke={INK} strokeWidth={3} />
                <path d="M86,168 Q120,196 154,168 Q150,186 120,192 Q90,186 86,168 Z" fill={C.hair} opacity={0.22} />
              </>
            )}
            {who === "meera" && (
              <>
                <path d="M64,124 Q60,52 120,50 Q182,52 176,124 Q166,84 136,76 Q118,92 92,88 Q72,96 64,124 Z" fill={C.hair} stroke={INK} strokeWidth={3} />
                <circle cx={120} cy={104} r={4} fill={C.red} />
                <g fill={C.gold} stroke={INK} strokeWidth={1.5}>
                  <path d="M58,140 l-6,16 h12 Z" />
                  <path d="M182,140 l-6,16 h12 Z" />
                </g>
              </>
            )}
            {who === "papa" && (
              <>
                <path d="M66,124 Q62,94 76,80 Q74,104 72,124 Z M174,124 Q178,94 164,80 Q166,104 168,124 Z" fill="#D9D2C7" stroke={INK} strokeWidth={2.5} />
                <path d="M92,154 Q120,140 148,154 Q140,166 120,160 Q100,166 92,154 Z" fill="#5C534B" stroke={INK} strokeWidth={2.5} />
                <g fill="none" stroke={INK} strokeWidth={3.5}>
                  <rect x={80} y={112} width={30} height={22} rx={8} />
                  <rect x={130} y={112} width={30} height={22} rx={8} />
                  <path d="M110,122 L130,122" />
                </g>
              </>
            )}
            {who === "maa" && (
              <>
                <path d="M64,124 Q60,56 120,54 Q180,56 176,124 Q160,80 120,82 Q80,80 64,124 Z" fill="#3A2A26" stroke={INK} strokeWidth={3} />
                <circle cx={120} cy={50} r={20} fill="#3A2A26" stroke={INK} strokeWidth={3} />
                <path d="M120,58 L120,80" stroke={C.red} strokeWidth={4} />
                <circle cx={120} cy={102} r={6} fill={C.red} stroke={INK} strokeWidth={1.5} />
              </>
            )}
            {/* brows */}
            <path d={`M84,${102 - brow / 2} Q94,${97 - brow / 2} 106,${102 + brow / 2}`} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
            <path d={`M134,${102 + brow / 2} Q146,${97 - brow / 2} 156,${102 - brow / 2}`} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
            {/* eyes */}
            {[96, 144].map((ex) => (
              <g key={ex}>
                <ellipse cx={ex} cy={122} rx={10} ry={8 * blink * (mood === "shocked" ? 1.35 : 1)} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
                <circle cx={ex + (mood === "smug" ? 3 : 0)} cy={122} r={4.8 * Math.min(1, blink * 1.4)} fill="#2A1A12" />
                {(who === "meera" || who === "maa") && <path d={`M${ex - 11},${116} L${ex - 15},${111}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />}
              </g>
            ))}
            {/* nose */}
            <path d="M120,124 Q114,146 122,148" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
            {/* mouth: talking = open mouth sized by loudness; silent = expression */}
            {talking ? (
              <g>
                <ellipse cx={120} cy={168} rx={12 + open * 3} ry={mh / 2 + 2} fill="#5A1620" stroke={INK} strokeWidth={2.5} />
                <path d={`M${110},${168 - mh / 2} Q120,${166 - mh / 2} ${130},${168 - mh / 2}`} stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
              </g>
            ) : mood === "shocked" ? (
              <ellipse cx={120} cy={170} rx={10} ry={13} fill="#5A1620" stroke={INK} strokeWidth={2.5} />
            ) : (
              <path
                d={smile ? (mood === "smug" ? "M104,166 Q122,176 138,160" : "M102,164 Q120,182 138,164") : mood === "worried" || mood === "angry" ? "M104,174 Q120,162 136,174" : "M106,168 L134,168"}
                fill="none"
                stroke={INK}
                strokeWidth={4}
                strokeLinecap="round"
              />
            )}
            {smile && <><circle cx={80} cy={150} r={9} fill="#FF7A7A" opacity={0.25} /><circle cx={160} cy={150} r={9} fill="#FF7A7A" opacity={0.25} /></>}
            {mood === "worried" && <path d="M170,88 q6,10 0,16 q-6,-6 0,-16 Z" fill="#9AD8FF" stroke={INK} strokeWidth={1.5} />}
          </g>
        </g>
      </svg>
    </div>
  );
};
