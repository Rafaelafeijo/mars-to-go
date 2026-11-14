import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DATA_SOURCES_IN_GAME, EVERY_NUMBER_HAS_BADGE, LOCALES } from '@mars-to-go/content';
import { setLocale } from './i18n';
import { CardProvider } from './cards/CardContext';
import { useGame } from './game/useGame';
import { Home } from './screens/Home';
import { Briefing } from './screens/Briefing';
import { Morning } from './screens/Morning';
import { NightScreen } from './screens/NightScreen';
import { SolLogScreen } from './screens/SolLogScreen';
import { EndScreen } from './screens/EndScreen';

const REPO_URL = 'https://github.com/Rafaelafeijo/mars-to-go';

export function App() {
  const { t, i18n } = useTranslation();
  const g = useGame();
  const { game } = g;
  const main = useRef<HTMLElement>(null);

  // Each new screen starts at the top, with focus on the main region for screen readers.
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus();
  }, [game.screen, game.state.sol]);

  return (
    <CardProvider>
      <a className="skip-link" href="#main">
        {t('app.skipToContent')}
      </a>
      <header className="top">
        <span className="top__brand">{t('app.title')}</span>
        <nav aria-label={t('app.languageLabel')} className="lang">
          {LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              lang={locale}
              aria-pressed={i18n.language === locale}
              aria-label={t(`app.languageNames.${locale}`)}
              onClick={() => setLocale(locale)}
            >
              {t(`app.languages.${locale}`)}
            </button>
          ))}
        </nav>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        {game.screen === 'home' && <Home onPlay={() => g.startMission()} assisted={game.assisted} onAssisted={g.setAssisted} />}
        {game.screen === 'briefing' && <Briefing onStart={() => g.go('morning')} />}
        {game.screen === 'morning' && <Morning key={`${game.state.missionId}-${game.state.sol}-${game.checkpoints.length}`} game={game} onAnswer={g.answerQuestion} onLock={g.lockPlan} />}
        {game.screen === 'night' && <NightScreen key={game.state.sol} game={game} onPick={g.pickResult} onDone={g.endNight} />}
        {game.screen === 'log' && <SolLogScreen game={game} onNext={g.nextSol} />}
        {game.screen === 'end' && <EndScreen game={game} onReplay={() => g.startMission(game.def)} onGoBack={g.goBackToSol} onHome={() => g.go('home')} />}
      </main>
      {game.screen === 'home' && (
        <footer className="footer">
          <p>{t('footer.madeBy')}</p>
          <p>{t('footer.ai')}</p>
          <p>
            {DATA_SOURCES_IN_GAME.length === 0
              ? t('footer.dataNone')
              : t('footer.dataInGame', { sources: DATA_SOURCES_IN_GAME.join(', ') })}
            {EVERY_NUMBER_HAS_BADGE ? ` ${t('footer.everyNumberBadge')}` : null}
          </p>
          <p>
            <a href={REPO_URL}>{t('footer.source')}</a>
          </p>
        </footer>
      )}
    </CardProvider>
  );
}
