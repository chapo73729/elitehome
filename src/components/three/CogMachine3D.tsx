"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useDeviceTier } from "@/hooks/useDeviceTier";

/* ============================================================
   Industrial — a solid metallic gearbox. Real extruded gear
   teeth, image-based metal reflections (built in-scene from
   lightformers, so no external HDR / CSP-safe), a molten core,
   sparks and bloom. A genuine mechanism, not neon outlines.
   ============================================================ */

/** Extruded gear with trapezoidal teeth and a bored hub. */
function makeGearGeometry(
  teeth: number,
  pitch: number,
  toothDepth: number,
  thickness: number,
  hole: number
) {
  const shape = new THREE.Shape();
  const ro = pitch + toothDepth * 0.5;
  const ri = pitch - toothDepth * 0.5;
  const step = (Math.PI * 2) / teeth;
  let first = true;
  for (let i = 0; i < teeth; i++) {
    const b = i * step;
    const seq: [number, number][] = [
      [ri, b],
      [ri, b + 0.26 * step],
      [ro, b + 0.34 * step],
      [ro, b + 0.66 * step],
      [ri, b + 0.74 * step],
    ];
    for (const [r, a] of seq) {
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (first) {
        shape.moveTo(x, y);
        first = false;
      } else shape.lineTo(x, y);
    }
  }
  shape.closePath();

  const holePath = new THREE.Path();
  holePath.absarc(0, 0, hole, 0, Math.PI * 2, true);
  shape.holes.push(holePath);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 24,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

type GearDef = {
  teeth: number;
  pitch: number;
  toothDepth: number;
  thickness: number;
  hole: number;
  pos: [number, number, number];
  speed: number;
  phase: number;
  hot?: boolean;
};

function Gear({ def }: { def: GearDef }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(
    () =>
      makeGearGeometry(
        def.teeth,
        def.pitch,
        def.toothDepth,
        def.thickness,
        def.hole
      ),
    [def.teeth, def.pitch, def.toothDepth, def.thickness, def.hole]
  );
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * def.speed;
  });
  return (
    <mesh ref={ref} geometry={geo} position={def.pos} rotation={[0, 0, def.phase]}>
      <meshStandardMaterial
        color={def.hot ? "#caa07a" : "#9aa3b2"}
        metalness={0.96}
        roughness={def.hot ? 0.34 : 0.26}
        emissive={def.hot ? "#ff5a1f" : "#0a0e16"}
        emissiveIntensity={def.hot ? 0.55 : 0.2}
        envMapIntensity={1.3}
      />
    </mesh>
  );
}

/** Glowing molten hub at the centre of the main gear. */
function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      const p = 1 + Math.sin(s.clock.elapsedTime * 2.2) * 0.06;
      ref.current.scale.setScalar(p);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.42, 32, 32]} />
      <meshStandardMaterial
        color="#ffb072"
        emissive="#ff5a1f"
        emissiveIntensity={2.4}
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  );
}

function Sparks({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, dirs, speeds, lifes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const dirs: THREE.Vector3[] = [];
    const speeds = new Float32Array(count);
    const lifes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const incl = (Math.random() - 0.5) * 0.8;
      dirs.push(new THREE.Vector3(Math.cos(a), Math.sin(a), incl).normalize());
      speeds[i] = 1.2 + Math.random() * 2.4;
      lifes[i] = Math.random() * 2.6;
    }
    return { positions, dirs, speeds, lifes };
  }, [count]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const arr = (ref.current!.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      const rr = ((t * speeds[i] + lifes[i] * 3) % 3.4);
      arr[i * 3] = dirs[i].x * rr;
      arr[i * 3 + 1] = dirs[i].y * rr;
      arr[i * 3 + 2] = dirs[i].z * rr * 0.6;
    }
    ref.current!.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#ffaa55"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig({ sparks }: { sparks: number }) {
  const group = useRef<THREE.Group>(null);
  // Layered gearbox: gears on slightly staggered planes, counter-rotating with
  // speeds inversely proportional to their teeth (like real meshing gears).
  const gears: GearDef[] = useMemo(
    () => [
      { teeth: 18, pitch: 1.55, toothDepth: 0.42, thickness: 0.5, hole: 0.45, pos: [0, 0, 0], speed: 0.55, phase: 0, hot: true },
      { teeth: 12, pitch: 1.05, toothDepth: 0.4, thickness: 0.42, hole: 0.32, pos: [2.45, 0.35, -0.5], speed: -0.55 * (18 / 12), phase: 0.26 },
      { teeth: 15, pitch: 1.3, toothDepth: 0.4, thickness: 0.46, hole: 0.4, pos: [-1.95, -1.7, -0.95], speed: -0.55 * (18 / 15), phase: 0.1 },
      { teeth: 9, pitch: 0.8, toothDepth: 0.36, thickness: 0.38, hole: 0.24, pos: [1.5, -2.2, -1.4], speed: 0.55 * (18 / 9), phase: 0.4 },
      { teeth: 24, pitch: 2.0, toothDepth: 0.44, thickness: 0.4, hole: 0.6, pos: [-2.6, 1.9, -1.9], speed: -0.34, phase: 0.15 },
    ],
    []
  );

  useFrame((s) => {
    if (!group.current) return;
    group.current.rotation.y = -0.35 + s.pointer.x * 0.4;
    group.current.rotation.x = -0.28 + s.pointer.y * 0.25;
  });

  return (
    <group ref={group}>
      <Core />
      {gears.map((g, i) => (
        <Gear key={i} def={g} />
      ))}
      <Sparks count={sparks} />
    </group>
  );
}

export default function CogMachine3D({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  const tier = useDeviceTier();
  const sparks = tier === "low" ? 120 : tier === "mid" ? 260 : 420;

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={tier === "low" ? [1, 1.25] : [1, 1.7]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8.5], fov: 48 }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#cfe0ff" />
      <directionalLight position={[-5, -2, 2]} intensity={0.5} color="#ff7a3a" />
      <pointLight position={[0, 0, 1]} intensity={2.2} color="#ff6a2a" distance={6} />

      <Rig sparks={sparks} />

      {/* in-scene studio reflections for the metal — no external HDR */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} position={[0, 3, 2]} scale={[6, 3, 1]} color="#bcd2ff" />
        <Lightformer intensity={1.6} position={[-4, -1, 1]} scale={[3, 6, 1]} color="#ffffff" />
        <Lightformer intensity={2.6} position={[4, -2, 1]} scale={[2, 4, 1]} color="#ff8a4a" />
        <Lightformer intensity={1.2} position={[0, -4, -2]} scale={[6, 2, 1]} color="#3a5cff" />
      </Environment>

      <EffectComposer>
        <Bloom intensity={1.0} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
