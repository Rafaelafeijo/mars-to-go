/**
 * The 3D world prototype (ADR-0032). Panels float over the scene; everything done by
 * walking can also be done on the panels, by keyboard and screen reader. If WebGL is
 * not available, the scene becomes a still illustration and the panels keep working.
 * Numbers come from packages/sim (projection, rules); no emoji, only our own icons.
 */
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  V,
  cellsUsed,
  conditionsFor,
  freeCells,
  openDestinations,
  project,
  tomorrowForecast,
  unlockSol,
  validateAllocation,
  type Allocation,
  type Destination,
} from '@mars-to-go/sim';
import { catalogEvent } from '@mars-to-go/content';
import { prefersReducedMotion } from '../lib/format';
import type { Game } from '../game/useGame';
import { Icon, type IconName } from './Icon';
import type { Pulse } from './Scene3D';

const Scene3D = lazy(() => import('./Scene3D'));

const EMPTY: Allocation = { lifeSupport: 0, greenhouse: 0, shield: 0, expedition: 0, askEarth: 0 };
const DESTS: Destination[] = ['lifeSupport', 'greenhouse', 'shield', 'expedition', 'askEarth'];
const ICON: Record<Destination, IconName> = { lifeSupport: 'airMachine', greenhouse: 'greenhouse', shield: 'shield', expedition: 'rover', askEarth: 'antenna' };
const TONE: Record<Destination, string> = { lifeSupport: 'air', greenhouse: 'food', shield: 'rad', expedition: 'energy', askEarth: 'energy' };
const cost = (d: Destination) => (d === 'expedition' ? V.EXPEDITION_CELLS : d === 'askEarth' ? V.ASK_EARTH_CELLS : 1);

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

interface Props {
  game: Game;
  onLock: (a: Allocation) => void;
  onNightDone: () => void;
}

export function WorldScreen({ game, onLock, onNightDone }: Props) {
  const { t } = useTranslation();
  const { def, screen } = game;
  const night = screen === 'night' ? game.night : null;
  const base = night ? night.before : game.state;
  const cond = conditionsFor(def, base.sol);
  const free = freeCells(cond.dust);
  const open = openDestinations(base.mode, base.sol);
  const [a, setA] = useState<Allocation>(EMPTY);
  const plan = night ? night.allocation : a;
  const left = free - cellsUsed(plan);
  const projection = useMemo(() => project(def, base, plan), [def, base, plan]);
  const ready = validateAllocation(base, a, cond.dust).length === 0;
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [near, setNear] = useState<Destination | null>(null);
  const [webgl] = useState(hasWebGL);
  const [missionOpen, setMissionOpen] = useState(() => window.matchMedia?.('(min-width: 900px)').matches ?? true);
  // ?fps=1 shows the measured frame rate, to check the 3D on a real phone.
  const [showFps] = useState(() => new URLSearchParams(window.location.search).get('fps') === '1');
  const [fps, setFps] = useState<number | null>(null);
  useEffect(() => {
    if (!showFps) return;
    const id = window.setInterval(() => setFps((globalThis as unknown as { __marsFps?: number }).__marsFps ?? null), 1000);
    return () => window.clearInterval(id);
  }, [showFps]);

  // Night: the sky darkens, then the next sol starts.
  const done = useRef(onNightDone);
  useEffect(() => {
    done.current = onNightDone;
  }, [onNightDone]);
  const isNight = night !== null;
  useEffect(() => {
    if (!isNight) return;
    const id = window.setTimeout(() => done.current(), prefersReducedMotion() ? 50 : 1600);
    return () => window.clearTimeout(id);
  }, [isNight]);

  const effect = (d: Destination): string => {
    const n = plan[d];
    if (n === 0) return '';
    if (d === 'lifeSupport') return t('one.tiles.effect.lifeSupport', { n: n * V.AIR_PER_LIFE_SUPPORT_CELL });
    if (d === 'greenhouse') {
      const sol = base.sol + V.GREENHOUSE_DELAY_SOLS;
      return sol > V.MISSION_SOLS ? t('one.tiles.effect.greenhouseLate') : t('one.tiles.effect.greenhouse', { n: n * V.FOOD_PER_GREENHOUSE_CELL, sol });
    }
    if (d === 'shield') return t('one.tiles.effect.shield', { n: n * V.SHIELD_BLOCK_PER_CELL });
    if (d === 'expedition') return t('one.tiles.effect.expedition', { n: V.EXPEDITION_AIR });
    return t('one.tiles.effect.askEarth');
  };

  const add = (d: Destination) => {
    if (night || !open.includes(d) || left < cost(d)) return;
    if ((d === 'expedition' || d === 'askEarth') && a[d] === 1) return;
    setA((p) => ({ ...p, [d]: d === 'expedition' || d === 'askEarth' ? 1 : p[d] + 1 }));
    const text =
      d === 'lifeSupport'
        ? t('world.float.lifeSupport', { n: V.AIR_PER_LIFE_SUPPORT_CELL })
        : d === 'greenhouse'
          ? t('world.float.greenhouse', { n: V.FOOD_PER_GREENHOUSE_CELL, sol: base.sol + V.GREENHOUSE_DELAY_SOLS })
          : d === 'shield'
            ? t('world.float.shield', { n: V.SHIELD_BLOCK_PER_CELL })
            : d === 'expedition'
              ? t('world.float.expedition', { n: V.EXPEDITION_AIR })
              : t('world.float.askEarth');
    setPulse({ d, text, key: Date.now() });
  };
  const remove = (d: Destination) => setA((p) => ({ ...p, [d]: d === 'expedition' || d === 'askEarth' ? 0 : Math.max(0, p[d] - 1) }));

  const labels = Object.fromEntries(DESTS.map((d) => [d, t(`world.machines.${d}`)])) as Record<Destination, string>;
  const ev = catalogEvent(cond.event?.id);
  const tm = catalogEvent(tomorrowForecast(def, base.sol)?.event?.id);
  const airOk = projection.airEndsOnSol === null;
  const foodOk = projection.foodEndsOnSol === null;
  const sols = Array.from({ length: V.MISSION_SOLS }, (_, i) => i + 1);
  const reach = (ends: number | null) => (ends === null ? V.MISSION_SOLS + 1 : ends) - base.sol + 1;
  const span = V.MISSION_SOLS - base.sol + 2;

  return (
    <div className={`world${night ? ' world--night' : ''}`}>
      <div className="world__stage">
        {webgl ? (
          <Suspense fallback={<div className="world__still" aria-hidden="true" />}>
            <Scene3D cells={plan} open={open} labels={labels} night={night !== null} pulse={pulse} onUse={add} onNear={setNear} label={t('world.sceneLabel')} />
          </Suspense>
        ) : (
          <div className="world__still" role="img" aria-label={t('world.fallback')}>
            <p>{t('world.fallback')}</p>
          </div>
        )}
      </div>

      {/* Top: trail of 7 sols to the rocket, with air and food bars from the projection */}
      <section className="hud-trail panel" aria-label={t('world.trail.label')}>
        <ol className="hud-trail__sols">
          {sols.map((s) => {
            const c = conditionsFor(def, s);
            const icon: IconName = c.dust ? 'dust' : c.event ? 'storm' : 'sun';
            return (
              <li key={s} className={`hud-trail__sol${s === base.sol ? ' is-today' : ''}${s < base.sol ? ' is-past' : ''}`}>
                <span className="hud-trail__n">{s}</span>
                <Icon name={icon} size={14} className={c.event ? 'tone-rad' : c.dust ? 'tone-energy' : 'tone-sun'} />
                {s === base.sol && <span className="sr-only">{t('world.trail.today')}</span>}
              </li>
            );
          })}
          <li className="hud-trail__sol hud-trail__rocket">
            <Icon name="rocket" size={18} title={t('world.trail.rocket')} />
          </li>
        </ol>
        <div className="hud-trail__bars">
          <div className={`bar tone-air${airOk ? '' : ' bar--bad'}`} role="img" aria-label={airOk ? t('world.trail.airOk') : t('world.trail.airBad', { n: projection.airEndsOnSol })}>
            <Icon name="air" size={14} />
            <span className="bar__track">
              <span className="bar__fill" style={{ width: `${(Math.min(reach(projection.airEndsOnSol), span) / span) * 100}%` }} />
            </span>
            <span className="bar__text">{airOk ? t('world.trail.airOk') : t('world.trail.airBad', { n: projection.airEndsOnSol })}</span>
          </div>
          <div className={`bar tone-food${foodOk ? '' : ' bar--bad'}`} role="img" aria-label={foodOk ? t('world.trail.foodOk') : t('world.trail.foodBad', { n: projection.foodEndsOnSol })}>
            <Icon name="food" size={14} />
            <span className="bar__track">
              <span className="bar__fill" style={{ width: `${(Math.min(reach(projection.foodEndsOnSol), span) / span) * 100}%` }} />
            </span>
            <span className="bar__text">{foodOk ? t('world.trail.foodOk') : t('world.trail.foodBad', { n: projection.foodEndsOnSol })}</span>
          </div>
        </div>
      </section>

      {/* Left: Mission Control */}
      <section className={`hud-mission panel${missionOpen ? '' : ' is-closed'}`} aria-labelledby="mc-title">
        <button type="button" className="hud-mission__head" aria-expanded={missionOpen} onClick={() => setMissionOpen((o) => !o)}>
          <Icon name="flag" size={16} />
          <span id="mc-title">{t('world.mission.title')}</span>
        </button>
        {missionOpen && (
          <>
            <p className="hud-mission__challenge">{t('world.mission.challenge')}</p>
            <ul className="hud-mission__list">
              {[
                { ok: left === 0, text: t('world.mission.placeAll', { free, used: free - left }) },
                { ok: airOk, text: t('world.mission.airHome') },
                { ok: foodOk, text: t('world.mission.foodHome') },
              ].map((o) => (
                <li key={o.text} className={o.ok ? 'is-ok' : undefined}>
                  <Icon name={o.ok ? 'check' : 'cross'} size={14} />
                  <span>{o.text}</span>
                  <span className="sr-only">{o.ok ? t('world.mission.done') : t('world.mission.todo')}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Right top: forecast */}
      <section className="hud-sky panel" aria-labelledby="sky-title">
        <h2 id="sky-title">{t('world.forecast.title')}</h2>
        <p>
          <Icon name={cond.dust ? 'dust' : ev ? 'storm' : 'sun'} size={16} className={ev ? 'tone-rad' : 'tone-sun'} />{' '}
          {cond.dust ? t('world.forecast.dust', { n: free }) : ev ? t('world.forecast.event', { kind: t(`forecast.kinds.${ev.kind}`), label: ev.classLabel }) : t('world.forecast.calm')}
        </p>
        <p className="muted small">
          {t('world.forecast.tomorrow')} {tm ? t('world.forecast.tomorrowEvent', { kind: t(`forecast.kinds.${tm.kind}`), label: tm.classLabel }) : t('world.forecast.tomorrowCalm')}
        </p>
      </section>

      {/* Right bottom: cells in hand and pass the night */}
      <section className="hud-hand panel" aria-labelledby="hand-title">
        <h2 id="hand-title" className="sr-only">
          {t('world.hand.title')}
        </h2>
        <div className="hud-hand__cells tone-energy" aria-hidden="true">
          {Array.from({ length: V.CELLS_PER_SOL }, (_, i) => {
            const heating = i < V.HEATING_CELLS;
            const inHand = !heating && i - V.HEATING_CELLS < left;
            const dust = !heating && i - V.HEATING_CELLS >= free;
            return <span key={i} className={`hcell${heating ? ' hcell--heat' : inHand ? ' hcell--hand' : dust ? ' hcell--dust' : ''}`} />;
          })}
        </div>
        <p className="hud-hand__count">
          <Icon name="energy" size={16} className="tone-energy" /> {t('world.hand.count', { count: left })}
          <span className="muted small hud-hand__heat">
            {' '}
            · <Icon name="heat" size={12} /> {t('world.hand.heating', { n: V.HEATING_CELLS })}
          </span>
        </p>
        <button type="button" className="btn btn--primary" disabled={!ready || night !== null} onClick={() => onLock(a)}>
          <Icon name="moon" size={18} /> {ready ? t('world.hand.pass') : t('world.hand.placeFirst', { count: left })}
        </button>
      </section>

      {/* Bottom: place and machine bar (the accessible way to play) */}
      <section className="hud-bottom" aria-labelledby="bar-title">
        <p className="hud-bottom__place">
          {t('world.place', { n: base.sol, total: V.MISSION_SOLS })}
          <span className="hud-bottom__ill"> · {t('world.illustration')}</span>
        </p>
        <h2 id="bar-title" className="sr-only">
          {t('world.hotbar')}
        </h2>
        <ul className="hotbar">
          {DESTS.map((d) => {
            const isOpen = open.includes(d);
            const n = plan[d] * cost(d);
            const name = labels[d];
            return (
              <li key={d} className={`slot tone-${TONE[d]}${isOpen ? '' : ' is-locked'}${near === d ? ' is-near' : ''}`}>
                <button
                  type="button"
                  className="slot__add"
                  disabled={!isOpen || night !== null || left < cost(d) || ((d === 'expedition' || d === 'askEarth') && a[d] === 1)}
                  onClick={() => add(d)}
                  aria-label={isOpen ? `${t('world.add', { name })}. ${t('world.state', { name, count: n, effect: effect(d) })}` : t('world.locked', { name, n: unlockSol(d) })}
                >
                  <Icon name={isOpen ? ICON[d] : 'lock'} size={22} />
                  <span className="slot__name">{name}</span>
                  <span className="slot__count">{isOpen ? n : t('one.tiles.locked', { n: unlockSol(d) })}</span>
                </button>
                {isOpen && a[d] > 0 && !night && (
                  <button type="button" className="slot__minus" onClick={() => remove(d)} aria-label={t('world.remove', { name })}>
                    <Icon name="minus" size={14} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <p className="hud-bottom__hint muted small" aria-hidden="true">
          <Icon name="walk" size={12} /> {near ? effect(near) || labels[near] : t('world.walkHint')}
        </p>
      </section>

      {showFps && <div className="world__fps">{fps === null ? '… fps' : `${fps} fps`}</div>}

      {night && (
        <div className="world__night" role="status">
          <Icon name="moon" size={28} /> {t('world.night')}
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {airOk ? t('world.trail.airOk') : t('world.trail.airBad', { n: projection.airEndsOnSol })}.{' '}
        {foodOk ? t('world.trail.foodOk') : t('world.trail.foodBad', { n: projection.foodEndsOnSol })}.
      </div>
    </div>
  );
}

