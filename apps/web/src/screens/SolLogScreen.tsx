import { useTranslation } from 'react-i18next';
import { conditionsFor, exposureWord, whatIf, type Allocation } from '@mars-to-go/sim';
import { catalogEvent } from '@mars-to-go/content';
import { Badge } from '../cards/Badge';
import { stepCardId, stepText } from '../game/stepText';
import { QUESTION_ANSWER, type Game } from '../game/useGame';
import { Meters } from './Meters';
import { SolHeader } from './SolHeader';

const MOVABLE = ['lifeSupport', 'greenhouse', 'shield'] as const;

/** Sol log: prediction vs result, the math, the data source, and one "what if" (brief §4.4). */
export function SolLogScreen({ game, onNext }: { game: Game; onNext: () => void }) {
  const { t } = useTranslation();
  const night = game.night;
  if (!night) return null;
  const { before, allocation, result } = night;
  const q = game.morning.question;
  const options = t(`question.${q}Options`, { returnObjects: true }) as string[];
  const evCard = catalogEvent(conditionsFor(game.def, before.sol).event?.id)?.cardId;
  const alt = whatIf(game.def, before, allocation);
  const moved = alt ? diff(allocation, alt.allocation) : null;

  return (
    <div className="screen">
      <SolHeader state={before} />
      <h1>{t('log.title', { n: before.sol })}</h1>
      <Meters state={game.state} dust={false} />

      {game.morning.answer !== null && (
        <section className="panel">
          <p>{t('log.yourGuess', { answer: options[game.morning.answer] })}</p>
          <p>{t('log.theAnswer', { answer: options[QUESTION_ANSWER[q]] })}</p>
          <p>
            <strong>{game.morning.answer === QUESTION_ANSWER[q] ? `✔ ${t('log.guessRight')}` : t('log.guessWrong')}</strong>
          </p>
        </section>
      )}

      <section className="panel math">
        <h2>{t('math.title')}</h2>
        <ol className="steps">
          {result.steps.map((s, i) => {
            const card = stepCardId(s, evCard);
            return (
              <li key={`${s.id}-${i}`}>
                {stepText(t, s)} {card && <Badge cardId={card} />}
              </li>
            );
          })}
        </ol>
      </section>

      {alt && moved && (
        <section className="panel">
          <p>
            {t('log.whatIf', {
              from: t(`alloc.destinations.${moved.from}.name`),
              to: t(`alloc.destinations.${moved.to}.name`),
              air: alt.outcome.air,
              food: alt.outcome.food,
              exposure: t(`meters.exposureWords.${exposureWord(alt.outcome.exposure)}`),
            })}
          </p>
        </section>
      )}

      <button type="button" className="btn btn--primary" onClick={onNext}>
        {game.state.status === 'playing' ? t('log.next') : t('log.finish')}
      </button>
    </div>
  );
}

function diff(a: Allocation, b: Allocation) {
  const from = MOVABLE.find((k) => b[k] < a[k]);
  const to = MOVABLE.find((k) => b[k] > a[k]);
  return from && to ? { from, to } : null;
}
