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
import { V, type Destination } from '@mars-to-go/sim';
import { Astronaut } from './three/Astronaut';

const BASE = import.meta.env.BASE_URL;
const M = (n: string) => `${BASE}models/kenney/${n}.glb`;
const NEAR = 3.6;
const SPEED = 6;
/** Walking area around the base: a warning from EDGE_WARN, a soft stop at EDGE_MAX (meters, illustration). */
const BASE_CENTER: [number, number] = [0, -3];
const EDGE_WARN = 24;
const EDGE_MAX = 30;
const SUN_POS: [number, number, number] = [60, 55, -150];

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
  { d: 'shield', model: 'machine_wireless', pos: [-4.6, -9], scale: 2.2 },
  // Parked in view of the start position, so it is seen (locked) from sol 1.
  { d: 'expedition', model: 'rover', pos: [3.6, 1.2], scale: 2.4, rot: -0.6 },
  { d: 'askEarth', model: 'satelliteDish_large', pos: [-8.5, 3], scale: 2, rot: 0.8 },
];
const AT = Object.fromEntries(MACHINES.map((m) => [m.d, m])) as Record<Destination, MachineSpec>;

/** The crew's home (habitat), in the middle of the base and under the shield dome. Not a machine. */
const HABITAT = { model: 'hangar_largeA', pos: [-6.5, -13.5] as [number, number], scale: 2.2 };

const SCENERY: { model: string; pos: [number, number]; scale: number; rot?: number }[] = [
  { model: 'container-tall', pos: [12, -10], scale: 2.2, rot: -0.3 },
  { model: 'rock_largeA', pos: [-16, -10], scale: 3 },
  { model: 'rock_largeB', pos: [14, -14], scale: 2.6, rot: 1 },
  { model: 'rock_largeA', pos: [18, 8], scale: 2.4, rot: 2 },
  { model: 'rocks_smallA', pos: [-12, 9], scale: 2.4 },
  { model: 'rocks_smallA', pos: [10, 12], scale: 2.2, rot: 1.4 },
  { model: 'craterLarge', pos: [-20, 15], scale: 5 },
];

function Model({ name, x, z, scale, rot = 0, y, center = false }: { name: string; x: number; z: number; scale: number; rot?: number; y?: number; center?: boolean }) {
  const { scene } = useGLTF(M(name));
  const obj = useMemo(() => scene.clone(true), [scene]);
  // Some Kenney models have their origin at a corner: center them so labels sit right above.
  const offset = useMemo(() => {
    if (!center) return [0, 0, 0] as [number, number, number];
    const c = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
    return [-c.x, 0, -c.z] as [number, number, number];
  }, [obj, center]);
  return (
    <group position={[x, y ?? groundHeight(x, z), z]} scale={scale} rotation={[0, rot, 0]}>
      <primitive object={obj} position={offset} />
    </group>
  );
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
        // Only the main button (left click or a finger): a right click must not start a walk.
        if (e.button !== 0) return;
        if (e.intersections[0]?.object !== e.object) return;
        e.stopPropagation();
        onGround(e.point.clone());
      }}
    >
      <meshLambertMaterial vertexColors flatShading />
    </mesh>
  );
}

type PlateLook = 'normal' | 'active' | 'faded' | 'critical';
/** Labels sit on top of their point (bottom-center anchor), so they never cover the machine. */
const PLATE_ANCHOR = new THREE.Vector2(0.5, 0);

/**
 * A label drawn on a canvas and shown as a sprite. After the second playtest: a dark glass pill
 * with a thin border and a colored dot (not a filled "highlighter" box), and a constant size on
 * screen, so near labels never grow over the panels.
 */
function makePlate(text: string, pips: number, color: string, look: PlateLook): { tex: THREE.CanvasTexture; aspect: number } {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  if (!ctx) return { tex: new THREE.CanvasTexture(c), aspect: 1 };
  const font = "600 34px 'Atkinson Hyperlegible Next Variable', system-ui, sans-serif";
  ctx.font = font;
  const dot = 26;
  const w = Math.max(ctx.measureText(text).width + 56 + dot, pips * 22 + 48, 120);
  const h = pips > 0 ? 100 : 64;
  c.width = Math.ceil(w);
  c.height = h;
  ctx.font = font;
  const border = look === 'critical' ? '#ff5a4a' : look === 'active' ? '#e8703a' : 'rgba(255,255,255,0.22)';
  ctx.fillStyle = look === 'critical' ? 'rgba(48,12,10,0.92)' : look === 'faded' ? 'rgba(16,12,11,0.45)' : 'rgba(16,12,11,0.86)';
  ctx.strokeStyle = border;
  ctx.lineWidth = look === 'normal' || look === 'faded' ? 2 : 5;
  ctx.beginPath();
  ctx.roundRect(3, 3, c.width - 6, h - 6, 28);
  ctx.fill();
  ctx.stroke();
  // Colored dot: the machine's color (never the only cue: the text names it).
  ctx.fillStyle = look === 'faded' ? 'rgba(243,236,230,0.35)' : look === 'critical' ? '#ff5a4a' : color;
  ctx.beginPath();
  ctx.arc(26 + 2, 32, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = look === 'faded' ? 'rgba(243,236,230,0.5)' : '#f3ece6';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 26 + dot, 33);
  for (let i = 0; i < pips; i++) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(c.width / 2 - (pips * 22) / 2 + i * 22 + 3, 66, 16, 16, 4);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, aspect: c.width / h };
}

/** Constant on-screen size: height is a fraction of the view height (sizeAttenuation off). */
function Plate({ text, pips = 0, color = '#f5b642', look = 'normal', position, height = 0.042 }: { text: string; pips?: number; color?: string; look?: PlateLook; position: [number, number, number]; height?: number }) {
  const { tex, aspect } = useMemo(() => makePlate(text, pips, color, look), [text, pips, color, look]);
  useEffect(() => () => tex.dispose(), [tex]);
  const h = pips > 0 ? height * 1.55 : height;
  return (
    <sprite position={position} scale={[h * aspect, h, 1]} renderOrder={10} center={PLATE_ANCHOR}>
      <spriteMaterial map={tex} transparent depthTest={false} sizeAttenuation={false} />
    </sprite>
  );
}

function Floater({ text, color, position }: { text: string; color: string; position: [number, number, number] }) {
  const ref = useRef<THREE.Sprite>(null);
  const t0 = useRef(0);
  const { tex, aspect } = useMemo(() => makePlate(text, 0, color, 'active'), [text, color]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((_, dt) => {
    const s = ref.current;
    if (!s) return;
    t0.current += dt;
    s.position.y = position[1] + t0.current * 1.6;
    (s.material as THREE.SpriteMaterial).opacity = Math.max(0, 1 - t0.current / 1.3);
  });
  return (
    <sprite ref={ref} position={position} scale={[0.05 * aspect, 0.05, 1]} renderOrder={11}>
      <spriteMaterial map={tex} transparent depthTest={false} sizeAttenuation={false} />
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

/**
 * The oxygen tank next to the air machine, drawn as a white pressure tank with a level window.
 * TODO(science): NASA Glenn NTRS 20160004210 (liquefying and storing Mars-made oxygen in tanks)
 * was seen only as a search snippet; verify before any on-screen claim. The tank is illustration.
 * Level = air after tonight; the window turns red and pulses when air is critical.
 */
function AirTank({ level, critical, label }: { level: number; critical: boolean; label: string }) {
  const x = AT.lifeSupport.pos[0] - 2.6;
  const z = AT.lifeSupport.pos[1] + 0.8;
  const y0 = groundHeight(x, z);
  const H = 2.2;
  const fill = useRef<THREE.Mesh>(null);
  const shown = useRef(level);
  useFrame((state, dt) => {
    shown.current += (level - shown.current) * Math.min(1, dt * 3);
    const m = fill.current;
    if (!m) return;
    const v = Math.max(0.03, Math.min(1, shown.current));
    m.scale.y = v;
    m.position.y = 0.55 + (H * 0.86 * v) / 2;
    const mat = m.material as THREE.MeshBasicMaterial;
    mat.opacity = critical ? 0.6 + 0.4 * Math.sin(state.clock.elapsedTime * 6) : 1;
  });
  return (
    <group position={[x, y0, z]}>
      {/* legs */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.57 + 0.78) * 0.5, 0.2, Math.sin(i * 1.57 + 0.78) * 0.5]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshLambertMaterial color="#5c5f66" />
        </mesh>
      ))}
      {/* body with domed ends */}
      <mesh position={[0, 0.4 + H / 2, 0]}>
        <cylinderGeometry args={[0.7, 0.7, H, 20]} />
        <meshStandardMaterial color="#e6e8ec" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.4 + H, 0]}>
        <sphereGeometry args={[0.7, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e6e8ec" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.7, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e6e8ec" roughness={0.45} metalness={0.2} />
      </mesh>
      {/* band and valve */}
      <mesh position={[0, 0.4 + H * 0.92, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.12, 20]} />
        <meshLambertMaterial color="#6ab0ff" />
      </mesh>
      <mesh position={[0, 0.4 + H + 0.75, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
        <meshLambertMaterial color="#5c5f66" />
      </mesh>
      {/* level window, facing the camera */}
      <mesh position={[0, 0.45 + (H * 0.86) / 2, 0.69]}>
        <boxGeometry args={[0.3, H * 0.9, 0.04]} />
        <meshBasicMaterial color="#1b2230" />
      </mesh>
      <mesh ref={fill} position={[0, 0.55, 0.72]}>
        <boxGeometry args={[0.2, H * 0.86, 0.03]} />
        <meshBasicMaterial color={critical ? '#ff5a4a' : '#6ab0ff'} transparent />
      </mesh>
      <Plate text={label} position={[0, H + 1.6, 0]} color={critical ? '#ff5a4a' : '#6ab0ff'} look={critical ? 'critical' : 'normal'} />
    </group>
  );
}

const TRAYS_PER_ROW = 7;

/**
 * The greenhouse: an inflatable cylinder with two rows of trays under grow lights, like the
 * University of Arizona / NASA prototype Mars-Moon greenhouse and the LED-lit Veggie chamber.
 * One tray per cell planted, so more cells means more plants; plants grow a size each sol.
 */
function Greenhouse({ growing, harvestLabel }: { growing: { sol: number; food: number; daysLeft: number }[]; harvestLabel: (n: number, sol: number) => string }) {
  const g = AT.greenhouse;
  const y0 = groundHeight(g.pos[0], g.pos[1]);
  const L = 7.2;
  const R = 1.6;
  const trays: { size: number; key: string }[] = [];
  for (const h of growing) {
    const n = Math.round(h.food / V.FOOD_PER_GREENHOUSE_CELL);
    const size = h.daysLeft <= 0 ? 1 : h.daysLeft === 1 ? 0.7 : 0.4;
    for (let i = 0; i < n; i++) trays.push({ size, key: `${h.sol}-${i}` });
  }
  const slots = TRAYS_PER_ROW * 3; // 3 sols of planting at most are growing at once
  const next = growing.filter((h) => h.sol <= V.MISSION_SOLS).slice(0, 2);
  return (
    <group position={[g.pos[0], y0, g.pos[1]]} rotation={[0, g.rot ?? 0, 0]}>
      {/* cradle */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[L, 0.3, R * 1.6]} />
        <meshLambertMaterial color="#6d6f75" />
      </mesh>
      {/* inflatable shell */}
      <mesh position={[0, R * 0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[R, R, L, 24, 1, true]} />
        <meshStandardMaterial color="#f1ece6" transparent opacity={0.32} roughness={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* end caps and ribs */}
      {[-L / 2, L / 2].map((x) => (
        <mesh key={x} position={[x, R * 0.85, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[R, 24]} />
          <meshStandardMaterial color="#d8d2cc" transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
      {[-2.4, -0.8, 0.8, 2.4].map((x) => (
        <mesh key={x} position={[x, R * 0.85, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[R, 0.05, 6, 24]} />
          <meshLambertMaterial color="#cfc8c0" />
        </mesh>
      ))}
      {/* grow lights: pink, from red and blue LEDs */}
      <mesh position={[0, R * 1.55, 0]}>
        <boxGeometry args={[L * 0.9, 0.06, 0.25]} />
        <meshBasicMaterial color="#ff6ad5" />
      </mesh>
      {/* trays: one per cell planted */}
      {Array.from({ length: slots }, (_, i) => {
        const row = Math.floor(i / TRAYS_PER_ROW) - 1;
        const col = i % TRAYS_PER_ROW;
        const x = -L / 2 + 0.6 + col * ((L - 1.2) / (TRAYS_PER_ROW - 1));
        const z = row * 0.72;
        const tray = trays[i];
        return (
          <group key={i} position={[x, 0.45, z]}>
            <mesh>
              <boxGeometry args={[0.8, 0.14, 0.6]} />
              <meshLambertMaterial color={tray ? '#4a3527' : '#3a3633'} />
            </mesh>
            {tray &&
              [-0.22, 0, 0.22].map((dx, k) => (
                <mesh key={k} position={[dx, 0.12 + 0.28 * tray.size, (k - 1) * 0.12]} scale={tray.size}>
                  <icosahedronGeometry args={[0.24, 0]} />
                  <meshLambertMaterial color={k === 1 ? '#7cd17a' : '#5fbf5a'} emissive="#3a0a30" flatShading />
                </mesh>
              ))}
          </group>
        );
      })}
      {next.length > 0 && <Plate text={next.map((h) => harvestLabel(h.food, h.sol)).join('  ·  ')} color="#7cd17a" position={[0, 0.05, R + 1.3]} height={0.034} />}
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
      <Model name={m.model} x={0} z={0} y={0} scale={m.scale} rot={m.rot} center />
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

/**
 * Sky dome. NASA Science: by day the Mars sky is "yellow to orange" (dust); the tones here are
 * an illustration of that description, not a measured color. Night: dark blue with stars.
 */
const SKY = { dayHorizon: '#e4b77f', dayZenith: '#b9794a', nightHorizon: '#2a2440', nightZenith: '#0c0d1a' };
function SkyDome({ night }: { night: boolean }) {
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(200, 32, 16);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const lo = new THREE.Color(night ? SKY.nightHorizon : SKY.dayHorizon);
    const hi = new THREE.Color(night ? SKY.nightZenith : SKY.dayZenith);
    const c = new THREE.Color();
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const k = Math.min(1, Math.max(0, pos.getY(i) / 200) ** 0.6);
      c.copy(lo).lerp(hi, k);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [night]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} renderOrder={-1}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} fog={false} depthWrite={false} />
    </mesh>
  );
}

function Stars({ on }: { on: boolean }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 500;
    const p = new Float32Array(n * 3);
    const r = (k: number) => {
      const s = Math.sin(k * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < n; i++) {
      const a = r(i * 2 + 1) * Math.PI * 2;
      const e = 0.08 + r(i * 2 + 2) * 1.4;
      p[i * 3] = Math.cos(a) * Math.cos(e) * 180;
      p[i * 3 + 1] = Math.sin(e) * 180;
      p[i * 3 + 2] = Math.sin(a) * Math.cos(e) * 180;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  return (
    <points geometry={geo} visible={on}>
      <pointsMaterial color="#ffffff" size={2} sizeAttenuation={false} fog={false} />
    </points>
  );
}

export interface SkyEvent {
  /** 0 none, 1 low, 2 medium, 3 high (sim risk). */
  risk: number;
  /** Strike at night only if the real evidence says it reached Mars. */
  strikes: boolean;
}

/** The Sun, bigger and burning when there is a solar event; a flash and falling particles at night if it strikes. */
function SunAndStorm({ event, night, exposed }: { event: SkyEvent | null; night: boolean; exposed: boolean }) {
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
    if (flash.current) {
      const m = flash.current.material as THREE.MeshBasicMaterial;
      // Red and stronger when radiation got through the shield; violet when the shield held.
      m.color.set(exposed ? '#ff3a2a' : '#b28cff');
      m.opacity = striking ? (exposed ? 0.22 : 0.12) + (exposed ? 0.2 : 0.12) * Math.abs(Math.sin(t * (exposed ? 5 : 2.5))) : 0;
    }
  });
  return (
    <group>
      <mesh ref={sun} position={SUN_POS}>
        <sphereGeometry args={[2.4, 16, 12]} />
        <meshBasicMaterial color="#fff6e0" fog={false} />
      </mesh>
      <mesh ref={halo} position={[SUN_POS[0], SUN_POS[1], SUN_POS[2] - 1]}>
        <sphereGeometry args={[4, 16, 12]} />
        <meshBasicMaterial color="#ff7a3a" transparent opacity={0} depthWrite={false} fog={false} />
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

const ZOOM_MIN = 0.45;
const ZOOM_MAX = 1.8;

interface PlayerProps {
  target: THREE.Vector3 | null;
  onArrive: () => void;
  /** Drop the tap target without using a machine (keys pressed, or target past the limit). */
  onCancel: () => void;
  onNear: (d: Destination | null) => void;
  onEdge: (near: boolean) => void;
  skyView: boolean;
  playerRef: MutableRefObject<THREE.Group | null>;
}

function Player({ target, onArrive, onCancel, onNear, onEdge, skyView, playerRef }: PlayerProps) {
  const keys = useRef<Record<string, boolean>>({});
  const near = useRef<Destination | null>(null);
  const edge = useRef(false);
  const zoom = useRef(1);
  const look = useRef(new THREE.Vector3(0, 1, -3));
  const [walking, setWalking] = useState(false);
  const walkingRef = useRef(false);
  const { camera, size, gl } = useThree();
  const portrait = size.width < size.height;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    // Zoom changes distance AND angle: zoomed in, the camera drops toward the horizon (perspective).
    const setZoom = (factor: number) => {
      zoom.current = THREE.MathUtils.clamp(zoom.current * factor, ZOOM_MIN, ZOOM_MAX);
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(e.deltaY > 0 ? 1.1 : 0.9);
    };
    // Phone: pinch with two fingers.
    const touches = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    const pdown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };
    const pmove = (e: PointerEvent) => {
      if (!touches.has(e.pointerId)) return;
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size !== 2) return;
      const [p1, p2] = [...touches.values()] as [{ x: number; y: number }, { x: number; y: number }];
      const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (pinch > 0) setZoom(pinch / d);
      pinch = d;
    };
    const pup = (e: PointerEvent) => {
      touches.delete(e.pointerId);
      pinch = 0;
    };
    // On-screen zoom buttons (HUD) send a "mars-zoom" event with a factor.
    const zoomEvent = (e: Event) => setZoom((e as CustomEvent<number>).detail);
    const el = gl.domElement;
    globalThis.addEventListener('keydown', down);
    globalThis.addEventListener('keyup', up);
    globalThis.addEventListener('mars-zoom', zoomEvent);
    // Keys must not stay "pressed" when the window loses focus (walking that never stops).
    const blur = () => {
      keys.current = {};
    };
    globalThis.addEventListener('blur', blur);
    const noMenu = (e: Event) => e.preventDefault();
    el.addEventListener('contextmenu', noMenu);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('pointerdown', pdown);
    el.addEventListener('pointermove', pmove);
    el.addEventListener('pointerup', pup);
    el.addEventListener('pointercancel', pup);
    return () => {
      globalThis.removeEventListener('keydown', down);
      globalThis.removeEventListener('keyup', up);
      globalThis.removeEventListener('mars-zoom', zoomEvent);
      globalThis.removeEventListener('blur', blur);
      el.removeEventListener('contextmenu', noMenu);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('pointerdown', pdown);
      el.removeEventListener('pointermove', pmove);
      el.removeEventListener('pointerup', pup);
      el.removeEventListener('pointercancel', pup);
    };
  }, [gl]);

  useFrame((_, dt) => {
    const p = playerRef.current;
    if (!p) return;
    const k = keys.current;
    const dir = new THREE.Vector3((k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0), 0, (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0));
    // Keys win over an old tap target, and cancel it (otherwise he walked back to it later).
    if (dir.lengthSq() > 0 && target) onCancel();
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
      p.position.x += dir.x * SPEED * Math.min(dt, 0.05);
      p.position.z += dir.z * SPEED * Math.min(dt, 0.05);
      p.rotation.y = Math.atan2(dir.x, dir.z);
    }
    // Soft limit around the base, with a warning before it (no invisible wall).
    const ox = p.position.x - BASE_CENTER[0];
    const oz = p.position.z - BASE_CENTER[1];
    const r = Math.hypot(ox, oz);
    if (r > EDGE_MAX) {
      p.position.x = BASE_CENTER[0] + (ox / r) * EDGE_MAX;
      p.position.z = BASE_CENTER[1] + (oz / r) * EDGE_MAX;
      if (target) onCancel(); // a tap beyond the limit stops at the limit
    }
    const atEdge = r > EDGE_WARN;
    if (atEdge !== edge.current) {
      edge.current = atEdge;
      onEdge(atEdge);
    }
    p.position.y = groundHeight(p.position.x, p.position.z);
    const ease = 1 - Math.pow(0.001, Math.min(dt, 0.05));
    const z = zoom.current;
    // Height grows faster than distance: zoom in → lower, more horizontal view; zoom out → map view.
    const want = skyView
      ? new THREE.Vector3(p.position.x, p.position.y + 1.8, p.position.z) // the astronaut's eyes
      : new THREE.Vector3(p.position.x, p.position.y + 0.8 + (portrait ? 8.7 : 4.2) * z * z, p.position.z + (portrait ? 15 : 10) * z);
    camera.position.lerp(want, ease);
    const lookUp = 1.6 + Math.max(0, 1 - z) * 4; // zoomed in: look up toward the horizon and sky
    const wantLook = skyView ? new THREE.Vector3(SUN_POS[0] * 0.25, SUN_POS[1] * 0.25, SUN_POS[2] * 0.25) : new THREE.Vector3(p.position.x, p.position.y + lookUp, p.position.z - 5);
    look.current.lerp(wantLook, ease);
    camera.lookAt(look.current);
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
    <group ref={playerRef} position={[0, 0, 3]} rotation={[0, Math.PI, 0]} visible={!skyView}>
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
  harvestLabel: (n: number, sol: number) => string;
  event: SkyEvent | null;
  /** Camera looks up at the sky (day only). */
  skyView: boolean;
  /** True while the astronaut is near the edge of the walking area. */
  onEdge: (near: boolean) => void;
  habitatLabel: string;
  /** Tonight radiation got through the shield (red flash), or the shield held (violet). */
  exposed: boolean;
}

function World(props: SceneProps) {
  const { cells, open, labels, night, pulse, onUse, onNear } = props;
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [nearD, setNearD] = useState<Destination | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const pending = useRef<Destination | null>(null);
  const sky = night ? SKY.nightHorizon : SKY.dayHorizon;

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
      <fog attach="fog" args={[sky, 50, 170]} />
      <SkyDome night={night} />
      <Stars on={night} />
      <hemisphereLight args={[night ? '#5a6aa0' : '#fff1e2', '#6a3e24', night ? 0.45 : 1.15]} />
      <directionalLight position={[30, 40, 20]} intensity={night ? 0.2 : 1.35} color={night ? '#9fb0ff' : '#fff1dc'} />
      <SunAndStorm event={props.event} night={night} exposed={props.exposed} />
      <Terrain
        onGround={(p) => {
          pending.current = null;
          // A tap past the walking limit becomes a walk to the limit.
          const dx = p.x - BASE_CENTER[0];
          const dz = p.z - BASE_CENTER[1];
          const r = Math.hypot(dx, dz);
          if (r > EDGE_MAX - 0.5) p.set(BASE_CENTER[0] + (dx / r) * (EDGE_MAX - 0.5), p.y, BASE_CENTER[1] + (dz / r) * (EDGE_MAX - 0.5));
          setTarget(p);
        }}
      />
      <Model name={HABITAT.model} x={HABITAT.pos[0]} z={HABITAT.pos[1]} scale={HABITAT.scale} />
      <Plate text={props.habitatLabel} color="#f3ece6" position={[HABITAT.pos[0], groundHeight(HABITAT.pos[0], HABITAT.pos[1]) + 3.2, HABITAT.pos[1]]} />
      {SCENERY.map((s, i) => (
        <Model key={i} name={s.model} x={s.pos[0]} z={s.pos[1]} scale={s.scale} rot={s.rot} />
      ))}
      <ShieldDome cells={cells.shield} flash={night && props.event?.strikes === true} />
      <AirTank level={props.airLevel} critical={props.airCritical} label={props.airLabel} />
      <Beam on={cells.askEarth > 0} />
      {MACHINES.map((m) => {
        const isOpen = open.includes(m.d);
        // The rover is low and close to the camera: its label sits just above it.
        const top = groundHeight(m.pos[0], m.pos[1]) + (m.d === 'expedition' ? 1.1 : m.d === 'askEarth' ? 2.4 : 3.4);
        return (
          <group key={m.d} onClick={(e) => tapMachine(m, e)}>
            {m.d === 'expedition' ? (
              <Rover driving={night && cells.expedition > 0} />
            ) : m.d === 'greenhouse' ? (
              <Greenhouse growing={props.growing} harvestLabel={props.harvestLabel} />
            ) : (
              // The dish model's origin is at a corner: center it under its label.
              <Model name={m.model} x={m.pos[0]} z={m.pos[1]} scale={m.scale} rot={m.rot} center={m.d === 'askEarth'} />
            )}
            <Plate
              text={labels[m.d]}
              pips={cells[m.d] * (m.d === 'expedition' ? 2 : 1)}
              color={TONE_COLOR[m.d]}
              look={!isOpen ? 'faded' : nearD === m.d ? 'active' : 'normal'}
              position={[m.pos[0], top, m.pos[1]]}
            />
            {pulse && pulse.d === m.d && <Floater key={pulse.key} text={pulse.text} color={TONE_COLOR[m.d]} position={[m.pos[0], top + 1, m.pos[1]]} />}
          </group>
        );
      })}
      <Player
        target={target}
        playerRef={playerRef}
        skyView={props.skyView}
        onEdge={props.onEdge}
        onCancel={() => {
          pending.current = null;
          setTarget(null);
        }}
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

// The greenhouse is drawn in code (inflatable cylinder), so its Kenney model is not loaded.
for (const n of [...MACHINES.filter((m) => m.d !== 'greenhouse').map((m) => m.model), ...SCENERY.map((s) => s.model), HABITAT.model]) useGLTF.preload(M(n));
