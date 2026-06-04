'use client';
// src/components/three/HeroExperience.tsx
// Three.js particle galaxy with photo clusters, depth fog, light shafts

import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Stars, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useEmonoStore, selectCameraSettings } from '@/store/emonoStore';

// ── Category cluster definitions ──────────────────────────
const CLUSTERS = [
  { id: 'automotive',   color: '#FF8A00', position: [-8,  3,  -8] as const, count: 1400 },
  { id: 'architecture', color: '#4488FF', position: [ 8,  2, -10] as const, count: 1200 },
  { id: 'street',       color: '#FF6644', position: [-6, -4, -12] as const, count: 1000 },
  { id: 'macro',        color: '#44DD88', position: [ 7, -3, -14] as const, count:  800 },
  { id: 'portrait',     color: '#AA44FF', position: [ 0,  7, -16] as const, count:  800 },
  { id: 'drift',        color: '#FF2244', position: [-2, -6,  -6] as const, count:  600 },
] as const;

// ── Galaxy particle system ─────────────────────────────────
function GalaxyParticles() {
  const meshRef = useRef<THREE.Points>(null!);
  const { viewport } = useThree();
  const { currentAperture, nightDriveMode, universeMode } = useEmonoStore();
  const phase = useRef(0);

  const [positions, colors, sizes] = useMemo(() => {
    const TOTAL = 10000;
    const positions = new Float32Array(TOTAL * 3);
    const colors    = new Float32Array(TOTAL * 3);
    const sizes     = new Float32Array(TOTAL);

    let idx = 0;

    // Fill cluster-based particles
    CLUSTERS.forEach(({ color, position, count }) => {
      const c = new THREE.Color(color);
      for (let i = 0; i < count && idx < TOTAL; i++, idx++) {
        const r     = (Math.cbrt(Math.random()) * 4);
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        positions[idx * 3]     = position[0] + r * Math.sin(phi) * Math.cos(theta);
        positions[idx * 3 + 1] = position[1] + r * Math.sin(phi) * Math.sin(theta);
        positions[idx * 3 + 2] = position[2] + r * Math.cos(phi);
        const lum = 0.4 + Math.random() * 0.6;
        colors[idx * 3]     = c.r * lum;
        colors[idx * 3 + 1] = c.g * lum;
        colors[idx * 3 + 2] = c.b * lum;
        sizes[idx] = Math.random() * 3 + 0.5;
      }
    });

    // Fill remaining with ambient white/dim particles
    while (idx < TOTAL) {
      const spread = 40;
      positions[idx * 3]     = (Math.random() - 0.5) * spread;
      positions[idx * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[idx * 3 + 2] = (Math.random() - 0.5) * spread - 20;
      const lum = Math.random() * 0.3;
      colors[idx * 3] = colors[idx * 3 + 1] = colors[idx * 3 + 2] = lum;
      sizes[idx] = Math.random() * 1.5;
      idx++;
    }

    return [positions, colors, sizes];
  }, []);

  // Vertex shader — particle with size attenuation, animated float
  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vDepth;
    uniform float uTime;
    uniform float uPhase;
    uniform float uBokeh;

    void main() {
      vColor = color;
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      vDepth = -mvPos.z;
      float sway = 0.4 * sin(uTime * 1.2 + position.x * 0.4 + position.y * 0.3);
      mvPos.y += sway * 0.02;
      float sz = size * (280.0 / -mvPos.z) * uPhase;
      gl_PointSize = max(sz, 0.5);
      gl_Position = projectionMatrix * mvPos;
    }
  `;

  // Fragment shader — soft glowing disc with additive blending
  const fragmentShader = `
    varying vec3 vColor;
    varying float vDepth;
    uniform float uBokeh;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d  = length(uv);
      float alpha = 1.0 - smoothstep(0.35, 0.5, d);
      float glow  = exp(-d * 6.0);
      vec3 finalColor = vColor * (glow * 1.5 + 0.3);
      gl_FragColor = vec4(finalColor, alpha * 0.9);
    }
  `;

  const uniforms = useMemo(
    () => ({
      uTime:  { value: 0 },
      uPhase: { value: 0 },
      uBokeh: { value: 0 },
    }),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    uniforms.uTime.value = t;

    // Phase-in on load
    if (phase.current < 1) {
      phase.current = Math.min(phase.current + 0.008, 1);
      uniforms.uPhase.value = phase.current;
    }

    // Bokeh from aperture
    uniforms.uBokeh.value = currentAperture.bokeh;

    if (meshRef.current) {
      meshRef.current.rotation.y += universeMode ? 0.0008 : 0.0003;
      meshRef.current.rotation.x += 0.0001;
      // Subtle breathing
      const breathe = 1 + Math.sin(t * 0.2) * 0.005;
      meshRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={new THREE.Points(geometry, material)}
    />
  );
}

// ── Light shafts ───────────────────────────────────────────
function LightShafts() {
  const shafts = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        -15 - i * 5,
      ] as [number, number, number],
      color: ['#FF8A00', '#4488FF', '#FF6644', '#44DD88', '#AA44FF'][i],
    }));
  }, []);

  return (
    <>
      {shafts.map((shaft, i) => (
        <mesh key={i} position={shaft.position} rotation={[0, 0, Math.PI * 0.05 * i]}>
          <cylinderGeometry args={[0, 3, 20, 6, 1, true]} />
          <meshBasicMaterial
            color={shaft.color}
            transparent
            opacity={0.015}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

// ── Camera rig ─────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0, z: 6 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x * 1.5 - target.current.x) * 0.04;
    target.current.y += (mouse.current.y * 1.0 - target.current.y) * 0.04;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Post processing ───────────────────────────────────────
function PostFX() {
  const { currentAperture } = useEmonoStore();
  const dofFocusDistance = 0.005;
  const dofFocalLength   = 0.015;
  const dofBokeh         = currentAperture.bokeh * 0.006;

  return (
    <EffectComposer>
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />
      <DepthOfField
        focusDistance={dofFocusDistance}
        focalLength={dofFocalLength}
        bokehScale={dofBokeh}
        height={480}
      />
      <ChromaticAberration offset={[0.0003, 0.0003]} blendFunction={BlendFunction.NORMAL} />
      <Vignette eskil={false} offset={0.1} darkness={0.8} />
    </EffectComposer>
  );
}

// ── Root export ────────────────────────────────────────────
export function HeroExperience() {
  return (
    <div id="threejs-canvas" className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 75, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#000' }}
      >
        <fog attach="fog" args={['#000000', 5, 60]} />
        <ambientLight intensity={0.1} />

        <Suspense fallback={null}>
          <Stars radius={150} depth={60} count={3000} factor={3} saturation={0} fade speed={0.3} />
          <GalaxyParticles />
          <LightShafts />
        </Suspense>

        <CameraRig />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <PostFX />
        <Preload all />
      </Canvas>
    </div>
  );
}
