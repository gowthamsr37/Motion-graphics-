// SCENE 3a — NUMERICAL → DISCRETE. Five students walk in one by one; the counter and number line step 1…5; 3.5 is stamped out.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Mark, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Arrow, Person } from "../components/Icons";
import { Tag, TreeHeader } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const NUM_HEADER = {
  parent: { label: "NUMERICAL", color: C.cyan },
  kids: [
    { label: "DISCRETE", color: C.cyan },
    { label: "CONTINUOUS", color: C.green },
  ],
};

const PANEL = { x: 70, y: 548, w: 940, h: 782 };
const DOOR_X = 120;
const SEATS = [330, 460, 590, 720, 850];
const FEET = 1118;
const LINE_Y = 1236;
const lineX = (v: number) => 160 + v * 126;
const STUDENTS = [
  { shirt: C.cyan, skin: C.skin[0], hair: C.hair[0], pack: C.violet },
  { shirt: C.violet, skin: C.skin[2], hair: C.hair[1], pack: C.orange },
  { shirt: C.green, skin: C.skin[1], hair: C.hair[2], pack: C.cyan },
  { shirt: C.orange, skin: C.skin[3], hair: C.hair[0], pack: C.green },
  { shirt: "#F472B6", skin: C.skin[0], hair: C.hair[3], pack: C.cyan },
];
const NUM_WORDS = ["One.", "Two.", "Three.", "Four.", "Five."];

export const S3Discrete: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const TWO = s.cue("two");
  const DISC = s.cue("discrete.");
  const CLASS = s.sent(2).from;
  const arrive = NUM_WORDS.map((_, k) => s.sent(3 + k).from); // each number is its own TTS segment: exact onsets
  const COUNTED = s.cue("counted,");
  const WHOLE = s.cue("whole");
  const HALF = s.sent(9).from;
  const HALF_X = s.cueS(9, "students!");
  const END = s.duration;
  const OUT = END - 12;

  const panelIn = spr(CLASS - 8, theme.spring.smooth);
  const out = ease(frame, [OUT, END], [0, 1], theme.ease.in);
  const door = ease(frame, [CLASS + 6, CLASS + 18], [0, 1], theme.ease.out);
  const count = arrive.filter((a) => frame >= a).length;
  const lastArr = count > 0 ? arrive[count - 1] : -100;
  const bump = spr(lastArr, theme.spring.pop);
  const sh = shake(frame, HALF_X + 2, 12, 10);
  const halfIn = ease(frame, [HALF, HALF + 8], [0, 1]);
  const halfGone = ease(frame, [HALF_X + 16, HALF_X + 30], [0, 1], theme.ease.in);
  const C35 = s.cueS(9, "3.5");
  const show35 = frame >= C35 - 2 && frame < HALF_X + 22;
  const jitter = show35 ? Math.sin(frame * 2.7) * 6 * Math.max(0, 1 - (frame - C35) / 30) : 0;
  const dimRow = 1 - 0.62 * ease(frame, [HALF - 4, HALF + 6], [0, 1]) * (1 - ease(frame, [HALF_X + 18, HALF_X + 30], [0, 1]));
  const GX = 790; // cut line of the half student

  return (
    <AbsoluteFill>
      <TreeHeader {...NUM_HEADER} parentIn={0} zoomFrom={1.9} kidsIn={TWO - 6} activeAt={DISC} activeIdx={0} />

      <AbsoluteFill style={{ opacity: 1 - out, transform: `translate(${sh.x - out * 160}px, ${sh.y}px)` }}>
        {/* classroom panel */}
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            borderRadius: 36,
            background: `linear-gradient(180deg, ${alpha("#1A2A6E", 0.6)}, ${alpha("#0B1240", 0.55)})`,
            border: `2px solid ${C.edge}`,
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7)",
            opacity: panelIn,
            transform: `translateY(${(1 - panelIn) * 60}px) scale(${0.95 + 0.05 * panelIn})`,
          }}
        />
        {panelIn > 0.01 ? (
          <div style={{ position: "absolute", left: PANEL.x + 34, top: PANEL.y + 28, opacity: panelIn * (1 - ease(frame, [COUNTED - 6, COUNTED], [0, 1])), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: C.dim }}>
            CLASSROOM
          </div>
        ) : null}
        <Pop at={COUNTED} x={540} y={PANEL.y + 44} from="down" dist={20}>
          <Tag color={C.cyan} size={28}>
            COUNTED <Arrow size={40} color={C.cyan} /> WHOLE NUMBERS
          </Tag>
        </Pop>

        {/* counter */}
        {panelIn > 0.01 ? (
          <div style={{ position: "absolute", left: 540, top: 724, transform: "translate(-50%, -50%)", textAlign: "center", opacity: panelIn }}>
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontWeight: 800,
                fontSize: 176,
                lineHeight: 1,
                color: show35 ? C.red : count > 0 ? C.cyan : alpha(C.text, 0.3),
                transform: `translateX(${jitter}px) scale(${1 + (count > 0 ? (1 - bump) * 0.35 : 0)})`,
                textShadow: show35 ? `${jitter}px 0 ${alpha(C.cyan, 0.8)}, ${-jitter}px 0 ${alpha(C.red, 0.8)}, ${glowText(C.red, 0.8)}` : count > 0 ? glowText(C.cyan, 0.9 + (1 - bump)) : "none",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: show35 ? "-0.14em" : 0,
              }}
            >
              {show35 ? "3.5" : count}
            </div>
            <div style={{ marginTop: 6, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>STUDENTS</div>
          </div>
        ) : null}

        {/* door */}
        {panelIn > 0.01 ? (
          <div style={{ position: "absolute", left: DOOR_X - 30, top: 870, width: 120, height: FEET - 870, opacity: panelIn }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "14px 14px 0 0", background: "#060B2A", border: `3px solid ${alpha(C.cyan, 0.4)}` }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "14px 14px 0 0",
                background: "linear-gradient(90deg, #3A4A9A, #26347A)",
                transformOrigin: "0% 50%",
                transform: `perspective(600px) rotateY(${-door * 70}deg)`,
              }}
            >
              <div style={{ position: "absolute", right: 14, top: "52%", width: 12, height: 12, borderRadius: 6, background: C.yellow }} />
            </div>
          </div>
        ) : null}

        {/* students walking to their seats: each arrives exactly on its spoken number */}
        {STUDENTS.map((st, i) => {
          const end = arrive[i];
          const walk = 16 + i * 3;
          const t = ease(frame, [end - walk, end], [0, 1], theme.ease.soft);
          if (frame < end - walk - 2) return null;
          const x = interpolate(t, [0, 1], [DOOR_X + 20, SEATS[i]]);
          const stepping = t > 0 && t < 1;
          const phase = (frame - (end - walk)) * 0.75;
          const swing = stepping ? Math.sin(phase) * 24 : 0;
          const bob = stepping ? -Math.abs(Math.sin(phase)) * 10 : 0;
          const hop = frame >= end ? -Math.sin(Math.min(1, (frame - end) / 8) * Math.PI) * 18 : 0;
          const appear = ease(frame, [end - walk - 2, end - walk + 4], [0, 1]);
          return (
            <div key={i} style={{ position: "absolute", left: x - 45, top: FEET - 176 + bob + hop, opacity: appear * dimRow }}>
              <Person height={180} shirt={st.shirt} skin={st.skin} hair={st.hair} swing={swing} backpack={st.pack} blink={(frame + i * 13) % 80 > 76} />
            </div>
          );
        })}

        {/* desks in front of the students */}
        {SEATS.map((x, i) => {
          const d = spr(CLASS + 2 + i * 3, theme.spring.snappy);
          const lit = frame >= arrive[i];
          return (
            <div key={x} style={{ position: "absolute", left: x - 56, top: FEET - 64, width: 112, opacity: d * dimRow, transform: `translateY(${(1 - d) * 30}px)` }}>
              <div style={{ height: 18, borderRadius: 6, background: lit ? alpha(C.cyan, 0.85) : "#3A4790", boxShadow: lit ? `0 0 18px ${alpha(C.cyan, 0.6)}` : "none" }} />
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 12px" }}>
                <div style={{ width: 8, height: 46, background: "#2A3678" }} />
                <div style={{ width: 8, height: 46, background: "#2A3678" }} />
              </div>
            </div>
          );
        })}
        {arrive.map((a, i) => (
          <Burst key={i} at={a} x={SEATS[i]} y={FEET - 200} color={STUDENTS[i].shirt} count={10} radius={90} seed={20 + i} size={8} />
        ))}

        {/* number line: dots only at whole numbers */}
        {(() => {
          const ln = ease(frame, [CLASS + 14, CLASS + 34], [0, 1], theme.ease.inOut);
          const pulseK = Math.floor(ease(frame, [WHOLE, WHOLE + 25], [0, 5.99], theme.ease.soft));
          return (
            <>
              <div style={{ position: "absolute", left: lineX(0) - 30, top: LINE_Y - 2, width: (lineX(6) - lineX(0) + 60) * ln, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
              {Array.from({ length: 7 }).map((_, v) => {
                const on = ease(frame, [CLASS + 14 + v * 3, CLASS + 22 + v * 3], [0, 1]);
                const lit = v >= 1 && v <= 5 && frame >= arrive[v - 1];
                const pop = lit ? spr(arrive[v - 1], theme.spring.pop) : 0;
                const throb = frame >= WHOLE && frame < WHOLE + 30 && v === pulseK && v >= 1 && v <= 5 ? 1.35 : 1;
                return (
                  <React.Fragment key={v}>
                    <div style={{ position: "absolute", left: lineX(v) - 2, top: LINE_Y - 14, width: 4, height: 28, background: alpha(C.text, 0.55), opacity: on }} />
                    <div style={{ position: "absolute", left: lineX(v), top: LINE_Y + 38, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 30, color: lit ? C.cyan : C.dim, opacity: on }}>
                      {v}
                    </div>
                    {lit ? (
                      <div
                        style={{
                          position: "absolute",
                          left: lineX(v),
                          top: LINE_Y,
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          transform: `translate(-50%, -50%) scale(${pop * throb})`,
                          background: C.cyan,
                          boxShadow: `0 0 22px ${alpha(C.cyan, 0.9)}`,
                          border: "4px solid #E8FBFF",
                        }}
                      />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </>
          );
        })()}

        {/* "3.5 students" — a glitching half student and a 3.5 marker, then stamped out */}
        {halfIn > 0 && halfGone < 1 ? (
          <>
            <div
              style={{
                position: "absolute",
                left: GX - 80,
                top: 760,
                width: 80,
                height: 320,
                overflow: "hidden",
                opacity: halfIn * (1 - halfGone) * (0.6 + 0.4 * Math.abs(Math.sin(frame * 1.7))),
                transform: `translateX(${Math.sin(frame * 3.1) * 4}px)`,
                filter: `drop-shadow(0 0 14px ${alpha(C.red, 0.9)})`,
              }}
            >
              <Person height={320} shirt={C.red} skin={C.skin[1]} hair={C.hair[0]} smile={-0.6} />
            </div>
            <div style={{ position: "absolute", left: GX, top: 740, height: 360, borderLeft: `3px dashed ${alpha(C.red, 0.9)}`, opacity: halfIn * (1 - halfGone) }} />
            <div
              style={{
                position: "absolute",
                left: lineX(3.5),
                top: LINE_Y,
                width: 34,
                height: 34,
                borderRadius: 17,
                transform: "translate(-50%, -50%)",
                border: `4px dashed ${C.red}`,
                opacity: halfIn * (1 - halfGone),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: lineX(3.5),
                top: LINE_Y - 60,
                transform: "translate(-50%, -50%)",
                fontFamily: theme.fonts.mono,
                fontWeight: 800,
                fontSize: 40,
                color: C.red,
                opacity: halfIn * (1 - halfGone),
                textShadow: glowText(C.red, 0.6),
              }}
            >
              3.5?
            </div>
          </>
        ) : null}
        {frame >= HALF_X - 2 && halfGone < 1 ? (
          <div style={{ position: "absolute", left: 640, top: 900, transform: `translate(-50%, -50%) scale(${interpolate(spr(HALF_X - 2, theme.spring.pop), [0, 1], [1.8, 1])})`, opacity: 1 - halfGone }}>
            <Mark kind="cross" at={HALF_X - 2} size={400} color={C.red} width={12} />
          </div>
        ) : null}
        <Ripple at={HALF_X} x={640} y={900} color={C.red} size={560} />
        <Burst at={HALF_X + 16} x={GX - 40} y={920} color={C.red} count={16} radius={160} seed={44} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
