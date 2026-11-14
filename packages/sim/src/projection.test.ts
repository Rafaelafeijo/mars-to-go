import { describe, expect, it } from 'vitest';
import { newMission, resolveNight } from './engine';
import { TEST_DEF, alloc } from './fixtures';
import { fitToCells, project } from './projection';
import type { MissionState } from './types';

// TEST_DEF: sol 4 is a dust sol (3 free cells); every other sol has 7.
const start = () => newMission(TEST_DEF);

describe('fitToCells (cut rule on sols with fewer cells)', () => {
  it('keeps the plan when it fits', () => {
    expect(fitToCells(alloc([3, 0, 0, 0, 0]), 3)).toEqual(alloc([3, 0, 0, 0, 0]));
  });

  it('cuts Shield first, then Greenhouse, then Life Support', () => {
    expect(fitToCells(alloc([2, 2, 3, 0, 0]), 3)).toEqual(alloc([2, 1, 0, 0, 0]));
    expect(fitToCells(alloc([5, 2, 0, 0, 0]), 3)).toEqual(alloc([3, 0, 0, 0, 0]));
  });

  it('never repeats one-sol actions (Expedition, Ask Earth)', () => {
    expect(fitToCells(alloc([3, 0, 0, 1, 1]), 7)).toEqual(alloc([3, 0, 0, 0, 0]));
  });
});

describe('project: "if every sol were like today" (SIM_MODEL §16)', () => {
  it('today\'s values are exactly the night the simulation will resolve', () => {
    const s = start();
    const a = alloc([5, 2, 0, 0, 0]);
    const p = project(TEST_DEF, s, a);
    const real = resolveNight(TEST_DEF, s, { allocation: a }).state;
    expect(p.tomorrow).toEqual({ air: real.air, food: real.food });
  });

  it('Game A sol 1 plan reaches home: cut on the dust sol, harvests arrive two sols later', () => {
    const p = project(TEST_DEF, start(), alloc([5, 2, 0, 0, 0]));
    expect(p.air.map((x) => x.value)).toEqual([10, 10, 10, 8, 8, 8, 8]);
    expect(p.food.map((x) => x.value)).toEqual([4, 2, 4, 6, 8, 6, 8]);
    expect(p.airEndsOnSol).toBeNull();
    expect(p.foodEndsOnSol).toBeNull();
    expect(p.reachesHome).toBe(true);
  });

  it('all cells in Life Support: the food runs out on sol 4', () => {
    const p = project(TEST_DEF, start(), alloc([7, 0, 0, 0, 0]));
    expect(p.food.map((x) => x.value)).toEqual([4, 2, 0, -2]);
    expect(p.foodEndsOnSol).toBe(4);
    expect(p.airEndsOnSol).toBeNull();
    expect(p.reachesHome).toBe(false);
  });

  it('too little Life Support: the air runs out on sol 6', () => {
    const p = project(TEST_DEF, start(), alloc([3, 4, 0, 0, 0]));
    expect(p.air.map((x) => x.value)).toEqual([8, 6, 4, 2, 0, -2]);
    expect(p.airEndsOnSol).toBe(6);
  });

  it('an expedition costs air today only', () => {
    const p = project(TEST_DEF, start(), alloc([3, 0, 0, 1, 0]));
    expect(p.air.map((x) => x.value)).toEqual([6, 4, 2, 0, -2]);
    expect(p.airEndsOnSol).toBe(5);
  });

  it('counts harvests already on the way', () => {
    const s: MissionState = { ...start(), sol: 3, food: 2, pendingHarvests: [{ sol: 3, food: 4 }, { sol: 4, food: 2 }] };
    const p = project(TEST_DEF, s, alloc([7, 0, 0, 0, 0]));
    expect(p.food.map((x) => x.value)).toEqual([4, 4, 2, 0, -2]);
    expect(p.food[0]?.sol).toBe(3);
    expect(p.foodEndsOnSol).toBe(7);
  });

  it('marks each projected sol with its free cells and whether the plan was cut', () => {
    const p = project(TEST_DEF, start(), alloc([5, 2, 0, 0, 0]));
    expect(p.sols.map((x) => x.freeCells)).toEqual([7, 7, 7, 3, 7, 7, 7]);
    expect(p.sols.map((x) => x.cut)).toEqual([false, false, false, true, false, false, false]);
  });

  it('works with a partial plan while the child is still placing cells', () => {
    const p = project(TEST_DEF, start(), alloc([0, 0, 0, 0, 0]));
    expect(p.tomorrow).toEqual({ air: 5, food: 4 });
    expect(p.air.map((x) => x.value)).toEqual([5, 0, -5]);
    expect(p.airEndsOnSol).toBe(3);
    // Each line runs on its own: the food line keeps going after the air line stops.
    expect(p.foodEndsOnSol).toBe(4);
  });
});
