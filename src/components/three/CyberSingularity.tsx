"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useDeviceTier, useLite, LITE_FACTOR, type Tier } from "@/hooks/useDeviceTier";

/* ============================================================
   CyberSingularity — a living digital-protection system.

   A cyber-security "birth" on an endless loop:
     1 SINGULARITY  a dense pulsing core of light gathers energy.
     2 BIG BANG     it erupts — thousands of data-photons streak out.
     3 FORMATION    the photons synchronise into a padlock.
     4 PROTECTION   the lock breathes, emits protection waves,
                    holographic analysis rings scan around it.
     5 IMPLOSION    the structure spirals back into the singularity.
   Then it reforms.

   Real WebGL (R3F): a GPU point-field whose every position is an
   analytic function of the loop clock, drawn as three time-offset
   passes for motion trails; a pulsing core; rotating holo rings and
   expanding protection waves; cinematic bloom / chromatic / grain.
   Palette: deep black · cyan electric · white · glacier blue.
   ============================================================ */

const CYCLE = { sing: 2.0, bang: 1.4, form: 2.2, hold: 4.4, impl: 1.9 };
const TOTAL = CYCLE.sing + CYCLE.bang + CYCLE.form + CYCLE.hold + CYCLE.impl;
const B1 = CYCLE.sing;
const B2 = B1 + CYCLE.bang;
const B3 = B2 + CYCLE.form;
const B4 = B3 + CYCLE.hold;

/* ---- shared position field (GLSL) ---- */
const POS_FN = /* glsl */ `
  const float B1 = ${B1.toFixed(3)};
  const float B2 = ${B2.toFixed(3)};
  const float B3 = ${B3.toFixed(3)};
  const float B4 = ${B4.toFixed(3)};
  const float TOTAL = ${TOTAL.toFixed(3)};
  const float R = 10.0;
  vec3 posAt(float tc, vec3 home, vec3 dir, float seed, float uTime) {
    tc = mod(tc, TOTAL);
    vec3 center = vec3(0.0);
    vec3 far = dir * R;
    float sw = seed * 6.2831;
    if (tc < B1) {
      float k = tc / ${CYCLE.sing.toFixed(3)};
      float rad = 0.10 + (1.0 - k) * 0.22;
      return center + vec3(cos(sw + uTime * 1.3), sin(sw + uTime * 1.1), sin(sw * 1.7 + uTime)) * rad;
    } else if (tc < B2) {
      float l = (tc - B1) / ${CYCLE.bang.toFixed(3)};
      float e = 1.0 - pow(1.0 - l, 3.0);
      return mix(center, far, e);
    } else if (tc < B3) {
      float l = (tc - B2) / ${CYCLE.form.toFixed(3)};
      float e = l < 0.5 ? 4.0 * l * l * l : 1.0 - pow(-2.0 * l + 2.0, 3.0) / 2.0;
      return mix(far, home, e);
    } else if (tc < B4) {
      return home + vec3(sin(uTime * 1.6 + sw), cos(uTime * 1.4 + sw), sin(uTime + sw)) * 0.03;
    } else {
      float l = (tc - B4) / ${CYCLE.impl.toFixed(3)};
      float e = pow(l, 2.3);
      float ang = e * 6.5 * (0.4 + seed);
      float ca = cos(ang), sa = sin(ang);
      vec2 xy = vec2(home.x * ca - home.y * sa, home.x * sa + home.y * ca);
      return mix(vec3(xy, home.z), center, e);
    }
  }
`;

const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uOffset;
  uniform float uSize;
  attribute vec3 aHome;
  attribute vec3 aDir;
  attribute float aSeed;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vTw;
  ${POS_FN}
  void main() {
    vColor = aColor;
    vec3 p = posAt(uTime - uOffset, aHome, aDir, aSeed, uTime);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float big = step(0.86, aSeed);        // ~14% near-camera bokeh
    float base = mix(1.3, 4.2, big);
    vTw = 0.6 + 0.4 * sin(uTime * 3.0 + aSeed * 20.0);
    gl_PointSize = clamp(uSize * base * (1.0 / -mv.z), 1.0, 26.0);
  }
`;
const particleFrag = /* glsl */ `
  precision highp float;
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor * (0.75 + vTw * 0.7), a * uAlpha);
  }
`;

/* sample a padlock silhouette → normalized home points */
function useLockPoints(count: number) {
  return useMemo(() => {
    const homes = new Float32Array(count * 3);
    const dirs = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // sample the lock shape on an offscreen canvas
    let pts: { x: number; y: number }[] = [];
    if (typeof document !== "undefined") {
      const N = 340;
      const off = document.createElement("canvas");
      off.width = N;
      off.height = N;
      const o = off.getContext("2d");
      if (o) {
        const cx = N / 2;
        const bodyW = N * 0.42;
        const bodyH = N * 0.34;
        const rad = bodyW * 0.2;
        const bx = cx - bodyW / 2;
        const by = N * 0.44;
        const shR = bodyW * 0.32;
        const shTop = by - N * 0.24;
        o.fillStyle = "#fff";
        o.strokeStyle = "#fff";
        o.beginPath();
        o.moveTo(bx + rad, by);
        o.arcTo(bx + bodyW, by, bx + bodyW, by + bodyH, rad);
        o.arcTo(bx + bodyW, by + bodyH, bx, by + bodyH, rad);
        o.arcTo(bx, by + bodyH, bx, by, rad);
        o.arcTo(bx, by, bx + bodyW, by, rad);
        o.closePath();
        o.fill();
        o.lineCap = "round";
        o.lineWidth = N * 0.075;
        o.beginPath();
        o.moveTo(cx - shR, by + 4);
        o.lineTo(cx - shR, shTop);
        o.arc(cx, shTop, shR, Math.PI, 0, false);
        o.lineTo(cx + shR, by + 4);
        o.stroke();
        // hollow keyhole
        o.globalCompositeOperation = "destination-out";
        const khY = by + bodyH * 0.5;
        o.beginPath();
        o.arc(cx, khY, bodyW * 0.1, 0, Math.PI * 2);
        o.fill();
        o.beginPath();
        o.moveTo(cx - bodyW * 0.05, khY);
        o.lineTo(cx + bodyW * 0.05, khY);
        o.lineTo(cx + bodyW * 0.09, khY + bodyH * 0.36);
        o.lineTo(cx - bodyW * 0.09, khY + bodyH * 0.36);
        o.closePath();
        o.fill();
        o.globalCompositeOperation = "source-over";

        const img = o.getImageData(0, 0, N, N).data;
        for (let y = 0; y < N; y += 2) {
          for (let x = 0; x < N; x += 2) {
            if (img[(y * N + x) * 4 + 3] > 128) pts.push({ x, y });
          }
        }
      }
    }
    // shuffle + fit to count
    for (let i = pts.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    if (pts.length === 0) pts = [{ x: 170, y: 170 }];

    const CYAN = [0.13, 0.85, 1.0];
    const ICE = [0.62, 0.86, 1.0];
    const WHITE = [1.0, 1.0, 1.0];
    for (let i = 0; i < count; i++) {
      const pt = pts[i % pts.length];
      // normalize 0..340 → world; lock ~3.2 tall, centred
      const nx = (pt.x / 340 - 0.5) * 2;
      const ny = -(pt.y / 340 - 0.5) * 2;
      homes[i * 3] = nx * 1.7;
      homes[i * 3 + 1] = ny * 1.95;
      homes[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      // burst direction — random on a sphere, biased outward from centre
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      dirs[i * 3] = r * Math.cos(th);
      dirs[i * 3 + 1] = u * 0.8;
      dirs[i * 3 + 2] = r * Math.sin(th) * 0.6;
      seeds[i] = Math.random();
      const roll = Math.random();
      const c = roll < 0.55 ? CYAN : roll < 0.85 ? ICE : WHITE;
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    return { homes, dirs, seeds, colors };
  }, [count]);
}

function Particles({ count, ghosts }: { count: number; ghosts: number }) {
  const { homes, dirs, seeds, colors } = useLockPoints(count);
  const mats = useRef<THREE.ShaderMaterial[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (const m of mats.current) if (m) m.uniforms.uTime.value = t;
  });
  const passes = [
    { offset: 0, alpha: 1.0 },
    ...(ghosts >= 1 ? [{ offset: 0.04, alpha: 0.32 }] : []),
    ...(ghosts >= 2 ? [{ offset: 0.08, alpha: 0.15 }] : []),
  ];
  return (
    <>
      {passes.map((pass, i) => (
        <points key={i} renderOrder={2}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array(count * 3), 3]} />
            <bufferAttribute attach="attributes-aHome" args={[homes, 3]} />
            <bufferAttribute attach="attributes-aDir" args={[dirs, 3]} />
            <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
            <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          </bufferGeometry>
          <shaderMaterial
            ref={(m) => {
              if (m) mats.current[i] = m;
            }}
            vertexShader={particleVert}
            fragmentShader={particleFrag}
            uniforms={{
              uTime: { value: 0 },
              uOffset: { value: pass.offset },
              uAlpha: { value: pass.alpha },
              uSize: { value: 26 },
            }}
            transparent
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </>
  );
}

/* soft radial-gradient glow texture (so the halo is a real glow, not a disc) */
function useGlowTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const s = 128;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.2, "rgba(180,245,255,0.7)");
    grad.addColorStop(0.5, "rgba(34,224,255,0.25)");
    grad.addColorStop(1, "rgba(34,224,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/* the pulsing singularity core + soft halo */
function Core() {
  const glow = useGlowTexture();
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const haloMat = useRef<THREE.SpriteMaterial>(null);
  useFrame((state) => {
    const tc = state.clock.elapsedTime % TOTAL;
    // bright when gathering (sing) and at the end of implosion; dim while formed
    let e = 0.35;
    if (tc < B1) e = 0.5 + 0.5 * (tc / CYCLE.sing);
    else if (tc < B2) e = Math.max(0, 1 - (tc - B1) / CYCLE.bang) * 1.2;
    else if (tc < B4) e = 0.22;
    else e = 0.3 + 0.8 * Math.pow((tc - B4) / CYCLE.impl, 2);
    const pulse = 1 + 0.18 * Math.sin(state.clock.elapsedTime * 3.2);
    const s = (0.12 + e * 0.12) * pulse;
    if (core.current) core.current.scale.setScalar(s);
    // contained glow — never a full-frame wash, even at the implosion peak
    if (halo.current) halo.current.scale.setScalar(Math.min(4.2, s * (9 + e * 8)));
    if (haloMat.current) haloMat.current.opacity = Math.min(0.7, 0.3 + e * 0.4);
  });
  return (
    <group renderOrder={3}>
      <mesh ref={core}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#eafcff" toneMapped={false} />
      </mesh>
      {glow && (
        <sprite ref={halo} scale={2}>
          <spriteMaterial
            ref={haloMat}
            map={glow}
            transparent
            opacity={0.5}
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      )}
    </group>
  );
}

/* holographic analysis rings + expanding protection waves during PROTECTION */
function HoloRings() {
  const g = useRef<THREE.Group>(null);
  const ringMats = useRef<THREE.Material[]>([]);
  const wave = useRef<THREE.Mesh>(null);
  const waveMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const tc = t % TOTAL;
    const inHold = tc >= B3 && tc < B4;
    const holdL = inHold ? (tc - B3) / CYCLE.hold : 0;
    const vis = inHold ? Math.min(1, holdL * 4) * Math.min(1, (1 - holdL) * 4) : 0;
    if (g.current) g.current.rotation.z += delta * 0.15;
    for (const m of ringMats.current) if (m) (m as THREE.MeshBasicMaterial).opacity = vis * 0.5;
    // expanding protection wave, retriggered ~every 1.6s during hold
    if (wave.current && waveMat.current) {
      const phase = inHold ? ((tc - B3) % 1.6) / 1.6 : 1;
      const s = 0.6 + phase * 3.2;
      wave.current.scale.setScalar(s);
      waveMat.current.opacity = inHold ? (1 - phase) * 0.4 : 0;
    }
  });

  return (
    <group>
      <group ref={g}>
        {[2.6, 3.1].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2.4 + i * 0.3, i * 0.4, 0]}>
            <torusGeometry args={[r, 0.006, 8, 120]} />
            <meshBasicMaterial
              ref={(m) => {
                if (m) ringMats.current[i] = m;
              }}
              color={i === 0 ? "#22e0ff" : "#a9e0ff"}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <mesh ref={wave} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 8, 120]} />
        <meshBasicMaterial ref={waveMat} color="#22e0ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const { camera } = useThree();
  useFrame((state) => {
    const px = state.pointer.x * 0.6;
    const py = state.pointer.y * 0.4;
    camera.position.x += (px - camera.position.x) * 0.03;
    camera.position.y += (py - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return <>{children}</>;
}

function Effects({ tier, lite }: { tier: Tier; lite: boolean }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={lite ? 1.1 : 1.7} luminanceThreshold={0.08} luminanceSmoothing={0.9} mipmapBlur radius={0.75} />
      <Vignette eskil={false} offset={0.2} darkness={0.9} />
      {lite ? (
        <></>
      ) : (
        <>
          <ChromaticAberration offset={[0.0007, 0.0011]} radialModulation={false} modulationOffset={0} blendFunction={BlendFunction.NORMAL} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={tier === "low" ? 0 : 0.12} />
        </>
      )}
    </EffectComposer>
  );
}

export default function CyberSingularity({ frameloop = "always" }: { frameloop?: "always" | "never" }) {
  const tier = useDeviceTier();
  const lite = useLite();
  const mult = lite ? LITE_FACTOR : 1;
  const count = Math.round((tier === "low" ? 2600 : tier === "mid" ? 4200 : 6000) * mult);
  const ghosts = lite || tier === "low" ? 0 : tier === "mid" ? 1 : 2;

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1] : tier === "low" ? [1, 1.25] : [1, 1.8]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: false }}
      camera={{ position: [0, 0, 6], fov: 46, near: 0.1, far: 100 }}
    >
      <Rig>
        <Core />
        <Particles count={count} ghosts={ghosts} />
        <HoloRings />
      </Rig>
      <Effects tier={tier} lite={lite} />
    </Canvas>
  );
}
