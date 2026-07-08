"use client";

import { useMemo, useRef } from "react";
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
import { useDeviceTier, useLite, LITE_FACTOR, type Tier } from "@/hooks/useDeviceTier";

/* ============================================================
   CyberShield — the Three.js defence-dome centrepiece. A real WebGL
   scene: a holographic icosphere shield (custom fresnel + grid +
   scan shader), an emissive 3D padlock core, and a GPU stream of
   red "threat" particles that accelerate inward and are absorbed at
   the shield surface. A shared `ctrl` ref (written by the section's
   narration timeline) raises an alert tint during RESPOND and fires
   an all-clear brightness pulse on SECURED. Cinematic postprocessing
   (bloom, chromatic aberration, vignette, grain), pointer parallax.
   Mounts only when visible; pauses offscreen. Falls back to the 2D
   CyberDefense via SceneBoundary if WebGL is lost.
   ============================================================ */

export type ShieldCtrl = { alert: number; pulse: number };

const SHIELD_R = 2.0;

/* ---------- shield shader ---------- */
const shieldVert = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  varying vec3 vN;
  varying vec3 vPos;
  varying vec3 vView;
  void main() {
    vN = normalize(normalMatrix * normal);
    vec3 p = position;
    float wave = sin(position.y * 4.0 - uTime * 1.5) * 0.02;
    p += normal * (wave + uPulse * 0.05 * sin(uTime * 18.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;
const shieldFrag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uAlert;
  uniform float uPulse;
  uniform vec3 uColor;
  uniform vec3 uAlertColor;
  varying vec3 vN;
  varying vec3 vPos;
  varying vec3 vView;
  void main() {
    float fres = pow(1.0 - max(dot(normalize(vN), normalize(vView)), 0.0), 2.4);
    vec3 s = normalize(vPos);
    float lat = asin(clamp(s.y, -1.0, 1.0));
    float lon = atan(s.z, s.x);
    // lat/long hologram grid
    float g = 0.0;
    g += smoothstep(0.92, 1.0, abs(sin(lat * 9.0)));
    g += smoothstep(0.92, 1.0, abs(sin(lon * 8.0)));
    // scan band rising
    float band = fract(s.y * 0.5 - uTime * 0.12);
    float scan = smoothstep(0.5, 0.46, abs(band - 0.5));
    vec3 col = mix(uColor, uAlertColor, uAlert);
    // keep the dome see-through: strong at the rim (fresnel), faint across the
    // face — so the grid + the lock inside stay legible, hologram not orb.
    float alpha = fres * 0.5 + g * 0.14 + scan * 0.2 + uPulse * 0.25;
    alpha = clamp(alpha, 0.0, 0.85);
    vec3 outc = col * (0.7 + fres * 1.2 + uPulse * 0.9 + scan * 0.5);
    gl_FragColor = vec4(outc, alpha);
  }
`;

function Shield({ ctrl }: { ctrl: React.RefObject<ShieldCtrl> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAlert: { value: 0 },
      uPulse: { value: 0 },
      uColor: { value: new THREE.Color("#4f8cff") },
      uAlertColor: { value: new THREE.Color("#ff4a4a") },
    }),
    []
  );
  const geo = useMemo(() => new THREE.IcosahedronGeometry(SHIELD_R, 6), []);
  const wire = useMemo(() => new THREE.IcosahedronGeometry(SHIELD_R * 1.001, 3), []);

  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    const c = ctrl.current;
    if (c) {
      m.uniforms.uAlert.value += (c.alert - m.uniforms.uAlert.value) * 0.06;
      m.uniforms.uPulse.value += (c.pulse - m.uniforms.uPulse.value) * 0.12;
    }
  });

  return (
    <group>
      <mesh geometry={geo}>
        <shaderMaterial
          ref={matRef}
          vertexShader={shieldVert}
          fragmentShader={shieldFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.NormalBlending}
        />
      </mesh>
      {/* faint structural wireframe */}
      <mesh geometry={wire}>
        <meshBasicMaterial
          color="#4f8cff"
          wireframe
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ---------- 3D padlock core ---------- */
function LockCore({ ctrl }: { ctrl: React.RefObject<ShieldCtrl> }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  const bodyGeo = useMemo(() => {
    const w = 1.05;
    const h = 0.82;
    const r = 0.2;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
    shape.lineTo(w / 2, h / 2 - r);
    shape.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2, false);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI, false);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5, false);
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelSize: 0.03,
      bevelThickness: 0.03,
      bevelSegments: 2,
      curveSegments: 12,
    });
    g.center();
    return g;
  }, []);
  const shackleGeo = useMemo(() => new THREE.TorusGeometry(0.4, 0.085, 14, 44, Math.PI), []);
  const legGeo = useMemo(() => new THREE.CylinderGeometry(0.085, 0.085, 0.42, 14), []);
  const keyGeo = useMemo(() => new THREE.SphereGeometry(0.1, 18, 18), []);

  useFrame((state) => {
    const c = ctrl.current;
    const glow = 0.85 + (c ? c.alert * 0.35 + c.pulse * 0.9 : 0) + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    if (matRef.current) matRef.current.emissiveIntensity = glow;
    if (groupRef.current) groupRef.current.position.y = 0.05 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
  });

  return (
    <group ref={groupRef} scale={0.92}>
      <mesh geometry={bodyGeo} position={[0, -0.1, 0]}>
        <meshStandardMaterial
          ref={matRef}
          color="#0b1424"
          emissive="#4f8cff"
          emissiveIntensity={1.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh geometry={shackleGeo} position={[0, 0.46, 0]} material-color="#0b1424">
        <meshStandardMaterial color="#122036" emissive="#6ea0ff" emissiveIntensity={1.1} metalness={0.6} roughness={0.28} />
      </mesh>
      <mesh geometry={legGeo} position={[-0.4, 0.28, 0]}>
        <meshStandardMaterial color="#122036" emissive="#6ea0ff" emissiveIntensity={1.1} metalness={0.6} roughness={0.28} />
      </mesh>
      <mesh geometry={legGeo} position={[0.4, 0.28, 0]}>
        <meshStandardMaterial color="#122036" emissive="#6ea0ff" emissiveIntensity={1.1} metalness={0.6} roughness={0.28} />
      </mesh>
      {/* keyhole glow */}
      <mesh geometry={keyGeo} position={[0, -0.12, 0.2]}>
        <meshStandardMaterial color="#bcd6ff" emissive="#bcd6ff" emissiveIntensity={2.2} />
      </mesh>
    </group>
  );
}

/* ---------- GPU threat stream ---------- */
const threatVert = /* glsl */ `
  uniform float uTime;
  attribute vec3 aDir;
  attribute float aPhase;
  attribute float aSpeed;
  varying float vAlpha;
  void main() {
    float prog = fract(uTime * aSpeed + aPhase);
    float e = prog * prog;               // accelerate inward
    float r = mix(4.7, ${SHIELD_R.toFixed(1)}, e);
    vec3 p = aDir * r;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float appear = smoothstep(4.7, 4.2, r);
    float absorb = smoothstep(${(SHIELD_R + 0.12).toFixed(2)}, ${SHIELD_R.toFixed(1)}, r);
    vAlpha = appear * (1.0 - absorb);
    gl_PointSize = clamp((2.0 + e * 7.0) * (1.0 / -mv.z) * 90.0, 1.5, 11.0);
  }
`;
const threatFrag = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vAlpha * 0.8;
    vec3 col = mix(vec3(1.0, 0.5, 0.5), vec3(0.95, 0.25, 0.25), d * 2.0);
    gl_FragColor = vec4(col, a);
  }
`;

function Threats({ count }: { count: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { dirs, phases, speeds } = useMemo(() => {
    const dirs = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      dirs[i * 3] = r * Math.cos(th);
      dirs[i * 3 + 1] = u * 0.85;
      dirs[i * 3 + 2] = r * Math.sin(th);
      phases[i] = Math.random();
      speeds[i] = 0.06 + Math.random() * 0.12;
    }
    return { dirs, phases, speeds };
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(count * 3), 3]} />
        <bufferAttribute attach="attributes-aDir" args={[dirs, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={threatVert}
        fragmentShader={threatFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- rig: slow spin + pointer parallax ---------- */
function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!g.current) return;
    g.current.rotation.y += delta * 0.12;
    const tx = -state.pointer.y * 0.18;
    const tz = state.pointer.x * 0.18;
    g.current.rotation.x += (tx - g.current.rotation.x) * 0.04;
    g.current.rotation.z += (tz - g.current.rotation.z) * 0.04;
  });
  return <group ref={g}>{children}</group>;
}

function Effects({ tier, lite }: { tier: Tier; lite: boolean }) {
  return (
    <EffectComposer multisampling={tier === "high" && !lite ? 4 : 0}>
      <Bloom intensity={lite ? 0.6 : 0.85} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
      <Vignette eskil={false} offset={0.22} darkness={0.82} />
      {lite ? (
        <></>
      ) : (
        <>
          <ChromaticAberration offset={[0.0006, 0.0009]} radialModulation={false} modulationOffset={0} blendFunction={BlendFunction.NORMAL} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={tier === "low" ? 0 : 0.16} />
        </>
      )}
    </EffectComposer>
  );
}

export default function CyberShield({
  frameloop = "always",
  ctrl,
}: {
  frameloop?: "always" | "never";
  ctrl: React.RefObject<ShieldCtrl>;
}) {
  const tier = useDeviceTier();
  const lite = useLite();
  const mult = lite ? LITE_FACTOR : 1;
  const threatCount = Math.round((tier === "low" ? 900 : tier === "mid" ? 1600 : 2400) * mult);

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={lite ? [1, 1] : tier === "low" ? [1, 1.25] : [1, 1.8]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: true }}
      camera={{ position: [0, 0.2, 5.4], fov: 46, near: 0.1, far: 100 }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 4, 5]} intensity={40} color="#8fb4ff" />
      <pointLight position={[-4, -2, 2]} intensity={16} color="#4f8cff" />
      {/* shield + threats spin in space; the lock stays facing the camera */}
      <Rig>
        <Shield ctrl={ctrl} />
        <Threats count={threatCount} />
      </Rig>
      <LockCore ctrl={ctrl} />
      <Effects tier={tier} lite={lite} />
    </Canvas>
  );
}
