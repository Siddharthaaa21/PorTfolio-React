import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  Points,
  PointMaterial,
  AdaptiveDpr,
  PerformanceMonitor,
  Preload,
} from '@react-three/drei';
import sceneBus from '../lib/sceneBus';
import s from './AmbientField.module.css';

/* ──────────────────────────────────────────────────────────────────────────
 * AmbientField (Tab 2) — a fixed, full-screen, pointer-events:none ambient
 * Three.js layer that sits BEHIND all content.
 *
 *   • A slow dark star/particle field washed with the accent tokens.
 *   • A signature 3D brand mark: a gently wobbling, slowly rotating
 *     icosahedron (drei MeshDistortMaterial) parked in one corner.
 *   • Reacts to the agent: subscribes to sceneBus 'tool-call' and ripples the
 *     mark + emits a brief particle burst, then settles.
 *
 * Atmosphere, not a game. Token-driven (colors pulled from CSS vars at mount),
 * performance-capped (dpr [1,2], adaptive dpr, paused when the tab is hidden),
 * and degrades to a static CSS fallback on reduced-motion / mobile.
 * ────────────────────────────────────────────────────────────────────────── */

/* ── token bridge ──────────────────────────────────────────────────────────
 * We never hardcode hex in JS. Read the real CSS-variable values from
 * :root at mount and hand them to three as THREE.Color instances. If a var is
 * missing for any reason, fall back to a neutral so we never crash. */
function readTokenColors() {
  const safe = (value, fallback) => {
    const v = (value || '').trim();
    if (!v) return new THREE.Color(fallback);
    try {
      return new THREE.Color(v);
    } catch {
      return new THREE.Color(fallback);
    }
  };
  // SSR / no-DOM guard (defensive — this app is client-only)
  if (typeof window === 'undefined' || !document?.documentElement) {
    return {
      bg: new THREE.Color('#0a0a0f'),
      accent: new THREE.Color('#6366f1'),
      accent2: new THREE.Color('#22d3ee'),
      fg: new THREE.Color('#f5f5f7'),
    };
  }
  const cs = getComputedStyle(document.documentElement);
  return {
    bg: safe(cs.getPropertyValue('--bg'), '#0a0a0f'),
    accent: safe(cs.getPropertyValue('--accent'), '#6366f1'),
    accent2: safe(cs.getPropertyValue('--accent-2'), '#22d3ee'),
    fg: safe(cs.getPropertyValue('--fg'), '#f5f5f7'),
  };
}

/* ── environment probes ──────────────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    // addEventListener is the modern API; addListener is the Safari fallback
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return reduced;
}

function useIsMobile(maxWidth = 768) {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const onChange = (e) => setMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, [maxWidth]);
  return mobile;
}

/* ── pulse coordination ────────────────────────────────────────────────────
 * A tiny ref-based "pulse clock". sceneBus 'tool-call' events bump `energy`
 * toward 1; every frame it decays back to 0. Scene objects read it without
 * re-rendering React. We keep it as a shared ref so the mark and the burst
 * stay in sync off a single subscription. */
function usePulse() {
  // { energy: current 0..1, hits: [timestamps] for burst spawning }
  const pulse = useRef({ energy: 0, lastHit: 0 });
  useEffect(() => {
    // sceneBus.on returns an unsubscribe fn (verified in src/lib/sceneBus.js)
    const off = sceneBus.on('tool-call', () => {
      pulse.current.energy = 1;
      pulse.current.lastHit = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    });
    return off; // clean up the subscription on unmount
  }, []);
  return pulse;
}

/* ── starfield ─────────────────────────────────────────────────────────────
 * drei <Points> + <PointMaterial>. A sparse dark field of points tinted with
 * the accent token, drifting very slowly. Count scales down on mobile. */
function Starfield({ count, color, reactive }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // distribute in a flattened slab so it reads as depth, not a ball
      arr[i * 3 + 0] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    // very slow ambient rotation
    ref.current.rotation.y += delta * 0.012;
    ref.current.rotation.x += delta * 0.004;
    // a subtle size/opacity breath on tool-call energy
    const energy = reactive.current.energy;
    const mat = ref.current.material;
    if (mat) {
      mat.size = THREE.MathUtils.lerp(mat.size, 0.018 + energy * 0.012, 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.5 + energy * 0.35, 0.1);
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/* ── tool-call burst ───────────────────────────────────────────────────────
 * A small additive particle puff that flares out from the brand mark each time
 * `lastHit` advances, then fades. Cheap: a single Points cloud reused. */
function ToolBurst({ origin, color, reactive }) {
  const ref = useRef();
  const seenHit = useRef(0);
  const life = useRef(0); // 0..1, 0 = idle
  const COUNT = 36;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      // random direction on a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.6 + Math.random() * 0.8;
      vel[i * 3 + 0] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed * 0.6;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;

    // new hit detected → (re)spawn the burst
    if (reactive.current.lastHit !== seenHit.current) {
      seenHit.current = reactive.current.lastHit;
      life.current = 1;
      const arr = pts.geometry.attributes.position.array;
      for (let i = 0; i < COUNT * 3; i += 1) arr[i] = 0;
      pts.geometry.attributes.position.needsUpdate = true;
      pts.visible = true;
    }

    if (life.current <= 0) {
      if (pts.visible) pts.visible = false;
      return;
    }

    life.current = Math.max(0, life.current - delta * 1.6);
    const arr = pts.geometry.attributes.position.array;
    const step = delta * (0.8 + life.current); // ease-out expansion
    for (let i = 0; i < COUNT; i += 1) {
      arr[i * 3 + 0] += velocities[i * 3 + 0] * step;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * step;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * step;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    if (pts.material) pts.material.opacity = life.current * 0.9;
  });

  return (
    <group position={origin}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false} visible={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.06}
          sizeAttenuation
          depthWrite={false}
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

/* ── signature brand mark ──────────────────────────────────────────────────
 * A slowly rotating icosahedron with a gentle MeshDistortMaterial wobble,
 * wrapped in drei <Float> for an idle bob. On a tool-call it ripples: a quick
 * scale-up + distort spike + emissive flash, settling via per-frame lerp. */
function BrandMark({ position, accent, accent2, reactive }) {
  const meshRef = useRef();
  const matRef = useRef();

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    const energy = reactive.current.energy;

    if (mesh) {
      // slow signature spin
      mesh.rotation.x += delta * 0.18;
      mesh.rotation.y += delta * 0.24;
      // ripple: scale eases toward (1 + energy*0.18) then back as energy decays
      const target = 1 + energy * 0.18;
      const next = THREE.MathUtils.lerp(mesh.scale.x, target, 0.18);
      mesh.scale.setScalar(next);
    }

    if (mat) {
      // `distort` is a live setter on the material — driving it per-frame gives
      // the gentle baseline wobble that spikes on tool-call energy, then settles.
      // (Note: `speed` is a one-time JSX prop on MeshDistortMaterial, not a live
      // setter, so we don't touch it here.)
      mat.distort = THREE.MathUtils.lerp(mat.distort, 0.28 + energy * 0.3, 0.12);
      if (mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          0.35 + energy * 1.1,
          0.15
        );
      }
    }

    // decay the shared energy once per frame (BrandMark is the single owner of
    // decay so it isn't applied multiple times across components)
    reactive.current.energy = Math.max(0, energy - delta * 1.8);
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.7, 4]} />
        <MeshDistortMaterial
          ref={matRef}
          color={accent}
          emissive={accent2}
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.25}
          distort={0.28}
          speed={1.4}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
}

/* ── visibility-aware frameloop ────────────────────────────────────────────
 * Pause rendering when the tab is hidden (document.hidden) to save CPU/GPU/
 * battery. We flip the r3f frameloop between 'always' and 'never' and request
 * a single frame when we resume so nothing looks frozen. */
function VisibilityGate() {
  const setFrameloop = useThree((state) => state.setFrameloop);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const apply = () => {
      if (document.hidden) {
        setFrameloop('never');
      } else {
        setFrameloop('always');
        invalidate();
      }
    };
    apply();
    document.addEventListener('visibilitychange', apply);
    return () => document.removeEventListener('visibilitychange', apply);
  }, [setFrameloop, invalidate]);
  return null;
}

/* ── the WebGL scene ───────────────────────────────────────────────────────
 * Split out so the Canvas children stay tidy. dpr-capping & adaptive perf live
 * on the <Canvas>; here we just compose the contents. */
function Scene({ colors, particleCount, markPosition, reactive }) {
  return (
    <>
      <VisibilityGate />

      {/* soft, low key lighting — just enough to read the mark's facets */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={0.7} color={colors.fg} />
      <pointLight position={[-4, -2, -3]} intensity={0.5} color={colors.accent2} />

      <Starfield count={particleCount} color={colors.accent} reactive={reactive} />
      <BrandMark
        position={markPosition}
        accent={colors.accent}
        accent2={colors.accent2}
        reactive={reactive}
      />
      <ToolBurst origin={markPosition} color={colors.accent2} reactive={reactive} />

      {/* drop dpr automatically under sustained load, and warm assets once */}
      <AdaptiveDpr pixelated={false} />
      <Preload all />
    </>
  );
}

export default function AmbientField() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const reactive = usePulse(); // shared even in fallback so subscription cleanup is uniform

  // dpr lowering hook for PerformanceMonitor (kept in state so r3f re-applies)
  const [dpr, setDpr] = useState([1, 2]);

  const colors = useMemo(() => readTokenColors(), []);

  // Static, zero-WebGL fallback for reduced-motion users. (We still mount the
  // pulse subscription above so behaviour is consistent and cleanup is tested.)
  if (reducedMotion) {
    return (
      <div className={s.root} aria-hidden="true">
        <div className={s.fallback} />
        <div className={s.fallbackMark} />
      </div>
    );
  }

  // Mobile: keep the real scene but trim it hard — fewer particles, lower dpr
  // ceiling, parked mark. Atmosphere stays; cost drops.
  const particleCount = isMobile ? 450 : 1400;
  const markPosition = isMobile ? [1.5, 1.7, 0] : [3.1, 1.7, -1];

  return (
    <div className={s.root} aria-hidden="true">
      {/* token-tinted gradient wash sits under the canvas for a seamless base */}
      <div className={s.wash} />

      <Canvas
        dpr={dpr}
        frameloop="always"
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
          // don't keep a stale buffer; lets the wash show through cleanly
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        // never intercept input — the layer is purely decorative
        style={{ pointerEvents: 'none' }}
      >
        {/* lower the dpr ceiling if the GPU is struggling; raise it back when
            we recover. Cheap insurance for low-end devices. */}
        <PerformanceMonitor
          onDecline={() => setDpr([1, 1.5])}
          onIncline={() => setDpr([1, 2])}
        />
        <Scene
          colors={colors}
          particleCount={particleCount}
          markPosition={markPosition}
          reactive={reactive}
        />
      </Canvas>
    </div>
  );
}
