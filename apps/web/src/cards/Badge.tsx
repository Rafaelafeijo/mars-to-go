import { useTranslation } from 'react-i18next';
import { cardById } from '@mars-to-go/content';
import { badgeDate } from '../lib/format';
import { useOpenCard } from './CardContext';

/** Full badge text: label · source · date (checklist J1). Shown on the card and read by screen readers. */
export function useBadgeText(cardId: string): string | null {
  const { t, i18n } = useTranslation();
  const card = cardById(cardId);
  if (!card) return null;
  const parts = [t(`card.labels.${card.label}`), card.place === 'game' ? t('card.gameRule') : card.badgeSource];
  if (card.date) parts.push(badgeDate(card.date, i18n.language));
  return parts.join(' · ');
}

/**
 * Origin mark next to a number or on an object (ADR-0030): a small diamond.
 * Measured data is highlighted; game rules stay discreet. Tap opens the data card (J2).
 * A pending card renders nothing (ADR-0024).
 */
export function Badge({ cardId, className }: { cardId: string; className?: string }) {
  const { t } = useTranslation();
  const openCard = useOpenCard();
  const card = cardById(cardId);
  const text = useBadgeText(cardId);
  if (!card || !text) return null;
  return (
    <button
      type="button"
      className={`diamond diamond--${card.label}${className ? ` ${className}` : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        openCard(card.id);
      }}
      aria-label={`${text}. ${t('card.open')}`}
      title={text}
    >
      <span aria-hidden="true">◆</span>
    </button>
  );
}
