/**
 * The trail of 7 sols (ADR-0031): forecast of each sol, harvests on the way,
 * sols cut by dust, and the air and food lines from the projection. A line that
 * reaches home is "ok"; one that stops shows the sol it runs out. Shape and text
 * carry the meaning, never color alone.
 */
import { useTranslation } from 'react-i18next';
import { V, conditionsFor, freeCells, type Allocation, type MissionDef, type MissionState, type Projection } from '@mars-to-go/sim';

interface Props {
  def: MissionDef;
  state: MissionState;
  plan: Allocation;
  projection: Projection;
}

export function Trail({ def, state, plan, projection }: Props) {
  const { t } = useTranslation();
  const sols = Array.from({ length: V.MISSION_SOLS }, (_, i) => i + 1);

  // Food arriving per sol: harvests already planted plus today's planting.
  const arriving = new Map<number, number>();
  for (const h of state.pendingHarvests) arriving.set(h.sol, (arriving.get(h.sol) ?? 0) + h.food);
  if (plan.greenhouse > 0) {
    const s = state.sol + V.GREENHOUSE_DELAY_SOLS;
    arriving.set(s, (arriving.get(s) ?? 0) + plan.greenhouse * V.FOOD_PER_GREENHOUSE_CELL);
  }

  const line = (kind: 'air' | 'food') => {
    const values = projection[kind];
    const ends = kind === 'air' ? projection.airEndsOnSol : projection.foodEndsOnSol;
    const ok = ends === null;
    const status = ok ? t('one.trail.reachesHome') : t('one.trail.runsOut', { n: ends });
    return (
      <div className={`trail__row trail__row--${ok ? 'ok' : 'bad'}`} role="img" aria-label={t(kind === 'air' ? 'one.trail.lineAir' : 'one.trail.lineFood', { status })}>
        <span className="trail__rowlabel" aria-hidden="true">
          {kind === 'air' ? '💨' : '🥬'}
        </span>
        {sols.map((s) => {
          const v = values.find((x) => x.sol === s);
          const past = s < state.sol;
          if (past || !v) return <span key={s} className={`trail__cell${past ? ' trail__cell--past' : ''}`} aria-hidden="true" />;
          const dead = v.value < 0;
          return (
            <span key={s} className={`trail__cell trail__cell--line${dead ? ' trail__cell--dead' : ''}`} aria-hidden="true">
              {dead ? '✕' : v.value}
            </span>
          );
        })}
        <span className="trail__cell trail__cell--home" aria-hidden="true">
          {ok ? '✓' : ''}
        </span>
      </div>
    );
  };

  const statusOf = (ends: number | null) => (ends === null ? `✓ ${t('one.trail.reachesHome')}` : `✕ ${t('one.trail.runsOut', { n: ends })}`);

  return (
    <section className="trail" aria-label={t('one.trail.label')}>
      <div className="trail__row trail__row--head">
        <span className="trail__rowlabel" aria-hidden="true" />
        {sols.map((s) => {
          const cond = conditionsFor(def, s);
          const cut = projection.sols.find((x) => x.sol === s)?.cut ?? false;
          const food = arriving.get(s);
          const icon = cond.dust ? '🌫' : cond.event ? '⚡' : '☀';
          const what = cond.dust ? t('one.trail.dust', { count: freeCells(true) }) : cond.event ? t('one.trail.event') : t('one.trail.calm');
          const parts = [`${t('sol.label', { n: s })}${s === state.sol ? ` (${t('one.trail.today')})` : ''}`, what];
          if (cut) parts.push(t('one.trail.cut'));
          if (food) parts.push(t('one.trail.harvest', { count: food }));
          return (
            <span
              key={s}
              className={`trail__sol${s === state.sol ? ' trail__sol--today' : ''}${s < state.sol ? ' trail__sol--past' : ''}${cut ? ' trail__sol--cut' : ''}`}
              role="img"
              aria-label={parts.join(', ')}
            >
              <span className="trail__num">{s}</span>
              <span className="trail__icon">{icon}</span>
              {cond.dust && <span className="trail__small">{freeCells(true)}</span>}
              {cut && <span className="trail__small">✂</span>}
              {food ? <span className="trail__small trail__food">+{food}🥬</span> : null}
            </span>
          );
        })}
        <span className="trail__sol trail__sol--home" role="img" aria-label={t('one.trail.home')}>
          <span className="trail__icon">🏠</span>
        </span>
      </div>
      {line('air')}
      {line('food')}
      <p className="trail__summary" aria-hidden="true">
        <span className={projection.airEndsOnSol === null ? 'ok' : 'bad'}>
          💨 {t('one.trail.air')}: {statusOf(projection.airEndsOnSol)}
        </span>
        <span className={projection.foodEndsOnSol === null ? 'ok' : 'bad'}>
          🥬 {t('one.trail.food')}: {statusOf(projection.foodEndsOnSol)}
        </span>
      </p>
      <p className="trail__assumption">{t('one.trail.assumption')}</p>
    </section>
  );
}
