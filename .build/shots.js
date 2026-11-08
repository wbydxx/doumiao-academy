const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:4174';
const OUT = '/workspace/.build/shots';
const FULL = {
  version: 1, stones: 42, modules: {
    binary: { lessons: [3, 3, 3], game: 3, quiz: 3 },
    ai: { lessons: [3, 3, 3, 3], game: 3, quiz: 3 },
    coding: { lessons: [3, 3, 3], game: 3, quiz: 3 },
    safety: { lessons: [3, 3, 3, 3], game: 3, quiz: 3 },
    terms: { lessons: [3, 3, 3], game: 3, quiz: 3 },
    lab: { lessons: [3, 3, 3, 3, 3, 3, 3], game: 3, quiz: 3 }
  }
};

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  async function shot(viewport, dsf, fn) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: dsf });
    await ctx.addInitScript(p => {
      try { localStorage.setItem('doumiao:progress:v1', JSON.stringify(p)); } catch (e) {}
    }, FULL);
    const page = await ctx.newPage();
    page.on('pageerror', e => console.log('ERR', e.message));
    await fn(page);
    await ctx.close();
  }

  const D = { width: 1440, height: 900 };

  await shot(D, 1.5, async p => {
    await p.goto(BASE + '/index.html', { waitUntil: 'load' });
    await p.waitForTimeout(3300);
    await p.screenshot({ path: OUT + '/01_home.png' });
    await p.evaluate(() => window.__deckGo && window.__deckGo(1));
    await p.waitForTimeout(1500);
    await p.screenshot({ path: OUT + '/02_route.png' });
  });

  await shot(D, 1.5, async p => {
    await p.goto(BASE + '/binary/lesson-01.html', { waitUntil: 'load' });
    await p.waitForTimeout(2200);
    await p.screenshot({ path: OUT + '/06_lesson.png' });
  });

  await shot(D, 1.5, async p => {
    await p.goto(BASE + '/code-lab/lesson-01.html', { waitUntil: 'load' });
    await p.waitForTimeout(2000);
    await p.evaluate(() => {
      if (!window.__deckGo) return;
      for (let i = 0; i < 8; i++) {
        window.__deckGo(i);
        if (document.querySelector('.slide.is-active .code-run')) break;
      }
    });
    await p.waitForTimeout(1500);
    await p.locator('.slide.is-active .code-run').first().scrollIntoViewIfNeeded().catch(() => {});
    await p.waitForTimeout(900);
    await p.screenshot({ path: OUT + '/03_codelab.png' });
  });

  await shot(D, 1.5, async p => {
    await p.goto(BASE + '/binary/game-lightbulb.html', { waitUntil: 'load' });
    await p.waitForTimeout(2600);
    await p.screenshot({ path: OUT + '/05_game.png' });
  });

  await shot(D, 1.5, async p => {
    await p.goto(BASE + '/binary/quiz.html', { waitUntil: 'load' });
    await p.waitForTimeout(2000);
    await p.evaluate(() => window.scrollTo(0, 430));
    await p.waitForTimeout(900);
    await p.screenshot({ path: OUT + '/07_quiz.png' });
  });

  await shot(D, 1.5, async p => {
    await p.goto(BASE + '/achievements/index.html', { waitUntil: 'load' });
    await p.waitForTimeout(2400);
    await p.screenshot({ path: OUT + '/04_achievements.png' });
  });

  const M = { width: 390, height: 844 };
  await shot(M, 2, async p => {
    await p.goto(BASE + '/index.html', { waitUntil: 'load' });
    await p.waitForTimeout(3300);
    await p.screenshot({ path: OUT + '/09_mobile_home.png' });
  });
  await shot(M, 2, async p => {
    await p.goto(BASE + '/code-lab/lesson-01.html', { waitUntil: 'load' });
    await p.waitForTimeout(2200);
    await p.evaluate(() => {
      if (!window.__deckGo) return;
      for (let i = 0; i < 8; i++) {
        window.__deckGo(i);
        if (document.querySelector('.slide.is-active .code-run')) break;
      }
    });
    await p.waitForTimeout(1400);
    await p.locator('.slide.is-active .code-run').first().scrollIntoViewIfNeeded().catch(() => {});
    await p.waitForTimeout(700);
    await p.screenshot({ path: OUT + '/10_mobile_codelab.png' });
  });
  await shot(M, 2, async p => {
    await p.goto(BASE + '/achievements/index.html', { waitUntil: 'load' });
    await p.waitForTimeout(2400);
    await p.screenshot({ path: OUT + '/11_mobile_ach.png' });
  });

  await browser.close();
  console.log('shots:', fs.readdirSync(OUT).join(' '));
})();
