// SCENE 3 — USE 1: ELECTION POLLS. 1,000 voters as a dot grid (yes = cyan, no = dim); RAW: YES / NO bars; then the bell of
// poll results centred on 52% with a ±3% bracket = THE 95% RANGE 49% – 55%.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bracket, FnCurve, gx, ValueAxis } from "../components/Curve";
import { ease, Pop, rng, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { UseDots, UseHeader, USES } from "../components/Uses";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[0];
const r = rng(31);
const VOTES = Array.from({ length: 200 }, () => r() < 0.52);
const G = { x0: 160, x1: 920, vmin: 46, vmax: 58, base: 1180, h: 220 };

export const S3Polls: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const K = s.cueS(1, "1,000");
  const AVG = s.sent(2).from;
  const R = s.cueS(2, "95%");
  const grid = ease(frame, [K - 6, K + 30], [0, 1]);
  const bp = ease(frame, [AVG, AVG + 24], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <UseDots idx={0} />
      <UseHeader u={U} at={s.sent(0).from} />
      <div style={{ position: "absolute", left: 140, top: 540, width: 520, display: "grid", gridTemplateColumns: "repeat(20, 1fr)", gap: 6 }}>
        {VOTES.map((y, i) => (
          <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: y ? U.c : alpha(C.text, 0.3), opacity: i / VOTES.length < grid ? 1 : 0 }} />
        ))}
      </div>
      <Pop at={K + 10} x={830} y={600} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap" }}>
          1,000 VOTERS
          <br />
          <span style={{ fontSize: 22, color: C.dim }}>OUT OF MILLIONS</span>
        </div>
      </Pop>
      <Pop at={s.cueS(1, "yes") - 4} x={830} y={720} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.text, whiteSpace: "nowrap" }}>
          EACH: <span style={{ color: U.c }}>YES</span> / <span style={{ color: C.dim }}>NO</span>
        </div>
      </Pop>
      {bp > 0.001 ? (
        <>
          <FnCurve g={G} f={(v) => Math.exp(-((v - 52) ** 2) / (2 * 1.58 * 1.58))} fmax={1} p={bp} color={U.c} fill={0.18} bands={[{ a: 48.9, b: 55.1, color: U.c, opacity: 0.35, p: ease(frame, [R - 8, R + 8], [0, 1]) }]} />
          <ValueAxis g={G} p={bp} ticks={[47, 49, 52, 55, 57].map((v) => ({ v, label: `${v}%`, color: v === 52 ? U.c : undefined, big: v === 52 }))} label="POLL RESULTS IF REPEATED" />
          <div style={{ position: "absolute", left: 0, right: 0, top: G.base - G.h - 50, textAlign: "center", opacity: bp, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: U.c }}>THE SHARE SAYING YES IS AN AVERAGE: A BELL</div>
          <Bracket x0={gx(G, 48.9)} x1={gx(G, 55.1)} y={G.base - G.h - 10} p={spr(R - 6, theme.spring.bouncy)} color={U.c} />
        </>
      ) : null}
      {frame < s.sent(3).from ? (
        <Pop at={R - 4} x={540} y={1330} from="up" dist={14} cfg={theme.spring.bouncy}>
          <Tag color={U.c} size={30}>
            52% ±3% = A REAL 95% RANGE (49% TO 55%)
          </Tag>
        </Pop>
      ) : (
        <Pop at={s.sent(3).from} x={540} y={1330} from="up" dist={14} cfg={theme.spring.bouncy}>
          <Tag color={C.yellow} size={30}>
            4× THE PEOPLE = HALF THE MARGIN (±1.5%)
          </Tag>
        </Pop>
      )}
    </AbsoluteFill>
  );
};
