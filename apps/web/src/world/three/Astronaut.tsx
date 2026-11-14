/**
 * Astronaut: low-poly player character built only from three.js primitives.
 * Big round helmet with a gold-rimmed dark visor, puffy white suit, backpack,
 * accent-colored patches. Faces +Z, feet at y = 0, about 1.9 units tall.
 * Swings arms/legs while walking, breathes gently when idle, and stays still
 * when the user prefers reduced motion.
 */
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

const SEG = 10;
const SWING_SPEED = 6;
const SWING_AMP = 0.6;
const HIP_Y = 0.86;
const SHOULDER_Y = 1.5;

type AstronautProps = { walking: boolean; suit?: string; accent?: string };

export function Astronaut({ walking, suit = '#f2efe9', accent = '#e8703a' }: AstronautProps) {
  const [reducedMotion] = useState<boolean>(
    () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  );
  const body = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    const k = Math.min(1, delta * 10); // smoothing factor toward the target pose
    const swing = walking ? Math.sin(t * SWING_SPEED) * SWING_AMP : 0;
    const lerp = (g: THREE.Group | null, target: number) => {
      if (g) g.rotation.x += (target - g.rotation.x) * k;
    };
    lerp(leftLeg.current, swing);
    lerp(rightLeg.current, -swing);
    lerp(leftArm.current, -swing * 0.8);
    lerp(rightArm.current, swing * 0.8);
    if (body.current) {
      body.current.position.y = walking
        ? Math.abs(Math.sin(t * SWING_SPEED)) * 0.05
        : Math.sin(t * 1.6) * 0.02;
    }
  });

  const suitMat = <meshStandardMaterial color={suit} roughness={0.8} flatShading />;
  const greyMat = <meshStandardMaterial color="#8a8f99" roughness={0.7} flatShading />;
  const accentMat = <meshStandardMaterial color={accent} roughness={0.6} flatShading />;

  return (
    <group>
      {/* Legs pivot at the hips; boots sit on y = 0 */}
      {[
        { ref: leftLeg, x: 0.14 },
        { ref: rightLeg, x: -0.14 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, HIP_Y, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.42, 4, SEG]} />
            {suitMat}
          </mesh>
          <mesh position={[0, -0.32, 0.12]} castShadow>
            <sphereGeometry args={[0.07, 6, 4]} />
            {greyMat}
          </mesh>
          <mesh position={[0, -0.78, 0.04]} castShadow>
            <boxGeometry args={[0.26, 0.16, 0.36]} />
            {greyMat}
          </mesh>
        </group>
      ))}

      <group ref={body}>
        {/* Torso */}
        <mesh position={[0, 1.17, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.34, 4, SEG]} />
          {suitMat}
        </mesh>
        {/* Belt and chest stripe in accent color */}
        <mesh position={[0, 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.29, 0.04, 4, SEG]} />
          {accentMat}
        </mesh>
        <mesh position={[0, 1.42, 0.25]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.42, 0.06, 0.06]} />
          {accentMat}
        </mesh>
        {/* Chest control box with two buttons */}
        <mesh position={[0, 1.2, 0.3]} castShadow>
          <boxGeometry args={[0.24, 0.15, 0.08]} />
          {greyMat}
        </mesh>
        <mesh position={[-0.05, 1.21, 0.345]}>
          <boxGeometry args={[0.05, 0.04, 0.02]} />
          {accentMat}
        </mesh>
        <mesh position={[0.05, 1.21, 0.345]}>
          <boxGeometry args={[0.05, 0.04, 0.02]} />
          <meshStandardMaterial color="#5ec8e8" emissive="#2a7f99" flatShading />
        </mesh>
        {/* Life-support backpack */}
        <mesh position={[0, 1.25, -0.36]} castShadow>
          <boxGeometry args={[0.5, 0.62, 0.24]} />
          {suitMat}
        </mesh>
        {[-0.13, 0.13].map((x) => (
          <mesh key={x} position={[x, 1.58, -0.36]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 8]} />
            {greyMat}
          </mesh>
        ))}
        {/* Helmet: shell, gold rim and dark reflective visor facing +Z */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.3, 12, 10]} />
          {suitMat}
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.305, 12, 8, Math.PI / 2 - 1.0, 2.0, 0.85, 1.25]} />
          <meshStandardMaterial color="#c8a24a" metalness={0.6} roughness={0.25} flatShading />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.31, 12, 8, Math.PI / 2 - 0.85, 1.7, 0.95, 1.05]} />
          <meshStandardMaterial color="#2b2f3a" metalness={0.6} roughness={0.25} flatShading />
        </mesh>
        {/* Arms pivot at the shoulders */}
        {[
          { ref: leftArm, x: 0.38, tilt: 0.15 },
          { ref: rightArm, x: -0.38, tilt: -0.15 },
        ].map(({ ref, x, tilt }) => (
          <group key={x} ref={ref} position={[x, SHOULDER_Y, 0]}>
            <group rotation={[0, 0, tilt]}>
              <mesh position={[0, -0.02, 0]} castShadow>
                <sphereGeometry args={[0.14, 8, 6]} />
                {suitMat}
              </mesh>
              <mesh position={[0, 0.09, 0]}>
                <cylinderGeometry args={[0.09, 0.11, 0.05, 8]} />
                {accentMat}
              </mesh>
              <mesh position={[0, -0.3, 0]} castShadow>
                <capsuleGeometry args={[0.1, 0.36, 4, SEG]} />
                {suitMat}
              </mesh>
              <mesh position={[0, -0.6, 0]} castShadow>
                <sphereGeometry args={[0.1, 8, 6]} />
                {greyMat}
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
