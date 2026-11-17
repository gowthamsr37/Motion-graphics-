// The 3D layer: one canvas, redrawn for the current film time by the director.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { fontsReady } from "./fonts";
import { Engine, RH, RW } from "./three/engine";

const engines = new WeakMap<HTMLCanvasElement, Engine>();

export const Stage3D: React.FC<{ time: number; direct: (e: Engine, t: number) => void }> = ({ time, direct }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("3D stage: fonts for textures"));
  useEffect(() => {
    fontsReady.then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas || !ready) return;
    let e = engines.get(canvas);
    if (!e) {
      e = new Engine(canvas);
      engines.set(canvas, e);
    }
    direct(e, time);
  }, [time, ready, direct]);
  return <canvas ref={ref} width={RW} height={RH} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }} />;
};
