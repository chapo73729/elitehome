"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ============================================================
   Ocean — summed Gerstner waves with analytic normals,
   fresnel sky reflection, sun specular + glitter, distance fog
   and a sunrise sky dome.
   ============================================================ */

const oceanVertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;

  // direction.xy, steepness, amplitude, wavelength, speed
  const int N = 4;
  vec4 W[4];
  vec2 D[4];

  void buildWaves() {
    // dir (x,z), steepness Q, amplitude A, wavelength L, speed
    D[0] = normalize(vec2( 1.0,  0.35)); W[0] = vec4(0.55, 0.62, 14.0, 1.1);
    D[1] = normalize(vec2(-0.6,  1.0 )); W[1] = vec4(0.45, 0.40, 8.0,  1.4);
    D[2] = normalize(vec2( 0.9, -0.7 )); W[2] = vec4(0.40, 0.22, 4.5,  1.8);
    D[3] = normalize(vec2(-0.3, -1.0 )); W[3] = vec4(0.30, 0.12, 2.4,  2.4);
  }

  void main() {
    buildWaves();
    vec2 g = position.xy;       // flat grid coordinate
    vec3 disp = vec3(0.0);
    vec3 nrm = vec3(0.0, 0.0, 0.0);
    float nx = 0.0, ny = 0.0, nz = 0.0;

    for (int i = 0; i < N; i++) {
      vec2 d = D[i];
      float Q = W[i].x;
      float A = W[i].y;
      float L = W[i].z;
      float speed = W[i].w;
      float w = 6.2831853 / L;
      float phase = speed * w;
      float f = w * dot(d, g) + uTime * phase;
      float c = cos(f);
      float s = sin(f);
      float WA = w * A;

      disp.x += Q * A * d.x * c;
      disp.y += Q * A * d.y * c; // this is world Z
      disp.z += A * s;           // height

      nx -= d.x * WA * c;
      nz -= d.y * WA * c;
      ny -= Q * WA * s;
    }

    vec3 worldPos = vec3(g.x + disp.x, disp.z, g.y + disp.y);
    vH = disp.z;
    vNormal = normalize(vec3(nx, 1.0 + ny, nz));
    vWorld = worldPos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
  }
`;

const oceanFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uSun;
  uniform vec3 uCam;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSky;
  uniform vec3 uSunColor;
  uniform vec3 uFog;
  uniform float uFogDensity;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCam - vWorld);
    vec3 S = normalize(uSun);

    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    vec3 base = mix(uDeep, uShallow, clamp(vH * 0.6 + 0.5, 0.0, 1.0));
    vec3 col = mix(base, uSky, clamp(fres, 0.0, 1.0));

    // sun specular + broad reflection path leading to the sun + glitter
    vec3 R = reflect(-V, N);
    float sd = max(dot(R, S), 0.0);
    float spec = pow(sd, 240.0) * 2.6;       // tight highlight
    float path = pow(sd, 14.0) * 0.55;        // broad shimmering sun path
    float glint = pow(sd, 40.0) * 0.4;        // sparkle
    col += uSunColor * (spec + path + glint);

    // distance fog toward the horizon
    float dist = length(uCam - vWorld);
    float fog = 1.0 - exp(-uFogDensity * dist);
    col = mix(col, uFog, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const skyFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uHorizon;
  uniform vec3 uZenith;
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  varying vec3 vDir;
  void main() {
    vec3 dir = normalize(vDir);
    float h = clamp(dir.y * 1.4, 0.0, 1.0);
    vec3 sky = mix(uHorizon, uZenith, h);
    float d = max(dot(dir, normalize(uSun)), 0.0);
    sky += uSunColor * pow(d, 220.0) * 2.0;      // sun disc
    sky += uSunColor * pow(d, 8.0) * 0.25;        // halo
    gl_FragColor = vec4(sky, 1.0);
  }
`;

const SUN = new THREE.Vector3(0.0, 0.16, -1.0);

function Water() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSun: { value: SUN.clone() },
      uCam: { value: new THREE.Vector3() },
      uDeep: { value: new THREE.Color("#06182b") },
      uShallow: { value: new THREE.Color("#1d6a96") },
      uSky: { value: new THREE.Color("#86a9cf") },
      uSunColor: { value: new THREE.Color("#ffdca6") },
      uFog: { value: new THREE.Color("#9a8f86") },
      uFogDensity: { value: 0.02 },
    }),
    []
  );

  useFrame((s) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = s.clock.elapsedTime;
      mat.current.uniforms.uCam.value.copy(camera.position);
    }
  });

  return (
    <mesh rotation={[0, 0, 0]}>
      <planeGeometry args={[260, 260, 240, 240]} />
      <shaderMaterial
        ref={mat}
        vertexShader={oceanVertex}
        fragmentShader={oceanFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Sky() {
  const uniforms = useMemo(
    () => ({
      uHorizon: { value: new THREE.Color("#caa67e") },
      uZenith: { value: new THREE.Color("#070b16") },
      uSun: { value: SUN.clone() },
      uSunColor: { value: new THREE.Color("#ffe3bd") },
    }),
    []
  );
  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[200, 32, 32]} />
      <shaderMaterial
        vertexShader={skyVertex}
        fragmentShader={skyFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Rig() {
  const { camera } = useThree();
  useFrame((s) => {
    // gentle drift + mouse parallax, kept low over the water
    const t = s.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.05) * 2 + s.pointer.x * 2.5;
    camera.position.y = 4.4 + Math.sin(t * 0.3) * 0.25 + s.pointer.y * 0.6;
    camera.lookAt(0, 1.2, -26);
  });
  return null;
}

export default function Ocean3D({
  frameloop = "always",
}: {
  frameloop?: "always" | "never";
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={frameloop}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 4.4, 15], fov: 55, near: 0.1, far: 600 }}
    >
      <Sky />
      <Water />
      <Rig />
      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
