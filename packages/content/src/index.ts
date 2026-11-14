import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

export * from './cards';
export * from './catalog';

/** English is the default and the game always opens in it (ADR-0012, ADR-0028). */
export const LOCALES = ['en', 'pt-BR'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Data sources actually shown on screen in this version. The footer lists only these
 * (team rule, Phase 1 adjustment D3). Update each phase.
 */
export const DATA_SOURCES_IN_GAME: readonly string[] = [
  'NASA CCMC DONKI',
  'NASA Mars Fact Sheet',
  'NASA/JPL (MOXIE, Curiosity RAD)',
  'NASA BVAD',
  'NASA Veggie',
  'NASA Photojournal',
];

/** True only when every number on screen shows its origin badge. */
export const EVERY_NUMBER_HAS_BADGE = true;

export const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
} as const;
