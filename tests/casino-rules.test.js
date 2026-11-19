// Casino rules test: run with `node tests/casino-rules.test.js` (no dependencies)
const assert = require('assert');
const fs = require('fs'), path = require('path'), vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.slice(html.indexOf('// ================================================================ casino: card rules'), html.indexOf('// ================================================================ casino: interior scene'));
const sandbox = { Math, module: { exports: {} } };
vm.runInNewContext(src + '\nmodule.exports = { newShoe, bacVal, bacTotal, bankerDraws, baccaratRound, baccaratPayout, bjTotal, bjNatural, bjSettle, slotSpin, slotMultiplier, SLOT_SYMS, SLOT_W, SLOT_PAY };', sandbox);
const R = sandbox.module.exports;
let pass = 0; const ok = (c, m) => { assert(c, m); pass++; };
const C = r => ({ r, s: 0 });
// 1. card values & totals
ok(R.bacVal(C(1)) === 1 && R.bacVal(C(9)) === 9 && [10, 11, 12, 13].every(r => R.bacVal(C(r)) === 0), 'baccarat card values');
ok(R.bacTotal([C(7), C(8)]) === 5 && R.bacTotal([C(13), C(9)]) === 9 && R.bacTotal([C(5), C(5)]) === 0, 'baccarat totals mod 10');
// 2. banker tableau vs the official Punto Banco table
const ref = (b, p3) => p3 === null ? b <= 5 : b <= 2 ? true : b === 3 ? p3 !== 8 : b === 4 ? (p3 >= 2 && p3 <= 7) : b === 5 ? (p3 >= 4 && p3 <= 7) : b === 6 ? (p3 === 6 || p3 === 7) : false;
for (let b = 0; b <= 7; b++) { ok(R.bankerDraws(b, null) === ref(b, null), `banker ${b} after player stands`); for (let p3 = 0; p3 <= 9; p3++) ok(R.bankerDraws(b, p3) === ref(b, p3), `banker ${b} vs p3 ${p3}`); }
// 3. scripted deals: naturals, player stands on 6-7, banker draws
const deal = cards => { let i = 0; return () => C(cards[i++]); };
let r = R.baccaratRound(deal([4, 3, 4, 2])); ok(r.P.length === 2 && r.B.length === 2 && r.winner === 'player', 'player natural 8 stands');
r = R.baccaratRound(deal([3, 1, 3, 2, 5, 9])); ok(r.P.length === 2 && r.B.length === 3, 'player 6 stands, banker 3 draws');
r = R.baccaratRound(deal([2, 3, 1, 1, 8, 9])); ok(r.P.length === 3 && r.B.length === 2 && r.pt === 1, 'banker 4 stands vs player third 8');
// 4. payouts
ok(R.baccaratPayout(100, 'player', 'player') === 200 && R.baccaratPayout(100, 'banker', 'banker') === 195 && R.baccaratPayout(100, 'tie', 'tie') === 900, 'win payouts');
ok(R.baccaratPayout(100, 'player', 'tie') === 100 && R.baccaratPayout(100, 'banker', 'player') === 0, 'push on tie, loss');
// 5. Monte Carlo against known odds (8 decks): banker 45.86%, player 44.62%, tie 9.52%; house edge banker 1.06%, player 1.24%
let shoe = R.newShoe(8); const draw = () => { if (shoe.length < 20) shoe = R.newShoe(8); return shoe.pop(); };
const N = 2e6; const w = { player: 0, banker: 0, tie: 0 }; let retB = 0, retP = 0;
for (let k = 0; k < N; k++) { const x = R.baccaratRound(draw); w[x.winner]++; retB += R.baccaratPayout(1, 'banker', x.winner); retP += R.baccaratPayout(1, 'player', x.winner); }
const pct = v => (100 * v / N);
console.log('baccarat %', pct(w.banker).toFixed(2), pct(w.player).toFixed(2), pct(w.tie).toFixed(2), ' house edge banker', (100 - pct(retB)).toFixed(2), 'player', (100 - pct(retP)).toFixed(2));
ok(Math.abs(pct(w.banker) - 45.86) < .15 && Math.abs(pct(w.player) - 44.62) < .15 && Math.abs(pct(w.tie) - 9.52) < .1, 'win frequencies match published odds');
ok(Math.abs((100 - pct(retB)) - 1.06) < .2 && Math.abs((100 - pct(retP)) - 1.24) < .2, 'house edge matches published values');
// 6. blackjack
ok(R.bjTotal([C(1), C(13)]) === 21 && R.bjNatural([C(1), C(12)]), 'ace + face is a natural');
ok(R.bjTotal([C(1), C(1), C(9)]) === 21 && R.bjTotal([C(1), C(1), C(1)]) === 13 && R.bjTotal([C(10), C(9), C(5)]) === 24, 'soft/hard totals');
ok(R.bjSettle(100, [C(1), C(13)], [C(10), C(9)]) === 250, 'blackjack pays 3:2');
ok(R.bjSettle(100, [C(1), C(13)], [C(1), C(10)]) === 100, 'both naturals push');
ok(R.bjSettle(100, [C(10), C(9)], [C(1), C(11)]) === 0, 'dealer natural wins');
ok(R.bjSettle(100, [C(10), C(5), C(9)], [C(10), C(6), C(10)]) === 0, 'player bust loses even if dealer busts');
ok(R.bjSettle(100, [C(10), C(8)], [C(10), C(6), C(10)]) === 200 && R.bjSettle(100, [C(10), C(8)], [C(10), C(8)]) === 100, 'dealer bust / push');
// 7. slots: exact return to player from the reel weights
const tot = R.SLOT_W.reduce((a, b) => a + b, 0), P = R.SLOT_W.map(x => x / tot); let rtp = 0;
for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) for (let c = 0; c < 6; c++) rtp += P[a] * P[b] * P[c] * R.slotMultiplier([R.SLOT_SYMS[a], R.SLOT_SYMS[b], R.SLOT_SYMS[c]]);
console.log('slots RTP', (rtp * 100).toFixed(2) + '%');
ok(rtp > .85 && rtp < .97, 'slots pay back 85-97%');
ok(R.slotMultiplier(['7', '7', '7']) === 250 && R.slotMultiplier(['🍒', '🍒', '🍋']) === 2 && R.slotMultiplier(['🍋', '🔔', '7']) === 0, 'slot paytable');
console.log('ALL', pass, 'ASSERTIONS PASSED');
