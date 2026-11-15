// SCENE 4a — CATEGORICAL → NOMINAL. Blood-group and city cards flip in; ">" comparisons are struck out; a shuffle changes nothing.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, exitP, Mark, Pop, useSpr } from "../components/Motion";
import { BloodDrop, MapPin } from "../components/Icons";
import { Tag, TreeHeader } from "../components/Nodes";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const CAT_HEADER = {
  parent: { label: "CATEGORICAL", color: C.violet },
  kids: [
    { label: "NOMINAL", color: C.violet },
    { label: "ORDINAL", color: C.orange },
  ],
};

const BLOOD = ["A", "B", "AB", "O"];
const BLOOD_X = [195, 415, 635, 855];
const BLOOD_Y = 772;
const BLOOD_SLOTS = [
  [0, 1, 2, 3],
  [2, 3, 1, 0],
  [1, 0, 3, 2],
];
const CITY = ["Bengaluru", "Mumbai", "Delhi"];
const CITY_X = [230, 540, 850];
const CITY_Y = 1088;
const CITY_SLOTS = [
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
];

const slotMove = (frame: number, shuf: number, slots: number[][], card: number, xs: number[]) => {
  const t1 = ease(frame, [shuf, shuf + 14], [0, 1], theme.ease.inOut);
  const t2 = ease(frame, [shuf + 17, shuf + 31], [0, 1], theme.ease.inOut);
  const x0 = xs[slots[0][card]];
  const x1 = xs[slots[1][card]];
  const x2 = xs[slots[2][card]];
  const x = t2 > 0 ? interpolate(t2, [0, 1], [x1, x2]) : interpolate(t1, [0, 1], [x0, x1]);
  const active = t2 > 0 ? t2 : t1;
  const dir = card % 2 === 0 ? -1 : 1;
  return { x, lift: Math.sin(active * Math.PI) * 70 * dir, rot: Math.sin(active * Math.PI) * 9 * dir };
};

export const S5Nominal: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const CAT = s.cue("categorical");
  const NOM = s.cue("nominal.");
  const BG = s.sent(2).from;
  const bloodAt = [s.cue("A,"), s.cue("B,"), s.cue("AB,"), s.cue("O.")];
  const CT = s.sent(3).from;
  const cityAt = [s.cue("Bengaluru,"), s.cue("Mumbai,"), s.cue("Delhi.")];
  const NO = s.cue("no");
  const RANK = s.cue("ranking.");
  const SHUF = s.cue("Shuffle");
  const NOTH = s.cue("nothing");
  const END = s.duration;
  const OUT = END - 13;

  const enter = ease(frame, [0, 16], [1, 0], theme.ease.out);

  return (
    <AbsoluteFill style={{ transform: `translateX(${enter * 720}px)`, opacity: 1 - enter }}>
      <TreeHeader {...CAT_HEADER} parentIn={0} kidsIn={CAT - 2} activeAt={NOM} activeIdx={0} />

      {/* row labels */}
      <Pop at={BG - 6} out={OUT} x={540} y={620} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>BLOOD GROUPS</div>
      </Pop>
      <Pop at={CT - 6} out={OUT} x={540} y={952} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>CITIES</div>
      </Pop>

      {/* blood-group cards flip in on each spoken letter */}
      {BLOOD.map((b, i) => {
        const p = spr(bloodAt[i] - 5, theme.spring.snappy);
        if (p <= 0.001) return null;
        const m = slotMove(frame, SHUF, BLOOD_SLOTS, i, BLOOD_X);
        const ex = exitP(frame, OUT + i * 2, 10);
        return (
          <div
            key={b}
            style={{
              position: "absolute",
              left: m.x - 95 - ex * 900,
              top: BLOOD_Y - 118 - m.lift,
              width: 190,
              height: 236,
              zIndex: m.lift < 0 ? 2 : 1,
              transform: `perspective(900px) rotateY(${(1 - p) * 90}deg) rotate(${m.rot - ex * 20}deg)`,
              opacity: Math.min(1, p * 2) * (1 - ex),
              borderRadius: 28,
              background: `linear-gradient(180deg, ${alpha("#2A2470", 0.95)}, ${alpha("#17154A", 0.95)})`,
              border: `2.5px solid ${alpha(C.violet, 0.55)}`,
              boxShadow: `0 24px 50px -20px rgba(0,0,0,0.7), inset 0 0 30px ${alpha(C.violet, 0.15)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BloodDrop size={128}>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: b.length > 1 ? 44 : 54, color: C.white, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>{b}</span>
            </BloodDrop>
          </div>
        );
      })}

      {/* city cards */}
      {CITY.map((c, i) => {
        const p = spr(cityAt[i] - 5, theme.spring.snappy);
        if (p <= 0.001) return null;
        const m = slotMove(frame, SHUF + 3, CITY_SLOTS, i, CITY_X);
        const ex = exitP(frame, OUT + 3 + i * 2, 10);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: m.x - 146 - ex * 900,
              top: CITY_Y - 68 - m.lift * 0.8,
              width: 292,
              height: 136,
              zIndex: m.lift < 0 ? 2 : 1,
              transform: `perspective(900px) rotateX(${(1 - p) * -90}deg) rotate(${m.rot - ex * 20}deg)`,
              opacity: Math.min(1, p * 2) * (1 - ex),
              borderRadius: 26,
              background: `linear-gradient(180deg, ${alpha("#2A2470", 0.95)}, ${alpha("#17154A", 0.95)})`,
              border: `2.5px solid ${alpha(C.violet, 0.55)}`,
              boxShadow: "0 24px 50px -20px rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <MapPin size={44} color={C.violet} dot="#17154A" />
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, color: C.text }}>{c}</span>
          </div>
        );
      })}

      {/* "is A greater than B?" — no: comparisons appear and are struck out */}
      {[...[305, 525, 745].map((x) => ({ x, y: BLOOD_Y })), ...[385, 695].map((x) => ({ x, y: CITY_Y }))].map((g, i) => {
        const p = spr(NO + i * 2, theme.spring.pop);
        const gone = ease(frame, [SHUF - 6, SHUF], [0, 1], theme.ease.in);
        if (p <= 0.001 || gone >= 1) return null;
        const strike = ease(frame, [RANK - 2 + i * 2, RANK + 6 + i * 2], [0, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.x,
              top: g.y,
              width: 70,
              height: 70,
              borderRadius: 35,
              transform: `translate(-50%, -50%) scale(${p})`,
              opacity: 1 - gone,
              zIndex: 5,
              background: "#0A1033",
              border: `3px solid ${strike > 0.5 ? C.red : C.text}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 46, color: C.text, lineHeight: 1, marginTop: -4, opacity: 1 - strike * 0.5 }}>&gt;</span>
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 80 * strike, height: 8, borderRadius: 4, background: C.red, transform: "translate(-50%, -50%) rotate(-45deg)", boxShadow: `0 0 12px ${alpha(C.red, 0.8)}` }} />
          </div>
        );
      })}

      <Pop at={RANK + 4} out={SHUF + 4} x={540} y={1250} from="up" dist={24} cfg={theme.spring.bouncy}>
        <Tag color={C.red} size={32} icon={<Mark kind="cross" at={RANK + 6} size={34} color={C.red} width={14} />}>
          NO NATURAL ORDER
        </Tag>
      </Pop>
      <Pop at={NOTH} out={OUT} x={540} y={1250} from="up" dist={24} cfg={theme.spring.bouncy}>
        <Tag color={C.violet} size={32} icon={<Mark kind="check" at={NOTH + 2} size={36} color={C.green} width={14} />}>
          ORDER DOESN&apos;T MATTER
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
