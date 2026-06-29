"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useDeviceTier, useLite, LITE_FACTOR, type Tier } from "@/hooks/useDeviceTier";

const vertex = /* glsl */ `
  uniform float uTime;
  attribute float aScale;
  attribute float aSeed;
  varying float vFade;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // fade in from the far plane, fade out as it passes the camera
    float depth = -mv.z;
    vFade = smoothstep(0.0, 6.0, depth) * smoothstep(60.0, 30.0, depth);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (260.0 / depth) * (0.6 + 0.4 * sin(uTime + aSeed * 6.2831));
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vFade;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vFade;
    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.5, d));
    gl_FragColor = vec4(col, a);
  }
`;

/**
 * A streaming particle warp. Points fly toward the camera along +Z; speed and
 * roll scale with the scroll `progress` ref so the section feels like a dive.
 */
function Stream({
  progress,
  count,
}: {
  progress: MutableRefObject<number>;
  count: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const DEPTH = 60;

  const { positions, scales, seeds, radii, angles, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const radii = new Float32Array(count);
    const angles = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.pow(Math.random(), 0.6) * 12;
      const a = Math.random() * Math.PI * 2;
      radii[i] = r;
      angles[i] = a;
      speeds[i] = 0.6 + Math.random() * 0.8;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = -Math.random() * DEPTH;
      scales[i] = Math.random() * 1.8 + 0.5;
      seeds[i] = Math.random();
    }
    return { positions, scales, seeds, radii, angles, speeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#6b9dff") },
      uColorB: { value: new THREE.Color("#4f8cff") },
    }),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = progress.current;
    // Calmer ceiling than a frantic starfield: the dive eases out as the
    // manifesto locks, so the end reads composed rather than chaotic.
    const base = 4 + p * 38;
    const geo = ref.current?.geometry as THREE.BufferGeometry | undefined;
    if (geo) {
      const pos = geo.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < count; i++) {
        let z = arr[i * 3 + 2] + base * speeds[i] * dt;
        if (z > 4) {
          z = -DEPTH;
          // gentle radial reshuffle on respawn keeps the stream lively
          angles[i] += 0.3;
          arr[i * 3] = Math.cos(angles[i]) * radii[i];
          arr[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
        }
        arr[i * 3 + 2] = z;
      }
      pos.needsUpdate = true;
    }
    if (ref.current) {
      // Roll spins up mid-dive then settles toward 0 as p→1, so streaks
      // resolve into near-vertical "lines of code" instead of a roll.
      const roll = (0.04 + p * 0.5) * (1 - p) * (1 - p);
      ref.current.rotation.z += dt * roll;
      // ease any accumulated roll back toward vertical as we lock
      ref.current.rotation.z *= 1 - Math.min(1, p * 1.2) * dt * 1.5;
    }
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
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

function Effects({ tier, lite }: { tier: Tier; lite: boolean }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={lite ? 0.65 : tier === "low" ? 0.7 : 1.15}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.2} darkness={0.9} />
    </EffectComposer>
  );
}

export default function WarpField({
  progress,
  frameloop = "always",
}: {
  progress: MutableRefObject<number>;
  frameloop?: "always" | "never";
}) {
  const tier = useDeviceTier();
  const lite = useLite();
  const mult = lite ? LITE_FACTOR : 1;
  const count = Math.round(
    (tier === "low" ? 2200 : tier === "mid" ? 4500 : 7000) * mult
  );

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1] : tier === "low" ? [1, 1.25] : [1, 1.8]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0, 4], fov: 75, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 18, 58]} />
      <Stream progress={progress} count={count} />
      <Effects tier={tier} lite={lite} />
    </Canvas>
  );
}
