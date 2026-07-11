"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { simplexNoise } from "./noise.glsl";
import { useDeviceTier, useLite, LITE_FACTOR } from "@/hooks/useDeviceTier";

/* ============================================================
   CYBER SIEGE — a three-act story the visitor scrubs with scroll.

   ACT 1  A hostile swarm: thousands of red signatures boiling in
          the dark, flickering, hunting.
   ACT 2  A cyan analysis plane sweeps down through the storm —
          every particle it touches is traced and marked.
   ACT 3  Capture. Each signature is pulled out of the chaos along
          an arc and locked into place as one strut of a geodesic
          shield around the core. The attack becomes the armour.

   One THREE.Points draw call. The morph is attribute-based
   (swarm position → lattice target) with per-particle noise
   stagger; everything is driven by a single damped uProgress.
   ============================================================ */

const HOT = 1.55; // HDR push on highlights so bloom picks them out

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uProgress; // damped 0..1 story clock
  uniform float uScanY;    // analysis plane height (world)
  uniform float uScanOn;   // 0..1 plane visibility
  attribute vec3 aTarget;  // lattice / core seat
  attribute float aSeed;   // 0..1
  attribute float aCore;   // 1 = nucleus particle
  varying float vT;        // personal morph clock (eased)
  varying float vScan;     // proximity glow to the analysis plane
  varying float vSeed;
  varying float vCore;
  varying float vDepth;
  ${simplexNoise}

  void main() {
    vSeed = aSeed;
    vCore = aCore;

    // ---- personal story clock: capture runs progress 0.30 → 0.94,
    //      each signature on its own noise-staggered delay
    float t = clamp((uProgress - 0.30) * 2.35 - aSeed * 0.55, 0.0, 1.0);
    float e = t * t * (3.0 - 2.0 * t); // smoothstep ease
    vT = e;

    // ---- ACT 1: boiling swarm around the seeded position
    vec3 p = position;
    float agit = 1.0 - e; // agitation dies as the particle is captured
    float s = uTime * 0.55 + aSeed * 43.0;
    p.x += snoise(vec3(position.yz * 0.13, s * 0.14)) * 2.3 * agit;
    p.y += snoise(vec3(position.xz * 0.13, s * 0.11 + 5.0)) * 1.8 * agit;
    p.z += snoise(vec3(position.xy * 0.13, s * 0.09 + 11.0)) * 2.0 * agit;
    // the storm slowly presses toward the core while still free
    p *= 1.0 - uProgress * 0.12 * agit;

    // ---- ACT 3: arc flight into the lattice seat
    vec3 pos = mix(p, aTarget, e);
    pos.y += sin(e * 3.14159) * (1.2 + aSeed * 1.6); // drawn up and over

    // once seated, the dome breathes as one body
    pos += normalize(aTarget + vec3(0.0001)) *
           sin(uTime * 0.9 + aSeed * 6.2831) * 0.045 * e;

    // ---- ACT 2: analysis plane proximity (glow + slight lift)
    float scan = exp(-pow((pos.y - uScanY) * 1.1, 2.0)) * uScanOn;
    pos.y += scan * 0.12;
    vScan = scan;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = clamp((-mv.z - 6.0) / 26.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = aCore > 0.5 ? 2.15 : 1.55 + aSeed * 0.9;
    size *= 1.0 + scan * 1.6;                 // the plane lights what it reads
    size *= 1.0 + (1.0 - e) * 0.35;           // wild while hostile
    gl_PointSize = clamp(size * (34.0 / -mv.z) * 4.6, 1.3, 15.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying float vT;
  varying float vScan;
  varying float vSeed;
  varying float vCore;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.1, d);

    // hostile: ember reds, nervous flicker. captured: crystalline cyan, calm.
    vec3 ember = mix(vec3(1.0, 0.16, 0.10), vec3(1.0, 0.45, 0.20), vSeed);
    vec3 ice   = vec3(0.13, 0.88, 1.0);
    vec3 core  = vec3(0.75, 0.96, 1.0) * ${HOT};

    float flicker = 0.62 + 0.38 * sin(uTime * 9.0 + vSeed * 55.0);
    flicker = mix(flicker, 1.0, vT); // the nerves settle once captured

    vec3 col = mix(ember, ice, vT);
    if (vCore > 0.5) col = core;

    // white-hot flash mid-flight — the moment of capture
    float flash = smoothstep(0.05, 0.35, vT) * smoothstep(0.75, 0.45, vT);
    col += vec3(1.0) * flash * 0.9;
    // the analysis plane paints what it touches
    col += vec3(0.25, 0.9, 1.0) * vScan * 1.1;

    float fog = 1.0 - vDepth * 0.55;
    gl_FragColor = vec4(col, a * fog * (0.5 + 0.5 * flicker + vScan * 0.4));
  }
`;

/* ---------------- particle system ---------------- */
function Siege({
  count,
  progressRef,
}: {
  count: number;
  progressRef: React.MutableRefObject<number>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const pts = useRef<THREE.Points>(null);
  const grp = useRef<THREE.Group>(null);

  const { positions, targets, seeds, cores } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const cores = new Float32Array(count);

    // ---- lattice seats: points beaded along the edges of an icosahedron —
    //      a geodesic shield, architectural rather than a blob
    const R = 4.35;
    const ico = new THREE.IcosahedronGeometry(R, 2);
    const edges = new THREE.EdgesGeometry(ico, 1);
    const ep = edges.getAttribute("position");
    const edgeCount = ep.count / 2; // vertex pairs
    ico.dispose();

    const nCore = Math.floor(count * 0.13);
    const nLattice = count - nCore;
    const perEdge = Math.max(2, Math.floor(nLattice / edgeCount));
    const golden = Math.PI * (3 - Math.sqrt(5));

    let k = 0;
    // beads along each strut
    for (let eIdx = 0; eIdx < edgeCount && k < nLattice; eIdx++) {
      const ax = ep.getX(eIdx * 2), ay = ep.getY(eIdx * 2), az = ep.getZ(eIdx * 2);
      const bx = ep.getX(eIdx * 2 + 1), by = ep.getY(eIdx * 2 + 1), bz = ep.getZ(eIdx * 2 + 1);
      for (let j = 0; j < perEdge && k < nLattice; j++) {
        const f = (j + 0.5) / perEdge;
        targets[k * 3] = ax + (bx - ax) * f;
        targets[k * 3 + 1] = ay + (by - ay) * f;
        targets[k * 3 + 2] = az + (bz - az) * f;
        cores[k] = 0;
        k++;
      }
    }
    // any remainder joins the struts at random parametric spots
    while (k < nLattice) {
      const eIdx = (Math.random() * edgeCount) | 0;
      const f = Math.random();
      targets[k * 3] = ep.getX(eIdx * 2) * (1 - f) + ep.getX(eIdx * 2 + 1) * f;
      targets[k * 3 + 1] = ep.getY(eIdx * 2) * (1 - f) + ep.getY(eIdx * 2 + 1) * f;
      targets[k * 3 + 2] = ep.getZ(eIdx * 2) * (1 - f) + ep.getZ(eIdx * 2 + 1) * f;
      cores[k] = 0;
      k++;
    }
    edges.dispose();
    // the nucleus — a dense fibonacci kernel the shield exists to protect
    for (let i = 0; i < nCore; i++, k++) {
      const t = (i + 0.5) / nCore;
      const y = 1 - t * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      const rr = 0.78 * Math.cbrt(Math.random());
      targets[k * 3] = Math.cos(th) * r * rr;
      targets[k * 3 + 1] = y * rr;
      targets[k * 3 + 2] = Math.sin(th) * r * rr;
      cores[k] = 1;
    }

    // ---- swarm seeds: a wide hostile storm-front, biased high and deep
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.35) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      seeds[i] = Math.random();
    }
    return { positions, targets, seeds, cores };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uScanY: { value: 8 },
      uScanOn: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    const dt = Math.min(delta, 0.05);
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    // one damped story clock — the scene trails the scrollbar like a
    // camera operator, never snapping
    u.uProgress.value = THREE.MathUtils.damp(
      u.uProgress.value,
      progressRef.current,
      5,
      dt
    );
    const p = u.uProgress.value;
    // the analysis plane exists during act 2, sweeping top → bottom
    const sweep = THREE.MathUtils.smoothstep(p, 0.14, 0.52);
    u.uScanY.value = THREE.MathUtils.lerp(8.5, -7, sweep);
    u.uScanOn.value =
      THREE.MathUtils.smoothstep(p, 0.10, 0.2) *
      (1 - THREE.MathUtils.smoothstep(p, 0.5, 0.62));

    if (pts.current) {
      // once the dome is standing it turns slowly — a lighthouse, not a top
      pts.current.rotation.y += dt * 0.11 * p;
    }
    if (grp.current) {
      // on wide viewports the whole theatre sits right of centre so the
      // headline owns the left column at every act
      const wide = state.size.width >= 1024;
      grp.current.position.x = THREE.MathUtils.damp(
        grp.current.position.x,
        wide ? 2.9 : 0,
        4,
        dt
      );
    }
  });

  return (
    <group ref={grp}>
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[targets, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aCore" args={[cores, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
    </group>
  );
}

/* ---------------- the analysis plane, made visible ---------------- */
function ScanPlane({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const smooth = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    smooth.current = THREE.MathUtils.damp(smooth.current, progressRef.current, 5, dt);
    const p = smooth.current;
    const sweep = THREE.MathUtils.smoothstep(p, 0.14, 0.52);
    const on =
      THREE.MathUtils.smoothstep(p, 0.10, 0.2) *
      (1 - THREE.MathUtils.smoothstep(p, 0.5, 0.62));
    if (ref.current) ref.current.position.y = THREE.MathUtils.lerp(8.5, -7, sweep);
    if (matRef.current) matRef.current.opacity = on * 0.55;
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <planeGeometry args={[34, 0.05]} />
      <meshBasicMaterial
        ref={matRef}
        color={new THREE.Color(0.3, 1.6, 2.0)}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ---------------- camera: pull from storm chaos to shield reveal -------- */
function Rig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const smooth = useRef(0);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    smooth.current = THREE.MathUtils.damp(smooth.current, progressRef.current, 5, dt);
    const p = smooth.current;
    // portrait viewports need a longer lens or the dome overflows the frame
    const portrait = state.size.height > state.size.width;
    const back = portrait ? 6.5 : 0;
    const z = THREE.MathUtils.lerp(17.5 + back, 12.0 + back, p);
    const y = THREE.MathUtils.lerp(2.4, 0.6, p);
    state.camera.position.set(
      state.pointer.x * 0.7,
      y + state.pointer.y * 0.4,
      z
    );
    state.camera.lookAt(0, 0.2, 0);
  });
  return null;
}

function Effects({ lite }: { lite: boolean }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={lite ? 0.8 : 1.05}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.72}
      />
      <Vignette eskil={false} offset={0.18} darkness={0.88} />
    </EffectComposer>
  );
}

export default function CyberSiege({
  frameloop = "always",
  progressRef,
}: {
  frameloop?: "always" | "never";
  progressRef: React.MutableRefObject<number>;
}) {
  const tier = useDeviceTier();
  const lite = useLite();
  const mult = lite ? LITE_FACTOR : 1;
  const count = Math.round(
    (tier === "low" ? 16000 : tier === "mid" ? 24000 : 32000) * mult
  );

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1.25] : tier === "low" ? [1, 1.4] : [1, 1.6]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 2.4, 17.5], fov: 52, near: 0.1, far: 80 }}
    >
      <color attach="background" args={["#030406"]} />
      <fog attach="fog" args={["#030406", 14, 42]} />
      <Rig progressRef={progressRef} />
      <Siege count={count} progressRef={progressRef} />
      <ScanPlane progressRef={progressRef} />
      <Effects lite={lite} />
    </Canvas>
  );
}
