"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useDeviceTier, useLite, LITE_FACTOR, type Tier } from "@/hooks/useDeviceTier";

/* ============================================================
   CyberVault — a real, solid 3D padlock, shot like a product film.

   A heavy brushed-metal lock (PBR materials + procedural studio
   reflections) floats in the void, slowly rotating so its depth is
   unmistakable. Cyan circuitry seams and the keyhole glow through
   the bloom. A scanner ring sweeps the body. On a loop, the shackle
   springs open, hangs charged, then SLAMS shut — impact light flash
   on the metal, expanding shockwave, a burst of sparks and a camera
   shake. Security you can feel.

   R3F + postprocessing (bloom, chromatic aberration, vignette,
   grain), pointer-parallax camera. Device-tiered; the caller
   provides the static fallback via SceneBoundary.
   ============================================================ */

const CYAN = "#22e0ff";
const ICE = "#a9e0ff";

// loop timeline (seconds)
const T_SECURE = 5.2;
const T_UNLOCK = 0.7;
const T_OPEN = 1.6;
const T_SLAM = 0.32;
const T_SETTLE = 1.1;
const TOTAL = T_SECURE + T_UNLOCK + T_OPEN + T_SLAM + T_SETTLE;
const B1 = T_SECURE;
const B2 = B1 + T_UNLOCK;
const B3 = B2 + T_OPEN;
const B4 = B3 + T_SLAM;

const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const easeInQuart = (x: number) => x * x * x * x;
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Procedural studio reflections — the thing that makes metal look expensive. */
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* ---------- spark burst (GPU, retriggered by uniform) ---------- */
const sparkVert = /* glsl */ `
  uniform float uAge;      // seconds since slam (large = idle)
  attribute vec3 aDir;
  attribute float aSpeed;
  attribute float aSeed;
  varying float vA;
  void main() {
    float t = uAge;
    vec3 p = vec3(0.0, 1.15, 0.0) + aDir * aSpeed * t;
    p.y -= 2.2 * t * t;                    // gravity
    vA = max(0.0, 1.0 - t / 0.9);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((2.0 + aSeed * 3.0) * (1.0 / -mv.z) * 160.0, 1.0, 10.0);
  }
`;
const sparkFrag = /* glsl */ `
  precision highp float;
  varying float vA;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vA;
    gl_FragColor = vec4(mix(vec3(0.7, 0.95, 1.0), vec3(1.0), 1.0 - d * 2.0), a);
  }
`;

function Sparks({ count, ageRef }: { count: number; ageRef: React.MutableRefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { dirs, speeds, seeds } = useMemo(() => {
    const dirs = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const up = Math.random() * 0.9 + 0.15;
      const r = Math.sqrt(Math.max(0, 1 - up * up));
      dirs[i * 3] = Math.cos(a) * r;
      dirs[i * 3 + 1] = up;
      dirs[i * 3 + 2] = Math.sin(a) * r;
      speeds[i] = 1.6 + Math.random() * 3.4;
      seeds[i] = Math.random();
    }
    return { dirs, speeds, seeds };
  }, [count]);
  useFrame(() => {
    if (mat.current) mat.current.uniforms.uAge.value = ageRef.current;
  });
  return (
    <points renderOrder={4}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(count * 3), 3]} />
        <bufferAttribute attach="attributes-aDir" args={[dirs, 3]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={sparkVert}
        fragmentShader={sparkFrag}
        uniforms={{ uAge: { value: 99 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- orbiting data motes ---------- */
function Motes({ count }: { count: number }) {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const params = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push({
        r: 2.4 + Math.random() * 2.6,
        h: (Math.random() - 0.5) * 3.2,
        a: Math.random() * Math.PI * 2,
        sp: 0.12 + Math.random() * 0.3,
        tilt: (Math.random() - 0.5) * 0.7,
      });
    }
    return p;
  }, [count]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const o = params[i];
      const a = o.a + t * o.sp;
      positions[i * 3] = Math.cos(a) * o.r;
      positions[i * 3 + 1] = o.h + Math.sin(a * 2 + o.tilt) * 0.25;
      positions[i * 3 + 2] = Math.sin(a) * o.r;
    }
    if (geoRef.current) {
      const attr = geoRef.current.attributes.position as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
  });
  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={CYAN} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/* ---------- the vault ---------- */
function Vault({ sparkAge }: { sparkAge: React.MutableRefObject<number> }) {
  const lock = useRef<THREE.Group>(null);
  const shackle = useRef<THREE.Group>(null);
  const scanRing = useRef<THREE.Mesh>(null);
  const scanMat = useRef<THREE.MeshBasicMaterial>(null);
  const shock = useRef<THREE.Mesh>(null);
  const shockMat = useRef<THREE.MeshBasicMaterial>(null);
  const flash = useRef<THREE.PointLight>(null);
  const keyMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const slamAt = useRef(-99);

  // geometries (memoized once)
  const bodyGeo = useMemo(() => new RoundedBoxGeometry(2.3, 2.5, 1.15, 5, 0.2), []);
  const panelGeo = useMemo(() => new RoundedBoxGeometry(1.9, 2.1, 0.06, 3, 0.1), []);
  const archGeo = useMemo(() => new THREE.TorusGeometry(0.72, 0.155, 24, 48, Math.PI), []);
  const legGeo = useMemo(() => new THREE.CylinderGeometry(0.155, 0.155, 1.05, 24), []);
  const bezelGeo = useMemo(() => new THREE.CylinderGeometry(0.3, 0.3, 0.08, 32), []);
  const keyGeo = useMemo(() => new THREE.CylinderGeometry(0.13, 0.13, 0.1, 24), []);
  const wedgeGeo = useMemo(() => new THREE.BoxGeometry(0.14, 0.42, 0.1), []);
  const seamGeo = useMemo(() => new THREE.BoxGeometry(1.5, 0.022, 0.02), []);
  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.035, 12, 12), []);

  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#141c2a",
        metalness: 0.92,
        roughness: 0.32,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
        envMapIntensity: 1.35,
      }),
    []
  );
  const panelMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0c1220",
        metalness: 0.85,
        roughness: 0.45,
        envMapIntensity: 1.0,
      }),
    []
  );
  const steelMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#39465c",
        metalness: 0.96,
        roughness: 0.22,
        envMapIntensity: 1.6,
      }),
    []
  );
  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#031018",
        emissive: new THREE.Color(CYAN),
        emissiveIntensity: 2.6,
        metalness: 0.2,
        roughness: 0.4,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const tc = t % TOTAL;

    // ---- shackle state machine ----
    let lift = 0;
    let swing = 0;
    if (tc < B1) {
      lift = 0;
      swing = 0;
    } else if (tc < B2) {
      const p = (tc - B1) / T_UNLOCK;
      lift = easeOutBack(p) * 0.5;
      swing = easeOutCubic(p) * 0.12;
    } else if (tc < B3) {
      const p = (tc - B2) / T_OPEN;
      lift = 0.5;
      swing = 0.12 + Math.sin(p * Math.PI * 2) * 0.05 + p * 0.28;
    } else if (tc < B4) {
      const p = (tc - B3) / T_SLAM;
      const e = easeInQuart(p);
      lift = 0.5 * (1 - e);
      swing = 0.4 * (1 - e);
      if (p > 0.98 && t - slamAt.current > 2) {
        slamAt.current = t; // IMPACT
      }
    } else {
      lift = 0;
      swing = 0;
    }
    if (shackle.current) {
      shackle.current.position.y = lift;
      shackle.current.rotation.y = swing;
    }

    const dtSlam = t - slamAt.current;
    sparkAge.current = dtSlam;

    // ---- impact: light flash, shockwave, recoil, shake ----
    if (flash.current) flash.current.intensity = Math.max(0, 60 * (1 - dtSlam * 3.2));
    if (shock.current && shockMat.current) {
      if (dtSlam < 1.0 && dtSlam >= 0) {
        const s = 1 + dtSlam * 7;
        shock.current.scale.setScalar(s);
        shockMat.current.opacity = (1 - dtSlam) * 0.85;
      } else {
        shockMat.current.opacity = 0;
      }
    }
    if (lock.current) {
      const recoil = dtSlam >= 0 && dtSlam < 0.5 ? Math.sin(dtSlam * Math.PI * 2) * 0.04 * (1 - dtSlam * 2) : 0;
      lock.current.scale.set(1 + recoil, 1 - recoil, 1 + recoil);
      // majestic continuous rotation — unmistakably 3D
      lock.current.rotation.y = t * 0.35;
      lock.current.rotation.x = Math.sin(t * 0.4) * 0.06;
      lock.current.position.y = Math.sin(t * 0.8) * 0.06 - 0.15;
      // full-bleed composition: drift right on wide stages so the section
      // title breathes on the left; centred on narrow (portrait) stages
      const aspect = state.size.width / Math.max(1, state.size.height);
      const tx = aspect > 1.35 ? 1.6 : 0;
      lock.current.position.x += (tx - lock.current.position.x) * 0.04;
    }

    // ---- scanner ring sweep ----
    if (scanRing.current && scanMat.current) {
      const sp = (t * 0.35) % 1;
      const y = -1.3 + sp * 2.9;
      scanRing.current.position.y = y - 0.15;
      const edge = Math.min(sp, 1 - sp);
      scanMat.current.opacity = clamp01(edge * 6) * 0.6;
    }

    // ---- keyhole pulse (breathes; flares white on unlock + slam) ----
    const nearEvent = Math.min(
      Math.abs(tc - B1) < 0.4 ? 0 : 1,
      dtSlam >= 0 && dtSlam < 0.4 ? 0 : 1
    );
    const pulse = 2.2 + Math.sin(t * 2.6) * 0.7 + (1 - nearEvent) * 3.5;
    for (const m of keyMats.current) if (m) m.emissiveIntensity = pulse;
  });

  const registerKeyMat = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !keyMats.current.includes(m)) keyMats.current.push(m);
  };

  /** keyhole assembly for one face (front z+ / back z-) */
  const Keyhole = ({ z, flip }: { z: number; flip: boolean }) => (
    <group position={[0, -0.15, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
      <mesh geometry={bezelGeo} rotation={[Math.PI / 2, 0, 0]} material={panelMat} />
      <mesh geometry={keyGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0.03]}>
        <meshStandardMaterial ref={registerKeyMat} color="#031018" emissive={CYAN} emissiveIntensity={2.6} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh geometry={wedgeGeo} position={[0, -0.24, 0.03]}>
        <meshStandardMaterial ref={registerKeyMat} color="#031018" emissive={CYAN} emissiveIntensity={2.6} metalness={0.2} roughness={0.4} />
      </mesh>
    </group>
  );

  return (
    <group>
      <group ref={lock}>
        {/* body + inset panels */}
        <mesh geometry={bodyGeo} material={bodyMat} position={[0, -0.15, 0]} />
        <mesh geometry={panelGeo} material={panelMat} position={[0, -0.15, 0.58]} />
        <mesh geometry={panelGeo} material={panelMat} position={[0, -0.15, -0.58]} />

        {/* circuitry seams + nodes (both faces) */}
        {[0.615, -0.615].map((z) => (
          <group key={z} position={[0, 0, z]}>
            <mesh geometry={seamGeo} material={glowMat} position={[0, 0.62, 0]} />
            <mesh geometry={seamGeo} material={glowMat} position={[0, -0.92, 0]} scale={[0.6, 1, 1]} />
            <mesh geometry={dotGeo} material={glowMat} position={[0.78, 0.62, 0]} />
            <mesh geometry={dotGeo} material={glowMat} position={[-0.48, -0.92, 0]} />
          </group>
        ))}

        {/* keyholes, front + back */}
        <Keyhole z={0.62} flip={false} />
        <Keyhole z={-0.62} flip />

        {/* shackle — pivots on the left leg so it swings open in 3D */}
        <group position={[-0.72, 0, 0]}>
          <group ref={shackle}>
            <group position={[0.72, 0, 0]}>
              <mesh geometry={archGeo} material={steelMat} position={[0, 1.62, 0]} />
              <mesh geometry={legGeo} material={steelMat} position={[-0.72, 1.1, 0]} />
              <mesh geometry={legGeo} material={steelMat} position={[0.72, 1.1, 0]} />
            </group>
          </group>
        </group>

        {/* scanner ring hugging the body */}
        <mesh ref={scanRing} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.62, 0.012, 8, 80]} />
          <meshBasicMaterial ref={scanMat} color={ICE} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      {/* impact shockwave (world space, at shackle base) */}
      <mesh ref={shock} position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.02, 8, 80]} />
        <meshBasicMaterial ref={shockMat} color={ICE} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* impact flash light */}
      <pointLight ref={flash} position={[0, 1.4, 1.2]} intensity={0} color="#cdeeff" distance={12} decay={2} />
    </group>
  );
}

/* ---------- camera: slow orbit + parallax + slam shake ---------- */
function Rig({ sparkAge }: { sparkAge: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const shake = Math.max(0, 1 - Math.max(0, sparkAge.current) * 2.6);
    const jx = (Math.random() - 0.5) * 0.14 * shake;
    const jy = (Math.random() - 0.5) * 0.14 * shake;
    const ang = Math.sin(t * 0.12) * 0.4 + state.pointer.x * 0.45;
    // pull back on narrow (portrait) stages so the whole lock stays framed
    const aspect = state.size.width / Math.max(1, state.size.height);
    const r = aspect < 0.8 ? 10.2 : aspect < 1.2 ? 8.2 : 6.4;
    const target = new THREE.Vector3(Math.sin(ang) * r, 0.5 + state.pointer.y * 0.6, Math.cos(ang) * r);
    camera.position.lerp(target, 0.04);
    camera.position.x += jx;
    camera.position.y += jy;
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

function Effects({ tier, lite }: { tier: Tier; lite: boolean }) {
  return (
    <EffectComposer multisampling={tier === "high" && !lite ? 4 : 0}>
      <Bloom intensity={lite ? 0.9 : 1.25} luminanceThreshold={0.5} luminanceSmoothing={0.85} mipmapBlur radius={0.8} />
      <Vignette eskil={false} offset={0.2} darkness={0.88} />
      {lite ? (
        <></>
      ) : (
        <>
          <ChromaticAberration offset={[0.0006, 0.001]} radialModulation={false} modulationOffset={0} blendFunction={BlendFunction.NORMAL} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={tier === "low" ? 0 : 0.12} />
        </>
      )}
    </EffectComposer>
  );
}

export default function CyberVault({ frameloop = "always" }: { frameloop?: "always" | "never" }) {
  const tier = useDeviceTier();
  const lite = useLite();
  const mult = lite ? LITE_FACTOR : 1;
  const motes = Math.round((tier === "low" ? 160 : tier === "mid" ? 260 : 380) * mult);
  const sparks = Math.round((tier === "low" ? 90 : 160) * mult);
  const sparkAge = useRef(99);

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1.25] : tier === "low" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      camera={{ position: [0, 0.5, 6.4], fov: 42, near: 0.1, far: 60 }}
    >
      <Env />
      {/* cinematic lighting: cool key, cyan rims */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#dbe9ff" />
      <pointLight position={[-5, 2, -4]} intensity={26} color={CYAN} distance={16} decay={2} />
      <pointLight position={[5, -1, -3]} intensity={14} color="#3d6fe0" distance={14} decay={2} />

      <Rig sparkAge={sparkAge} />
      <Vault sparkAge={sparkAge} />
      <Motes count={motes} />
      <Sparks count={sparks} ageRef={sparkAge} />

      <Effects tier={tier} lite={lite} />
    </Canvas>
  );
}
