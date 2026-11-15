import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { PhotoId, photos } from "../photos";
import { theme } from "../theme";
import { CLAMP } from "./Motion";
import { Lettering, Panel } from "./Panel";

const C = theme.colors;
// fixed floodlight bokeh — identical behind both players
const BOKEH = [
  { x: 0.08, y: 0.06, r: 0.05 }, { x: 0.22, y: 0.03, r: 0.035 }, { x: 0.4, y: 0.08, r: 0.04 }, { x: 0.6, y: 0.04, r: 0.045 },
  { x: 0.78, y: 0.07, r: 0.035 }, { x: 0.93, y: 0.03, r: 0.05 }, { x: 0.15, y: 0.18, r: 0.025 }, { x: 0.86, y: 0.17, r: 0.028 },
];

// A supplied player cut-out on the shared night-stadium backdrop, framed like every scoreboard panel.
// Both players are scaled to the same body width and head height, so the two frames always match.
export const CutoutFrame: React.FC<{
  id: PhotoId;
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  closeAt?: number;
  label?: string;
  labelColor?: string;
  seed?: number;
  glow?: string;
  glowOn?: number;
  bodyFrac?: number; // player's shoulder-to-shoulder width as a fraction of the frame width
  headroom?: number; // gap above the head, as a fraction of the image-area height
  life?: number;
}> = ({ id, x, y, w, h, delay = 0, closeAt, label, labelColor = C.amber, seed = 600, glow, glowOn = 0, bodyFrac = 0.78, headroom = 0.06, life = 300 }) => {
  const frame = useCurrentFrame();
  const p = photos[id];
  const inset = 12, capH = 62;
  const iw = w - inset * 2, ih = h - inset * 2 - capH;
  const t = interpolate(frame, [delay, delay + life], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const imgW = (iw * bodyFrac) / p.subject.width;
  const imgH = imgW / p.aspect;
  const left = iw / 2 - p.subject.cx * imgW;
  const top = ih * headroom - p.subject.top * imgH;
  return (
    <Panel x={x} y={y} w={w} h={h} delay={delay} closeAt={closeAt} seed={seed} glow={glow} glowOn={glowOn}>
      <div style={{ position: "absolute", left: inset, top: inset, width: iw, height: ih, overflow: "hidden", borderRadius: 4, background: "linear-gradient(180deg, #1d2e24 0%, #121c16 60%, #0b120e 100%)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(242,169,59,0.42), transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 120% 50% at 50% 115%, rgba(56,180,122,0.22), transparent 60%)" }} />
        {BOKEH.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: b.x * iw - b.r * iw, top: b.y * ih - b.r * iw, width: b.r * iw * 2, height: b.r * iw * 2, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,200,0.75), rgba(242,169,59,0.25) 45%, transparent 70%)", filter: "blur(2px)" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 46px, rgba(0,0,0,0.25) 46px, rgba(0,0,0,0.25) 47px)`, opacity: 0.5 }} />
        <Img
          src={staticFile(p.src)}
          style={{
            position: "absolute",
            left,
            top,
            width: imgW,
            height: imgH,
            transform: `scale(${interpolate(t, [0, 1], [1.0, 1.05])})`,
            transformOrigin: `${p.subject.cx * 100}% ${p.subject.top * 100 + 10}%`,
            filter: "drop-shadow(0 0 14px rgba(242,169,59,0.35)) drop-shadow(0 10px 20px rgba(0,0,0,0.6)) saturate(1.05) contrast(1.03)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${C.trimCream}44, inset 0 0 70px rgba(0,0,0,0.5)` }} />
        {label && (
          <div style={{ position: "absolute", left: 14, top: 14, padding: "7px 12px 5px", borderRadius: 6, background: "rgba(10,15,12,0.82)", boxShadow: `inset 0 0 0 2px ${C.panelEdge}` }}>
            <Lettering size={36} color={labelColor}>
              {label}
            </Lettering>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: inset, right: inset, bottom: inset, height: capH - 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5 }}>
        <Lettering size={17} font="body" weight={600} spacing="0.1em" style={{ whiteSpace: "nowrap" }}>
          {p.place}
        </Lettering>
        <Lettering size={11} font="body" weight={400} color={C.creamDim} spacing="0.08em" style={{ whiteSpace: "nowrap" }}>
          {p.credit}
        </Lettering>
      </div>
    </Panel>
  );
};
