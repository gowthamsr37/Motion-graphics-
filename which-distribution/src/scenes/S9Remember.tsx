// SCENE 9 — REMEMBER: the cheat sheet. Five rows, each lands on its spoken phrase and lights its name:
// EQUALLY LIKELY → UNIFORM · SUCCESSES IN TRIES → BINOMIAL · EVENTS IN TIME → POISSON ·
// WAITING TIME → EXPONENTIAL · AROUND AN AVERAGE → NORMAL.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { type Kind, Shape } from "../components/Pick";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BIN, EXP, NOR, NOR2, POI, UNI } from "./S1Hook";

const C = theme.colors;
type Row = { key: string; name: string; kind: Kind; c: string; c2?: string; at: [number, string]; nameAt: [number, string] };
const ROWS: Row[] = [
  { key: "EQUALLY LIKELY", name: "UNIFORM", kind: "uniform", c: UNI, at: [0, "equally"], nameAt: [0, "uniform."] },
  { key: "SUCCESSES IN TRIES", name: "BINOMIAL", kind: "binomial", c: BIN, at: [0, "Successes"], nameAt: [0, "binomial."] },
  { key: "EVENTS IN TIME", name: "POISSON", kind: "poisson", c: POI, at: [1, "Events"], nameAt: [1, "Poisson."] },
  { key: "WAITING TIME", name: "EXPONENTIAL", kind: "exp", c: EXP, at: [1, "Waiting"], nameAt: [1, "exponential."] },
  { key: "AROUND AN AVERAGE", name: "NORMAL", kind: "normal", c: NOR, c2: NOR2, at: [1, "Measurements"], nameAt: [1, "normal."] },
];

export const S9Remember: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="THE CHEAT SHEET" color={C.green} at={2} pillAt={s.sent(0).from} />
      {ROWS.map((r, i) => {
        const y = 530 + i * 150;
        const ghost = interpolate(frame, [6 + i * 3, 16 + i * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const p = spr(s.cueS(r.at[0], r.at[1]) - 6, theme.spring.bouncy);
        const n = spr(s.cueS(r.nameAt[0], r.nameAt[1]) - 4, theme.spring.pop);
        return (
          <React.Fragment key={r.name}>
            <div style={{ position: "absolute", left: 90, top: y - 60, width: 900, height: 120, boxSizing: "border-box", borderRadius: 24, background: p > 0.01 ? `linear-gradient(90deg, rgba(14,24,64,0.92) 40%, ${alpha(r.c, 0.18)})` : "transparent", border: p > 0.01 ? `3px solid ${n > 0.5 ? r.c : alpha(r.c, 0.45)}` : `3px dashed ${alpha("#F3F7FF", 0.2)}`, boxShadow: n > 0.5 && n < 1.2 && frame < s.cueS(r.nameAt[0], r.nameAt[1]) + 20 ? `0 0 26px ${alpha(r.c, 0.4)}` : "none", opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), transform: `translateX(${(1 - Math.min(1, p)) * -40}px)` }} />
            {p > 0.01 ? (
              <div style={{ position: "absolute", left: 124, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.06em", color: C.text, whiteSpace: "nowrap", width: 320 }}>{r.key}</div>
            ) : null}
            {p > 0.01 ? (
              <div style={{ position: "absolute", left: 452, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2) }}>
                <Arrow size={30} color={C.dim} />
              </div>
            ) : null}
            {n > 0.01 ? (
              <div style={{ position: "absolute", left: 506, top: y, transform: `translateY(-50%) scale(${interpolate(Math.min(1, n), [0, 1], [1.3, 1])})`, transformOrigin: "left center", opacity: Math.min(1, n * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: r.name.length > 9 ? 32 : 36, color: r.c, textShadow: glowText(r.c, 0.4), whiteSpace: "nowrap" }}>{r.name}</div>
            ) : null}
            {n > 0.01 ? (
              <div style={{ position: "absolute", left: 868, top: y - 26, opacity: Math.min(1, n * 2) }}>
                <Shape kind={r.kind} w={96} h={44} color={r.c} color2={r.c2} p={Math.min(1, n)} axis={false} />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
