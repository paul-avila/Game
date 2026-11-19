# Neon Coast: final review and audit

Scope: everything in this repository (`index.html` game, `sw.js` offline cache, `manifest.webmanifest`, icons, bundled `three.min.js`), reviewed before delivery of the story/casino/dating/boats/island update.

## How it was checked

| Check | Tool | Result |
|---|---|---|
| Undefined variables, duplicate keys, unreachable code, unused code | ESLint 8 (`no-undef`, `no-dupe-keys`, `no-unreachable`, `no-redeclare`, `no-unused-vars`) on the full game script | **0 errors, 0 warnings** (8 dead-code warnings found and removed) |
| Casino rules | `tests/casino-rules.test.js` (106 assertions) | **All pass** |
| Baccarat odds | 2,000,000 simulated 8-deck hands vs published odds | Banker 45.83% / Player 44.66% / Tie 9.52% (published 45.86 / 44.62 / 9.52); house edge Banker 1.12%, Player 1.17% (published 1.06 / 1.24, within simulation noise) |
| Slots payback | Exact calculation from reel weights | 91.75% |
| Full playthrough | `tests/e2e.js` (headless Chromium, laptop layout) | **52/52 pass** |
| Phone layout | Playwright Pixel 7 emulation | touch buttons, joystick, TALK/PLAY context button, dialogue taps |
| Content and safety | Source search | see "Safety and content" below |

## Playthrough (tests/e2e.js)

**52 of 52 checks pass** (final run, headless Chromium, laptop layout, no page errors):

- **Story:** all 9 missions start from their ★ marker, play through their dialogue, complete, and show their outro. Covered: delivering Mama Lu's Vento, stealing and delivering the gold GT, recruiting crew and clearing Vipers, the street race, destroying the evidence van, the casino challenge, the boat run to the island, wrecking Kane's car, and the boss fight ending in "THE END".
- **Casino:** walking inside; Baccarat (round dealt, result shown, payout correct); Blackjack (deal, stand, settle); Slots (spin and payout); leaving through the door.
- **Boat:** boarding from the pier, driving on water (stays at sea level, blocked by land), and disembarking on the island.
- **Dating:** talk dialogue, a compliment raising affection, the date offer appearing, the date starting, her riding along, and the date completing at the destination.
- **Cheats:** all 38 return a result with a visible effect: money, weather, teleports, vehicles, the rocket pack.
- **Save:** reloading the page offers CONTINUE, and story progress and cash are restored.

Phone layout (Pixel 7 emulation) separately confirmed: the story dialogue advances by tapping; the casino shows the joystick and PLAY button; a baccarat Banker win pays $95 on a $100 bet (5% commission).

## Bugs found and fixed during the review

1. **Daily talk limit didn't work on day 0.** `G.talked[id] || -1` treated day 0 as "never talked", so you could compliment a date endlessly on the first day. Fixed with `??`.
2. **Luna stood inside the Beach Club building.** Her spot was inside the building's footprint; moved in front of it.
3. **Crew counter counted your date as a gang member.** This also blocked recruiting a 4th crew member during a date. Fixed.
4. **Casino tables were hard to reach.** The "play" radius was 2 units larger than the table's collision radius, so you had to stand at an exact distance. Widened.
5. **Entering the casino kept the outdoor camera direction.** You could walk in facing a wall. You now always face into the room.
6. **City roads rendered as ocean.** The 90,000-unit ocean plane was a single polygon and lost depth precision against the road. It's now a 72×72 grid drawn with a depth offset (found earlier in this update cycle).
7. **Cheat codes with a P paused the game mid-typing** (earlier cycle). Pause is Esc only on a keyboard.
8. **Eight pieces of dead code removed** (unused constants and functions left over from the top-down version).
9. **Chained dialogue trapped the mouse on laptops.** Choosing an option that opens another conversation re-captured the mouse just as the new box appeared, hiding the cursor so its choices couldn't be clicked. The game now waits until no dialogue is open before re-capturing, and releases the mouse if a capture lands while a menu, table or dialogue is up.
10. **People walked on the water's surface** (crew following you to a boat). Anyone in deep water is now drawn swimming.
11. **"NEON PALACE" title overlapped the pause button** inside the casino. Moved below it.

## Safety and content

- **Trademarks:** no real brands, games or places in code or docs (searched for Ferrari, GTA, Rockstar, Vice City, Los Santos, Lamborghini, Porsche). Cars, characters, the city, gangs and the casino are original.
- **No network access** besides loading three.js (local copy in the repo; pinned cdnjs r128 in the hosted link). No `fetch`, XHR, WebSocket, `eval` or `new Function`.
- **HTML injection:** `innerHTML` is only used with the game's own constant strings (card faces, slot symbols, cheat list). Player-typed cheat codes are filtered to A–Z and never inserted as HTML; dialogue uses `textContent`.
- **Storage:** three `localStorage` keys (`neoncoast.v1` save, `neoncoast.gfx`, `neoncoast.sens`), all wrapped in try/catch; the game runs normally with storage blocked.
- **Gambling:** in-game currency only; the table screen says so. There's no way to buy currency.
- **Dating** is PG: conversation choices, dates to public places, gifts and a heal.
- **Browser shortcuts:** no Ctrl-based controls (Ctrl+W would close the tab); Tab, Space and arrow keys have their default browser actions suppressed only while playing.

## Known limitations (not fixed, by design or out of scope)

- **Performance** was measured only in software rendering (no GPU in the review container). Real devices will be much faster, but low-end phones may need Graphics: LOW, which the game also switches to automatically.
- **People and boats** don't do full physics: pedestrians on a pier edge can step onto the water surface, and boats don't capsize.
- **Story missions use your current position**, so a mission started far from its area can involve a long trip.
- **Save data lives in the browser**: clearing site data or using a private window resets progress.
- **The hosted claude.ai link** needs internet; the GitHub Pages / installed version works offline.
