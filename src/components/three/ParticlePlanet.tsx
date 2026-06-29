"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { simplexNoise } from "./noise.glsl";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform vec3 uMouse;
  uniform float uScroll;
  uniform float uVel;   // eased scroll velocity, 0..1 — energizes the core
  attribute float aScale;
  attribute float aType; // 0 = surface, 1 = data ring
  varying float vNoise;
  varying float vType;

  ${simplexNoise}

  void main() {
    vType = aType;
    vec3 p = position;

    // organic breathing displacement along the normal
    vec3 dir = normalize(p);
    float n = snoise(dir * 1.8 + uTime * 0.12);
    float n2 = snoise(dir * 4.0 - uTime * 0.18);
    float disp = n * 0.16 + n2 * 0.05;

    // breathing pulse
    float breathe = sin(uTime * 0.6) * 0.04;
    p += dir * (disp + breathe);

    // mouse ripple — particles near the projected cursor swell outward
    float md = distance(dir, normalize(uMouse + vec3(0.0001)));
    float ripple = smoothstep(1.1, 0.0, md) * 0.28;
    p += dir * ripple;

    // scroll velocity energizes the whole core: it breathes outward and the
    // surface ripples with a travelling wave, so scrolling feels tactile
    float vwave = sin(dir.y * 6.0 - uTime * 3.0) * 0.5 + 0.5;
    p += dir * uVel * (0.18 + vwave * 0.16);

    vNoise = disp + ripple + uVel * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * aScale * (1.0 + ripple * 2.0 + uVel * 0.7);
    if (aType > 0.5) size *= 1.3; // data particles a touch brighter
    // clamp so near particles stay crisp points, not giant blurry discs
    gl_PointSize = clamp(size * (1.0 / -mv.z), 1.0, 13.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying float vNoise;
  varying float vType;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    // tighter core for a crisp particle rather than a soft bokeh disc
    float alpha = smoothstep(0.5, 0.12, d);

    vec3 col = mix(uColorA, uColorB, smoothstep(-0.1, 0.25, vNoise));
    col = mix(col, uColorC, smoothstep(0.15, 0.4, vNoise));
    if (vType > 0.5) col = uColorC;

    // soft core glow
    alpha *= 0.5 + vNoise * 1.2;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function ParticlePlanet({
  count = 14000,
  radius = 2.1,
}: {
  count?: number;
  radius?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector3(0, 0, 1));
  const vel = useRef(0);

  const { positions, scales, types } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const types = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));

    const surfaceCount = Math.floor(count * 0.82);
    for (let i = 0; i < count; i++) {
      if (i < surfaceCount) {
        // fibonacci sphere — even surface distribution
        const t = i / surfaceCount;
        const y = 1 - t * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        positions[i * 3] = Math.cos(theta) * r * radius;
        positions[i * 3 + 1] = y * radius;
        positions[i * 3 + 2] = Math.sin(theta) * r * radius;
        scales[i] = Math.random() * 1.4 + 0.5;
        types[i] = 0;
      } else {
        // orbiting "data" rings at varied inclinations
        const ring = Math.random();
        const ang = Math.random() * Math.PI * 2;
        const rr = radius * (1.18 + ring * 0.5);
        const incl = (Math.random() - 0.5) * 1.4;
        positions[i * 3] = Math.cos(ang) * rr;
        positions[i * 3 + 1] = Math.sin(ang) * rr * Math.sin(incl);
        positions[i * 3 + 2] = Math.sin(ang) * rr * Math.cos(incl);
        scales[i] = Math.random() * 1.2 + 0.8;
        types[i] = 1;
      }
    }
    return { positions, scales, types };
  }, [count, radius]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 22 },
      uScroll: { value: 0 },
      uVel: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 1) },
      uColorA: { value: new THREE.Color("#2a4a8f") },
      uColorB: { value: new THREE.Color("#4f8cff") },
      uColorC: { value: new THREE.Color("#bcd6ff") },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      // project pointer onto a unit sphere-ish direction
      const px = (state.pointer.x * viewport.width) / 2;
      const py = (state.pointer.y * viewport.height) / 2;
      mouse.current.set(px, py, 1.5).normalize();
      matRef.current.uniforms.uMouse.value.lerp(mouse.current, 0.08);

      // scroll velocity (via Lenis, smoothed) energizes the core as you scroll
      const lenis = (window as unknown as { __lenis?: { velocity: number } }).__lenis;
      const raw = lenis ? Math.abs(lenis.velocity) : 0;
      const targetVel = Math.min(1, raw * 0.025);
      vel.current += (targetVel - vel.current) * 0.08;
      matRef.current.uniforms.uVel.value = vel.current;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.045;
      // gentle parallax tilt toward pointer
      pointsRef.current.rotation.x +=
        (state.pointer.y * 0.25 - pointsRef.current.rotation.x) * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aType" args={[types, 1]} />
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
