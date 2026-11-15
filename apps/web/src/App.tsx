import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DATA_SOURCES_IN_GAME, EVERY_NUMBER_HAS_BADGE, LOCALES, MISSION_1, MISSION_2 } from '@mars-to-go/content';
import { setLocale } from './i18n';
import { CardProvider } from './cards/CardContext';
import { useGame } from './game/useGame';
import { Home } from './screens/Home';
import { Briefing } from './screens/Briefing';
import { Morning } from './screens/Morning';
import { NightScreen } from './screens/NightScreen';
import { SolLogScreen } from './screens/SolLogScreen';
import { EndScreen } from './screens/EndScreen';
import { SolScreen } from './one/SolScreen';
import { WorldScreen } from './world/WorldScreen';
import { NasaDataPanel } from './world/NasaDataPanel';

const REPO_URL = 'https://github.com/Rafaelafeijo/mars-to-go';
type Ui = 'world' | 'one' | 'list';

/**
 * The 3D world is the game (ADR-0032). The Phase 3B single screen (?ui=one) and the
 * Phase 3 list (?ui=list) stay reachable as the fallback plan; they are not shown in the menu.
 */
function initialUi(): Ui {
  const p = new URLSearchParams(window.location.search).get('ui');
  return p === 'one' || p === 'list' ? p : 'world';
}

export function App() {
  const { t, i18n } = useTranslation();
  const g = useGame();
  const { game } = g;
  const main = useRef<HTMLElement>(null);
  const [ui] = useState<Ui>(initialUi);
  const [nasaOpen, setNasaOpen] = useState(false);
  // Mission 2 opens only from the end of mission 1 with everyone home (no mission buttons on the home screen).
  const m1Home = game.screen === 'end' && game.def.id === 'm1' && game.state.status === 'returned_all';

  // Each new screen starts at the top, with focus on the main region for screen readers.
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus();
  }, [game.screen, game.state.sol]);

  const inSol = game.screen === 'morning' || game.screen === 'night' || game.screen === 'log';
  const nightDone = () => {
    g.endNight();
    g.nextSol();
  };

  return (
    <CardProvider>
      <a className="skip-link" href="#main">
        {t('app.skipToContent')}
      </a>
      <header className="top">
        <button type="button" className="top__brand" onClick={() => g.go('home')} aria-label={`${t('app.title')} · ${t('menu.home')}`}>
          {t('app.title')}
        </button>
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
      <main id="main" ref={main} tabIndex={-1} className={inSol && ui !== 'list' ? 'main--one' : undefined}>
        {game.screen === 'home' && (
          <Home
            onPlay={() => g.startMission(MISSION_1)}
            assisted={game.assisted}
            onAssisted={g.setAssisted}
            onNasaData={() => setNasaOpen(true)}
          />
        )}
        {game.screen === 'briefing' && <Briefing missionId={game.def.id} onStart={() => g.go('morning')} />}
        {inSol && ui === 'world' && (
          <WorldScreen
            key={`${game.def.id}-${game.checkpoints.length}`}
            game={game}
            onLock={g.lockPlan}
            onNightDone={nightDone}
            onRestart={() => g.startMission(game.def)}
            onHome={() => g.go('home')}
            onNasaData={() => setNasaOpen(true)}
          />
        )}
        {inSol && ui === 'one' && <SolScreen key={`${game.def.id}-${game.checkpoints.length}`} game={game} onLock={g.lockPlan} onNightDone={nightDone} />}
        {ui === 'list' && game.screen === 'morning' && (
          <Morning key={`${game.state.missionId}-${game.state.sol}-${game.checkpoints.length}`} game={game} onAnswer={g.answerQuestion} onLock={g.lockPlan} />
        )}
        {ui === 'list' && game.screen === 'night' && <NightScreen key={game.state.sol} game={game} onPick={g.pickResult} onDone={g.endNight} />}
        {ui === 'list' && game.screen === 'log' && <SolLogScreen game={game} onNext={g.nextSol} />}
        {game.screen === 'end' && (
          <EndScreen
            game={game}
            onReplay={() => g.startMission(game.def)}
            onGoBack={g.goBackToSol}
            onHome={() => g.go('home')}
            onNext={m1Home ? () => g.startMission(MISSION_2) : undefined}
          />
        )}
      </main>
      <NasaDataPanel open={nasaOpen} onClose={() => setNasaOpen(false)} />
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
