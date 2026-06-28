"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useDeviceTier } from "@/hooks/useDeviceTier";

/* ============================================================
   AI Core — a living neural lattice. Round glowing nodes and
   connections that *fire*: a bright signal travels along each
   synapse (custom line shader), not a static web of dots.
   ============================================================ */

const nodeVert = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.65 + 0.35 * sin(uTime * 2.0 + aSeed * 6.2831);
    gl_PointSize = aSize * tw * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const nodeFrag = /* glsl */ `
  precision mediump float;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    vec3 col = mix(vec3(0.32, 0.66, 1.0), vec3(0.85, 0.97, 1.0), vSeed);
    gl_FragColor = vec4(col, pow(core, 1.6));
  }
`;

const edgeVert = /* glsl */ `
  attribute float aLinePos;
  attribute float aSeed;
  attribute float aSpeed;
  varying float vLinePos;
  varying float vSeed;
  varying float vSpeed;
  void main() {
    vLinePos = aLinePos;
    vSeed = aSeed;
    vSpeed = aSpeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const edgeFrag = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  varying float vLinePos;
  varying float vSeed;
  varying float vSpeed;
  void main() {
    float head = fract(uTime * vSpeed + vSeed);
    float d = abs(vLinePos - head);
    d = min(d, 1.0 - d);
    float pulse = smoothstep(0.14, 0.0, d);
    vec3 col = mix(vec3(0.16, 0.33, 0.85), vec3(0.7, 0.97, 1.0), pulse);
    float a = 0.08 + pulse * 0.92;
    gl_FragColor = vec4(col, a);
  }
`;

function Lattice({ nodeCount }: { nodeCount: number }) {
  const group = useRef<THREE.Group>(null);
  const nodeMat = useRef<THREE.ShaderMaterial>(null);
  const edgeMat = useRef<THREE.ShaderMaterial>(null);

  const data = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodeCount; i++) {
      const t = i / nodeCount;
      const y = 1 - t * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      // two shells + jitter for depth
      const shell = i % 3 === 0 ? 1.05 : 1.7;
      const radius = shell + (Math.random() - 0.5) * 0.45;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * r * radius,
          y * radius,
          Math.sin(theta) * r * radius
        )
      );
    }

    const nodePos = new Float32Array(nodeCount * 3);
    const nodeSize = new Float32Array(nodeCount);
    const nodeSeed = new Float32Array(nodeCount);
    pts.forEach((p, i) => {
      nodePos[i * 3] = p.x;
      nodePos[i * 3 + 1] = p.y;
      nodePos[i * 3 + 2] = p.z;
      nodeSize[i] = 0.05 + Math.random() * 0.07;
      nodeSeed[i] = Math.random();
    });

    // connect nearest neighbours
    const ePos: number[] = [];
    const eLine: number[] = [];
    const eSeed: number[] = [];
    const eSpeed: number[] = [];
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
          const a = pts[i];
          const b = pts[j];
          ePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
          eLine.push(0, 1);
          const s = Math.random();
          const sp = 0.25 + Math.random() * 0.7;
          eSeed.push(s, s);
          eSpeed.push(sp, sp);
        }
      }
    }

    return {
      nodePos,
      nodeSize,
      nodeSeed,
      ePos: new Float32Array(ePos),
      eLine: new Float32Array(eLine),
      eSeed: new Float32Array(eSeed),
      eSpeed: new Float32Array(eSpeed),
    };
  }, [nodeCount]);

  const nodeUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const edgeUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    nodeUniforms.uTime.value = t;
    edgeUniforms.uTime.value = t;
    if (group.current) {
      group.current.rotation.y = t * 0.12;
      group.current.rotation.x = Math.sin(t * 0.2) * 0.12 + state.pointer.y * 0.25;
      group.current.rotation.z = state.pointer.x * 0.12;
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.ePos, 3]} />
          <bufferAttribute attach="attributes-aLinePos" args={[data.eLine, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.eSeed, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[data.eSpeed, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={edgeMat}
          vertexShader={edgeVert}
          fragmentShader={edgeFrag}
          uniforms={edgeUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.nodePos, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.nodeSize, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.nodeSeed, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={nodeMat}
          vertexShader={nodeVert}
          fragmentShader={nodeFrag}
          uniforms={nodeUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* layered soft core glow */}
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#9fe0ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshBasicMaterial color="#1b3a7a" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function NeuralCore({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  const tier = useDeviceTier();
  const nodeCount = tier === "low" ? 70 : tier === "mid" ? 110 : 150;

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={tier === "low" ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.2], fov: 50 }}
    >
      <Lattice nodeCount={nodeCount} />
      <EffectComposer>
        <Bloom intensity={1.25} luminanceThreshold={0.08} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
