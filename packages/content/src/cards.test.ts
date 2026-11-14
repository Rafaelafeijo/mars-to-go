import { describe, expect, it } from 'vitest';
import { SCIENCE } from '@mars-to-go/sim';
import { CARDS, cardById, cardForScience } from './cards';
import { CATALOG, MISSION_1 } from './catalog';

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
  const NOT_ON_SCREEN_YET = ['CRISIS_SECONDS', 'CRISIS_SHIELD_SWAP_CELLS', 'GREENHOUSE_RESCUE_AIR'];

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

  it('mission 1 is guided, 7 sols, calm: no risk-3 event and no dust', () => {
    expect(MISSION_1.mode).toBe('guided');
    expect(MISSION_1.sols).toHaveLength(7);
    expect(MISSION_1.sols.every((s) => !s.dust && (s.event?.risk ?? 0) < 3)).toBe(true);
  });
});
