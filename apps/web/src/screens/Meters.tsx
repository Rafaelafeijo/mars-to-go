import { useTranslation } from 'react-i18next';
import { V, airSols, exposureWord, foodSols, freeCells, meterWord, type MissionState } from '@mars-to-go/sim';
import { Badge } from '../cards/Badge';

/** Three resources as cards: icon, big number, word pill — never color alone (ADR-0023, checklist C3). */
export function Meters({ state, dust }: { state: Pick<MissionState, 'air' | 'food' | 'exposure'>; dust: boolean }) {
  const { t } = useTranslation();
  const air = airSols(state.air);
  const food = foodSols(state.food);
  const cells = freeCells(dust) + V.HEATING_CELLS;
  return (
    <section className="meters" aria-label={t('meters.title')}>
      <div className="meter">
        <span className="meter__icon" aria-hidden="true">⚡</span>
        <span className="meter__name">{t('meters.power')}</span>
        <span className="meter__value">{cells}</span>
        <span className="meter__sub">{t('meters.cellsToday', { count: cells })}</span>
        <Badge cardId={dust ? 'dust' : 'cells'} />
      </div>
      <div className="meter">
        <span className="meter__icon" aria-hidden="true">💨</span>
        <span className="meter__name">{t('meters.air')}</span>
        <span className="meter__value">{state.air}</span>
        <span className={`pill pill--${meterWord(air)}`}>{t(`meters.words.${meterWord(air)}`)}</span>
        <span className="meter__sub">{t('meters.solsOfReserve', { count: air })}</span>
        <Badge cardId="air" />
      </div>
      <div className="meter">
        <span className="meter__icon" aria-hidden="true">🥬</span>
        <span className="meter__name">{t('meters.food')}</span>
        <span className="meter__value">{state.food}</span>
        <span className={`pill pill--${meterWord(food)}`}>{t(`meters.words.${meterWord(food)}`)}</span>
        <span className="meter__sub">{t('meters.solsOfReserve', { count: food })}</span>
        <Badge cardId="food" />
      </div>
      <div className="meter meter--wide">
        <span className="meter__icon" aria-hidden="true">☢</span>
        <span className="meter__name">{t('meters.exposure')}</span>
        <span className={`pill pill--exp-${exposureWord(state.exposure)}`}>{t(`meters.exposureWords.${exposureWord(state.exposure)}`)}</span>
        <Badge cardId="exposure" />
      </div>
    </section>
  );
}
