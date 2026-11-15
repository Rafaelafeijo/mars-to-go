/**
 * End of mission (brief §4.6). After the second design review (ADR-0033): three results
 * (success, with failures, early return), the three objectives with what failed, WHY with that
 * night's numbers, and a readable chart of air and food after each night.
 */
import { useTranslation } from 'react-i18next';
import { V, missionObjectives, missionResult, turningPointSol, type NightStep } from '@mars-to-go/sim';
import { Icon } from '../world/Icon';
import type { Game } from '../game/useGame';

const sum = (steps: NightStep[], ids: NightStep['id'][]) => steps.filter((s) => ids.includes(s.id)).reduce((t, s) => t + s.delta, 0);
const last = (steps: NightStep[], r: NightStep['resource']) => [...steps].reverse().find((s) => s.resource === r)?.after;

/** Air and food after each night: gridlines, sol axis, values on the points, the "ran out" line labeled. */
function Chart({ game }: { game: Game }) {
  const { t } = useTranslation();
  const start = { air: game.state.log[0]?.steps.find((s) => s.resource === 'air')?.before ?? 0 };
  const points = game.state.log.map((l) => ({ sol: l.sol, air: last(l.steps, 'air') ?? 0, food: last(l.steps, 'food') ?? 0 }));
  const W = 560;
  const H = 240;
  const L = 44;
  const R = 16;
  const T = 16;
  const B = 44;
  const max = Math.max(12, start.air, ...points.map((p) => Math.max(p.air, p.food)));
  const min = Math.min(0, ...points.map((p) => Math.min(p.air, p.food)));
  const x = (sol: number) => L + ((sol - 1) / (V.MISSION_SOLS - 1)) * (W - L - R);
  const y = (v: number) => T + ((max - v) / (max - min)) * (H - T - B);
  const path = (k: 'air' | 'food') => points.map((p, i) => `${i ? 'L' : 'M'}${x(p.sol)},${y(p[k])}`).join(' ');
  const area = (k: 'air' | 'food') => (points.length ? `${path(k)} L${x(points[points.length - 1]!.sol)},${y(0)} L${x(points[0]!.sol)},${y(0)} Z` : '');
  const ticks = [0, Math.round(max / 2), max];
  return (
    <figure className="end-chart">
      <figcaption className="end-chart__title">{t('end.chart')}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={points.map((p) => `${t('end.chartSol')} ${p.sol}: ${t('meters.air')} ${p.air}, ${t('meters.food')} ${p.food}`).join('; ')}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="rgb(255 255 255 / 0.08)" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#a89a8e">
              {v}
            </text>
          </g>
        ))}
        <line x1={L} x2={W - R} y1={y(0)} y2={y(0)} stroke="#ff9b8a" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={W - R} y={y(0) - 6} textAnchor="end" fontSize="12" fill="#ff9b8a">
          {t('end.chartRanOut')}
        </text>
        <path d={area('air')} fill="#6ab0ff" opacity="0.12" />
        <path d={area('food')} fill="#7cd17a" opacity="0.1" />
        <path d={path('air')} fill="none" stroke="#6ab0ff" strokeWidth="3" strokeLinejoin="round" />
        <path d={path('food')} fill="none" stroke="#7cd17a" strokeWidth="3" strokeDasharray="7 4" strokeLinejoin="round" />
        {Array.from({ length: V.MISSION_SOLS }, (_, i) => i + 1).map((sol) => (
          <text key={sol} x={x(sol)} y={H - 10} textAnchor="middle" fontSize="12" fill="#a89a8e">
            {t('end.chartSol')} {sol}
          </text>
        ))}
        {points.map((p) => (
          <g key={p.sol}>
            <circle cx={x(p.sol)} cy={y(p.air)} r="5" fill={p.air < 0 ? '#ff5a4a' : '#6ab0ff'} stroke="#14100e" strokeWidth="2" />
            <text x={x(p.sol)} y={y(p.air) - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#cfe3ff">
              {p.air}
            </text>
            <rect x={x(p.sol) - 5} y={y(p.food) - 5} width="10" height="10" fill={p.food < 0 ? '#ff5a4a' : '#7cd17a'} stroke="#14100e" strokeWidth="2" />
            {/* Food value under its point, or above it when the point sits on the bottom line. */}
            <text x={x(p.sol) + 12} y={y(p.food) + (y(p.food) > H - B - 16 ? -8 : 20)} textAnchor="start" fontSize="12" fontWeight="700" fill="#cdeccb">
              {p.food}
            </text>
          </g>
        ))}
      </svg>
      <p className="end-chart__legend">
        <span className="tone-air">● {t('meters.air')}</span>
        <span className="tone-food">■ {t('meters.food')}</span>
      </p>
    </figure>
  );
}

export function EndScreen({
  game,
  onReplay,
  onGoBack,
  onHome,
  onNext,
}: {
  game: Game;
  onReplay: () => void;
  onGoBack: (sol: number) => void;
  onHome: () => void;
  /** Mission 1 ended with everyone home: mission 2 is open. */
  onNext?: () => void;
}) {
  const { t } = useTranslation();
  const s = game.state;
  const result = missionResult(s, game.def) ?? 'early_return';
  const goals = missionObjectives(s, game.def);
  const site = game.def.sampleSite;
  const home = s.status === 'returned_all';
  const turn = turningPointSol(s);
  const failLog = s.failure ? s.log.find((l) => l.sol === s.failure?.sol) : undefined;
  const cause = s.failure?.cause;
  const firstAir = failLog?.steps.find((st) => st.resource === 'air')?.before;
  const firstFood = failLog?.steps.find((st) => st.resource === 'food')?.before;
  const rad = failLog?.steps.find((st) => st.id === 'radiation');
  const causeIcon = cause === 'air' ? 'air' : cause === 'food' ? 'food' : 'radiation';
  const causeTone = cause === 'air' ? 'tone-air' : cause === 'food' ? 'tone-food' : 'tone-rad';

  const rows = [
    { ok: goals.home, text: t('end.objectives.home') },
    {
      ok: goals.sample,
      text: site ? t('end.objectives.sampleDelta', { n: s.discoveries.includes(site) ? 1 : 0 }) : t('end.objectives.sample', { n: s.discoveries.length, goal: V.SAMPLES_GOAL }),
    },
    { ok: goals.dose, text: t('end.objectives.dose', { n: s.exposure, max: V.DOSE_LIMIT }) },
  ];

  return (
    <div className="screen end">
      <p className={`end__badge end__badge--${result}`}>
        <Icon name={result === 'success' ? 'check' : result === 'with_failures' ? 'flag' : 'cross'} size={16} /> {t(`end.result.${result}`)}
      </p>
      <h1 className="verdict-title">{t(`end.result.${result}`)}</h1>

      {!home && (
        <>
          <p className="end__cause">
            <Icon name={causeIcon} size={22} className={causeTone} />{' '}
            {cause === 'air' ? t('end.earlyAir', { n: s.failure?.sol }) : cause === 'food' ? t('end.earlyFood', { n: s.failure?.sol }) : t('end.earlyRadiation', { n: s.failure?.sol })}
          </p>
          {failLog && cause === 'air' && (
            <p className="end__why">
              {t('end.why.air', { n: failLog.sol, made: sum(failLog.steps, ['lifeSupport']), breathed: -sum(failLog.steps, ['breathe']), before: firstAir, after: last(failLog.steps, 'air') })}
            </p>
          )}
          {failLog && cause === 'food' && (
            <p className="end__why">
              {t('end.why.food', { n: failLog.sol, harvested: sum(failLog.steps, ['harvest']), eaten: -sum(failLog.steps, ['eat']), before: firstFood, after: last(failLog.steps, 'food') })}
            </p>
          )}
          {failLog && cause === 'radiation' && rad && (
            <p className="end__why">
              {t('end.why.radiation', { n: failLog.sol, risk: rad.detail?.risk, shield: rad.detail?.shield, before: failLog.steps.find((x) => x.resource === 'exposure')?.before ?? rad.before, after: s.exposure, max: V.DOSE_LIMIT })}
            </p>
          )}
        </>
      )}

      <section className="end__goals" aria-labelledby="goals-title">
        <h2 id="goals-title">{t('end.objectives.title')}</h2>
        <ul>
          {rows.map((r) => (
            <li key={r.text} className={r.ok ? 'is-ok' : 'is-fail'}>
              <Icon name={r.ok ? 'check' : 'cross'} size={18} />
              <span>{r.text}</span>
              <span className="sr-only">{r.ok ? t('world.mission.done') : t('world.mission.todo')}</span>
            </li>
          ))}
        </ul>
        {home && !goals.sample && <p className="end__why">{site ? t('end.missingDelta') : t('end.missingSample')}</p>}
      </section>

      <Chart game={game} />
      {turn && <p>{t('end.turningPoint', { n: turn })}</p>}
      {game.def.id === 'm1' && <p className="muted">{home ? t('end.next') : t('end.locked')}</p>}
      <div className="actions">
        {onNext && (
          <button type="button" className="btn btn--primary" onClick={onNext}>
            <Icon name="storm" size={18} /> {t('end.nextPlay')}
          </button>
        )}
        <button type="button" className={onNext ? 'btn' : 'btn btn--primary'} onClick={onReplay}>
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
