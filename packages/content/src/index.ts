import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

/** English is the default; Portuguese is complete from the MVP (ADR-0012). */
export const LOCALES = ['en', 'pt-BR'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
} as const;
