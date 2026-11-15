/** Types of the simulation (SIM_MODEL §3). No UI, no I/O. */

export type Destination = 'lifeSupport' | 'greenhouse' | 'shield' | 'expedition' | 'askEarth';
export type MissionId = 'm1' | 'm2' | 'm3' | 'surprise' | 'today';
export type Mode = 'guided' | 'free';
export type Risk = 0 | 1 | 2 | 3;
export type ReachesMars = boolean | 'unknown';

/** A real space weather event from the curated catalog (DATA_MAP D1–D3, D7). */
export interface SpaceEvent {
  id: string;
  risk: Risk;
  /** Evidence-based: WSA-ENLIL Mars arrival or a Mars measurement. 'unknown' counts as not reaching Mars. */
  reachesMars: ReachesMars;
  /** Particles arrive within hours: may trigger the solar storm crisis. */
  fast: boolean;
}

/** Scenario crises that are not driven by an event. */
export type ScenarioCrisis = 'dust' | 'greenhouse';

export interface SolConditions {
  dust: boolean;
  event: SpaceEvent | null;
  /** A scenario crisis planned for this sol, if any. */
  crisis?: ScenarioCrisis;
}

export interface MissionDef {
  id: MissionId;
  mode: Mode;
  seed: number;
  /** One entry per sol, index 0 = sol 1. */
  sols: SolConditions[];
}

export interface Allocation {
  lifeSupport: number;
  greenhouse: number;
  shield: number;
  expedition: 0 | 1;
  /** Where the expedition goes (a discovery id); first undiscovered site if omitted. */
  expeditionSite?: string;
  askEarth: 0 | 1;
}

export type CrisisResolution =
  | { kind: 'solarStorm'; choice: 'moveToShield' | 'recallExpedition' | 'keepPlan' }
  | { kind: 'greenhouse'; choice: 'saveHarvest' | 'saveAir' | 'keepPlan' }
  /** Dust arrives during the sol: the allocation passed must already fit the dust budget. */
  | { kind: 'dust' };

export interface SolPlan {
  allocation: Allocation;
  crisis?: CrisisResolution;
}

export type StepId =
  | 'lifeSupport'
  | 'greenhouseRescue'
  | 'harvestLost'
  | 'harvest'
  | 'plant'
  | 'breathe'
  | 'eat'
  | 'expedition'
  | 'expeditionRecalled'
  | 'outside'
  | 'radiation'
  | 'damage'
  | 'earthAnswer';

/** One line of the live math (ADR-0020). Text lives in packages/content under `steps.<id>`. */
export interface NightStep {
  id: StepId;
  resource: 'air' | 'food' | 'exposure' | 'none';
  before: number;
  delta: number;
  after: number;
  /** Extra numbers the text may need (e.g. cells, risk, shield, travel minutes). */
  detail?: Record<string, number | string | boolean | null>;
  /** Science constant ids behind this step (data cards). */
  scienceIds: string[];
}

export interface PendingHarvest {
  sol: number;
  food: number;
}

export interface EarthAnswer {
  askedOnSol: number;
  /** null when asked on the last sol: there is no tomorrow in the mission. */
  aboutSol: number | null;
  reachesMars: ReachesMars | null;
  eventId: string | null;
}

export interface SolLog {
  sol: number;
  plan: SolPlan;
  steps: NightStep[];
  earthAnswer?: EarthAnswer;
  prediction?: { picked: number; correct: boolean };
}

export type Status = 'playing' | 'returned_all' | 'early_return';
export type FailureCause = 'air' | 'food' | 'radiation';

export interface MissionState {
  version: 1;
  missionId: MissionId;
  seed: number;
  mode: Mode;
  /** The sol being played (1..7). After the last night it stays at 7. */
  sol: number;
  air: number;
  food: number;
  exposure: number;
  /** Cells lost on this sol because last night's radiation damaged the electronics (ADR-0033). */
  lostCells?: number;
  pendingHarvests: PendingHarvest[];
  discoveries: string[];
  log: SolLog[];
  status: Status;
  failure?: { sol: number; cause: FailureCause };
  /** True once assisted mode was used during this mission (no "unassisted" stripe). */
  assistedUsed: boolean;
}
