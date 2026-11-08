const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:4174';
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

const CURSOR = `
(() => {
  const css = document.createElement('style');
  css.textContent = \`
    #__cur{position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;pointer-events:none;
      transform:translate(-4px,-3px);filter:drop-shadow(0 2px 5px rgba(0,0,0,.55));transition:transform .08s}
    .__rip{position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;
      border:3px solid #22d3ee;background:rgba(34,211,238,.16);box-shadow:0 0 0 3px rgba(6,14,26,.55);
      z-index:2147483646;pointer-events:none;
      animation:__rip .62s cubic-bezier(.2,.7,.3,1) forwards}
    @keyframes __rip{0%{transform:scale(.45);opacity:1}100%{transform:scale(4.4);opacity:0}}
    .__fade{position:fixed;inset:0;background:#050B14;z-index:2147483645;pointer-events:none;opacity:0;transition:opacity .35s}
  \`;
  const add = () => {
    document.head.appendChild(css);
    const cur = document.createElement('div');
    cur.id = '__cur';
    cur.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 2.5 20 12.2l-7.1 1.3-2.6 6.9L4 2.5z" fill="#fff" stroke="#0B2036" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.body.appendChild(cur);
    window.addEventListener('mousemove', e => {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    }, true);
    window.addEventListener('mousedown', e => {
      const r = document.createElement('div');
      r.className = '__rip';
      r.style.left = e.clientX + 'px';
      r.style.top = e.clientY + 'px';
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 640);
      cur.style.transform = 'translate(-4px,-3px) scale(.86)';
    }, true);
    window.addEventListener('mouseup', () => { cur.style.transform = 'translate(-4px,-3px)'; }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add);
  else add();
})();
`;

(async () => {
  const dir = '/workspace/.build/vid';
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir, size: { width: 1280, height: 720 } },
  });
  await ctx.addInitScript((p) => {
    try { localStorage.setItem('doumiao:progress:v1', JSON.stringify(p)); } catch (e) {}
  }, FULL);
  await ctx.addInitScript(CURSOR);

  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('ERR', e.message));
  page.setDefaultTimeout(8000);
  const sleep = (ms) => page.waitForTimeout(ms);

  async function clickSel(sel, { hover = 420, settle = 700 } = {}) {
    const el = page.locator(sel).first();
    await el.waitFor({ state: 'visible' });
    const b = await el.boundingBox();
    if (!b) return false;
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 22 });
    await sleep(hover);
    await page.mouse.down();
    await sleep(70);
    await page.mouse.up();
    await sleep(settle);
    return true;
  }

  async function clickAt(x, y, settle = 600) {
    await page.mouse.move(x, y, { steps: 18 });
    await sleep(320);
    await page.mouse.down();
    await sleep(70);
    await page.mouse.up();
    await sleep(settle);
  }

  async function fadeNav(url, wait = 2500) {
    await page.evaluate(() => {
      const d = document.createElement('div');
      d.className = '__fade';
      document.body.appendChild(d);
      requestAnimationFrame(() => { d.style.opacity = '1'; });
    }).catch(() => {});
    await sleep(380);
    await page.goto(url, { waitUntil: 'load' });
    await sleep(wait);
  }

  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await sleep(3400);
  await page.mouse.move(640, 500, { steps: 10 });
  await sleep(400);

  await clickSel('#hero-go', { settle: 2600 });
  await sleep(600);
  await clickSel('.slide.is-active .deck-adv', { settle: 2000 });
  await clickSel('.slide.is-active .deck-adv', { settle: 2000 });

  await fadeNav(BASE + '/code-lab/lesson-01.html', 2400);
  await page.evaluate(() => {
    if (!window.__deckGo) return;
    for (let i = 0; i < 8; i++) {
      window.__deckGo(i);
      if (document.querySelector('.slide.is-active .code-run')) return;
    }
  });
  await sleep(1600);

  const cr = page.locator('.slide.is-active .code-run').first();
  const ta = cr.locator('textarea').first();
  await ta.scrollIntoViewIfNeeded().catch(() => {});
  await sleep(600);
  const tb = await ta.boundingBox();
  if (tb) {
    await page.mouse.move(tb.x + 140, tb.y + 40, { steps: 18 });
    await sleep(400);
    await page.mouse.down(); await sleep(60); await page.mouse.up();
    await sleep(500);
    await page.keyboard.press('Control+A');
    await sleep(250);
    await page.keyboard.type('print("南京" + " → " + "长江")', { delay: 95 });
    await sleep(700);
    const btn = cr.locator('button[data-act="run"]').first();
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await sleep(800);
    const bb = await btn.boundingBox();
    if (bb) await clickAt(bb.x + bb.width / 2, bb.y + bb.height / 2, 1000);
    await page.waitForFunction(() => {
      const o = document.querySelector('.slide.is-active .cr-out');
      return o && o.textContent && !/点「运行代码」/.test(o.textContent);
    }, null, { timeout: 6000 }).catch(() => {});
    await cr.locator('.cr-out').first().scrollIntoViewIfNeeded().catch(() => {});
    await sleep(3200);
  }

  await fadeNav(BASE + '/binary/quiz.html', 1800);
  const opts = page.locator('button.opt');
  if (await opts.count()) {
    const o2 = opts.nth(1);
    await o2.scrollIntoViewIfNeeded().catch(() => {});
    await sleep(900);
    const b2 = await o2.boundingBox();
    if (b2) await clickAt(b2.x + b2.width / 2, b2.y + b2.height / 2, 1800);
  }
  const nx = page.locator('button', { hasText: '下一题' }).first();
  if (await nx.count()) {
    await nx.scrollIntoViewIfNeeded().catch(() => {});
    await sleep(700);
    const bb = await nx.boundingBox();
    if (bb) await clickAt(bb.x + bb.width / 2, bb.y + bb.height / 2, 1800);
  }

  await fadeNav(BASE + '/achievements/index.html', 2400);
  await page.mouse.move(640, 420, { steps: 12 });
  await page.mouse.wheel(0, 320);
  await sleep(1200);
  await page.mouse.wheel(0, 320);
  await sleep(2200);

  await page.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    html,body{height:100%;margin:0;background:radial-gradient(1200px 700px at 78% 6%, #123C55 0%, #070D1A 58%),#070D1A;
      font-family:"Noto Sans CJK SC","Microsoft YaHei",sans-serif;color:#fff;overflow:hidden}
    .wrap{height:100%;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding-left:120px;box-sizing:border-box}
    .bar{width:6px;height:180px;background:#22D3EE;position:absolute;left:96px;top:250px}
    .kicker{color:#22D3EE;font-size:17px;letter-spacing:2px;margin-bottom:22px;font-weight:700}
    h1{font-size:46px;line-height:1.55;margin:0 0 26px;font-weight:800;letter-spacing:1px}
    .sub{color:#9FB6CC;font-size:20px;margin-bottom:34px}
    .url{display:inline-block;align-self:flex-start;border:1px solid #2A6A8A;background:rgba(15,44,70,.85);color:#22D3EE;
      padding:14px 30px;border-radius:14px;font-size:20px;letter-spacing:.5px}
    .stat{position:absolute;right:130px;bottom:64px;display:flex;gap:56px;text-align:center;color:#9FB6CC;font-size:14px}
    .stat b{display:block;color:#22D3EE;font-size:38px;font-weight:800;margin-bottom:6px}
  </style></head><body>
    <div class="bar"></div>
    <div class="wrap">
      <div class="kicker">河海大学网页设计大赛 · 静态网页组参赛作品</div>
      <h1>让每个孩子，<br>都能在自己城市的江面上，<br>看见科技的光。</h1>
      <div class="sub">豆苗学堂 · 少儿 AI 与计算机科普学习站</div>
      <div class="url">wbydxx.github.io/doumiao-academy</div>
    </div>
    <div class="stat">
      <div><b>40</b>页面</div><div><b>6</b>大关卡</div><div><b>25</b>课时</div><div><b>0</b>依赖</div>
    </div>
  </body></html>`);
  await sleep(4800);

  await ctx.close();
  await browser.close();

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webm'));
  console.log('video:', files.map(f => dir + '/' + f));
})();
