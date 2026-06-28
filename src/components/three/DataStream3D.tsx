"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useDeviceTier } from "@/hooks/useDeviceTier";

/* ============================================================
   Software & Automation — a corridor of data conduits. Points
   are bound into discrete lanes streaming toward the camera, so
   it reads as flowing data/code, not random dust. The lead
   particle of each lane burns brighter — a packet head.
   ============================================================ */

const vertex = /* glsl */ `
  uniform float uTime;
  attribute float aSpeed;
  attribute float aScale;
  attribute float aSeed;
  attribute float aHead;   // 1.0 for the bright lead packet, else 0.0
  varying float vDepth;
  varying float vSeed;
  varying float vHead;
  void main() {
    vec3 p = position;
    float range = 46.0;
    p.z = mod(p.z + uTime * aSpeed, range) - 40.0;
    vDepth = p.z;
    vSeed = aSeed;
    vHead = aHead;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aScale * (90.0 / -mv.z), 1.0, 9.0) * (1.0 + aHead * 1.4);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vDepth;
  varying float vSeed;
  varying float vHead;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);
    float near = smoothstep(-40.0, 4.0, vDepth);
    vec3 col = mix(uColorA, uColorB, fract(vSeed * 3.0));
    col = mix(col, vec3(0.85, 0.98, 1.0), vHead * 0.7);
    a *= (0.1 + near * 0.95) * (1.0 + vHead * 0.6);
    gl_FragColor = vec4(col, a);
  }
`;

function Stream({ lanes, perLane }: { lanes: number; perLane: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const count = lanes * perLane;

  const { positions, speeds, scales, seeds, heads } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const heads = new Float32Array(count);
    const range = 46;
    let idx = 0;
    for (let l = 0; l < lanes; l++) {
      // each lane is a fixed conduit in the cross-section
      const r = Math.pow(Math.random(), 0.5) * 6.5;
      const ang = Math.random() * Math.PI * 2;
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r * 0.72;
      const speed = 4 + Math.random() * 9;
      const seed = Math.random();
      for (let k = 0; k < perLane; k++) {
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        // evenly spaced beads along the conduit
        positions[idx * 3 + 2] = (k / perLane) * range - range * 0.5 + Math.random() * 0.4;
        speeds[idx] = speed;
        scales[idx] = 1.0 + Math.random() * 1.4;
        seeds[idx] = seed;
        heads[idx] = k === perLane - 1 ? 1 : 0; // lead packet glows
        idx++;
      }
    }
    return { positions, speeds, scales, seeds, heads };
  }, [count, lanes, perLane]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#6b9dff") },
      uColorB: { value: new THREE.Color("#4f8cff") },
    }),
    []
  );

  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.1) * 0.08;
      group.current.rotation.x = s.pointer.y * 0.16;
      group.current.rotation.y = s.pointer.x * 0.16;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
          <bufferAttribute attach="attributes-aHead" args={[heads, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function DataStream3D({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  const tier = useDeviceTier();
  const lanes = tier === "low" ? 140 : tier === "mid" ? 240 : 340;
  const perLane = 22;

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={tier === "low" ? [1, 1.25] : [1, 1.7]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 60, near: 0.1, far: 64 }}
    >
      <fog attach="fog" args={["#050505", 12, 40]} />
      <Stream lanes={lanes} perLane={perLane} />
      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
