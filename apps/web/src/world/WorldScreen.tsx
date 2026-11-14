/**
 * The 3D world (ADR-0032), after the first playtest. Panels float over the scene;
 * everything done by walking can also be done on the panels (keyboard, screen reader).
 * Each sol: forecast banner → plan → night in 3D → visual sol report with a real NASA fact.
 * Numbers come from packages/sim; facts and photos from packages/content (verified sources).
 */
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  V,
  airSols,
  cellsUsed,
  conditionsFor,
  exposureWord,
  freeCells,
  openDestinations,
  project,
  tomorrowForecast,
  unlockSol,
  validateAllocation,
  type Allocation,
  type Destination,
  type NightStep,
} from '@mars-to-go/sim';
import { SOL_FACTS, catalogEvent, type Locale } from '@mars-to-go/content';
import { photoSrcSet } from '../cards/Photo';
import { longDate, prefersReducedMotion } from '../lib/format';
import type { Game } from '../game/useGame';
import { Icon, type IconName } from './Icon';
import type { Pulse, SkyEvent } from './Scene3D';

const Scene3D = lazy(() => import('./Scene3D'));

const EMPTY: Allocation = { lifeSupport: 0, greenhouse: 0, shield: 0, expedition: 0, askEarth: 0 };
const DESTS: Destination[] = ['lifeSupport', 'greenhouse', 'shield', 'expedition', 'askEarth'];
const ICON: Record<Destination, IconName> = { lifeSupport: 'airMachine', greenhouse: 'greenhouse', shield: 'shield', expedition: 'rover', askEarth: 'antenna' };
const TONE: Record<Destination, string> = { lifeSupport: 'air', greenhouse: 'food', shield: 'rad', expedition: 'energy', askEarth: 'energy' };
const FULL_TANK = 20;
const NIGHT_MS = 3600;
const cost = (d: Destination) => (d === 'expedition' ? V.EXPEDITION_CELLS : d === 'askEarth' ? V.ASK_EARTH_CELLS : 1);

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

const sumSteps = (steps: NightStep[], ids: NightStep['id'][]) => steps.filter((s) => ids.includes(s.id)).reduce((t, s) => t + s.delta, 0);

interface Props {
  game: Game;
  onLock: (a: Allocation) => void;
  onNightDone: () => void;
  onRestart: () => void;
  onHome: () => void;
  onNasaData: () => void;
}

export function WorldScreen({ game, onLock, onNightDone, onRestart, onHome, onNasaData }: Props) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'pt-BR' ? 'pt-BR' : 'en') as Locale;
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
  const [banner, setBanner] = useState(true);
  const [menu, setMenu] = useState(false);
  const [showFps] = useState(() => new URLSearchParams(window.location.search).get('fps') === '1');
  const [fps, setFps] = useState<number | null>(null);
  useEffect(() => {
    if (!showFps) return;
    const id = window.setInterval(() => setFps((globalThis as unknown as { __marsFps?: number }).__marsFps ?? null), 1000);
    return () => window.clearInterval(id);
  }, [showFps]);

  // Night in 3D, then the sol report (the child reads what happened before moving on).
  const isNight = night !== null;
  const [report, setReport] = useState(false);
  useEffect(() => {
    if (!isNight) return;
    const id = window.setTimeout(() => setReport(true), prefersReducedMotion() ? 50 : NIGHT_MS);
    return () => window.clearTimeout(id);
  }, [isNight]);

  const ev = catalogEvent(cond.event?.id);
  const tm = catalogEvent(tomorrowForecast(def, base.sol)?.event?.id);
  const skyEvent: SkyEvent | null = ev ? { risk: ev.risk, strikes: ev.reachesMars === true } : null;
  const tomorrow = projection.tomorrow;
  const airCritical = airSols(tomorrow.air) <= 0 || (projection.airEndsOnSol !== null && projection.airEndsOnSol <= base.sol + 1);
  const airOk = projection.airEndsOnSol === null;
  const foodOk = projection.foodEndsOnSol === null;
  const growing = base.pendingHarvests.map((h) => ({ ...h, daysLeft: h.sol - base.sol }));
  if (!night && a.greenhouse > 0) growing.push({ sol: base.sol + V.GREENHOUSE_DELAY_SOLS, food: a.greenhouse * V.FOOD_PER_GREENHOUSE_CELL, daysLeft: V.GREENHOUSE_DELAY_SOLS });
  const fact = SOL_FACTS.find((f) => f.sol === base.sol);

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
  const sols = Array.from({ length: V.MISSION_SOLS }, (_, i) => i + 1);
  const reach = (ends: number | null) => (ends === null ? V.MISSION_SOLS + 1 : ends) - base.sol + 1;
  const span = V.MISSION_SOLS - base.sol + 2;
  const eventText = ev ? t('world.forecast.event', { kind: t(`forecast.kinds.${ev.kind}`), label: ev.classLabel }) : '';

  // Sol report numbers, straight from the simulation steps of tonight.
  const steps = night?.result.steps ?? [];
  const made = sumSteps(steps, ['lifeSupport']);
  const breathed = -sumSteps(steps, ['breathe']);
  const suits = -sumSteps(steps, ['expedition', 'expeditionRecalled']);
  const harvested = sumSteps(steps, ['harvest']);
  const eaten = -sumSteps(steps, ['eat']);
  const radiation = steps.find((s) => s.id === 'radiation');
  const discovery = steps.find((s) => s.id === 'outside')?.detail?.site;
  const after = night?.result.state;

  return (
    <div className={`world${night ? ' world--night' : ''}`}>
      <div className="world__stage">
        {webgl ? (
          <Suspense fallback={<div className="world__still" aria-hidden="true" />}>
            <Scene3D
              cells={plan}
              open={open}
              labels={labels}
              night={isNight}
              pulse={pulse}
              onUse={add}
              onNear={setNear}
              label={t('world.sceneLabel')}
              airLevel={Math.max(0, tomorrow.air) / FULL_TANK}
              airCritical={airCritical}
              airLabel={airCritical ? t('world.tank.critical', { n: tomorrow.air }) : t('world.tank.label', { n: tomorrow.air })}
              growing={growing}
              event={skyEvent}
            />
          </Suspense>
        ) : (
          <div className="world__still" role="img" aria-label={t('world.fallback')}>
            <p>{t('world.fallback')}</p>
          </div>
        )}
      </div>

      {/* Top: trail of 7 sols to the rocket, with air and food bars from the projection */}
      <section className="hud-trail wpanel" aria-label={t('world.trail.label')}>
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
          <div className={`bar tone-air${airOk ? '' : ' bar--bad'}${airCritical ? ' bar--critical' : ''}`} role="img" aria-label={airOk ? t('world.trail.airOk') : t('world.trail.airBad', { n: projection.airEndsOnSol })}>
            <Icon name="air" size={14} />
            <span className="bar__track">
              <span className="bar__fill" style={{ width: `${(Math.min(reach(projection.airEndsOnSol), span) / span) * 100}%` }} />
            </span>
            <span className="bar__text">{airCritical ? t('world.trail.airCritical') : airOk ? t('world.trail.airOk') : t('world.trail.airBad', { n: projection.airEndsOnSol })}</span>
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

      <button type="button" className="world__menu-btn" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
        {t('menu.label')}
      </button>
      {menu && (
        <nav className="world__menu wpanel" aria-label={t('menu.label')}>
          <button type="button" onClick={() => { setMenu(false); onNasaData(); }}>
            <Icon name="radiation" size={16} className="tone-rad" /> {t('menu.nasa')}
          </button>
          <button type="button" onClick={() => { setMenu(false); onRestart(); }}>
            <Icon name="flag" size={16} /> {t('menu.restart')}
          </button>
          <button type="button" onClick={() => { setMenu(false); onHome(); }}>
            <Icon name="rocket" size={16} /> {t('menu.home')}
          </button>
        </nav>
      )}

      {/* Left: Mission Control */}
      <section className={`hud-mission wpanel${missionOpen ? '' : ' is-closed'}`} aria-labelledby="mc-title">
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

      {/* Right top: sky and the Mars thermometer */}
      <section className={`hud-sky wpanel${ev ? ' hud-sky--event' : ''}`} aria-labelledby="sky-title">
        <h2 id="sky-title">{t('world.forecast.title')}</h2>
        <p>
          <Icon name={cond.dust ? 'dust' : ev ? 'storm' : 'sun'} size={16} className={ev ? 'tone-rad' : 'tone-sun'} /> {cond.dust ? t('world.forecast.dust', { n: free }) : ev ? eventText : t('world.forecast.calm')}
        </p>
        <p className="thermo" aria-label={t('world.thermo.aria', { day: V.MARS_DAY_TEMP_MAX_C, night: V.MARS_DAY_TEMP_MIN_C })}>
          <Icon name="heat" size={14} className="tone-air" />
          <span className="thermo__bar" aria-hidden="true">
            <span className={`thermo__fill${isNight ? ' is-night' : ''}`} />
          </span>
          <strong>{isNight ? V.MARS_DAY_TEMP_MIN_C : V.MARS_DAY_TEMP_MAX_C} °C</strong>
        </p>
        <p className="muted small">{t('world.thermo.source')}</p>
      </section>

      {/* Right bottom: cells in hand and pass the night */}
      <section className="hud-hand wpanel" aria-labelledby="hand-title">
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
          {t('world.missionPlace', { n: base.sol, total: V.MISSION_SOLS })}
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
          <Icon name="walk" size={12} /> {near ? `${labels[near]}: ${t(`world.does.${near}`)}` : t('world.walkHint')}
        </p>
      </section>

      {/* Start of the sol: the forecast, big, so it is not missed */}
      {banner && !night && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="banner-title">
          <div className={`banner${ev ? ' banner--event' : ''}`}>
            <p className="banner__eyebrow">{t('world.missionPlace', { n: base.sol, total: V.MISSION_SOLS })}</p>
            <h2 id="banner-title">
              <Icon name={ev ? 'storm' : cond.dust ? 'dust' : 'sun'} size={28} className={ev ? 'tone-rad' : 'tone-sun'} /> {ev ? t('world.banner.event') : t('world.banner.calm')}
            </h2>
            {ev && (
              <p>
                {eventText} {t('world.banner.record', { id: ev.id, date: longDate(ev.date, i18n.language) })}
              </p>
            )}
            {ev && <p className="banner__hint">{t('world.banner.shieldHint')}</p>}
            {!ev && tm && <p>{t('world.banner.tomorrow', { what: t('world.forecast.tomorrowEvent', { kind: t(`forecast.kinds.${tm.kind}`), label: tm.classLabel }) })}</p>}
            <button type="button" className="btn btn--primary" onClick={() => setBanner(false)}>
              {t('world.banner.go')}
            </button>
          </div>
        </div>
      )}

      {night && !report && (
        <div className="world__night" role="status">
          <Icon name="moon" size={28} /> {t('world.night')}
          {skyEvent && <span className="world__night-ev">{skyEvent.strikes ? t('world.nightStrike') : t('world.nightMiss')}</span>}
          {plan.expedition > 0 && <span className="world__night-ev">{t('world.nightRover')}</span>}
        </div>
      )}

      {/* After the night: what happened, then one real NASA fact with its photo */}
      {night && report && after && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="report-title">
          <div className="report">
            <h2 id="report-title">{t('world.report.title', { n: base.sol })}</h2>
            <ul className="report__rows">
              <li className="tone-air">
                <Icon name="air" size={18} />
                <span className="report__what">
                  {t('world.report.air', { made, breathed })}
                  {suits > 0 ? ` · ${t('world.report.suits', { suits })}` : ''}
                </span>
                <strong>
                  {base.air} → {after.air}
                </strong>
              </li>
              <li className="tone-food">
                <Icon name="food" size={18} />
                <span className="report__what">{t('world.report.food', { harvested, eaten })}</span>
                <strong>
                  {base.food} → {after.food}
                </strong>
              </li>
              <li className="tone-rad">
                <Icon name="shield" size={18} />
                <span className="report__what">
                  {!radiation?.detail?.eventId
                    ? t('world.report.noEvent')
                    : radiation.detail.reachesMars === true
                      ? t('world.report.hit', { risk: radiation.detail.risk, shield: radiation.detail.shield, delta: radiation.delta })
                      : t('world.report.miss')}
                </span>
                <strong>{t(`meters.exposureWords.${exposureWord(after.exposure)}`)}</strong>
              </li>
              {typeof discovery === 'string' && (
                <li className="tone-energy">
                  <Icon name="rover" size={18} />
                  <span className="report__what">{t('world.report.discovery', { site: t(`world.sites.${discovery}`) })}</span>
                </li>
              )}
            </ul>
            {fact && (
              <figure className="report__fact">
                <img src={`${import.meta.env.BASE_URL}images/${fact.photo.slug}-960.webp`} srcSet={photoSrcSet(fact.photo.slug)} sizes="(max-width: 640px) 100vw, 520px" alt={fact.photo.caption?.[locale] ?? fact.text[locale].title} />
                <figcaption>
                  <span className="report__badge">{t('world.report.realNasa')}</span>
                  <strong>{fact.text[locale].title}</strong> {fact.text[locale].body}{' '}
                  <a href={fact.sourceUrl} target="_blank" rel="noreferrer">
                    {fact.sourceName}
                  </a>
                  <span className="report__credit">
                    {t('card.realPhoto')}
                    {fact.photo.enhancedColor ? ` · ${t('card.enhanced')}` : ''} · {fact.photo.credit} · {fact.photo.mission} · {locale === 'pt-BR' ? fact.photo.placePt : fact.photo.placeEn}
                    {fact.photo.caption ? ` · ${fact.photo.caption[locale]}` : ''}
                  </span>
                </figcaption>
              </figure>
            )}
            <button type="button" className="btn btn--primary" onClick={onNightDone}>
              {after.status === 'playing' ? t('one.next') : t('one.finish')}
            </button>
          </div>
        </div>
      )}

      {showFps && <div className="world__fps">{fps === null ? '… fps' : `${fps} fps`}</div>}

      <div className="sr-only" aria-live="polite">
        {airOk ? t('world.trail.airOk') : t('world.trail.airBad', { n: projection.airEndsOnSol })}.{' '}
        {foodOk ? t('world.trail.foodOk') : t('world.trail.foodBad', { n: projection.foodEndsOnSol })}.
      </div>
    </div>
  );
}
