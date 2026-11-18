// The cover: one ground, sunlit on the left and under floodlights on the right, the coin suspended in front.
import * as THREE from "three";
import { Engine, WorldState } from "./engine";
import { pose, v3 } from "./util";

const w = (tod: number, lamps: number, o: Partial<WorldState> = {}): WorldState => ({ tod, lamps: [lamps, lamps, lamps, lamps], time: 4, cloudTime: 6, focus: v3(0, 0, 0), shadowR: 170, ...o });

export const coverDirect = (e: Engine) => {
  e.cast.hideAll();
  e.pillars.group.visible = false;
  e.ball.group.visible = false;
  e.tossCoin.visible = false;
  e.trail.visible = false;
  e.pitch.set(0.1);
  e.drawSplit(w(0.1, 0, { cloudAmt: 0.36 }), w(1, 1, { dew: 0.4 }), pose(0, 3.4, 54, 0, 16, -40, 58), { angle: 0.32, soft: 0.11, mid: 0.5, blur: 0.004 });
  const g = e.macro.coin.group;
  g.position.set(0, 0, 0);
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.42);
  q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2 - 0.3));
  q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.14));
  g.quaternion.copy(q);
  e.drawMacro(w(0.2, 0.8), { cam: pose(0.3, 0.2, 12.6, 0, -0.62, 0, 30), blur: 0, anchor: v3(0, 6, 34), envKey: "cover", noBg: true, motes: 0.6, time: 4 });
  e.finish({ exposure: 1.06, bloom: 1.25, contrast: 1.1, sat: 1.1, vignette: 0.55, grain: 0.025 }, 4);
};
