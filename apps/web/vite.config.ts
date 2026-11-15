import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Content Security Policy for the published game (security review, 2026-11-15).
 * Everything the game loads comes from its own site: scripts, styles, images, fonts,
 * 3D models and the DONKI copy. 'unsafe-inline' for styles only: React sets inline
 * style attributes. blob:/data: are needed by three.js for model textures and canvas labels.
 * Build only: the dev server injects an inline script for hot reload.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Our own API (Railway) for the live DONKI data on the home screen; nothing else.
  "connect-src 'self' data: blob: https://mars-to-go-api-production.up.railway.app",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

function csp(): Plugin {
  return {
    name: 'mars-to-go-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />\n    <meta name="referrer" content="no-referrer" />`);
    },
  };
}

// GitHub Pages serves the game under /mars-to-go/; the Railway mirror serves it at /.
// The build sets BASE_PATH accordingly (see .github/workflows and apps/api).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), csp()],
});
