"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useDeviceTier, type Tier } from "@/hooks/useDeviceTier";

const vertex = /* glsl */ `
  uniform float uTime;
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    // clamp so the morphing forms stay crisp and defined, not a bloom blob
    gl_PointSize = clamp((1.3 + 0.7 * sin(uTime * 0.8 + aSeed * 6.2831)) * (220.0 / -mv.z), 1.0, 6.5);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.18, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    gl_FragColor = vec4(col, a * 0.95);
  }
`;

/** Build the K target shapes the cloud morphs between. */
function buildTargets(n: number): Float32Array[] {
  const sphere = new Float32Array(n * 3);
  const torus = new Float32Array(n * 3);
  const galaxy = new Float32Array(n * 3);
  const grid = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const side = Math.ceil(Math.sqrt(n));

  for (let i = 0; i < n; i++) {
    // sphere (fibonacci)
    const t = i / n;
    const y = 1 - t * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    sphere[i * 3] = Math.cos(th) * rr * 2.2;
    sphere[i * 3 + 1] = y * 2.2;
    sphere[i * 3 + 2] = Math.sin(th) * rr * 2.2;

    // torus knot-ish
    const u = t * Math.PI * 2 * 6;
    const v = th;
    const R = 1.7;
    const rt = 0.7;
    torus[i * 3] = (R + rt * Math.cos(v)) * Math.cos(u);
    torus[i * 3 + 1] = rt * Math.sin(v);
    torus[i * 3 + 2] = (R + rt * Math.cos(v)) * Math.sin(u);

    // spiral galaxy (2 arms, log spiral)
    const arm = i % 2 === 0 ? 0 : Math.PI;
    const rad = Math.pow(t, 0.7) * 2.6;
    const ang = rad * 2.4 + arm;
    const spread = (1 - t) * 0.5;
    galaxy[i * 3] = Math.cos(ang) * rad + (th % 1 - 0.5) * spread;
    galaxy[i * 3 + 1] = (Math.sin(th * 7.0) ) * 0.18 * (0.3 + t);
    galaxy[i * 3 + 2] = Math.sin(ang) * rad + (Math.cos(th * 3.0)) * spread;

    // wave grid
    const gx = (i % side) / (side - 1) - 0.5;
    const gz = Math.floor(i / side) / (side - 1) - 0.5;
    grid[i * 3] = gx * 5;
    grid[i * 3 + 1] = Math.sin(gx * 6) * Math.cos(gz * 6) * 0.6;
    grid[i * 3 + 2] = gz * 5;
  }
  return [sphere, galaxy, torus, grid];
}

function Cloud({
  count,
  target,
}: {
  count: number;
  target: MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { pointer, camera } = useThree();

  const targets = useMemo(() => buildTargets(count), [count]);
  const seeds = useMemo(() => {
    const a = new Float32Array(count);
    for (let i = 0; i < count; i++) a[i] = Math.random();
    return a;
  }, [count]);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    p.set(targets[0]);
    return p;
  }, [count, targets]);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const world = useMemo(() => new THREE.Vector3(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#4f8cff") },
      uColorB: { value: new THREE.Color("#6b9dff") },
    }),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const geo = ref.current?.geometry as THREE.BufferGeometry | undefined;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const tgt = targets[target.current % targets.length];

    // world-space pointer on the z=0 plane for repulsion
    ray.setFromCamera(pointer, camera);
    const hit = ray.ray.intersectPlane(plane, world);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // ease toward the active shape
      arr[ix] += (tgt[ix] - arr[ix]) * Math.min(1, dt * 2.2);
      arr[ix + 1] += (tgt[ix + 1] - arr[ix + 1]) * Math.min(1, dt * 2.2);
      arr[ix + 2] += (tgt[ix + 2] - arr[ix + 2]) * Math.min(1, dt * 2.2);

      if (hit) {
        const dx = arr[ix] - world.x;
        const dy = arr[ix + 1] - world.y;
        const dz = arr[ix + 2] - world.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 1.3) {
          const f = (1.3 - d2) * 0.5;
          const inv = 1 / Math.sqrt(d2 + 0.001);
          arr[ix] += dx * inv * f;
          arr[ix + 1] += dy * inv * f;
          arr[ix + 2] += dz * inv * f;
        }
      }
    }
    pos.needsUpdate = true;

    if (ref.current) ref.current.rotation.y += dt * 0.12;
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Effects({ tier }: { tier: Tier }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={tier === "low" ? 0.4 : 0.55}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export default function MorphCloud({
  target,
  frameloop = "always",
}: {
  target: MutableRefObject<number>;
  frameloop?: "always" | "never";
}) {
  const tier = useDeviceTier();
  const count = tier === "low" ? 2500 : tier === "mid" ? 5000 : 8000;

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={tier === "low" ? [1, 1.25] : [1, 1.8]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0.5, 7], fov: 50, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#050505"]} />
      <Cloud count={count} target={target} />
      <Effects tier={tier} />
    </Canvas>
  );
}
