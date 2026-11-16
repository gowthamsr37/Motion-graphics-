// SCENE 3 — TWO KINDS. MISTAKES: a survey form, AGE "25" gets an extra 0 → "250" lands in the data table as a
// 250-year-old. REAL BUT RARE: a billionaire, a festival sales spike, a fraudulent payment. Either way → they wreck analysis.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, Crown } from "../components/Icons";
import { CardGlyph, FormGlyph, Money, SpikeGlyph } from "../components/Kit";
import { ease, exitP, Mark, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Tag, TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { OUT_HEADER } from "./S2Define";

const C = theme.colors;
const O = kindColor.outlier;
const MV = kindColor.mistake;
const RV = kindColor.rare;
const AGES = ["24", "31", "19", "27", "250", "22"];
const CELL_X = 790;
const CELL_Y = (i: number) => 650 + i * 78;
const FORM = { x: 325, y: 800 };

export const S3Kinds: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const MIS = s.cueS(0, "mistakes,");
  const TYPO = s.cueS(0, "typo");
  const T25 = s.cueS(0, "25");
  const T250 = s.cueS(0, "250.");
  const REAL = s.sent(1).from;
  const REALW = s.cueS(1, "real,");
  const at3 = [s.cueS(1, "billionaire,"), s.cueS(1, "festival"), s.cueS(1, "fraudulent")];
  const WRECK = s.sent(2).from;
  const WRECKW = s.cueS(2, "wreck");

  const misOut = exitP(frame, REAL - 8, 10);
  // typing: "2" "5" then the stray "0"
  const typed = frame < T25 - 2 ? "" : frame < T25 + 3 ? "2" : frame < T250 - 2 ? "25" : "250";
  const bad = frame >= T250 - 2;
  const fly = ease(frame, [T250 + 4, T250 + 18], [0, 1], theme.ease.inOut);
  const shT = shake(frame, T250 - 2, 10, 8);
  const shW = shake(frame, WRECKW - 2, 14, 12);
  const cursor = Math.floor(frame / 8) % 2 === 0;
  const header =
    frame < REAL
      ? { activeAt: MIS, activeIdx: 0 as const, prevIdx: null }
      : { activeAt: REALW, activeIdx: 1 as const, prevIdx: 0 as const };
  const wreck = ease(frame, [WRECKW - 4, WRECKW + 6], [0, 1]);

  return (
    <AbsoluteFill style={{ transform: `translate(${shW.x}px, ${shW.y}px)` }}>
      <TreeHeader {...OUT_HEADER} parentIn={-60} kidsIn={-60} {...header} />

      {/* MISTAKES: the typo */}
      {misOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - misOut, transform: `translateX(${-60 * misOut}px)` }}>
          <Pop at={TYPO - 8} x={FORM.x} y={FORM.y} from="left" dist={40} cfg={theme.spring.smooth}>
            <div style={{ transform: `translate(${shT.x}px, ${shT.y}px)`, width: 440, boxSizing: "border-box", padding: "24px 28px", borderRadius: 28, background: `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`, border: `2.5px solid ${alpha(MV, 0.6)}`, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: C.dim }}>
                <FormGlyph size={34} color={MV} />
                SURVEY FORM
              </div>
              <div style={{ marginTop: 22, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim }}>NAME</div>
              <div style={{ marginTop: 6, height: 56, borderRadius: 14, border: `2px solid ${C.edge}`, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: C.text }}>Riya</div>
              <div style={{ marginTop: 16, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim }}>AGE</div>
              <div style={{ marginTop: 6, height: 64, borderRadius: 14, border: `3px solid ${bad ? C.red : alpha(MV, 0.8)}`, boxShadow: bad ? `0 0 22px ${alpha(C.red, 0.5)}` : "none", display: "flex", alignItems: "center", padding: "0 18px", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text }}>
                <span>{typed.slice(0, 2)}</span>
                <span style={{ color: C.red, textShadow: glowText(C.red, 0.6) }}>{typed.slice(2)}</span>
                <span style={{ width: 4, height: 40, marginLeft: 4, background: C.text, opacity: cursor && fly < 0.5 ? 0.9 : 0 }} />
              </div>
            </div>
          </Pop>
          <Pop at={T250 + 2} x={FORM.x} y={FORM.y + 200} from="down" dist={16} cfg={theme.spring.pop}>
            <div style={{ padding: "6px 16px", borderRadius: 999, background: alpha(C.red, 0.2), border: `2.5px solid ${C.red}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>ONE EXTRA ZERO</div>
          </Pop>

          {/* the data table */}
          <Pop at={TYPO - 4} x={CELL_X} y={CELL_Y(0) - 70} from="down" dist={16}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>AGE</div>
          </Pop>
          {AGES.map((a, i) => {
            const p = spr(TYPO - 2 + i * 3, theme.spring.smooth);
            if (p <= 0.001) return null;
            const isBad = i === 4;
            const filled = !isBad || fly >= 1;
            const glowBad = isBad && fly >= 1;
            return (
              <div key={i} style={{ position: "absolute", left: CELL_X - 120, top: CELL_Y(i) - 30, width: 240, height: 62, boxSizing: "border-box", borderRadius: 14, background: glowBad ? alpha(O, 0.2) : "rgba(14,24,64,0.74)", border: `2px solid ${glowBad ? O : C.edge}`, boxShadow: glowBad ? `0 0 26px ${alpha(O, 0.55)}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: glowBad ? O : C.text, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 24}px)` }}>
                {filled ? a : ""}
              </div>
            );
          })}
          {fly > 0.001 && fly < 1 ? (
            <div style={{ position: "absolute", left: interpolate(fly, [0, 1], [FORM.x - 120, CELL_X]), top: interpolate(fly, [0, 1], [FORM.y + 96, CELL_Y(4)]) - 40 * Math.sin(Math.PI * fly), transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 38, color: O, textShadow: glowText(O, 0.7) }}>250</div>
          ) : null}
          <Ripple at={T250 + 18} x={CELL_X} y={CELL_Y(4)} color={O} size={260} rings={2} flat={0.4} />
          <Pop at={T250 + 20} x={CELL_X + 168} y={CELL_Y(4)} from="left" dist={14} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: O, textShadow: glowText(O, 0.6) }}>?!</div>
          </Pop>
          <Pop at={T250 + 26} out={REAL - 8} x={540} y={1222} from="up" dist={20} cfg={theme.spring.bouncy}>
            <Tag color={MV} size={28}>
              TYPOS · GLITCHES · WRONG UNITS
            </Tag>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {/* REAL BUT RARE: three cards */}
      {[
        {
          title: "BILLIONAIRE",
          sub: (
            <>
              <Money v="10 CR" size={24} color={C.text} weight={700} /> / month
            </>
          ),
          icon: (
            <div style={{ position: "relative", width: 110, height: 110 }}>
              <Avatar size={110} shirt={O} skin={C.skin[1]} hair={C.hair[0]} mood={0.9} />
              <div style={{ position: "absolute", left: 33, top: -18 }}>
                <Crown size={44} color={O} />
              </div>
            </div>
          ),
        },
        { title: "SALES SPIKE", sub: <>festival day</>, icon: <SpikeGlyph size={110} color={RV} /> },
        {
          title: "FRAUD",
          sub: (
            <>
              <Money v="2L" size={24} color={C.text} weight={700} /> at 3 AM
            </>
          ),
          icon: (
            <div style={{ position: "relative" }}>
              <CardGlyph size={110} color={RV} />
              <div style={{ position: "absolute", right: -14, top: 0, width: 42, height: 42, borderRadius: 21, background: C.red, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28 }}>!</div>
            </div>
          ),
        },
      ].map((k, i) => {
        const p = spr(at3[i] - 4, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const x = 230 + i * 310;
        const col = interpolate(wreck, [0, 1], [0, 1]) > 0.5 ? O : RV;
        return (
          <div key={k.title} style={{ position: "absolute", left: x - 140, top: 820 - 170 + Math.sin(frame / 22 + i) * 3, width: 280, height: 340, boxSizing: "border-box", padding: "30px 18px 22px", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(col, 0.18)}, rgba(14,24,64,0.88) 60%)`, border: `2.5px solid ${alpha(col, 0.75)}`, boxShadow: `0 0 26px ${alpha(col, 0.2)}`, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 60}px) scale(${interpolate(p, [0, 1], [0.7, 1]) * (1 - wreck * 0.04)}) rotate(${wreck * (i - 1) * 2}deg)` }}>
            <div style={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>{k.icon}</div>
            <div style={{ marginTop: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{k.title}</div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim, whiteSpace: "nowrap" }}>{k.sub}</div>
          </div>
        );
      })}
      <Pop at={at3[2] + 14} out={WRECK - 6} x={540} y={1080} from="up" dist={20} cfg={theme.spring.bouncy}>
        <Tag color={RV} size={30} icon={<Mark kind="check" at={at3[2] + 16} size={30} color={RV} width={13} />}>
          REAL, JUST RARE
        </Tag>
      </Pop>
      <Pop at={WRECKW - 4} x={540} y={1110} from="scale" scaleFrom={1.6} cfg={theme.spring.pop}>
        <div style={{ textAlign: "center", padding: "16px 30px", borderRadius: 26, background: alpha("#060B2A", 0.86), border: `3px solid ${O}`, boxShadow: `0 0 34px ${alpha(O, 0.4)}` }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim }}>EITHER WAY</div>
          <div style={{ marginTop: 6, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
            THEY <span style={{ color: O, textShadow: glowText(O, 0.6) }}>WRECK</span> YOUR ANALYSIS
          </div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
