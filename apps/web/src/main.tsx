import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Body font, self-hosted (no request to Google: privacy rule 9). Atkinson Hyperlegible Next,
// designed by the Braille Institute for legibility; OFL-1.1, listed in docs/ASSETS.md.
import '@fontsource-variable/atkinson-hyperlegible-next';
import '@mars-to-go/ui/tokens.css';
import './styles.css';
import './i18n';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
