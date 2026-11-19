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
  // ---- Rocket pack comes off (F), mid-air it opens a parachute
  await E(() => { __NC.cheat('HOMEBASE'); if (!__NC.player.jet) __NC.cheat('SKYPACK'); const P = __NC.player; P.x += 300; P.z = __NC.groundH(P.x, P.y); });
  await wait(300); await p.keyboard.press('f'); await wait(600);
  check('F takes the rocket pack off', await E(() => !__NC.player.jet));
  await E(() => { __NC.cheat('SKYPACK'); __NC.player.z = 450; }); await wait(300); await p.keyboard.press('f'); await wait(600);
  check('pack off mid-air opens a parachute', await E(() => !__NC.player.jet && __NC.player.para));
  await until(() => !__NC.player.para, 20000);
  // ---- Undo cheats
  await E(() => { __NC.cheat('IRONSKIN'); __NC.cheat('NITROUS'); __NC.cheat('STORMY'); });
  const act = await E(() => __NC.activeCheats());
  check('active cheats are listed', ['IRONSKIN', 'NITROUS', 'STORMY'].every(k => act.includes(k)), JSON.stringify(act));
  check('same code switches a cheat off', await E(() => { __NC.cheat('NITROUS'); return !__NC.activeCheats().includes('NITROUS'); }));
  const nc = await E(() => __NC.cheat('NOCHEATS'));
  check('NOCHEATS turns everything off', (await E(() => __NC.activeCheats())).length === 0, nc);
  // ---- Map pin + GPS route
  await E(() => { __NC.cheat('HOMEBASE'); }); await wait(300);
  await p.keyboard.press('Tab'); await wait(300);
  await E(() => { __NC.MV.z = 1; }); const mp = await E(() => { const [a, b] = __NC.mapToS(5200, 900); return { a, b }; });
  await p.mouse.click(mp.a, mp.b); await wait(300);
  const pin = await E(() => ({ pin: __NC.G.pin, road: __NC.route && __NC.route.road, n: __NC.route && __NC.route.pts.length }));
  check('clicking the map drops a pin with a road route', !!pin.pin && pin.road && pin.n > 3, JSON.stringify({ n: pin.n }));
  const z0 = await E(() => __NC.MV.z);
  await p.mouse.move(640, 380); for (let k = 0; k < 3; k++) { await p.mouse.wheel(0, -100); await wait(150); } await wait(200);
  const z1 = await E(() => __NC.MV.z);
  check('mouse wheel zooms the map in', z1 > z0 * 2.2, z0.toFixed(2) + ' → ' + z1.toFixed(2));
  const c0 = await E(() => [__NC.MV.cx, __NC.MV.cy]);
  await p.mouse.move(640, 380); await p.mouse.down(); await p.mouse.move(520, 300, { steps: 5 }); await p.mouse.up(); await wait(200);
  const c1 = await E(() => [__NC.MV.cx, __NC.MV.cy]);
  check('dragging pans the zoomed map (no pin moved)', c1[0] > c0[0] && c1[1] > c0[1] && await E(() => Math.hypot(__NC.G.pin.x - 5200, __NC.G.pin.y - 900) < 60), JSON.stringify([c0.map(Math.round), c1.map(Math.round)]));
  await p.mouse.click(1250, 116); await wait(200);
  check('− button zooms out', (await E(() => __NC.MV.z)) < z1);
  await E(() => { __NC.MV.z = 1; });
  await p.mouse.click(4, 700); await wait(200);
  check('clicking outside closes the map', await E(() => !__NC.G.bigMap));
  await E(() => { const P = __NC.player; P.x = 5200 - 60; P.y = 900; }); 
  check('pin clears on arrival', await until(() => !__NC.G.pin, 6000));
  // ---- Rooftop walking animates; ground matches rendered terrain
  const roof = await E(() => { for (let x = 300; x < 6000; x += 37) for (let y = 300; y < 6000; y += 41) { const h = __NC.roofAt(x, y); if (h > 60 && __NC.roofAt(x + 50, y) === h && __NC.roofAt(x - 50, y) === h) return { x, y, h }; } return null; });
  check('found a rooftop to walk on', !!roof);
  await p.evaluate(r => { const P = __NC.player; P.x = r.x - 40; P.y = r.y; P.z = r.h; P.vz = 0; P.a = 0; __NC.setYaw(0); }, roof);
  await p.keyboard.down('w'); const legs = new Set();
  for (let k = 0; k < 6; k++) { await wait(150); legs.add((await E(() => __NC.playerMesh.userData.thighs[0].rotation.z)).toFixed(2)); }
  await p.keyboard.up('w');
  check('walking on a rooftop animates (no sliding)', legs.size > 2 && await p.evaluate(r => Math.abs(__NC.player.z - r.h) < 2, roof), [...legs].join(','));
  const terr = await E(() => { const { Hgrid, MAPX0, TG, TN } = __NC; let worst = 0;
    for (let k = 0; k < 3000; k++) { const x = MAPX0 + 400 + Math.random() * 9000, y = MAPX0 + 400 + Math.random() * 9000, gx = (x - MAPX0) / TG, gy = (y - MAPX0) / TG, i = Math.floor(gx), j = Math.floor(gy), fx = gx - i, fy = gy - j;
      const A = Hgrid[j * TN + i], B = Hgrid[j * TN + i + 1], C = Hgrid[(j + 1) * TN + i], D = Hgrid[(j + 1) * TN + i + 1];
      const mesh = fx >= fy ? A + (B - A) * fx + (D - B) * fy : A + (C - A) * fy + (D - C) * fx; // triangles (i,j)(i+1,j+1)(i+1,j) / (i,j)(i,j+1)(i+1,j+1)
      worst = Math.max(worst, Math.abs(mesh - __NC.terrainH(x, y))); } return worst; });
  check('ground height matches the drawn terrain', terr < 1e-3, terr.toFixed(5));
  // ---- Character creator
  await E(() => { __NC.G.state = 'play'; }); await p.keyboard.press('Escape'); await wait(300);
  await p.click('#btnChar2'); await wait(800);
  check('creator opens from pause', await E(() => __NC.G.state === 'creator'));
  await p.click('#ccRows .ccChip:text-is("Woman")'); await p.click('#ccRows .ccChip:text-is("Ponytail")'); await wait(500);
  await p.fill('#ccName', 'Nova'); await p.click('#ccDone'); await wait(300);
  check('look is saved', await E(() => { const L = JSON.parse(localStorage.getItem('neoncoast.look')); return L.fem && L.hairStyle === 'ponytail' && L.name === 'Nova'; }));
  await p.click('#btnResume'); await wait(300);
  // ---- v10: car speeds by model, connected cities, weapons, police helicopter
  const tops = await E(() => ['van', 'sedan', 'police', 'sport', 'gt', 'super'].map(k => Math.round(__NC.CARTYPES[k].max * .35)));
  check('top speed depends on the car (van → supercar), max 185 km/h', tops.every((v, i) => !i || v > tops[i - 1]) && tops[5] <= 185, tops.join(' < '));
  for (const code of ['BLUFFS', 'COPPER', 'NORTHGATE']) {
    await p.evaluate(c => __NC.cheat(c), code); await wait(400);
    check('teleport into ' + code, await p.evaluate(c => { const C = __NC.SATS.find(q => q.code === c), P = __NC.player; return Math.abs(P.x - C.x) < C.half && Math.abs(P.y - C.y) < C.half && Math.abs(P.z - C.h) < 8; }, code));
  }
  check('city streets join the highway route network', await E(() => { const C = __NC.SATS[0]; __NC.cheat('HOMEBASE'); __NC.setPin(C.x + 10, C.y + 10); return !!__NC.route && __NC.route.road; }));
  await E(() => __NC.cheat('HOMEBASE')); await wait(300);
  await E(() => __NC.cheat('LOCKNLOAD'));
  await p.keyboard.press('7'); await wait(300);
  check('number key 7 picks the rocket launcher', await E(() => __NC.WEAPONS[__NC.player.weapon].id === 'rpg'));
  await p.keyboard.press('6'); await wait(300); await E(() => { __NC.mouse.aim = true; }); await wait(400);
  check('sniper rifle zooms into a scope', await E(() => __NC.isScoped()));
  await E(() => { __NC.mouse.aim = false; });
  await E(() => { const P = __NC.player; P.x = 3 * 480; P.y = 2 * 480 + 60; P.z = 0; P.a = Math.PI / 2; for (const q of __NC.peds) if (Math.hypot(q.x - P.x, q.y - P.y) < 800) q.x += 6000; for (const c of __NC.cars) if (c !== P.car && Math.hypot(c.x - P.x, c.y - P.y) < 400) c.x += 6000; P.weapon = 6; __NC.setYaw(P.a); const c = __NC.makeCar('sedan', P.x, P.y + 200, P.a, {}); c.target = true; window.__tc = c; });
  await wait(400); await E(() => { __NC.G.fireCd = 0; __NC.shoot(); });
  check('rocket launcher wrecks a car', await until(() => window.__tc.hp <= 0 || window.__tc.dead, 8000), JSON.stringify(await E(() => ({ hp: Math.round(window.__tc.hp) }))));
  await E(() => { __NC.cheat('MOSTWANTED'); const P = __NC.player, h = __NC.spawnCopHeli(P.x, P.y); h.x = P.x + 450; h.y = P.y; });
  check('police helicopter flies the chase', await until(() => { const h = __NC.cars.find(c => c.ai === 'copheli'), P = __NC.player; return h && h.z - __NC.groundH(h.x, h.y) > 80 && Math.hypot(h.x - P.x, h.y - P.y) < 400; }, 45000));
  await E(() => { const h = __NC.cars.find(c => c.ai === 'copheli'), P = __NC.player; h.hp = 1; h.x = P.x + 200; h.y = P.y; window.__h = h; P.weapon = 4; });
  for (let k = 0; k < 12 && !(await E(() => window.__h.hp <= 0)); k++) { await E(() => { const h = window.__h, P = __NC.player; P.a = Math.atan2(h.y - P.y, h.x - P.x); __NC.setYaw(P.a); __NC.G.fireCd = 0; __NC.shoot(); }); await wait(300); }
  check('the helicopter can be shot down', await E(() => window.__h.hp <= 0 || window.__h.ai !== 'copheli'));
  await E(() => { __NC.cheat('CLEANRECORD'); });
  // ---- v10.5: bikes, aiming while firing
  const bikeTops = await E(() => ['bicycle', 'scooter', 'adventure', 'sportbike'].map(k => Math.round(__NC.CARTYPES[k].max * .35)));
  check('bike top speeds: bicycle < scooter < adventure < sports', bikeTops.every((v, i) => !i || v > bikeTops[i - 1]), bikeTops.join(' < '));
  for (const [code, type] of [['PEDALS', 'bicycle'], ['SCOOTY', 'scooter'], ['DIRTTRAIL', 'adventure'], ['SUPERBIKE', 'sportbike']]) {
    await E(() => __NC.cheat('HOMEBASE')); await wait(200);
    await p.evaluate(c => __NC.cheat(c), code); await wait(300);
    const rode = await p.evaluate(t => { const P = __NC.player, c = __NC.cars.filter(q => q.type === t && !q.dead).sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y))[0]; if (!c) return false; __NC.enterCar(c); return __NC.player.car === c; }, type);
    await p.keyboard.down('w'); const moving = rode && await until(() => !!__NC.player.car && Math.hypot(__NC.player.car.vx, __NC.player.car.vy) > 5, 8000); await p.keyboard.up('w');
    check('ride the ' + type, moving);
    await E(() => { const c = __NC.player.car; if (c) { c.vx = c.vy = 0; } }); await p.keyboard.press('f'); await wait(250);
  }
  await E(() => { const P = __NC.player; let sx = 0, sy = 0; outer: for (let y = 200; y < 6000; y += 37) for (let x = 100; x < 6000; x += 5) { if (__NC.roofAt(x, y) > 0) { let free = true; for (let d = 10; d <= 120; d += 10) if (__NC.roofAt(x - d, y) > 0) free = false; if (free) { sx = x - 110; sy = y; break outer; } } } P.x = sx; P.y = sy; const c = __NC.makeCar('sportbike', sx, sy, 0, { persist: true }); __NC.enterCar(c); c.x = sx; c.y = sy; c.a = 0; c.vx = 480; c.vy = 0; });
  check('crashing a bike into a wall throws you off', await until(() => !__NC.player.car, 8000));
  await until(() => !(__NC.player.knockT > 0), 8000);
  await p.mouse.click(640, 360); await wait(300);
  await p.mouse.down({ button: 'right' }); await wait(200); await p.mouse.down({ button: 'left' }); await wait(200);
  const af = await E(() => ({ aim: __NC.mouse.aim, fire: __NC.mouse.fire, locked: __NC.mouse.locked }));
  await p.mouse.up({ button: 'left' }); await p.mouse.up({ button: 'right' }); await wait(200);
  check('left click fires while right click aims', af.aim && af.fire, JSON.stringify(af));
  // ---- v10.6: cheats by category, bikes lean into turns
  check('every cheat has a category', await E(() => __NC.CHEATS.every(c => __NC.CHEAT_CATS.some(k => k[0] === c[2])) && __NC.CHEATS.length >= 47));
  await p.keyboard.press('Escape'); await wait(400); await p.click('#btnCheats'); await wait(300);
  const heads = await p.$$eval('.cheatHead', els => els.length);
  await p.evaluate(() => [...document.querySelectorAll('#cheatTabs .ccChip')].find(b => b.textContent.includes('Teleport')).click()); await wait(200);
  const tele = await p.$$eval('#cheatList button b', els => els.map(e => e.textContent));
  await p.fill('#cheatInput', 'bike'); await wait(200);
  const found = await p.$$eval('#cheatList button b', els => els.map(e => e.textContent));
  check('cheat list is grouped, with tabs and search', heads >= 10 && tele.length === 9 && tele.includes('NORTHGATE') && found.includes('SUPERBIKE') && found.includes('DIRTTRAIL'), JSON.stringify({ heads, tele: tele.length, found }));
  await p.fill('#cheatInput', ''); await p.click('#cheatBack'); await wait(200); await p.click('#btnResume'); await wait(300);
  await E(() => { const P = __NC.player; P.x = 1464; P.y = 1000; const c = __NC.makeCar('sportbike', 1464, 1000, Math.PI / 2, { persist: true }); __NC.enterCar(c); c.vx = 0; c.vy = 300; window.__lb = c; });
  await p.keyboard.down('w'); await p.keyboard.down('d');
  const leanOk = await until(() => { const c = window.__lb, m = __NC.carMesh(c); return m && c.steerS > .15 && m.userData.leanV > .03; }, 10000);
  await p.keyboard.up('d'); await p.keyboard.up('w');
  check('bikes lean into the turn', leanOk, JSON.stringify(await E(() => { const c = window.__lb, m = __NC.carMesh(c); return { steer: +(c.steerS || 0).toFixed(2), lean: m && +m.userData.leanV.toFixed(2) }; })));
  await E(() => { const c = __NC.player.car; if (c) { c.vx = c.vy = 0; } }); await p.keyboard.press('f'); await wait(300);
  // ---- v10.7: Esc returns to the game from pause and the cheats panel (applying a typed code)
  await E(() => __NC.press('pause')); await wait(500); await p.click('#btnCheats'); await wait(300);
  const cashEsc = await E(() => __NC.G.cash);
  await p.fill('#cheatInput', 'payday'); await p.focus('#cheatInput'); await p.keyboard.press('Escape'); await wait(400);
  check('Esc in the cheats panel applies the typed code and resumes', await p.evaluate(c0 => __NC.G.state === 'play' && __NC.G.cash >= c0 + 250000 && document.getElementById('cheats').classList.contains('hidden'), cashEsc));
  // ---- v10.8: jump (Space on foot; it no longer shoots)
  await E(() => { const P = __NC.player; P.x = 1440; P.y = 1100; P.z = 0; window.__jz = 0; window.__ja = __NC.G.am.pistol; const f = () => { window.__jz = Math.max(window.__jz, __NC.player.z); requestAnimationFrame(f); }; f(); });
  await wait(300); await p.keyboard.press('Space');
  const jumped = await until(() => window.__jz > 6, 8000);
  const landed = await until(() => __NC.player.z < .5, 8000);
  check('Space jumps on foot and lands, without firing', jumped && landed && await E(() => __NC.G.am.pistol === window.__ja), JSON.stringify(await E(() => ({ peak: +window.__jz.toFixed(1) }))));
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
