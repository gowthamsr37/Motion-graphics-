// SCENE 8 — REAL LIFE. Three panels, each on its sentence:
// INSURANCE (shield + cars): which driver crashes? unknown · how many of 10 lakh? ≈ known → premium;
// CRICKET (bat): batting average after 3 innings (92.0, misleading) vs after 100 innings (44.6, the real player);
// RATINGS (stars): 5.0 from 3 reviews ✗ vs 4.6 from 5,000 reviews ✓.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Car, Star } from "../components/Casino";
import { BatGlyph } from "../components/Icons";
import { Shield } from "../components/Uses";
import { Panel, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Mark: React.FC<{ ok: boolean; at: number }> = ({ ok, at }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 8], [0, 1]);
  return (
    <div style={{ width: 46, height: 46, borderRadius: 23, background: ok ? C.green : C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>
      <svg width={26} height={26} viewBox="0 0 26 26">
        {ok ? <path d="M4 14 L10 20 L22 6" fill="none" stroke={C.ink} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M6 6 L20 20 M20 6 L6 20" stroke={C.ink} strokeWidth={4.5} strokeLinecap="round" />}
      </svg>
    </div>
  );
};

export const S8Uses: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const INS = s.sent(1).from;
  const HOW = s.cueS(1, "how");
  const PREM = s.cueS(1, "premium.");
  const CRI = s.sent(2).from;
  const I100 = s.cueS(2, "100");
  const RAT = s.sent(3).from;
  const R5000 = s.cueS(3, "5,000");
  return (
    <AbsoluteFill>
      <Pop x={540} y={240} at={s.sent(0).from - 4}>
        <Txt size={64} color={C.yellow} glow>IN REAL LIFE</Txt>
      </Pop>
      {/* insurance */}
      <Pop x={540} y={480} at={INS - 6}>
        <Panel w={980} h={300} color={C.cyan} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 26, padding: "0 30px" }}>
          <Shield size={130} color={C.cyan} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Txt size={30} color={C.cyan} style={{ letterSpacing: "0.12em" }}>INSURANCE</Txt>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Txt size={36} font="body">which driver crashes?</Txt>
              <Txt size={36} color={C.red}>unknown</Txt>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: ease(frame, [HOW - 4, HOW + 6], [0, 1]) }}>
              <Txt size={36} font="body">how many of 10 lakh?</Txt>
              <Txt size={36} color={C.green}>known</Txt>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: ease(frame, [PREM - 6, PREM + 4], [0, 1]) }}>
              {[0, 1, 2, 3].map((i) => (
                <Car key={i} size={70} color={i === 2 ? C.red : alpha(C.text, 0.75)} />
              ))}
              <Txt size={32} color={C.yellow}>→ your premium</Txt>
            </div>
          </div>
        </Panel>
      </Pop>
      {/* cricket */}
      <Pop x={540} y={810} at={CRI - 6}>
        <Panel w={980} h={300} color={C.orange} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 26, padding: "0 30px" }}>
          <BatGlyph size={130} color={C.orange} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Txt size={30} color={C.orange} style={{ letterSpacing: "0.12em" }}>CRICKET · BATTING AVERAGE</Txt>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Txt size={36} font="body">after 3 innings:</Txt>
              <Txt size={46}>92.0</Txt>
              <Mark ok={false} at={CRI + 30} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: ease(frame, [I100 - 4, I100 + 6], [0, 1]) }}>
              <Txt size={36} font="body">after 100 innings:</Txt>
              <Txt size={46} color={C.green}>44.6</Txt>
              <Mark ok at={I100 + 10} />
            </div>
          </div>
        </Panel>
      </Pop>
      {/* ratings */}
      <Pop x={540} y={1140} at={RAT - 6}>
        <Panel w={980} h={300} color={C.yellow} style={{ justifyContent: "center", gap: 18, padding: "0 30px" }}>
          <Txt size={30} color={C.yellow} style={{ letterSpacing: "0.12em" }}>ONLINE RATINGS</Txt>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {[1, 1, 1, 1, 1].map((f, i) => (
              <Star key={i} size={46} fill={f} />
            ))}
            <Txt size={40}>5.0</Txt>
            <Txt size={32} font="body" color={C.dim}>· 3 reviews</Txt>
            <Mark ok={false} at={RAT + 40} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: ease(frame, [R5000 - 10, R5000], [0, 1]) }}>
            {[1, 1, 1, 1, 0.6].map((f, i) => (
              <Star key={i} size={46} fill={f} />
            ))}
            <Txt size={40}>4.6</Txt>
            <Txt size={32} font="body" color={C.dim}>· 5,000 reviews</Txt>
            <Mark ok at={R5000 + 8} />
          </div>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
