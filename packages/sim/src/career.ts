/** The career of missions (ADR-0021): unlocks, badges, completing the game. */
import { DISCOVERY_IDS } from './engine';
import { verdict, type Verdict } from './outcomes';
import type { MissionId, MissionState } from './types';

export const MISSION_IDS: readonly MissionId[] = ['m1', 'm2', 'm3', 'surprise', 'today'];

export type BadgeVerdict = Exclude<Verdict, 'early_return'>;

export interface Badge {
  verdict: BadgeVerdict;
  /** Every prediction answered was right (at least one answered). */
  spotOn: boolean;
  /** Assisted mode was never used. */
  unassisted: boolean;
}

export interface Career {
  unlocked: MissionId[];
  badges: Partial<Record<MissionId, Badge>>;
  discoveries: string[];
}

export const NEW_CAREER: Career = { unlocked: ['m1'], badges: {}, discoveries: [] };

const RANK: Record<BadgeVerdict, number> = { on_edge: 1, with_margin: 2, reference: 3 };

export function badgeFor(state: MissionState): Badge | null {
  const v = verdict(state);
  if (!v || v === 'early_return') return null;
  const answered = state.log.filter((l) => l.prediction);
  return {
    verdict: v,
    spotOn: answered.length > 0 && answered.every((l) => l.prediction?.correct),
    unassisted: !state.assistedUsed,
  };
}

/** Records a finished mission: keeps the best badge, adds discoveries, opens missions. */
export function recordMission(career: Career, state: MissionState): Career {
  if (state.status === 'playing') return career;
  const unlocked = new Set(career.unlocked);
  const home = state.status === 'returned_all';
  if (state.missionId === 'm1') {
    unlocked.add('surprise');
    unlocked.add('today');
    if (home) unlocked.add('m2');
  }
  if (state.missionId === 'm2' && home) unlocked.add('m3');

  const badges = { ...career.badges };
  const badge = badgeFor(state);
  const old = badges[state.missionId];
  if (badge) {
    badges[state.missionId] = old
      ? {
          verdict: RANK[badge.verdict] > RANK[old.verdict] ? badge.verdict : old.verdict,
          spotOn: old.spotOn || badge.spotOn,
          unassisted: old.unassisted || badge.unassisted,
        }
      : badge;
  }
  const discoveries = [...new Set([...career.discoveries, ...state.discoveries])];
  return {
    unlocked: MISSION_IDS.filter((id) => unlocked.has(id)),
    badges,
    discoveries,
  };
}

/** Full badge wall: missions 1–3 with everyone home, a reference mission, all discoveries. */
export function isComplete(career: Career): boolean {
  const story = (['m1', 'm2', 'm3'] as const).every((id) => career.badges[id]);
  const reference = Object.values(career.badges).some((b) => b?.verdict === 'reference');
  const allFound = DISCOVERY_IDS.every((d) => career.discoveries.includes(d));
  return story && reference && allFound;
}
