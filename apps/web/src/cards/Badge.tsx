import { useTranslation } from 'react-i18next';
import { cardById } from '@mars-to-go/content';
import { badgeDate } from '../lib/format';
import { useOpenCard } from './CardContext';

/**
 * Origin badge shown next to every number (checklist J1): label · source · date.
 * Tapping it opens the data card (J2). A pending card renders nothing (ADR-0024).
 */
export function Badge({ cardId }: { cardId: string }) {
  const { t, i18n } = useTranslation();
  const openCard = useOpenCard();
  const card = cardById(cardId);
  if (!card) return null;
  const parts = [t(`card.labels.${card.label}`), card.place === 'game' ? t('card.gameRule') : card.badgeSource];
  if (card.date) parts.push(badgeDate(card.date, i18n.language));
  const text = parts.join(' · ');
  return (
    <button type="button" className={`badge badge--${card.label}`} onClick={() => openCard(card.id)} aria-label={`${text}. ${t('card.open')}`}>
      {text}
    </button>
  );
}
