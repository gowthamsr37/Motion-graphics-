// SCENE 6 — THE OUTLIER TWIST. One friend's 8 cups become 38: the chart zooms out, the mean line jumps 4 → 10, the median stays at 3.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Mark, Pop, Ripple, Rolling, shake, useSpr } from "../components/Motion";
import { Arrow, Avatar, Rupee } from "../components/Icons";
import { Tag, TreeHeaderN } from "../components/Nodes";
import { BASE, COLS, CUP, ColLabel, CupStack } from "../components/Cups";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVATAR_Y, FRIENDS, MMM_HEADER } from "./S3Mean";

const C = theme.colors;
const SORTED = [2, 2, 3, 5, 8];
const WHO = [1, 3, 4, 0, 2];

export const S6Outlier: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const TW = s.sent(0).from;
  const GROW = s.sent(1).from;
  const C38 = s.cueS(1, "38");
  const JUMP = s.sent(2).from;
  const C10 = s.cueS(2, "10!");
  const STAY = s.sent(3).from;
  const SAL = s.sent(4).from;
  const END = s.duration;

  const g = ease(frame, [C38 - 8, C38 + 26], [0, 1], theme.ease.inOut);
  const outCount = Math.round(interpolate(g, [0, 1], [8, 38]));
  const sc = interpolate(g, [0, 1], [1, 0.47]);
  const meanV = interpolate(ease(frame, [JUMP + 4, C10 + 6], [0, 1], theme.ease.inOut), [0, 1], [4, 10]);
  const lineY = BASE - meanV * CUP.step * sc;
  const stay = ease(frame, [STAY - 2, STAY + 10], [0, 1]);
  const sh = shake(frame, C38 + 20, 14, 12);
  const intro = spr(0, theme.spring.smooth);
  const out = ease(frame, [END - 12, END], [0, 1], theme.ease.in);

  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <TreeHeaderN {...MMM_HEADER} parentIn={-60} kidsIn={-60} activeAt={TW} activeIdx={null} prevIdx={2} />

      <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
        {/* readouts */}
        <div style={{ position: "absolute", left: 110, top: 548, width: 380, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { l: "MEAN", c: C.cyan, at: TW + 4 },
            { l: "MEDIAN", c: C.green, at: TW + 8 },
            { l: "MODE", c: C.violet, at: TW + 12 },
          ].map((r, i) => {
            const p = spr(r.at, theme.spring.snappy);
            const jumping = i === 0 && frame >= JUMP && frame < C10 + 20;
            return (
              <div
                key={r.l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "10px 18px",
                  borderRadius: 20,
                  background: `linear-gradient(90deg, ${alpha(r.c, 0.16)}, rgba(14,24,64,0.7))`,
                  border: `2px solid ${alpha(r.c, i === 0 && jumping ? 1 : i === 1 && stay > 0.5 ? 1 : 0.45)}`,
                  boxShadow: (i === 0 && jumping) || (i === 1 && stay > 0.5) ? `0 0 26px ${alpha(r.c, 0.45)}` : "none",
                  opacity: Math.min(1, p * 2),
                  transform: `translateX(${(1 - p) * -60}px)`,
                }}
              >
                <span style={{ width: 150, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: r.c }}>{r.l}</span>
                {i === 0 ? (
                  <Rolling value={meanV} decimals={1} height={56} size={50} color={C.text} />
                ) : (
                  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 50, color: C.text, lineHeight: "56px" }}>{i === 1 ? "3" : "2"}</span>
                )}
                {i === 1 && stay > 0.01 ? (
                  <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.green, opacity: stay }}>
                    <Mark kind="check" at={STAY} size={30} color={C.green} width={13} />
                    SAME
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* the chart */}
        <div style={{ position: "absolute", left: 100, top: BASE + 4, width: 880, height: 4, borderRadius: 2, background: alpha(C.text, 0.3), opacity: intro }} />
        {SORTED.map((v, i) => {
          const isOut = i === 4;
          const isMid = i === 2;
          const n = isOut ? outCount : v;
          const f = FRIENDS[WHO[i]];
          return (
            <React.Fragment key={i}>
              <CupStack x={COLS[i]} n={n} s={sc} appear={() => -100} glow={isOut && g > 0.05 ? alpha(C.orange, 0.9) : isMid && stay > 0.5 ? alpha(C.green, 0.9) : undefined} />
              <div style={{ transform: `scale(${isMid ? 1 + stay * 0.25 : 1})`, transformOrigin: `${COLS[i]}px ${BASE + 42}px` }}>
                <ColLabel x={COLS[i]} value={String(n)} color={isOut && g > 0.05 ? C.orange : isMid && stay > 0.5 ? C.green : C.text} p={intro} />
              </div>
              <div style={{ position: "absolute", left: COLS[i] - 42, top: AVATAR_Y - 42, opacity: intro }}>
                <Avatar size={84} shirt={f.shirt} skin={f.skin} hair={f.hair} mood={isOut && g > 0.5 ? 2 : 0.5} />
              </div>
            </React.Fragment>
          );
        })}
        {/* median ring on the middle stack */}
        {stay > 0.01 ? (
          <div style={{ position: "absolute", left: COLS[2] - 46, top: BASE - 3 * CUP.step * sc - 18, width: 92, height: 3 * CUP.step * sc + 26, borderRadius: 16, border: `3px solid ${alpha(C.green, stay)}`, boxShadow: `0 0 20px ${alpha(C.green, 0.5 * stay)}` }} />
        ) : null}
        {/* the mean line */}
        <div style={{ position: "absolute", left: 100, top: lineY - 3, width: 880, height: 0, borderTop: `6px dashed ${C.cyan}`, filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.8)})`, opacity: intro, zIndex: 4 }} />
        <div style={{ position: "absolute", left: 104, top: lineY - 40, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.cyan, textShadow: glowText(C.cyan, 0.5), opacity: intro, zIndex: 4 }}>MEAN</div>
        <Ripple at={C38 + 20} x={COLS[4]} y={BASE - 38 * CUP.step * 0.47} color={C.orange} size={300} rings={2} />
        <Burst at={C38 + 22} x={COLS[4]} y={BASE - 38 * CUP.step * 0.47} color={C.orange} count={16} radius={150} seed={55} />
        <Pop at={C38 + 16} x={720} y={640} from="left" dist={30} cfg={theme.spring.bouncy}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Tag color={C.orange} size={30}>
              OUTLIER
            </Tag>
            <Arrow size={56} color={C.orange} />
          </div>
        </Pop>

        {/* why salaries use the median */}
        <Pop at={SAL - 2} x={300} y={870} from="up" dist={24} cfg={theme.spring.bouncy}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderRadius: 20, background: alpha(C.green, 0.14), border: `2.5px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
            <Rupee size={34} color={C.green} />
            SALARIES <Arrow size={40} color={C.green} /> MEDIAN
          </div>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
