// Procedural cricket stadium (metres): outfield with mowing stripes, the pitch with real crease
// geometry (stumps 20.12 m apart, popping creases 1.22 m in front), tiered bowl with a packed
// crowd, roof canopy, six floodlight pylons, sky dome with a sun and clouds, all driven by a
// single time-of-day value (0 = bright day … 1 = full night under lights).
import * as THREE from "three";
import { canvasTex, rng } from "./GLScene";

export const PITCH_LEN = 20.12; // stump to stump
export const PITCH_W = 3.05;

const skyVert = /* glsl */ `
varying vec3 vDir;
void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const skyFrag = /* glsl */ `
uniform vec3 uSun; uniform float uTod; uniform float uTime; uniform float uClouds;
uniform vec3 uZen; uniform vec3 uHor; uniform vec3 uSunCol; uniform vec3 uCloudCol; uniform float uStars;
varying vec3 vDir;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * n2(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
void main() {
  vec3 d = normalize(vDir);
  float el = clamp(d.y, -0.2, 1.0);
  float t = pow(max(el, 0.0), 0.45);
  vec3 col = mix(uHor, uZen, t);
  if (d.y < 0.0) col = mix(uHor, uHor * 0.35, clamp(-d.y * 6.0, 0.0, 1.0));
  float sd = max(dot(d, uSun), 0.0);
  col += uSunCol * (pow(sd, 6.0) * 0.35 + pow(sd, 64.0) * 0.6) ;
  col += uSunCol * smoothstep(0.9993, 0.9997, sd) * 6.0 * step(0.0, uSun.y + 0.02);
  // clouds on a virtual plane
  if (d.y > 0.01) {
    vec2 uv = d.xz / (d.y + 0.12) * 1.6 + vec2(uTime * 0.012, uTime * 0.004);
    float c = fbm(uv * 1.3);
    c = smoothstep(0.55 - uClouds * 0.25, 0.85, c) * smoothstep(0.0, 0.18, d.y);
    vec3 cc = uCloudCol * (0.75 + 0.5 * fbm(uv * 3.0 + 3.0)) + uSunCol * pow(sd, 3.0) * 0.6;
    col = mix(col, cc, c * 0.85);
    // stars
    vec2 sg = floor(d.xz / (d.y + 0.2) * 260.0);
    float st = step(0.9975, h21(sg)) * uStars * (1.0 - c) * smoothstep(0.1, 0.4, d.y);
    col += vec3(st * 0.8);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const mixc = (a: THREE.Color, b: THREE.Color, k: number) => a.clone().lerp(b, k);
const C = (h: string) => new THREE.Color(h);
const keysAt = <T,>(t: number, keys: [number, T][], lerp: (a: T, b: T, k: number) => T): T => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const k = (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]);
      const s = k * k * (3 - 2 * k);
      return lerp(keys[i - 1][1], keys[i][1], s);
    }
  }
  return keys[keys.length - 1][1];
};
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;

export type Stadium = {
  group: THREE.Group;
  setTime: (tod: number, time: number) => void; // tod 0..1, time seconds (cloud drift, crowd shimmer)
  sun: THREE.DirectionalLight;
  fog: THREE.Fog;
  exposure: (tod: number) => number;
};

export const buildStadium = (opts: { crowd?: boolean; sunShadow?: boolean; lowDetail?: boolean } = {}): Stadium => {
  const r = rng(77);
  const group = new THREE.Group();

  // ---------- outfield ----------
  const grass = canvasTex(2048, 2048, (g) => {
    const stripes = 22;
    for (let i = 0; i < stripes; i++) {
      g.fillStyle = i % 2 ? "#3e7a2c" : "#4a8a33";
      g.fillRect((i * 2048) / stripes, 0, 2048 / stripes + 1, 2048);
    }
    const img = g.getImageData(0, 0, 2048, 2048);
    const rr = rng(5);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (rr() - 0.5) * 22;
      img.data[i] += n * 0.7;
      img.data[i + 1] += n;
      img.data[i + 2] += n * 0.5;
    }
    g.putImageData(img, 0, 0);
    // the square: slightly paler, with the strip of used pitches
    g.fillStyle = "rgba(190, 200, 120, 0.05)";
    g.fillRect(1024 - 120, 1024 - 170, 240, 340);
  });
  const outfield = new THREE.Mesh(new THREE.CircleGeometry(72, 128), new THREE.MeshStandardMaterial({ map: grass, roughness: 0.92, metalness: 0 }));
  outfield.rotation.x = -Math.PI / 2;
  outfield.receiveShadow = true;
  group.add(outfield);

  // ---------- the pitch ----------
  const PX = 512, PY = 4096, LEN = 22; // texture spans 22 m × 3.05 m
  const pitchTex = canvasTex(PX, PY, (g) => {
    g.fillStyle = "#bfa275";
    g.fillRect(0, 0, PX, PY);
    // a little live grass toward the ends, burnished and paler down the middle
    const gr = g.createLinearGradient(0, 0, PX, 0);
    gr.addColorStop(0, "rgba(110,135,70,0.35)");
    gr.addColorStop(0.25, "rgba(110,135,70,0.05)");
    gr.addColorStop(0.75, "rgba(110,135,70,0.05)");
    gr.addColorStop(1, "rgba(110,135,70,0.35)");
    g.fillStyle = gr;
    g.fillRect(0, 0, PX, PY);
    const rr = rng(9);
    for (let i = 0; i < 60000; i++) {
      const x = rr() * PX, y = rr() * PY, s = 1 + rr() * 3;
      const v = rr();
      g.fillStyle = v < 0.5 ? `rgba(120, 90, 55, ${0.1 + rr() * 0.15})` : v < 0.8 ? `rgba(235, 215, 175, ${0.1 + rr() * 0.15})` : `rgba(110, 140, 70, ${0.12 + rr() * 0.12})`;
      g.fillRect(x, y, s, s);
    }
    const m = PY / LEN; // px per metre
    const yAt = (z: number) => PY / 2 - z * m;
    g.fillStyle = "rgba(255,255,255,0.92)";
    for (const end of [-1, 1]) {
      const zs = end * (PITCH_LEN / 2);
      const zp = zs - end * 1.22;
      g.fillRect(0, yAt(zp) - 4, PX, 9); // popping crease (full width)
      g.fillRect(PX / 2 - 1.32 * (PX / PITCH_W), yAt(zs) - 4, 2.64 * (PX / PITCH_W), 9); // bowling crease
      for (const sx of [-1.32, 1.32]) {
        const x = PX / 2 + sx * (PX / PITCH_W);
        const y0 = Math.min(yAt(zp), yAt(zp + end * 2.44)), y1 = Math.max(yAt(zp), yAt(zp + end * 2.44));
        g.fillRect(x - 4, y0, 9, y1 - y0); // return creases
      }
    }
  });
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(PITCH_W, LEN), new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.95 }));
  pitch.rotation.x = -Math.PI / 2;
  pitch.position.y = 0.012;
  pitch.receiveShadow = true;
  group.add(pitch);

  // stumps + bails
  const stumpMat = new THREE.MeshStandardMaterial({ color: "#efe6cf", roughness: 0.6 });
  for (const end of [-1, 1]) {
    for (const dx of [-0.1143, 0, 0.1143]) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.711, 10), stumpMat);
      s.position.set(dx, 0.3555, end * (PITCH_LEN / 2));
      s.castShadow = true;
      group.add(s);
    }
    for (const dx of [-0.057, 0.057]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.11, 6), stumpMat);
      b.rotation.z = Math.PI / 2;
      b.position.set(dx, 0.718, end * (PITCH_LEN / 2));
      group.add(b);
    }
  }

  // boundary rope + LED boards
  const rope = new THREE.Mesh(new THREE.TorusGeometry(64, 0.09, 6, 160), new THREE.MeshStandardMaterial({ color: "#e8e2d2", roughness: 0.7 }));
  rope.rotation.x = Math.PI / 2;
  rope.position.y = 0.09;
  group.add(rope);
  const boardTex = canvasTex(2048, 64, (g) => {
    const cols = ["#0f3d91", "#d23a2a", "#f2b136", "#16856b", "#5b2a86", "#e8e8e8"];
    for (let i = 0; i < 32; i++) {
      g.fillStyle = cols[i % cols.length];
      g.fillRect(i * 64, 0, 64, 64);
      g.fillStyle = "rgba(255,255,255,0.35)";
      g.fillRect(i * 64 + 10, 26, 44, 12);
    }
  });
  const boards = new THREE.Mesh(
    new THREE.CylinderGeometry(70.5, 70.5, 0.9, 160, 1, true),
    new THREE.MeshStandardMaterial({ map: boardTex, emissive: new THREE.Color("#ffffff"), emissiveMap: boardTex, emissiveIntensity: 0.6, side: THREE.DoubleSide, roughness: 0.5 }),
  );
  boards.position.y = 0.45;
  group.add(boards);

  // ---------- stands (stepped lathe) ----------
  const prof: THREE.Vector2[] = [new THREE.Vector2(71, 0), new THREE.Vector2(71, 1.6)];
  let rr0 = 72, hh = 1.6;
  const rows: { rad: number; y: number }[] = [];
  for (let i = 0; i < 46; i++) {
    if (i === 22) {
      // concourse between tiers
      prof.push(new THREE.Vector2(rr0 + 2.5, hh), new THREE.Vector2(rr0 + 2.5, hh + 3.2));
      rr0 += 2.5;
      hh += 3.2;
    }
    prof.push(new THREE.Vector2(rr0 + 0.85, hh));
    rows.push({ rad: rr0 + 0.42, y: hh });
    hh += 0.48;
    rr0 += 0.85;
    prof.push(new THREE.Vector2(rr0, hh));
  }
  prof.push(new THREE.Vector2(rr0 + 1.5, hh), new THREE.Vector2(rr0 + 1.5, hh + 3), new THREE.Vector2(rr0 + 3, hh + 3), new THREE.Vector2(rr0 + 3, 0));
  const stands = new THREE.Mesh(new THREE.LatheGeometry(prof, 128), new THREE.MeshStandardMaterial({ color: "#262b35", roughness: 0.95, side: THREE.DoubleSide }));
  group.add(stands);
  const topR = rr0 + 1.5, topH = hh + 3;

  // roof canopy
  const roofProf = [new THREE.Vector2(topR + 2, topH + 4), new THREE.Vector2(topR - 22, topH + 9), new THREE.Vector2(topR - 22, topH + 9.6), new THREE.Vector2(topR + 2, topH + 4.8)];
  const roof = new THREE.Mesh(new THREE.LatheGeometry(roofProf, 128), new THREE.MeshStandardMaterial({ color: "#1a1d24", roughness: 0.8, metalness: 0.2, side: THREE.DoubleSide }));
  group.add(roof);
  const roofLights = new THREE.Mesh(
    new THREE.TorusGeometry(topR - 21.5, 0.12, 4, 200),
    new THREE.MeshStandardMaterial({ color: "#000", emissive: new THREE.Color("#fff3d8"), emissiveIntensity: 0 }),
  );
  roofLights.rotation.x = Math.PI / 2;
  roofLights.position.y = topH + 8.8;
  group.add(roofLights);

  // ---------- crowd ----------
  const crowdPts: THREE.PointsMaterial[] = [];
  let flashes: THREE.InstancedMesh | null = null;
  if (opts.crowd !== false) {
    const shirts = ["#e0b43a", "#2a5aa8", "#b8382f", "#d8d8d8", "#d9752a", "#5a3a86", "#2b2f3a", "#1f8a66", "#1a1d24", "#3a3f4c", "#c9a23a", "#24448a", "#8a2f2a", "#e8e2d4"];
    const skins = ["#7a4a2c", "#8d5a37", "#a46d45", "#5f3a22", "#b98258", "#6b4127"];
    const people: { x: number; y: number; z: number; a: number; s: number }[] = [];
    rows.forEach((row, ri) => {
      const n = Math.floor((2 * Math.PI * row.rad) / (opts.lowDetail ? 0.9 : 0.58));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (ri % 2) * 0.004;
        if (i % 26 === 0 || i % 26 === 1) continue; // aisles
        if (r() < 0.07) continue; // empty seats
        people.push({ x: Math.cos(a) * row.rad, y: row.y, z: Math.sin(a) * row.rad, a, s: 0.9 + r() * 0.2 });
      }
    });
    // Crowd as point sprites (one torso + one head per spectator): reads as a packed crowd at
    // stadium distances and is far cheaper to rasterise than 40k instanced meshes.
    const torsoTex = canvasTex(64, 64, (g) => {
      g.fillStyle = "#fff";
      g.beginPath();
      g.moveTo(10, 64);
      g.quadraticCurveTo(12, 18, 32, 16);
      g.quadraticCurveTo(52, 18, 54, 64);
      g.fill();
    });
    const headTex = canvasTex(32, 32, (g) => {
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(16, 16, 13, 0, Math.PI * 2);
      g.fill();
    });
    const nP = people.length;
    const bPos = new Float32Array(nP * 3), bCol = new Float32Array(nP * 3), hPos = new Float32Array(nP * 3), hCol = new Float32Array(nP * 3);
    const col = new THREE.Color();
    people.forEach((p, i) => {
      bPos.set([p.x, p.y + 0.42 * p.s, p.z], i * 3);
      col.set(shirts[Math.floor(r() * shirts.length)]).multiplyScalar(0.55 + r() * 0.4);
      bCol.set([col.r, col.g, col.b], i * 3);
      hPos.set([p.x * 0.999, p.y + 0.92 * p.s, p.z * 0.999], i * 3);
      col.set(skins[Math.floor(r() * skins.length)]);
      hCol.set([col.r, col.g, col.b], i * 3);
    });
    const mkPts = (pos: Float32Array, cols: Float32Array, size: number, map: THREE.Texture) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("color", new THREE.BufferAttribute(cols, 3));
      const m = new THREE.PointsMaterial({ size, sizeAttenuation: true, vertexColors: true, map, alphaTest: 0.5, transparent: false });
      crowdPts.push(m);
      return new THREE.Points(g, m);
    };
    group.add(mkPts(bPos, bCol, 0.74, torsoTex), mkPts(hPos, hCol, 0.33, headTex));
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
    // phone lights / camera flashes that twinkle at night
    const nf = 420;
    flashes = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.35, 0.35), new THREE.MeshBasicMaterial({ color: "#fffbe8", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), nf);
    for (let i = 0; i < nf; i++) {
      const p = people[Math.floor(r() * people.length)];
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -p.a - Math.PI / 2);
      m4.compose(new THREE.Vector3(p.x * 0.995, p.y + 1.1, p.z * 0.995), q, new THREE.Vector3(1, 1, 1));
      flashes.setMatrixAt(i, m4);
    }
    group.add(flashes);
  }

  // ---------- floodlights ----------
  const lampTex = canvasTex(512, 384, (g) => {
    g.fillStyle = "#15171c";
    g.fillRect(0, 0, 512, 384);
    for (let y = 0; y < 6; y++)
      for (let x = 0; x < 8; x++) {
        const cx = 34 + x * 63, cy = 34 + y * 63;
        const gr = g.createRadialGradient(cx, cy, 2, cx, cy, 26);
        gr.addColorStop(0, "#ffffff");
        gr.addColorStop(0.5, "#fff4dc");
        gr.addColorStop(1, "#3a3a3a");
        g.fillStyle = gr;
        g.beginPath();
        g.arc(cx, cy, 24, 0, Math.PI * 2);
        g.fill();
      }
  });
  const haloTex = canvasTex(256, 256, (g) => {
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, "rgba(255,250,235,1)");
    gr.addColorStop(0.12, "rgba(255,245,220,0.55)");
    gr.addColorStop(0.4, "rgba(255,235,200,0.12)");
    gr.addColorStop(1, "rgba(255,235,200,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
  });
  const beamTex = canvasTex(64, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "rgba(255,248,230,0.9)");
    gr.addColorStop(0.5, "rgba(255,248,230,0.25)");
    gr.addColorStop(1, "rgba(255,248,230,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 256);
  });
  const poleMat = new THREE.MeshStandardMaterial({ color: "#3a3f48", roughness: 0.7, metalness: 0.4 });
  const lampMats: THREE.MeshStandardMaterial[] = [];
  const halos: THREE.Sprite[] = [];
  const beams: THREE.Mesh[] = [];
  const spots: THREE.SpotLight[] = [];
  const angles = [30, 90, 150, 210, 270, 330];
  angles.forEach((deg, i) => {
    const a = (deg * Math.PI) / 180, R = topR + 6, H = 62;
    const base = new THREE.Vector3(Math.cos(a) * R, 0, Math.sin(a) * R);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.4, H, 10), poleMat);
    pole.position.set(base.x, H / 2, base.z);
    group.add(pole);
    const headPos = new THREE.Vector3(base.x * 0.985, H + 3, base.z * 0.985);
    const lm = new THREE.MeshStandardMaterial({ color: "#222", emissive: new THREE.Color("#ffffff"), emissiveMap: lampTex, emissiveIntensity: 0, roughness: 0.5 });
    lampMats.push(lm);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(12, 9, 0.8), [poleMat, poleMat, poleMat, poleMat, lm, poleMat]);
    lamp.position.copy(headPos);
    lamp.lookAt(0, 0, 0);
    group.add(lamp);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, color: "#fff6e2", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    halo.position.copy(headPos).multiplyScalar(0.97);
    halo.scale.set(70, 70, 1);
    halos.push(halo);
    group.add(halo);
    // faint light beam through the haze
    const len = headPos.length() * 0.9;
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 34, len, 24, 1, true),
      new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }),
    );
    const mid = headPos.clone().multiplyScalar(0.5);
    beam.position.copy(mid);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3().copy(headPos).negate().normalize());
    beams.push(beam);
    group.add(beam);
    if (i % 2 === 0) {
      const sp = new THREE.SpotLight("#fff4e0", 0, 420, 0.42, 0.6, 2);
      sp.position.copy(headPos);
      sp.target.position.set(0, 0, 0);
      if (i === 0 && opts.sunShadow !== false) {
        sp.castShadow = true;
        sp.shadow.mapSize.set(1024, 1024);
        sp.shadow.bias = -0.0004;
        sp.shadow.camera.near = 50;
        sp.shadow.camera.far = 260;
      }
      spots.push(sp);
      group.add(sp, sp.target);
    }
  });

  // ---------- sky + lights ----------
  const skyU = {
    uSun: { value: new THREE.Vector3(0, 1, 0) },
    uTod: { value: 0 },
    uTime: { value: 0 },
    uClouds: { value: 0.45 },
    uZen: { value: new THREE.Color() },
    uHor: { value: new THREE.Color() },
    uSunCol: { value: new THREE.Color() },
    uCloudCol: { value: new THREE.Color() },
    uStars: { value: 0 },
  };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(950, 48, 24), new THREE.ShaderMaterial({ vertexShader: skyVert, fragmentShader: skyFrag, uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false }));
  group.add(sky);
  const sun = new THREE.DirectionalLight("#fff3dc", 3);
  sun.position.set(-120, 160, 60);
  if (opts.sunShadow !== false) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.camera.near = 50;
    sun.shadow.camera.far = 500;
    sun.shadow.bias = -0.0003;
  }
  group.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight("#bcd4ff", "#2d4a22", 0.9);
  group.add(hemi);
  const fog = new THREE.Fog("#a9c3dd", 160, 950);

  const setTime = (tod: number, time: number) => {
    const el = keysAt(tod, [[0, 34], [0.35, 14], [0.5, 2], [0.62, -4], [0.78, -10], [1, -18]], lerpN);
    const az = (-35 * Math.PI) / 180;
    const e = (el * Math.PI) / 180;
    const sd = new THREE.Vector3(Math.cos(e) * Math.cos(az), Math.sin(e), Math.cos(e) * Math.sin(az)).normalize();
    skyU.uSun.value.copy(sd);
    sun.position.copy(sd).multiplyScalar(300);
    skyU.uZen.value.copy(keysAt(tod, [[0, C("#2c69bf")], [0.35, C("#3364a8")], [0.5, C("#2b3f78")], [0.62, C("#1b2350")], [0.78, C("#0b1230")], [1, C("#03060f")]], mixc));
    skyU.uHor.value.copy(keysAt(tod, [[0, C("#b6d3ec")], [0.35, C("#e8c9a0")], [0.5, C("#ff9255")], [0.62, C("#c4566a")], [0.78, C("#3a2a4e")], [1, C("#101826")]], mixc));
    skyU.uSunCol.value.copy(keysAt(tod, [[0, C("#fff6e0")], [0.35, C("#ffd9a0")], [0.5, C("#ff8a3c")], [0.62, C("#ff5a3c")], [0.78, C("#401020")], [1, C("#000000")]], mixc));
    skyU.uCloudCol.value.copy(keysAt(tod, [[0, C("#f4f6fa")], [0.35, C("#f2dcc4")], [0.5, C("#ff9d6e")], [0.62, C("#a65572")], [0.78, C("#2c2a44")], [1, C("#151b2a")]], mixc));
    skyU.uStars.value = keysAt(tod, [[0.6, 0], [0.9, 1]], lerpN);
    skyU.uTime.value = time;
    sun.intensity = keysAt(tod, [[0, 3.2], [0.35, 2.4], [0.5, 1.2], [0.6, 0.2], [0.66, 0]], lerpN);
    sun.color.copy(keysAt(tod, [[0, C("#fff3dc")], [0.4, C("#ffd5a0")], [0.55, C("#ff8a50")]], mixc));
    hemi.intensity = keysAt(tod, [[0, 0.95], [0.5, 0.55], [0.62, 0.3], [0.8, 0.55], [1, 0.6]], lerpN);
    hemi.color.copy(keysAt(tod, [[0, C("#bcd4ff")], [0.5, C("#ffb894")], [0.66, C("#5a5f78")], [0.85, C("#c9c2b4")]], mixc));
    hemi.groundColor.copy(keysAt(tod, [[0, C("#2d4a22")], [0.7, C("#1a2a18")]], mixc));
    // floodlights: off by day, flicker on through dusk
    const on = keysAt(tod, [[0.48, 0], [0.52, 0.35], [0.535, 0.1], [0.56, 0.8], [0.6, 1]], lerpN);
    lampMats.forEach((m) => (m.emissiveIntensity = 0.05 + on * 5));
    halos.forEach((h) => (h.material.opacity = on * 0.95));
    beams.forEach((b) => ((b.material as THREE.MeshBasicMaterial).opacity = on * 0.05));
    spots.forEach((s) => (s.intensity = on * 34000));
    (roofLights.material as THREE.MeshStandardMaterial).emissiveIntensity = on * 3;
    (boards.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.25 + on * 0.9;
    fog.color.copy(skyU.uHor.value).lerp(C("#0c1220"), keysAt(tod, [[0.6, 0], [1, 0.6]], lerpN));
    const crowdLight = keysAt(tod, [[0, 1.0], [0.4, 0.85], [0.55, 0.45], [0.62, 0.5], [0.8, 0.78], [1, 0.8]], lerpN);
    crowdPts.forEach((m) => m.color.setScalar(crowdLight));
    if (flashes) {
      (flashes.material as THREE.MeshBasicMaterial).opacity = on * (0.6 + 0.4 * Math.sin(time * 7.3));
      flashes.position.y = 0;
    }
  };
  const exposure = (tod: number) => keysAt(tod, [[0, 0.95], [0.5, 1.05], [0.7, 1.15], [1, 1.1]], lerpN);
  setTime(0, 0);
  return { group, setTime, sun, fog, exposure };
};
