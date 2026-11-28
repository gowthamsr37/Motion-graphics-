// SCENES 5–9 — the 5 tests (student pass/fail running example), each: test bar, THE TERM, the question, an example
// table with the bad column, the verdict, the rule. SCENE 10 — built features + the summary checklist + SAVE THIS.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Mini } from "../components/CleanStep";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { JargonTag, STEP_C, StepBar } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
type Cell = string | { v: string; bad?: boolean; good?: boolean; gone?: boolean };

const TestScene: React.FC<{ id: string; i: number; termW: string; q: React.ReactNode; cols?: string[]; rows?: Cell[][]; body?: React.ReactNode; verdict: React.ReactNode; verdictW: string; rule: React.ReactNode; ruleW: string }> = ({ id, i, termW, q, cols, rows, body, verdict, verdictW, rule, ruleW }) => {
  const s = useScene(id as never);
  const c = STEP_C[i];
  return (
    <AbsoluteFill>
      <StepBar cur={i} at={0} />
      <JargonTag i={i} at={s.cueS(1, termW) - 4} y={1290} />
      <Pop x={540} y={400} at={s.sent(0).from}>
        <Txt size={50} style={{ textAlign: "center" }}>{q}</Txt>
      </Pop>
      <Pop x={540} y={690} at={s.sent(1).from}>
        <Panel w={980} h={420} color={c} style={{ gap: 14 }}>
          {rows ? <Mini w={880} tone="bad" cols={cols} rows={rows} /> : body}
        </Panel>
      </Pop>
      <Pop x={540} y={970} at={s.cueS(1, verdictW) - 4}>
        <Txt size={40} font="body">{verdict}</Txt>
      </Pop>
      <Pop x={540} y={1120} at={s.cueS(1, ruleW) - 4}>
        <Panel w={980} h={150} color={C.green} style={{ flexDirection: "row", gap: 18 }}>
          <Pill color={C.green} size={26} solid>RULE</Pill>
          <Txt size={38}>{rule}</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};

const B = (v: string): Cell => ({ v, bad: true });

export const S5: React.FC = () => (
  <TestScene id="s5" i={0} termW="leakage." q={<>would you know it <span style={{ color: C.red }}>before</span> you predict?</>}
    cols={["HOURS", "ATTEND.", "RE-EXAM FEE", "RESULT"]}
    rows={[["6", "90%", B("no"), "PASS"], ["1", "40%", B("paid"), "FAIL"], ["5", "85%", B("no"), "PASS"], ["2", "50%", B("paid"), "FAIL"]]}
    verdictW="Only" verdict={<>only failed students pay it → <span style={{ color: C.red }}>it's reading the answer</span></>}
    ruleW="brilliant," rule={<>only use what exists <span style={{ color: C.green }}>before</span> the prediction</>} />
);

export const S6: React.FC = () => (
  <TestScene id="s6" i={1} termW="fake" q={<>is it <span style={{ color: C.orange }}>actually related</span>?</>}
    cols={["ROLL NO.", "RESULT"]}
    rows={[[B("101"), "PASS"], [B("102"), "FAIL"], [B("103"), "PASS"], [B("104"), "FAIL"]]}
    verdictW="fake" verdict={<>"even roll numbers fail"? → <span style={{ color: C.orange }}>a fake pattern</span></>}
    ruleW="reason" rule={<>no real reason it matters → <span style={{ color: C.green }}>leave it out</span></>} />
);

export const S7: React.FC = () => (
  <TestScene id="s7" i={2} termW="twice." q={<>is it a <span style={{ color: C.cyan }}>duplicate</span>?</>}
    cols={["HRS / DAY", "HRS / WEEK", "RESULT"]}
    rows={[[B("2"), B("14"), "PASS"], [B("1"), B("7"), "FAIL"], [B("3"), B("21"), "PASS"]]}
    verdictW="twice." verdict={<>week = day × 7 → <span style={{ color: C.cyan }}>the same thing twice</span></>}
    ruleW="Keep" rule={<>same information → <span style={{ color: C.green }}>keep one</span></>} />
);

export const S8: React.FC = () => (
  <TestScene id="s8" i={3} termW="identical" q={<>does it <span style={{ color: C.green }}>change</span>?</>}
    cols={["SCHOOL", "HOURS", "RESULT"]}
    rows={[[B("DPS"), "6", "PASS"], [B("DPS"), "1", "FAIL"], [B("DPS"), "5", "PASS"], [B("DPS"), "2", "FAIL"]]}
    verdictW="identical" verdict={<>the same in every row → <span style={{ color: C.red }}>explains nothing</span></>}
    ruleW="never" rule={<>never changes → <span style={{ color: C.green }}>remove it</span></>} />
);

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s9");
  const PIN = s.cueS(1, "pin");
  return (
    <TestScene id="s9" i={4} termW="stand-ins," q={<>is it <span style={{ color: C.violet }}>fair</span>?</>}
      body={
        <>
          <div style={{ display: "flex", gap: 16 }}>
            {["caste", "religion", "gender"].map((t) => (
              <div key={t} style={{ padding: "12px 26px", borderRadius: 16, background: alpha(C.red, 0.2), border: `3px solid ${C.red}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, textDecoration: "line-through" }}>{t}</div>
            ))}
          </div>
          <Txt size={32} font="body" color={C.dim}>for loans · admissions · jobs</Txt>
          <div style={{ opacity: ease(frame, [PIN - 4, PIN + 6], [0, 1]), display: "flex", alignItems: "center", gap: 16 }}>
            <Pill color={C.orange} size={34}>pin code</Pill>
            <Txt size={34} font="body">= a hidden stand-in</Txt>
          </div>
        </>
      }
      verdictW="help." verdict={<>even if they <span style={{ color: C.violet }}>seem to help</span></>}
      ruleW="pin" rule={<>couldn't defend it in public → <span style={{ color: C.green }}>don't use it</span></>} />
  );
};

const CHECK = [{ t: "known in time", w: "time," }, { t: "related", w: "related," }, { t: "not a duplicate", w: "duplicate," }, { t: "changing", w: "changing," }, { t: "fair", w: "fair." }];

// SCENE 10 — built, not found (DOB → age, login times → late-night study); the summary checklist; SAVE THIS.
export const S10Sum: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s10");
  const T = s.sent(1).from;
  const top = 1 - ease(frame, [T - 8, T], [0, 1]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <Pop x={540} y={300} at={0}>
          <Txt size={56}>the best features are <span style={{ color: C.yellow }}>built</span></Txt>
        </Pop>
        {[{ a: "date of birth", b: "age", w: "Date" }, { a: "login times", b: "late-night study", w: "Login" }].map((r, k) => (
          <Pop key={r.a} x={540} y={560 + k * 260} at={s.cueS(0, r.w) - 4}>
            <Panel w={980} h={200} color={C.cyan} style={{ flexDirection: "row", gap: 26 }}>
              <Pill color={C.cyan} size={36}>{r.a}</Pill>
              <Txt size={56} color={C.yellow}>→</Txt>
              <Pill color={C.yellow} size={36} solid>{r.b}</Pill>
            </Panel>
          </Pop>
        ))}
      </div>
      {frame >= T - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", gap: 20 }}>
            <Pop x={0} y={0} at={s.cueS(1, "label") - 2} anchor="left" style={{ position: "relative", transform: "none" }}><Pill color={C.yellow} size={34} solid>LABEL = ANSWER</Pill></Pop>
            <Pop x={0} y={0} at={s.cueS(1, "features") - 2} anchor="left" style={{ position: "relative", transform: "none" }}><Pill color={C.cyan} size={34} solid>FEATURES = CLUES</Pill></Pop>
          </div>
          <Pop x={540} y={660} at={s.cueS(1, "every") - 4}>
            <Panel w={900} h={560} color={C.cyan} style={{ gap: 4 }}>
              <Txt size={30} font="body" color={C.dim} style={{ letterSpacing: "0.14em", marginBottom: 8 }}>EVERY CLUE MUST BE…</Txt>
              {CHECK.map((it, i) => {
                const p = ease(frame, [s.cueS(1, it.w) - 2, s.cueS(1, it.w) + 6], [0, 1]);
                return (
                  <div key={it.t} style={{ width: 760, display: "flex", alignItems: "center", gap: 22, padding: "12px 0", borderTop: i ? `2px solid ${alpha(C.text, 0.08)}` : undefined, opacity: 0.35 + 0.65 * p }}>
                    <div style={{ width: 54, height: 54, borderRadius: 14, border: `4px solid ${STEP_C[i]}`, background: p > 0.5 ? STEP_C[i] : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p > 0.5 ? <svg width={30} height={30} viewBox="0 0 30 30"><path d="M5 16 L12 23 L26 7" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                    </div>
                    <Txt size={44}>{it.t}</Txt>
                  </div>
                );
              })}
            </Panel>
          </Pop>
          <Pop x={540} y={1040} at={s.cueS(2, "Save") - 4}>
            <Pill color={C.green} size={36}>
              <Bookmark size={36} color={C.green} />
              SAVE THIS for your next project
            </Pill>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
