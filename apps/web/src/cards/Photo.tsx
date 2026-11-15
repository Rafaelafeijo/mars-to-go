import { useTranslation } from 'react-i18next';
import type { CardPhoto } from '@mars-to-go/content';
import { longDate } from '../lib/format';

const BASE = import.meta.env.BASE_URL;

/**
 * Responsive sources. Cards and reports are never wider than 600 px, so 480 and 960 are enough;
 * only full-screen images (the home hero) ask for 1600. prepare_images.py never upscales, so a
 * photo whose original is smaller than 1600 px has no -1600 file.
 */
export function photoSrcSet(slug: string, fullScreen = false): string {
  return (fullScreen ? [480, 960, 1600] : [480, 960]).map((w) => `${BASE}images/${slug}-${w}.webp ${w}w`).join(', ');
}

/** A real photo is proof: always with the REAL PHOTO badge, credit, mission, date and place (ADR-0023). */
export function Photo({ photo, alt }: { photo: CardPhoto; alt: string }) {
  const { t, i18n } = useTranslation();
  return (
    <figure className="photo">
      <img src={`${BASE}images/${photo.slug}-960.webp`} srcSet={photoSrcSet(photo.slug)} sizes="(max-width: 640px) 100vw, 600px" alt={alt} loading="lazy" />
      <figcaption>
        <span className="photo__badge">
          {t('card.realPhoto')}
          {photo.enhancedColor ? ` · ${t('card.enhanced')}` : ''}
        </span>{' '}
        <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
          {t('card.photoCredit', {
            credit: photo.credit,
            mission: photo.mission,
            date: longDate(photo.date, i18n.language),
            place: t(`card.places.${photo.place}`),
          })}
        </a>
      </figcaption>
    </figure>
  );
}
