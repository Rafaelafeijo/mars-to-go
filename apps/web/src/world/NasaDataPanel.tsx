/**
 * "Real NASA data in this game": every NASA dataset the game uses, what it is,
 * where it appears, live or archive. Built from packages/content (same source as the game).
 */
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NASA_SOURCES, type Locale } from '@mars-to-go/content';
import { Icon } from './Icon';

export function NasaDataPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'pt-BR' ? 'pt-BR' : 'en') as Locale;
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="nasa-panel" onClose={onClose} aria-labelledby="nasa-title">
      <div className="nasa-panel__body">
        <h2 id="nasa-title">
          <Icon name="radiation" size={22} className="tone-rad" /> {t('nasa.title')}
        </h2>
        <p className="muted">{t('nasa.intro')}</p>
        {/* Moved from the home screen card (design review G). */}
        <p className="muted">{t('sunWeek.explain')}</p>
        <ul className="nasa-panel__list">
          {NASA_SOURCES.map((s) => (
            <li key={s.id}>
              <div className="nasa-panel__head">
                <a href={s.url} target="_blank" rel="noreferrer">
                  <strong>{s.name}</strong>
                </a>
                <span className={`nasa-panel__mode nasa-panel__mode--${s.mode}`}>{t(`nasa.mode.${s.mode}`)}</span>
              </div>
              <p>{s.what[locale]}</p>
              <p className="muted small">
                {t('nasa.where')}: {s.whereInGame[locale]}
              </p>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--primary" onClick={() => ref.current?.close()}>
          {t('card.close')}
        </button>
      </div>
    </dialog>
  );
}
