import { describe, expect, it } from 'vitest';
import { SCIENCE } from './science';

describe('science.ts', () => {
  it('gives every constant a complete data trail', () => {
    for (const c of SCIENCE) {
      expect(c.id, 'id').toMatch(/^[A-Z_]+$/);
      expect(Number.isFinite(c.value), `${c.id} value`).toBe(true);
      expect(c.unit, `${c.id} unit`).not.toBe('');
      expect(['measured', 'scenario', 'simplification']).toContain(c.label);
      expect(c.source, `${c.id} source`).not.toBe('');
      expect(c.url, `${c.id} url`).toMatch(/^https:\/\//);
      expect(c.accessed, `${c.id} accessed`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('has unique ids', () => {
    const ids = SCIENCE.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
