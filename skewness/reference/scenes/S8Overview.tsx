// SCENE 8 — THE COMPLETE PICTURE. Decision tree: ASK WHY → MISTAKE (fix · fill · remove) | REAL BUT RARE
// (cap · transform · robust tools · keep & study), each leaf landing on its spoken word.
// Then the golden rule: unsure? run it with and without the outlier (commute mean 28.9 vs 25.4) and report both.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { TREATS } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { bezier, Chip, Pill, Wires } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
const MV = kindColor.mistake;
const RV = kindColor.rare;
const GR = kindColor.median;
const ROOT: [number, number] = [540, 380];
const BR: [number, number][] = [
  [290, 520],
  [790, 520],
];
const LEAF_Y = (r: number) => 640 + r * 104;
const WORDS = ["fix,", "fill,", "remove.", "cap,", "transform,", "robust,", "keep"];

export const S8Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const HERE = s.sent(0).from;
  const MISW = s.cueS(1, "Mistakes:");
  const REALW = s.cueS(2, "Real");
  const GOLD = s.sent(3).from;
  const WITH = s.cueS(3, "with");
  const BOTH = s.cueS(3, "both.");
  const leafAt = WORDS.map((w, i) => s.cueS(i < 3 ? 1 : 2, w));

  const dim = 1 - 0.7 * ease(frame, [GOLD - 4, GOLD + 8], [0, 1]);
  const draw = (a: number, b: number) => ease(frame, [a, b], [0, 1], theme.ease.inOut);
  const wires = BR.map((b, i) => {
    const w = bezier([ROOT[0], ROOT[1] + 30], [b[0], b[1] - 28], 0.6);
    const at = i === 0 ? MISW : REALW;
    return { d: w.d, at: w.at, color: i === 0 ? MV : RV, p: draw(at - 12, at + 2), pulseFrom: at + 10 };
  });
  const card = spr(GOLD - 2, theme.spring.smooth);

  return (
    <AbsoluteFill>
      <Pop at={HERE - 4} x={540} y={262} from="up" dist={16}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.26em", color: C.dim, whiteSpace: "nowrap" }}>THE COMPLETE PICTURE</div>
      </Pop>
      <AbsoluteFill style={{ opacity: dim }}>
        <Wires wires={wires} />
        <Pop at={HERE} x={ROOT[0]} y={ROOT[1]} from="scale" scaleFrom={0.4} cfg={theme.spring.bouncy}>
          <Pill label="OUTLIER? ASK WHY" color={O} size={34} glow={0.7} />
        </Pop>
        <Pop at={MISW - 2} x={BR[0][0]} y={BR[0][1]} from="scale" scaleFrom={0.4} cfg={theme.spring.bouncy}>
          <Pill label="MISTAKE" color={MV} size={30} glow={0.5} />
        </Pop>
        <Pop at={REALW - 2} x={BR[1][0]} y={BR[1][1]} from="scale" scaleFrom={0.4} cfg={theme.spring.bouncy}>
          <Pill label="REAL BUT RARE" color={RV} size={30} glow={0.5} />
        </Pop>
        {TREATS.map((t, i) => {
          const isM = t.kind === "mistake";
          const col = isM ? MV : RV;
          const p = spr(leafAt[i] - 3, theme.spring.bouncy);
          if (p <= 0.001) return null;
          const G = t.glyph;
          return (
            <div key={t.label} style={{ position: "absolute", left: isM ? 290 : 790, top: LEAF_Y(isM ? i : i - 3), transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2) }}>
              <Chip icon={<G size={32} color={col} />} text={`${t.n}  ${t.label}`} color={col} width={390} size={28} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* the golden rule */}
      {card > 0.01 ? (
        <div style={{ position: "absolute", left: 90, top: 1040 + (1 - card) * 60, width: 900, height: 280, boxSizing: "border-box", padding: "22px 30px", borderRadius: 32, background: `linear-gradient(180deg, ${alpha(GR, 0.22)}, rgba(10,18,52,0.95))`, border: `3px solid ${GR}`, boxShadow: `0 0 34px ${alpha(GR, 0.35)}`, opacity: Math.min(1, card * 2), textAlign: "center" }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.3em", color: GR }}>THE GOLDEN RULE</div>
          <div style={{ marginTop: 8, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
            UNSURE? RUN IT <span style={{ color: GR, textShadow: glowText(GR, 0.5) }}>BOTH WAYS</span>
          </div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 18 }}>
            {[
              { l: "WITH THE JAM", v: "28.9", at: WITH },
              { l: "WITHOUT IT", v: "25.4", at: WITH + 8 },
            ].map((r) => {
              const p = spr(r.at, theme.spring.pop);
              return (
                <div key={r.l} style={{ opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, padding: "8px 18px", borderRadius: 16, background: alpha("#060B2A", 0.8), border: `2px solid ${alpha(C.text, 0.4)}`, whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: C.dim }}>{r.l} · MEAN </span>
                  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text }}>{r.v}</span>
                </div>
              );
            })}
          </div>
          {(() => {
            const p = spr(BOTH - 4, theme.spring.pop);
            return <div style={{ marginTop: 14, opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [1.4, 1])})`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: GR, textShadow: glowText(GR, 0.4), whiteSpace: "nowrap" }}>AND REPORT BOTH</div>;
          })()}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
