// End-to-end playthrough of mission 1, with screenshots and (world mode) a performance probe.
// Usage: node scripts/playthrough.mjs <outDir> [en|pt-BR] [world|one|list]
// Builds the game, serves it with `vite preview`, plays all 7 sols on a 360 px phone,
// and fails if the mission does not end with everyone home. Base for the demo recording.
import { spawn, execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const out = process.argv[2] ?? 'playthrough';
const lang = process.argv[3] ?? 'en';
const mode = process.argv[4] ?? 'world';
const PORT = 4179;
mkdirSync(out, { recursive: true });

execSync('pnpm --filter @mars-to-go/web build', { stdio: 'ignore' });
const server = spawn('pnpm', ['--filter', '@mars-to-go/web', 'exec', 'vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
const url = `http://localhost:${PORT}/${mode === 'world' ? '' : `?ui=${mode}`}`;

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://localhost:${PORT}/`)).ok) return;
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
    machines: ['Air machine', 'Greenhouse', 'Shield'], worldAdd: 'Add a cell to the', pass: 'Pass the night', planSol: 'Plan the sol',
  },
  'pt-BR': {
    play: 'Jogar', start: 'Começar o sol 1', add: 'Pôr uma célula em', lock: 'Travar o plano', skip: 'Só me mostre', toLog: 'Ver o diário do sol',
    next: /Próximo sol|Ver como a missão terminou/, home: 'Voltamos todos!', names: ['Suporte à Vida', 'Estufa', 'Escudo'],
    machines: ['Máquina de ar', 'Estufa', 'Escudo'], worldAdd: 'Pôr uma célula em:', pass: 'Passar a noite', planSol: 'Planejar o sol',
  },
}[lang];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let failed = false;
try {
  await waitForServer();
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const shot = (name, full = true) => page.screenshot({ path: `${out}/${name}.png`, fullPage: full });

  await page.goto(url);
  if (lang === 'pt-BR') await page.getByRole('button', { name: 'Portuguese' }).click();
  await shot('01-home');
  await page.getByRole('button', { name: T.play, exact: true }).click();
  await page.getByRole('button', { name: T.start }).click();

  for (let sol = 1; sol <= 7; sol++) {
    const row = PLAN[sol - 1];
    if (mode === 'world') {
      if (sol === 1) {
        await page.waitForTimeout(2500); // models load
        await shot('02-world-sol1-banner', false);
      }
      if (sol === 3) await shot('02-world-sol3-banner-event', false);
      await page.getByRole('button', { name: T.planSol }).click();
      for (let i = 0; i < row.length; i++) {
        const slot = page.getByRole('button', { name: new RegExp(`^${esc(`${T.worldAdd} ${T.machines[i]}`)}`) });
        for (let k = 0; k < row[i]; k++) {
          await slot.click();
          if (sol === 1 && i === 0 && k === 4) await shot('03-world-sol1-only-air', false);
        }
      }
      if (sol === 1 || sol === 5) await shot(`04-world-sol${sol}-planned`, false);
      if (sol === 2) {
        const sky = page.locator('.world__sky-btn');
        await sky.click();
        await page.waitForTimeout(1200);
        await shot('06-world-sky-view', false);
        await sky.click();
      }
      await page.getByRole('button', { name: T.pass }).click();
      await page.getByRole('button', { name: T.next }).waitFor();
      if (sol === 1 || sol === 5) await shot(`05-world-report-sol${sol}`, false);
      await page.getByRole('button', { name: T.next }).click();
      continue;
    }
    if (mode === 'one') {
      for (let i = 0; i < row.length; i++) {
        const tile = page.getByRole('button', { name: new RegExp(`^${T.names[i]}:`) });
        for (let k = 0; k < row[i]; k++) await tile.click();
      }
      await page.getByRole('button', { name: T.lock }).click();
      await page.getByRole('button', { name: T.next }).click();
      continue;
    }
    await page.locator('.choices button').nth(1).click();
    for (let i = 0; i < row.length; i++) {
      for (let k = 0; k < row[i]; k++) await page.getByRole('button', { name: `${T.add} ${T.names[i]}` }).click();
    }
    await page.getByRole('button', { name: T.lock }).click();
    await page.getByRole('button', { name: T.skip }).click();
    await page.getByRole('button', { name: T.toLog }).click();
    await page.getByRole('button', { name: T.next }).click();
  }
  await page.getByRole('heading', { name: T.home }).waitFor({ timeout: 10000 }).catch(() => {});
  await shot('07-end');
  const ok = await page.getByRole('heading', { name: T.home }).isVisible();
  console.log(ok ? `PLAYTHROUGH OK (${lang}, ${mode}): everyone came home` : `PLAYTHROUGH FAILED (${lang}, ${mode})`);
  if (!ok) failed = true;

  if (mode === 'world' && lang === 'en') {
    // Computer layout.
    const desk = await browser.newPage({ viewport: { width: 1366, height: 800 }, reducedMotion: 'reduce' });
    await desk.goto(url);
    await desk.getByRole('button', { name: T.play, exact: true }).click();
    await desk.getByRole('button', { name: T.start }).click();
    await desk.waitForTimeout(3000);
    await desk.getByRole('button', { name: T.planSol }).click();
    for (let k = 0; k < 4; k++) await desk.getByRole('button', { name: new RegExp(`^${esc(`${T.worldAdd} ${T.machines[0]}`)}`) }).click();
    await desk.getByRole('button', { name: new RegExp(`^${esc(`${T.worldAdd} ${T.machines[1]}`)}`) }).click();
    await desk.waitForTimeout(600);
    await desk.screenshot({ path: `${out}/08-desktop-sol1.png` });
    // Sky view (second playtest): camera looks up, NASA sky fact with a real photo.
    await desk.getByRole('button', { name: 'Look at the sky' }).click();
    await desk.waitForTimeout(1500);
    await desk.screenshot({ path: `${out}/09-desktop-sky.png` });
    await desk.getByRole('button', { name: 'Back to the base' }).click();

    // Performance probe on a phone-size page: normal CPU, then 4× slower CPU (low-end phone stand-in).
    const perf = {};
    for (const rate of [1, 4]) {
      const p = await browser.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2 });
      const cdp = await p.context().newCDPSession(p);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate });
      await p.goto(url);
      await p.getByRole('button', { name: T.play, exact: true }).click();
      await p.getByRole('button', { name: T.start }).click();
      await p.getByRole('button', { name: T.planSol }).click();
      await p.waitForTimeout(7000);
      perf[`fps_cpu${rate}x`] = await p.evaluate(() => globalThis.__marsFps ?? null);
      if (rate === 1) {
        perf.bytes = await p.evaluate(() =>
          performance.getEntriesByType('resource').reduce((s, e) => s + (e.transferSize || e.encodedBodySize || 0), 0) +
          (performance.getEntriesByType('navigation')[0]?.transferSize ?? 0),
        );
      }
      await p.close();
    }
    console.log('PERF', JSON.stringify(perf));
    writeFileSync(`${out}/perf.json`, JSON.stringify(perf, null, 2));
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
