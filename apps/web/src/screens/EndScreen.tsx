/**
 * End of mission (brief §4.6), after the first playtest: say clearly WHY an early return
 * happened, with the numbers of that night, and show air and food after each night.
 */
import { useTranslation } from 'react-i18next';
import { V, exposureWord, marginSols, turningPointSol, verdict, type NightStep } from '@mars-to-go/sim';
import { cardById } from '@mars-to-go/content';
import { Photo } from '../cards/Photo';
import { Icon } from '../world/Icon';
import type { Game } from '../game/useGame';

const sum = (steps: NightStep[], ids: NightStep['id'][]) => steps.filter((s) => ids.includes(s.id)).reduce((t, s) => t + s.delta, 0);
const last = (steps: NightStep[], r: NightStep['resource']) => [...steps].reverse().find((s) => s.resource === r)?.after;

function Chart({ game }: { game: Game }) {
  const { t } = useTranslation();
  const points = game.state.log.map((l) => ({ sol: l.sol, air: last(l.steps, 'air') ?? 0, food: last(l.steps, 'food') ?? 0 }));
  const W = 320;
  const H = 120;
  const max = Math.max(12, ...points.map((p) => Math.max(p.air, p.food)));
  const min = Math.min(0, ...points.map((p) => Math.min(p.air, p.food)));
  const x = (sol: number) => 20 + ((sol - 1) / (V.MISSION_SOLS - 1)) * (W - 40);
  const y = (v: number) => 10 + ((max - v) / (max - min)) * (H - 30);
  const line = (k: 'air' | 'food') => points.map((p) => `${x(p.sol)},${y(p[k])}`).join(' ');
  return (
    <figure className="end-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={points.map((p) => `sol ${p.sol}: air ${p.air}, food ${p.food}`).join('; ')}>
        <line x1="16" x2={W - 10} y1={y(0)} y2={y(0)} stroke="#ff9b8a" strokeDasharray="4 4" />
        <polyline points={line('air')} fill="none" stroke="#6ab0ff" strokeWidth="3" />
        <polyline points={line('food')} fill="none" stroke="#7cd17a" strokeWidth="3" strokeDasharray="6 3" />
        {points.map((p) => (
          <g key={p.sol}>
            <circle cx={x(p.sol)} cy={y(p.air)} r="4" fill={p.air < 0 ? '#ff5a4a' : '#6ab0ff'} />
            <rect x={x(p.sol) - 3.5} y={y(p.food) - 3.5} width="7" height="7" fill={p.food < 0 ? '#ff5a4a' : '#7cd17a'} />
            <text x={x(p.sol)} y={H - 4} textAnchor="middle" fontSize="10" fill="#c4b5a8">
              {p.sol}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="small muted">
        <span className="tone-air">● {t('meters.air')}</span> · <span className="tone-food">■ {t('meters.food')}</span> · {t('end.chart')}
      </figcaption>
    </figure>
  );
}

export function EndScreen({ game, onReplay, onGoBack, onHome }: { game: Game; onReplay: () => void; onGoBack: (sol: number) => void; onHome: () => void }) {
  const { t, i18n } = useTranslation();
  const s = game.state;
  const v = verdict(s);
  const home = s.status === 'returned_all';
  const turn = turningPointSol(s);
  const earth = cardById('photo-earth-from-mars');
  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en';
  const failLog = s.failure ? s.log.find((l) => l.sol === s.failure?.sol) : undefined;
  const firstAir = failLog?.steps.find((st) => st.resource === 'air')?.before;
  const firstFood = failLog?.steps.find((st) => st.resource === 'food')?.before;

  return (
    <div className="screen end">
      <h1 className="verdict-title">{home ? t('end.home') : t('end.early')}</h1>
      {v && v !== 'early_return' && <p className="verdict">{t(`end.verdicts.${v}`)}</p>}
      {home ? (
        <p>
          {t('end.margin', { count: marginSols(s) })} <span className="muted small">({t('meters.solsCaption')})</span>
        </p>
      ) : (
        <>
          <p className="end__cause">
            <Icon name={s.failure?.cause === 'air' ? 'air' : 'food'} size={22} className={s.failure?.cause === 'air' ? 'tone-air' : 'tone-food'} />{' '}
            {s.failure?.cause === 'air' ? t('end.earlyAir', { n: s.failure.sol }) : t('end.earlyFood', { n: s.failure?.sol })}
          </p>
          {failLog && s.failure?.cause === 'air' && (
            <p className="end__why">
              {t('end.why.air', { n: failLog.sol, made: sum(failLog.steps, ['lifeSupport']), breathed: -sum(failLog.steps, ['breathe']), before: firstAir, after: last(failLog.steps, 'air') })}
            </p>
          )}
          {failLog && s.failure?.cause === 'food' && (
            <p className="end__why">
              {t('end.why.food', { n: failLog.sol, harvested: sum(failLog.steps, ['harvest']), eaten: -sum(failLog.steps, ['eat']), before: firstFood, after: last(failLog.steps, 'food') })}
            </p>
          )}
        </>
      )}
      <Chart game={game} />
      <p>
        {t('meters.exposure')}: <strong>{t(`meters.exposureWords.${exposureWord(s.exposure)}`)}</strong> · {t('end.discoveries', { count: s.discoveries.length })}
      </p>
      {turn && <p>{t('end.turningPoint', { n: turn })}</p>}
      {home && earth?.photo && <Photo photo={earth.photo} alt={earth.text[locale].title} />}
      {home && <p className="muted">{t('end.next')}</p>}
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={onReplay}>
          {t('end.playAgain')}
        </button>
        {turn && (
          <button type="button" className="btn" onClick={() => onGoBack(turn)}>
            {t('end.goBack', { n: turn })}
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={onHome}>
          {t('end.backHome')}
        </button>
      </div>
    </div>
  );
}
