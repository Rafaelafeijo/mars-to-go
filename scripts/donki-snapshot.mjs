// Writes the daily DONKI snapshot into the game's public folder (layer 2, ADR-0004).
// Runs in the Pages deploy workflow. If DONKI fails, it writes nothing and exits 0:
// the game then falls back to the bundled archive and never shows stale data as live.
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'https://ccmc.gsfc.nasa.gov/DONKI/WS/get'; // ADR-0027
const OUT = new URL('../apps/web/public/data/space-weather.json', import.meta.url);
const DAYS = 7;

const day = (d) => d.toISOString().slice(0, 10);
const end = new Date();
const start = new Date(end.getTime() - DAYS * 24 * 3600 * 1000);
const range = { startDate: day(start), endDate: day(end) };

async function get(route) {
  const url = `${BASE}/${route}?startDate=${range.startDate}&endDate=${range.endDate}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`${route}: HTTP ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

try {
  const [flares, cmes, seps] = await Promise.all([get('FLR'), get('CME'), get('SEP')]);
  const snapshot = { source: 'DONKI', updatedAt: end.toISOString(), range, flares, cmes, seps };
  await mkdir(new URL('.', OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(snapshot));
  console.log(`snapshot: ${flares.length} flares, ${cmes.length} CMEs, ${seps.length} SEPs (${range.startDate}..${range.endDate})`);
} catch (err) {
  console.warn(`snapshot skipped, DONKI unavailable: ${err.message}`);
}
