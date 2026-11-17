// React wrappers for the 3D shots. Every view is a pure function of its props (camera, time of day,
// coin pose), drawn synchronously each frame by GLScene.
import React from "react";
import { staticFile } from "remotion";
import * as THREE from "three";
import { fontsReady } from "../fonts";
import { buildCoin, buildEnv, COIN_R, poseCoin } from "./coin";
import { GLScene, canvasTex, rng } from "./GLScene";
import { buildStadium } from "./stadium";

export type V3 = [number, number, number];
export type Cam = { pos: V3; target: V3; fov: number; roll?: number };
export type CoinPose = { x?: number; y: number; z?: number; flip: number; tilt?: number; yaw?: number; scale?: number };

const applyCam = (c: THREE.PerspectiveCamera, cam: Cam) => {
  c.fov = cam.fov;
  c.position.set(...cam.pos);
  c.up.set(Math.sin(cam.roll ?? 0), Math.cos(cam.roll ?? 0), 0);
  c.lookAt(...cam.target);
  c.updateProjectionMatrix();
};

const loadFonts = async () => {
  await fontsReady;
  await document.fonts.load('88px "League Gothic"');
};

// ---------- the stadium (optionally with the coin in-scene, for shadows on the pitch) ----------
export const StadiumView: React.FC<{
  cam: Cam;
  tod: number;
  time: number;
  scale?: number;
  style?: React.CSSProperties;
  coin?: CoinPose;
  shadows?: boolean;
  crowd?: boolean;
}> = ({ cam, tod, time, scale = 1, style, coin, shadows = true, crowd = true }) => (
  <GLScene
    scale={scale}
    shadows={shadows}
    style={style}
    setup={async (r, w, h) => {
      const scene = new THREE.Scene();
      const st = buildStadium({ sunShadow: shadows, crowd });
      scene.add(st.group);
      scene.fog = st.fog;
      const c = new THREE.PerspectiveCamera(cam.fov, w / h, 0.02, 2400);
      let holder: THREE.Group | null = null;
      if (coin) {
        await loadFonts();
        const env = buildEnv(r, tod > 0.5);
        holder = buildCoin(env).holder;
        scene.add(holder);
        // a high-resolution patch of pitch under the coin for the close landing shot (no crease lines)
        const L = new THREE.TextureLoader();
        const ld = (f: string, srgb: boolean) =>
          new Promise<THREE.Texture>((res, rej) =>
            L.load(staticFile(f), (t) => {
              t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
              t.anisotropy = 8;
              t.repeat.set(1, 0.6);
              res(t);
            }, undefined, rej),
          );
        const [col, nrm] = await Promise.all([ld("tex/pitch_d1_col.jpg", true), ld("tex/pitch_d1_nrm.png", false)]);
        const patch = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 3.05 * 0.6), new THREE.MeshStandardMaterial({ map: col, normalMap: nrm, normalScale: new THREE.Vector2(1.3, 1.3), roughness: 0.95 }));
        patch.rotation.x = -Math.PI / 2;
        patch.position.y = 0.0125;
        patch.receiveShadow = true;
        scene.add(patch);
      }
      return { scene, st, c, holder };
    }}
    draw={(s, r) => {
      s.st.setTime(tod, time);
      r.toneMappingExposure = s.st.exposure(tod);
      if (s.holder && coin) {
        poseCoin(s.holder, coin);
        s.holder.scale.setScalar(coin.scale ?? 1);
      }
      applyCam(s.c, cam);
      r.render(s.scene, s.c);
    }}
  />
);

// ---------- the coin alone, on a transparent canvas, to sit over a (blurred) stadium plate ----------
export const CoinView: React.FC<{ cam: Cam; pose: CoinPose; night?: boolean; style?: React.CSSProperties; glow?: number }> = ({ cam, pose, night = true, style, glow = 0 }) => (
  <GLScene
    transparent
    style={style}
    setup={async (r, w, h) => {
      await loadFonts();
      const scene = new THREE.Scene();
      const env = buildEnv(r, night);
      const { holder, coin } = buildCoin(env);
      scene.add(holder);
      const key = new THREE.DirectionalLight("#fff1d6", 2.6);
      key.position.set(1.5, 3, 2);
      const rim = new THREE.DirectionalLight("#bcd2ff", 1.6);
      rim.position.set(-2, 1, -2);
      scene.add(key, rim, new THREE.HemisphereLight("#ffffff", "#2a3a2a", 0.4));
      const c = new THREE.PerspectiveCamera(cam.fov, w / h, 0.01, 100);
      return { scene, holder, coin, c };
    }}
    draw={(s, r) => {
      poseCoin(s.holder, pose);
      s.holder.scale.setScalar(pose.scale ?? 1);
      const mats = s.coin.material as THREE.MeshStandardMaterial[];
      mats.forEach((m) => {
        m.emissive.set("#ffb648");
        m.emissiveIntensity = glow * 0.25;
      });
      applyCam(s.c, cam);
      r.render(s.scene, s.c);
    }}
  />
);

// ---------- Test pitch macro: days 1 → 3 → 5, with an illustrative ball bounce ----------
export type Bounce = { p: number; path: "true" | "crack"; show: boolean; trail: number };

export const PitchMacro: React.FC<{ cam: Cam; day: number; ball?: Bounce[]; sunAz?: number; style?: React.CSSProperties }> = ({ cam, day, ball = [], sunAz = 0.6, style }) => (
  <GLScene
    shadows
    style={style}
    setup={async (r, w, h) => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#7fa6c9");
      scene.fog = new THREE.Fog("#a8bfd2", 6, 30);
      const L = new THREE.TextureLoader();
      const load = (f: string, srgb: boolean) =>
        new Promise<THREE.Texture>((res, rej) =>
          L.load(staticFile(f), (t) => {
            t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
            t.anisotropy = 8;
            res(t);
          }, undefined, rej),
        );
      const days = await Promise.all([1, 3, 5].map(async (d) => ({ col: await load(`tex/pitch_d${d}_col.jpg`, true), nrm: await load(`tex/pitch_d${d}_nrm.png`, false) })));
      // three stacked surfaces that cross-fade (same geometry, alpha-blended)
      const geo = new THREE.PlaneGeometry(3.05, 3.05);
      const mats = days.map((d, i) => new THREE.MeshStandardMaterial({ map: d.col, normalMap: d.nrm, normalScale: new THREE.Vector2(1.6, 1.6), roughness: 0.95, transparent: i > 0, opacity: i === 0 ? 1 : 0, depthWrite: i === 0, polygonOffset: true, polygonOffsetFactor: -i, polygonOffsetUnits: -i }));
      const meshes = mats.map((m) => {
        const me = new THREE.Mesh(geo, m);
        me.rotation.x = -Math.PI / 2;
        me.receiveShadow = true;
        scene.add(me);
        return me;
      });
      // continuation of the strip + grass either side
      const strip = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 30), new THREE.MeshStandardMaterial({ color: "#b99e72", roughness: 1 }));
      strip.rotation.x = -Math.PI / 2;
      strip.position.set(0, -0.002, -16.5);
      scene.add(strip);
      const grassTex = canvasTex(512, 512, (g) => {
        g.fillStyle = "#3f7a2c";
        g.fillRect(0, 0, 512, 512);
        const rr = rng(4);
        for (let i = 0; i < 30000; i++) {
          g.fillStyle = rr() < 0.5 ? "rgba(90,150,60,0.5)" : "rgba(30,70,25,0.5)";
          g.fillRect(rr() * 512, rr() * 512, 1, 3);
        }
      });
      grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
      grassTex.repeat.set(20, 20);
      const grass = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1 }));
      grass.rotation.x = -Math.PI / 2;
      grass.position.y = -0.004;
      scene.add(grass);
      // stumps at the batter's end (texture's popping crease is 0.9 m from its top edge → stumps 1.22 m behind)
      const stumpMat = new THREE.MeshStandardMaterial({ color: "#efe6cf", roughness: 0.55 });
      const zStumps = -1.525 + 0.9 - 1.22;
      for (const dx of [-0.1143, 0, 0.1143]) {
        const sm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.711, 12), stumpMat);
        sm.position.set(dx, 0.3555, zStumps);
        sm.castShadow = true;
        scene.add(sm);
      }
      // the ball
      const ballTex = canvasTex(512, 256, (g) => {
        g.fillStyle = "#9a1b18";
        g.fillRect(0, 0, 512, 256);
        const rr = rng(8);
        for (let i = 0; i < 4000; i++) {
          g.fillStyle = `rgba(${rr() < 0.5 ? "60,0,0" : "200,60,50"},0.25)`;
          g.fillRect(rr() * 512, rr() * 256, 2, 2);
        }
        g.fillStyle = "#e8dcc0";
        g.fillRect(0, 122, 512, 12);
        g.fillStyle = "#7a1210";
        for (let x = 0; x < 512; x += 8) {
          g.fillRect(x, 116, 3, 5);
          g.fillRect(x + 4, 135, 3, 5);
        }
      });
      const balls = [0, 1].map(() => {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.036, 32, 16), new THREE.MeshStandardMaterial({ map: ballTex, roughness: 0.35, metalness: 0 }));
        b.castShadow = true;
        scene.add(b);
        return b;
      });
      const trails = [0, 1].map((i) => {
        const l = new THREE.InstancedMesh(new THREE.SphereGeometry(0.009, 8, 6), new THREE.MeshBasicMaterial({ color: i === 0 ? "#ffffff" : "#ffcf5a", transparent: true, opacity: 0.9 }), 60);
        l.frustumCulled = false;
        scene.add(l);
        return l;
      });
      const sun = new THREE.DirectionalLight("#fff0d8", 3.4);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -4;
      sun.shadow.camera.right = 4;
      sun.shadow.camera.top = 4;
      sun.shadow.camera.bottom = -4;
      sun.shadow.bias = -0.0005;
      scene.add(sun, sun.target, new THREE.HemisphereLight("#cfe0ff", "#5a4a30", 0.6));
      const c = new THREE.PerspectiveCamera(cam.fov, w / h, 0.01, 200);
      return { scene, mats, meshes, balls, trails, sun, c };
    }}
    draw={(s, r) => {
      // day 1→3→5 cross-fade
      const a3 = Math.min(1, Math.max(0, (day - 1) / 2)), a5 = Math.min(1, Math.max(0, (day - 3) / 2));
      s.mats[1].opacity = a3;
      s.mats[2].opacity = a5;
      // low sun raking across the surface reveals the relief
      s.sun.position.set(Math.cos(sunAz) * 6, 2.2, Math.sin(sunAz) * 6 - 1);
      s.sun.target.position.set(0, 0, 0);
      r.toneMappingExposure = 1.0;
      // illustrative trajectories: ball pitches at the same spot; on the crack it deviates and keeps low
      const pitchPt = new THREE.Vector3(0.12, 0, 0.55);
      ball.forEach((b, i) => {
        const m = s.balls[i];
        m.visible = b.show;
        const pos = (p: number) => {
          if (p < 0.5) {
            const k = p / 0.5; // incoming from the bowler's end, descending
            return new THREE.Vector3(0.05 + (pitchPt.x - 0.05) * k, 0.036 + 1.6 * (1 - k) * (1 - k) * 0.55 + 0.0, 6 + (pitchPt.z - 6) * k);
          }
          const k = (p - 0.5) / 0.5;
          const zEnd = -1.2;
          if (b.path === "true") return new THREE.Vector3(pitchPt.x - 0.03 * k, 0.036 + Math.sin(Math.min(1, k * 1.1) * Math.PI * 0.62) * 0.78, pitchPt.z + (zEnd - pitchPt.z) * k);
          return new THREE.Vector3(pitchPt.x + 0.34 * k * k, 0.036 + Math.sin(Math.min(1, k) * Math.PI * 0.55) * 0.26, pitchPt.z + (zEnd - pitchPt.z) * k);
        };
        const p = Math.min(1, Math.max(0, b.p));
        m.position.copy(pos(p));
        m.rotation.x = -p * 30;
        const n = 60;
        const m4 = new THREE.Matrix4();
        for (let j = 0; j < n; j++) {
          const q = Math.max(0, p - b.trail + (b.trail * j) / (n - 1));
          const v = pos(Math.min(q, p));
          const sc = 0.4 + 0.6 * (j / (n - 1));
          m4.makeScale(sc, sc, sc).setPosition(v);
          s.trails[i].setMatrixAt(j, m4);
        }
        s.trails[i].instanceMatrix.needsUpdate = true;
        (s.trails[i].material as THREE.MeshBasicMaterial).opacity = b.show ? 0.85 : 0;
      });
      applyCam(s.c, cam);
      r.render(s.scene, s.c);
    }}
  />
);

// ---------- dew macro: grass blades at night with water beads catching the floodlights ----------
export const DewMacro: React.FC<{ cam: Cam; wet: number; time: number; style?: React.CSSProperties }> = ({ cam, wet, time, style }) => (
  <GLScene
    style={style}
    setup={async (r, w, h) => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#050a08");
      scene.fog = new THREE.FogExp2("#081109", 2.2);
      const env = buildEnv(r, true);
      const rr = rng(21);
      // blades: thin tapered, bent planes
      const bladeGeo = new THREE.PlaneGeometry(0.004, 0.06, 1, 6);
      const pos = bladeGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i) + 0.03;
        pos.setX(i, pos.getX(i) * (1 - y / 0.06) * 1.0);
        pos.setZ(i, (y / 0.06) ** 2 * 0.012);
        pos.setY(i, y);
      }
      bladeGeo.computeVertexNormals();
      const NB = 5200;
      const blades = new THREE.InstancedMesh(bladeGeo, new THREE.MeshStandardMaterial({ color: "#3c7d2c", roughness: 0.55, side: THREE.DoubleSide, envMap: env, envMapIntensity: 0.4 }), NB);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), col = new THREE.Color();
      const tips: THREE.Vector3[] = [];
      for (let i = 0; i < NB; i++) {
        const x = (rr() - 0.5) * 0.5, z = (rr() - 0.5) * 0.5 - 0.1;
        e.set((rr() - 0.5) * 0.5, rr() * Math.PI * 2, (rr() - 0.5) * 0.5);
        q.setFromEuler(e);
        const sc = 0.7 + rr() * 0.6;
        m4.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(1, sc, 1));
        blades.setMatrixAt(i, m4);
        blades.setColorAt(i, col.setHSL(0.27 + rr() * 0.05, 0.5, 0.18 + rr() * 0.12));
        if (rr() < 0.55) tips.push(new THREE.Vector3(0, 0.03 + rr() * 0.028, 0.004).applyMatrix4(m4));
      }
      scene.add(blades);
      const dropMat = new THREE.MeshStandardMaterial({ color: "#1c2c28", metalness: 0.15, roughness: 0.03, envMap: env, envMapIntensity: 2.2, transparent: true, opacity: 0.0 });
      const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 10), dropMat, tips.length);
      tips.forEach((t, i) => {
        const s = 0.0005 + rr() * 0.0008;
        m4.compose(t, q.identity(), new THREE.Vector3(s, s * 0.85, s));
        drops.setMatrixAt(i, m4);
      });
      scene.add(drops);
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshStandardMaterial({ color: "#0f1f0c", roughness: 1 }));
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);
      const flood = new THREE.DirectionalLight("#fff3dc", 3.2);
      flood.position.set(-1, 1.4, -2);
      const flood2 = new THREE.DirectionalLight("#dfe8ff", 1.4);
      flood2.position.set(2, 1, -1);
      scene.add(flood, flood2, new THREE.HemisphereLight("#38507a", "#0a1408", 0.35));
      const c = new THREE.PerspectiveCamera(cam.fov, w / h, 0.002, 20);
      return { scene, dropMat, drops, c };
    }}
    draw={(s, r) => {
      s.dropMat.opacity = Math.min(1, wet);
      r.toneMappingExposure = 1.1;
      applyCam(s.c, cam);
      r.render(s.scene, s.c);
    }}
  />
);

export { COIN_R };
