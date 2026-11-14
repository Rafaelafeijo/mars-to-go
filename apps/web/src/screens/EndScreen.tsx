import { useTranslation } from 'react-i18next';
import { exposureWord, marginSols, turningPointSol, verdict } from '@mars-to-go/sim';
import { cardById } from '@mars-to-go/content';
import { Badge } from '../cards/Badge';
import { Photo } from '../cards/Photo';
import type { Game } from '../game/useGame';

/** End of mission (brief §4.6). The full end scene comes in Phase 6. */
export function EndScreen({ game, onReplay, onGoBack, onHome }: { game: Game; onReplay: () => void; onGoBack: (sol: number) => void; onHome: () => void }) {
  const { t, i18n } = useTranslation();
  const s = game.state;
  const v = verdict(s);
  const home = s.status === 'returned_all';
  const turn = turningPointSol(s);
  const earth = cardById('photo-earth-from-mars');
  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en';

  return (
    <div className="screen">
      <h1 className="verdict-title">{home ? t('end.home') : t('end.early')}</h1>
      {v && <p className="verdict">{t(`end.verdicts.${v}`)}</p>}
      {home ? (
        <p>
          {t('end.margin', { count: marginSols(s) })} <span className="muted small">({t('meters.solsCaption')})</span> <Badge cardId="air" />
        </p>
      ) : (
        <p>{s.failure?.cause === 'air' ? t('end.earlyAir', { n: s.failure.sol }) : t('end.earlyFood', { n: s.failure?.sol })}</p>
      )}
      <p>
        {t('meters.exposure')}: <strong>{t(`meters.exposureWords.${exposureWord(s.exposure)}`)}</strong> <Badge cardId="exposure" /> ·{' '}
        {t('end.discoveries', { count: s.discoveries.length })}
      </p>
      {turn && <p>{t('end.turningPoint', { n: turn })}</p>}
      {home && earth?.photo && <Photo photo={earth.photo} alt={earth.text[locale].title} />}
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={onReplay}>
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
