// YouTube thumbnail (1280×720): the strange Atlantic arc, with the hook in big type.
import React from "react";
import { AbsoluteFill } from "remotion";
import { BaseMap, CompassRose, MapProvider, Parchment, Route } from "./components/Map";
import { GAMA_1, GAMA_2, GAMA_3, GAMA_4 } from "./scenes/Story";
import { Grade, Grain, Vignette } from "./components/Overlays";
import { theme } from "./theme";

const C = theme.colors;

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.parchment }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0" }}>
      <Parchment />
      <MapProvider cam={{ lon: 22, lat: 2, w: 120 }}>
        <BaseMap highlight={[{ id: "620", color: C.red, p: 1 }]} />
        <CompassRose at={[-34, 20]} size={130} opacity={0.8} />
        <Route way={[...GAMA_1, ...GAMA_2.slice(1), ...GAMA_3.slice(1), ...GAMA_4.slice(1)]} p={1} width={9} dash="22 12" />
      </MapProvider>
    </div>
    <div style={{ position: "absolute", right: 50, top: 60, textAlign: "right" }}>
      <div style={{ fontFamily: theme.fonts.title, fontWeight: 700, fontSize: 92, lineHeight: 1, color: C.ink, textShadow: `0 4px 0 ${C.parchmentHi}` }}>
        WHY DID HE
        <br />
        SAIL <span style={{ color: C.red }}>AWAY</span>
        <br />
        FROM AFRICA?
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontStyle: "italic", fontSize: 40, color: C.ink, marginTop: 18 }}>Vasco da Gama's road to India</div>
    </div>
    <Grade />
    <Vignette />
    <Grain />
  </AbsoluteFill>
);
