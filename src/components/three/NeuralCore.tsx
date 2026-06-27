"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function Neurons({ nodeCount = 90 }: { nodeCount?: number }) {
  const group = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulseRef = useRef<THREE.Points>(null);

  const { nodePositions, linePositions, pulseData, basePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodeCount; i++) {
      const t = i / nodeCount;
      const y = 1 - t * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const radius = 1.6 + (Math.random() - 0.5) * 0.5;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * r * radius,
          y * radius,
          Math.sin(theta) * r * radius
        )
      );
    }

    const nodePositions = new Float32Array(nodeCount * 3);
    pts.forEach((p, i) => {
      nodePositions[i * 3] = p.x;
      nodePositions[i * 3 + 1] = p.y;
      nodePositions[i * 3 + 2] = p.z;
    });

    // connect each node to its nearest neighbours
    const segs: number[] = [];
    const pulses: { a: number; b: number; speed: number; off: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;
        dists.push({ j, d: pts[i].distanceTo(pts[j]) });
      }
      dists.sort((a, b) => a.d - b.d);
      const links = 2 + Math.floor(Math.random() * 2);
      for (let k = 0; k < links; k++) {
        const j = dists[k].j;
        if (j > i) {
          segs.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          pulses.push({ a: i, b: j, speed: 0.3 + Math.random() * 0.7, off: Math.random() });
        }
      }
    }

    const pulseData = new Float32Array(pulses.length * 3);
    return {
      nodePositions,
      basePositions: nodePositions.slice(),
      linePositions: new Float32Array(segs),
      pulseData: { array: pulseData, pulses, pts },
    };
  }, [nodeCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.12;
      group.current.rotation.x =
        Math.sin(t * 0.2) * 0.15 + state.pointer.y * 0.25;
      group.current.rotation.z = state.pointer.x * 0.12;
    }

    // node breathing
    if (nodesRef.current) {
      const arr = (nodesRef.current.geometry.attributes.position as THREE.BufferAttribute)
        .array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const pulse = 1 + Math.sin(t * 1.5 + i) * 0.012;
        arr[i] = basePositions[i] * pulse;
        arr[i + 1] = basePositions[i + 1] * pulse;
        arr[i + 2] = basePositions[i + 2] * pulse;
      }
      nodesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // signal pulses travelling along edges
    if (pulseRef.current) {
      const { array, pulses, pts } = pulseData;
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        const tt = (t * p.speed + p.off) % 1;
        const a = pts[p.a];
        const b = pts[p.b];
        array[i * 3] = a.x + (b.x - a.x) * tt;
        array[i * 3 + 1] = a.y + (b.y - a.y) * tt;
        array[i * 3 + 2] = a.z + (b.z - a.z) * tt;
      }
      pulseRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#9fe8ff"
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3a6bd6"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={pulseRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulseData.array, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          color="#ffffff"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function NeuralCore() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.2], fov: 50 }}
    >
      <ambientLight intensity={0.6} />
      <Neurons nodeCount={92} />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
