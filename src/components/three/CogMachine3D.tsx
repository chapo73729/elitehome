"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* Concentric glowing cog rings + sparks — for Industrial Services. */

function gearPositions(radius: number, teeth: number, toothH: number) {
  const seg = teeth * 2;
  const arr = new Float32Array((seg + 1) * 3);
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const r = radius + (i % 2 === 0 ? 0 : toothH);
    arr[i * 3] = Math.cos(a) * r;
    arr[i * 3 + 1] = Math.sin(a) * r;
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

function Gear({
  radius,
  teeth,
  toothH,
  color,
  speed,
  tilt,
  z,
  opacity = 0.8,
}: {
  radius: number;
  teeth: number;
  toothH: number;
  color: string;
  speed: number;
  tilt: number;
  z: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.LineLoop>(null);
  const pos = useMemo(() => gearPositions(radius, teeth, toothH), [radius, teeth, toothH]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <lineLoop ref={ref} rotation={[tilt, 0, 0]} position={[0, 0, z]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineLoop>
  );
}

function Sparks({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { dirs, positions, speeds } = useMemo(() => {
    const dirs: THREE.Vector3[] = [];
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const incl = (Math.random() - 0.5) * 0.6;
      dirs.push(new THREE.Vector3(Math.cos(a), Math.sin(a), incl).normalize());
      speeds[i] = 0.6 + Math.random() * 1.6;
    }
    return { dirs, positions, speeds };
  }, [count]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const arr = (ref.current!.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      const rr = ((t * speeds[i]) % 3.2);
      arr[i * 3] = dirs[i].x * rr;
      arr[i * 3 + 1] = dirs[i].y * rr;
      arr[i * 3 + 2] = dirs[i].z * rr;
    }
    ref.current!.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat as any}
        size={0.05}
        color="#ffb15b"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.4;
      ref.current.rotation.y += dt * 0.5;
    }
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial color="#ff8c4a" wireframe transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshBasicMaterial color="#ffe1c2" />
      </mesh>
    </group>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (group.current) {
      group.current.rotation.y = s.pointer.x * 0.4 + Math.sin(s.clock.elapsedTime * 0.1) * 0.2;
      group.current.rotation.x = s.pointer.y * 0.25;
    }
  });
  return (
    <group ref={group}>
      <Core />
      <Sparks />
      <Gear radius={1.3} teeth={20} toothH={0.18} color="#ff8c4a" speed={0.5} tilt={0} z={0} opacity={0.9} />
      <Gear radius={2.1} teeth={32} toothH={0.22} color="#ff7a3a" speed={-0.34} tilt={0.25} z={-0.4} opacity={0.6} />
      <Gear radius={3.0} teeth={48} toothH={0.26} color="#ffae6b" speed={0.22} tilt={-0.4} z={-0.9} opacity={0.4} />
      <Gear radius={3.8} teeth={64} toothH={0.2} color="#5b8cff" speed={-0.15} tilt={0.6} z={-1.6} opacity={0.25} />
    </group>
  );
}

export default function CogMachine3D({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      <ambientLight intensity={0.6} />
      <Rig />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.12} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
