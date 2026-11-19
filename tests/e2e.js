// End-to-end playthrough: node tests/e2e.js [screenshotDir]
// Needs Playwright + Chromium and a local server on :8765 (python3 -m http.server 8765)
const { chromium, devices } = require('playwright');
const OUT = process.argv[2] || '.';
const results = [];
const check = (name, cond, info = '') => { results.push([cond ? 'PASS' : 'FAIL', name, info]); console.log(cond ? 'PASS' : 'FAIL', name, info); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { try { if (!sessionStorage.getItem('e2e')) { localStorage.clear(); sessionStorage.setItem('e2e', '1'); } localStorage.setItem('neoncoast.gfx', 'low'); } catch (e) { } });
  await p.goto('http://localhost:8765/index.html'); await p.waitForSelector('#btnPlay');
  await p.click('#btnPlay'); await p.waitForTimeout(2000);
  const E = f => p.evaluate(f);
  const wait = ms => p.waitForTimeout(ms);
  const until = async (fn, ms = 20000, arg) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(fn, arg)) return true; await wait(250); } return false; };
  const talkThrough = async () => { for (let k = 0; k < 20 && await E(() => __NC.G.state === 'talk'); k++) { const choice = await p.$('#dlgChoices button'); if (choice) return; await p.click('#dialog'); await wait(120); } };
  const storyAt = () => E(() => __NC.G.storyIdx);
  const startNextStory = async () => {
    await E(() => { const N = __NC; const g = ['mama', 'benny', 'mama', 'benny', 'hale', 'isla', 'isla', 'mama', 'mama'][N.G.storyIdx]; const P = { mama: N.places.home, benny: N.places.respray, hale: N.places.police, isla: N.places.casino }[g]; N.G.storyCd = 0; N.player.x = P.x + (g === 'benny' ? 0 : 34); N.player.y = g === 'benny' ? P.y - 70 : P.y + 4; });
    const opened = await until(() => __NC.G.state === 'talk', 8000);
    await talkThrough();
    return opened && await until(() => !!__NC.G.mission && __NC.G.mission.story, 6000);
  };
  const finishCheck = async (idx) => {
    const ok = await until(i => __NC.G.storyIdx > i, 25000, idx);
    if (ok) { await until(() => __NC.G.state === 'talk', 6000); await talkThrough(); await until(() => __NC.G.state === 'play' || __NC.G.state === 'casino', 6000); }
    return ok && (await storyAt()) > idx;
  };
  const leaveCar = async () => { await talkThrough(); await until(() => __NC.G.state === 'play', 6000); if (await E(() => !!__NC.player.car)) { await p.keyboard.press('f'); await wait(500); } };

  // ---- Story 1: Welcome Home
  check('story 1 starts', await startNextStory());
  await p.screenshot({ path: OUT + '/e1-story-dialog.png' });
  await E(() => { const N = __NC, c = N.cars.find(c => c.type === 'super' && c.persist && !c.dead); N.player.x = c.x; N.player.y = c.y + 26; });
  await p.keyboard.press('f'); await wait(400);
  await E(() => { const N = __NC, c = N.player.car; c.x = N.places.respray.x + 20; c.y = N.places.respray.y; c.vx = c.vy = 0; });
  check('story 1 complete', await finishCheck(0));
  await leaveCar();
  // ---- Story 2: Paint It Gold (steal + deliver)
  check('story 2 starts', await startNextStory());
  await E(() => { const N = __NC, c = N.G.mission.car; N.player.x = c.x; N.player.y = c.y + 26; });
  await wait(300); await p.keyboard.press('f'); await wait(500);
  check('stole the gold GT', await E(() => __NC.player.car === __NC.G.mission.car));
  await E(() => { const N = __NC, c = N.player.car; c.x = N.places.respray.x + 15; c.y = N.places.respray.y; c.vx = c.vy = 0; });
  check('story 2 complete', await finishCheck(1));
  await leaveCar();
  // ---- Story 3: Turf Talk (crew + 6 vipers)
  check('story 3 starts', await startNextStory());
  await E(() => __NC.cheat('CREWUP')); await wait(800);
  check('crew recruited stage', await until(() => __NC.G.mission && __NC.G.mission.stage === 1, 6000));
  await E(() => { const N = __NC; for (let k = 0; k < 6; k++) { const v = N.peds.find(q => q.gang === 'vipers' && q.state !== 'dead'); if (v) N.hurt(v, 999); else N.G.stats.vipers++; } });
  check('story 3 complete', await finishCheck(2));
  // ---- Story 4: Hot Laps (race)
  check('story 4 starts', await startNextStory());
  await E(() => { const N = __NC, c = N.makeCar('sport', N.player.x + 30, N.player.y, 0, { persist: true }); N.player.x = c.x; N.player.y = c.y + 26; });
  await p.keyboard.press('f'); await wait(400);
  for (let k = 0; k < 7; k++) { await E(() => { const N = __NC, m = N.G.mission; if (!m || !N.player.car) return; N.player.car.x = m.tx; N.player.car.y = m.ty; N.player.car.vx = N.player.car.vy = 0; }); await wait(700); }
  check('story 4 complete', await finishCheck(3));
  await leaveCar();
  // ---- Story 5: Evidence (destroy van)
  check('story 5 starts', await startNextStory());
  check('evidence van spawned', await E(() => !!__NC.G.mission.car));
  await E(() => { const c = __NC.G.mission.car; c.hp = -1; c.burn = .05; });
  check('story 5 complete', await finishCheck(4));
  await E(() => __NC.cheat('CLEANRECORD'));
  // ---- Story 6: High Stakes (casino, real baccarat UI)
  check('story 6 starts', await startNextStory());
  await E(() => { __NC.cheat('LUCKYSTREAK'); __NC.enterCasino(); });
  await wait(1500);
  check('inside casino', await E(() => __NC.G.state === 'casino' && __NC.G.inCasino));
  await p.screenshot({ path: OUT + '/e2-casino.png' });
  await E(() => { const G = __NC.G; G.cas.x = -200; G.cas.z = -20; });
  await wait(500); await p.keyboard.press('f'); await wait(500);
  check('baccarat table opens', await E(() => __NC.G.state === 'table' && __NC.table && __NC.table.kind === 'baccarat'));
  const cash0 = await E(() => __NC.G.cash);
  await p.click('#tblActions button:first-child'); await wait(4500);
  await p.screenshot({ path: OUT + '/e3-baccarat.png' });
  const status = await p.textContent('#tblStatus');
  check('baccarat round resolves', /WINS|TIE/.test(status), status);
  check('baccarat paid out', (await E(() => __NC.G.cash)) !== cash0);
  await p.click('#tblLeave'); await wait(300);
  // blackjack + slots
  await E(() => { const G = __NC.G; G.cas.x = 30; G.cas.z = -80; }); await wait(400); await p.keyboard.press('f'); await wait(400);
  check('blackjack opens', await E(() => __NC.table && __NC.table.kind === 'blackjack'));
  await p.click('#tblActions button:first-child'); await wait(600);
  const stand = await p.$('#tblActions button:nth-child(2)'); if (stand && await stand.isEnabled()) await stand.click();
  await wait(3500);
  check('blackjack resolves', /win|lose|Push|Bust|Blackjack/i.test(await p.textContent('#tblStatus')), await p.textContent('#tblStatus'));
  await p.click('#tblLeave'); await wait(300);
  await E(() => { const G = __NC.G; G.cas.x = 260 - 22; G.cas.z = -90; }); await wait(400); await p.keyboard.press('f'); await wait(400);
  check('slots open', await E(() => __NC.table && __NC.table.kind === 'slots'));
  await p.click('#tblActions button:first-child'); await wait(2000);
  check('slots resolve', /win|luck/i.test(await p.textContent('#tblStatus')), await p.textContent('#tblStatus'));
  await p.click('#tblLeave'); await wait(300);
  check('story 6 complete (after leaving)', await (async () => { await E(() => { const G = __NC.G; G.cas.x = 0; G.cas.z = 400; }); await wait(800); return finishCheck(5); })());
  check('back outside', await E(() => __NC.G.state === 'play' && !__NC.G.inCasino));
  // ---- Story 7: Island Run (boat)
  check('story 7 starts', await startNextStory());
  await E(() => { const N = __NC, c = N.cars.find(c => c.type === 'boat' && c.x < N.ISL.x - 1500); N.player.x = c.x; N.player.y = c.y - 40; N.player.z = 3.4; });
  await wait(300); await p.keyboard.press('f'); await wait(400);
  check('in a speedboat', await E(() => __NC.player.car && __NC.player.car.type === 'boat'));
  const bx0 = await E(() => __NC.player.car.x);
  await p.keyboard.down('w'); await wait(4000); await p.keyboard.up('w');
  const boat = await E(() => ({ x: __NC.player.car.x, z: __NC.player.car.z }));
  check('boat moves on water', boat.x !== bx0 && boat.z === -3, JSON.stringify(boat));
  await p.screenshot({ path: OUT + '/e4-boat.png' });
  await leaveCar();
  await E(() => { const N = __NC; N.player.x = N.ISL.x - 150; N.player.y = N.ISL.y - 180; N.player.z = 10; });
  check('story 7 complete', await finishCheck(6));
  await E(() => { const N = __NC; N.player.x = N.ISL.x - 60; N.player.y = N.ISL.y + 120; }); await wait(1500);
  await p.screenshot({ path: OUT + '/e5-island.png' });
  // ---- Story 8: Wings of the Viper
  await E(() => __NC.cheat('HOMEBASE')); await wait(300);
  check('story 8 starts', await startNextStory());
  await E(() => { const c = __NC.G.mission.car; c.hp = -1; c.burn = .05; });
  check('story 8 complete', await finishCheck(7));
  // ---- Story 9: Kings of the Coast (boss)
  check('story 9 starts', await startNextStory());
  await E(() => { const N = __NC, bo = N.G.mission.boss; N.hurt(bo, 9999); });
  check('story 9 complete (THE END)', await finishCheck(8));
  check('story finished', (await storyAt()) === 9);
  // ---- Dating
  await E(() => __NC.cheat('HOMEBASE')); await wait(200);
  await E(() => { const N = __NC, q = N.peds.find(q => q.date === 'sofia'); N.player.x = q.x + 20; N.player.y = q.y; N.player.z = 0; });
  await wait(600); await p.keyboard.press('g'); await wait(500);
  check('talk dialog with Sofia', await E(() => __NC.G.state === 'talk'));
  await p.screenshot({ path: OUT + '/e6-date-talk.png' });
  await p.click('#dlgChoices button:first-child'); await wait(400); await talkThrough();
  check('affection increased', await E(() => (__NC.G.aff.sofia || 0) >= 10), await E(() => JSON.stringify(__NC.G.aff)));
  await E(() => __NC.cheat('CHARMER')); await wait(200); await p.keyboard.press('g'); await wait(500);
  const btns = await p.$$eval('#dlgChoices button', bs => bs.map(b => b.textContent));
  const di = btns.findIndex(t => /date/i.test(t)); check('date option offered', di >= 0, btns.join(' | '));
  if (di >= 0) { await p.click(`#dlgChoices button:nth-child(${di + 1})`); await wait(300); await talkThrough(); }
  check('date started', await E(() => !!__NC.G.date));
  await E(() => { const N = __NC, d = N.G.date, q = d.p; N.player.x = d.dest.x; N.player.y = d.dest.y + 20; q.x = d.dest.x + 15; q.y = d.dest.y + 20; });
  check('date completes at destination', await until(() => !__NC.G.date, 12000));
  await talkThrough();
  // ---- New cheats
  for (const code of ['GOLDRUSH', 'STORMY', 'SUNSHINE', 'PINKRIDE', 'TIMEWARP', 'PARADISE', 'SPEEDBOAT', 'HIGHROLLER', 'SKYPACK', 'SKYPACK', 'CHOPPER']) {
    const r = await p.evaluate(c => __NC.cheat(c), code); check('cheat ' + code, !!r, r); await wait(150);
  }
  // ---- Save / reload persistence
  await E(() => { __NC.G.saveT = 99; }); await wait(1200);
  const before = await E(() => ({ story: __NC.G.storyIdx, cash: Math.floor(__NC.G.cash) }));
  await p.reload(); await p.waitForSelector('#btnPlay');
  check('menu offers CONTINUE', (await p.textContent('#btnPlay')).includes('CONTINUE'));
  await p.click('#btnPlay'); await wait(1500);
  const after = await E(() => ({ story: __NC.G.storyIdx, cash: Math.floor(__NC.G.cash) }));
  check('progress persists after reload', after.story === before.story && after.cash > 0, JSON.stringify([before, after]));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  const fails = results.filter(r => r[0] === 'FAIL');
  console.log(`\n${results.length - fails.length}/${results.length} checks passed`);
  process.exit(fails.length ? 1 : 0);
})();
