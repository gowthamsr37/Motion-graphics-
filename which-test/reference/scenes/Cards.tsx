// SCENES 3–14 — one full-screen card per distribution (see components/Guide.tsx for the card data and template).
import React from "react";
import { AbsoluteFill } from "remotion";
import { DistCard } from "../components/Guide";
import type { SceneId } from "../timing";

const make = (id: SceneId, idx: number): React.FC => {
  const Card: React.FC = () => (
    <AbsoluteFill>
      <DistCard id={id} idx={idx} />
    </AbsoluteFill>
  );
  return Card;
};

export const CARD_SCENES: Record<string, React.FC> = Object.fromEntries(
  (["s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14"] as SceneId[]).map((id, i) => [id, make(id, i)]),
);
