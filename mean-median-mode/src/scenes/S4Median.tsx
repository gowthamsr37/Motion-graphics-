// SCENE 4 — MEDIAN = the middle value. The friends line up from fewest cups to most, the ends are crossed off pair by pair,
// and 3 is left in the middle. Then an even-count example: halfway between the middle two.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { Arrow, Avatar, ChaiCup, Crown } from "../components/Icons";
import { Pill, Tag, TreeHeaderN } from "../components/Nodes";
import { BASE, COLS, CUP, ColLabel, CupStack } from "../components/Cups";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVATAR_Y, FRIENDS, MMM_HEADER, VALUES } from "./S3Mean";

const C = theme.colors;
export const RANK = [3, 0, 4, 1, 2]; // where each friend stands once sorted: 2, 2, 3, 5, 8
const EVEN = [2, 3, 5, 8];
const EX = [300, 460, 620, 780];

export const S4Median: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const MEDW = s.cueS(0, "median");
  const SORT = s.sent(1).from + 8;
  const said = [s.cueS(2, "2,", 0), s.cueS(2, "2,", 1), s.cueS(2, "3,"), s.cueS(2, "5,"), s.cueS(2, "8.")];
  const MID = s.sent(3).from;
  const EVN = s.sent(4).from;
  const HALF = s.cueS(4, "halfway");
  const TWO = s.cueS(4, "two.");

  const outPairs = (r: number) => (r === 0 || r === 4 ? MID : r === 1 || r === 3 ? MID + 9 : Infinity);
  const midOn = ease(frame, [MID + 16, MID + 26], [0, 1]);
  const colsOut = exitP(frame, EVN - 2, 10);

  return (
    <AbsoluteFill>
      <TreeHeaderN {...MMM_HEADER} parentIn={-60} kidsIn={-60} activeAt={MEDW} activeIdx={1} prevIdx={0} />

      <Pop at={MEDW - 2} out={MID + 10} x={540} y={574} from="up" dist={20} cfg={theme.spring.bouncy}>
        <Tag color={C.green} size={32}>
          MEDIAN <span style={{ color: C.green }}>=</span> THE MIDDLE VALUE
        </Tag>
      </Pop>
      <Pop at={MID + 18} out={EVN - 2} x={540} y={574} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Pill label="MEDIAN = 3" color={C.green} size={46} glow={1} />
      </Pop>

      {/* the five columns: restore the real counts, then sort */}
      {colsOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - colsOut, transform: `translateY(${colsOut * 40}px)` }}>
          <div style={{ position: "absolute", left: 100, top: BASE + 4, width: 880, height: 4, borderRadius: 2, background: alpha(C.text, 0.3) }} />
          {VALUES.map((v, k) => {
            const r = RANK[k];
            const e = ease(frame, [SORT + k * 2, SORT + 20 + k * 2], [0, 1], theme.ease.inOut);
            const dx = (COLS[r] - COLS[k]) * e;
            const lift = Math.sin(e * Math.PI) * 70 * (k % 2 ? 1 : -1);
            const isMid = r === 2;
            const crossed = frame >= outPairs(r);
            const dim = crossed ? 0.3 : 1;
            const hl = said[r] !== undefined && frame >= said[r] && frame < said[r] + 12 ? 1 : 0;
            const glow = isMid && midOn > 0.5 ? alpha(C.green, 0.9) : hl ? alpha(C.green, 0.7) : undefined;
            const f = FRIENDS[k];
            return (
              <div key={k} style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${-Math.abs(lift) * 0.4}px)`, zIndex: lift > 0 ? 3 : 1 }}>
                <CupStack x={COLS[k]} n={v} appear={(j) => (j < 4 ? -100 : 2 + (j - 4) * 2)} glow={glow} dim={dim} />
                {/* cups above the real count fade away (they were only there for the fair share) */}
                {Array.from({ length: Math.max(0, 4 - v) }).map((_, i) => {
                  const j = v + i;
                  const o = ease(frame, [0, 10], [1, 0]);
                  if (o <= 0) return null;
                  return (
                    <div key={`x${j}`} style={{ position: "absolute", left: COLS[k] - CUP.w / 2, top: BASE - CUP.step * (j + 0.5) - (CUP.w * 0.66) / 2, opacity: o, transform: `translateY(${(1 - o) * -30}px) scale(${0.6 + 0.4 * o})` }}>
                      <ChaiCup w={CUP.w} />
                    </div>
                  );
                })}
                <div style={{ opacity: dim, transform: `scale(${1 + hl * 0.25 + (isMid ? midOn * 0.25 : 0)})`, transformOrigin: `${COLS[k]}px ${BASE + 42}px` }}>
                  <ColLabel x={COLS[k]} value={String(v)} color={(isMid && midOn > 0.5) || hl ? C.green : C.text} p={1} />
                </div>
                {crossed && !isMid ? (
                  <div style={{ position: "absolute", left: COLS[k] - 30, top: BASE + 40, width: 60 * ease(frame, [outPairs(r), outPairs(r) + 6], [0, 1]), height: 6, borderRadius: 3, background: C.red, boxShadow: `0 0 10px ${alpha(C.red, 0.7)}` }} />
                ) : null}
                <div style={{ position: "absolute", left: COLS[k] - 42, top: AVATAR_Y - 42, opacity: dim }}>
                  <Avatar size={84} shirt={f.shirt} skin={f.skin} hair={f.hair} mood={isMid && midOn > 0.5 ? 1 : 0.5} />
                </div>
              </div>
            );
          })}
          {/* arrows closing in from both ends */}
          {frame >= MID - 2 && frame < MID + 30
            ? [0, 1].map((side) => {
                const e = ease(frame, [MID - 2, MID + 16], [0, 1], theme.ease.inOut);
                const x = side === 0 ? interpolate(e, [0, 1], [70, 430]) : interpolate(e, [0, 1], [1010, 650]);
                return (
                  <div key={side} style={{ position: "absolute", left: x, top: BASE + 42, transform: `translate(-50%, -50%) scaleX(${side === 0 ? 1 : -1})`, opacity: ease(frame, [MID + 20, MID + 30], [1, 0]) }}>
                    <Arrow size={70} color={C.green} />
                  </div>
                );
              })
            : null}
          {midOn > 0.01 ? (
            <div style={{ position: "absolute", left: 540 - 40, top: BASE - 3 * CUP.step - 78, transform: `translateY(${(1 - spr(MID + 16, theme.spring.bouncy)) * -200}px)`, opacity: midOn }}>
              <Crown size={80} color={C.green} />
            </div>
          ) : null}
          <Burst at={MID + 18} x={540} y={BASE - 3 * CUP.step - 40} color={C.green} count={14} radius={150} seed={21} />
        </AbsoluteFill>
      ) : null}

      {/* even count: 2, 3, 5, 8 → halfway between 3 and 5 */}
      <Pop at={EVN + 2} x={540} y={690} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>EVEN COUNT · 4 VALUES</div>
      </Pop>
      {EVEN.map((v, i) => {
        const p = spr(EVN + 4 + i * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const middle = i === 1 || i === 2;
        const lit = middle && frame >= HALF;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: EX[i] - 62,
              top: 880 - 78,
              width: 124,
              height: 156,
              borderRadius: 24,
              transform: `translateY(${(1 - p) * 60}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
              opacity: Math.min(1, p * 2) * (frame >= HALF && !middle ? 0.4 : 1),
              background: lit ? alpha(C.green, 0.2) : "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))",
              border: `3px solid ${lit ? C.green : C.edgeHi}`,
              boxShadow: lit ? `0 0 26px ${alpha(C.green, 0.5)}` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.fonts.mono,
              fontWeight: 800,
              fontSize: 76,
              color: C.text,
            }}
          >
            {v}
          </div>
        );
      })}
      {frame >= HALF - 2 ? (
        <div style={{ position: "absolute", left: EX[1] - 50, top: 772, width: (EX[2] - EX[1] + 100) * ease(frame, [HALF - 2, HALF + 10], [0, 1], theme.ease.inOut), height: 18, borderTop: `5px solid ${C.green}`, borderLeft: `5px solid ${C.green}`, borderRight: `5px solid ${C.green}`, borderRadius: "10px 10px 0 0" }} />
      ) : null}
      {(() => {
        const p = spr(TWO - 2, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: "absolute", left: 540, top: 880, width: 70, height: 70, transform: `translate(-50%, -50%) rotate(45deg) scale(${p})`, background: C.green, borderRadius: 12, boxShadow: `0 0 26px ${alpha(C.green, 0.9)}`, zIndex: 5 }}>
            <div style={{ transform: "rotate(-45deg)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.ink }}>4</div>
          </div>
        );
      })()}
      <Pop at={HALF + 6} x={540} y={1080} from="up" dist={24}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          (3 + 5) <span style={{ color: C.dim }}>÷</span> 2 <span style={{ color: C.green, textShadow: glowText(C.green, 0.6) }}>= 4</span>
        </div>
      </Pop>
      <Pop at={TWO + 6} x={540} y={574} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Pill label="MEDIAN = 4" color={C.green} size={46} glow={1} />
      </Pop>
    </AbsoluteFill>
  );
};
