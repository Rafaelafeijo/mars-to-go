/**
 * The rules of one sol (SIM_MODEL §4). Pure functions: same input, same output.
 * The UI only displays what these functions return (ADR-0009, ADR-0020).
 */
import { V } from './science';
import type {
  Allocation,
  Destination,
  EarthAnswer,
  MissionDef,
  MissionState,
  NightStep,
  SolConditions,
  SolPlan,
} from './types';

/** Discovery sites at Jezero (DATA_MAP J2–J4). Text and photos live in packages/content. */
export const DISCOVERY_IDS = ['rochette', 'kodiak', 'delta-front'] as const;

export function newMission(def: MissionDef): MissionState {
  return {
    version: 1,
    missionId: def.id,
    seed: def.seed,
    mode: def.mode,
    sol: 1,
    air: V.AIR_START,
    food: V.FOOD_START,
    exposure: 0,
    pendingHarvests: [],
    discoveries: [],
    log: [],
    status: 'playing',
    assistedUsed: false,
  };
}

export function conditionsFor(def: MissionDef, sol: number): SolConditions {
  return def.sols[sol - 1] ?? { dust: false, event: null };
}

/** Cells the child can place: total cells minus the fixed heating cells, minus cells lost to radiation damage (ADR-0033). */
export function freeCells(dust: boolean, lostCells = 0): number {
  return Math.max(0, (dust ? V.CELLS_DUST_SOL : V.CELLS_PER_SOL) - V.HEATING_CELLS - lostCells);
}

/** Guided mission 1 unlocks destinations over time (ADR-0019). */
export function openDestinations(mode: MissionState['mode'], sol: number): Destination[] {
  if (mode === 'free' || sol >= 3) return ['lifeSupport', 'greenhouse', 'shield', 'expedition', 'askEarth'];
  if (sol === 2) return ['lifeSupport', 'greenhouse', 'shield'];
  return ['lifeSupport', 'greenhouse'];
}

/** Sol on which each destination opens in guided mode. */
export function unlockSol(dest: Destination): number {
  if (dest === 'shield') return 2;
  if (dest === 'expedition' || dest === 'askEarth') return 3;
  return 1;
}

export function cellsUsed(a: Allocation): number {
  return a.lifeSupport + a.greenhouse + a.shield + a.expedition * V.EXPEDITION_CELLS + a.askEarth * V.ASK_EARTH_CELLS;
}

export type AllocationError =
  | { code: 'negative' }
  | { code: 'notWhole' }
  | { code: 'locked'; destination: Destination; opensOnSol: number }
  | { code: 'wrongTotal'; used: number; free: number };

/** Every free cell must be placed: the battery cannot store them (simplification, SIM_MODEL §4.2). */
export function validateAllocation(state: MissionState, a: Allocation, dust: boolean): AllocationError[] {
  const errors: AllocationError[] = [];
  const counts = [a.lifeSupport, a.greenhouse, a.shield];
  if (counts.some((n) => n < 0)) errors.push({ code: 'negative' });
  if (counts.some((n) => !Number.isInteger(n))) errors.push({ code: 'notWhole' });
  const open = openDestinations(state.mode, state.sol);
  const used: [Destination, number][] = [
    ['lifeSupport', a.lifeSupport],
    ['greenhouse', a.greenhouse],
    ['shield', a.shield],
    ['expedition', a.expedition],
    ['askEarth', a.askEarth],
  ];
  for (const [dest, n] of used) {
    if (n > 0 && !open.includes(dest)) errors.push({ code: 'locked', destination: dest, opensOnSol: unlockSol(dest) });
  }
  const free = freeCells(dust, state.lostCells ?? 0);
  const total = cellsUsed(a);
  if (total !== free) errors.push({ code: 'wrongTotal', used: total, free });
  return errors;
}

/** Applies a crisis choice that changes the allocation itself (solar storm: shield swap). */
function applyCrisisToAllocation(a: Allocation, plan: SolPlan): Allocation {
  if (plan.crisis?.kind === 'solarStorm' && plan.crisis.choice === 'moveToShield') {
    const moved = Math.min(V.CRISIS_SHIELD_SWAP_CELLS, a.lifeSupport);
    return { ...a, lifeSupport: a.lifeSupport - moved, shield: a.shield + moved };
  }
  return a;
}

export interface NightResult {
  state: MissionState;
  steps: NightStep[];
  earthAnswer?: EarthAnswer;
}

/**
 * Resolves the night of the current sol, in the fixed order of SIM_MODEL §4.4.
 * Also used as a live preview while the child moves cells (no validation here;
 * call validateAllocation before locking the plan).
 */
export function resolveNight(def: MissionDef, state: MissionState, plan: SolPlan): NightResult {
  const sol = state.sol;
  const cond = conditionsFor(def, sol);
  const a = applyCrisisToAllocation(plan.allocation, plan);
  const steps: NightStep[] = [];
  let { air, food, exposure } = state;
  let pending = state.pendingHarvests.map((h) => ({ ...h }));
  const discoveries = [...state.discoveries];

  const push = (step: Omit<NightStep, 'after'> & { after?: number }) => {
    steps.push({ ...step, after: step.after ?? step.before + step.delta });
  };

  // 1. Life support makes air.
  const made = a.lifeSupport * V.AIR_PER_LIFE_SUPPORT_CELL;
  push({ id: 'lifeSupport', resource: 'air', before: air, delta: made, detail: { cells: a.lifeSupport }, scienceIds: ['AIR_PER_LIFE_SUPPORT_CELL', 'MOXIE_TOTAL_O2_G'] });
  air += made;

  // Greenhouse failure crisis: save the harvest with air, or lose the next harvest.
  if (plan.crisis?.kind === 'greenhouse') {
    if (plan.crisis.choice === 'saveHarvest') {
      push({ id: 'greenhouseRescue', resource: 'air', before: air, delta: -V.GREENHOUSE_RESCUE_AIR, scienceIds: ['GREENHOUSE_RESCUE_AIR'] });
      air -= V.GREENHOUSE_RESCUE_AIR;
    } else {
      const next = [...pending].sort((x, y) => x.sol - y.sol)[0];
      if (next) {
        pending = pending.filter((h) => h !== next);
        push({ id: 'harvestLost', resource: 'food', before: food, delta: 0, detail: { lostFood: next.food, harvestSol: next.sol }, scienceIds: [] });
      }
    }
  }

  // 2. Harvest what was planted GREENHOUSE_DELAY_SOLS ago.
  const harvested = pending.filter((h) => h.sol === sol).reduce((s, h) => s + h.food, 0);
  pending = pending.filter((h) => h.sol !== sol);
  push({ id: 'harvest', resource: 'food', before: food, delta: harvested, scienceIds: ['FOOD_PER_GREENHOUSE_CELL', 'GREENHOUSE_DELAY_SOLS', 'VEGGIE_LETTUCE_DAYS'] });
  food += harvested;

  // 3. Plant today; it pays on sol + delay (never inside the mission if that is after the last sol).
  const planted = a.greenhouse * V.FOOD_PER_GREENHOUSE_CELL;
  const harvestSol = sol + V.GREENHOUSE_DELAY_SOLS;
  if (planted > 0) pending.push({ sol: harvestSol, food: planted });
  push({
    id: 'plant', resource: 'none', before: 0, delta: 0, after: 0,
    detail: { cells: a.greenhouse, food: planted, harvestSol, paysInMission: harvestSol <= V.MISSION_SOLS },
    scienceIds: ['FOOD_PER_GREENHOUSE_CELL', 'GREENHOUSE_DELAY_SOLS'],
  });

  // 4. Breathe and eat.
  push({ id: 'breathe', resource: 'air', before: air, delta: -V.AIR_USE_PER_SOL, scienceIds: ['AIR_USE_PER_SOL', 'CREW_O2_KG_PER_DAY'] });
  air -= V.AIR_USE_PER_SOL;
  push({ id: 'eat', resource: 'food', before: food, delta: -V.FOOD_USE_PER_SOL, scienceIds: ['FOOD_USE_PER_SOL'] });
  food -= V.FOOD_USE_PER_SOL;

  // 5. Expedition: suits use stored air; outside, the habitat no longer protects the crew.
  if (a.expedition === 1) {
    const recalled = plan.crisis?.kind === 'solarStorm' && plan.crisis.choice === 'recallExpedition';
    push({ id: recalled ? 'expeditionRecalled' : 'expedition', resource: 'air', before: air, delta: -V.EXPEDITION_AIR, scienceIds: ['EXPEDITION_AIR'] });
    air -= V.EXPEDITION_AIR;
    if (!recalled) {
      const site = a.expeditionSite ?? DISCOVERY_IDS.find((d) => !discoveries.includes(d)) ?? DISCOVERY_IDS[0];
      if (!discoveries.includes(site)) discoveries.push(site);
      push({ id: 'outside', resource: 'exposure', before: exposure, delta: V.EXPEDITION_EXPOSURE, detail: { site }, scienceIds: ['EXPEDITION_EXPOSURE'] });
      exposure += V.EXPEDITION_EXPOSURE;
    }
  }

  // 6. Radiation: only if the event really reaches Mars; shield cells are spent either way.
  const ev = cond.event;
  const reaches = ev?.reachesMars === true;
  const risk = ev?.risk ?? 0;
  const added = reaches ? Math.max(0, risk - a.shield * V.SHIELD_BLOCK_PER_CELL) : 0;
  push({
    id: 'radiation', resource: 'exposure', before: exposure, delta: added,
    detail: { eventId: ev?.id ?? null, risk, shield: a.shield, reachesMars: ev ? ev.reachesMars : null },
    scienceIds: ['SHIELD_BLOCK_PER_CELL'],
  });
  exposure += added;

  // 6b. ADR-0033: what the shield did not block also damages the electronics: fewer cells tomorrow.
  const lostCells = Math.min(V.RADIATION_DAMAGE_MAX_CELLS, added * V.RADIATION_DAMAGE_CELLS_PER_POINT);
  if (lostCells > 0) {
    push({
      id: 'damage', resource: 'none', before: 0, delta: 0, after: 0,
      detail: { cells: lostCells, sol: sol + 1 },
      scienceIds: ['RADIATION_DAMAGE_CELLS_PER_POINT', 'RADIATION_DAMAGE_MAX_CELLS'],
    });
  }

  // 7. Earth's answer about tomorrow arrives tonight, after the plan was locked (ADR-0025).
  let earthAnswer: EarthAnswer | undefined;
  if (a.askEarth === 1) {
    const aboutSol = sol < V.MISSION_SOLS ? sol + 1 : null;
    const tomorrow = aboutSol ? conditionsFor(def, aboutSol).event : null;
    earthAnswer = {
      askedOnSol: sol,
      aboutSol,
      reachesMars: aboutSol ? (tomorrow ? tomorrow.reachesMars : false) : null,
      eventId: tomorrow?.id ?? null,
    };
    push({
      id: 'earthAnswer', resource: 'none', before: 0, delta: 0, after: 0,
      detail: { aboutSol, reachesMars: earthAnswer.reachesMars, eventId: earthAnswer.eventId, minMinutes: V.RADIO_DELAY_MIN_MINUTES, maxMinutes: V.RADIO_DELAY_MAX_MINUTES },
      scienceIds: ['RADIO_DELAY_MIN_MINUTES', 'RADIO_DELAY_MAX_MINUTES'],
    });
  }

  // 8. End check (SIM_MODEL §7).
  let status: MissionState['status'] = 'playing';
  let failure: MissionState['failure'];
  if (air < 0 || food < 0) {
    status = 'early_return';
    failure = { sol, cause: air < 0 ? 'air' : 'food' };
  } else if (exposure > V.DOSE_LIMIT) {
    // ADR-0033: over the dose limit, the flight surgeon brings the crew home.
    status = 'early_return';
    failure = { sol, cause: 'radiation' };
  } else if (sol >= V.MISSION_SOLS) {
    status = 'returned_all';
  }

  const next: MissionState = {
    ...state,
    sol: status === 'playing' ? sol + 1 : sol,
    air,
    food,
    exposure,
    lostCells,
    pendingHarvests: pending,
    discoveries,
    status,
    ...(failure ? { failure } : {}),
    log: [...state.log, { sol, plan, steps, ...(earthAnswer ? { earthAnswer } : {}) }],
  };
  return { state: next, steps, ...(earthAnswer ? { earthAnswer } : {}) };
}

/** Tomorrow's forecast shown today as "maybe" (ADR-0025). */
export function tomorrowForecast(def: MissionDef, sol: number): SolConditions | null {
  return sol < V.MISSION_SOLS ? conditionsFor(def, sol + 1) : null;
}

/** A solar storm crisis needs a fast event with risk ≥ 2 (SIM_MODEL §6). */
export function crisisFor(def: MissionDef, sol: number): 'solarStorm' | 'dust' | 'greenhouse' | null {
  const cond = conditionsFor(def, sol);
  if (cond.event && cond.event.fast && cond.event.risk >= 2) return 'solarStorm';
  return cond.crisis ?? null;
}
