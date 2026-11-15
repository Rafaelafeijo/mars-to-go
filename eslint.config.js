import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  // private/ is git-ignored (submission drafts, video build scripts): not part of the project.
  { ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', 'tools/**', 'private/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['apps/web/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    languageOptions: { globals: globals.browser },
    // Explicit: version 'detect' crashes eslint-plugin-react 7.37 on ESLint 10.
    settings: { react: { version: '19.3' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.strict.rules,
    },
  },
  {
    files: ['apps/api/**/*.ts', 'scripts/**/*.{js,mjs,ts}', '*.config.{js,ts}', 'apps/*/vite.config.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    // react-three-fiber uses three.js props (position, args, geometry…) that eslint-plugin-react does not know.
    files: ['apps/web/src/world/Scene3D.tsx', 'apps/web/src/world/three/**/*.tsx'],
    rules: { 'react/no-unknown-property': 'off' },
  },
  {
    // The simulation is pure: no DOM, no network, no clock (ADR-0009).
    files: ['packages/sim/src/**/*.ts'],
    rules: {
      'no-restricted-globals': ['error', 'window', 'document', 'fetch', 'localStorage'],
    },
  },
);
