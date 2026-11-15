/**
 * The single home of every number the game uses (CLAUDE.md rule 4).
 *
 * Game rules come from docs/en/SIM_MODEL.md §2; measured facts and their
 * sources from docs/en/DATA_MAP.md. Each constant carries its own data trail.
 * Never invent a value or a source: mark it TODO and tell the team.
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
  /** Link to the source; for game rules, the SIM_MODEL section. */
  url: string;
  place: Place;
  /** When the value was measured or published (measured values only). */
  measuredOn?: string;
  /** ISO date the source was read. */
  accessed: string;
}

const ACCESSED = '2026-11-14';
const SIM_MODEL = 'https://github.com/Rafaelafeijo/mars-to-go/blob/main/docs/en/SIM_MODEL.md';
const RULE = 'Mars to Go game rule';
const FACT_SHEET = 'NASA Mars Fact Sheet (NSSDCA), last updated 2025-05-19';
const FACT_SHEET_URL = 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html';

function rule(value: number, unit: string, label: 'scenario' | 'simplification' = 'scenario') {
  return { value, unit, label, source: RULE, url: `${SIM_MODEL}#2-constants`, place: 'game' as const, accessed: ACCESSED };
}

const constants = {
  // ── Game rules (SIM_MODEL §2) ──────────────────────────────────────────
  MISSION_SOLS: rule(7, 'sol'),
  CELLS_PER_SOL: rule(10, 'cell'),
  CELLS_DUST_SOL: rule(6, 'cell'),
  HEATING_CELLS: rule(3, 'cell'),
  AIR_START: rule(10, 'air unit'),
  AIR_USE_PER_SOL: rule(5, 'air unit per sol'),
  AIR_PER_LIFE_SUPPORT_CELL: rule(1, 'air unit per cell'),
  FOOD_START: rule(6, 'food unit'),
  FOOD_USE_PER_SOL: rule(2, 'food unit per sol'),
  FOOD_PER_GREENHOUSE_CELL: rule(2, 'food unit per cell'),
  GREENHOUSE_DELAY_SOLS: rule(2, 'sol', 'simplification'),
  SHIELD_BLOCK_PER_CELL: rule(1, 'risk point per cell', 'simplification'),
  EXPEDITION_CELLS: rule(2, 'cell'),
  EXPEDITION_AIR: rule(2, 'air unit'),
  EXPEDITION_EXPOSURE: rule(1, 'exposure point', 'simplification'),
  ASK_EARTH_CELLS: rule(1, 'cell'),
  // ADR-0033 (second design review): radiation has consequences.
  EXPOSURE_LOW_MAX: rule(1, 'exposure point', 'simplification'),
  EXPOSURE_MEDIUM_MAX: rule(2, 'exposure point', 'simplification'),
  /** Above this dose the flight surgeon ends the mission (game version of NASA dose limits). */
  DOSE_LIMIT: rule(2, 'exposure point', 'simplification'),
  /** Unblocked radiation damages electronics: cells lost on the next sol, per unblocked point. */
  RADIATION_DAMAGE_CELLS_PER_POINT: rule(1, 'cell per exposure point', 'simplification'),
  RADIATION_DAMAGE_MAX_CELLS: rule(2, 'cell', 'simplification'),
  /** Rock samples the rocket must carry home for a successful mission (like Perseverance's samples). */
  SAMPLES_GOAL: rule(1, 'sample', 'scenario'),
  CRISIS_SECONDS: rule(10, 's'),
  CRISIS_SHIELD_SWAP_CELLS: rule(2, 'cell'),
  GREENHOUSE_RESCUE_AIR: rule(2, 'air unit'),
  RADIO_ROUND_TRIP_MIN_MINUTES: {
    value: 8,
    unit: 'min',
    label: 'simplification' as const,
    source: 'Derived: 2 × the ~4 min one-way delay at closest approach (RADIO_DELAY_MIN_MINUTES)',
    url: 'https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/',
    place: 'Earth' as const,
    accessed: ACCESSED,
  },

  // ── Measured facts (DATA_MAP) ─────────────────────────────────────────
  MARS_CO2_PERCENT: {
    value: 95.1, unit: '% by volume', label: 'measured' as const,
    source: FACT_SHEET, url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  MARS_SURFACE_PRESSURE_MB: {
    value: 6.36, unit: 'mb', label: 'measured' as const,
    source: FACT_SHEET, url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  MARS_SOLAR_IRRADIANCE: {
    value: 586.2, unit: 'W/m²', label: 'measured' as const,
    source: FACT_SHEET, url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  MARS_SUNLIGHT_RATIO_TO_EARTH: {
    value: 0.431, unit: '× Earth', label: 'measured' as const,
    source: FACT_SHEET, url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  MARS_AVG_TEMP_C: {
    value: -59, unit: '°C', label: 'measured' as const,
    source: FACT_SHEET, url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  MARS_DAY_TEMP_MIN_C: {
    value: -89, unit: '°C', label: 'measured' as const,
    source: `${FACT_SHEET}: diurnal temperature range 184 K to 242 K (-89 to -31 C), Viking 1 Lander site`,
    url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  MARS_DAY_TEMP_MAX_C: {
    value: -31, unit: '°C', label: 'measured' as const,
    source: `${FACT_SHEET}: diurnal temperature range 184 K to 242 K (-89 to -31 C), Viking 1 Lander site`,
    url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  /** Sky view (second playtest): how big the Sun looks from Mars, compared with from Earth. */
  SUN_SIZE_FROM_MARS_RATIO: {
    value: 0.67, unit: '× the Sun seen from Earth', label: 'measured' as const,
    source: 'NASA Science, "What Do Sunrises and Sunsets Look Like on Mars?": the Sun "appears only about two-thirds the size we see on Earth"; sky "yellow to orange", blue near the Sun at sunset (Mark Lemmon)',
    url: 'https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/', place: 'Mars' as const, accessed: ACCESSED,
  },
  MARS_SURFACE_GRAVITY: {
    value: 3.73, unit: 'm/s²', label: 'measured' as const,
    source: FACT_SHEET, url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  SOL_LENGTH_HOURS: {
    value: 24.6597, unit: 'h', label: 'measured' as const,
    source: FACT_SHEET, url: FACT_SHEET_URL, place: 'Mars' as const, accessed: ACCESSED,
  },
  SOL_EXTRA_MINUTES: {
    value: 40, unit: 'min', label: 'simplification' as const,
    source: 'Rounded from SOL_LENGTH_HOURS (24 h 39 min 35 s)', url: FACT_SHEET_URL,
    place: 'Mars' as const, accessed: ACCESSED,
  },
  RADIO_DELAY_MIN_MINUTES: {
    value: 4, unit: 'min, one way', label: 'measured' as const,
    source: 'NASA, "Space Communications: 7 Things You Need to Know" (2020-10-06)',
    url: 'https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/',
    place: 'Earth' as const, measuredOn: '2020-10-06', accessed: ACCESSED,
  },
  RADIO_DELAY_MAX_MINUTES: {
    value: 24, unit: 'min, one way', label: 'measured' as const,
    source: 'NASA, "Space Communications: 7 Things You Need to Know" (2020-10-06)',
    url: 'https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/',
    place: 'Earth' as const, measuredOn: '2020-10-06', accessed: ACCESSED,
  },
  MOXIE_TOTAL_O2_G: {
    value: 122, unit: 'g', label: 'measured' as const,
    source: 'NASA/JPL, "NASA\'s Oxygen-Generating Experiment MOXIE Completes Mars Mission" (2023-09-06)',
    url: 'https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/',
    place: 'Mars' as const, measuredOn: '2021–2023', accessed: ACCESSED,
  },
  MOXIE_MAX_RATE_G_PER_H: {
    value: 12, unit: 'g/h', label: 'measured' as const,
    source: 'NASA/JPL, "NASA\'s Oxygen-Generating Experiment MOXIE Completes Mars Mission" (2023-09-06)',
    url: 'https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/',
    place: 'Mars' as const, measuredOn: '2021–2023', accessed: ACCESSED,
  },
  MOXIE_RUNS: {
    value: 16, unit: 'runs', label: 'measured' as const,
    source: 'NASA/JPL, "NASA\'s Oxygen-Generating Experiment MOXIE Completes Mars Mission" (2023-09-06)',
    url: 'https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/',
    place: 'Mars' as const, measuredOn: '2021–2023', accessed: ACCESSED,
  },
  CREW_O2_KG_PER_DAY: {
    value: 0.895, unit: 'kg per crew member per day', label: 'measured' as const,
    source: 'NASA BVAD, NASA/TP-2015-218570/REV2 (2022), Table 3-31',
    url: 'https://ntrs.nasa.gov/citations/20210024855', place: 'Earth' as const, accessed: ACCESSED,
  },
  VEGGIE_LETTUCE_DAYS: {
    value: 33, unit: 'days', label: 'measured' as const,
    source: 'NASA Veggie fact sheet (VEG-01)',
    url: 'https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf',
    place: 'ISS' as const, measuredOn: '2014–2015', accessed: ACCESSED,
  },
  MARS_BACKGROUND_DOSE_UGY_PER_DAY: {
    value: 210, unit: 'μGy/day', label: 'measured' as const,
    source: 'NASA PIA17600 "Radiation Measurements on Mars" (2013-12-09), Curiosity RAD, Gale Crater',
    url: 'https://science.nasa.gov/resource/radiation-measurements-on-mars/',
    place: 'Mars' as const, measuredOn: '2012–2013', accessed: ACCESSED,
  },
  MAY_2024_DOSE_UGY: {
    value: 8100, unit: 'μGy', label: 'measured' as const,
    source: 'NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10): dose an astronaut next to Curiosity would have received',
    url: 'https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/',
    place: 'Mars' as const, measuredOn: '2024-05-20', accessed: ACCESSED,
  },
  MAY_2024_CHEST_XRAYS: {
    value: 30, unit: 'chest X-rays', label: 'measured' as const,
    source: 'NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10)',
    url: 'https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/',
    place: 'Mars' as const, measuredOn: '2024-05-20', accessed: ACCESSED,
  },
  DUST_TAU_2018: {
    value: 10.5, unit: 'tau (sky opacity)', label: 'measured' as const,
    source: 'NASA Science, "On Mars, Light Is Energy" (2018-06-13), Opportunity',
    url: 'https://science.nasa.gov/resource/on-mars-light-is-energy/',
    place: 'Mars' as const, measuredOn: '2018-06-10', accessed: ACCESSED,
  },
  OPPORTUNITY_ENERGY_WH_2018: {
    value: 21, unit: 'Wh', label: 'measured' as const,
    source: 'NASA Science, "On Mars, Light Is Energy" (2018-06-13), Opportunity',
    url: 'https://science.nasa.gov/resource/on-mars-light-is-energy/',
    place: 'Mars' as const, measuredOn: '2018-06-10', accessed: ACCESSED,
  },
  JEZERO_DELTA_DISTANCE_KM: {
    value: 2.3, unit: 'km', label: 'measured' as const,
    source: 'NASA/JPL PIA24485 "Perseverance View of the Delta in Jezero Crater" (2021-03-05)',
    url: 'https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/',
    place: 'Mars' as const, measuredOn: '2021-03-05', accessed: ACCESSED,
  },
} satisfies Record<string, Omit<ScienceConstant, 'id'>>;

export type ScienceId = keyof typeof constants;

/** Every constant with its id, for data cards, the science page and the public JSON. */
export const SCIENCE: readonly ScienceConstant[] = (Object.keys(constants) as ScienceId[]).map((id) => ({
  id,
  ...constants[id],
}));

/** Plain values for the rules: `V.AIR_USE_PER_SOL` → 5. */
export const V = Object.fromEntries(SCIENCE.map((c) => [c.id, c.value])) as Record<ScienceId, number>;

export function science(id: ScienceId): ScienceConstant {
  return { id, ...constants[id] };
}
