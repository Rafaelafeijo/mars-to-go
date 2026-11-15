/**
 * Curated catalog of real space weather events (DATA_MAP D1–D3, D7). Each event
 * points to its data card. Phase 4 grows this to 8–12 events via tools/data.
 */
import type { MissionDef, SpaceEvent } from '@mars-to-go/sim';

export interface CatalogEvent extends SpaceEvent {
  cardId: string;
  /** What the child reads on the forecast, e.g. "M1.3 flare". Not translated: class names are international. */
  classLabel: string;
  kind: 'flare' | 'cme' | 'sep';
  date: string;
}

export const CATALOG: CatalogEvent[] = [
  {
    id: '2024-05-10T00:10:00-FLR-001',
    cardId: 'evt-flr-2024-05-10',
    classLabel: 'M1.3',
    kind: 'flare',
    date: '2024-05-10',
    risk: 1,
    reachesMars: 'unknown',
    fast: false,
  },
  {
    id: '2024-05-11T01:36:00-CME-001',
    cardId: 'evt-cme-2024-05-11',
    classLabel: 'CME',
    kind: 'cme',
    date: '2024-05-11',
    risk: 2,
    reachesMars: true,
    fast: false,
  },
  // Mission 2 "The May storm" — real records checked in DONKI on 2026-11-15.
  {
    id: '2024-05-14T16:46:00-FLR-001',
    cardId: 'evt-flr-2024-05-14',
    classLabel: 'X8.7',
    kind: 'flare',
    date: '2024-05-14',
    risk: 2,
    reachesMars: 'unknown',
    fast: false,
  },
  {
    id: '2024-05-13T09:12:00-CME-001',
    cardId: 'evt-cme-2024-05-13',
    classLabel: 'CME',
    kind: 'cme',
    date: '2024-05-13',
    risk: 2,
    reachesMars: true,
    fast: false,
  },
  {
    id: '2024-05-14T17:30:00-CME-001',
    cardId: 'evt-cme-2024-05-14',
    classLabel: 'CME',
    kind: 'cme',
    date: '2024-05-14',
    risk: 2,
    reachesMars: true,
    fast: false,
  },
  {
    // Not a DONKI record: the Mars measurement comes from NASA's release (DATA_MAP D7).
    id: 'NASA-2024-080-MARS-2024-05-20',
    cardId: 'evt-may-2024',
    classLabel: 'X12',
    kind: 'sep',
    date: '2024-05-20',
    risk: 3,
    reachesMars: true,
    fast: true,
  },
];

export function catalogEvent(id: string | undefined | null): CatalogEvent | undefined {
  return CATALOG.find((e) => e.id === id);
}

const ev = (id: string): CatalogEvent => {
  const e = catalogEvent(id);
  if (!e) throw new Error(`Unknown catalog event ${id}`);
  return e;
};

/** Mission 1 "First sols": guided, calm Sun (ADR-0019, ADR-0021). */
export const MISSION_1: MissionDef = {
  id: 'm1',
  mode: 'guided',
  seed: 1,
  sols: [
    { dust: false, event: null },
    { dust: false, event: null },
    { dust: false, event: ev('2024-05-10T00:10:00-FLR-001') },
    { dust: false, event: null },
    { dust: false, event: ev('2024-05-11T01:36:00-CME-001') },
    { dust: false, event: null },
    { dust: false, event: null },
  ],
};

/**
 * Mission 2 "The May storm": free mode (every machine open), the real week of May 14–20, 2024.
 * Sol 1 X8.7 flare (no Mars evidence) · sol 3 and sol 5 CMEs that WSA-ENLIL forecast at Mars ·
 * sol 7 the May 20 storm measured at Mars by Curiosity's RAD (fast: the 10-second crisis).
 */
export const MISSION_2: MissionDef = {
  id: 'm2',
  mode: 'free',
  seed: 2,
  sols: [
    { dust: false, event: ev('2024-05-14T16:46:00-FLR-001') },
    { dust: false, event: null },
    { dust: false, event: ev('2024-05-13T09:12:00-CME-001') },
    { dust: false, event: null },
    { dust: false, event: ev('2024-05-14T17:30:00-CME-001') },
    { dust: false, event: null },
    { dust: false, event: ev('NASA-2024-080-MARS-2024-05-20') },
  ],
};
