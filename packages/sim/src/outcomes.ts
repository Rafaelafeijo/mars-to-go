/** Results, words and hindsight (SIM_MODEL §7, ADR-0020). */
import { V } from './science';
import { resolveNight } from './engine';
import type { Allocation, MissionDef, MissionState } from './types';

export type MeterWord = 'critical' | 'tight' | 'safe' | 'plenty';
export type ExposureWord = 'low' | 'medium' | 'high';
export type Verdict = 'early_return' | 'on_edge' | 'with_margin' | 'reference';

export function airSols(air: number): number {
  return Math.max(0, Math.floor(air / V.AIR_USE_PER_SOL));
}

export function foodSols(food: number): number {
  return Math.max(0, Math.floor(food / V.FOOD_USE_PER_SOL));
}

/** "There was air and food for N more sols." */
export function marginSols(state: Pick<MissionState, 'air' | 'food'>): number {
  return Math.min(airSols(state.air), foodSols(state.food));
}

/** Meter word by sols of reserve: 0 critical · 1 tight · 2 safe · ≥ 3 plenty. */
export function meterWord(solsOfReserve: number): MeterWord {
  if (solsOfReserve <= 0) return 'critical';
  if (solsOfReserve === 1) return 'tight';
  if (solsOfReserve === 2) return 'safe';
  return 'plenty';
}

export function exposureWord(exposure: number): ExposureWord {
  if (exposure <= V.EXPOSURE_LOW_MAX) return 'low';
  if (exposure <= V.EXPOSURE_MEDIUM_MAX) return 'medium';
  return 'high';
}

export function verdict(state: MissionState): Verdict | null {
  if (state.status === 'early_return') return 'early_return';
  if (state.status !== 'returned_all') return null;
  const margin = marginSols(state);
  if (margin === 0) return 'on_edge';
  if (exposureWord(state.exposure) === 'low' && state.discoveries.length >= 1) return 'reference';
  return 'with_margin';
}

export interface MissionObjectives {
  /** Everyone came home on the rocket. */
  home: boolean;
  /** At least SAMPLES_GOAL rock samples (rover trips) are on the rocket. */
  sample: boolean;
  /** The crew's dose stayed within the limit. */
  dose: boolean;
}

/** The three mission objectives (ADR-0033); a mission may ask for the sample from one site (ADR-0035). */
export function missionObjectives(state: MissionState, def?: Pick<MissionDef, 'sampleSite'>): MissionObjectives {
  return {
    home: state.status === 'returned_all',
    sample: def?.sampleSite ? state.discoveries.includes(def.sampleSite) : state.discoveries.length >= V.SAMPLES_GOAL,
    dose: state.exposure <= V.DOSE_LIMIT,
  };
}

export type MissionResult = 'success' | 'with_failures' | 'early_return';

/** Success = all three objectives; home but an objective missed = with failures. */
export function missionResult(state: MissionState, def?: Pick<MissionDef, 'sampleSite'>): MissionResult | null {
  if (state.status === 'playing') return null;
  if (state.status === 'early_return') return 'early_return';
  const o = missionObjectives(state, def);
  return o.home && o.sample && o.dose ? 'success' : 'with_failures';
}

/**
 * "The sol where everything changed": the last sol a different plan could have fixed it.
 * Food: failedSol − GREENHOUSE_DELAY_SOLS. Air: failedSol − 1. Never before sol 1.
 */
export function turningPointSol(state: MissionState): number | null {
  if (!state.failure) return null;
  // Radiation: the night it went over was the last chance (shield that night).
  const back = state.failure.cause === 'food' ? V.GREENHOUSE_DELAY_SOLS : state.failure.cause === 'radiation' ? 0 : 1;
  return Math.max(1, state.failure.sol - back);
}

export interface Outcome {
  air: number;
  food: number;
  exposure: number;
}

const MOVABLE = ['lifeSupport', 'greenhouse', 'shield'] as const;

/** Allocations that differ by moving one cell between Life Support, Greenhouse and Shield. */
export function oneCellMoves(a: Allocation): Allocation[] {
  const out: Allocation[] = [];
  for (const from of MOVABLE) {
    if (a[from] === 0) continue;
    for (const to of MOVABLE) {
      if (to === from) continue;
      out.push({ ...a, [from]: a[from] - 1, [to]: a[to] + 1 });
    }
  }
  return out;
}

function outcomeOf(def: MissionDef, state: MissionState, a: Allocation): Outcome {
  const s = resolveNight(def, state, { allocation: a }).state;
  return { air: s.air, food: s.food, exposure: s.exposure };
}

const same = (x: Outcome, y: Outcome) => x.air === y.air && x.food === y.food && x.exposure === y.exposure;

/**
 * Three options for "pick the result" (ADR-0020): the real outcome plus two
 * built by moving one cell. Order is shuffled deterministically by sol.
 */
export function predictionOptions(def: MissionDef, state: MissionState, a: Allocation): { options: Outcome[]; correctIndex: number } {
  const real = outcomeOf(def, state, a);
  const others: Outcome[] = [];
  for (const alt of oneCellMoves(a)) {
    const o = outcomeOf(def, state, alt);
    if (!same(o, real) && !others.some((x) => same(x, o))) others.push(o);
    if (others.length === 2) break;
  }
  while (others.length < 2) {
    const k = others.length + 1;
    others.push({ air: real.air + k, food: real.food, exposure: real.exposure });
  }
  const correctIndex = state.sol % 3;
  const options = [...others];
  options.splice(correctIndex, 0, real);
  return { options, correctIndex };
}

/** One "what if you had…?" line: the first one-cell move that changes the result. */
export function whatIf(def: MissionDef, state: MissionState, a: Allocation): { allocation: Allocation; outcome: Outcome } | null {
  const real = outcomeOf(def, state, a);
  for (const alt of oneCellMoves(a)) {
    const o = outcomeOf(def, state, alt);
    if (!same(o, real)) return { allocation: alt, outcome: o };
  }
  return null;
}
