import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cardById } from '@mars-to-go/content';
import { Badge } from '../cards/Badge';
import { photoSrcSet } from '../cards/Photo';
import { prefersReducedMotion } from '../lib/format';

const BASE = import.meta.env.BASE_URL;

export function Home({ onPlay, assisted, onAssisted }: { onPlay: () => void; assisted: boolean; onAssisted: (on: boolean) => void }) {
  const { t } = useTranslation();
  const roles = t('home.roles', { returnObjects: true }) as string[];
  const [role, setRole] = useState(0);
  const [how, setHow] = useState(false);
  const panorama = cardById('photo-jezero-panorama');

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => setRole((r) => (r + 1) % roles.length), 2200);
    return () => window.clearInterval(id);
  }, [roles.length]);

  return (
    <div className="home">
      <div className="home__horizon">
        <img src={`${BASE}images/jezero-panorama-960.webp`} srcSet={photoSrcSet('jezero-panorama')} sizes="100vw" alt="" />
      </div>
      <h1 className="title">{t('app.title')}</h1>
      <p className="tagline">{t('app.tagline')}</p>
      <p className="numbers-line">{t('home.numbersLine')}</p>
      <p className="role" aria-live="off">
        {t('home.rolePrefix')} <strong>{roles[role]}</strong>
      </p>
      <p>{t('home.intro')}</p>
      <p>{t('home.solExplained')}</p>
      {panorama && (
        <p className="home__proof">
          <Badge cardId="photo-jezero-panorama" />
        </p>
      )}
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={onPlay}>
          {t('home.play')}
        </button>
        <button type="button" className="btn btn--ghost" aria-expanded={how} onClick={() => setHow((h) => !h)}>
          {t('home.howItWorks')}
        </button>
        {how && <p className="how">{t('home.howItWorksText')}</p>}
        <button type="button" className="btn btn--ghost" disabled aria-describedby="surprise-locked">
          {t('home.surprise')}
        </button>
        <span id="surprise-locked" className="muted small">
          {t('home.surpriseLocked')}
        </span>
      </div>
      <label className="toggle">
        <input type="checkbox" checked={assisted} onChange={(e) => onAssisted(e.target.checked)} />
        <span>
          {t('home.assisted')} — <span className="muted">{t('home.assistedHint')}</span>
        </span>
      </label>
    </div>
  );
}
