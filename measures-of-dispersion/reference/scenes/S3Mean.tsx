// SCENE 3 — MEAN = the fair share. Five friends' chai cups (5, 2, 8, 2, 3) pour into one kettle (20) and are dealt back equally (4 each).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { Avatar, ChaiCup, Kettle } from "../components/Icons";
import { Pill, Tag, TreeHeaderN } from "../components/Nodes";
import { BASE, COLS, CUP, ColLabel, cupCenterY } from "../components/Cups";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const MMM_HEADER = {
  parent: { label: "CENTRAL TENDENCY", color: kindColor.data },
  kids: [
    { label: "MEAN", color: kindColor.mean },
    { label: "MEDIAN", color: kindColor.median },
    { label: "MODE", color: kindColor.mode },
  ],
};
export const VALUES = [5, 2, 8, 2, 3];
export const FRIENDS = [
  { shirt: "#60A5FA", skin: C.skin[0], hair: C.hair[0] },
  { shirt: "#F472B6", skin: C.skin[2], hair: C.hair[1] },
  { shirt: "#A3E635", skin: C.skin[1], hair: C.hair[2] },
  { shirt: "#E879F9", skin: C.skin[3], hair: C.hair[0] },
  { shirt: "#FDE68A", skin: C.skin[0], hair: C.hair[3] },
];
export const AVATAR_Y = BASE + 112;
const KX = 540;
const KY = 724;
const FLY = 14;

// the 20 cups: original slot (column k, level j), pour order = left→right, top cup first; dealt round-robin
const CUPS = (() => {
  const list: { k: number; j: number }[] = [];
  VALUES.forEach((n, k) => {
    for (let j = n - 1; j >= 0; j--) list.push({ k, j });
  });
  return list.map((c, g) => ({ ...c, g, c: g % 5, l: Math.floor(g / 5) }));
})();

export const S3Mean: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const F0 = s.sent(0).from;
  const numAt = [s.cueS(1, "5,"), s.cueS(1, "2,", 0), s.cueS(1, "8,"), s.cueS(1, "2,", 1), s.cueS(1, "3.")];
  const MEANW = s.cueS(2, "mean");
  const FAIR = s.cueS(2, "fair");
  const POUR = s.sent(3).from;
  const TWENTY = s.cueS(3, "20.");
  const SHARE = s.sent(4).from;
  const FOUR = s.cueS(4, "4.");
  const M4 = s.sent(5).from;

  const pourAt = (g: number) => POUR + 4 + g * 1.3;
  const dealAt = (g: number) => SHARE + 4 + g * 1.5;
  const inPot = CUPS.filter((c) => frame >= pourAt(c.g) + FLY).length - CUPS.filter((c) => frame >= dealAt(c.g)).length;
  const poured = CUPS.filter((c) => frame >= pourAt(c.g) + FLY).length;
  const kettle = spr(FAIR - 4, theme.spring.bouncy);
  const lastOut = VALUES.map((_, k) => Math.max(...CUPS.filter((c) => c.k === k).map((c) => pourAt(c.g))));
  const equal = ease(frame, [FOUR - 2, FOUR + 8], [0, 1]);

  return (
    <AbsoluteFill>
      <TreeHeaderN {...MMM_HEADER} parentIn={0} zoomFrom={1.8} kidsIn={2} activeAt={MEANW} activeIdx={0} />

      {/* friends */}
      {FRIENDS.map((f, k) => {
        const p = spr(F0 + k * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={k} style={{ position: "absolute", left: COLS[k] - 42, top: AVATAR_Y - 42, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px)` }}>
            <Avatar size={84} shirt={f.shirt} skin={f.skin} hair={f.hair} mood={frame >= FOUR ? 1 : 0.5} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 100, top: BASE + 4, width: 880, height: 4, borderRadius: 2, background: alpha(C.text, 0.3), opacity: ease(frame, [F0, F0 + 10], [0, 1]) }} />

      {/* value labels: the real counts, then everyone's fair share */}
      {VALUES.map((v, k) => {
        const p = spr(numAt[k], theme.spring.pop);
        const emptied = frame >= lastOut[k] + 4 && frame < FOUR;
        return (
          <React.Fragment key={k}>
            <div style={{ opacity: (1 - equal) * (emptied ? 0.35 : 1) }}>
              <ColLabel x={COLS[k]} value={String(v)} color={C.text} p={p} />
            </div>
            <div style={{ opacity: equal }}>
              <ColLabel x={COLS[k]} value="4" color={C.cyan} p={equal} />
            </div>
          </React.Fragment>
        );
      })}

      {/* "mean = fair share", then the working */}
      <Pop at={FAIR - 2} out={POUR - 4} x={540} y={574} from="up" dist={20} cfg={theme.spring.bouncy}>
        <Tag color={C.cyan} size={32}>
          MEAN <span style={{ color: C.cyan }}>=</span> THE FAIR SHARE
        </Tag>
      </Pop>
      {frame >= POUR - 2 && frame < SHARE + 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 574, display: "flex", justifyContent: "center", gap: 14, transform: "translateY(-50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 54, color: C.text, opacity: ease(frame, [SHARE - 2, SHARE + 4], [1, 0]) }}>
          {VALUES.map((v, k) => {
            const on = ease(frame, [pourAt(CUPS.find((c) => c.k === k)!.g) - 2, lastOut[k] + 4], [0, 1]);
            return (
              <React.Fragment key={k}>
                {k > 0 ? <span style={{ color: C.dim, opacity: on }}>+</span> : null}
                <span style={{ opacity: 0.25 + 0.75 * on, color: on > 0.9 ? C.text : C.dim }}>{v}</span>
              </React.Fragment>
            );
          })}
          {(() => {
            const p = spr(TWENTY - 2, theme.spring.pop);
            return (
              <span style={{ opacity: p, color: C.cyan, transform: `scale(${interpolate(p, [0, 1], [1.4, 1])})`, textShadow: glowText(C.cyan, 0.6) }}>
                = 20
              </span>
            );
          })()}
        </div>
      ) : null}
      <Pop at={SHARE + 4} out={M4 - 4} x={540} y={574} from="up" dist={24}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap" }}>
          20 <span style={{ color: C.dim }}>÷</span> 5 <span style={{ color: C.cyan, textShadow: glowText(C.cyan, 0.6) }}>= 4</span>
        </div>
      </Pop>
      <Pop at={M4 - 2} x={540} y={574} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Pill label="MEAN = 4" color={C.cyan} size={46} glow={1} />
      </Pop>

      {/* the kettle */}
      {kettle > 0.01 ? (
        <div style={{ position: "absolute", left: KX - 95, top: KY - 86, transform: `scale(${interpolate(kettle, [0, 1], [0.4, 1]) * (1 + (inPot > 0 ? Math.sin(frame / 3) * 0.01 : 0))})`, opacity: Math.min(1, kettle * 2) * (1 - ease(frame, [M4 + 6, M4 + 16], [0, 1])) }}>
          <Kettle size={190} fill={inPot / 20} />
        </div>
      ) : null}
      {poured > 0 && frame < SHARE + 30 ? (
        <div style={{ position: "absolute", left: 720, top: KY, transform: "translate(-50%, -50%)", textAlign: "center", opacity: ease(frame, [SHARE + 16, SHARE + 30], [1, 0]) }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 64, color: C.text, lineHeight: 1 }}>{poured}</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.22em", color: C.dim }}>CUPS</div>
        </div>
      ) : null}

      {/* the 20 cups: build → pour → deal */}
      {CUPS.map((cup) => {
        const appear = numAt[cup.k] + cup.j * 2;
        const p = spr(appear, theme.spring.pop);
        if (p <= 0.001) return null;
        const t0 = pourAt(cup.g);
        const t1 = dealAt(cup.g);
        const x0 = COLS[cup.k];
        const y0 = cupCenterY(BASE, cup.j);
        const x2 = COLS[cup.c];
        const y2 = cupCenterY(BASE, cup.l);
        let x = x0;
        let y = y0;
        let sc = interpolate(p, [0, 1], [0.5, 1]);
        let vis = Math.min(1, p * 2);
        let dy = (1 - p) * -36;
        if (frame >= t0 && frame < t1) {
          const e = ease(frame, [t0, t0 + FLY], [0, 1], theme.ease.inOut);
          x = interpolate(e, [0, 1], [x0, KX]);
          y = interpolate(e, [0, 1], [y0, KY - 40]) - Math.sin(e * Math.PI) * 140;
          sc = interpolate(e, [0, 1], [1, 0.55]);
          vis = e >= 1 ? 0 : 1;
          dy = 0;
        } else if (frame >= t1) {
          const e = ease(frame, [t1, t1 + FLY], [0, 1], theme.ease.inOut);
          x = interpolate(e, [0, 1], [KX, x2]);
          y = interpolate(e, [0, 1], [KY - 40, y2]) - Math.sin(e * Math.PI) * 120;
          sc = interpolate(e, [0, 1], [0.55, 1]);
          vis = 1;
          dy = 0;
        }
        return (
          <div key={cup.g} style={{ position: "absolute", left: x - CUP.w / 2, top: y - (CUP.w * 0.66) / 2, opacity: vis, transform: `translateY(${dy}px) scale(${sc})`, zIndex: 3 }}>
            <ChaiCup w={CUP.w} glow={frame >= FOUR ? alpha(C.cyan, 0.7) : undefined} />
          </div>
        );
      })}

      {/* the fair-share level line */}
      {equal > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 100,
            top: BASE - 4 * CUP.step - 3,
            width: 880 * equal,
            height: 0,
            borderTop: `6px dashed ${C.cyan}`,
            filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.8)})`,
            zIndex: 4,
          }}
        />
      ) : null}
      <Burst at={TWENTY} x={KX} y={KY - 60} color={C.cyan} count={14} radius={150} seed={12} />
    </AbsoluteFill>
  );
};
