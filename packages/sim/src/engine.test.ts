import { describe, expect, it } from 'vitest';
import {
  cellsUsed,
  crisisFor,
  freeCells,
  newMission,
  openDestinations,
  resolveNight,
  tomorrowForecast,
  validateAllocation,
} from './engine';
import { exposureWord, marginSols, meterWord, missionObjectives, missionResult, predictionOptions, turningPointSol, verdict, whatIf } from './outcomes';
import { GAME_A, GAME_B, GAME_BONUS, GAME_C, TEST_DEF, alloc, type Row } from './fixtures';
import type { MissionDef, MissionState } from './types';

function play(rows: Row[], def: MissionDef = TEST_DEF) {
  let s = newMission(def);
  const nights: { air: number; food: number; exposure: number }[] = [];
  for (const row of rows) {
    const a = alloc(row);
    expect(validateAllocation(s, a, def.sols[s.sol - 1]?.dust ?? false), `sol ${s.sol}`).toEqual([]);
    s = resolveNight(def, s, { allocation: a }).state;
    nights.push({ air: s.air, food: s.food, exposure: s.exposure });
  }
  return { state: s, nights };
}

const triples = (n: { air: number; food: number; exposure: number }[]) => n.map((x) => [x.air, x.food, x.exposure]);

describe('worked games (SIM_MODEL §8)', () => {
  it('Game A "Guardian": everyone home, with margin', () => {
    const { state, nights } = play(GAME_A);
    expect(triples(nights)).toEqual([[10, 4, 0], [8, 2, 0], [8, 4, 0], [6, 6, 0], [5, 8, 0], [6, 6, 0], [8, 4, 0]]);
    expect(state.status).toBe('returned_all');
    expect(marginSols(state)).toBe(1);
    expect(exposureWord(state.exposure)).toBe('low');
    expect(verdict(state)).toBe('with_margin');
  });

  it('Game B "Scientist" (ADR-0033): no shield on a risk-2 night after a rover trip → dose over the limit, early return on sol 2', () => {
    const { state, nights } = play(GAME_B.slice(0, 2));
    expect(triples(nights)).toEqual([[10, 4, 0], [7, 2, 3]]);
    expect(state.status).toBe('early_return');
    expect(state.failure).toEqual({ sol: 2, cause: 'radiation' });
    expect(exposureWord(state.exposure)).toBe('high');
    expect(verdict(state)).toBe('early_return');
  });

  it('Game C: early return on night 5 for food; the sol where everything changed is 3', () => {
    const { state, nights } = play(GAME_C);
    expect(triples(nights)).toEqual([[8, 4, 1], [7, 2, 1], [4, 0, 2], [2, 0, 2], [1, -2, 2]]);
    expect(state.status).toBe('early_return');
    expect(state.failure).toEqual({ sol: 5, cause: 'food' });
    expect(turningPointSol(state)).toBe(3);
    expect(verdict(state)).toBe('early_return');
  });

  it('Bonus: a reference mission exists, as a bet on sol 6', () => {
    const { state } = play(GAME_BONUS);
    expect([state.air, state.food, state.exposure]).toEqual([5, 4, 1]);
    expect(verdict(state)).toBe('reference');
  });
});

describe('allocation', () => {
  it('free cells: 7 on a normal sol, 3 on a dust sol', () => {
    expect(freeCells(false)).toBe(7);
    expect(freeCells(true)).toBe(3);
  });

  it('rejects an allocation that does not use exactly the free cells', () => {
    const s = newMission(TEST_DEF);
    expect(validateAllocation(s, alloc([5, 1, 0, 0, 0]), false)).toEqual([{ code: 'wrongTotal', used: 6, free: 7 }]);
    expect(validateAllocation(s, alloc([5, 3, 0, 0, 0]), false)).toEqual([{ code: 'wrongTotal', used: 8, free: 7 }]);
  });

  it('counts expedition as 2 cells and Ask Earth as 1', () => {
    expect(cellsUsed(alloc([1, 1, 1, 1, 1]))).toBe(6);
  });

  it('rejects negative and fractional cells', () => {
    const s = newMission(TEST_DEF);
    expect(validateAllocation(s, { lifeSupport: 8, greenhouse: -1, shield: 0, expedition: 0, askEarth: 0 }, false)).toContainEqual({ code: 'negative' });
    expect(validateAllocation(s, { lifeSupport: 6.5, greenhouse: 0.5, shield: 0, expedition: 0, askEarth: 0 }, false)).toContainEqual({ code: 'notWhole' });
  });
});

describe('guided mission 1 (ADR-0019)', () => {
  const guided: MissionDef = { ...TEST_DEF, id: 'm1', mode: 'guided' };

  it('opens destinations over time', () => {
    expect(openDestinations('guided', 1)).toEqual(['lifeSupport', 'greenhouse']);
    expect(openDestinations('guided', 2)).toEqual(['lifeSupport', 'greenhouse', 'shield']);
    expect(openDestinations('guided', 3)).toHaveLength(5);
    expect(openDestinations('free', 1)).toHaveLength(5);
  });

  it('rejects a locked destination and says when it opens', () => {
    const s = newMission(guided);
    expect(validateAllocation(s, alloc([5, 0, 2, 0, 0]), false)).toEqual([{ code: 'locked', destination: 'shield', opensOnSol: 2 }]);
  });

  it('uses the same night rules as free mode (Game A respects the unlocks)', () => {
    const free = play(GAME_A).state;
    const g = play(GAME_A, guided).state;
    expect([g.air, g.food, g.exposure]).toEqual([free.air, free.food, free.exposure]);
  });
});

describe('night rules', () => {
  it('greenhouse planted on sol s pays on night s + 2, never before', () => {
    let s = newMission(TEST_DEF);
    s = resolveNight(TEST_DEF, s, { allocation: alloc([5, 2, 0, 0, 0]) }).state; // plant 4 for night 3
    expect(s.food).toBe(4);
    s = resolveNight(TEST_DEF, s, { allocation: alloc([5, 0, 2, 0, 0]) }).state;
    expect(s.food).toBe(2);
    s = resolveNight(TEST_DEF, s, { allocation: alloc([7, 0, 0, 0, 0]) }).state;
    expect(s.food).toBe(4); // 2 + 4 − 2
  });

  it('plantings on sols 6–7 never pay inside the mission', () => {
    let s: MissionState = { ...newMission(TEST_DEF), sol: 6 };
    const night6 = resolveNight(TEST_DEF, s, { allocation: alloc([5, 2, 0, 0, 0]) });
    expect(night6.steps.find((x) => x.id === 'plant')?.detail?.paysInMission).toBe(false);
    s = night6.state;
    const night7 = resolveNight(TEST_DEF, s, { allocation: alloc([5, 2, 0, 0, 0]) });
    expect(night7.steps.find((x) => x.id === 'harvest')?.delta).toBe(0);
  });

  it('shield reduces exposure only when the event reaches Mars; the cells are spent anyway', () => {
    const s5: MissionState = { ...newMission(TEST_DEF), sol: 5 };
    expect(resolveNight(TEST_DEF, s5, { allocation: alloc([7, 0, 0, 0, 0]) }).state.exposure).toBe(3);
    expect(resolveNight(TEST_DEF, s5, { allocation: alloc([5, 0, 2, 0, 0]) }).state.exposure).toBe(1);
    const s6: MissionState = { ...newMission(TEST_DEF), sol: 6 };
    const missed = resolveNight(TEST_DEF, s6, { allocation: alloc([6, 0, 1, 0, 0]) });
    expect(missed.state.exposure).toBe(0);
    expect(missed.state.air).toBe(10 + 6 - 5);
  });

  it('returns the steps in the fixed order, each with after = before + delta', () => {
    const s: MissionState = { ...newMission(TEST_DEF), sol: 2, pendingHarvests: [{ sol: 2, food: 4 }] };
    const { steps } = resolveNight(TEST_DEF, s, { allocation: alloc([2, 1, 1, 1, 1]) });
    expect(steps.map((x) => x.id)).toEqual(['lifeSupport', 'harvest', 'plant', 'breathe', 'eat', 'expedition', 'outside', 'radiation', 'damage', 'earthAnswer']);
    for (const step of steps) expect(step.after).toBe(step.before + step.delta);
  });
});

describe('Ask Earth (ADR-0025)', () => {
  it('answers tonight about tomorrow, with the real catalog field', () => {
    const s: MissionState = { ...newMission(TEST_DEF), sol: 5 };
    const night = resolveNight(TEST_DEF, s, { allocation: alloc([3, 0, 3, 0, 1]) });
    expect(night.earthAnswer).toEqual({ askedOnSol: 5, aboutSol: 6, reachesMars: false, eventId: 'test-risk1-miss' });
    expect(night.state.log.at(-1)?.earthAnswer?.aboutSol).toBe(6);
  });

  it('is useless on sol 7: no tomorrow in the mission', () => {
    const s: MissionState = { ...newMission(TEST_DEF), sol: 7 };
    expect(resolveNight(TEST_DEF, s, { allocation: alloc([6, 0, 0, 0, 1]) }).earthAnswer).toEqual({ askedOnSol: 7, aboutSol: null, reachesMars: null, eventId: null });
  });

  it('shows tomorrow\'s forecast today, and none on the last sol', () => {
    expect(tomorrowForecast(TEST_DEF, 1)?.event?.id).toBe('test-risk2-hit');
    expect(tomorrowForecast(TEST_DEF, 7)).toBeNull();
  });
});

describe('crises (SIM_MODEL §6)', () => {
  const stormDef: MissionDef = {
    ...TEST_DEF,
    sols: TEST_DEF.sols.map((c, i) => (i === 1 ? { ...c, event: { id: 'storm', risk: 3, reachesMars: true, fast: true } } : c)),
  };
  const s2: MissionState = { ...newMission(stormDef), sol: 2 };

  it('a fast event with risk ≥ 2 triggers the solar storm crisis', () => {
    expect(crisisFor(stormDef, 2)).toBe('solarStorm');
    expect(crisisFor(TEST_DEF, 2)).toBeNull();
  });

  it('moving cells to the shield costs air tonight and protects the crew', () => {
    const keep = resolveNight(stormDef, s2, { allocation: alloc([5, 0, 0, 1, 0]), crisis: { kind: 'solarStorm', choice: 'keepPlan' } }).state;
    const move = resolveNight(stormDef, s2, { allocation: alloc([5, 0, 0, 1, 0]), crisis: { kind: 'solarStorm', choice: 'moveToShield' } }).state;
    expect(move.air).toBe(keep.air - 2);
    expect(move.exposure).toBe(keep.exposure - 2);
  });

  it('recalling the expedition: no discovery, no outside exposure, the air was already spent', () => {
    const keep = resolveNight(stormDef, s2, { allocation: alloc([5, 0, 0, 1, 0]), crisis: { kind: 'solarStorm', choice: 'keepPlan' } }).state;
    const recall = resolveNight(stormDef, s2, { allocation: alloc([5, 0, 0, 1, 0]), crisis: { kind: 'solarStorm', choice: 'recallExpedition' } }).state;
    expect(recall.discoveries).toEqual([]);
    expect(keep.discoveries).toHaveLength(1);
    expect(recall.exposure).toBe(keep.exposure - 1);
    expect(recall.air).toBe(keep.air);
  });

  it('greenhouse failure: save the harvest with air, or lose the next harvest', () => {
    const s: MissionState = { ...newMission(TEST_DEF), sol: 3, pendingHarvests: [{ sol: 3, food: 4 }] };
    const save = resolveNight(TEST_DEF, s, { allocation: alloc([7, 0, 0, 0, 0]), crisis: { kind: 'greenhouse', choice: 'saveHarvest' } }).state;
    const lose = resolveNight(TEST_DEF, s, { allocation: alloc([7, 0, 0, 0, 0]), crisis: { kind: 'greenhouse', choice: 'keepPlan' } }).state;
    expect([save.air, save.food]).toEqual([10, 8]);
    expect([lose.air, lose.food]).toEqual([12, 4]);
  });
});

describe('words and hindsight', () => {
  it('meter words by sols of reserve', () => {
    expect([0, 1, 2, 3, 9].map(meterWord)).toEqual(['critical', 'tight', 'safe', 'plenty', 'plenty']);
  });

  it('exposure words (ADR-0033): low 0–1, medium 2 (the limit), high above the limit', () => {
    expect([0, 1, 2, 3, 6].map(exposureWord)).toEqual(['low', 'low', 'medium', 'high', 'high']);
  });

  it('ADR-0033: unblocked radiation damages the electronics: fewer cells next sol (max 2)', () => {
    const s0 = newMission(TEST_DEF);
    const s1 = resolveNight(TEST_DEF, s0, { allocation: alloc([5, 2, 0, 0, 0]) }).state;
    expect(s1.sol).toBe(2);
    // Sol 2: risk 2 reaches Mars, 1 shield cell blocks 1 → 1 point gets through.
    const n2 = resolveNight(TEST_DEF, s1, { allocation: alloc([5, 1, 1, 0, 0]) });
    expect(n2.state.exposure).toBe(1);
    expect(n2.steps.find((x) => x.id === 'damage')?.detail?.cells).toBe(1);
    expect(n2.state.lostCells).toBe(1);
    expect(freeCells(false, n2.state.lostCells)).toBe(6);
    // The next plan must fit the damaged budget.
    expect(validateAllocation(n2.state, alloc([5, 2, 0, 0, 0]), false)).toEqual([{ code: 'wrongTotal', used: 7, free: 6 }]);
    expect(validateAllocation(n2.state, alloc([5, 1, 0, 0, 0]), false)).toEqual([]);
    // Damage lasts one sol only.
    const n3 = resolveNight(TEST_DEF, n2.state, { allocation: alloc([5, 1, 0, 0, 0]) });
    expect(n3.state.lostCells ?? 0).toBe(0);
  });

  it('ADR-0033: a fully shielded event does no damage', () => {
    const s1 = resolveNight(TEST_DEF, newMission(TEST_DEF), { allocation: alloc([5, 2, 0, 0, 0]) }).state;
    const n2 = resolveNight(TEST_DEF, s1, { allocation: alloc([3, 2, 2, 0, 0]) });
    expect(n2.steps.some((x) => x.id === 'damage')).toBe(false);
    expect(n2.state.lostCells ?? 0).toBe(0);
  });

  it('ADR-0033: mission objectives — home, a rock sample, dose within the limit', () => {
    const a = play(GAME_A).state;
    expect(missionObjectives(a)).toEqual({ home: true, sample: false, dose: true });
    expect(missionResult(a)).toBe('with_failures');
    const bonus = play(GAME_BONUS).state;
    expect(missionObjectives(bonus)).toEqual({ home: true, sample: true, dose: true });
    expect(missionResult(bonus)).toBe('success');
    const c = play(GAME_C).state;
    expect(missionResult(c)).toBe('early_return');
  });

  it('turning point for air is the sol before the failure', () => {
    const s: MissionState = { ...newMission(TEST_DEF), status: 'early_return', failure: { sol: 1, cause: 'air' } };
    expect(turningPointSol(s)).toBe(1);
    expect(turningPointSol({ ...s, failure: { sol: 4, cause: 'air' } })).toBe(3);
  });

  it('prediction offers three different outcomes, one of them real', () => {
    const s = newMission(TEST_DEF);
    const a = alloc([5, 2, 0, 0, 0]);
    const { options, correctIndex } = predictionOptions(TEST_DEF, s, a);
    expect(options).toHaveLength(3);
    expect(options[correctIndex]).toEqual({ air: 10, food: 4, exposure: 0 });
    expect(new Set(options.map((o) => JSON.stringify(o))).size).toBe(3);
  });

  it('"what if" moves one cell and changes the result', () => {
    const s = newMission(TEST_DEF);
    const w = whatIf(TEST_DEF, s, alloc([5, 2, 0, 0, 0]));
    expect(w).not.toBeNull();
    expect(w?.outcome).not.toEqual({ air: 10, food: 4, exposure: 0 });
  });
});
