import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

/** English is the default; Portuguese is complete from the MVP (ADR-0012). */
export const LOCALES = ['en', 'pt-BR'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Data sources actually shown on screen in this version. The footer lists only these
 * (team rule, Phase 1 adjustment D3). Update each phase.
 */
export const DATA_SOURCES_IN_GAME: readonly string[] = [];

/** True only when every number on screen shows its origin badge. Flip when it is true. */
export const EVERY_NUMBER_HAS_BADGE = false;

export const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
} as const;
