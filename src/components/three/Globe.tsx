"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { CITIES } from "@/lib/site";

const R = 2;

function latLonToVec3(lat: number, lon: number, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

const atmoVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmoFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(0.35, 0.55, 1.0, 1.0) * intensity;
  }
`;

function DotSphere() {
  const positions = useMemo(() => {
    const N = 2600;
    const arr = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const y = 1 - t * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      arr[i * 3] = Math.cos(theta) * r * R;
      arr[i * 3 + 1] = y * R;
      arr[i * 3 + 2] = Math.sin(theta) * r * R;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#3f5a9e"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Arc({ from, to, delay }: { from: THREE.Vector3; to: THREE.Vector3; delay: number }) {
  const ref = useRef<THREE.Points>(null);
  const { curve, linePositions } = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const dist = from.distanceTo(to);
    mid.normalize().multiplyScalar(R + dist * 0.55);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const pts = curve.getPoints(48);
    const linePositions = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      linePositions[i * 3] = p.x;
      linePositions[i * 3 + 1] = p.y;
      linePositions[i * 3 + 2] = p.z;
    });
    return { curve, linePositions };
  }, [from, to]);

  const head = useMemo(() => new Float32Array(3), []);

  useFrame((state) => {
    if (ref.current) {
      const t = ((state.clock.elapsedTime * 0.35 + delay) % 1);
      const p = curve.getPoint(t);
      head[0] = p.x;
      head[1] = p.y;
      head[2] = p.z;
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#5b8cff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </line>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[head, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.13}
          color="#9fe8ff"
          transparent
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function CityMarkers({ points }: { points: THREE.Vector3[] }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [points]);
  const ref = useRef<THREE.PointsMaterial>(null);
  useFrame((s) => {
    if (ref.current) ref.current.size = 0.11 + Math.sin(s.clock.elapsedTime * 2) * 0.025;
  });
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={ref}
        size={0.11}
        color="#ffffff"
        transparent
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Named pins anchored to each city. The dot sits exactly on the surface point;
 * `occlude` hides a pin (via the solid inner sphere) once the city rotates to
 * the far hemisphere — so it's always clear which marker is which.
 */
function CityLabels({
  points,
  occluder,
}: {
  points: THREE.Vector3[];
  occluder: RefObject<THREE.Object3D | null>;
}) {
  return (
    <>
      {CITIES.map((c, i) => {
        const p = points[i];
        // tiny outward nudge so the pin reads above the surface, not buried in it
        const anchor = p.clone().multiplyScalar(1.012);
        return (
          <Html
            key={c.name}
            position={[anchor.x, anchor.y, anchor.z]}
            center
            occlude={[occluder] as unknown as RefObject<THREE.Object3D>[]}
            zIndexRange={[30, 0]}
            className="pointer-events-none select-none"
          >
            <div className="relative">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-accent-2 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2 shadow-[0_0_8px_2px_rgba(122,242,224,0.6)]" />
              </span>
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.18em] text-chalk [text-shadow:0_1px_5px_rgba(0,0,0,0.9)]">
                {c.name}
              </span>
            </div>
          </Html>
        );
      })}
    </>
  );
}

function Satellite({ radius, speed, incl, phase }: { radius: number; speed: number; incl: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime * speed + phase;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t) * radius * Math.sin(incl),
        Math.sin(t) * radius * Math.cos(incl)
      );
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color="#7af2e0" />
    </mesh>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const drag = useRef(false);
  const vel = useRef({ x: 0, y: 0 });
  const cityVecs = useMemo(() => CITIES.map((c) => latLonToVec3(c.lat, c.lon)), []);
  const arcs = useMemo(() => {
    const pairs: [number, number][] = [
      [0, 1], [1, 3], [3, 2], [2, 4], [4, 5], [5, 0], [1, 5], [0, 4],
    ];
    return pairs.map(([a, b], i) => ({ from: cityVecs[a], to: cityVecs[b], delay: i * 0.12 }));
  }, [cityVecs]);

  // drag-to-rotate with inertia
  useEffect(() => {
    const el = gl.domElement;
    const down = () => {
      drag.current = true;
      el.style.cursor = "grabbing";
    };
    const up = () => {
      drag.current = false;
      el.style.cursor = "grab";
    };
    const move = (e: PointerEvent) => {
      if (!drag.current || !group.current) return;
      vel.current.y = e.movementX * 0.005;
      vel.current.x = e.movementY * 0.005;
      group.current.rotation.y += vel.current.y;
      group.current.rotation.x = THREE.MathUtils.clamp(
        group.current.rotation.x + vel.current.x,
        -0.8,
        0.8
      );
    };
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    el.addEventListener("pointermove", move);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("pointermove", move);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (drag.current) return; // user is steering
    // inertia
    group.current.rotation.y += vel.current.y;
    group.current.rotation.x = THREE.MathUtils.clamp(
      group.current.rotation.x + vel.current.x,
      -0.8,
      0.8
    );
    vel.current.y *= 0.94;
    vel.current.x *= 0.9;
    // gentle idle spin once inertia fades
    group.current.rotation.y += delta * 0.07 * (1 - Math.min(1, Math.abs(vel.current.y) * 80));
  });

  return (
    <group ref={group}>
      <mesh ref={innerRef}>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color="#070a14" />
      </mesh>
      <DotSphere />
      <CityMarkers points={cityVecs} />
      <CityLabels points={cityVecs} occluder={innerRef} />
      {arcs.map((a, i) => (
        <Arc key={i} from={a.from} to={a.to} delay={a.delay} />
      ))}
      <Satellite radius={R * 1.5} speed={0.4} incl={0.4} phase={0} />
      <Satellite radius={R * 1.7} speed={0.3} incl={-0.7} phase={2} />
      <mesh scale={1.18}>
        <sphereGeometry args={[R, 48, 48]} />
        <shaderMaterial
          vertexShader={atmoVertex}
          fragmentShader={atmoFragment}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function Globe({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.6, 6], fov: 45 }}
    >
      <ambientLight intensity={0.5} />
      <Scene />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
