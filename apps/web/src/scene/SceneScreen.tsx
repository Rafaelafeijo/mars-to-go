/**
 * The scene (ADR-0030): one place where the sol is played. Meters on top, the stage
 * with Inside/Outside views, and short panels (never a scrolling page). All numbers
 * come from packages/sim; this file only arranges and animates them.
 */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  V,
  airSols,
  conditionsFor,
  exposureWord,
  foodSols,
  freeCells,
  meterWord,
  openDestinations,
  resolveNight,
  tomorrowForecast,
  validateAllocation,
  whatIf,
  type Allocation,
  type Destination,
  type NightStep,
} from '@mars-to-go/sim';
import { catalogEvent } from '@mars-to-go/content';
import { Badge } from '../cards/Badge';
import { longDate, prefersReducedMotion } from '../lib/format';
import { stepCardId, stepText } from '../game/stepText';
import { QUESTION_ANSWER, type Game } from '../game/useGame';
import { InsideView, type Mood } from './InsideView';
import { OutsideView } from './OutsideView';

type View = 'inside' | 'outside';
type MorningStep = 'forecast' | 'question' | 'plan';

const EMPTY: Allocation = { lifeSupport: 0, greenhouse: 0, shield: 0, expedition: 0, askEarth: 0 };
const STEP_MS = 1300;
const STEP_MS_ASSISTED = 2600;

const STEP_OBJECT: Record<NightStep['id'], Destination | 'crew' | null> = {
  lifeSupport: 'lifeSupport',
  greenhouseRescue: 'greenhouse',
  harvestLost: 'greenhouse',
  harvest: 'greenhouse',
  plant: 'greenhouse',
  breathe: 'crew',
  eat: 'crew',
  expedition: 'expedition',
  expeditionRecalled: 'expedition',
  outside: 'expedition',
  radiation: 'shield',
  earthAnswer: 'askEarth',
};

interface Props {
  game: Game;
  onAnswer: (a: number | null) => void;
  onLock: (a: Allocation) => void;
  onPick: (i: number) => void;
  onEndNight: () => void;
  onNext: () => void;
}

function Hud({ sol, first, air, food, exposure, cellsLeft, dust }: { sol: number; first: boolean; air: number; food: number; exposure: number; cellsLeft: number; dust: boolean }) {
  const { t } = useTranslation();
  const aw = meterWord(airSols(air));
  const fw = meterWord(foodSols(food));
  const ew = exposureWord(exposure);
  return (
    <div className="hud" role="group" aria-label={t('meters.title')}>
      <div className="hud__sol">
        <span className="hud__big">{first ? t('sol.label', { n: sol }) : t('sol.labelOf', { n: sol, total: V.MISSION_SOLS })}</span>
        {first && <span className="hud__caption">{t('sol.caption', { n: sol })}</span>}
        <Badge cardId="sol" />
      </div>
      <div className="hud__m">
        <span className="hud__name">⚡ {t('meters.power')}</span>
        <span className="hud__big">{cellsLeft}</span>
        <span className="hud__caption">{t('scene.cellsLeft', { count: cellsLeft })}</span>
        <Badge cardId={dust ? 'dust' : 'cells'} />
      </div>
      <div className="hud__m">
        <span className="hud__name">💨 {t('meters.air')}</span>
        <span className="hud__big">{air}</span>
        <span className={`pill pill--${aw}`}>{t(`meters.words.${aw}`)}</span>
        <Badge cardId="air" />
      </div>
      <div className="hud__m">
        <span className="hud__name">🥬 {t('meters.food')}</span>
        <span className="hud__big">{food}</span>
        <span className={`pill pill--${fw}`}>{t(`meters.words.${fw}`)}</span>
        <Badge cardId="food" />
      </div>
      <div className="hud__m">
        <span className="hud__name">☢ {t('meters.exposure')}</span>
        <span className={`pill pill--exp-${ew}`}>{t(`meters.exposureWords.${ew}`)}</span>
        <Badge cardId="exposure" />
      </div>
    </div>
  );
}

export function SceneScreen({ game, onAnswer, onLock, onPick, onEndNight, onNext }: Props) {
  const { t, i18n } = useTranslation();
  const { def, screen } = game;
  const night = game.night;
  const base = screen === 'morning' ? game.state : (night?.before ?? game.state);
  const cond = conditionsFor(def, base.sol);
  const free = freeCells(cond.dust);
  const open = openDestinations(base.mode, base.sol);
  const ev = catalogEvent(cond.event?.id);

  const [view, setView] = useState<View>('inside');
  const [step, setStep] = useState<MorningStep>('forecast');
  const [a, setA] = useState<Allocation>(EMPTY);
  const [floater, setFloater] = useState<{ key: number; text: string } | null>(null);

  // Night animation state.
  const [nightPhase, setNightPhase] = useState<'pick' | 'math'>('pick');
  const [shownRaw, setShown] = useState(0);
  const [run, setRun] = useState(0);
  const reduced = prefersReducedMotion();
  const steps = night?.result.steps ?? [];
  const shown = reduced ? steps.length : shownRaw;

  useEffect(() => {
    if (screen !== 'night' || nightPhase !== 'math' || reduced) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= steps.length) window.clearInterval(id);
    }, game.assisted ? STEP_MS_ASSISTED : STEP_MS);
    return () => window.clearInterval(id);
  }, [screen, nightPhase, reduced, steps.length, game.assisted, run]);

  const allocation = screen === 'morning' ? a : (night?.allocation ?? EMPTY);
  const used = allocation.lifeSupport + allocation.greenhouse + allocation.shield + allocation.expedition * V.EXPEDITION_CELLS + allocation.askEarth * V.ASK_EARTH_CELLS;
  const left = free - used;
  const preview = useMemo(() => resolveNight(def, base, { allocation: a }), [def, base, a]);
  const errors = validateAllocation(base, a, cond.dust);

  const add = (d: Destination) => {
    const cost = d === 'expedition' ? V.EXPEDITION_CELLS : d === 'askEarth' ? V.ASK_EARTH_CELLS : 1;
    if (left < cost) return;
    if ((d === 'expedition' || d === 'askEarth') && a[d] === 1) return;
    setA((p) => ({ ...p, [d]: d === 'expedition' || d === 'askEarth' ? 1 : p[d] + 1 }));
    const n = d === 'lifeSupport' ? V.AIR_PER_LIFE_SUPPORT_CELL : d === 'greenhouse' ? V.FOOD_PER_GREENHOUSE_CELL : V.SHIELD_BLOCK_PER_CELL;
    const key = d === 'lifeSupport' ? 'air' : d === 'greenhouse' ? 'food' : d;
    setFloater({ key: Date.now(), text: t(`scene.float.${key}`, { n }) });
  };
  const remove = (d: Destination) => setA((p) => ({ ...p, [d]: d === 'expedition' || d === 'askEarth' ? 0 : Math.max(0, p[d] - 1) }));

  // Values shown in the meters: live preview in the morning, step by step at night.
  const visible = steps.slice(0, shown);
  const lastOf = (r: NightStep['resource'], fallback: number) => [...visible].reverse().find((s) => s.resource === r)?.after ?? fallback;
  const hud =
    screen === 'night'
      ? { air: lastOf('air', base.air), food: lastOf('food', base.food), exposure: lastOf('exposure', base.exposure) }
      : screen === 'log'
        ? { air: game.state.air, food: game.state.food, exposure: game.state.exposure }
        : { air: base.air, food: base.food, exposure: base.exposure };
  const current = screen === 'night' && nightPhase === 'math' ? visible.at(-1) : undefined;
  const mood: Mood = [meterWord(airSols(hud.air)), meterWord(foodSols(hud.food))].includes('critical') || exposureWord(hud.exposure) === 'high' ? 'worried' : 'happy';
  const isNight = screen !== 'morning';
  const evCard = ev?.cardId;

  const riskWords = t('forecast.riskWords', { returnObjects: true }) as string[];
  const options = t(`question.${game.morning.question}Options`, { returnObjects: true }) as string[];

  return (
    <div className="scene">
      <Hud sol={base.sol} first={base.missionId === 'm1'} air={hud.air} food={hud.food} exposure={hud.exposure} cellsLeft={screen === 'morning' ? left : 0} dust={cond.dust} />

      <div className="stage">
        <div className="views" role="tablist" aria-label={t('scene.views.label')}>
          {(['inside', 'outside'] as const).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} className="views__tab" onClick={() => setView(v)}>
              {t(`scene.views.${v}`)}
            </button>
          ))}
          <button type="button" role="tab" aria-selected={false} className="views__tab" disabled>
            {t('scene.views.sky')} · {t('scene.views.soon')}
          </button>
        </div>
        <div className={`stage__view${isNight ? ' stage__view--night' : ''}`}>
          {view === 'inside' ? (
            <InsideView
              state={base}
              cells={allocation}
              free={free}
              open={open}
              onAdd={add}
              onRemove={remove}
              mood={mood}
              night={isNight}
              active={current ? STEP_OBJECT[current.id] : null}
              airShown={hud.air}
              disabled={screen !== 'morning' || step !== 'plan'}
            />
          ) : (
            <OutsideView night={isNight} dust={cond.dust} shieldCells={allocation.shield} />
          )}
          {floater && screen === 'morning' && (
            <span key={floater.key} className="floater" aria-live="polite" onAnimationEnd={() => setFloater(null)}>
              {floater.text}
            </span>
          )}
        </div>
      </div>

      <section className="sheet" aria-live="polite">
        {screen === 'morning' && step === 'forecast' && (
          <>
            <h2>{t('forecast.title')}</h2>
            {ev ? (
              <p>
                {t('forecast.event', { kind: t(`forecast.kinds.${ev.kind}`), label: ev.classLabel, date: longDate(ev.date, i18n.language) })} <Badge cardId={ev.cardId} />{' '}
                {t('forecast.risk', { word: riskWords[ev.risk] })} <Badge cardId="riskTable" />
              </p>
            ) : (
              <p>{t('forecast.calm')}</p>
            )}
            <p className="muted">
              <strong>{t('forecast.tomorrow')}</strong>{' '}
              {(() => {
                const tm = catalogEvent(tomorrowForecast(def, base.sol)?.event?.id);
                return tm ? t('forecast.tomorrowEvent', { kind: t(`forecast.kinds.${tm.kind}`), label: tm.classLabel }) : t('forecast.tomorrowCalm');
              })()}
            </p>
            <button type="button" className="btn btn--primary" onClick={() => setStep('question')}>
              {t('scene.next')}
            </button>
          </>
        )}

        {screen === 'morning' && step === 'question' && (
          <>
            <h2>{t('question.title')}</h2>
            <p>{t(`question.${game.morning.question}`)}</p>
            <div className="choices choices--row">
              {options.map((o, i) => (
                <button
                  key={o}
                  type="button"
                  className="btn btn--choice"
                  onClick={() => {
                    onAnswer(i);
                    setStep('plan');
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {screen === 'morning' && step === 'plan' && (
          <>
            <p>
              <strong>{left > 0 ? t('scene.cellsLeft', { count: left }) : t('alloc.allPlaced')}</strong> {left > 0 && <span className="muted">{t('scene.tapHint')}</span>}
            </p>
            <p className="tonight">
              {t('scene.tonight', { air0: base.air, air1: preview.state.air, food0: base.food, food1: preview.state.food })}
            </p>
            <button type="button" className="btn btn--primary" disabled={errors.length > 0} onClick={() => onLock(a)}>
              {t('alloc.lockPlan')}
            </button>
          </>
        )}

        {screen === 'night' && night && nightPhase === 'pick' && (
          <>
            <h2>{t('night.pickTitle')}</h2>
            <div className="choices">
              {night.pick.options.map((o, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn btn--choice"
                  onClick={() => {
                    onPick(i);
                    setShown(0);
                    setNightPhase('math');
                  }}
                >
                  {t('night.option', { air: o.air, food: o.food, exposure: t(`meters.exposureWords.${exposureWord(o.exposure)}`) })}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setShown(0);
                setNightPhase('math');
              }}
            >
              {t('night.skip')}
            </button>
          </>
        )}

        {screen === 'night' && night && nightPhase === 'math' && (
          <>
            {night.pick.picked !== null && shown >= steps.length && (
              <p className="result-flag">{night.pick.picked === night.pick.correctIndex ? `✔ ${t('night.right')}` : t('night.wrong')}</p>
            )}
            <p className="caption">
              {current ? stepText(t, current) : '…'} {current && (() => {
                const c = stepCardId(current, evCard);
                return c ? <Badge cardId={c} /> : null;
              })()}
            </p>
            {shown >= steps.length && (
              <div className="actions actions--row">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setShown(0);
                    setRun((r) => r + 1);
                  }}
                >
                  {t('night.replay')}
                </button>
                <button type="button" className="btn btn--primary" onClick={onEndNight}>
                  {t('night.toLog')}
                </button>
              </div>
            )}
          </>
        )}

        {screen === 'log' && night && (
          <>
            <h2>{t('log.title', { n: night.before.sol })}</h2>
            {game.morning.answer !== null && (
              <p>
                {game.morning.answer === QUESTION_ANSWER[game.morning.question] ? `✔ ${t('log.guessRight')}` : t('log.theAnswer', { answer: options[QUESTION_ANSWER[game.morning.question]] })}
              </p>
            )}
            {(() => {
              const w = whatIf(def, night.before, night.allocation);
              if (!w) return null;
              const keys = ['lifeSupport', 'greenhouse', 'shield'] as const;
              const from = keys.find((k) => w.allocation[k] < night.allocation[k]);
              const to = keys.find((k) => w.allocation[k] > night.allocation[k]);
              if (!from || !to) return null;
              return (
                <p className="muted">
                  {t('log.whatIf', {
                    from: t(`alloc.destinations.${from}.name`),
                    to: t(`alloc.destinations.${to}.name`),
                    air: w.outcome.air,
                    food: w.outcome.food,
                    exposure: t(`meters.exposureWords.${exposureWord(w.outcome.exposure)}`),
                  })}
                </p>
              );
            })()}
            <button type="button" className="btn btn--primary" onClick={onNext}>
              {game.state.status === 'playing' ? t('log.next') : t('log.finish')}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
