/**
 * Home (Phase 3B, after the first playtest): one strong image, one sentence, one button.
 * The background is a real NASA photo of Jezero (badged as such); no long text to read.
 */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { photoSrcSet } from '../cards/Photo';
import { prefersReducedMotion } from '../lib/format';
import { Icon } from '../world/Icon';
import { SunThisWeek } from './SunThisWeek';

export function Home({ onPlay, assisted, onAssisted, onNasaData }: { onPlay: () => void; assisted: boolean; onAssisted: (on: boolean) => void; onNasaData: () => void }) {
  const { t } = useTranslation();
  const roles = t('home.roles', { returnObjects: true }) as string[];
  const [role, setRole] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => setRole((r) => (r + 1) % roles.length), 2200);
    return () => window.clearInterval(id);
  }, [roles.length]);

  return (
    <div className="hero">
      <img className="hero__bg" src={`${import.meta.env.BASE_URL}images/jezero-panorama-1600.webp`} srcSet={photoSrcSet('jezero-panorama')} sizes="100vw" alt="" />
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__content">
        <p className="hero__eyebrow">{t('hero.eyebrow')}</p>
        <h1 className="hero__title">
          MARS
          <br />
          TO GO
        </h1>
        <p className="hero__line">
          <span>{t('hero.line1')}</span> <span>{t('hero.line2')}</span>
        </p>
        <p className="hero__role" aria-live="off">
          {t('home.rolePrefix')} <strong>{roles[role]}</strong>
        </p>
        <div className="hero__actions">
          <button type="button" className="hero__play" onClick={onPlay}>
            <span>{t('home.play')}</span>
            <Icon name="rocket" size={26} />
          </button>
          <button type="button" className="hero__data" onClick={onNasaData}>
            <Icon name="radiation" size={16} className="tone-rad" /> {t('hero.nasaData')}
          </button>
        </div>
        <label className="hero__assist">
          <input type="checkbox" role="switch" checked={assisted} onChange={(e) => onAssisted(e.target.checked)} />
          <span>
            {t('home.assisted')}
            <small>{t('home.assistedHint')}</small>
          </span>
        </label>
        <div className="hero__sun-compact">
          <SunThisWeek compact />
        </div>
      </div>
      <div className="hero__side">
        <SunThisWeek />
      </div>
      <p className="hero__credit">{t('hero.credit')}</p>
    </div>
  );
}
