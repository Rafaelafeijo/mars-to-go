// End-to-end playthrough of mission 1 on a 360 px phone, with screenshots.
// Usage: node scripts/playthrough.mjs <outDir> [en|pt-BR]
// Builds the game, serves it with `vite preview`, plays all 7 sols, and fails if
// the mission does not end with everyone home. Also the base for the demo recording.
import { spawn, execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const out = process.argv[2] ?? 'playthrough';
const lang = process.argv[3] ?? 'en';
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
  en: { play: 'Play', start: 'Start sol 1', add: 'Add a cell to', lock: 'Lock the plan', skip: 'Just show me', toLog: 'See the sol log', next: /Next sol|See how the mission ended/, home: 'Everyone came home!', names: ['Life Support', 'Greenhouse', 'Shield'], close: 'Close', pt: 'Portuguese' },
  'pt-BR': { play: 'Jogar', start: 'Começar o sol 1', add: 'Pôr uma célula em', lock: 'Travar o plano', skip: 'Só me mostre', toLog: 'Ver o diário do sol', next: /Próximo sol|Ver como a missão terminou/, home: 'Voltamos todos!', names: ['Suporte à Vida', 'Estufa', 'Escudo'], close: 'Fechar', pt: 'Portuguese' },
}[lang];

let failed = false;
try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const shot = (name) => page.screenshot({ path: `${out}/${name}.png`, fullPage: true });

  await page.goto(url);
  if (lang === 'pt-BR') await page.getByRole('button', { name: T.pt }).click();
  await shot('01-home');
  await page.getByRole('button', { name: T.play, exact: true }).click();
  await shot('02-briefing');
  await page.getByRole('button', { name: T.start }).click();

  for (let sol = 1; sol <= 7; sol++) {
    await page.locator('.choices button').nth(1).click(); // morning question
    const row = PLAN[sol - 1];
    for (let i = 0; i < row.length; i++) {
      for (let k = 0; k < row[i]; k++) await page.getByRole('button', { name: `${T.add} ${T.names[i]}` }).click();
    }
    await page.waitForTimeout(300);
    if (sol === 1 || sol === 5) await shot(`03-morning-sol${sol}`);
    if (sol === 1) {
      await page.locator('.dest .badge').first().click();
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${out}/04-card.png` });
      await page.getByRole('button', { name: T.close }).click();
    }
    await page.getByRole('button', { name: T.lock }).click();
    if (sol === 1) await shot('05-night-pick');
    await page.getByRole('button', { name: T.skip }).click();
    await page.getByRole('button', { name: T.toLog }).click();
    if (sol === 1 || sol === 5) await shot(`06-log-sol${sol}`);
    await page.getByRole('button', { name: T.next }).click();
  }
  await shot('07-end');
  const ok = await page.getByRole('heading', { name: T.home }).isVisible();
  console.log(ok ? 'PLAYTHROUGH OK: everyone came home' : 'PLAYTHROUGH FAILED: no "everyone home"');
  if (!ok) failed = true;
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
