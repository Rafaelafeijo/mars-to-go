import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { conditionsFor, exposureWord } from '@mars-to-go/sim';
import { catalogEvent } from '@mars-to-go/content';
import { Badge } from '../cards/Badge';
import { prefersReducedMotion } from '../lib/format';
import { stepCardId, stepText } from '../game/stepText';
import type { Game } from '../game/useGame';
import { Meters } from './Meters';
import { SolHeader } from './SolHeader';

const STEP_MS = 1100;
const STEP_MS_ASSISTED = 2400;

/** The night: optional "pick the result", then the math animated step by step, always in the same order (ADR-0020). */
export function NightScreen({ game, onPick, onDone }: { game: Game; onPick: (i: number) => void; onDone: () => void }) {
  const { t } = useTranslation();
  const night = game.night;
  const [phase, setPhase] = useState<'pick' | 'math'>('pick');
  const [animated, setShown] = useState(0);
  const [run, setRun] = useState(0);
  const total = night?.result.steps.length ?? 0;
  const reduced = prefersReducedMotion();
  const shown = reduced ? total : animated;
  const startMath = () => {
    setShown(0);
    setPhase('math');
  };

  useEffect(() => {
    if (phase !== 'math' || reduced) return;
    const ms = game.assisted ? STEP_MS_ASSISTED : STEP_MS;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= total) window.clearInterval(id);
    }, ms);
    return () => window.clearInterval(id);
  }, [phase, run, total, game.assisted, reduced]);

  if (!night) return null;
  const { pick, result, before } = night;
  const evCard = catalogEvent(conditionsFor(game.def, before.sol).event?.id)?.cardId;
  const visible = result.steps.slice(0, shown);
  const done = shown >= total;
  const last = visible.at(-1);
  const current = {
    air: [...visible].reverse().find((s) => s.resource === 'air')?.after ?? before.air,
    food: [...visible].reverse().find((s) => s.resource === 'food')?.after ?? before.food,
    exposure: [...visible].reverse().find((s) => s.resource === 'exposure')?.after ?? before.exposure,
  };

  return (
    <div className="screen screen--night">
      <SolHeader state={before} />
      <h1>{t('night.title')}</h1>
      <Meters state={current} dust={conditionsFor(game.def, before.sol).dust} />

      {phase === 'pick' && (
        <section className="panel" aria-labelledby="pick-title">
          <h2 id="pick-title">{t('night.pickTitle')}</h2>
          <p className="muted small">{t('night.pickHint')}</p>
          <div className="choices">
            {pick.options.map((o, i) => (
              <button
                key={i}
                type="button"
                className="btn btn--choice"
                onClick={() => {
                  onPick(i);
                  startMath();
                }}
              >
                {t('night.option', { air: o.air, food: o.food, exposure: t(`meters.exposureWords.${exposureWord(o.exposure)}`) })}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--ghost" onClick={startMath}>
            {t('night.skip')}
          </button>
        </section>
      )}

      {phase === 'math' && (
        <section className="panel math" aria-labelledby="nmath-title">
          {pick.picked !== null && <p className="result-flag">{pick.picked === pick.correctIndex ? `✔ ${t('night.right')}` : t('night.wrong')}</p>}
          <h2 id="nmath-title">{t('math.title')}</h2>
          <ol className="steps" aria-live="polite">
            {visible.map((s, i) => {
              const card = stepCardId(s, evCard);
              return (
                <li key={`${s.id}-${i}`} className={s === last && !done ? 'step--new' : undefined}>
                  {stepText(t, s)} {card && <Badge cardId={card} />}
                </li>
              );
            })}
          </ol>
          {done && (
            <div className="actions">
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
              <button type="button" className="btn btn--primary" onClick={onDone}>
                {t('night.toLog')}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
