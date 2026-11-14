import { describe, expect, it } from 'vitest';
import { SCIENCE } from './science';
import { newMission, resolveNight } from './engine';
import { TEST_DEF } from './fixtures';

describe('science.ts', () => {
  it('gives every constant a complete data trail', () => {
    for (const c of SCIENCE) {
      expect(c.id, 'id').toMatch(/^[A-Z0-9_]+$/);
      expect(Number.isFinite(c.value), `${c.id} value`).toBe(true);
      expect(c.unit, `${c.id} unit`).not.toBe('');
      expect(['measured', 'scenario', 'simplification']).toContain(c.label);
      expect(c.source, `${c.id} source`).not.toBe('');
      expect(c.url, `${c.id} url`).toMatch(/^https:\/\//);
      expect(c.accessed, `${c.id} accessed`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('measured values say where they were measured; game rules say "game"', () => {
    for (const c of SCIENCE) {
      if (c.label === 'measured') expect(c.place, c.id).not.toBe('game');
      if (c.source === 'Mars to Go game rule') expect(c.place, c.id).toBe('game');
    }
  });

  it('every data card a night step points to exists', () => {
    let s = newMission(TEST_DEF);
    const ids = new Set(SCIENCE.map((c) => c.id));
    for (const row of [[2, 1, 1, 1, 1] as const]) {
      const night = resolveNight(TEST_DEF, { ...s, sol: 2, pendingHarvests: [{ sol: 2, food: 2 }] }, {
        allocation: { lifeSupport: row[0], greenhouse: row[1], shield: row[2], expedition: row[3], askEarth: row[4] },
      });
      for (const step of night.steps) for (const id of step.scienceIds) expect(ids.has(id), `${step.id} → ${id}`).toBe(true);
      s = night.state;
    }
  });

  it('has unique ids', () => {
    const ids = SCIENCE.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
