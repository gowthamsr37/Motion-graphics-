// SCENES 3–8 — one question each, built from the QuestionScene template (components/Pick.tsx):
// equally likely → UNIFORM · successes in fixed tries → BINOMIAL · events in time → POISSON ·
// waiting time → EXPONENTIAL · measurement around an average → NORMAL · two humps → BIMODAL.
import React from "react";
import { useSpr } from "../components/Motion";
import { Stopwatch } from "../components/Exp";
import { ClockGlyph, CupGlyph, Person, RulerGlyph } from "../components/Icons";
import { CHART, CURVES, QuestionScene } from "../components/Pick";
import { Coin, Die } from "../components/Prob";
import { glowText, theme } from "../theme";
import { BIM, BIM2, BIN, EXP, NOR, NOR2, POI, UNI } from "./S1Hook";

const C = theme.colors;
const ExText: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{children}</span>;

export const S3Uniform: React.FC = () => (
  <QuestionScene
    spec={{
      id: "s3",
      label: "QUESTION 1",
      q: ["ARE ALL OUTCOMES", "EQUALLY LIKELY?"],
      exampleAt: [0, "like"],
      example: (
        <>
          <Die value={5} size={58} color={UNI} />
          <ExText>A FAIR DICE</ExText>
        </>
      ),
      nameAt: [1, "uniform"],
      name: "UNIFORM",
      color: UNI,
      kind: "uniform",
      tag: { at: [1, "flat."], text: "SHAPE: FLAT" },
    }}
  />
);

export const S4Binomial: React.FC = () => (
  <QuestionScene
    spec={{
      id: "s4",
      label: "QUESTION 2",
      q: ["SUCCESSES IN A", "FIXED NUMBER OF TRIES?"],
      exampleAt: [0, "like"],
      example: (
        <>
          <div style={{ display: "flex", gap: 8 }}>
            <Coin side="H" size={50} />
            <Coin side="T" size={50} />
            <Coin side="H" size={50} />
          </div>
          <ExText>HEADS IN 10 FLIPS</ExText>
        </>
      ),
      nameAt: [1, "binomial."],
      name: "BINOMIAL",
      color: BIN,
      kind: "binomial",
      tag: { at: [1, "binomial."], text: "COUNTS SUCCESSES" },
    }}
  />
);

export const S5Poisson: React.FC = () => (
  <QuestionScene
    spec={{
      id: "s5",
      label: "QUESTION 3",
      q: ["COUNTING EVENTS IN A", "STRETCH OF TIME?"],
      exampleAt: [0, "like"],
      example: (
        <>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            {[C.cyan, C.violet, C.orange].map((c) => <Person key={c} height={64} shirt={c} />)}
          </div>
          <ClockGlyph size={46} color={POI} />
          <ExText>CUSTOMERS PER HOUR</ExText>
        </>
      ),
      nameAt: [1, "Poisson."],
      name: "POISSON",
      color: POI,
      kind: "poisson",
      tag: { at: [1, "Poisson."], text: "COUNTS EVENTS" },
    }}
  />
);

export const S6Exponential: React.FC = () => (
  <QuestionScene
    spec={{
      id: "s6",
      label: "QUESTION 4",
      q: ["THE WAITING TIME UNTIL", "THE NEXT EVENT?"],
      exampleAt: [0, "waiting"],
      example: (
        <>
          <Stopwatch size={54} color={EXP} frac={0.3} />
          <ExText>TIME TO THE NEXT CUSTOMER</ExText>
        </>
      ),
      nameAt: [1, "exponential."],
      name: "EXPONENTIAL",
      color: EXP,
      kind: "exp",
      tag: { at: [1, "Short"], text: "SHORT WAITS: MOST COMMON" },
    }}
  />
);

export const S7Normal: React.FC = () => (
  <QuestionScene
    spec={{
      id: "s7",
      label: "QUESTION 5",
      q: ["A MEASUREMENT AROUND", "AN AVERAGE?"],
      exampleAt: [0, "like"],
      example: (
        <>
          <RulerGlyph size={52} color={NOR} />
          <ExText>PEOPLE&apos;S HEIGHTS</ExText>
        </>
      ),
      nameAt: [1, "normal,"],
      name: "NORMAL",
      color: NOR,
      color2: NOR2,
      kind: "normal",
      tag: { at: [1, "bell"], text: "THE BELL CURVE" },
    }}
  />
);

const HumpLabel: React.FC<{ u: number; at: number; text: string; color: string }> = ({ u, at, text, color }) => {
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.pop);
  if (p <= 0.01) return null;
  const y = CHART.y + CHART.h - Math.min(1, CURVES.bimodal(u)) * CHART.h * 0.96;
  return <div style={{ position: "absolute", left: CHART.x + u * CHART.w, top: y - 40, transform: `translate(-50%, -50%) scale(${p})`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color, textShadow: glowText(color, 0.5), whiteSpace: "nowrap" }}>{text}</div>;
};

export const S8Bimodal: React.FC = () => (
  <QuestionScene
    spec={{
      id: "s8",
      label: "BONUS",
      q: ["AND IF YOU SEE", "TWO HUMPS?"],
      exampleAt: [1, "like"],
      example: (
        <>
          <CupGlyph size={50} color={BIM2} />
          <ExText>A CAFÉ&apos;S BUSY HOURS</ExText>
        </>
      ),
      nameAt: [1, "bimodal."],
      name: "BIMODAL",
      color: BIM,
      color2: BIM2,
      kind: "bimodal",
      tag: { at: [1, "groups"], text: "TWO GROUPS MIXED TOGETHER" },
      overlay: (_f, cue) => (
        <>
          <HumpLabel u={0.27} at={cue(1, "lunch")} text="LUNCH" color={BIM} />
          <HumpLabel u={0.75} at={cue(1, "dinner")} text="DINNER" color={BIM2} />
        </>
      ),
    }}
  />
);
