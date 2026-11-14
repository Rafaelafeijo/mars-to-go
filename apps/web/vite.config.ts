import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the game under /mars-to-go/; the Railway mirror serves it at /.
// The build sets BASE_PATH accordingly (see .github/workflows and apps/api).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
});
