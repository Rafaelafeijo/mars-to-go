/**
 * The 3D world (ADR-0032), after the first playtest:
 * - palette sampled from the real Jezero delta panorama PIA24921 (saturation filter only);
 * - our own astronaut; bigger machines that act (air tank fills, plants grow, rover drives,
 *   antenna beams, shield glows);
 * - the day's solar event is visible in the sky, and at night it strikes if it reaches Mars.
 * Terrain is an illustration inspired by Jezero (declared on screen). Numbers come from sim.
 */
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Destination } from '@mars-to-go/sim';
import { Astronaut } from './three/Astronaut';

const BASE = import.meta.env.BASE_URL;
const M = (n: string) => `${BASE}models/kenney/${n}.glb`;
const NEAR = 3.6;
const SPEED = 6;

/** Palette E (Phase 3B color prototype): PIA24921 ground colors with saturation ×1.7. */
const PAL = { sky: '#ddd7d4', skyNight: '#1a1b2c', ground: ['#8a6545', '#97704f', '#a1734f', '#ae7f5b', '#c69067'] };

/** Height of the illustrated terrain: gentle relief, flat around the base, a delta fan and a butte far away. */
export function groundHeight(x: number, z: number): number {
  const r = Math.hypot(x, z + 2);
  const flat = Math.min(1, Math.max(0, (r - 14) / 10));
  let h = (0.6 * Math.sin(x * 0.13) * Math.cos(z * 0.11) + 0.35 * Math.sin(x * 0.37 + z * 0.29)) * flat;
  const dz = z + 55;
  h += (7 * Math.exp(-(dz * dz) / 260)) / (1 + (x / 35) ** 2);
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
  { d: 'lifeSupport', model: 'machine_generatorLarge', pos: [-5.5, -2.5], scale: 2.1, rot: 0.6 },
  { d: 'greenhouse', model: 'hangar_roundGlass', pos: [5.5, -3], scale: 1.8, rot: -0.5 },
  { d: 'shield', model: 'machine_wireless', pos: [-2.6, -9], scale: 2.2 },
  { d: 'expedition', model: 'rover', pos: [8.5, 3.5], scale: 2.4, rot: -0.9 },
  { d: 'askEarth', model: 'satelliteDish_large', pos: [-8.5, 3], scale: 2, rot: 0.8 },
];
const AT = Object.fromEntries(MACHINES.map((m) => [m.d, m])) as Record<Destination, MachineSpec>;

const SCENERY: { model: string; pos: [number, number]; scale: number; rot?: number }[] = [
  { model: 'hangar_largeA', pos: [1, -9.5], scale: 1.9 },
  { model: 'container-tall', pos: [4.6, -8], scale: 2.2 },
  { model: 'rock_largeA', pos: [-16, -10], scale: 3 },
  { model: 'rock_largeB', pos: [14, -14], scale: 2.6, rot: 1 },
  { model: 'rock_largeA', pos: [18, 8], scale: 2.4, rot: 2 },
  { model: 'rocks_smallA', pos: [-12, 9], scale: 2.4 },
  { model: 'rocks_smallA', pos: [10, 12], scale: 2.2, rot: 1.4 },
  { model: 'craterLarge', pos: [-20, 15], scale: 5 },
];

function Model({ name, x, z, scale, rot = 0, y }: { name: string; x: number; z: number; scale: number; rot?: number; y?: number }) {
  const { scene } = useGLTF(M(name));
  const obj = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={obj} position={[x, y ?? groundHeight(x, z), z]} scale={scale} rotation={[0, rot, 0]} />;
}

function Terrain({ onGround }: { onGround: (p: THREE.Vector3) => void }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(220, 220, 90, 90);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    const pal = PAL.ground.map((c) => new THREE.Color(c));
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = groundHeight(x, z);
      pos.setY(i, h);
      const t = Math.min(0.999, Math.max(0, 0.45 + h / 14 + 0.18 * Math.sin(x * 1.7 + z * 2.3) + 0.1 * Math.sin(x * 0.31 - z * 0.27)));
      const f = t * (pal.length - 1);
      const lo = pal[Math.floor(f)] ?? pal[0];
      const hi = pal[Math.ceil(f)] ?? lo;
      if (lo && hi) c.copy(lo).lerp(hi, f - Math.floor(f));
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
        if (e.intersections[0]?.object !== e.object) return;
        e.stopPropagation();
        onGround(e.point.clone());
      }}
    >
      <meshLambertMaterial vertexColors flatShading />
    </mesh>
  );
}

/** A text plate drawn on a canvas and shown as a sprite (stays inside the 3D view). */
function makePlate(text: string, pips: number, color: string, faded: boolean, bg = 'rgba(20,16,14,0.82)'): { tex: THREE.CanvasTexture; aspect: number } {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  if (!ctx) return { tex: new THREE.CanvasTexture(c), aspect: 1 };
  const font = '700 40px system-ui, sans-serif';
  ctx.font = font;
  const w = Math.max(ctx.measureText(text).width + 40, pips * 26 + 40, 120);
  const h = pips > 0 ? 104 : 64;
  c.width = Math.ceil(w);
  c.height = h;
  ctx.font = font;
  ctx.fillStyle = faded ? 'rgba(20,16,14,0.45)' : bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, c.width, h, 18);
  ctx.fill();
  ctx.fillStyle = faded ? 'rgba(243,236,230,0.5)' : '#f3ece6';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, c.width / 2, 34);
  for (let i = 0; i < pips; i++) {
    ctx.fillStyle = color;
    ctx.fillRect(c.width / 2 - (pips * 26) / 2 + i * 26 + 4, 70, 18, 18);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, aspect: c.width / h };
}

function Plate({ text, pips = 0, color = '#f5b642', faded = false, position, height = 0.6, bg }: { text: string; pips?: number; color?: string; faded?: boolean; position: [number, number, number]; height?: number; bg?: string }) {
  const { tex, aspect } = useMemo(() => makePlate(text, pips, color, faded, bg), [text, pips, color, faded, bg]);
  useEffect(() => () => tex.dispose(), [tex]);
  const h = pips > 0 ? height * 1.6 : height;
  return (
    <sprite position={position} scale={[h * aspect, h, 1]} renderOrder={10}>
      <spriteMaterial map={tex} transparent depthTest={false} />
    </sprite>
  );
}

function Floater({ text, color, position }: { text: string; color: string; position: [number, number, number] }) {
  const ref = useRef<THREE.Sprite>(null);
  const t0 = useRef(0);
  const { tex, aspect } = useMemo(() => makePlate(text, 0, color, false), [text, color]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((_, dt) => {
    const s = ref.current;
    if (!s) return;
    t0.current += dt;
    s.position.y = position[1] + t0.current * 1.6;
    (s.material as THREE.SpriteMaterial).opacity = Math.max(0, 1 - t0.current / 1.3);
  });
  return (
    <sprite ref={ref} position={position} scale={[0.7 * aspect, 0.7, 1]} renderOrder={11}>
      <spriteMaterial map={tex} transparent depthTest={false} color={color} />
    </sprite>
  );
}

const TONE_COLOR: Record<Destination, string> = {
  lifeSupport: '#6ab0ff',
  greenhouse: '#7cd17a',
  shield: '#b9a2ff',
  expedition: '#f5b642',
  askEarth: '#f5b642',
};

/** The air tank next to the air machine: level = air after tonight; red and blinking when critical. */
function AirTank({ level, critical, label }: { level: number; critical: boolean; label: string }) {
  const x = AT.lifeSupport.pos[0] - 2.4;
  const z = AT.lifeSupport.pos[1] + 0.6;
  const y0 = groundHeight(x, z);
  const fill = useRef<THREE.Mesh>(null);
  const shown = useRef(level);
  useFrame((state, dt) => {
    shown.current += (level - shown.current) * Math.min(1, dt * 3);
    const m = fill.current;
    if (!m) return;
    const v = Math.max(0.02, Math.min(1, shown.current));
    m.scale.y = v;
    m.position.y = y0 + 0.15 + (2.2 * v) / 2;
    const mat = m.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = critical ? 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 6) : 0.25;
  });
  return (
    <group>
      <mesh position={[x, y0 + 1.25, z]}>
        <cylinderGeometry args={[0.62, 0.62, 2.5, 16, 1, true]} />
        <meshStandardMaterial color="#cfe6ff" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={fill} position={[x, y0 + 1, z]}>
        <cylinderGeometry args={[0.55, 0.55, 2.2, 16]} />
        <meshStandardMaterial color={critical ? '#ff5a4a' : '#6ab0ff'} emissive={critical ? '#ff2a1a' : '#2a6aff'} emissiveIntensity={0.25} />
      </mesh>
      <Plate text={label} position={[x, y0 + 3.1, z]} height={0.5} bg={critical ? 'rgba(160,30,20,0.92)' : undefined} />
    </group>
  );
}

/** Plants in front of the greenhouse: each pending harvest grows a little every sol. */
function Plants({ growing }: { growing: { sol: number; food: number; daysLeft: number }[] }) {
  const g = AT.greenhouse;
  return (
    <group>
      {growing.slice(0, 4).map((h, i) => {
        const x = g.pos[0] - 1.8 + i * 1.2;
        const z = g.pos[1] + 2.4;
        const y0 = groundHeight(x, z);
        const size = h.daysLeft <= 0 ? 1 : h.daysLeft === 1 ? 0.65 : 0.35;
        return (
          <group key={`${h.sol}-${i}`} position={[x, y0, z]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.35, 0.3, 0.3, 8]} />
              <meshLambertMaterial color="#6b4a36" />
            </mesh>
            <mesh position={[0, 0.3 + 0.5 * size, 0]} scale={[size, size, size]}>
              <icosahedronGeometry args={[0.55, 0]} />
              <meshLambertMaterial color="#5fbf5a" flatShading />
            </mesh>
            <Plate text={`+${h.food} · sol ${h.sol}`} position={[0, 1.7, 0]} height={0.38} color="#7cd17a" />
          </group>
        );
      })}
    </group>
  );
}

/** The rover drives to the delta and back during the night when an expedition is planned. */
function Rover({ driving }: { driving: boolean }) {
  const m = AT.expedition;
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    t.current = driving ? t.current + dt : 0;
    const k = driving ? Math.sin(Math.min(Math.PI, t.current * 0.9)) : 0; // out and back
    const x = m.pos[0] + (0 - m.pos[0]) * k * 0.6;
    const z = m.pos[1] + (-38 - m.pos[1]) * k;
    g.position.set(x, groundHeight(x, z), z);
  });
  return (
    <group ref={ref}>
      <Model name={m.model} x={0} z={0} y={0} scale={m.scale} rot={m.rot} />
    </group>
  );
}

/** A beam from the antenna to the sky when Earth is being asked. */
function Beam({ on }: { on: boolean }) {
  const a = AT.askEarth;
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    (m.material as THREE.MeshBasicMaterial).opacity = on ? 0.35 + 0.25 * Math.sin(state.clock.elapsedTime * 5) : 0;
  });
  return (
    <mesh ref={ref} position={[a.pos[0], groundHeight(a.pos[0], a.pos[1]) + 30, a.pos[1]]}>
      <cylinderGeometry args={[0.12, 0.6, 56, 8, 1, true]} />
      <meshBasicMaterial color="#f5b642" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function ShieldDome({ cells, flash }: { cells: number; flash: boolean }) {
  const ref = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const base = cells > 0 ? 0.1 + cells * 0.06 : 0.035;
    m.opacity = flash && cells > 0 ? base + 0.35 * Math.abs(Math.sin(state.clock.elapsedTime * 8)) : base;
  });
  return (
    <mesh position={[0, groundHeight(0, -7), -7]}>
      <sphereGeometry args={[7.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial ref={ref} color="#b9a2ff" transparent opacity={0.04} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export interface SkyEvent {
  /** 0 none, 1 low, 2 medium, 3 high (sim risk). */
  risk: number;
  /** Strike at night only if the real evidence says it reached Mars. */
  strikes: boolean;
}

/** The Sun, bigger and burning when there is a solar event; a flash and falling particles at night if it strikes. */
function SunAndStorm({ event, night }: { event: SkyEvent | null; night: boolean }) {
  const sun = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const storm = useRef<THREE.Points>(null);
  const flash = useRef<THREE.Mesh>(null);
  const particles = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 600;
    const p = new Float32Array(n * 3);
    // Deterministic scatter (no Math.random during render).
    const r = (k: number) => {
      const s = Math.sin(k * 12.9898) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < n; i++) {
      p[i * 3] = (r(i * 3 + 1) - 0.5) * 60;
      p[i * 3 + 1] = r(i * 3 + 2) * 40;
      p[i * 3 + 2] = (r(i * 3 + 3) - 0.5) * 60 - 5;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  const striking = night && event?.strikes === true;
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (halo.current) {
      const s = event ? 1.6 + 0.25 * event.risk + 0.15 * Math.sin(t * 3) : 1;
      halo.current.scale.setScalar(s);
      (halo.current.material as THREE.MeshBasicMaterial).opacity = event && !night ? 0.45 : 0;
    }
    if (sun.current) (sun.current.material as THREE.MeshBasicMaterial).color.set(night ? '#2a2a40' : event ? '#ffb070' : '#fff6e0');
    if (storm.current) {
      storm.current.visible = striking;
      const pos = storm.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - dt * 18;
        if (y < 0) y = 40;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
    if (flash.current) (flash.current.material as THREE.MeshBasicMaterial).opacity = striking ? 0.12 + 0.12 * Math.abs(Math.sin(t * 2.5)) : 0;
  });
  return (
    <group>
      <mesh ref={sun} position={[70, 45, -150]}>
        <sphereGeometry args={[3.2, 16, 12]} />
        <meshBasicMaterial color="#fff6e0" />
      </mesh>
      <mesh ref={halo} position={[70, 45, -151]}>
        <sphereGeometry args={[5, 16, 12]} />
        <meshBasicMaterial color="#ff7a3a" transparent opacity={0} depthWrite={false} />
      </mesh>
      <points ref={storm} geometry={particles} visible={false}>
        <pointsMaterial color="#c9a6ff" size={0.35} transparent opacity={0.85} />
      </points>
      <mesh ref={flash} position={[0, 30, -20]}>
        <sphereGeometry args={[120, 12, 8]} />
        <meshBasicMaterial color="#b28cff" transparent opacity={0} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface PlayerProps {
  target: THREE.Vector3 | null;
  onArrive: () => void;
  onNear: (d: Destination | null) => void;
  playerRef: MutableRefObject<THREE.Group | null>;
}

function Player({ target, onArrive, onNear, playerRef }: PlayerProps) {
  const keys = useRef<Record<string, boolean>>({});
  const near = useRef<Destination | null>(null);
  const [walking, setWalking] = useState(false);
  const walkingRef = useRef(false);
  const { camera, size } = useThree();
  const portrait = size.width < size.height;
  const camUp = portrait ? 9.5 : 5.5;
  const camBack = portrait ? 15 : 9.5;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
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
    const moving = dir.lengthSq() > 0;
    if (moving !== walkingRef.current) {
      walkingRef.current = moving;
      setWalking(moving);
    }
    if (moving) {
      dir.normalize();
      p.position.x = THREE.MathUtils.clamp(p.position.x + dir.x * SPEED * Math.min(dt, 0.05), -60, 60);
      p.position.z = THREE.MathUtils.clamp(p.position.z + dir.z * SPEED * Math.min(dt, 0.05), -40, 40);
      p.rotation.y = Math.atan2(dir.x, dir.z);
    }
    p.position.y = groundHeight(p.position.x, p.position.z);
    const want = new THREE.Vector3(p.position.x, p.position.y + camUp, p.position.z + camBack);
    camera.position.lerp(want, 1 - Math.pow(0.001, Math.min(dt, 0.05)));
    camera.lookAt(p.position.x, p.position.y + 1.2, p.position.z - 3);
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
    <group ref={playerRef} position={[0, 0, 3]} rotation={[0, Math.PI, 0]}>
      <Astronaut walking={walking} />
    </group>
  );
}

export interface Pulse {
  d: Destination;
  text: string;
  key: number;
}

export interface SceneProps {
  cells: Record<Destination, number>;
  open: Destination[];
  labels: Record<Destination, string>;
  night: boolean;
  pulse: Pulse | null;
  onUse: (d: Destination) => void;
  onNear: (d: Destination | null) => void;
  /** Air after tonight, 0..1 of a full tank (20 units). */
  airLevel: number;
  airCritical: boolean;
  airLabel: string;
  growing: { sol: number; food: number; daysLeft: number }[];
  event: SkyEvent | null;
}

function World(props: SceneProps) {
  const { cells, open, labels, night, pulse, onUse, onNear } = props;
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [nearD, setNearD] = useState<Destination | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const pending = useRef<Destination | null>(null);
  const sky = night ? PAL.skyNight : PAL.sky;

  const tapMachine = (m: MachineSpec, e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!open.includes(m.d)) return;
    if (nearD === m.d) onUse(m.d);
    else {
      pending.current = m.d;
      setTarget(new THREE.Vector3(m.pos[0], 0, m.pos[1] + 2.6));
    }
  };

  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 50, 160]} />
      <hemisphereLight args={[night ? '#5a6aa0' : '#fff1e2', '#6a3e24', night ? 0.45 : 1.15]} />
      <directionalLight position={[30, 40, 20]} intensity={night ? 0.2 : 1.35} color={night ? '#9fb0ff' : '#fff1dc'} />
      <SunAndStorm event={props.event} night={night} />
      <Terrain
        onGround={(p) => {
          pending.current = null;
          setTarget(p);
        }}
      />
      {SCENERY.map((s, i) => (
        <Model key={i} name={s.model} x={s.pos[0]} z={s.pos[1]} scale={s.scale} rot={s.rot} />
      ))}
      <ShieldDome cells={cells.shield} flash={night && props.event?.strikes === true} />
      <AirTank level={props.airLevel} critical={props.airCritical} label={props.airLabel} />
      <Plants growing={props.growing} />
      <Beam on={cells.askEarth > 0} />
      {MACHINES.map((m) => {
        const isOpen = open.includes(m.d);
        const top = groundHeight(m.pos[0], m.pos[1]) + 3.4;
        return (
          <group key={m.d} onClick={(e) => tapMachine(m, e)}>
            {m.d === 'expedition' ? <Rover driving={night && cells.expedition > 0} /> : <Model name={m.model} x={m.pos[0]} z={m.pos[1]} scale={m.scale} rot={m.rot} />}
            <Plate
              text={nearD === m.d ? `▶ ${labels[m.d]}` : labels[m.d]}
              pips={cells[m.d] * (m.d === 'expedition' ? 2 : 1)}
              color={TONE_COLOR[m.d]}
              faded={!isOpen}
              position={[m.pos[0], top, m.pos[1]]}
            />
            {pulse && pulse.d === m.d && <Floater key={pulse.key} text={pulse.text} color={TONE_COLOR[m.d]} position={[m.pos[0], top + 1, m.pos[1]]} />}
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

/** Frames per second, measured by the page (prototype report, ?fps=1). */
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

for (const n of [...MACHINES.map((m) => m.model), ...SCENERY.map((s) => s.model)]) useGLTF.preload(M(n));
