/**
 * The single home of every number the game uses (CLAUDE.md rule 4).
 *
 * Each constant carries its own data card fields. Values come from
 * docs/en/SIM_MODEL.md §2 and sources from docs/en/DATA_MAP.md.
 * Phase 1 holds only the skeleton; Phase 2 fills in the full table.
 */

export type ScienceLabel = 'measured' | 'scenario' | 'simplification';
export type Place = 'Mars' | 'ISS' | 'Sun' | 'Earth' | 'Moon' | 'game';

export interface ScienceConstant {
  id: string;
  value: number;
  unit: string;
  label: ScienceLabel;
  /** Human-readable source, or "Mars to Go game rule" for scenario values. */
  source: string;
  /** Link to the source; for scenario values, the SIM_MODEL section. */
  url: string;
  place: Place;
  /** ISO date the source was read. */
  accessed: string;
}

const SIM_MODEL_URL = 'https://github.com/Rafaelafeijo/mars-to-go/blob/main/docs/en/SIM_MODEL.md';

export const MISSION_SOLS: ScienceConstant = {
  id: 'MISSION_SOLS',
  value: 7,
  unit: 'sol',
  label: 'scenario',
  source: 'Mars to Go game rule',
  url: `${SIM_MODEL_URL}#2-constants`,
  place: 'game',
  accessed: '2026-11-14',
};

export const CELLS_PER_SOL: ScienceConstant = {
  id: 'CELLS_PER_SOL',
  value: 10,
  unit: 'cell',
  label: 'scenario',
  source: 'Mars to Go game rule',
  url: `${SIM_MODEL_URL}#2-constants`,
  place: 'game',
  accessed: '2026-11-14',
};

export const SCIENCE: readonly ScienceConstant[] = [MISSION_SOLS, CELLS_PER_SOL];
