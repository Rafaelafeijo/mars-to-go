/** Seeded randomness, so a mission can be rebuilt from its seed (career code). */
import { V } from './science';
import type { MissionDef, SpaceEvent, SolConditions } from './types';

/** mulberry32: small, fast, deterministic. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * "Surprise me": draws events from the curated catalog for some sols, and one dust sol.
 * Sol 1 is always calm so the child can plan the first harvest.
 */
export function drawSurpriseMission(seed: number, catalog: readonly SpaceEvent[]): MissionDef {
  const r = rng(seed);
  const sols: SolConditions[] = Array.from({ length: V.MISSION_SOLS }, () => ({ dust: false, event: null }));
  const dustSol = 2 + Math.floor(r() * (V.MISSION_SOLS - 2)); // sols 3..7
  const target = sols[dustSol];
  if (target) target.dust = true;
  for (let i = 1; i < V.MISSION_SOLS; i++) {
    const slot = sols[i];
    if (!slot || catalog.length === 0) continue;
    if (r() < 0.5) slot.event = catalog[Math.floor(r() * catalog.length)] ?? null;
  }
  return { id: 'surprise', mode: 'free', seed, sols };
}
