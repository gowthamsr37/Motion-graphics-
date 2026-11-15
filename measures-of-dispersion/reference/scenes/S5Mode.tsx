// SCENE 5 — MODE = the most common value. The two "2" stacks pair up and get the crown; then it works for categories: masala wins.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Mark, Pop, useSpr } from "../components/Motion";
import { Avatar, Crown } from "../components/Icons";
import { Pill, Tag, TreeHeaderN } from "../components/Nodes";
import { BASE, COLS, CUP, ColLabel, CupStack } from "../components/Cups";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { AVATAR_Y, FRIENDS, MMM_HEADER } from "./S3Mean";

const C = theme.colors;
const SORTED = [2, 2, 3, 5, 8];
const WHO = [1, 3, 4, 0, 2]; // friend index standing at each sorted position
const FLAVOURS = [
  { name: "MASALA", votes: 6, x: 270 },
  { name: "GINGER", votes: 4, x: 540 },
  { name: "ELAICHI", votes: 2, x: 810 },
];

export const S5Mode: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const MODEW = s.cueS(0, "mode");
  const COMMON = s.cueS(0, "common");
  const TWOF = s.cueS(1, "Two");
  const MODE2 = s.cueS(1, "2.");
  const CAT = s.sent(2).from;
  const CATEG = s.cueS(2, "categories,");
  const FLAV = s.cueS(2, "flavour.");
  const WIN = s.sent(3).from;

  const pair = ease(frame, [TWOF, TWOF + 14], [0, 1], theme.ease.inOut);
  const colsOut = exitP(frame, CAT - 2, 10);
  const crownP = spr(MODE2 - 4, theme.spring.bouncy);
  const shift = [34 * pair, -34 * pair, 0, 0, 0]; // the two 2s step towards each other
  const winP = spr(WIN - 2, theme.spring.bouncy);

  return (
    <AbsoluteFill>
      <TreeHeaderN {...MMM_HEADER} parentIn={-60} kidsIn={-60} activeAt={MODEW} activeIdx={2} prevIdx={1} />

      <Pop at={MODEW - 2} out={MODE2 - 6} x={540} y={574} from="up" dist={20} cfg={theme.spring.bouncy}>
        <Tag color={C.violet} size={32}>
          MODE <span style={{ color: C.violet }}>=</span> THE MOST COMMON VALUE
        </Tag>
      </Pop>
      <Pop at={MODE2 - 2} out={CAT - 2} x={540} y={574} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Pill label="MODE = 2" color={C.violet} size={46} glow={1} />
      </Pop>

      {/* sorted stacks, with how often each value appears */}
      {colsOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - colsOut, transform: `translateY(${colsOut * 40}px)` }}>
          <div style={{ position: "absolute", left: 100, top: BASE + 4, width: 880, height: 4, borderRadius: 2, background: alpha(C.text, 0.3) }} />
          {SORTED.map((v, i) => {
            const isTwo = v === 2;
            const glow = isTwo && pair > 0.3 ? alpha(C.violet, 0.9) : undefined;
            const dim = !isTwo && pair > 0.3 ? 0.45 : 1;
            const f = FRIENDS[WHO[i]];
            return (
              <div key={i} style={{ position: "absolute", inset: 0, transform: `translateX(${shift[i]}px)` }}>
                <CupStack x={COLS[i]} n={v} appear={(j) => i * 3 + j * 1.5} glow={glow} dim={dim} />
                <div style={{ opacity: dim }}>
                  <ColLabel x={COLS[i]} value={String(v)} color={isTwo && pair > 0.3 ? C.violet : C.text} p={spr(2 + i * 3, theme.spring.pop)} />
                </div>
                <div style={{ position: "absolute", left: COLS[i] - 42, top: AVATAR_Y - 42, opacity: dim * Math.min(1, spr(i * 3, theme.spring.bouncy) * 2) }}>
                  <Avatar size={84} shirt={f.shirt} skin={f.skin} hair={f.hair} mood={isTwo && pair > 0.3 ? 1 : 0.5} />
                </div>
              </div>
            );
          })}
          {/* frequency tags */}
          {[
            { x: (COLS[0] + COLS[1]) / 2, t: "×2", v: 2, hot: true },
            { x: COLS[2], t: "×1", v: 3, hot: false },
            { x: COLS[3], t: "×1", v: 5, hot: false },
            { x: COLS[4], t: "×1", v: 8, hot: false },
          ].map((q, i) => (
            <Pop key={i} at={COMMON + i * 3} out={CAT - 4} x={q.x} y={BASE - q.v * CUP.step - (q.hot ? 120 : 44)} from="down" dist={18} cfg={theme.spring.pop} dim={!q.hot && pair > 0.3 ? 0.5 : 1}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 14,
                  background: q.hot ? alpha(C.violet, 0.25) : "rgba(8,14,44,0.85)",
                  border: `2.5px solid ${q.hot ? C.violet : C.edgeHi}`,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 800,
                  fontSize: q.hot ? 36 : 28,
                  color: C.text,
                }}
              >
                {q.t}
              </div>
            </Pop>
          ))}
          {crownP > 0.01 ? (
            <div style={{ position: "absolute", left: (COLS[0] + COLS[1]) / 2 - 50, top: BASE - 2 * CUP.step - 230, transform: `translateY(${(1 - crownP) * -260}px) rotate(${(1 - crownP) * 18}deg)`, opacity: Math.min(1, crownP * 2) }}>
              <Crown size={100} color={C.violet} />
            </div>
          ) : null}
          <Burst at={MODE2} x={(COLS[0] + COLS[1]) / 2} y={BASE - 2 * CUP.step - 190} color={C.violet} count={14} radius={150} seed={33} />
        </AbsoluteFill>
      ) : null}

      {/* categories: favourite chai flavour */}
      {frame >= CAT - 2 ? (
        <AbsoluteFill>
          <Pop at={CAT} x={540} y={690} from="up" dist={20}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>FAVOURITE CHAI · VOTES</div>
          </Pop>
          <div style={{ position: "absolute", left: 140, top: BASE + 4, width: 800, height: 4, borderRadius: 2, background: alpha(C.text, 0.3), opacity: ease(frame, [CAT, CAT + 8], [0, 1]) }} />
          {FLAVOURS.map((fl, i) => {
            const isWin = i === 0;
            const start = CATEG + i * 6;
            return (
              <React.Fragment key={fl.name}>
                <CupStack x={fl.x} n={fl.votes} appear={(j) => start + j * 3} glow={isWin && winP > 0.3 ? alpha(C.violet, 0.9) : undefined} dim={!isWin && winP > 0.3 ? 0.5 : 1} />
                <Pop at={CAT + 4 + i * 4} x={fl.x} y={BASE + 46} from="up" dist={16} dim={!isWin && winP > 0.3 ? 0.5 : 1}>
                  <div style={{ padding: "8px 18px", borderRadius: 16, background: isWin && winP > 0.3 ? alpha(C.violet, 0.25) : alpha(C.violet, 0.1), border: `2.5px solid ${alpha(C.violet, isWin && winP > 0.3 ? 1 : 0.5)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, letterSpacing: "0.04em" }}>
                    {fl.name}
                  </div>
                </Pop>
                <Pop at={start + fl.votes * 3} x={fl.x + 62} y={BASE - fl.votes * CUP.step + 10} from="left" dist={14} cfg={theme.spring.pop} dim={!isWin && winP > 0.3 ? 0.5 : 1}>
                  <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.dim }}>{fl.votes}</div>
                </Pop>
              </React.Fragment>
            );
          })}
          {winP > 0.01 ? (
            <div style={{ position: "absolute", left: 270 - 50, top: BASE - 6 * CUP.step - 96, transform: `translateY(${(1 - winP) * -260}px) rotate(${(1 - winP) * -18}deg)`, opacity: Math.min(1, winP * 2) }}>
              <Crown size={100} color={C.violet} />
            </div>
          ) : null}
          <Burst at={WIN} x={270} y={BASE - 6 * CUP.step - 60} color={C.violet} count={16} radius={160} seed={44} />
          <Pop at={WIN} x={540} y={574} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
            <Pill label="MODE = MASALA" color={C.violet} size={44} glow={1} />
          </Pop>
          {/* only the mode works on categories */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1290, display: "flex", justifyContent: "center", gap: 18 }}>
            {[
              { l: "MEAN", ok: false, c: C.cyan },
              { l: "MEDIAN", ok: false, c: C.green },
              { l: "MODE", ok: true, c: C.violet },
            ].map((m, i) => {
              const p = spr(FLAV + 2 + i * 4, theme.spring.pop);
              return (
                <div
                  key={m.l}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px 8px 12px",
                    borderRadius: 999,
                    border: `2px solid ${alpha(m.c, m.ok ? 1 : 0.5)}`,
                    background: alpha(m.c, m.ok ? 0.2 : 0.06),
                    opacity: Math.min(1, p * 2) * (m.ok ? 1 : 0.7),
                    transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
                    fontFamily: theme.fonts.display,
                    fontWeight: 800,
                    fontSize: 26,
                    color: C.text,
                  }}
                >
                  <Mark kind={m.ok ? "check" : "cross"} at={FLAV + 4 + i * 4} size={30} color={m.ok ? C.green : C.red} width={13} />
                  {m.l}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
