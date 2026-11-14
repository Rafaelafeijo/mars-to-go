import { describe, expect, it } from 'vitest';
import { createApp } from './app';

const fixedNow = () => new Date('2026-11-14T12:00:00Z');

type SpaceWeatherBody = { cache: string; fetchedAt: string; range: { startDate: string; endDate: string } };

describe('api', () => {
  it('answers /health', async () => {
    const res = await createApp({ now: fixedNow }).request('/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: 'ok' });
  });

  it('/space-weather keeps the original fetchedAt when DONKI fails later', async () => {
    let calls = 0;
    let clock = new Date('2026-11-14T12:00:00Z');
    const fetcher = async () => {
      calls += 1;
      if (calls > 3) return new Response('down', { status: 503 });
      return new Response('[]', { status: 200 });
    };
    const app = createApp({ fetcher, now: () => clock });

    const first = (await (await app.request('/space-weather')).json()) as SpaceWeatherBody;
    expect(first.cache).toBe('miss');
    expect(first.range).toEqual({ startDate: '2026-11-07', endDate: '2026-11-14' });

    clock = new Date('2026-11-14T13:00:00Z'); // past the 30 min TTL
    const second = (await (await app.request('/space-weather')).json()) as SpaceWeatherBody;
    expect(second.cache).toBe('stale');
    expect(second.fetchedAt).toBe(first.fetchedAt);
  });

  it('/space-weather returns 502 when DONKI is down and nothing is cached', async () => {
    const app = createApp({ fetcher: async () => new Response('down', { status: 503 }), now: fixedNow });
    expect((await app.request('/space-weather')).status).toBe(502);
  });
});
