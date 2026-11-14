import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  V,
  cellsUsed,
  conditionsFor,
  freeCells,
  openDestinations,
  resolveNight,
  tomorrowForecast,
  unlockSol,
  validateAllocation,
  type Allocation,
  type Destination,
  type SolConditions,
} from '@mars-to-go/sim';
import { catalogEvent } from '@mars-to-go/content';
import { Badge } from '../cards/Badge';
import { longDate } from '../lib/format';
import { stepCardId, stepText } from '../game/stepText';
import type { Game } from '../game/useGame';
import { Meters } from './Meters';
import { SolHeader } from './SolHeader';

const EMPTY: Allocation = { lifeSupport: 0, greenhouse: 0, shield: 0, expedition: 0, askEarth: 0 };
const DESTINATIONS: Destination[] = ['lifeSupport', 'greenhouse', 'shield', 'expedition', 'askEarth'];

function EventLine({ cond, tomorrow }: { cond: SolConditions | null; tomorrow?: boolean }) {
  const { t, i18n } = useTranslation();
  const ev = catalogEvent(cond?.event?.id);
  if (tomorrow) {
    return (
      <p className="forecast__tomorrow">
        <strong>{t('forecast.tomorrow')}</strong>{' '}
        {ev ? t('forecast.tomorrowEvent', { kind: t(`forecast.kinds.${ev.kind}`), label: ev.classLabel }) : t('forecast.tomorrowCalm')}
      </p>
    );
  }
  if (!ev) return <p>{t('forecast.calm')}</p>;
  const riskWords = t('forecast.riskWords', { returnObjects: true }) as string[];
  return (
    <>
      <p>
        {t('forecast.event', { kind: t(`forecast.kinds.${ev.kind}`), label: ev.classLabel, date: longDate(ev.date, i18n.language) })}{' '}
        <Badge cardId={ev.cardId} />
      </p>
      <p>
        {t('forecast.risk', { word: riskWords[ev.risk] })} <Badge cardId="riskTable" />
      </p>
      <p className="muted">{t('forecast.maybe')}</p>
    </>
  );
}

function Question({ game, onAnswer }: { game: Game; onAnswer: (a: number | null) => void }) {
  const { t } = useTranslation();
  const q = game.morning.question;
  const options = t(`question.${q}Options`, { returnObjects: true }) as string[];
  return (
    <section className="panel" aria-labelledby="q-title">
      <h2 id="q-title">{t('question.title')}</h2>
      <p>{t(`question.${q}`)}</p>
      <div className="choices" role="group" aria-labelledby="q-title">
        {options.map((o, i) => (
          <button key={o} type="button" className="btn btn--choice" aria-pressed={game.morning.answer === i} onClick={() => onAnswer(i)}>
            {o}
          </button>
        ))}
      </div>
      {game.morning.answer !== null && <p className="muted small">{t('question.saved')}</p>}
    </section>
  );
}

export function Morning({ game, onAnswer, onLock }: { game: Game; onAnswer: (a: number | null) => void; onLock: (a: Allocation) => void }) {
  const { t } = useTranslation();
  const { def, state } = game;
  const cond = conditionsFor(def, state.sol);
  const free = freeCells(cond.dust);
  const open = openDestinations(state.mode, state.sol);
  const [a, setA] = useState<Allocation>(EMPTY);
  const used = cellsUsed(a);
  const left = free - used;
  const errors = validateAllocation(state, a, cond.dust);
  const preview = useMemo(() => resolveNight(def, state, { allocation: a }), [def, state, a]);
  const evCard = catalogEvent(cond.event?.id)?.cardId;

  const cost = (d: Destination) => (d === 'expedition' ? V.EXPEDITION_CELLS : d === 'askEarth' ? V.ASK_EARTH_CELLS : 1);
  const count = (d: Destination) => a[d];
  const change = (d: Destination, delta: 1 | -1) => {
    setA((prev) => {
      if (d === 'expedition' || d === 'askEarth') return { ...prev, [d]: delta > 0 ? 1 : 0 };
      return { ...prev, [d]: Math.max(0, prev[d] + delta) };
    });
  };
  const canAdd = (d: Destination) =>
    open.includes(d) && left >= cost(d) && ((d !== 'expedition' && d !== 'askEarth') || a[d] === 0);

  return (
    <div className="screen">
      <SolHeader state={state} />
      <Meters state={state} dust={cond.dust} />

      <section className="panel" aria-labelledby="fc-title">
        <h2 id="fc-title">{t('forecast.title')}</h2>
        {cond.dust && (
          <p>
            {t('forecast.dust', { cells: V.CELLS_DUST_SOL })} <Badge cardId="dust" />
          </p>
        )}
        <EventLine cond={cond} />
        <EventLine cond={tomorrowForecast(def, state.sol)} tomorrow />
      </section>

      <Question game={game} onAnswer={onAnswer} />

      <section className="panel" aria-labelledby="alloc-title">
        <h2 id="alloc-title">{t('alloc.title')}</h2>
        <p className="muted">
          {t('alloc.heating', { count: V.HEATING_CELLS })} <Badge cardId="heating" />
        </p>
        <p className="cells-left" aria-live="polite">
          {left > 0 ? t('alloc.left', { count: left }) : t('alloc.allPlaced')}
        </p>
        <div className="cell-bar" aria-hidden="true">
          {Array.from({ length: free }, (_, i) => (
            <span key={i} className={i < used ? 'cell cell--used' : 'cell'} />
          ))}
        </div>
        <ul className="dests">
          {DESTINATIONS.map((d) => {
            const name = t(`alloc.destinations.${d}.name`);
            const isOpen = open.includes(d);
            return (
              <li key={d} className={isOpen ? 'dest' : 'dest dest--locked'}>
                <div className="dest__text">
                  <strong>{name}</strong> <Badge cardId={d} />
                  <span className="small">{t(`alloc.destinations.${d}.does`)}</span>
                  <span className="small muted">{t('alloc.cost', { text: t(`alloc.destinations.${d}.cost`) })}</span>
                  {!isOpen && <span className="small">🔒 {t('alloc.locked', { n: unlockSol(d) })}</span>}
                </div>
                {isOpen && (
                  <div className="stepper">
                    <button type="button" className="btn btn--round" disabled={count(d) === 0} onClick={() => change(d, -1)} aria-label={t('alloc.remove', { name })}>
                      −
                    </button>
                    <span className="stepper__value" aria-live="polite">
                      {count(d) * cost(d)}
                    </span>
                    <button type="button" className="btn btn--round" disabled={!canAdd(d)} onClick={() => change(d, 1)} aria-label={t('alloc.add', { name })}>
                      +
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel math" aria-labelledby="math-title">
        <h2 id="math-title">{t('math.title')}</h2>
        <ol className="steps">
          {preview.steps.map((s, i) => {
            const card = stepCardId(s, evCard);
            return (
              <li key={`${s.id}-${i}`}>
                {stepText(t, s)} {card && <Badge cardId={card} />}
              </li>
            );
          })}
        </ol>
        <p className="math__after">
          <strong>{t('math.after')}:</strong> {t('meters.air')} {preview.state.air} · {t('meters.food')} {preview.state.food}
        </p>
      </section>

      {errors.some((e) => e.code === 'wrongTotal') && (
        <p className="muted" role="status">
          {t('alloc.wrongTotal', { free, used })}
        </p>
      )}
      <button type="button" className="btn btn--primary" disabled={errors.length > 0} onClick={() => onLock(a)}>
        {t('alloc.lockPlan')}
      </button>
    </div>
  );
}
