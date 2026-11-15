/**
 * "The Sun this week" on the home screen: real NASA DONKI events from the snapshot the Pages
 * workflow saves twice a day (ADR-0004 layer 2). Always shown as a dated copy, never as live.
 * If the snapshot is missing, nothing is shown.
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
}

const CLASS_RANK: Record<string, number> = { A: 0, B: 1, C: 2, M: 3, X: 4 };
/** Flare strength for sorting: letter first, then the number (M1.4 > M1.2). */
const strength = (c: string) => (CLASS_RANK[c.charAt(0)] ?? -1) * 100 + Number.parseFloat(c.slice(1) || '0');

export function SunThisWeek({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<Snapshot | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}data/space-weather.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Snapshot | null) => {
        if (alive && j && Array.isArray(j.flares)) setData(j);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!data) return null;
  const top = [...data.flares].sort((a, b) => strength(b.classType) - strength(a.classType))[0];
  // The copy is saved twice a day by the Pages workflow: show exactly when (UTC), never "live".
  const updated = t('sunWeek.when', { date: longDate(data.updatedAt.slice(0, 10), i18n.language), time: data.updatedAt.slice(11, 16) });

  if (compact) {
    return (
      <p className="sun-week sun-week--compact">
        <Icon name="storm" size={16} className="tone-rad" /> {t('sunWeek.compact', { flares: data.flares.length, cmes: data.cmes.length })}{' '}
        <span className="muted">· {t('sunWeek.copy', { date: updated })}</span>
      </p>
    );
  }

  return (
    <aside className="sun-week" aria-labelledby="sun-week-title">
      <p className="sun-week__badge">{t('sunWeek.badge')}</p>
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
      {top && (
        <p className="sun-week__top">
          {t('sunWeek.strongest', { cls: top.classType, date: longDate(top.peakTime.slice(0, 10), i18n.language) })}
          <span className="sun-week__id">{top.flrID}</span>
        </p>
      )}
      <p className="sun-week__explain">{t('sunWeek.explain')}</p>
      <p className="sun-week__copy">
        {t('sunWeek.copy', { date: updated })} ·{' '}
        <a href="https://ccmc.gsfc.nasa.gov/DONKI/" target="_blank" rel="noreferrer">
          NASA CCMC DONKI
        </a>
      </p>
    </aside>
  );
}
