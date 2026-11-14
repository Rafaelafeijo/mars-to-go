/**
 * Phase 3B step B (ADR-0031): the whole sol on one screen, no scrolling.
 * Trail and meters on top; battery and destinations as touchable tiles; every
 * cell placed moves the trail lines and the "today → tomorrow" meters at once.
 * The night is the same screen: meters animate in simulation order. No badges.
 * Simple shapes only; art comes in step E.
 */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  V,
  airSols,
  cellsUsed,
  conditionsFor,
  exposureWord,
  foodSols,
  freeCells,
  meterWord,
  openDestinations,
  project,
  unlockSol,
  validateAllocation,
  type Allocation,
  type Destination,
  type NightStep,
} from '@mars-to-go/sim';
import { prefersReducedMotion } from '../lib/format';
import type { Game } from '../game/useGame';
import { Trail } from './Trail';

const EMPTY: Allocation = { lifeSupport: 0, greenhouse: 0, shield: 0, expedition: 0, askEarth: 0 };
const DESTS: Destination[] = ['lifeSupport', 'greenhouse', 'shield', 'expedition', 'askEarth'];
const ICON: Record<Destination, string> = { lifeSupport: '💨', greenhouse: '🌱', shield: '🛡', expedition: '🚙', askEarth: '📡' };
const STEP_MS = 900;
const STEP_MS_ASSISTED = 1800;

/** Which tile lights up during each night step. */
const STEP_TILE: Partial<Record<NightStep['id'], Destination>> = {
  lifeSupport: 'lifeSupport',
  harvest: 'greenhouse',
  plant: 'greenhouse',
  greenhouseRescue: 'greenhouse',
  harvestLost: 'greenhouse',
  expedition: 'expedition',
  expeditionRecalled: 'expedition',
  outside: 'expedition',
  radiation: 'shield',
  earthAnswer: 'askEarth',
};

interface Props {
  game: Game;
  onLock: (a: Allocation) => void;
  onNightDone: () => void;
}

const cost = (d: Destination) => (d === 'expedition' ? V.EXPEDITION_CELLS : d === 'askEarth' ? V.ASK_EARTH_CELLS : 1);

export function SolScreen({ game, onLock, onNightDone }: Props) {
  const { t } = useTranslation();
  const { def, screen } = game;
  const night = screen === 'night' ? game.night : null;
  const base = night ? night.before : game.state;
  const cond = conditionsFor(def, base.sol);
  const free = freeCells(cond.dust);
  const open = openDestinations(base.mode, base.sol);

  const [a, setA] = useState<Allocation>(EMPTY);
  const plan = night ? night.allocation : a;
  const used = cellsUsed(plan);
  const left = free - used;
  const projection = useMemo(() => project(def, base, plan), [def, base, plan]);
  const ready = validateAllocation(base, a, cond.dust).length === 0;

  // Night: reveal the simulation steps one by one (all at once with reduced motion).
  const steps = night?.result.steps ?? [];
  const [shownRaw, setShown] = useState(0);
  const [run, setRun] = useState(0);
  const reduced = prefersReducedMotion();
  const shown = night ? (reduced ? steps.length : shownRaw) : 0;
  useEffect(() => {
    if (!night || reduced) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= steps.length) window.clearInterval(id);
    }, game.assisted ? STEP_MS_ASSISTED : STEP_MS);
    return () => window.clearInterval(id);
  }, [night, reduced, steps.length, game.assisted, run]);
  const visible = steps.slice(0, shown);
  const lastOf = (r: NightStep['resource'], fallback: number) => [...visible].reverse().find((s) => s.resource === r)?.after ?? fallback;
  const current = visible.at(-1);
  const nightDone = night !== null && shown >= steps.length;

  const air = night ? lastOf('air', base.air) : base.air;
  const food = night ? lastOf('food', base.food) : base.food;
  const exposure = night ? lastOf('exposure', base.exposure) : base.exposure;
  const tomorrow = projection.tomorrow;
  const mood = projection.reachesHome ? 'happy' : 'worried';

  const add = (d: Destination) => {
    if (night || !open.includes(d) || left < cost(d)) return;
    if ((d === 'expedition' || d === 'askEarth') && a[d] === 1) return;
    setA((p) => ({ ...p, [d]: d === 'expedition' || d === 'askEarth' ? 1 : p[d] + 1 }));
  };
  const remove = (d: Destination) => setA((p) => ({ ...p, [d]: d === 'expedition' || d === 'askEarth' ? 0 : Math.max(0, p[d] - 1) }));

  const effect = (d: Destination): string => {
    const n = plan[d];
    if (n === 0) return t('one.tiles.tapToAdd');
    switch (d) {
      case 'lifeSupport':
        return t('one.tiles.effect.lifeSupport', { n: n * V.AIR_PER_LIFE_SUPPORT_CELL });
      case 'greenhouse': {
        const sol = base.sol + V.GREENHOUSE_DELAY_SOLS;
        return sol > V.MISSION_SOLS ? t('one.tiles.effect.greenhouseLate') : t('one.tiles.effect.greenhouse', { n: n * V.FOOD_PER_GREENHOUSE_CELL, sol });
      }
      case 'shield':
        return t('one.tiles.effect.shield', { n: n * V.SHIELD_BLOCK_PER_CELL });
      case 'expedition':
        return t('one.tiles.effect.expedition', { n: V.EXPEDITION_AIR });
      case 'askEarth':
        return t('one.tiles.effect.askEarth');
    }
  };

  const meter = (name: string, icon: string, today: number, next: number, sols: number) => {
    const word = meterWord(sols);
    return (
      <div className="m" role="img" aria-label={t('one.meters.todayTomorrowLabel', { name, today, tomorrow: next, word: t(`meters.words.${word}`) })}>
        <span className="m__name" aria-hidden="true">
          {icon} {name}
        </span>
        <span className="m__big" aria-hidden="true">
          {night ? today : t('one.meters.todayTomorrow', { today, tomorrow: next })}
        </span>
        <span className={`pill pill--${word}`} aria-hidden="true">
          {t(`meters.words.${word}`)}
        </span>
      </div>
    );
  };

  return (
    <div className={`one${night ? ' one--night' : ''}`}>
      <Trail def={def} state={base} plan={plan} projection={projection} />

      <div className="meters2">
        <div className="m" role="img" aria-label={`${t('one.meters.power')}: ${t('one.meters.cellsLeft', { count: night ? 0 : left })}`}>
          <span className="m__name" aria-hidden="true">
            ⚡ {t('one.meters.power')}
          </span>
          <span className="m__big" aria-hidden="true">
            {night ? 0 : left}
          </span>
          <span className="m__sub" aria-hidden="true">
            {t('one.meters.cellsLeft', { count: night ? 0 : left })}
          </span>
        </div>
        {meter(t('one.meters.air'), '💨', air, tomorrow.air, airSols(night ? air : tomorrow.air))}
        {meter(t('one.meters.food'), '🥬', food, tomorrow.food, foodSols(night ? food : tomorrow.food))}
        <div className="m" role="img" aria-label={`${t('one.meters.exposure')}: ${t(`meters.exposureWords.${exposureWord(exposure)}`)}`}>
          <span className="m__name" aria-hidden="true">
            ☢ {t('one.meters.exposure')}
          </span>
          <span className={`pill pill--exp-${exposureWord(exposure)}`} aria-hidden="true">
            {t(`meters.exposureWords.${exposureWord(exposure)}`)}
          </span>
        </div>
      </div>

      <div className="base">
        <div className="battery" role="img" aria-label={t('one.battery.label', { free: night ? 0 : left, heating: V.HEATING_CELLS })}>
          {Array.from({ length: V.CELLS_PER_SOL }, (_, i) => {
            const heating = i < V.HEATING_CELLS;
            const offByDust = !heating && i - V.HEATING_CELLS >= free;
            const inHand = !heating && !offByDust && i - V.HEATING_CELLS < (night ? 0 : left);
            return <span key={i} className={`bcell${heating ? ' bcell--heat' : inHand ? ' bcell--free' : offByDust ? ' bcell--dust' : ' bcell--used'}`} />;
          })}
          <span className="battery__heat" aria-hidden="true">
            🔥 {t('one.battery.heating')}
          </span>
        </div>

        <div className="tiles">
          {DESTS.map((d) => {
            const name = t(`one.tiles.${d}`);
            const isOpen = open.includes(d);
            const n = plan[d] * cost(d);
            const lit = current && STEP_TILE[current.id] === d;
            return (
              <div key={d} className={`tile${isOpen ? '' : ' tile--locked'}${lit ? ' tile--lit' : ''}`}>
                <button
                  type="button"
                  className="tile__main"
                  disabled={!isOpen || night !== null}
                  onClick={() => add(d)}
                  aria-label={isOpen ? t('one.tiles.aria', { name, count: n, effect: effect(d) }) : t('one.tiles.ariaLocked', { name, n: unlockSol(d) })}
                >
                  <span className="tile__icon" aria-hidden="true">
                    {isOpen ? ICON[d] : '🔒'}
                  </span>
                  <span className="tile__name">{name}</span>
                  <span className="tile__pips" aria-hidden="true">
                    {Array.from({ length: n }, (_, i) => (
                      <span key={i} className="pip" />
                    ))}
                  </span>
                  <span className="tile__effect">{isOpen ? effect(d) : t('one.tiles.locked', { n: unlockSol(d) })}</span>
                </button>
                {isOpen && !night && a[d] > 0 && (
                  <button type="button" className="tile__minus" onClick={() => remove(d)} aria-label={t('one.tiles.remove', { name })}>
                    −
                  </button>
                )}
              </div>
            );
          })}
          <div className={`crew crew--${mood}`} role="img" aria-label={t(`one.crew.${mood}`)}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`face face--${i}`} aria-hidden="true">
                {mood === 'happy' ? '🙂' : '😟'}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="actionbar">
        {!night && (
          <button type="button" className="btn btn--primary" disabled={!ready} onClick={() => onLock(a)}>
            {ready ? t('one.lock') : t('one.placeAll', { count: left })}
          </button>
        )}
        {night && !nightDone && (
          <p className="actionbar__night" aria-live="polite">
            🌙 {t('one.night')}
          </p>
        )}
        {night && nightDone && (
          <div className="panel-pop" role="dialog" aria-modal="false" aria-labelledby="after-title">
            <p id="after-title">
              <strong>{t('one.after', { n: base.sol })}</strong>{' '}
              {t('one.afterLine', { air0: base.air, air1: night.result.state.air, food0: base.food, food1: night.result.state.food })}
            </p>
            <div className="panel-pop__row">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setShown(0);
                  setRun((r) => r + 1);
                }}
              >
                {t('one.replay')}
              </button>
              <button type="button" className="btn btn--primary" onClick={onNightDone}>
                {night.result.state.status === 'playing' ? t('one.next') : t('one.finish')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
