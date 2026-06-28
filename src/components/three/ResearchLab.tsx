"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ---- holographic panel material (grid + scanline) ---- */
const panelVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const panelFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    // grid
    vec2 g = abs(fract(vUv * 8.0 - 0.5) - 0.5) / fwidth(vUv * 8.0);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    // moving scanline
    float scan = smoothstep(0.0, 0.02, abs(fract(vUv.y - uTime * 0.15) - 0.5) - 0.46);
    // border
    float b = step(vUv.x, 0.012) + step(0.988, vUv.x) + step(vUv.y, 0.012) + step(0.988, vUv.y);
    float a = line * 0.25 + (1.0 - scan) * 0.25 + b * 0.6;
    a *= 0.5 + 0.5 * sin(uTime + vUv.y * 6.0);
    gl_FragColor = vec4(uColor, clamp(a, 0.0, 0.85) * 0.6);
  }
`;

function HoloPanel({
  position,
  rotation,
  scale = 1,
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  color: string;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }),
    [color]
  );
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[1.7, 1.1, 1, 1]} />
        <shaderMaterial
          ref={mat}
          vertexShader={panelVertex}
          fragmentShader={panelFragment}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Float>
  );
}

function Core() {
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);
  useFrame((s, dt) => {
    if (inner.current) {
      inner.current.rotation.x += dt * 0.3;
      inner.current.rotation.y += dt * 0.42;
      const p = 1 + Math.sin(s.clock.elapsedTime * 1.4) * 0.06;
      inner.current.scale.setScalar(p);
    }
    if (outer.current) {
      outer.current.rotation.y -= dt * 0.16;
      outer.current.rotation.z += dt * 0.1;
    }
  });
  return (
    <group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#9fe8ff" wireframe transparent opacity={0.9} />
      </mesh>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#5b8cff" wireframe transparent opacity={0.3} />
      </mesh>
      {/* layered energy nucleus — bright cyan-white core in a soft blue halo */}
      <mesh>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial color="#e6f5ff" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#7ab8ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color="#2a4a8f" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OrbitingNodes({ count = 40 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const orbits = Array.from({ length: count }, () => ({
      r: 2.2 + Math.random() * 2.2,
      speed: (Math.random() - 0.5) * 0.6,
      incl: (Math.random() - 0.5) * Math.PI,
      phase: Math.random() * Math.PI * 2,
    }));
    return { arr, orbits };
  }, [count]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const o = data.orbits[i];
      const a = t * o.speed + o.phase;
      data.arr[i * 3] = Math.cos(a) * o.r;
      data.arr[i * 3 + 1] = Math.sin(a) * o.r * Math.sin(o.incl);
      data.arr[i * 3 + 2] = Math.sin(a) * o.r * Math.cos(o.incl);
    }
    if (ref.current) ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.arr, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#7af2e0"
        transparent
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.1) * 0.4 + s.pointer.x * 0.3;
      group.current.rotation.x = s.pointer.y * 0.2;
    }
  });
  return (
    <group ref={group}>
      <Core />
      <OrbitingNodes />
      <HoloPanel position={[2.6, 0.8, -0.5]} rotation={[0, -0.5, 0.05]} color="#5b8cff" />
      <HoloPanel position={[-2.7, -0.4, 0.3]} rotation={[0, 0.6, -0.05]} color="#7af2e0" scale={0.85} />
      <HoloPanel position={[1.4, -1.6, 1]} rotation={[0.2, -0.3, 0]} color="#b98cff" scale={0.7} />
      <HoloPanel position={[-1.6, 1.7, -0.8]} rotation={[-0.15, 0.4, 0.05]} color="#9fe8ff" scale={0.75} />
    </group>
  );
}

export default function ResearchLab({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.5, 7], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      <Rig />
      <EffectComposer>
        <Bloom intensity={0.95} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
