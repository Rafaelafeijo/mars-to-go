import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

function keys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe('locales', () => {
  it('pt-BR has exactly the same keys as en', () => {
    expect(keys(ptBR).sort()).toEqual(keys(en).sort());
  });

  it('has no empty strings', () => {
    for (const [name, dict] of [['en', en], ['pt-BR', ptBR]] as const) {
      const flat = keys(dict).map((k) => k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], dict));
      for (const v of flat) expect(v, name).not.toBe('');
    }
  });
});
