/**
 * The 3D world (ADR-0032), after the first playtest. Panels float over the scene;
 * everything done by walking can also be done on the panels (keyboard, screen reader).
 * Each sol: forecast banner → plan → night in 3D → visual sol report with a real NASA fact.
 * Numbers come from packages/sim; facts and photos from packages/content (verified sources).
 */
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  V,
  airSols,
  cellsUsed,
  conditionsFor,
  crisisFor,
  foodSols,
  freeCells,
  openDestinations,
  project,
  tomorrowForecast,
  unlockSol,
  validateAllocation,
  type Allocation,
  type CrisisResolution,
  type Destination,
  type EarthAnswer,
  type NightStep,
} from '@mars-to-go/sim';
import { SOL_FACTS, SOL_FACTS_M2, catalogEvent, type Locale } from '@mars-to-go/content';
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

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** Where crisis cells can come from (the rover's cells are already outside: it can only be called back). */
type CrisisSource = 'lifeSupport' | 'greenhouse' | 'askEarth';
const CRISIS_SOURCES: CrisisSource[] = ['lifeSupport', 'greenhouse', 'askEarth'];
const NO_MOVES: Record<CrisisSource, number> = { lifeSupport: 0, greenhouse: 0, askEarth: 0 };
const sumSteps =(steps: NightStep[], ids: NightStep['id'][]) => steps.filter((s) => ids.includes(s.id)).reduce((t, s) => t + s.delta, 0);

interface Props {
  game: Game;
  onLock: (a: Allocation, crisis?: CrisisResolution) => void;
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
  const lost = base.lostCells ?? 0;
  const free = freeCells(cond.dust, lost);
  const open = openDestinations(base.mode, base.sol);
  const [a, setA] = useState<Allocation>(EMPTY);
  // At night, the plan as it ran (the crisis already moved its cells into the allocation).
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
  const [skyView, setSkyView] = useState(false);
  const [edge, setEdge] = useState(false);
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
  const missionName = t(`missionShort.${def.id}`, { defaultValue: t('missionShort.m1') });
  // Each mission has its own facts: no fact or photo repeats from one mission to the next.
  const fact = (def.id === 'm2' ? SOL_FACTS_M2 : SOL_FACTS).find((f) => f.sol === base.sol);

  // The 10-second crisis (SIM_MODEL §6, ADR-0034): a fast storm that reaches Mars. The child sees the
  // risk against the shield and chooses WHERE to take cells from (tap or drag into the Shield); each
  // source shows its cost. If the shield already blocks everything, the crisis only says so.
  const stormSol = !night && crisisFor(def, base.sol) === 'solarStorm';
  const [crisis, setCrisis] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(V.CRISIS_SECONDS);
  const [moves, setMoves] = useState<Record<CrisisSource, number>>(NO_MOVES);
  const [recall, setRecall] = useState(false);
  const [lastCrisis, setLastCrisis] = useState<{ moved: Record<CrisisSource, number>; recall: boolean; enough: boolean } | null>(null);
  const movedTotal = CRISIS_SOURCES.reduce((s, k) => s + moves[k], 0);
  const stormRisk = cond.event?.risk ?? 0;
  const shieldNow = a.shield + movedTotal;
  const need = Math.max(0, stormRisk - shieldNow);
  const enoughAtStart = a.shield >= stormRisk;
  const moveOne = (k: CrisisSource) => {
    if (a[k] - moves[k] <= 0 || need === 0) return;
    setMoves((m) => ({ ...m, [k]: m[k] + 1 }));
  };
  const finishCrisis = () => {
    const alloc: Allocation = {
      ...a,
      lifeSupport: a.lifeSupport - moves.lifeSupport,
      greenhouse: a.greenhouse - moves.greenhouse,
      askEarth: (a.askEarth - moves.askEarth) as 0 | 1,
      shield: a.shield + movedTotal,
    };
    setCrisis(false);
    setLastCrisis({ moved: moves, recall, enough: enoughAtStart });
    onLock(alloc, { kind: 'solarStorm', choice: recall ? 'recallExpedition' : 'keepPlan' });
  };
  const finishRef = useRef(finishCrisis);
  useEffect(() => {
    finishRef.current = finishCrisis;
  });
  useEffect(() => {
    if (!crisis || game.assisted) return;
    if (secondsLeft <= 0) {
      finishRef.current(); // time is up: what was moved so far stays
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [crisis, secondsLeft, game.assisted]);
  const passNight = () => {
    if (stormSol) {
      setSecondsLeft(V.CRISIS_SECONDS);
      setMoves(NO_MOVES);
      setRecall(false);
      setCrisis(true);
    } else {
      setLastCrisis(null);
      onLock(a);
    }
  };

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

  // Keyboard: E adds a cell to the machine the astronaut is next to.
  const addRef = useRef(add);
  useEffect(() => {
    addRef.current = add;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && near && !(e.target instanceof HTMLInputElement)) addRef.current(near);
    };
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, [near]);

  const labels = Object.fromEntries(DESTS.map((d) => [d, t(`world.machines.${d}`)])) as Record<Destination, string>;
  const sols = Array.from({ length: V.MISSION_SOLS }, (_, i) => i + 1);
  const reach = (ends: number | null) => (ends === null ? V.MISSION_SOLS + 1 : ends) - base.sol + 1;
  const span = V.MISSION_SOLS - base.sol + 2;
  // Sentence case; the CME label is already inside its kind ("cloud of particles (CME)").
  const evLabel = (e: { kind: string; classLabel: string }) => (e.kind === 'cme' ? '' : e.classLabel);
  const eventText = ev ? cap(t('world.forecast.event', { kind: t(`forecast.kinds.${ev.kind}`), label: evLabel(ev) }).replace(/\s+\./, '.')) : '';

  // Earth's answer: tonight (report) and the next morning (banner).
  // At night the answer is about "tomorrow"; the next morning the same answer is about "today".
  const earthText = (ans: EarthAnswer | undefined, when: 'tomorrow' | 'today' = 'tomorrow'): string | null => {
    if (!ans) return null;
    if (ans.aboutSol === null) return t('world.earth.last');
    const ns = when === 'today' ? 'world.earthToday' : 'world.earth';
    if (!ans.eventId) return t(`${ns}.calm`);
    if (ans.reachesMars === true) return t(`${ns}.yes`);
    if (ans.reachesMars === 'unknown') return t(`${ns}.unknown`);
    return t(`${ns}.no`);
  };
  const lastLog = base.log[base.log.length - 1];
  const morningEarth = lastLog && lastLog.sol === base.sol - 1 ? earthText(lastLog.earthAnswer, 'today') : null;
  const doseNow = night ? (night.result.state.exposure) : base.exposure;

  // Sol report numbers, straight from the simulation steps of tonight.
  const steps = night?.result.steps ?? [];
  const made = sumSteps(steps, ['lifeSupport']);
  const breathed = -sumSteps(steps, ['breathe']);
  const suits = -sumSteps(steps, ['expedition', 'expeditionRecalled']);
  const harvested = sumSteps(steps, ['harvest']);
  const eaten = -sumSteps(steps, ['eat']);
  const radiation = steps.find((s) => s.id === 'radiation');
  const discovery = steps.find((s) => s.id === 'outside')?.detail?.site;
  const damage = steps.find((s) => s.id === 'damage')?.detail?.cells;
  const tonightEarth = earthText(night?.result.earthAnswer);
  const after = night?.result.state;
  const shieldHeld = radiation?.detail?.reachesMars === true && radiation.delta === 0;
  const exposed = radiation?.detail?.reachesMars === true && radiation.delta > 0;

  return (
    <div className={`world${night ? ' world--night' : ''}${near && open.includes(near) && !night ? ' world--acting' : ''}`}>
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
              harvestLabel={(n, sol) => t('world.harvest', { n, sol })}
              event={skyEvent}
              skyView={skyView && !isNight}
              onEdge={setEdge}
              habitatLabel={t('world.habitat')}
              exposed={exposed}
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
              {/* A notch where each harvest lands: planting today shows up on the trail. */}
              {growing
                .filter((h) => h.sol <= V.MISSION_SOLS)
                .map((h, i) => (
                  <span key={`${h.sol}-${i}`} className="bar__mark" style={{ left: `${(Math.min(h.sol - base.sol + 1, span) / span) * 100}%` }} />
                ))}
            </span>
            <span className="bar__text">{foodOk ? t('world.trail.foodOk') : t('world.trail.foodBad', { n: projection.foodEndsOnSol })}</span>
          </div>
          {/* ADR-0033: the crew's radiation dose against the limit. */}
          <div className={`bar tone-rad${doseNow > V.DOSE_LIMIT ? ' bar--critical' : ''}`} role="img" aria-label={`${t('world.trail.dose')}: ${t('world.trail.doseText', { n: doseNow, max: V.DOSE_LIMIT })}`}>
            <Icon name="radiation" size={14} />
            <span className="dose">
              {Array.from({ length: V.DOSE_LIMIT + 1 }, (_, i) => (
                <span key={i} className={`dose__seg${i < doseNow ? ' is-on' : ''}${i === V.DOSE_LIMIT ? ' is-over' : ''}`} />
              ))}
            </span>
            <span className="bar__text">
              {t('world.trail.dose')} · {doseNow > V.DOSE_LIMIT ? t('world.trail.doseOver') : t('world.trail.doseText', { n: doseNow, max: V.DOSE_LIMIT })}
            </span>
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

      {webgl && !isNight && (
        <div className="world__zoom">
          <button type="button" aria-label={t('world.zoomIn')} onClick={() => globalThis.dispatchEvent(new CustomEvent('mars-zoom', { detail: 0.8 }))}>
            <Icon name="plus" size={18} />
          </button>
          <button type="button" aria-label={t('world.zoomOut')} onClick={() => globalThis.dispatchEvent(new CustomEvent('mars-zoom', { detail: 1.25 }))}>
            <Icon name="minus" size={18} />
          </button>
        </div>
      )}

      {!isNight && (
        <button type="button" className="world__sky-btn" aria-pressed={skyView} onClick={() => setSkyView((s) => !s)}>
          <Icon name={skyView ? 'flag' : 'sun'} size={16} className={skyView ? undefined : 'tone-sun'} /> {skyView ? t('world.sky.back') : t('world.sky.look')}
        </button>
      )}

      {/* Sky view: the camera looks up; real NASA facts about the Mars sky, with a real photo */}
      {skyView && !isNight && (
        <section className="hud-skycard wpanel" aria-labelledby="skycard-title">
          <span className="report__badge">{t('world.report.realNasa')}</span>
          <h2 id="skycard-title">{t('world.sky.title')}</h2>
          {/* No photo here: the Gale sunset photo already belongs to a sol fact (no repeats). */}
          <p>{t('world.sky.day')}</p>
          <p className="muted small">
            <a href="https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/" target="_blank" rel="noreferrer">
              {t('world.sky.source')}
            </a>
          </p>
        </section>
      )}

      {edge && !isNight && (
        <div className="world__edge" role="alert">
          <Icon name="cross" size={18} />
          <span>
            <strong>{t('world.edge.title')}</strong> {t('world.edge.text')}
          </span>
        </div>
      )}

      {/* Left: Mission Control */}
      <section className={`hud-mission wpanel${missionOpen ? '' : ' is-closed'}${skyView ? ' is-hidden' : ''}`} aria-labelledby="mc-title">
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
                def.sampleSite
                  ? {
                      // ADR-0035: this mission only counts the sample from one site (the delta front).
                      ok: base.discoveries.includes(def.sampleSite) || (plan.expedition === 1 && plan.expeditionSite === def.sampleSite),
                      text: t('world.mission.sampleDelta', { n: base.discoveries.includes(def.sampleSite) ? 1 : 0 }),
                    }
                  : {
                      ok: base.discoveries.length + (plan.expedition ? 1 : 0) >= V.SAMPLES_GOAL,
                      // Before the Rover opens, say when it opens instead of showing a failure.
                      locked: !open.includes('expedition'),
                      text: open.includes('expedition')
                        ? t('world.mission.sample', { n: base.discoveries.length, goal: V.SAMPLES_GOAL })
                        : t('world.mission.sampleLocked', { goal: V.SAMPLES_GOAL, n: unlockSol('expedition') }),
                    },
                { ok: doseNow <= V.DOSE_LIMIT, text: t('world.mission.dose', { n: doseNow, max: V.DOSE_LIMIT }) },
              ].map((o) => (
                <li key={o.text} className={o.ok ? 'is-ok' : 'locked' in o && o.locked ? 'is-locked' : undefined}>
                  <Icon name={o.ok ? 'check' : 'locked' in o && o.locked ? 'lock' : 'cross'} size={14} />
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
        <p className="muted small thermo__long">{t('world.thermo.source')}</p>
        <p className="muted small thermo__short">{t('world.thermo.short')}</p>
      </section>

      {/* Right bottom: cells in hand and pass the night */}
      <section className="hud-hand wpanel" aria-labelledby="hand-title">
        <h2 id="hand-title" className="sr-only">
          {t('world.hand.title')}
        </h2>
        <div className="hud-hand__cells tone-energy" aria-hidden="true">
          {Array.from({ length: V.CELLS_PER_SOL }, (_, i) => {
            const heating = i < V.HEATING_CELLS;
            const k = i - V.HEATING_CELLS;
            const inHand = !heating && k < left;
            const dustCut = freeCells(cond.dust);
            const broken = !heating && k >= free && k < dustCut; // lost to radiation damage
            const dust = !heating && k >= dustCut;
            return <span key={i} className={`hcell${heating ? ' hcell--heat' : inHand ? ' hcell--hand' : broken ? ' hcell--lost' : dust ? ' hcell--dust' : ''}`} />;
          })}
        </div>
        <p className="hud-hand__count">
          <Icon name="energy" size={16} className="tone-energy" /> {t('world.hand.count', { count: left })}
          <span className="muted small hud-hand__heat">
            {' '}
            · <Icon name="heat" size={12} /> {t('world.hand.heating', { n: V.HEATING_CELLS })}
          </span>
          {lost > 0 && <span className="hud-hand__lost"> · {t('world.hand.lost', { n: lost })}</span>}
        </p>
        {/* ADR-0035: the child chooses where the rover goes; the far site costs more. */}
        {a.expedition === 1 && !night && (
          <div className="site-pick" role="group" aria-label={t('world.sitePick')}>
            <p className="site-pick__title">
              <Icon name="rover" size={14} /> {t('world.sitePick')}
            </p>
            {(['rochette', 'delta-front'] as const).map((s) => (
              <button key={s} type="button" aria-pressed={(a.expeditionSite ?? 'rochette') === s} onClick={() => setA((p) => ({ ...p, expeditionSite: s }))}>
                <strong>{t(`world.siteChoice.${s}.name`)}</strong>
                <small>{t(`world.siteChoice.${s}.cost`)}</small>
              </button>
            ))}
          </div>
        )}
        {a.askEarth === 1 && !night && (
          <p className="hud-hand__sent" role="status">
            <Icon name="antenna" size={14} /> {t('world.antennaSent')}
          </p>
        )}
        <button type="button" className="btn btn--primary" disabled={!ready || night !== null} onClick={passNight}>
          <Icon name="moon" size={18} /> {ready ? t('world.hand.pass') : t('world.hand.placeFirst', { count: left })}
        </button>
      </section>

      {/* Bottom: place and machine bar (the accessible way to play) */}
      <section className="hud-bottom" aria-labelledby="bar-title">
        {/* Near a machine: a clear action button (tap or E), not only the bar below. */}
        {near && open.includes(near) && !night && (
          <div className={`act tone-${TONE[near]}`}>
            <span className="act__name">
              <Icon name={ICON[near]} size={18} /> {labels[near]}
            </span>
            {a[near] > 0 && (
              <button type="button" className="act__btn act__btn--minus" onClick={() => remove(near)} aria-label={`${t('world.act.remove')} · ${labels[near]}`}>
                <Icon name="minus" size={18} />
              </button>
            )}
            <button
              type="button"
              className="act__btn"
              disabled={left < cost(near) || ((near === 'expedition' || near === 'askEarth') && a[near] === 1)}
              onClick={() => add(near)}
              aria-label={`${t('world.act.add')} · ${labels[near]}`}
            >
              <Icon name="plus" size={18} /> {t('world.act.add')}
            </button>
          </div>
        )}
        <p className="hud-bottom__place">{t('world.place', { m: missionName, n: base.sol, total: V.MISSION_SOLS })}</p>
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
            <p className="banner__eyebrow">{t('world.missionPlace', { m: missionName, n: base.sol, total: V.MISSION_SOLS })}</p>
            <h2 id="banner-title">
              <Icon name={ev ? 'storm' : cond.dust ? 'dust' : 'sun'} size={28} className={ev ? 'tone-rad' : 'tone-sun'} /> {ev ? t('world.banner.event') : t('world.banner.calm')}
            </h2>
            {ev && <p>{eventText}</p>}
            {ev && <p className="banner__record">{t('world.banner.record', { id: ev.id, date: longDate(ev.date, i18n.language) })}</p>}
            {ev && <p className="banner__hint">{t('world.banner.shieldHint')}</p>}
            {!ev && tm && <p>{t('world.banner.tomorrow', { what: cap(t('world.forecast.tomorrowEvent', { kind: t(`forecast.kinds.${tm.kind}`), label: evLabel(tm) }).replace(/\s+,/, ',')) })}</p>}
            {lost > 0 && (
              <p className="banner__alert">
                <Icon name="energy" size={18} /> {t('world.banner.damage', { count: lost })}
              </p>
            )}
            {morningEarth && (
              <p className="banner__earth">
                <Icon name="antenna" size={18} /> {t('world.banner.earth', { answer: morningEarth })}
              </p>
            )}
            <button type="button" className="btn btn--primary" onClick={() => setBanner(false)}>
              {t('world.banner.go')}
            </button>
          </div>
        </div>
      )}

      {/* The 10-second crisis: a fast storm, decided under time pressure (no timer in assisted mode). */}
      {crisis && !night && (
        <div className="overlay overlay--crisis" role="alertdialog" aria-modal="true" aria-labelledby="crisis-title" aria-describedby="crisis-text">
          <div className="banner banner--event banner--crisis">
            <p className="crisis__timer" aria-live="assertive">
              {game.assisted ? t('world.crisis.assisted') : t('world.crisis.seconds', { count: secondsLeft })}
            </p>
            {!game.assisted && (
              <span className="crisis__bar" aria-hidden="true">
                <span style={{ width: `${(secondsLeft / V.CRISIS_SECONDS) * 100}%` }} />
              </span>
            )}
            <h2 id="crisis-title">{ev?.kind === 'cme' ? t('world.crisis.titleCme') : t('world.crisis.title')}</h2>

            {/* Picture: the storm hits the dome; one segment per risk point, lit when the shield covers it. */}
            <svg className="crisis__art" viewBox="0 0 320 120" role="img" aria-label={t('world.crisis.meter', { risk: stormRisk, shield: shieldNow })}>
              <defs>
                <radialGradient id="crisisSun" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff2c4" />
                  <stop offset="60%" stopColor="#ffb347" />
                  <stop offset="100%" stopColor="#ff6a3a" />
                </radialGradient>
              </defs>
              <circle cx="34" cy="44" r="24" fill="url(#crisisSun)" />
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} className="crisis__ray" x1={64 + i * 6} y1={30 + i * 9} x2={170 + i * 4} y2={56 + i * 6} stroke="#c9a6ff" strokeWidth="2.5" strokeDasharray="4 6" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
              <path d="M190 104 A64 64 0 0 1 318 104" fill="rgb(185 162 255 / 0.12)" stroke={need === 0 ? '#7cd17a' : '#ff9b8a'} strokeWidth="3" />
              <rect x="232" y="86" width="44" height="18" rx="4" fill="#d7d2cc" />
              {Array.from({ length: stormRisk }, (_, i) => (
                <rect key={i} x={206 + i * (96 / Math.max(stormRisk, 1))} y="112" width={96 / Math.max(stormRisk, 1) - 4} height="6" rx="3" fill={i < shieldNow ? '#b9a2ff' : 'rgb(255 255 255 / 0.15)'} />
              ))}
            </svg>
            <p className="crisis__status" id="crisis-text">
              {t('world.crisis.meter', { risk: stormRisk, shield: shieldNow })}{' '}
              <strong>{need === 0 ? (enoughAtStart && movedTotal === 0 ? t('world.crisis.enough') : t('world.crisis.covered')) : t('world.crisis.need', { count: need })}</strong>
            </p>

            {need > 0 && (
              <>
                <p className="crisis__hint">{t('world.crisis.drag')}</p>
                <div className="crisis__sources">
                  {CRISIS_SOURCES.filter((k) => a[k] - moves[k] > 0).map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`crisis__chip tone-${TONE[k]}`}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', k)}
                      onClick={() => moveOne(k)}
                    >
                      <Icon name={ICON[k]} size={20} />
                      <span>
                        <strong>{labels[k]}</strong> · {a[k] - moves[k]}
                        <small>{t(`world.crisis.cost.${k}`, { sol: base.sol + V.GREENHOUSE_DELAY_SOLS })}</small>
                      </span>
                      <Icon name="shield" size={18} className="tone-rad" />
                    </button>
                  ))}
                </div>
              </>
            )}
            {/* Drop target for mouse dragging; the chips above are buttons, so tap and keyboard work without it. */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- drag-and-drop extra; the buttons are the accessible path */}
            <div
              className="crisis__drop"
              role="region"
              aria-label={t('world.crisis.shieldZone', { n: shieldNow })}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const k = e.dataTransfer.getData('text/plain') as CrisisSource;
                if (CRISIS_SOURCES.includes(k)) moveOne(k);
              }}
            >
              <Icon name="shield" size={20} className="tone-rad" /> {t('world.crisis.shieldZone', { n: shieldNow })}
              {movedTotal > 0 && (
                <button type="button" className="crisis__undo" onClick={() => setMoves(NO_MOVES)}>
                  {t('world.crisis.undo')}
                </button>
              )}
            </div>
            {a.expedition === 1 && (
              <label className="crisis__recall">
                <input type="checkbox" checked={recall} onChange={(e) => setRecall(e.target.checked)} />
                <Icon name="rover" size={18} /> {t('world.crisis.recallExpedition')}
              </label>
            )}
            <button type="button" className="btn btn--primary" onClick={finishCrisis}>
              {need === 0 ? t('world.crisis.continue') : t('world.crisis.done')}
            </button>
          </div>
        </div>
      )}

      {night && !report && (
        <div className="world__night" role="status">
          <Icon name="moon" size={28} /> {t('world.night')}
          {skyEvent && <span className="world__night-ev">{skyEvent.strikes ? t('world.nightStrike') : t('world.nightMiss')}</span>}
          {shieldHeld && <span className="world__night-ok">{t('world.nightShield')}</span>}
          {exposed && <span className="world__night-bad">{t('world.nightExposed')}</span>}
          {plan.expedition > 0 && <span className="world__night-ev">{t('world.nightRover')}</span>}
          {plan.askEarth > 0 && <span className="world__night-ev">{t('world.nightAntenna', { min: V.RADIO_DELAY_MIN_MINUTES, max: V.RADIO_DELAY_MAX_MINUTES })}</span>}
        </div>
      )}

      {/* After the night: what happened, then one real NASA fact with its photo */}
      {night && report && after && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="report-title">
          <div className="report">
            <header className="report__head">
              <p className="report__eyebrow">{t('world.report.eyebrow', { m: missionName, n: base.sol })}</p>
              <h2 id="report-title">{t('world.report.title', { n: base.sol })}</h2>
            </header>
            <div className="report__body">
              <ul className="report__rows">
                <li className="stat tone-air">
                  <span className="stat__icon"><Icon name="air" size={22} /></span>
                  <span className="stat__label">{t('world.report.labelAir')}</span>
                  <strong className="stat__value">{base.air} → {after.air}</strong>
                  <span className="stat__what">
                    {t('world.report.air', { made, breathed })}
                    {suits > 0 ? ` · ${t('world.report.suits', { suits })}` : ''}
                    {/* Rule in plain text, the conclusion highlighted (design review E). */}
                    <span className="stat__hint">
                      {t('world.report.airRule', { breathed })}{' '}
                      <strong className={`stat__key${after.air < 0 ? ' is-bad' : airSols(after.air) <= 1 ? ' is-warn' : ''}`}>
                        {after.air < 0 ? t('world.report.airEmpty') : t('world.report.airLeft', { after: after.air, count: airSols(after.air) })}
                      </strong>
                    </span>
                  </span>
                </li>
                <li className="stat tone-food">
                  <span className="stat__icon"><Icon name="food" size={22} /></span>
                  <span className="stat__label">{t('world.report.labelFood')}</span>
                  <strong className="stat__value">{base.food} → {after.food}</strong>
                  <span className="stat__what">
                    {t('world.report.food', { harvested, eaten })}
                    <span className="stat__hint">
                      {t('world.report.foodRule', { eaten })}{' '}
                      <strong className={`stat__key${after.food < 0 ? ' is-bad' : foodSols(after.food) <= 1 ? ' is-warn' : ''}`}>
                        {after.food < 0 ? t('world.report.foodEmpty') : t('world.report.foodLeft', { after: after.food, count: foodSols(after.food) })}
                      </strong>
                    </span>
                  </span>
                </li>
                <li className={`stat tone-rad${after.exposure > V.DOSE_LIMIT ? ' stat--bad' : ''}`}>
                  <span className="stat__icon"><Icon name="shield" size={22} /></span>
                  <span className="stat__label">{t('world.report.labelRad')}</span>
                  <strong className="stat__value">{base.exposure} → {after.exposure}</strong>
                  <span className="stat__what">
                    {!radiation?.detail?.eventId
                      ? t('world.report.noEvent')
                      : radiation.detail.reachesMars === true
                        ? t('world.report.hit', { risk: radiation.detail.risk, shield: radiation.detail.shield, delta: radiation.delta })
                        : radiation.detail.reachesMars === 'unknown'
                          ? t('world.report.unknown')
                          : t('world.report.miss')}
                    {typeof damage === 'number' && <span className="stat__hint is-bad">{t('world.report.damage', { count: damage })}</span>}
                    {radiation?.detail?.reachesMars === true && Number(radiation.detail.shield) > Number(radiation.detail.risk) && (
                      <span className="stat__hint">
                        {t('world.report.spareShield', { count: Number(radiation.detail.shield) - Number(radiation.detail.risk), risk: radiation.detail.risk })}
                      </span>
                    )}
                    <span className="stat__hint">
                      {t('world.report.doseRule', { max: V.DOSE_LIMIT })}{' '}
                      <strong className={`stat__key${after.exposure > V.DOSE_LIMIT ? ' is-bad' : after.exposure === V.DOSE_LIMIT ? ' is-warn' : ''}`}>
                        {t('world.report.doseNow', { n: after.exposure, max: V.DOSE_LIMIT })}
                      </strong>
                    </span>
                    <span className="stat__hint">{t('world.report.radHint')}</span>
                  </span>
                </li>
                {typeof discovery === 'string' && (
                  <li className="stat tone-energy">
                    <span className="stat__icon"><Icon name="rover" size={22} /></span>
                    <span className="stat__label">{t('world.report.labelRover')}</span>
                    <strong className="stat__value">+1</strong>
                    <span className="stat__what">{t('world.report.sample', { site: t(`world.sites.${discovery}`), count: after.discoveries.length, goal: V.SAMPLES_GOAL })}</span>
                  </li>
                )}
                {lastCrisis && (
                  <li className="stat tone-rad">
                    <span className="stat__icon"><Icon name="storm" size={22} /></span>
                    <span className="stat__label">{t('world.reportCrisis.label')}</span>
                    <span className="stat__value" />
                    <span className="stat__what">
                      {(() => {
                        const n = CRISIS_SOURCES.reduce((s, k) => s + lastCrisis.moved[k], 0);
                        const from = CRISIS_SOURCES.filter((k) => lastCrisis.moved[k] > 0)
                          .map((k) => `${labels[k]} ${lastCrisis.moved[k]}`)
                          .join(', ');
                        if (n > 0) return t('world.reportCrisis.moved', { count: n, from });
                        return lastCrisis.enough ? t('world.reportCrisis.enough') : t('world.reportCrisis.keepPlan');
                      })()}
                      {lastCrisis.recall && <span className="stat__hint">{t('world.reportCrisis.recallExpedition')}</span>}
                    </span>
                  </li>
                )}
                {tonightEarth && (
                  <li className="stat tone-energy">
                    <span className="stat__icon"><Icon name="antenna" size={22} /></span>
                    <span className="stat__label">{t('world.earth.label')}</span>
                    <span className="stat__value" />
                    <span className="stat__what">{t('world.banner.earth', { answer: tonightEarth })}</span>
                  </li>
                )}
              </ul>
              {fact && (
                <figure className={`report__fact${fact.photo ? '' : ' report__fact--text'}`}>
                  {fact.photo && (
                    <img src={`${import.meta.env.BASE_URL}images/${fact.photo.slug}-960.webp`} srcSet={photoSrcSet(fact.photo.slug)} sizes="(max-width: 640px) 100vw, 560px" alt={fact.photo.caption?.[locale] ?? fact.text[locale].title} />
                  )}
                  <figcaption>
                    <span className="report__badge">{t('world.report.realNasa')}</span>
                    <strong className="report__fact-title">{fact.text[locale].title}</strong>
                    <span>{fact.text[locale].body}</span>
                    <a href={fact.sourceUrl} target="_blank" rel="noreferrer">
                      {fact.sourceName}
                    </a>
                    {fact.photo && (
                      <span className="report__credit">
                        {t('card.realPhoto')}
                        {fact.photo.enhancedColor ? ` · ${t('card.enhanced')}` : ''} · {fact.photo.credit} · {fact.photo.mission} · {fact.photo.date} ·{' '}
                        {locale === 'pt-BR' ? fact.photo.placePt : fact.photo.placeEn}
                        {fact.photo.caption ? ` · ${fact.photo.caption[locale]}` : ''}
                      </span>
                    )}
                  </figcaption>
                </figure>
              )}
            </div>
            <footer className="report__foot">
              <button type="button" className="btn btn--primary" onClick={onNightDone}>
                {after.status === 'playing' ? t('one.next') : t('one.finish')}
              </button>
            </footer>
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
