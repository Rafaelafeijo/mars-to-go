import { useTranslation } from 'react-i18next';
import type { CardPhoto } from '@mars-to-go/content';
import { longDate } from '../lib/format';

const BASE = import.meta.env.BASE_URL;

export function photoSrcSet(slug: string): string {
  return [480, 960, 1600].map((w) => `${BASE}images/${slug}-${w}.webp ${w}w`).join(', ');
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
