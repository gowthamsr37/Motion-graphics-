// SCENES 4–9 — the 6 feature tests, each a StepScene: THE TERM, the question, THE REAL PROBLEM with feature chips
// (bad ones struck), the RULE as WHAT YOU DO.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Chip, Row, StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Fade: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  return <div style={{ opacity: ease(frame, [at - 4, at + 4], [0, 1]) }}>{children}</div>;
};

export const S4Time: React.FC = () => {
  const s = useScene("s4");
  const P = s.sent(1).from;
  const L = s.cueS(1, "leakage.");
  return (
    <StepScene i={0} termAt={s.cueS(1, "leakage.")} headAt={s.sent(0).from} head={<>will you know it <span style={{ color: C.cyan }}>at prediction time?</span></>}
      probAt={P - 4}
      problem={<>
        <Row>
          <Chip c={C.red} at={s.cueS(1, "Stamp")} strike={false}>STAMP DUTY</Chip>
          <Chip c={C.red} at={s.cueS(1, "days")}>DAYS ON MARKET</Chip>
          <Chip c={C.red} at={s.cueS(1, "final")}>FINAL DISCOUNT</Chip>
        </Row>
        <Fade at={s.cueS(1, "after")}><Txt size={38}>all known only <span style={{ color: C.red }}>after the sale</span></Txt></Fade>
        <Fade at={L}><Txt size={54} color={C.red} glow>DATA LEAKAGE</Txt></Fade>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "won't have it at prediction time?", at: s.cueS(2, "won't") }, { t: "then it can't be a feature", at: s.cueS(2, "can't") }]} />
  );
};

export const S5Related: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const P = s.sent(1).from;
  const NOISE = s.cueS(1, "noise.");
  return (
    <StepScene i={1} termAt={s.cueS(0, "related")} headAt={s.sent(0).from} head={<>is it <span style={{ color: C.violet }}>actually related</span> to the label?</>}
      probAt={P - 4}
      problem={<>
        <Row>
          <Chip c={C.violet} at={s.cueS(1, "Listing")}>LISTING ID #48213</Chip>
          <Chip c={C.violet} at={s.cueS(1, "phone")}>BROKER&apos;S PHONE NO.</Chip>
        </Row>
        <svg width={700} height={130} viewBox="0 0 700 130" style={{ opacity: ease(frame, [NOISE - 20, NOISE - 6], [0, 1]) }}>
          {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={20 + i * 11} cy={20 + ((i * 47) % 90)} r={5} fill={alpha(C.text, 0.6)} />)}
          <polyline points={Array.from({ length: 60 }, (_, i) => `${20 + i * 11},${20 + ((i * 47) % 90)}`).join(" ")} fill="none" stroke={C.red} strokeWidth={2} opacity={0.7} />
        </svg>
        <Fade at={NOISE - 6}><Txt size={36}>the model finds <span style={{ color: C.red }}>fake patterns in noise</span></Txt></Fade>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "there must be a real reason", at: s.cueS(2, "real") }, { t: "it affects the price", at: s.cueS(2, "affects") }]} />
  );
};

export const S6Dup: React.FC = () => {
  const s = useScene("s6");
  const P = s.sent(1).from;
  return (
    <StepScene i={2} termAt={s.cueS(0, "duplicate?")} headAt={s.sent(0).from} head={<>is it a <span style={{ color: C.orange }}>duplicate?</span></>}
      probAt={P - 4}
      problem={<>
        <Row>
          <Chip c={C.orange} at={s.cueS(1, "feet")}>AREA: 1,200 sq ft</Chip>
          <Txt size={44} color={C.dim}>=</Txt>
          <Chip c={C.orange} at={s.cueS(1, "metres")}>AREA: 111 sq m</Chip>
        </Row>
        <Fade at={s.cueS(1, "twice.")}><Txt size={38}>same information, <span style={{ color: C.orange }}>twice</span></Txt></Fade>
        <Fade at={s.cueS(1, "confused")}><Txt size={34} font="body">the model can&apos;t tell which one matters</Txt></Fade>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "keep one version", at: s.cueS(2, "keep") }, { t: "of each piece of information", at: s.cueS(2, "piece") }]} />
  );
};

export const S7Filled: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const P = s.sent(1).from;
  const fill = ease(frame, [P, P + 24], [0, 1]);
  return (
    <StepScene i={3} termAt={s.cueS(0, "filled")} headAt={s.sent(0).from} head={<>is it <span style={{ color: C.green }}>filled in enough?</span></>}
      probAt={P - 4}
      problem={<>
        <Txt size={40}>PARKING TYPE</Txt>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", width: 760 }}>
          {Array.from({ length: 40 }, (_, i) => {
            const blank = (i * 7) % 10 < 7;
            return <div key={i} style={{ width: 70, height: 36, borderRadius: 6, background: i / 40 < fill ? (blank ? alpha(C.red, 0.3) : alpha(C.green, 0.6)) : "rgba(255,255,255,0.05)", border: `2px solid ${blank ? alpha(C.red, 0.6) : "transparent"}` }} />;
          })}
        </div>
        <Txt size={40}><span style={{ color: C.red }}>70%</span> blank</Txt>
        <Fade at={s.cueS(1, "guessing.")}><Txt size={34} font="body">filling that much = mostly guessing</Txt></Fade>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "drop the column", at: s.cueS(2, "drop") }, { t: "or keep a \"has parking info\" flag", at: s.cueS(2, "flag.") }]} />
  );
};

export const S8Varies: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const P = s.sent(1).from;
  return (
    <StepScene i={4} termAt={s.cueS(0, "vary?")} headAt={s.sent(0).from} head={<>does it <span style={{ color: C.yellow }}>actually vary?</span></>}
      probAt={P - 4}
      problem={<>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{ width: 460, padding: "6px 0", textAlign: "center", borderRadius: 8, background: alpha(C.yellow, 0.12), fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: C.text, opacity: ease(frame, [P + i * 3, P + 6 + i * 3], [0, 1]) }}>city = Bangalore</div>
          ))}
        </div>
        <Fade at={s.cueS(1, "never")}><Txt size={36}>never changes = <span style={{ color: C.red }}>explains nothing</span></Txt></Fade>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "remove constant columns", at: s.cueS(2, "remove") }, { t: "and almost-constant ones", at: s.cueS(2, "almost") }]} />
  );
};

export const S9Fair: React.FC = () => {
  const s = useScene("s9");
  const P = s.sent(1).from;
  return (
    <StepScene i={5} termAt={s.cueS(0, "fair")} headAt={s.sent(0).from} head={<>is it <span style={{ color: C.red }}>fair and legal?</span></>}
      probAt={P - 4}
      problem={<>
        <Row>
          <Chip c={C.red} at={s.cueS(1, "religion")} strike>OWNER&apos;S RELIGION</Chip>
          <Chip c={C.red} at={s.cueS(1, "caste,")} strike>CASTE</Chip>
        </Row>
        <Fade at={s.cueS(1, "correlate.")}><Txt size={34} font="body">even if they seem to correlate</Txt></Fade>
        <Fade at={s.cueS(1, "proxies")}><Txt size={38}>watch for <span style={{ color: C.yellow }}>proxies</span> that sneak them back in</Txt></Fade>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "couldn't defend it in public?", at: s.cueS(2, "defend") }, { t: "then don't use it", at: s.cueS(2, "don't") }]} />
  );
};
