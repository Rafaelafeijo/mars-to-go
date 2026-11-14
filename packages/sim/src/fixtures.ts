/** Test seed of SIM_MODEL §8 (free mode). Used by tests only. */
import type { Allocation, MissionDef } from './types';

export const TEST_DEF: MissionDef = {
  id: 'surprise',
  mode: 'free',
  seed: 42,
  sols: [
    { dust: false, event: null },
    { dust: false, event: { id: 'test-risk2-hit', risk: 2, reachesMars: true, fast: false } },
    { dust: false, event: null },
    { dust: true, event: null },
    { dust: false, event: { id: 'test-risk3-hit', risk: 3, reachesMars: true, fast: false } },
    { dust: false, event: { id: 'test-risk1-miss', risk: 1, reachesMars: false, fast: false } },
    { dust: false, event: null },
  ],
};

/** [lifeSupport, greenhouse, shield, expedition, askEarth] */
export type Row = [number, number, number, 0 | 1, 0 | 1];

export function alloc([lifeSupport, greenhouse, shield, expedition, askEarth]: Row): Allocation {
  return { lifeSupport, greenhouse, shield, expedition, askEarth };
}

export const GAME_A: Row[] = [[5, 2, 0, 0, 0], [3, 2, 2, 0, 0], [5, 2, 0, 0, 0], [3, 0, 0, 0, 0], [4, 0, 3, 0, 0], [6, 0, 1, 0, 0], [7, 0, 0, 0, 0]];
export const GAME_B: Row[] = [[5, 2, 0, 0, 0], [4, 1, 0, 1, 0], [6, 1, 0, 0, 0], [3, 0, 0, 0, 0], [4, 0, 3, 0, 0], [5, 0, 0, 1, 0], [7, 0, 0, 0, 0]];
export const GAME_C: Row[] = [[5, 0, 0, 1, 0], [4, 1, 2, 0, 0], [4, 0, 0, 1, 1], [3, 0, 0, 0, 0], [4, 0, 3, 0, 0]];
export const GAME_BONUS: Row[] = [[5, 2, 0, 0, 0], [3, 2, 2, 0, 0], [5, 2, 0, 0, 0], [3, 0, 0, 0, 0], [4, 0, 3, 0, 0], [5, 0, 0, 1, 0], [7, 0, 0, 0, 0]];
