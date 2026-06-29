"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { simplexNoise } from "./noise.glsl";
import { useDeviceTier, useLite, type Tier } from "@/hooks/useDeviceTier";

/* ============================================================
   ATMOSPHERE — the persistent, site-wide "world" that sits
   behind every section. Two cheap layers stacked into one
   continuous deep space:

   1. A volumetric azure nebula on a single fullscreen plane.
      Domain-warped fbm (built on the shared simplex noise)
      paints slow-evolving clouds of faint light over near-
      black. The whole field is gated to read as atmosphere,
      never wallpaper: low contrast, heavy vignette, a single
      azure signal. Pointer + scroll bias the warp so the
      world feels alive but never busy.

   2. A sparse field of depth-parallax motes — a few hundred
      points sized by depth that drift, twinkle, and lag
      behind pointer/scroll velocity for real parallax depth.

   Both are additive over the void; bloom blooms only the
   brightest cores so text stays legible above it.
   ============================================================ */

/* ---------- Nebula: fullscreen plane, fbm domain warp ---------- */

const nebulaVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const nebulaFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uPointer;   // -1..1, eased
  uniform float uScroll;    // accumulated scroll offset (eased)
  uniform float uVel;       // scroll velocity magnitude (eased), 0..1
  uniform vec3  uDeep;      // deep azure
  uniform vec3  uGlow;      // bright azure
  uniform float uIntensity;

  ${simplexNoise}

  // fractal brownian motion over the shared 3D simplex noise
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // aspect-correct coords centred on screen
    vec2 uv = vUv;
    vec2 p = (uv - 0.5);
    p.x *= uRes.x / uRes.y;

    // slow time + scroll fold the field through Z so scrolling the page
    // feels like moving through the cloud rather than past a flat image
    float t = uTime * 0.018;
    float z = t + uScroll * 0.12;

    // pointer gently pushes the domain — parallax of the light itself
    vec2 par = uPointer * 0.08;

    // domain warp: sample noise, displace, sample again (the "billowing" look)
    vec3 q = vec3(p * 1.3 + par, z);
    vec3 warp = vec3(
      fbm(q),
      fbm(q + vec3(5.2, 1.3, 0.0)),
      fbm(q + vec3(1.7, 9.2, 0.0))
    );
    vec3 r = vec3(p * 1.3 + warp.xy * 0.55 + par, z * 0.9);
    float clouds = fbm(r);

    // remap to a soft, low-contrast density — most of the screen near-black,
    // but the lit clouds read clearly so the world is the atmosphere itself
    float density = smoothstep(0.05, 0.95, clouds * 0.5 + 0.5);
    density = pow(density, 1.55);

    // a second, larger, slower band of light gives layered depth
    float band = fbm(vec3(p * 0.6 - par * 0.5, z * 0.4 + 11.0));
    band = smoothstep(0.18, 1.0, band * 0.5 + 0.5);

    // a third, fine high-frequency wisp adds filament detail to the clouds
    float wisp = fbm(vec3(p * 3.1 + warp.xy * 0.3, z * 1.4 + 4.0));
    wisp = smoothstep(0.55, 1.0, wisp * 0.5 + 0.5);

    // colour: deep azure in the body, brighter azure in the dense cores
    vec3 col = mix(uDeep, uGlow, smoothstep(0.4, 1.0, density));
    col *= density;
    col += uDeep * band * 0.2;
    col += uGlow * wisp * density * 0.35;

    // soft central glow anchors the composition (the "light in the deep")
    float core = exp(-dot(p, p) * 0.9);
    col += uGlow * core * 0.09;

    // scroll velocity flares the glow a touch — the world reacts to motion
    col += uGlow * density * uVel * 0.12;

    // radial settle into pure void at the edges keeps content legible
    float vig = smoothstep(1.25, 0.25, length(p));
    col *= vig;

    col *= uIntensity;

    // output as additive-friendly colour (alpha carries the blend)
    float a = clamp(max(max(col.r, col.g), col.b) * 2.2, 0.0, 1.0);
    gl_FragColor = vec4(col, a);
  }
`;

function Nebula({
  pointer,
  scroll,
  vel,
  intensity,
}: {
  pointer: MutableRefObject<THREE.Vector2>;
  scroll: MutableRefObject<number>;
  vel: MutableRefObject<number>;
  intensity: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uVel: { value: 0 },
      uDeep: { value: new THREE.Color("#102a66") },
      uGlow: { value: new THREE.Color("#4f8cff") },
      uIntensity: { value: intensity },
    }),
    [intensity]
  );

  const easedPointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
    // ease pointer so the warp glides instead of snapping
    easedPointer.current.lerp(pointer.current, Math.min(1, delta * 2.5));
    u.uPointer.value.copy(easedPointer.current);
    u.uScroll.value = scroll.current;
    u.uVel.value += (vel.current - u.uVel.value) * Math.min(1, delta * 3);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Effects({ tier, lite }: { tier: Tier; lite: boolean }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={lite ? 0.5 : tier === "low" ? 0.6 : 0.85}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.92}
        mipmapBlur
        radius={0.7}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.78} />
    </EffectComposer>
  );
}

export default function AtmosphereScene({
  frameloop = "always",
  pointer,
  scroll,
  vel,
}: {
  frameloop?: "always" | "never";
  pointer: MutableRefObject<THREE.Vector2>;
  scroll: MutableRefObject<number>;
  vel: MutableRefObject<number>;
}) {
  const tier = useDeviceTier();
  const lite = useLite();

  const nebulaIntensity = tier === "low" ? 0.9 : 1.05;

  return (
    <Canvas
      className="!fixed inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1] : tier === "low" ? [1, 1.25] : [1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 60 }}
    >
      <Nebula
        pointer={pointer}
        scroll={scroll}
        vel={vel}
        intensity={nebulaIntensity}
      />
      <Effects tier={tier} lite={lite} />
    </Canvas>
  );
}
