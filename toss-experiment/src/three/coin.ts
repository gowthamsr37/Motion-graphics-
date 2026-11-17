// A minted toss coin: gold PBR metal with embossed faces (height map → normal map), a reeded
// edge, and reflections from a cube-mapped stadium environment (floodlights, crowd ring, grass).
// Original design: crossed bats + ball and the BEYOND THE SCOREBOARD ring; stumps and TOSS on the reverse.
import * as THREE from "three";
import { theme } from "../theme";
import { canvasTex, normalFromHeight, rng } from "./GLScene";

export const COIN_R = 0.1; // metres
export const COIN_T = 0.011;

const relief = (paint: (g: CanvasRenderingContext2D, S: number) => void) => {
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgb(90,90,90)";
  g.fillRect(0, 0, S, S);
  const cx = S / 2;
  // raised rim and beaded ring
  g.strokeStyle = "rgb(255,255,255)";
  g.lineWidth = 34;
  g.beginPath();
  g.arc(cx, cx, S * 0.475, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "rgb(210,210,210)";
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    g.beginPath();
    g.arc(cx + Math.cos(a) * S * 0.428, cx + Math.sin(a) * S * 0.428, 6.5, 0, Math.PI * 2);
    g.fill();
  }
  paint(g, S);
  // one soft blur pass gives the relief bevelled edges
  const b = document.createElement("canvas");
  b.width = b.height = S;
  const bg = b.getContext("2d")!;
  bg.filter = "blur(2.5px)";
  bg.drawImage(c, 0, 0);
  return b;
};

const ringText = (g: CanvasRenderingContext2D, S: number, text: string, radius: number, size: number, start = -Math.PI / 2) => {
  g.save();
  g.translate(S / 2, S / 2);
  g.font = `${size}px "${theme.fonts.display}"`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  const chars = text.split("");
  const widths = chars.map((ch) => g.measureText(ch).width + size * 0.06);
  const total = widths.reduce((a, b) => a + b, 0);
  let a = start - total / radius / 2;
  chars.forEach((ch, i) => {
    a += widths[i] / radius / 2;
    g.save();
    g.rotate(a + Math.PI / 2);
    g.fillText(ch, 0, -radius);
    g.restore();
    a += widths[i] / radius / 2;
  });
  g.restore();
};

export const buildCoinTextures = () => {
  const heads = relief((g, S) => {
    g.fillStyle = "rgb(235,235,235)";
    ringText(g, S, "BEYOND THE SCOREBOARD", S * 0.36, 88);
    ringText(g, S, "★  HEADS  ★", S * 0.36, 70, Math.PI / 2 + Math.PI);
    g.save();
    g.translate(S / 2, S / 2 + 20);
    for (const sgn of [-1, 1]) {
      g.save();
      g.rotate((sgn * 32 * Math.PI) / 180);
      g.fillStyle = "rgb(225,225,225)";
      g.beginPath();
      g.roundRect(-34, -40, 68, 230, 22);
      g.fill(); // blade
      g.fillStyle = "rgb(205,205,205)";
      g.fillRect(-11, -150, 22, 116); // handle
      g.fillStyle = "rgb(245,245,245)";
      g.beginPath();
      g.roundRect(-16, -175, 32, 40, 8);
      g.fill(); // grip end
      g.restore();
    }
    g.fillStyle = "rgb(250,250,250)";
    g.beginPath();
    g.arc(0, -150, 58, 0, Math.PI * 2);
    g.fill(); // ball
    g.strokeStyle = "rgb(150,150,150)";
    g.lineWidth = 6;
    for (const o of [-10, 10]) {
      g.beginPath();
      g.arc(o * 6, -150, 52, -1.0, 1.0);
      g.stroke(); // seam
    }
    g.restore();
  });
  const tails = relief((g, S) => {
    g.fillStyle = "rgb(235,235,235)";
    ringText(g, S, "THE TOSS · THE CHOICE · THE MATCH", S * 0.36, 70);
    g.font = `250px "${theme.fonts.display}"`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("TOSS", S / 2, S / 2 + 135);
    g.fillStyle = "rgb(230,230,230)";
    for (const dx of [-60, 0, 60]) g.fillRect(S / 2 + dx - 13, S / 2 - 230, 26, 240); // stumps
    g.fillRect(S / 2 - 80, S / 2 - 246, 72, 14); // bails
    g.fillRect(S / 2 + 8, S / 2 - 246, 72, 14);
  });
  const toTex = (h: HTMLCanvasElement) => {
    const normal = normalFromHeight(h, 5);
    // recessed field slightly darker and warmer (an ambient-occlusion feel)
    const colour = canvasTex(h.width, h.height, (g) => {
      g.drawImage(h, 0, 0);
      const img = g.getImageData(0, 0, h.width, h.height);
      const d = img.data;
      const rr = rng(3);
      for (let i = 0; i < d.length; i += 4) {
        const k = 0.72 + 0.28 * (d[i] / 255) + (rr() - 0.5) * 0.04;
        d[i] = 236 * k;
        d[i + 1] = 184 * k;
        d[i + 2] = 98 * k;
      }
      g.putImageData(img, 0, 0);
    });
    return { normal, colour };
  };
  const edgeH = document.createElement("canvas");
  edgeH.width = 2048;
  edgeH.height = 32;
  const eg = edgeH.getContext("2d")!;
  for (let x = 0; x < 2048; x++) {
    const v = 0.5 + 0.5 * Math.sin((x / 2048) * Math.PI * 2 * 180);
    eg.fillStyle = `rgb(${v * 255},${v * 255},${v * 255})`;
    eg.fillRect(x, 0, 1, 32);
  }
  return { heads: toTex(heads), tails: toTex(tails), edge: normalFromHeight(edgeH, 3) };
};

// Stadium-like environment for reflections, rendered once into a cube map.
export const buildEnv = (renderer: THREE.WebGLRenderer, night = true) => {
  const scene = new THREE.Scene();
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: { top: { value: new THREE.Color(night ? "#0a1022" : "#3d78c8") }, hor: { value: new THREE.Color(night ? "#3a4258" : "#d6e6f4") } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top; uniform vec3 hor; varying vec3 vP; void main(){ float t = pow(max(vP.y,0.0),0.6); vec3 c = mix(hor, top, t); if (vP.y < 0.0) c = hor * 0.55; gl_FragColor = vec4(c, 1.0); }",
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), skyMat));
  const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 48), new THREE.MeshBasicMaterial({ color: night ? "#2a3a26" : "#4a7a3a" }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -6;
  scene.add(floor);
  const crowdTex = canvasTex(1024, 64, (g) => {
    const r = rng(12);
    g.fillStyle = night ? "#3c4152" : "#7a7f8a";
    g.fillRect(0, 0, 1024, 64);
    g.globalAlpha = 0.6;
    for (let i = 0; i < 7000; i++) {
      g.fillStyle = ["#f2c230", "#1d58c4", "#d9332b", "#ffffff", "#f07a1a", "#202530"][Math.floor(r() * 6)];
      g.fillRect(r() * 1024, r() * 64, 3, 3);
    }
  });
  scene.add(new THREE.Mesh(new THREE.CylinderGeometry(42, 46, 16, 64, 1, true), new THREE.MeshBasicMaterial({ map: crowdTex, side: THREE.BackSide, color: night ? "#c8c8c8" : "#ffffff" })));
  if (night) {
    const lampCol = new THREE.Color(12, 11.4, 10.2);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.5;
      const lamp = new THREE.Mesh(new THREE.PlaneGeometry(11, 7), new THREE.MeshBasicMaterial({ color: lampCol }));
      lamp.position.set(Math.cos(a) * 36, 24, Math.sin(a) * 36);
      lamp.lookAt(0, 0, 0);
      scene.add(lamp);
    }
  } else {
    const sunM = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(16, 15, 12) }));
    sunM.position.set(-20, 30, 10);
    scene.add(sunM);
  }
  // a broad warm soft-box overhead so faces read as polished gold rather than black
  const box = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.35, 1.0) }));
  box.position.set(0, 40, 0);
  box.lookAt(0, 0, 0);
  scene.add(box);
  const rt = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
  const cam = new THREE.CubeCamera(0.1, 200, rt);
  cam.update(renderer, scene);
  const pm = new THREE.PMREMGenerator(renderer);
  const env = pm.fromCubemap(rt.texture).texture;
  pm.dispose();
  rt.dispose();
  return env;
};

export const buildCoin = (env: THREE.Texture) => {
  const t = buildCoinTextures();
  const mk = (map?: THREE.Texture, normal?: THREE.Texture) =>
    new THREE.MeshStandardMaterial({ color: map ? "#ffffff" : "#e8b866", map, normalMap: normal, normalScale: new THREE.Vector2(1.2, 1.2), metalness: 1, roughness: 0.3, envMap: env, envMapIntensity: 1.5 });
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(COIN_R, COIN_R, COIN_T, 128, 1, false), [mk(undefined, t.edge), mk(t.heads.colour, t.heads.normal), mk(t.tails.colour, t.tails.normal)]);
  coin.castShadow = true;
  const holder = new THREE.Group();
  holder.add(coin);
  return { holder, coin };
};

// Pose a tossed coin: it flips end over end about a horizontal axis with a little precession.
export const poseCoin = (holder: THREE.Group, p: { x?: number; y: number; z?: number; flip: number; tilt?: number; yaw?: number }) => {
  holder.position.set(p.x ?? 0, p.y, p.z ?? 0);
  holder.rotation.set(0, p.yaw ?? 0, 0);
  holder.children[0].rotation.set(p.flip, 0, p.tilt ?? 0, "ZXY");
};
