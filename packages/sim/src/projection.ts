/**
 * The projection (SIM_MODEL §16, ADR-0031): "if every sol were like today".
 * Given the state and today's plan (complete or not), it returns air and food after
 * each remaining night and the sol on which each one runs out. Simplification:
 * future sols repeat today's Life Support, Greenhouse and Shield; one-sol actions
 * (Expedition, Ask Earth) are not repeated; on sols with fewer cells the plan is
 * cut (Shield first, then Greenhouse, then Life Support). Radiation damage (fewer cells the
 * next sol, ADR-0033) is projected; the dose limit is not (the game shows the dose separately).
 * It reuses resolveNight, so every number follows the same rules as the real night.
 */
import { V } from './science';
import { conditionsFor, freeCells, resolveNight } from './engine';
import type { Allocation, MissionDef, MissionState } from './types';

export interface ProjectedValue {
  sol: number;
  value: number;
}

export interface ProjectedSol {
  sol: number;
  freeCells: number;
  /** True when the repeated plan had to be cut to fit this sol's cells. */
  cut: boolean;
}

export interface Projection {
  /** Air and food after tonight. */
  tomorrow: { air: number; food: number };
  /** Value after each night, from today until the line ends (inclusive) or sol 7. */
  air: ProjectedValue[];
  food: ProjectedValue[];
  airEndsOnSol: number | null;
  foodEndsOnSol: number | null;
  reachesHome: boolean;
  sols: ProjectedSol[];
}

const CUT_ORDER = ['shield', 'greenhouse', 'lifeSupport'] as const;

/** The repeated plan for a future sol: no one-sol actions, cut to fit the free cells. */
export function fitToCells(a: Allocation, free: number): Allocation {
  const out: Allocation = { lifeSupport: a.lifeSupport, greenhouse: a.greenhouse, shield: a.shield, expedition: 0, askEarth: 0 };
  let over = out.lifeSupport + out.greenhouse + out.shield - free;
  for (const k of CUT_ORDER) {
    if (over <= 0) break;
    const take = Math.min(out[k], over);
    out[k] -= take;
    over -= take;
  }
  return out;
}

export function project(def: MissionDef, state: MissionState, today: Allocation): Projection {
  const air: ProjectedValue[] = [];
  const food: ProjectedValue[] = [];
  const sols: ProjectedSol[] = [];
  let airEndsOnSol: number | null = null;
  let foodEndsOnSol: number | null = null;
  let s: MissionState = { ...state, status: 'playing', log: [] };
  let tomorrow = { air: state.air, food: state.food };

  for (let sol = state.sol; sol <= V.MISSION_SOLS; sol++) {
    const free = freeCells(conditionsFor(def, sol).dust, s.lostCells ?? 0);
    const plan = sol === state.sol ? today : fitToCells(today, free);
    const repeated = fitToCells(today, Number.POSITIVE_INFINITY);
    const cut = sol !== state.sol && plan.lifeSupport + plan.greenhouse + plan.shield < repeated.lifeSupport + repeated.greenhouse + repeated.shield;
    sols.push({ sol, freeCells: free, cut });

    const next = resolveNight(def, { ...s, sol }, { allocation: plan }).state;
    if (sol === state.sol) tomorrow = { air: next.air, food: next.food };
    if (airEndsOnSol === null) {
      air.push({ sol, value: next.air });
      if (next.air < 0) airEndsOnSol = sol;
    }
    if (foodEndsOnSol === null) {
      food.push({ sol, value: next.food });
      if (next.food < 0) foodEndsOnSol = sol;
    }
    if (airEndsOnSol !== null && foodEndsOnSol !== null) break;
    // Keep projecting each line on its own, even after the other one ended.
    s = { ...next, status: 'playing', sol: sol + 1, log: [] };
  }

  return { tomorrow, air, food, airEndsOnSol, foodEndsOnSol, reachesHome: airEndsOnSol === null && foodEndsOnSol === null, sols };
}
