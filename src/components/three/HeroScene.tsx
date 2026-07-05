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
import { getJourney } from "@/lib/journey";
import { useDeviceTier, useLite, LITE_FACTOR, type Tier } from "@/hooks/useDeviceTier";

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

    // the shared journey drift: as the page scrolls on, this camera keeps
    // descending in the same direction every other scene continues — one
    // camera passing between rooms
    const j = getJourney();
    target.current.set(
      state.pointer.x * 0.4 * (1 - intro.current),
      state.pointer.y * 0.3 * (1 - intro.current) - j.progress * 2.2,
      z
    );
    camera.position.lerp(target.current, ready ? 0.08 : 0.2);
    camera.lookAt(0, -j.progress * 1.4, 0);
  });

  return null;
}

function Effects({ tier, lite }: { tier: Tier; lite: boolean }) {
  return (
    <EffectComposer multisampling={tier === "high" && !lite ? 4 : 0}>
      <Bloom
        intensity={lite ? 0.55 : tier === "low" ? 0.6 : 1.0}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
      {/* drop the most expensive grain + chromatic passes on lite devices */}
      {lite ? (
        <></>
      ) : (
        <>
          <ChromaticAberration
            offset={[0.0006, 0.0009]}
            radialModulation={false}
            modulationOffset={0}
            blendFunction={BlendFunction.NORMAL}
          />
          <Noise
            premultiply
            blendFunction={BlendFunction.SOFT_LIGHT}
            opacity={tier === "low" ? 0 : 0.18}
          />
        </>
      )}
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
  const lite = useLite();
  const mult = lite ? LITE_FACTOR : 1;
  // keep the planet recognizable — just fewer points and a tighter DPR cap
  const planetCount = Math.round(
    (tier === "low" ? 5500 : tier === "mid" ? 9000 : 15000) * mult
  );
  const starCount = Math.round(
    (tier === "low" ? 700 : tier === "mid" ? 1300 : 2000) * mult
  );

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1] : tier === "low" ? [1, 1.25] : [1, 1.8]}
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

      <Effects tier={tier} lite={lite} />
    </Canvas>
  );
}
