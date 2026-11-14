import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';

// DONKI host verified in Phase 0 (ADR-0027): no key needed.
export const DONKI_BASE = 'https://ccmc.gsfc.nasa.gov/DONKI/WS/get';
const CACHE_TTL_MS = 30 * 60 * 1000;
const LOOKBACK_DAYS = 7;

type SpaceWeather = {
  source: 'DONKI';
  /** When we fetched from DONKI. Never rewritten when serving from cache (ADR-0004). */
  fetchedAt: string;
  range: { startDate: string; endDate: string };
  flares: unknown[];
  cmes: unknown[];
  seps: unknown[];
};

type Fetcher = (url: string) => Promise<Response>;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function createApp(options: { fetcher?: Fetcher; now?: () => Date; webDist?: string } = {}) {
  const fetcher = options.fetcher ?? ((url) => fetch(url, { signal: AbortSignal.timeout(20_000) }));
  const now = options.now ?? (() => new Date());
  let cache: { at: number; data: SpaceWeather } | null = null;

  async function loadSpaceWeather(): Promise<SpaceWeather> {
    const end = now();
    const start = new Date(end.getTime() - LOOKBACK_DAYS * 24 * 3600 * 1000);
    const range = { startDate: isoDate(start), endDate: isoDate(end) };
    const q = `startDate=${range.startDate}&endDate=${range.endDate}`;
    const get = async (route: string) => {
      const res = await fetcher(`${DONKI_BASE}/${route}?${q}`);
      if (!res.ok) throw new Error(`DONKI ${route} ${res.status}`);
      const text = await res.text();
      return text ? (JSON.parse(text) as unknown[]) : [];
    };
    const [flares, cmes, seps] = await Promise.all([get('FLR'), get('CME'), get('SEP')]);
    return { source: 'DONKI', fetchedAt: end.toISOString(), range, flares, cmes, seps };
  }

  const app = new Hono();
  app.use('/space-weather', cors());
  app.use('/health', cors());

  app.get('/health', (c) => c.json({ status: 'ok', service: 'mars-to-go-api', time: now().toISOString() }));

  app.get('/space-weather', async (c) => {
    const fresh = cache && now().getTime() - cache.at < CACHE_TTL_MS;
    if (cache && fresh) return c.json({ ...cache.data, cache: 'hit' });
    try {
      const data = await loadSpaceWeather();
      cache = { at: now().getTime(), data };
      return c.json({ ...data, cache: 'miss' });
    } catch (err) {
      if (cache) return c.json({ ...cache.data, cache: 'stale' });
      return c.json({ error: 'DONKI unavailable', detail: String(err) }, 502);
    }
  });

  // Mirror of the game (ADR-0011): the built web app, served at /.
  if (options.webDist) {
    app.use('/*', serveStatic({ root: options.webDist }));
    app.get('/*', serveStatic({ path: `${options.webDist}/index.html` }));
  }

  return app;
}
