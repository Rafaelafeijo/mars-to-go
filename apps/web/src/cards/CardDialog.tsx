import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cardById, type Locale } from '@mars-to-go/content';
import { science } from '@mars-to-go/sim';
import { badgeDate, formatNumber, longDate } from '../lib/format';
import { Photo } from './Photo';

/** The data card (checklist J2, J3): source, place and date, treatment, use, simplification, parallel, learn more. */
export function CardDialog({ cardId, onClose }: { cardId: string | null; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  const [more, setMore] = useState(false);
  const card = cardId ? cardById(cardId) : undefined;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (card && !d.open) {
      setMore(false);
      d.showModal();
    }
    if (!card && d.open) d.close();
  }, [card]);

  const locale = (i18n.language === 'pt-BR' ? 'pt-BR' : 'en') as Locale;
  const text = card?.text[locale];

  return (
    <dialog ref={ref} className="card-dialog" onClose={onClose} aria-labelledby="card-title">
      {card && text && (
        <div className="card">
          <p className={`badge badge--${card.label} badge--static`}>
            {[t(`card.labels.${card.label}`), card.place === 'game' ? t('card.gameRule') : card.badgeSource, card.date ? badgeDate(card.date, i18n.language) : null]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <h2 id="card-title">{text.title}</h2>
          <p className="card__what">{text.what}</p>
          {card.photo && <Photo photo={card.photo} alt={text.title} />}
          <dl>
            <dt>{t('card.source')}</dt>
            <dd>
              <a href={card.sourceUrl} target="_blank" rel="noreferrer">
                {card.sourceName}
              </a>
              {card.recordId && (
                <>
                  <br />
                  {t('card.record')}: <code>{card.recordId}</code>
                </>
              )}
            </dd>
            <dt>{t('card.placeDate')}</dt>
            <dd>
              {t(`card.places.${card.place}`)}
              {card.date ? ` · ${longDate(card.date, i18n.language)}` : ''}
            </dd>
            <dt>{t('card.processing')}</dt>
            <dd>{text.processing}</dd>
            <dt>{t('card.gameUse')}</dt>
            <dd>{text.gameUse}</dd>
            <dt>{t('card.simplified')}</dt>
            <dd>{text.simplified}</dd>
            {text.parallel && (
              <>
                <dt>{t('card.parallel')}</dt>
                <dd>{text.parallel}</dd>
              </>
            )}
          </dl>
          {card.facts.length > 0 && (
            <section className="card__facts">
              <h3>{t('card.facts')}</h3>
              <ul>
                {card.facts.map((id) => {
                  const f = science(id);
                  return (
                    <li key={id}>
                      <strong>
                        {formatNumber(f.value, i18n.language)} {f.unit}
                      </strong>{' '}
                      · {t(`card.labels.${f.label}`)} · {t(`card.places.${f.place}`)}
                      {f.measuredOn ? ` · ${f.measuredOn}` : ''}
                      <br />
                      <a href={f.url} target="_blank" rel="noreferrer">
                        {f.source}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          <button type="button" className="btn btn--ghost" aria-expanded={more} onClick={() => setMore((m) => !m)}>
            {t('card.learnMore')}
          </button>
          {more && <p className="card__more">{text.learnMore}</p>}
          <button type="button" className="btn" onClick={() => ref.current?.close()}>
            {t('card.close')}
          </button>
        </div>
      )}
    </dialog>
  );
}
