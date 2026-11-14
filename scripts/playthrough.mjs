// End-to-end playthrough of mission 1, with screenshots.
// Usage: node scripts/playthrough.mjs <outDir> [en|pt-BR] [scene|list]
// Builds the game, serves it with `vite preview`, plays all 7 sols on a 360 px phone,
// and fails if the mission does not end with everyone home. Base for the demo recording.
import { spawn, execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const out = process.argv[2] ?? 'playthrough';
const lang = process.argv[3] ?? 'en';
const mode = process.argv[4] ?? 'scene';
const PORT = 4179;
mkdirSync(out, { recursive: true });

execSync('pnpm --filter @mars-to-go/web build', { stdio: 'ignore' });
const server = spawn('pnpm', ['--filter', '@mars-to-go/web', 'exec', 'vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
const url = `http://localhost:${PORT}/`;

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('preview server did not start');
}

// [lifeSupport, greenhouse, shield] per sol; respects the guided unlocks of mission 1.
const PLAN = [[5, 2, 0], [5, 2, 0], [5, 2, 0], [6, 1, 0], [5, 0, 2], [7, 0, 0], [7, 0, 0]];
const T = {
  en: {
    play: 'Play', start: 'Start sol 1', add: 'Add a cell to', lock: 'Lock the plan', skip: 'Just show me', toLog: 'See the sol log',
    next: /Next sol|See how the mission ended/, home: 'Everyone came home!', names: ['Life Support', 'Greenhouse', 'Shield'],
    objects: ['Air machine', 'Greenhouse', 'Shield cover'], forecastNext: 'Next', outside: 'Outside', inside: 'Inside', close: 'Close', listMode: 'List mode',
  },
  'pt-BR': {
    play: 'Jogar', start: 'Começar o sol 1', add: 'Pôr uma célula em', lock: 'Travar o plano', skip: 'Só me mostre', toLog: 'Ver o diário do sol',
    next: /Próximo sol|Ver como a missão terminou/, home: 'Voltamos todos!', names: ['Suporte à Vida', 'Estufa', 'Escudo'],
    objects: ['Máquina de ar', 'Estufa', 'Cobertura do escudo'], forecastNext: 'Seguir', outside: 'Fora', inside: 'Dentro', close: 'Fechar', listMode: 'Modo lista',
  },
}[lang];

let failed = false;
try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const shot = (name, full = true) => page.screenshot({ path: `${out}/${name}.png`, fullPage: full });

  await page.goto(url);
  if (lang === 'pt-BR') await page.getByRole('button', { name: 'Portuguese' }).click();
  if (mode === 'list') await page.getByRole('button', { name: T.listMode }).click();
  await shot('01-home');
  await page.getByRole('button', { name: T.play, exact: true }).click();
  await page.getByRole('button', { name: T.start }).click();

  for (let sol = 1; sol <= 7; sol++) {
    const row = PLAN[sol - 1];
    if (mode === 'scene') {
      if (sol === 1) await shot('02-scene-forecast', false);
      await page.getByRole('button', { name: T.forecastNext, exact: true }).click();
      await page.locator('.sheet .choices button').nth(1).click();
      for (let i = 0; i < row.length; i++) {
        const obj = page.getByRole('button', { name: new RegExp(`^${T.objects[i]}:`) });
        for (let k = 0; k < row[i]; k++) await obj.click();
      }
      if (sol === 1 || sol === 5) await shot(`03-scene-inside-sol${sol}`, false);
      if (sol === 1) {
        await page.getByRole('tab', { name: T.outside }).click();
        await page.waitForTimeout(400);
        await shot('04-scene-outside', false);
        await page.getByRole('tab', { name: T.inside }).click();
      }
    } else {
      await page.locator('.choices button').nth(1).click();
      for (let i = 0; i < row.length; i++) {
        for (let k = 0; k < row[i]; k++) await page.getByRole('button', { name: `${T.add} ${T.names[i]}` }).click();
      }
      if (sol === 1) await shot('03-list-morning');
    }
    await page.getByRole('button', { name: T.lock }).click();
    await page.getByRole('button', { name: T.skip }).click();
    if (mode === 'scene' && sol === 5) await shot('05-scene-night-sol5', false);
    await page.getByRole('button', { name: T.toLog }).click();
    if (sol === 5) await shot(`06-${mode}-log-sol5`, mode === 'list');
    await page.getByRole('button', { name: T.next }).click();
  }
  await shot('07-end');
  const ok = await page.getByRole('heading', { name: T.home }).isVisible();
  console.log(ok ? `PLAYTHROUGH OK (${lang}, ${mode}): everyone came home` : `PLAYTHROUGH FAILED (${lang}, ${mode})`);
  if (!ok) failed = true;

  if (mode === 'scene' && lang === 'en') {
    // Computer layout: wide stage with the side panel.
    const desk = await browser.newPage({ viewport: { width: 1366, height: 800 }, reducedMotion: 'reduce' });
    await desk.goto(url);
    await desk.getByRole('button', { name: T.play, exact: true }).click();
    await desk.getByRole('button', { name: T.start }).click();
    await desk.getByRole('button', { name: T.forecastNext, exact: true }).click();
    await desk.locator('.sheet .choices button').nth(1).click();
    for (let k = 0; k < 4; k++) await desk.getByRole('button', { name: new RegExp(`^${T.objects[0]}:`) }).click();
    await desk.screenshot({ path: `${out}/08-desktop-inside.png` });
    await desk.getByRole('tab', { name: T.outside }).click();
    await desk.waitForTimeout(400);
    await desk.screenshot({ path: `${out}/09-desktop-outside.png` });
  }
  if (errors.length) {
    console.log('page errors:', errors);
    failed = true;
  }
  await browser.close();
} catch (e) {
  console.error(e);
  failed = true;
} finally {
  server.kill();
}
process.exit(failed ? 1 : 0);
