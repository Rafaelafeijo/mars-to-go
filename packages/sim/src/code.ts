/**
 * The career code (ADR-0022): a short string that restores the career and the
 * mission in progress on another device. Only game numbers; no personal data.
 * Bits → Crockford base32 (no I, L, O, U), blocks of 4, one check character.
 */
import { DISCOVERY_IDS } from './engine';
import { MISSION_IDS, type Badge, type BadgeVerdict, type Career } from './career';
import type { MissionId, MissionState } from './types';

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const CODE_VERSION = 1;
const VERDICTS: (BadgeVerdict | null)[] = [null, 'on_edge', 'with_margin', 'reference'];
const DISCOVERY_BITS = 16;

/** What the code restores; the mission is rebuilt from its id and seed. */
export interface CodeMission {
  missionId: MissionId;
  seed: number;
  sol: number;
  air: number;
  food: number;
  exposure: number;
  /** Food arriving tomorrow and the day after (the only possible pending harvests). */
  harvestNext: number;
  harvestAfter: number;
  discoveries: string[];
}

class Bits {
  private bits: number[] = [];
  private pos = 0;
  constructor(bits?: number[]) {
    if (bits) this.bits = bits;
  }
  write(value: number, width: number): void {
    if (!Number.isInteger(value) || value < 0 || value >= 2 ** width) throw new RangeError(`value ${value} does not fit in ${width} bits`);
    for (let i = width - 1; i >= 0; i--) this.bits.push(Math.floor(value / 2 ** i) % 2);
  }
  read(width: number): number {
    let v = 0;
    for (let i = 0; i < width; i++) v = v * 2 + (this.bits[this.pos++] ?? 0);
    return v;
  }
  all(): number[] {
    return this.bits;
  }
}

function discoveryMask(ids: string[]): number {
  return DISCOVERY_IDS.reduce((m, id, i) => (ids.includes(id) ? m | (1 << i) : m), 0);
}

function discoveriesFrom(mask: number): string[] {
  return DISCOVERY_IDS.filter((_, i) => mask & (1 << i));
}

export function missionToCode(state: MissionState): CodeMission {
  const at = (sol: number) => state.pendingHarvests.filter((h) => h.sol === sol).reduce((s, h) => s + h.food, 0);
  return {
    missionId: state.missionId,
    seed: state.seed,
    sol: state.sol,
    air: state.air,
    food: state.food,
    exposure: state.exposure,
    harvestNext: at(state.sol),
    harvestAfter: at(state.sol + 1),
    discoveries: state.discoveries,
  };
}

export function encodeCareer(career: Career, mission: CodeMission | null): string {
  const b = new Bits();
  b.write(CODE_VERSION, 4);
  b.write(MISSION_IDS.reduce((m, id, i) => (career.unlocked.includes(id) ? m | (1 << i) : m), 0), 5);
  for (const id of MISSION_IDS) {
    const badge = career.badges[id];
    b.write(badge ? VERDICTS.indexOf(badge.verdict) : 0, 2);
    b.write(badge?.spotOn ? 1 : 0, 1);
    b.write(badge?.unassisted ? 1 : 0, 1);
  }
  b.write(discoveryMask(career.discoveries), DISCOVERY_BITS);
  b.write(mission ? 1 : 0, 1);
  if (mission) {
    b.write(MISSION_IDS.indexOf(mission.missionId), 3);
    b.write(mission.seed, 16);
    b.write(mission.sol, 3);
    b.write(mission.air, 7);
    b.write(mission.food, 7);
    b.write(mission.exposure, 5);
    b.write(mission.harvestNext, 4);
    b.write(mission.harvestAfter, 4);
    b.write(discoveryMask(mission.discoveries), DISCOVERY_BITS);
  }
  const bits = b.all();
  while (bits.length % 5) bits.push(0);
  let chars = '';
  let sum = 0;
  for (let i = 0; i < bits.length; i += 5) {
    const v = bits.slice(i, i + 5).reduce((acc, bit) => acc * 2 + bit, 0);
    sum += v * ((i / 5) % 7 + 1);
    chars += ALPHABET[v];
  }
  chars += ALPHABET[sum % 32];
  return chars.match(/.{1,4}/g)?.join('-') ?? chars;
}

export type DecodeResult = { ok: true; career: Career; mission: CodeMission | null } | { ok: false; reason: 'format' | 'check' | 'version' };

export function decodeCareer(input: string): DecodeResult {
  // Crockford: accept lowercase, and read O as 0, I/L as 1.
  const clean = input.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
  if (clean.length < 2 || [...clean].some((c) => !ALPHABET.includes(c))) return { ok: false, reason: 'format' };
  const values = [...clean].map((c) => ALPHABET.indexOf(c));
  const check = values.pop() as number;
  const sum = values.reduce((s, v, i) => s + v * ((i % 7) + 1), 0);
  if (sum % 32 !== check) return { ok: false, reason: 'check' };
  const bits: number[] = [];
  for (const v of values) for (let i = 4; i >= 0; i--) bits.push(Math.floor(v / 2 ** i) % 2);
  const b = new Bits(bits);
  if (b.read(4) !== CODE_VERSION) return { ok: false, reason: 'version' };
  const unlockedMask = b.read(5);
  const badges: Career['badges'] = {};
  for (const id of MISSION_IDS) {
    const v = VERDICTS[b.read(2)] ?? null;
    const spotOn = b.read(1) === 1;
    const unassisted = b.read(1) === 1;
    if (v) badges[id] = { verdict: v, spotOn, unassisted } satisfies Badge;
  }
  const career: Career = {
    unlocked: MISSION_IDS.filter((_, i) => unlockedMask & (1 << i)),
    badges,
    discoveries: discoveriesFrom(b.read(DISCOVERY_BITS)),
  };
  let mission: CodeMission | null = null;
  if (b.read(1) === 1) {
    mission = {
      missionId: MISSION_IDS[b.read(3)] ?? 'm1',
      seed: b.read(16),
      sol: b.read(3),
      air: b.read(7),
      food: b.read(7),
      exposure: b.read(5),
      harvestNext: b.read(4),
      harvestAfter: b.read(4),
      discoveries: discoveriesFrom(b.read(DISCOVERY_BITS)),
    };
  }
  return { ok: true, career, mission };
}

/** Rebuilds a playable state from a decoded mission (log and checkpoints start empty). */
export function missionFromCode(m: CodeMission, mode: MissionState['mode']): MissionState {
  const pendingHarvests = [
    ...(m.harvestNext ? [{ sol: m.sol, food: m.harvestNext }] : []),
    ...(m.harvestAfter ? [{ sol: m.sol + 1, food: m.harvestAfter }] : []),
  ];
  return {
    version: 1,
    missionId: m.missionId,
    seed: m.seed,
    mode,
    sol: m.sol,
    air: m.air,
    food: m.food,
    exposure: m.exposure,
    pendingHarvests,
    discoveries: m.discoveries,
    log: [],
    status: 'playing',
    assistedUsed: false,
  };
}
