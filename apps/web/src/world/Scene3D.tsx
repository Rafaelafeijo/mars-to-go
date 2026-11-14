/**
 * The 3D world (prototype, ADR-0032): low-poly illustrated terrain inspired by Jezero
 * (declared as illustration), Kenney CC0 models, a third-person astronaut.
 * This file only draws and reports taps; every number comes from packages/sim.
 * Loaded lazily so the panels work even before (or without) WebGL.
 */
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Destination } from '@mars-to-go/sim';

const BASE = import.meta.env.BASE_URL;
const M = (n: string) => `${BASE}models/kenney/${n}.glb`;
const NEAR = 4.5;
const SPEED = 6;

/** Height of the illustrated terrain: gentle relief, flat around the base, a delta fan and a butte far away. */
export function groundHeight(x: number, z: number): number {
  const r = Math.hypot(x, z + 2);
  const flat = Math.min(1, Math.max(0, (r - 12) / 10));
  let h = (0.6 * Math.sin(x * 0.13) * Math.cos(z * 0.11) + 0.35 * Math.sin(x * 0.37 + z * 0.29)) * flat;
  // Delta fan behind the base.
  const dz = z + 55;
  h += 7 * Math.exp(-(dz * dz) / 260) / (1 + (x / 35) ** 2);
  // A butte to the right, far away.
  const b = Math.hypot(x - 45, z + 70);
  h += b < 12 ? 11 : b < 16 ? 11 * (1 - (b - 12) / 4) : 0;
  return h;
}

interface MachineSpec {
  d: Destination;
  model: string;
  pos: [number, number];
  scale: number;
  rot?: number;
}

const MACHINES: MachineSpec[] = [
  { d: 'lifeSupport', model: 'machine_generatorLarge', pos: [-5.5, -1], scale: 2.2, rot: 0.6 },
  { d: 'greenhouse', model: 'hangar_roundGlass', pos: [5.5, -1], scale: 2.4, rot: -0.5 },
  { d: 'shield', model: 'machine_wireless', pos: [-3, -8.5], scale: 2.2 },
  { d: 'expedition', model: 'rover', pos: [8, 4.5], scale: 2.6, rot: -0.9 },
  { d: 'askEarth', model: 'satelliteDish_large', pos: [-8, 4], scale: 2.4, rot: 0.8 },
];

const SCENERY: { model: string; pos: [number, number]; scale: number; rot?: number }[] = [
  { model: 'hangar_largeA', pos: [0, -7], scale: 2.6 },
  { model: 'container-tall', pos: [3, -5], scale: 2.4 },
  { model: 'corridor', pos: [-1.8, -3.4], scale: 2.2, rot: Math.PI / 2 },
  { model: 'rock_largeA', pos: [-16, -10], scale: 4 },
  { model: 'rock_largeB', pos: [14, -14], scale: 3.5, rot: 1 },
  { model: 'rock_largeA', pos: [20, 8], scale: 3, rot: 2 },
  { model: 'rocks_smallA', pos: [-12, 10], scale: 3 },
  { model: 'rocks_smallA', pos: [9, 13], scale: 2.5, rot: 1.4 },
  { model: 'craterLarge', pos: [-22, 16], scale: 6 },
];

function Model({ name, x, z, scale, rot = 0 }: { name: string; x: number; z: number; scale: number; rot?: number }) {
  const { scene } = useGLTF(M(name));
  const obj = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={obj} position={[x, groundHeight(x, z), z]} scale={scale} rotation={[0, rot, 0]} />;
}

function Terrain({ onGround }: { onGround: (p: THREE.Vector3) => void }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(220, 220, 90, 90);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    const low = new THREE.Color('#a8492a');
    const high = new THREE.Color('#d98a55');
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = groundHeight(x, z);
      pos.setY(i, h);
      c.copy(low).lerp(high, Math.min(1, Math.max(0, h / 8 + 0.15 * Math.sin(x * 1.7 + z * 2.3))));
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g.toNonIndexed();
  }, []);
  return (
    <mesh
      geometry={geo}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        // Only walk when the ground is the first thing under the finger (not a machine in front of it).
        if (e.intersections[0]?.object !== e.object) return;
        e.stopPropagation();
        onGround(e.point.clone());
      }}
    >
      <meshLambertMaterial vertexColors flatShading />
    </mesh>
  );
}

interface PlayerProps {
  target: THREE.Vector3 | null;
  onArrive: () => void;
  onNear: (d: Destination | null) => void;
  playerRef: MutableRefObject<THREE.Group | null>;
}

function Player({ target, onArrive, onNear, playerRef }: PlayerProps) {
  const { scene } = useGLTF(M('astronautA'));
  const obj = useMemo(() => scene.clone(true), [scene]);
  const keys = useRef<Record<string, boolean>>({});
  const near = useRef<Destination | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(e.target.tagName) && e.key === ' ') return;
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    globalThis.addEventListener('keydown', down);
    globalThis.addEventListener('keyup', up);
    return () => {
      globalThis.removeEventListener('keydown', down);
      globalThis.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((_, dt) => {
    const p = playerRef.current;
    if (!p) return;
    const k = keys.current;
    const dir = new THREE.Vector3((k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0), 0, (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0));
    if (dir.lengthSq() === 0 && target) {
      dir.set(target.x - p.position.x, 0, target.z - p.position.z);
      if (dir.length() < 0.4) {
        dir.set(0, 0, 0);
        onArrive();
      }
    }
    if (dir.lengthSq() > 0) {
      dir.normalize();
      p.position.x = THREE.MathUtils.clamp(p.position.x + dir.x * SPEED * Math.min(dt, 0.05), -60, 60);
      p.position.z = THREE.MathUtils.clamp(p.position.z + dir.z * SPEED * Math.min(dt, 0.05), -40, 40);
      p.rotation.y = Math.atan2(dir.x, dir.z);
    }
    p.position.y = groundHeight(p.position.x, p.position.z);
    // Camera follows behind.
    const want = new THREE.Vector3(p.position.x, p.position.y + 7, p.position.z + 11);
    camera.position.lerp(want, 1 - Math.pow(0.001, Math.min(dt, 0.05)));
    camera.lookAt(p.position.x, p.position.y + 1.5, p.position.z - 2);
    // Nearest machine within reach.
    let best: Destination | null = null;
    let bestDist = NEAR;
    for (const m of MACHINES) {
      const dist = Math.hypot(m.pos[0] - p.position.x, m.pos[1] - p.position.z);
      if (dist < bestDist) {
        bestDist = dist;
        best = m.d;
      }
    }
    if (best !== near.current) {
      near.current = best;
      onNear(best);
    }
  });

  return (
    <group ref={playerRef} position={[0, 0, 5]}>
      <primitive object={obj} scale={2.2} />
    </group>
  );
}

function ShieldDome({ cells }: { cells: number }) {
  return (
    <mesh position={[0, groundHeight(0, -7), -7]}>
      <sphereGeometry args={[7, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial color="#b9a2ff" transparent opacity={cells > 0 ? 0.12 + cells * 0.06 : 0.04} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export interface Pulse {
  d: Destination;
  text: string;
  key: number;
}

interface SceneProps {
  cells: Record<Destination, number>;
  open: Destination[];
  labels: Record<Destination, string>;
  night: boolean;
  pulse: Pulse | null;
  onUse: (d: Destination) => void;
  onNear: (d: Destination | null) => void;
}

function World({ cells, open, labels, night, pulse, onUse, onNear }: SceneProps) {
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [nearD, setNearD] = useState<Destination | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const pending = useRef<Destination | null>(null);
  const sky = night ? '#1c1a2e' : '#d9a066';

  const tapMachine = (m: MachineSpec, e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!open.includes(m.d)) return;
    if (nearD === m.d) {
      onUse(m.d);
    } else {
      pending.current = m.d;
      setTarget(new THREE.Vector3(m.pos[0], 0, m.pos[1] + 3));
    }
  };

  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 45, 150]} />
      <hemisphereLight args={[night ? '#5a6aa0' : '#ffe2c4', '#6a2e1a', night ? 0.5 : 1.1]} />
      <directionalLight position={[30, 40, 20]} intensity={night ? 0.25 : 1.3} color={night ? '#9fb0ff' : '#fff1dc'} />
      <mesh position={[70, 45, -150]}>
        <sphereGeometry args={[3.2, 16, 12]} />
        <meshBasicMaterial color={night ? '#3a3a55' : '#fff6e0'} />
      </mesh>
      <Terrain
        onGround={(p) => {
          pending.current = null;
          setTarget(p);
        }}
      />
      {SCENERY.map((s, i) => (
        <Model key={i} name={s.model} x={s.pos[0]} z={s.pos[1]} scale={s.scale} rot={s.rot} />
      ))}
      <ShieldDome cells={cells.shield} />
      {MACHINES.map((m) => {
        const isOpen = open.includes(m.d);
        return (
          <group key={m.d} onClick={(e) => tapMachine(m, e)}>
            <Model name={m.model} x={m.pos[0]} z={m.pos[1]} scale={m.scale} rot={m.rot} />
            <Html position={[m.pos[0], groundHeight(m.pos[0], m.pos[1]) + 4.2, m.pos[1]]} center distanceFactor={14} zIndexRange={[10, 0]}>
              <div className={`mlabel${isOpen ? '' : ' mlabel--locked'}${nearD === m.d ? ' mlabel--near' : ''}`} aria-hidden="true">
                <span className="mlabel__name">{labels[m.d]}</span>
                <span className="mlabel__pips">
                  {Array.from({ length: cells[m.d] * (m.d === 'expedition' ? 2 : 1) }, (_, i) => (
                    <i key={i} />
                  ))}
                </span>
              </div>
            </Html>
            {pulse && pulse.d === m.d && (
              <Html key={pulse.key} position={[m.pos[0], groundHeight(m.pos[0], m.pos[1]) + 5.5, m.pos[1]]} center distanceFactor={14}>
                <div className={`mfloat mfloat--${m.d}`} aria-hidden="true">
                  {pulse.text}
                </div>
              </Html>
            )}
          </group>
        );
      })}
      <Player
        target={target}
        playerRef={playerRef}
        onArrive={() => {
          setTarget(null);
          if (pending.current) {
            onUse(pending.current);
            pending.current = null;
          }
        }}
        onNear={(d) => {
          setNearD(d);
          onNear(d);
        }}
      />
    </>
  );
}

/** Frames per second, measured by the page (used by the prototype report). */
function FpsProbe() {
  const frames = useRef(0);
  const start = useRef(0);
  useFrame(() => {
    const now = performance.now();
    if (start.current === 0) start.current = now;
    frames.current += 1;
    if (now - start.current > 2000) {
      (globalThis as unknown as { __marsFps?: number }).__marsFps = Math.round((frames.current * 1000) / (now - start.current));
      frames.current = 0;
      start.current = now;
    }
  });
  return null;
}

export default function Scene3D(props: SceneProps & { label: string }) {
  return (
    <Canvas
      className="world__canvas"
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power' }}
      camera={{ fov: 55, near: 0.5, far: 260, position: [0, 8, 16] }}
      aria-label={props.label}
      role="img"
    >
      <Suspense fallback={null}>
        <World {...props} />
      </Suspense>
      <FpsProbe />
    </Canvas>
  );
}

for (const n of ['astronautA', ...MACHINES.map((m) => m.model), ...SCENERY.map((s) => s.model)]) useGLTF.preload(M(n));
