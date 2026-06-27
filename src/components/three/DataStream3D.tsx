"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* A corridor of data flowing toward the camera — for Software & Automation. */

const vertex = /* glsl */ `
  uniform float uTime;
  attribute float aSpeed;
  attribute float aScale;
  varying float vDepth;
  varying float vSeed;
  void main() {
    vec3 p = position;
    float range = 42.0;
    // flow toward the camera, wrapping just before it reaches the lens
    p.z = mod(p.z + uTime * aSpeed, range) - 38.0;
    // subtle lateral sway
    p.x += sin(uTime * 0.5 + p.z * 0.2) * 0.15;
    vDepth = p.z;
    vSeed = aSpeed;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aScale * (120.0 / -mv.z), 1.0, 26.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vDepth;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    // near = bright, far = faint
    float near = smoothstep(-38.0, 4.0, vDepth);
    vec3 col = mix(uColorA, uColorB, fract(vSeed * 3.0));
    a *= 0.15 + near * 0.9;
    gl_FragColor = vec4(col, a);
  }
`;

function Stream({ count = 4200 }: { count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const { positions, speeds, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // bias toward a corridor: ring-ish cross section
      const r = Math.pow(Math.random(), 0.5) * 7;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r * 0.7;
      positions[i * 3 + 2] = Math.random() * 44 - 34;
      speeds[i] = 3 + Math.random() * 9;
      scales[i] = Math.random() * 2 + 0.6;
    }
    return { positions, speeds, scales };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#7af2e0") },
      uColorB: { value: new THREE.Color("#5b8cff") },
    }),
    []
  );

  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.1) * 0.1;
      group.current.rotation.x = s.pointer.y * 0.15;
      group.current.rotation.y = s.pointer.x * 0.15;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
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
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={[1, 1.6]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 62, near: 0.1, far: 60 }}
    >
      <fog attach="fog" args={["#050505", 10, 38]} />
      <Stream count={5200} />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
