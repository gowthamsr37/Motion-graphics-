// SCENE 3 — RANGE. Both batters' scores on one scale; same average 40; range = highest − lowest (14 vs 70);
// then one freak innings (a 0) stretches A's range to 47, which shows how fragile the range is.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, exitP, Pop, Ripple, useSpr } from "../components/Motion";
import { Tag, TreeHeaderN } from "../components/Nodes";
import { A_SCORES, Axis, B_SCORES, BatterChip, Bracket, FULL, labelLift, labelNudge, ScoreDot, sx } from "../components/Runs";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const DISP_HEADER = {
  parent: { label: "DISPERSION", color: kindColor.data },
  kids: [
    { label: "RANGE", color: kindColor.range },
    { label: "VARIANCE", color: kindColor.variance },
    { label: "STD DEV", color: kindColor.sd },
  ],
};
const ROW_A = 720;
const ROW_B = 1000;

export const S3Range: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const SC = s.sent(0).from;
  const AVG = s.sent(1).from;
  const RG = s.sent(2).from;
  const RANGEW = s.cueS(2, "range");
  const A14 = s.cueS(3, "14");
  const B70 = s.cueS(3, "70");
  const FREAK = s.cueS(4, "freak");
  const FOOL = s.cueS(4, "fool");
  const END = s.duration;

  const axA = ease(frame, [SC - 6, SC + 10], [0, 1], theme.ease.inOut);
  const axB = ease(frame, [SC + 4, SC + 20], [0, 1], theme.ease.inOut);
  const mean = ease(frame, [AVG - 4, AVG + 10], [0, 1], theme.ease.inOut);
  const brA = ease(frame, [A14 - 4, A14 + 10], [0, 1], theme.ease.inOut);
  const brB = ease(frame, [B70 - 4, B70 + 12], [0, 1], theme.ease.inOut);
  const freakIn = ease(frame, [FREAK - 4, FREAK + 8], [0, 1]);
  const freakOut = ease(frame, [FOOL + 22, FOOL + 34], [0, 1], theme.ease.in);
  const freak = freakIn * (1 - freakOut);
  const stretch = ease(frame, [FREAK + 4, FREAK + 16], [0, 1], theme.ease.inOut) * (1 - freakOut);
  const out = exitP(frame, END - 12, 10);

  return (
    <AbsoluteFill>
      <TreeHeaderN {...DISP_HEADER} parentIn={0} zoomFrom={1.8} kidsIn={2} activeAt={RANGEW} activeIdx={0} />
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <Pop at={SC - 4} x={830} y={ROW_A - 95} from="right" dist={30}>
          <BatterChip who="A" />
        </Pop>
        <Pop at={SC + 8} x={830} y={ROW_B - 95} from="right" dist={30}>
          <BatterChip who="B" />
        </Pop>
        <Axis sc={FULL} y={ROW_A} p={axA} step={10} />
        <Axis sc={FULL} y={ROW_B} p={axB} step={10} />
        {mean > 0.01 ? <div style={{ position: "absolute", left: sx(FULL, 40) - 2, top: 650, height: 430 * mean, borderLeft: `4px dashed ${alpha(C.text, 0.75)}` }} /> : null}
        <Pop at={AVG} x={sx(FULL, 40)} y={588} from="down" dist={18} cfg={theme.spring.bouncy}>
          <div style={{ padding: "6px 16px", borderRadius: 14, background: "rgba(8,14,44,0.9)", border: `2px solid ${alpha(C.text, 0.6)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>BOTH AVG 40</div>
        </Pop>

        {A_SCORES.map((v, i) => (
          <ScoreDot key={`a${i}`} x={sx(FULL, v)} y={ROW_A} at={SC + 2 + i * 3} who="A" label={String(v)} r={16} labelDx={labelNudge("A", v)} labelDy={labelLift("A", v)} ring={(i === 0 || i === 3) && brA > 0.5 ? alpha(C.cyan, 0.8) : undefined} />
        ))}
        {B_SCORES.map((v, i) => (
          <ScoreDot key={`b${i}`} x={sx(FULL, v)} y={ROW_B} at={SC + 16 + i * 3} who="B" label={String(v)} r={16} ring={(i === 0 || i === 3) && brB > 0.5 ? alpha(C.cyan, 0.8) : undefined} />
        ))}

        {/* range brackets */}
        {brA > 0.01 ? <Bracket x0={sx(FULL, stretch > 0 ? 33 - 33 * stretch : 33)} x1={sx(FULL, 47)} y={ROW_A + 52} p={brA} color={stretch > 0.5 ? C.red : C.cyan} /> : null}
        {brB > 0.01 ? <Bracket x0={sx(FULL, 5)} x1={sx(FULL, 75)} y={ROW_B + 52} p={brB} color={C.cyan} /> : null}
        <Pop at={A14} x={sx(FULL, 40)} y={ROW_A + 104} from="up" dist={16} cfg={theme.spring.pop} dim={1 - stretch}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
            47 - 33 = <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.6) }}>14</span>
          </div>
        </Pop>
        <Pop at={B70} x={sx(FULL, 40)} y={ROW_B + 104} from="up" dist={16} cfg={theme.spring.pop}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
            75 - 5 = <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.6) }}>70</span>
          </div>
        </Pop>
        <Pop at={RG + 4} out={FREAK - 6} x={540} y={1250} from="up" dist={20} cfg={theme.spring.bouncy}>
          <Tag color={C.cyan} size={30}>
            RANGE <span style={{ color: C.cyan }}>=</span> HIGHEST - LOWEST
          </Tag>
        </Pop>

        {/* one freak innings */}
        {freak > 0.01 ? (
          <>
            <div style={{ position: "absolute", left: sx(FULL, 0) - 19, top: ROW_A - 19, width: 38, height: 38, borderRadius: 19, background: C.red, boxShadow: `0 0 20px ${alpha(C.red, 0.9)}`, transform: `scale(${spr(FREAK - 4, theme.spring.pop)})`, opacity: freak, zIndex: 3 }} />
            <div style={{ position: "absolute", left: sx(FULL, 0), top: ROW_A - 46, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.red, opacity: freak }}>0</div>
            <div style={{ position: "absolute", left: sx(FULL, 23.5), top: ROW_A + 104, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.red, opacity: freak * stretch, textShadow: glowText(C.red, 0.6), whiteSpace: "nowrap" }}>
              RANGE 47?!
            </div>
          </>
        ) : null}
        <Ripple at={FREAK} x={sx(FULL, 0)} y={ROW_A} color={C.red} size={220} rings={2} />
        <Pop at={FREAK + 6} out={FOOL + 22} x={540} y={1250} from="up" dist={20} cfg={theme.spring.bouncy}>
          <Tag color={C.red} size={30}>
            ONE FREAK SCORE FOOLS IT
          </Tag>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
