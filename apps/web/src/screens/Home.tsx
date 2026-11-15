/**
 * Home (after design review G): one strong image, three short lines, one button,
 * the level choice (Cadet: 30 s to decide in a crisis · Commander: 10 s), and
 * "The Sun this week" from the dated DONKI copy. No long text to read.
 */
import { useTranslation } from 'react-i18next';
import { photoSrcSet } from '../cards/Photo';
import { Icon } from '../world/Icon';
import { SunThisWeek } from './SunThisWeek';

export function Home({
  onPlay,
  assisted,
  onAssisted,
  onNasaData,
}: {
  onPlay: () => void;
  /** Cadet level = the assisted mode underneath (more time in every timer). */
  assisted: boolean;
  onAssisted: (on: boolean) => void;
  onNasaData: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="hero">
      <img className="hero__bg" src={`${import.meta.env.BASE_URL}images/jezero-panorama-1600.webp`} srcSet={photoSrcSet('jezero-panorama', true)} sizes="100vw" alt="" />
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
        <div className="hero__actions">
          <button type="button" className="hero__play" onClick={onPlay}>
            <span>{t('home.play')}</span>
            <Icon name="rocket" size={26} />
          </button>
          <button type="button" className="hero__data" onClick={onNasaData}>
            <Icon name="radiation" size={16} className="tone-rad" /> {t('hero.nasaData')}
          </button>
        </div>
        <div className="hero__level" role="radiogroup" aria-label={t('home.levelLabel')}>
          <button type="button" role="radio" aria-checked={assisted} className="hero__level-btn" onClick={() => onAssisted(true)}>
            <strong>{t('home.cadet')}</strong> <span>{t('home.cadetHint')}</span>
          </button>
          <button type="button" role="radio" aria-checked={!assisted} className="hero__level-btn" onClick={() => onAssisted(false)}>
            <strong>{t('home.commander')}</strong> <span>{t('home.commanderHint')}</span>
          </button>
        </div>
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
