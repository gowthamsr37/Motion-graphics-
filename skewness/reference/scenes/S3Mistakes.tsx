// SCENE 3 — MISTAKES: FIX · FILL · REMOVE, on one survey table.
// Sana's age 250 → the form says 25 (fix). Dev's age −5 can't be recovered → filled with the median of the valid ages, 29
// (24, 25, 29, 31, 33). TEST_USER (999) doesn't belong → removed, and the removal is written in a log.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FormGlyph, TREATS, TrashGlyph, TreatPill } from "../components/Kit";
import { ease, Mark, Pop, Ripple, useSpr } from "../components/Motion";
import { TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { OUT_HEADER } from "./S2Why";

const C = theme.colors;
const O = kindColor.outlier;
const MV = kindColor.mistake;
const G = kindColor.median;
const ROWS: [string, string][] = [
  ["Riya", "24"],
  ["Arjun", "31"],
  ["Sana", "250"],
  ["Kabir", "29"],
  ["Meera", "33"],
  ["Dev", "-5"],
  ["TEST_USER", "999"],
];
const RY = (i: number) => 692 + i * 72;
const TX = 120;
const TW = 470;
const NOTE_X = 790;

export const S3Mistakes: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const FIXS = s.sent(0).from;
  const FORM = s.cueS(1, "form");
  const CORR = s.cueS(1, "Correct");
  const FILLS = s.sent(2).from;
  const MED = s.cueS(2, "median,");
  const ROW = s.cueS(2, "row.");
  const REMS = s.sent(3).from;
  const TEST = s.cueS(3, "test");
  const REM = s.cueS(3, "remove");
  const NOTE = s.cueS(3, "note");

  const fixed = frame >= CORR - 2;
  const filled = frame >= MED + 2;
  const gone = ease(frame, [REM, REM + 16], [0, 1], theme.ease.in);
  const strike = ease(frame, [TEST - 2, TEST + 10], [0, 1]);

  const cell = (i: number) => {
    if (i === 2) return { v: fixed ? "25" : "250", col: fixed ? G : O, bad: !fixed };
    if (i === 5) return { v: filled ? "29" : "-5", col: filled ? C.cyan : O, bad: !filled };
    if (i === 6) return { v: "999", col: O, bad: true };
    return { v: ROWS[i][1], col: C.text, bad: false };
  };

  return (
    <AbsoluteFill>
      <TreeHeader {...OUT_HEADER} parentIn={-60} kidsIn={-60} activeAt={FIXS} activeIdx={0} prevIdx={null} />
      <TreatPill t={TREATS[0]} color={MV} at={FIXS - 2} out={FILLS - 8} />
      <TreatPill t={TREATS[1]} color={MV} at={FILLS - 2} out={REMS - 8} />
      <TreatPill t={TREATS[2]} color={MV} at={REMS - 2} />

      {/* the survey table */}
      <Pop at={2} x={TX + TW / 2} y={RY(0) - 58} from="down" dist={12}>
        <div style={{ display: "flex", width: TW, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.22em", color: C.dim }}>
          <span style={{ flex: 1, paddingLeft: 24 }}>NAME</span>
          <span style={{ width: 150, textAlign: "center" }}>AGE</span>
        </div>
      </Pop>
      {ROWS.map((r, i) => {
        const p = spr(4 + i * 3, theme.spring.smooth);
        if (p <= 0.001) return null;
        const c = cell(i);
        const isTest = i === 6;
        const isDev = i === 5;
        const keep = isDev && frame >= ROW - 4;
        return (
          <div key={r[0]} style={{ position: "absolute", left: TX + (isTest ? gone * 380 : 0), top: RY(i) - 31, width: TW, height: 62, boxSizing: "border-box", display: "flex", alignItems: "center", borderRadius: 14, background: c.bad ? alpha(O, 0.12) : keep ? alpha(G, 0.12) : "rgba(14,24,64,0.78)", border: `2px solid ${c.bad ? alpha(O, 0.7) : keep ? alpha(G, 0.7) : C.edge}`, opacity: Math.min(1, p * 2) * (isTest ? 1 - gone : 1), transform: `translateX(${(1 - p) * -40}px) scale(${isTest ? 1 - gone * 0.4 : 1})` }}>
            <span style={{ flex: 1, paddingLeft: 24, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>{r[0]}</span>
            <span style={{ width: 150, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: c.col, textShadow: c.col !== C.text ? glowText(c.col, 0.4) : undefined }}>{c.v}</span>
            {isTest && strike > 0.01 ? <div style={{ position: "absolute", left: 16, top: "50%", width: (TW - 32) * strike, height: 5, borderRadius: 3, background: C.red, boxShadow: `0 0 10px ${alpha(C.red, 0.8)}` }} /> : null}
          </div>
        );
      })}

      {/* fix: the form says 25 */}
      <Pop at={FORM - 4} x={NOTE_X} y={RY(2)} from="right" dist={30} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderRadius: 18, background: `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`, border: `2.5px solid ${fixed ? G : alpha(MV, 0.7)}` }}>
          <FormGlyph size={40} color={fixed ? G : MV} />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 16, letterSpacing: "0.18em", color: C.dim }}>ORIGINAL FORM</div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>AGE: <span style={{ color: G }}>25</span></div>
          </div>
          {fixed ? <Mark kind="check" at={CORR - 2} size={38} color={G} width={13} /> : null}
        </div>
      </Pop>
      <Ripple at={CORR - 2} x={TX + TW - 75} y={RY(2)} color={G} size={200} rings={1} />

      {/* fill: the median of the valid ages */}
      <Pop at={MED - 6} x={NOTE_X} y={RY(5)} from="right" dist={30} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 22px", borderRadius: 18, background: `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`, border: `2.5px solid ${C.cyan}`, textAlign: "center" }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 16, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>MEDIAN OF VALID AGES</div>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.cyan, whiteSpace: "nowrap" }}>= 29</div>
        </div>
      </Pop>
      <Pop at={MED - 2} out={REMS - 4} x={NOTE_X} y={RY(5) - 80} from="down" dist={12}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 20, color: C.dim, whiteSpace: "nowrap" }}>24 25 <span style={{ color: C.cyan }}>29</span> 31 33</div>
      </Pop>
      <Pop at={ROW - 4} out={REMS - 4} x={TX + 150} y={RY(5) + 46} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: G, whiteSpace: "nowrap" }}>ROW KEPT</div>
      </Pop>

      {/* remove: doesn't belong */}
      <Pop at={TEST - 2} x={NOTE_X + 40} y={RY(6) - 4} from="right" dist={20} cfg={theme.spring.pop}>
        <div style={{ padding: "6px 14px", borderRadius: 999, background: alpha(C.red, 0.18), border: `2.5px solid ${C.red}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>TEST ACCOUNT</div>
      </Pop>
      {(() => {
        const p = spr(REM - 6, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: "absolute", left: 870, top: RY(6) + 60, transform: `translate(-50%, -50%) scale(${p}) rotate(${frame > REM + 14 && frame < REM + 24 ? Math.sin(frame * 2) * 8 : 0}deg)` }}>
            <TrashGlyph size={80} color={alpha(C.text, 0.85)} />
          </div>
        );
      })()}
      <Pop at={NOTE - 4} x={430} y={1262} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 22px", borderRadius: 18, background: alpha("#060B2A", 0.88), border: `2.5px dashed ${alpha(C.text, 0.5)}` }}>
          <FormGlyph size={34} color={C.text} />
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.text, whiteSpace: "nowrap" }}>
            LOG: removed TEST_USER <span style={{ color: C.dim }}>(test account)</span>
          </div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
