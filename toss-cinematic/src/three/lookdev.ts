// Look-development views (not part of the film): `npx remotion still src/index.ts Look --frame N`.
import * as THREE from "three";
import { Engine, WorldState } from "./engine";
import { P } from "./players";
import { pose } from "./util";

const base = (tod: number, lamps: number): WorldState => ({ tod, lamps: [lamps, lamps, lamps, lamps], time: 3, cloudTime: 2, focus: new THREE.Vector3(0, 0, 0), shadowR: 170 });

export const lookdev = (e: Engine, t: number) => {
  const i = Math.round(t * 30);
  e.begin();
  e.pillars.group.visible = false;
  e.pitch.set(i === 9 ? 1 : i === 8 ? 0.5 : 0);
  if (i === 0) e.drawWorld(base(0.05, 0), pose(0, 34, 112, 0, 0, -30, 44));
  else if (i === 1) e.drawWorld(base(1, 1), pose(0, 34, 112, 0, 0, -30, 44));
  else if (i === 2) e.drawWorld(base(0.4, 0), pose(4, 1.7, 22, 0, 6, -60, 46));
  else if (i === 3) e.drawWorld(base(1, 1), pose(4, 1.7, 22, 0, 9, -60, 46));
  else if (i === 4) e.drawWorld(base(0.55, 0.0), pose(20, 30, 60, -40, 22, -70, 50));
  else if (i === 5) e.drawWorld(base(0.72, 1), pose(-30, 3, 30, 50, 30, -70, 46));
  else if (i === 10) {
    e.pillars.group.visible = true;
    e.pillars.set([1, 1, 1, 1], 1, 0);
    e.drawWorld({ ...base(0.38, 0), focus: new THREE.Vector3(0, 0, -20), shadowR: 60 }, pose(6, 9, 44, 0, 14, -24, 44));
  } else if (i === 11) {
    e.pillars.group.visible = true;
    e.pillars.set([1, 1, 1, 1], 1, 0);
    e.drawWorld({ ...base(0.38, 0), focus: new THREE.Vector3(0, 0, -20), shadowR: 60 }, pose(-3.5, 27.5, -12, -3.3, 25.2, -24, 40));
  } else if (i === 12) {
    e.pillars.group.visible = false;
    const c = e.cast;
    c.hideAll();
    c.show(c.homeBat, 0.3, -8.9, 0, P.batStance(1));
    c.show(c.away[0], -0.6, 4.0, Math.PI, P.deliver(0.72));
    c.show(c.umpire, 0.9, 11.6, Math.PI, P.stand(1));
    c.show(c.away[1], 6, -14, 2.4, P.stand(2, 1));
    c.show(c.away[2], -9, -3, 1.2, P.handsOnHips(2, 2));
    c.show(c.home[0], 3.5, 1.5, -1.2, P.run(0.2));
    c.show(c.home[1], 5, 3.5, -2.0, P.crouch(1));
    c.show(c.home[2], 6.5, 3.5, 0.5, P.drive(0.75));
    c.show(c.home[3], 8, 3.5, 0.5, P.huddle(1));
    e.drawWorld({ ...base(1, 1), focus: new THREE.Vector3(2, 0, 0), shadowR: 16, towerShadows: true }, pose(2.5, 1.2, 9.5, 2.2, 1.1, 0, 40), { near: 0.1 });
  } else if (i === 13) {
    e.cast.hideAll();
    e.drawWorld(base(0.95, 1), pose(0, 95, 150, 0, 20, 0, 50));
  } else if (i === 14) {
    e.cast.hideAll();
    e.macro.grass.setDew(1);
    e.drawMacro(base(1, 1), { cam: pose(0, 0.07, 0.25, 0.02, 0.06, -1, 32), blur: 0.03, anchor: new THREE.Vector3(3, 0.05, 6), envKey: "night", set: "grass", scale: 1 });
  } else if (i >= 7 && i <= 9) e.drawWorld({ ...base(0.1, 0), focus: new THREE.Vector3(0, 0, 6), shadowR: 12 }, pose(0.9, 0.5, 11.2, -0.2, 0.0, 5.5, 36), { near: 0.05 });
  else {
    const c = e.macro.coin.group;
    c.position.set(0, 0, 0);
    c.rotation.set(1.25, 0.3, 0.15);
    e.drawMacro(base(1, 1), { cam: pose(0.4, 0.2, 6.2, 0, 0, 0, 30), blur: 0.03, anchor: new THREE.Vector3(0, 1.6, 8), envKey: "night" });
  }
  e.finish({}, t);
};
