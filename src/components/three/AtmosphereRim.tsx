"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // back-face fresnel: brightest at the limb, vanishing at the disc centre —
    // reads as scattered atmosphere hugging the planet's silhouette
    float fresnel = pow(1.0 + dot(vView, normalize(vNormal)), 3.4);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;

/**
 * Atmospheric limb glow around the particle planet: a slightly oversized
 * back-side sphere whose alpha is a fresnel term. One draw call; bloom
 * turns the rim into a soft halo. Breathes faintly and dims as the planet
 * disperses on scroll (same uScatter narrative as the particles).
 */
export function AtmosphereRim({ radius = 2.05 }: { radius?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, delta) => {
    if (!matRef.current) return;
    const t = state.clock.elapsedTime;
    const scatter = Math.min(
      1,
      Math.max(0, window.scrollY / (window.innerHeight * 0.9))
    );
    const target = (0.55 + Math.sin(t * 0.6) * 0.06) * (1 - scatter);
    const u = matRef.current.uniforms.uIntensity;
    u.value = THREE.MathUtils.damp(u.value, target, 4, Math.min(delta, 0.05));
  });

  return (
    <mesh scale={radius * 1.22}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{
          uColor: { value: new THREE.Color("#4f8cff") },
          uIntensity: { value: 0 },
        }}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
