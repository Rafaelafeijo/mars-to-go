import { describe, expect, it } from 'vitest';
import { NEW_CAREER, isComplete, recordMission, type Career } from './career';
import { decodeCareer, encodeCareer, missionFromCode, missionToCode } from './code';
import { freeCells, newMission, resolveNight, validateAllocation } from './engine';
import { GAME_A, GAME_BONUS, GAME_C, TEST_DEF, alloc } from './fixtures';
import { verdict } from './outcomes';
import { drawSurpriseMission, rng } from './random';
import type { Allocation, MissionDef, MissionState, SpaceEvent } from './types';

function finish(rows: typeof GAME_A, def: MissionDef): MissionState {
  let s = newMission(def);
  for (const r of rows) s = resolveNight(def, s, { allocation: alloc(r) }).state;
  return s;
}

describe('career (ADR-0021)', () => {
  const m1: MissionDef = { ...TEST_DEF, id: 'm1', mode: 'guided' };
  const m2: MissionDef = { ...TEST_DEF, id: 'm2' };

  it('mission 1 with everyone home opens mission 2, "Surprise me" and "Today in space"', () => {
    const c = recordMission(NEW_CAREER, finish(GAME_A, m1));
    expect(c.unlocked).toEqual(['m1', 'm2', 'surprise', 'today']);
    expect(c.badges.m1?.verdict).toBe('with_margin');
  });

  it('an early return in mission 1 opens only the free modes, and gives no badge', () => {
    const c = recordMission(NEW_CAREER, finish(GAME_C, { ...TEST_DEF, id: 'm1', mode: 'free' }));
    expect(c.unlocked).toEqual(['m1', 'surprise', 'today']);
    expect(c.badges.m1).toBeUndefined();
  });

  it('keeps the best badge and adds discoveries', () => {
    let c = recordMission(NEW_CAREER, finish(GAME_BONUS, m2));
    c = recordMission(c, finish(GAME_A, m2));
    expect(c.badges.m2?.verdict).toBe('reference');
    expect(c.unlocked).toContain('m3');
    expect(c.discoveries).toHaveLength(1);
  });

  it('completing the game needs missions 1–3 home, a reference mission and all discoveries', () => {
    const almost: Career = {
      unlocked: ['m1', 'm2', 'm3', 'surprise', 'today'],
      badges: { m1: { verdict: 'with_margin', spotOn: false, unassisted: true }, m2: { verdict: 'reference', spotOn: false, unassisted: true }, m3: { verdict: 'on_edge', spotOn: false, unassisted: true } },
      discoveries: ['rochette', 'kodiak'],
    };
    expect(isComplete(almost)).toBe(false);
    expect(isComplete({ ...almost, discoveries: ['rochette', 'kodiak', 'delta-front'] })).toBe(true);
  });
});

describe('career code (ADR-0022)', () => {
  const career: Career = {
    unlocked: ['m1', 'm2', 'surprise', 'today'],
    badges: { m1: { verdict: 'with_margin', spotOn: true, unassisted: false } },
    discoveries: ['kodiak'],
  };

  it('round-trips a career without a mission', () => {
    const code = encodeCareer(career, null);
    expect(decodeCareer(code)).toEqual({ ok: true, career, mission: null });
  });

  it('round-trips a mission in progress and rebuilds a playable state', () => {
    let s = newMission(TEST_DEF);
    for (const r of GAME_A.slice(0, 3)) s = resolveNight(TEST_DEF, s, { allocation: alloc(r) }).state;
    const code = encodeCareer(career, missionToCode(s));
    expect(code.replace(/-/g, '').length).toBeLessThanOrEqual(24);
    const decoded = decodeCareer(code);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok || !decoded.mission) throw new Error('no mission');
    const restored = missionFromCode(decoded.mission, 'free');
    expect([restored.sol, restored.air, restored.food, restored.exposure]).toEqual([s.sol, s.air, s.food, s.exposure]);
    expect(restored.pendingHarvests).toEqual(s.pendingHarvests);
    // The restored mission ends exactly like the original.
    let a = s;
    let b = restored;
    for (const r of GAME_A.slice(3)) {
      a = resolveNight(TEST_DEF, a, { allocation: alloc(r) }).state;
      b = resolveNight(TEST_DEF, b, { allocation: alloc(r) }).state;
    }
    expect([b.air, b.food, b.exposure, b.status]).toEqual([a.air, a.food, a.exposure, a.status]);
  });

  it('accepts lowercase and look-alike letters, rejects a typo', () => {
    const code = encodeCareer(career, null);
    expect(decodeCareer(code.toLowerCase()).ok).toBe(true);
    const typo = (code[0] === 'A' ? 'B' : 'A') + code.slice(1);
    expect(decodeCareer(typo)).toEqual({ ok: false, reason: 'check' });
    expect(decodeCareer('!!!')).toEqual({ ok: false, reason: 'format' });
  });
});

describe('no free choice, no single winning plan (SIM_MODEL §9)', () => {
  const catalog: SpaceEvent[] = [
    { id: 'c1', risk: 1, reachesMars: false, fast: false },
    { id: 'c2', risk: 2, reachesMars: true, fast: false },
    { id: 'c3', risk: 3, reachesMars: true, fast: true },
    { id: 'c4', risk: 2, reachesMars: false, fast: false },
  ];

  /** Random valid allocation for the current sol. */
  function randomAllocation(r: () => number, free: number): Allocation {
    const expedition = (free >= 2 && r() < 0.5 ? 1 : 0) as 0 | 1;
    const askEarth = (free - expedition * 2 >= 1 && r() < 0.3 ? 1 : 0) as 0 | 1;
    let left = free - expedition * 2 - askEarth;
    const greenhouse = Math.floor(r() * (left + 1));
    left -= greenhouse;
    const shield = Math.floor(r() * (left + 1));
    return { lifeSupport: left - shield, greenhouse, shield, expedition, askEarth };
  }

  it('on any seed, no plan brings everyone home with an expedition every sol', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const def = drawSurpriseMission(seed, catalog);
      const r = rng(seed * 7);
      let s = newMission(def);
      while (s.status === 'playing') {
        const free = freeCells(def.sols[s.sol - 1]?.dust ?? false);
        const a = { ...randomAllocation(r, free - 2), expedition: 1 as const };
        if (free < 2) break; // a dust sol makes 7 expeditions impossible anyway
        s = resolveNight(def, s, { allocation: a }).state;
      }
      expect(s.status === 'returned_all' && s.discoveries.length + 0 >= 7).toBe(false);
    }
  });

  it('a fixed plan that wins one seed fails or is invalid on another', () => {
    let failures = 0;
    for (let seed = 1; seed <= 100; seed++) {
      const def = drawSurpriseMission(seed, catalog);
      let s = newMission(def);
      let invalid = false;
      for (const row of GAME_BONUS) {
        const a = alloc(row);
        if (validateAllocation(s, a, def.sols[s.sol - 1]?.dust ?? false).length) {
          invalid = true;
          break;
        }
        s = resolveNight(def, s, { allocation: a }).state;
      }
      if (invalid || verdict(s) !== 'reference') failures++;
    }
    expect(failures).toBeGreaterThan(0);
  });

  it('"Surprise me" is deterministic for a seed and keeps sol 1 calm', () => {
    expect(drawSurpriseMission(7, catalog)).toEqual(drawSurpriseMission(7, catalog));
    for (let seed = 1; seed < 50; seed++) {
      const d = drawSurpriseMission(seed, catalog);
      expect(d.sols[0]).toEqual({ dust: false, event: null });
      expect(d.sols.filter((x) => x.dust)).toHaveLength(1);
    }
  });
});
