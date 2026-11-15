/**
 * Briefing (after the first playtest): meet the commander, then four short bullets.
 * Bullets helped the young tester read; long text did not.
 */
import { useTranslation } from 'react-i18next';
import { Icon, type IconName } from '../world/Icon';

type Point = { icon: IconName; tone: string; key: string };
const POINTS: Point[] = [
  { icon: 'rocket', tone: 'tone-energy', key: 'goal' },
  { icon: 'air', tone: 'tone-air', key: 'air' },
  { icon: 'food', tone: 'tone-food', key: 'food' },
  { icon: 'energy', tone: 'tone-energy', key: 'power' },
];
/** Mission 2 "The May storm": the real week, the dose limit, the rover sample, the crisis. */
const POINTS_M2: Point[] = [
  { icon: 'storm', tone: 'tone-rad', key: 'storm' },
  { icon: 'shield', tone: 'tone-rad', key: 'dose' },
  { icon: 'rover', tone: 'tone-energy', key: 'sample' },
  { icon: 'antenna', tone: 'tone-energy', key: 'crisis' },
];

export function Briefing({ onStart, missionId = 'm1' }: { onStart: () => void; missionId?: string }) {
  const { t } = useTranslation();
  const m2 = missionId === 'm2';
  const ns = m2 ? 'brief2' : 'brief';
  const points = m2 ? POINTS_M2 : POINTS;
  return (
    <div className="brief">
      <div className="brief__card">
        <svg className="brief__portrait" viewBox="0 0 120 140" role="img" aria-label={t('brief.portrait')}>
          <circle cx="60" cy="48" r="38" fill="#f2efe9" />
          <ellipse cx="60" cy="50" rx="27" ry="21" fill="#2b2f3a" stroke="#c8a24a" strokeWidth="4" />
          <path d="M44 44 q8 -8 16 -4" stroke="#9fc3ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M22 140 q0 -46 38 -50 q38 4 38 50 z" fill="#f2efe9" />
          <rect x="50" y="104" width="20" height="14" rx="3" fill="#3a3a44" />
          <rect x="28" y="100" width="12" height="6" rx="2" fill="#e8703a" />
        </svg>
        <div>
          <p className="brief__eyebrow">{t(`${ns}.eyebrow`)}</p>
          <h1 className="brief__title">{t(`${ns}.title`)}</h1>
          <p className="brief__intro">{t(`${ns}.intro`)}</p>
        </div>
      </div>
      <ul className="brief__points">
        {points.map((p) => (
          <li key={p.key}>
            <span className={`brief__icon ${p.tone}`}>
              <Icon name={p.icon} size={26} />
            </span>
            <span>{t(`${ns}.${p.key}`)}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="hero__play brief__start" onClick={onStart}>
        <span>{t('briefing.start')}</span>
        <Icon name="walk" size={24} />
      </button>
    </div>
  );
}
