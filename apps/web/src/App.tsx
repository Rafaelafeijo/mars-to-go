import { useTranslation } from 'react-i18next';
import { LOCALES } from '@mars-to-go/content';
import { setLocale } from './i18n';

const REPO_URL = 'https://github.com/Rafaelafeijo/mars-to-go';

export function App() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <a className="skip-link" href="#main">
        {t('app.skipToContent')}
      </a>
      <header className="top">
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
      <main id="main" className="home">
        <h1 className="title">{t('app.title')}</h1>
        <p className="tagline">{t('app.tagline')}</p>
        <p>{t('home.intro')}</p>
        <p>{t('home.solExplained')}</p>
        <p className="muted">{t('home.comingSoon')}</p>
      </main>
      <footer className="footer">
        <p>{t('footer.madeBy')}</p>
        <p>{t('footer.ai')}</p>
        <p>{t('footer.data')}</p>
        <p>
          <a href={REPO_URL}>{t('footer.source')}</a>
        </p>
      </footer>
    </>
  );
}
