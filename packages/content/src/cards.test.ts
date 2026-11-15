import { describe, expect, it } from 'vitest';
import { SCIENCE, crisisFor, freeCells, missionResult, newMission, resolveNight, validateAllocation } from '@mars-to-go/sim';
import { CARDS, cardById, cardForScience } from './cards';
import { CATALOG, MISSION_1, MISSION_2, catalogEvent } from './catalog';

/** Card ids the screens reference directly (apps/web). Keep in sync when a screen adds a badge. */
const USED_BY_SCREENS = [
  'cells', 'heating', 'dust', 'air', 'food', 'exposure', 'sol', 'riskTable',
  'lifeSupport', 'greenhouse', 'shield', 'expedition', 'askEarth',
  'photo-jezero-panorama', 'photo-earth-from-mars',
];

describe('data cards (rule 16)', () => {
  it('every card used by a screen exists and is complete', () => {
    for (const id of USED_BY_SCREENS) expect(cardById(id), id).toBeDefined();
  });

  it('every catalog event has a complete card', () => {
    for (const e of CATALOG) expect(cardById(e.cardId), e.id).toBeDefined();
  });

  it('cards point only to science ids that exist', () => {
    const ids = new Set(SCIENCE.map((c) => c.id));
    for (const c of CARDS) for (const id of [...c.numbers, ...c.facts]) expect(ids.has(id), `${c.id} → ${id}`).toBe(true);
  });

  /** Crisis numbers are not on any screen until Phase 4 brings the crises; remove from this list then. */
  const NOT_ON_SCREEN_YET = ['GREENHOUSE_RESCUE_AIR'];

  it('every game rule number on screen has a card', () => {
    for (const s of SCIENCE.filter((x) => x.place === 'game' && !NOT_ON_SCREEN_YET.includes(x.id))) {
      expect(cardForScience(s.id as never), s.id).toBeDefined();
    }
  });

  it('every card has complete text in both languages', () => {
    for (const c of CARDS) {
      for (const lang of ['en', 'pt-BR'] as const) {
        const t = c.text[lang];
        for (const k of ['title', 'what', 'processing', 'gameUse', 'simplified', 'learnMore'] as const) {
          expect(t[k]?.trim().length, `${c.id} ${lang} ${k}`).toBeGreaterThan(0);
        }
      }
      if (c.place !== 'Mars' && c.place !== 'game') expect(c.text.en.parallel, `${c.id} parallel`).toBeTruthy();
    }
  });

  it('ids are unique', () => {
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(CARDS.length);
  });

  it('mission 2 "The May storm": free mode, real events, the risk-3 storm on sol 7 triggers the crisis', () => {
    expect(MISSION_2.mode).toBe('free');
    expect(MISSION_2.sols).toHaveLength(7);
    expect(MISSION_2.sols[6]?.event?.risk).toBe(3);
    expect(crisisFor(MISSION_2, 7)).toBe('solarStorm');
    for (const s of MISSION_2.sols) if (s.event) expect(cardById(catalogEvent(s.event.id)?.cardId ?? ''), s.event.id).toBeDefined();
  });

  it('mission 2 can be won with shields and one rover trip, and is lost without shields', () => {
    const win: [number, number, number, 0 | 1][] = [[5, 2, 0, 0], [4, 1, 0, 1], [4, 1, 2, 0], [5, 2, 0, 0], [5, 0, 2, 0], [6, 1, 0, 0], [4, 0, 3, 0]];
    let s = newMission(MISSION_2);
    for (const [ls, gh, sh, ex] of win) {
      const a = { lifeSupport: ls, greenhouse: gh, shield: sh, expedition: ex, askEarth: 0 as const };
      expect(validateAllocation(s, a, false), `sol ${s.sol}`).toEqual([]);
      s = resolveNight(MISSION_2, s, { allocation: a }).state;
    }
    expect(missionResult(s)).toBe('success');

    let t = newMission(MISSION_2);
    for (let i = 0; i < 5 && t.status === 'playing'; i++) {
      const free = freeCells(false, t.lostCells ?? 0);
      const a = { lifeSupport: free - 2, greenhouse: 2, shield: 0, expedition: 0 as const, askEarth: 0 as const };
      t = resolveNight(MISSION_2, t, { allocation: a }).state;
    }
    expect(t.status).toBe('early_return');
    expect(t.failure?.cause).toBe('radiation');
  });

  it('mission 1 is guided, 7 sols, calm: no risk-3 event and no dust', () => {
    expect(MISSION_1.mode).toBe('guided');
    expect(MISSION_1.sols).toHaveLength(7);
    expect(MISSION_1.sols.every((s) => !s.dust && (s.event?.risk ?? 0) < 3)).toBe(true);
  });
});
