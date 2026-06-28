"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { ParticlePlanet } from "./ParticlePlanet";
import { Starfield } from "./Starfield";
import { useDeviceTier, type Tier } from "@/hooks/useDeviceTier";

/** Scroll-driven camera dolly + a cinematic fly-in synced to the loader clear. */
function CameraRig({ ready }: { ready: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 15));
  // intro starts far (1) and eases to 0 once `ready` → a dramatic push-in
  const intro = useRef(1);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // hold the camera far until the loader clears, then fly in
    const goal = ready ? 0 : 1;
    intro.current = THREE.MathUtils.damp(intro.current, goal, ready ? 2.4 : 8, dt);

    const max = window.innerHeight;
    const p = Math.min(1, Math.max(0, window.scrollY / max)); // 0..1 over first screen
    const baseZ = 6 - p * 3.4; // 6 -> 2.6 (travel into the field)
    const z = baseZ + intro.current * 9; // +9 farther at arrival, then dollies in

    target.current.set(
      state.pointer.x * 0.4 * (1 - intro.current),
      state.pointer.y * 0.3 * (1 - intro.current),
      z
    );
    camera.position.lerp(target.current, ready ? 0.08 : 0.2);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Effects({ tier }: { tier: Tier }) {
  return (
    <EffectComposer multisampling={tier === "high" ? 4 : 0}>
      <Bloom
        intensity={tier === "low" ? 0.6 : 1.0}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        offset={[0.0006, 0.0009]}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={tier === "low" ? 0 : 0.18}
      />
    </EffectComposer>
  );
}

export default function HeroScene({
  frameloop = "always",
  ready = true,
}: {
  frameloop?: "always" | "never";
  ready?: boolean;
}) {
  const tier = useDeviceTier();
  const planetCount = tier === "low" ? 5500 : tier === "mid" ? 9000 : 15000;
  const starCount = tier === "low" ? 700 : tier === "mid" ? 1300 : 2000;

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={tier === "low" ? [1, 1.25] : [1, 1.8]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 7, 22]} />
      <ambientLight intensity={0.4} />

      <CameraRig ready={ready} />
      <Starfield count={starCount} />
      <ParticlePlanet count={planetCount} radius={2.05} />

      <Effects tier={tier} />
    </Canvas>
  );
}
