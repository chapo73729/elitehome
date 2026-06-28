"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { simplexNoise } from "./noise.glsl";
import { useDeviceTier, useLite, LITE_FACTOR } from "@/hooks/useDeviceTier";

/* ============================================================
   AI Core — a curl-noise flow field. Thousands of particles
   are advected through a turbulent vector field (the curl of
   simplex noise), giving a living, swirling intelligence that
   reacts to the cursor. The award-winning "organic GPU" look.
   ============================================================ */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uFreq;
  uniform float uStep;
  uniform float uDrift;
  uniform vec3 uMouse;
  uniform float uMouseForce;
  attribute float aSeed;
  attribute float aScale;
  varying float vLife;
  varying float vSpeed;
  varying float vCore;

  ${simplexNoise}

  vec3 snoiseVec3(vec3 x){
    return vec3(
      snoise(x),
      snoise(x + vec3(31.4, 12.7, 4.3)),
      snoise(x + vec3(7.1, 23.9, 49.2))
    );
  }

  vec3 curl(vec3 p){
    const float e = 0.12;
    vec3 dx = vec3(e,0.0,0.0), dy = vec3(0.0,e,0.0), dz = vec3(0.0,0.0,e);
    vec3 px0 = snoiseVec3(p-dx), px1 = snoiseVec3(p+dx);
    vec3 py0 = snoiseVec3(p-dy), py1 = snoiseVec3(p+dy);
    vec3 pz0 = snoiseVec3(p-dz), pz1 = snoiseVec3(p+dz);
    float x = (py1.z-py0.z) - (pz1.y-pz0.y);
    float y = (pz1.x-pz0.x) - (px1.z-px0.z);
    float z = (px1.y-px0.y) - (py1.x-py0.x);
    return normalize(vec3(x,y,z) / (2.0*e) + 1e-6);
  }

  void main(){
    // looping life, staggered per particle
    float life = fract(uTime * uSpeed + aSeed);
    vLife = life;
    // brighter toward the dense core
    vCore = 1.0 - clamp(length(position) / 1.5, 0.0, 1.0);

    vec3 pos = position;
    vec3 vel = vec3(0.0);
    // advect along the curl field — each step re-samples for curved paths
    for (int i = 0; i < 4; i++){
      vel = curl(pos * uFreq + vec3(0.0, 0.0, uTime * uDrift));
      pos += vel * uStep * life;
    }
    vSpeed = length(vel);

    // cursor force — particles flow away from the pointer
    vec3 toM = pos - uMouse;
    float d = length(toM);
    pos += normalize(toM + 1e-5) * smoothstep(1.6, 0.0, d) * uMouseForce;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (300.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vLife;
  varying float vSpeed;
  varying float vCore;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    // fade in/out across the particle's life so the loop reset is invisible
    float fade = sin(vLife * 3.14159);
    vec3 col = mix(uColorA, uColorB, clamp(vSpeed * 0.6, 0.0, 1.0));
    col = mix(col, vec3(0.95, 0.99, 1.0), vCore * 0.7); // hot white core
    float a = pow(core, 1.4) * fade * (0.55 + vCore * 1.1);
    gl_FragColor = vec4(col, a);
  }
`;

function Flow({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector3(0, 0, 0));

  const { positions, seeds, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // bias toward the centre (pow > 1) for a dense glowing core
      const r = Math.pow(Math.random(), 0.8) * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random();
      scales[i] = 0.05 + Math.random() * 0.08;
    }
    return { positions, seeds, scales };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 0.07 },
      uFreq: { value: 0.6 },
      uStep: { value: 0.12 },
      uDrift: { value: 0.05 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uMouseForce: { value: 0.7 },
      uColorA: { value: new THREE.Color("#2f6bff") },
      uColorB: { value: new THREE.Color("#bcd6ff") },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (mat.current) {
      mat.current.uniforms.uTime.value = t;
      const px = (state.pointer.x * viewport.width) / 2;
      const py = (state.pointer.y * viewport.height) / 2;
      mouse.current.set(px * 0.9, py * 0.9, 0);
      mat.current.uniforms.uMouse.value.lerp(mouse.current, 0.1);
    }
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
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
  );
}

export default function NeuralFlow({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  const tier = useDeviceTier();
  const lite = useLite();
  const mult = lite ? LITE_FACTOR : 1;
  // keep the AI core recognizable — fewer particles, same shape
  const count = Math.round(
    (tier === "low" ? 4000 : tier === "mid" ? 9000 : 16000) * mult
  );

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1] : tier === "low" ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.4], fov: 50 }}
    >
      <Flow count={count} />
      <EffectComposer>
        <Bloom
          intensity={lite ? 0.7 : 1.05}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
