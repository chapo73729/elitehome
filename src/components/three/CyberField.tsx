"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { simplexNoise } from "./noise.glsl";
import { useDeviceTier, useLite, LITE_FACTOR, type Tier } from "@/hooks/useDeviceTier";

/* ============================================================
   CyberField — the security section's full-bleed scene, with no
   clichéd object at all. An invisible defence, made visible only
   when something hits it:

   A vast, calm ocean of light-particles breathes under a black sky.
   Red intrusion streaks dive at it from above — and the instant one
   touches the surface, it is annihilated: a cyan shockwave rings out
   across the field, lifting and lighting the particles it crosses.
   The field always returns to calm. Threats keep coming; none get
   through.

   All surface motion + ripples run in the vertex shader (one draw
   call for the whole ocean). Meteors are a handful of CPU-updated
   trails. Bloom / CA / vignette / grain complete the grade.
   ============================================================ */

const MAX_RIPPLES = 4;

const surfaceVert = /* glsl */ `
  uniform float uTime;
  uniform vec4 uRipples[${MAX_RIPPLES}]; // x, z, startTime, amp
  attribute float aSeed;
  varying float vGlow;    // ripple brightness
  varying float vCrest;   // wave height factor
  varying float vDepth;   // 0 near → 1 far
  ${simplexNoise}
  void main() {
    vec3 p = position;
    // layered travelling swell + simplex detail — a living ocean
    float t = uTime;
    float w = 0.0;
    w += sin(p.x * 0.14 + t * 0.7) * 0.55;
    w += sin(p.z * 0.10 - t * 0.55) * 0.65;
    w += snoise(vec3(p.x * 0.045, p.z * 0.045, t * 0.12)) * 1.15;
    w += snoise(vec3(p.x * 0.16, p.z * 0.16, t * 0.3)) * 0.28;

    // impact shockwaves — expanding rings that lift and light the surface
    float glow = 0.0;
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec4 r = uRipples[i];
      float age = t - r.z;
      if (age > 0.0 && age < 3.6 && r.w > 0.0) {
        float d = distance(p.xz, r.xy);
        float front = age * 8.0;                    // ring speed
        float band = exp(-pow((d - front) * 0.42, 2.0));
        float fade = exp(-age * 0.95);
        w += band * fade * 3.0 * r.w;
        glow += band * fade * 1.25 * r.w;
        // centre flash right at impact
        glow += exp(-d * 0.7) * exp(-age * 5.0) * 2.0 * r.w;
      }
    }

    p.y += w;
    vCrest = smoothstep(-1.2, 2.2, w);
    vGlow = glow;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = clamp((-mv.z - 6.0) / 70.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = (1.6 + vCrest * 1.4 + glow * 3.0) * (1.0 + aSeed * 0.6);
    gl_PointSize = clamp(size * (30.0 / -mv.z) * 6.0, 1.4, 15.0);
  }
`;

const surfaceFrag = /* glsl */ `
  precision highp float;
  varying float vGlow;
  varying float vCrest;
  varying float vDepth;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d);

    vec3 deep  = vec3(0.055, 0.10, 0.20);
    vec3 crest = vec3(0.31, 0.55, 1.0);
    vec3 flash = vec3(0.55, 0.95, 1.0);
    vec3 col = mix(deep, crest, vCrest * 0.85);
    col = mix(col, flash, clamp(vGlow, 0.0, 1.0));
    col *= 0.75 + vGlow * 2.4;

    // recede into the dark horizon
    float fog = 1.0 - vDepth * 0.9;
    gl_FragColor = vec4(col, a * fog * (0.55 + vGlow));
  }
`;

/* ---------------- the ocean ---------------- */
function Ocean({
  cols,
  rows,
  ripplesRef,
}: {
  cols: number;
  rows: number;
  ripplesRef: React.MutableRefObject<THREE.Vector4[]>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(cols * rows * 3);
    const seeds = new Float32Array(cols * rows);
    let k = 0;
    for (let iz = 0; iz < rows; iz++) {
      // pow-distributed depth: denser rows near the camera so the
      // foreground reads as a continuous surface, not scattered dots
      const fz = Math.pow(iz / (rows - 1), 1.75);
      for (let ix = 0; ix < cols; ix++) {
        const x = (ix / (cols - 1) - 0.5) * 70;
        const z = -1 - fz * 74;
        positions[k * 3] = x + (Math.random() - 0.5) * 0.35;
        positions[k * 3 + 1] = 0;
        positions[k * 3 + 2] = z + (Math.random() - 0.5) * 0.35;
        seeds[k] = Math.random();
        k++;
      }
    }
    return { positions, seeds };
  }, [cols, rows]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRipples: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -99, 0)) },
    }),
    []
  );

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    const arr = mat.current.uniforms.uRipples.value as THREE.Vector4[];
    for (let i = 0; i < MAX_RIPPLES; i++) arr[i].copy(ripplesRef.current[i]);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={surfaceVert}
        fragmentShader={surfaceFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------------- intrusion meteors + impact director ---------------- */
type Meteor = { active: boolean; t0: number; dur: number; from: THREE.Vector3; to: THREE.Vector3 };

function Intrusions({
  ripplesRef,
  maxMeteors,
}: {
  ripplesRef: React.MutableRefObject<THREE.Vector4[]>;
  maxMeteors: number;
}) {
  const TRAIL = 10;
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const meteors = useRef<Meteor[]>(
    Array.from({ length: maxMeteors }, () => ({
      active: false,
      t0: 0,
      dur: 1,
      from: new THREE.Vector3(),
      to: new THREE.Vector3(),
    }))
  );
  const nextSpawn = useRef(1.2);
  const nextRipple = useRef(0);
  const positions = useMemo(() => new Float32Array(maxMeteors * TRAIL * 3), [maxMeteors]);
  const alphas = useMemo(() => new Float32Array(maxMeteors * TRAIL), [maxMeteors]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // spawn
    if (t > nextSpawn.current) {
      nextSpawn.current = t + 1.1 + Math.random() * 1.4;
      const m = meteors.current.find((mm) => !mm.active);
      if (m) {
        m.active = true;
        m.t0 = t;
        m.dur = 0.9 + Math.random() * 0.5;
        const tx = (Math.random() - 0.5) * 44;
        const tz = -12 - Math.random() * 34;
        m.to.set(tx, 0.4, tz);
        m.from.set(tx + (Math.random() - 0.5) * 30, 26 + Math.random() * 8, tz - 26 - Math.random() * 10);
      }
    }

    // update trails
    for (let i = 0; i < maxMeteors; i++) {
      const m = meteors.current[i];
      for (let j = 0; j < TRAIL; j++) {
        const k = i * TRAIL + j;
        if (!m.active) {
          alphas[k] = 0;
          positions[k * 3 + 1] = -999;
          continue;
        }
        const lag = j * 0.028;
        const p = Math.min(1, Math.max(0, (t - m.t0 - lag) / m.dur));
        const e = p * p; // accelerate down
        positions[k * 3] = m.from.x + (m.to.x - m.from.x) * e;
        positions[k * 3 + 1] = m.from.y + (m.to.y - m.from.y) * e;
        positions[k * 3 + 2] = m.from.z + (m.to.z - m.from.z) * e;
        alphas[k] = (1 - j / TRAIL) * (p > 0 ? 1 : 0);
      }
      // impact → hand off to a ripple slot, deactivate
      if (m.active && t - m.t0 >= m.dur) {
        m.active = false;
        const slot = nextRipple.current % MAX_RIPPLES;
        nextRipple.current++;
        ripplesRef.current[slot].set(m.to.x, m.to.z, t, 1);
      }
    }
    if (geoRef.current) {
      (geoRef.current.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geoRef.current.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={/* glsl */ `
          attribute float aAlpha;
          varying float vA;
          void main() {
            vA = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp((2.4 + aAlpha * 3.4) * (30.0 / -mv.z) * 3.0, 1.0, 12.0);
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          varying float vA;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.05, d) * vA;
            vec3 col = mix(vec3(1.0, 0.32, 0.32), vec3(1.0, 0.75, 0.7), 1.0 - d * 2.0);
            gl_FragColor = vec4(col, a);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------------- horizon glow ---------------- */
function Horizon() {
  const tex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 64;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 64, 0, 0);
    grad.addColorStop(0, "rgba(34,150,255,0.5)");
    grad.addColorStop(0.5, "rgba(34,120,255,0.12)");
    grad.addColorStop(1, "rgba(34,120,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  if (!tex) return null;
  return (
    <mesh position={[0, 1.4, -78]}>
      <planeGeometry args={[200, 12]} />
      <meshBasicMaterial map={tex} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </mesh>
  );
}

/* ---------------- camera ---------------- */
function Rig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const tx = state.pointer.x * 1.4;
    const ty = 3.4 + state.pointer.y * 0.8 + Math.sin(t * 0.4) * 0.12;
    camera.position.x += (tx - camera.position.x) * 0.03;
    camera.position.y += (ty - camera.position.y) * 0.03;
    camera.position.z = 8.5;
    // aim slightly below the horizon so the ocean owns ~2/3 of the frame
    camera.lookAt(0, -0.4, -30);
  });
  return null;
}

function Effects({ tier, lite }: { tier: Tier; lite: boolean }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={lite ? 0.85 : 1.15} luminanceThreshold={0.25} luminanceSmoothing={0.85} mipmapBlur radius={0.75} />
      <Vignette eskil={false} offset={0.18} darkness={0.9} />
      {lite ? (
        <></>
      ) : (
        <>
          <ChromaticAberration offset={[0.0005, 0.0009]} radialModulation={false} modulationOffset={0} blendFunction={BlendFunction.NORMAL} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={tier === "low" ? 0 : 0.1} />
        </>
      )}
    </EffectComposer>
  );
}

export default function CyberField({ frameloop = "always" }: { frameloop?: "always" | "never" }) {
  const tier = useDeviceTier();
  const lite = useLite();
  const mult = lite ? Math.sqrt(LITE_FACTOR) : 1;
  const cols = Math.round((tier === "low" ? 110 : tier === "mid" ? 150 : 190) * mult);
  const rows = Math.round((tier === "low" ? 70 : tier === "mid" ? 95 : 120) * mult);
  const maxMeteors = tier === "low" ? 3 : 5;

  const ripplesRef = useRef<THREE.Vector4[]>(
    Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -99, 0))
  );

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1.25] : tier === "low" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: false }}
      camera={{ position: [0, 4.6, 8.5], fov: 50, near: 0.1, far: 160 }}
    >
      <Rig />
      <Horizon />
      <Ocean cols={cols} rows={rows} ripplesRef={ripplesRef} />
      <Intrusions ripplesRef={ripplesRef} maxMeteors={maxMeteors} />
      <Effects tier={tier} lite={lite} />
    </Canvas>
  );
}
