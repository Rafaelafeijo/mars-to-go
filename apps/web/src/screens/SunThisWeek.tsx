/**
 * "The Sun this week" on the home screen (ADR-0004 layers 1 and 2):
 * 1. LIVE: our API (Railway) asks NASA DONKI for the last 7 days and caches it 30 minutes;
 *    the card says "live" with the time of that fetch.
 * 2. If the API does not answer (or only has a stale cache), the snapshot the Pages workflow
 *    saves twice a day is shown as a dated copy — never labeled live.
 * If both are missing, nothing is shown.
 */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { longDate } from '../lib/format';
import { Icon } from '../world/Icon';

interface Flare {
  flrID: string;
  classType: string;
  peakTime: string;
}
interface Snapshot {
  updatedAt: string;
  range: { startDate: string; endDate: string };
  flares: Flare[];
  cmes: unknown[];
  seps: unknown[];
  /** true when it came from the live API (fresh fetch or its 30-minute cache). */
  live?: boolean;
}

/** Our API (Railway): live DONKI with a 30-minute cache. Same origin on the Railway mirror. */
const API_URL ='https://mars-to-go-api-production.up.railway.app';

async function loadLive(): Promise<Snapshot | null> {
  const res = await fetch(`${API_URL}/space-weather`, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) return null;
  const j = (await res.json()) as { fetchedAt?: string; cache?: string; range: Snapshot['range']; flares: Flare[]; cmes: unknown[]; seps: unknown[] };
  if (!j.fetchedAt || !Array.isArray(j.flares) || j.cache === 'stale') return null;
  return { updatedAt: j.fetchedAt, range: j.range, flares: j.flares, cmes: j.cmes, seps: j.seps, live: true };
}

async function loadCopy(): Promise<Snapshot | null> {
  const r = await fetch(`${import.meta.env.BASE_URL}data/space-weather.json`);
  if (!r.ok) return null;
  const j = (await r.json()) as Snapshot;
  return Array.isArray(j.flares) ? { ...j, live: false } : null;
}

const CLASS_RANK: Record<string, number> = { A: 0, B: 1, C: 2, M: 3, X: 4 };
/** Flare strength for sorting: letter first, then the number (M1.4 > M1.2). */
const strength = (c: string) => (CLASS_RANK[c.charAt(0)] ?? -1) * 100 + Number.parseFloat(c.slice(1) || '0');

export function SunThisWeek({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<Snapshot | null>(null);

  useEffect(() => {
    let alive = true;
    loadLive()
      .catch(() => null)
      .then((live) => live ?? loadCopy().catch(() => null))
      .then((d) => {
        if (alive && d) setData(d);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!data) return null;
  const top = [...data.flares].sort((a, b) => strength(b.classType) - strength(a.classType))[0];
  // Reading of the week (DATA_MAP D5): "busy" if any flare reached M5 or more (NOAA radio
  // blackout scale R2 "moderate" or higher) or any solar particle event was recorded; else "calm".
  const busy = (top ? strength(top.classType) >= strength('M5') : false) || data.seps.length > 0;
  // Always say exactly when the data was fetched (UTC), and whether it is live or the saved copy.
  const updated = t('sunWeek.when', { date: longDate(data.updatedAt.slice(0, 10), i18n.language), time: data.updatedAt.slice(11, 16) });

  if (compact) {
    return (
      <p className="sun-week sun-week--compact">
        <Icon name="storm" size={16} className="tone-rad" /> <strong>{busy ? t('sunWeek.busy') : t('sunWeek.calm')}</strong> ·{' '}
        {t('sunWeek.compact', { flares: data.flares.length, cmes: data.cmes.length })}
      </p>
    );
  }

  return (
    <aside className="sun-week" aria-labelledby="sun-week-title">
      <p className={`sun-week__badge${data.live ? ' is-live' : ''}`}>{data.live ? t('sunWeek.badgeLive') : t('sunWeek.badge')}</p>
      <h2 id="sun-week-title">{t('sunWeek.title')}</h2>
      <dl className="sun-week__stats">
        <div>
          <dt>{t('sunWeek.flares')}</dt>
          <dd>{data.flares.length}</dd>
        </div>
        <div>
          <dt>{t('sunWeek.cmes')}</dt>
          <dd>{data.cmes.length}</dd>
        </div>
        <div>
          <dt>{t('sunWeek.seps')}</dt>
          <dd>{data.seps.length}</dd>
        </div>
      </dl>
      <p className={`sun-week__reading${busy ? ' is-busy' : ''}`}>{busy ? t('sunWeek.busy') : t('sunWeek.calm')}</p>
      {top && (
        <p className="sun-week__top">
          {t('sunWeek.strongest', { cls: top.classType, date: longDate(top.peakTime.slice(0, 10), i18n.language) })}
          <span className="sun-week__id">{top.flrID}</span>
        </p>
      )}
      <p className="sun-week__copy">
        {data.live ? t('sunWeek.liveAt', { date: updated }) : t('sunWeek.copy', { date: updated })} ·{' '}
        <a href="https://ccmc.gsfc.nasa.gov/DONKI/" target="_blank" rel="noreferrer">
          NASA CCMC DONKI
        </a>
      </p>
    </aside>
  );
}
