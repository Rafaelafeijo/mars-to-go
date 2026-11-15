import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

/** Every literal key passed to t('…') in the web app must exist in both languages (rule 7). */
const WEB_SRC = join(dirname(fileURLToPath(import.meta.url)), '../../../apps/web/src');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n: string) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(n) ? [p] : [];
  });
}

function has(obj: unknown, key: string): boolean {
  let cur: unknown = obj;
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) cur = (cur as Record<string, unknown>)[part];
    else return false;
  }
  return true;
}

/** i18next plural forms: a key used with { count } may exist only as key_one / key_other. */
const exists = (obj: unknown, key: string) => has(obj, key) || has(obj, `${key}_other`) || has(obj, `${key}_one`);

describe('locales (rule 7)', () => {
  const used = new Set<string>();
  for (const f of files(WEB_SRC)) {
    for (const m of readFileSync(f, 'utf8').matchAll(/\bt\(\s*'([a-zA-Z0-9_.-]+)'/g)) used.add(m[1] as string);
  }

  it('finds the keys the web app uses', () => {
    expect(used.size).toBeGreaterThan(100);
  });

  it('every literal key exists in English and in Portuguese', () => {
    const missing = [...used].filter((k) => !exists(en, k) || !exists(ptBR, k));
    expect(missing).toEqual([]);
  });
});
