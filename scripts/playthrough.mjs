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
// ADR-0033: the rover goes out on sol 6 (2 cells) for the rock sample; shield 2 on sol 5 keeps the dose in.
const PLAN_WORLD = [[5, 2, 0], [5, 2, 0], [5, 2, 0], [6, 1, 0], [5, 0, 2], [5, 0, 0, 1], [7, 0, 0]];
// Fallback screens: no rover (home, but "with failures").
const PLAN_OTHER = [[5, 2, 0], [5, 2, 0], [5, 2, 0], [6, 1, 0], [5, 0, 2], [7, 0, 0], [7, 0, 0]];
const PLAN = mode === 'world' ? PLAN_WORLD : PLAN_OTHER;
const T = {
  en: {
    play: 'Play', start: 'Start sol 1', add: 'Add a cell to', lock: 'Lock the plan', skip: 'Just show me', toLog: 'See the sol log',
    next: /Next sol|See how the mission ended/, home: /Mission accomplished!|Mission with failures/, success: 'Mission accomplished!', names: ['Life Support', 'Greenhouse', 'Shield'],
    machines: ['Air machine', 'Greenhouse', 'Shield', 'Rover'], worldAdd: 'Add a cell to the', pass: 'Pass the night', planSol: 'Plan the sol',
  },
  'pt-BR': {
    play: 'Jogar', start: 'Começar o sol 1', add: 'Pôr uma célula em', lock: 'Travar o plano', skip: 'Só me mostre', toLog: 'Ver o diário do sol',
    next: /Próximo sol|Ver como a missão terminou/, home: /Missão bem-sucedida!|Missão com falhas/, success: 'Missão bem-sucedida!', names: ['Suporte à Vida', 'Estufa', 'Escudo'],
    machines: ['Máquina de ar', 'Estufa', 'Escudo', 'Rover'], worldAdd: 'Pôr uma célula em:', pass: 'Passar a noite', planSol: 'Planejar o sol',
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
  const endHeading = page.getByRole('heading', { level: 1, name: mode === 'world' ? T.success : T.home });
  await endHeading.waitFor({ timeout: 10000 }).catch(() => {});
  await shot('07-end');
  const ok = await endHeading.isVisible();
  console.log(ok ? `PLAYTHROUGH OK (${lang}, ${mode}): everyone came home${mode === 'world' ? ', mission accomplished' : ''}` : `PLAYTHROUGH FAILED (${lang}, ${mode})`);
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
  // Mission 2 (world, en): opens from the end screen; the 10-second crisis appears on sol 7.
  if (mode === 'world' && lang === 'en' && ok) {
    const PLAN_M2 = [[5, 2, 0], [4, 1, 0, 1], [4, 1, 2], [5, 2, 0], [5, 0, 2], [6, 1, 0], [4, 0, 3]];
    await page.getByRole('button', { name: /Play Mission 2/ }).click();
    await shot('10-m2-briefing');
    await page.getByRole('button', { name: T.start }).click();
    for (let sol = 1; sol <= 7; sol++) {
      const row = PLAN_M2[sol - 1];
      await page.getByRole('button', { name: T.planSol }).click();
      for (let i = 0; i < row.length; i++) {
        const slot = page.getByRole('button', { name: new RegExp(`^${esc(`${T.worldAdd} ${T.machines[i]}`)}`) });
        for (let k = 0; k < row[i]; k++) await slot.click();
      }
      await page.getByRole('button', { name: T.pass }).click();
      if (sol === 7) {
        await page.getByRole('alertdialog').waitFor();
        await shot('11-m2-crisis', false);
        await page.getByRole('button', { name: /^Keep the plan/ }).click();
      }
      await page.getByRole('button', { name: T.next }).waitFor();
      if (sol === 7) await shot('12-m2-report-sol7', false);
      await page.getByRole('button', { name: T.next }).click();
    }
    const m2ok = await page.getByRole('heading', { level: 1, name: T.success }).isVisible();
    await shot('13-m2-end');
    console.log(m2ok ? 'PLAYTHROUGH OK (en, world, mission 2): mission accomplished' : 'PLAYTHROUGH FAILED (en, world, mission 2)');
    if (!m2ok) failed = true;
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
