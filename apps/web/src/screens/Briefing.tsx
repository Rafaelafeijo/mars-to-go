import { useTranslation } from 'react-i18next';
import { Badge } from '../cards/Badge';

export function Briefing({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="screen">
      <p className="eyebrow">{t('missions.m1')}</p>
      <h1>{t('briefing.title')}</h1>
      <p>{t('briefing.crew')}</p>
      <p>
        {t('home.solExplained')} {t('briefing.goal')} <Badge cardId="sol" />
      </p>
      <ul className="briefing-list">
        <li>
          {t('briefing.air')} <Badge cardId="air" />
        </li>
        <li>
          {t('briefing.food')} <Badge cardId="food" />
        </li>
        <li>
          {t('briefing.power')} <Badge cardId="cells" />
        </li>
      </ul>
      <button type="button" className="btn btn--primary" onClick={onStart}>
        {t('briefing.start')}
      </button>
    </div>
  );
}
