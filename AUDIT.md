# Neon Coast: final review and audit

Scope: everything in this repository (`index.html` game, `sw.js` offline cache, `manifest.webmanifest`, icons, bundled `three.min.js`), reviewed before delivery of the story/casino/dating/boats/island update.

## How it was checked

| Check | Tool | Result |
|---|---|---|
| Undefined variables, duplicate keys, unreachable code, unused code | ESLint 8 (`no-undef`, `no-dupe-keys`, `no-unreachable`, `no-redeclare`, `no-unused-vars`) on the full game script | **0 errors, 0 warnings** (8 dead-code warnings found and removed) |
| Casino rules | `tests/casino-rules.test.js` (106 assertions) | **All pass** |
| Baccarat odds | 2,000,000 simulated 8-deck hands vs published odds | Banker 45.83% / Player 44.66% / Tie 9.52% (published 45.86 / 44.62 / 9.52); house edge Banker 1.12%, Player 1.17% (published 1.06 / 1.24, within simulation noise) |
| Slots payback | Exact calculation from reel weights | 91.75% |
| Full playthrough | `tests/e2e.js` (headless Chromium, laptop layout) | **78/78 pass** (after v10.2) |
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

## Player feedback round (v9)

Fixes for the five problems reported after the first delivery, plus the character update. Each has a regression check in `tests/e2e.js`.

| Report | Root cause | Fix |
|---|---|---|
| Rocket pack can't be taken off | The only way off was typing SKYPACK again | **F / E** (laptop) or **PACK OFF** (the CAR button, relabelled) removes it whenever no vehicle is in reach. Removed high in the air, a parachute opens. An on-screen hint says how. |
| No way to undo a cheat | Toggle cheats only switched off by retyping the code, and nothing showed what was on | Pause → Cheats lists every active cheat as a button that turns it off, plus **Turn off all cheats**. New code **NOCHEATS**. STORMY is now a toggle. The HUD shows "CHEATS ON: …" under the minimap. |
| Can't pin the map | The map had no pin feature, and any tap closed it | Tap or click the map to drop a pin, or tap the pin to remove it. A purple GPS route follows the road network (Dijkstra over city intersections and highways; dashed straight line where no road goes, such as the island). It's shown on the minimap and big map, with a light beam at the spot and a distance and direction readout. The pin clears on arrival. The map closes with ✕, Tab, Esc or a tap outside it, and frees the mouse while it's open so laptop players can click. |
| Car sinks into mountains | Physics read terrain height by bilinear interpolation, but the mesh is drawn as triangles. On the raw mountain heightfield the two differ by up to **99 units (~10 m)**, and by over 3 units (a quarter of a car's height) at **8%** of countryside points (180,000 samples). | Ground height now uses the same triangle split as the mesh (verified identical to within 0.001 at 3,000 random points). The car body also rests on the average of its four wheel contact points. Slope pull is gentler and capped, and off-road drag is lower. |
| Sliding on rooftops | The walk animation decided "in the air" by comparing height with the street under the building, not the roof | Uses the floor you're standing on (roof or ground). The same fix applies to the ALT readout and the airborne check. |

**Characters.** People are rebuilt with a sculpted head: brow, eye sockets, almond eyes with lids, nose, lips, jaw and chin, with smooth skin shading for lips, brows, stubble and blush. Hair grows from a natural hairline, and long hair and ponytails hang behind the shoulders. Arms and legs are muscle-shaped with hands, thumbs and sneakers, and clothing has proper prints. Far-away people use a low-detail version: total triangles on screen went *down* slightly versus the previous build (240k vs 261k at the same view). Rendering cost was measured the same in software rendering (0.75 fps for both builds in the GPU-less test container).

A **character creator** (menu or pause → Character) sets name, body, build, skin, hair, facial hair, clothes, prints, colors and extras, with a face close-up. The name is used in story dialogue. The look is stored in a fourth `localStorage` key (`neoncoast.look`, wrapped in try/catch like the others). The characters are original. They are not copies of any game's protagonists.

## v10: cities, police helicopters, weapons, car speeds

| Change | Details | Check |
|---|---|---|
| Car speeds | Top speed and acceleration lowered (about 20–35%) and spread by model: van 105, sedan/taxi 135, police 170, coupe 180, Vento GT 200, Vento S 220 km/h. Top speed is shown on entering. Nitrous boost 1.7× → 1.45×. | e2e: speeds strictly increase van → Vento S, max ≤ 230 km/h |
| Connected cities | Sunset Bluffs, Copper Ridge and Northgate sit on the highway loop, each a flattened 4×4-block grid with towers, offices, shops, homes, parking, pedestrians and city-limit signs. The highway is held level through each city, so it doesn't run on an embankment. GPS routing joins roads wherever they cross. | e2e: teleport into each city, GPS route from downtown into a city |
| Police helicopters | 1 at 3–4 stars, 2 at 5. They circle overhead, a door gunner fires bursts, and at night a searchlight follows you. They keep the wanted level from dropping while they can see you. A direct rocket hit or sustained fire brings one down (+heat). | e2e: helicopter joins the chase in the air and can be shot down |
| Weapons | Shotgun (7 pellets), assault rifle, sniper rifle (zoom scope with right click or SCOPE), rocket launcher (explosive; locks on to aircraft). Gun store sells them all; 1–7 picks a weapon on a keyboard. Old saves migrate (pistol/SMG ammo kept). | e2e: key 7 selects the launcher, scope engages, rocket wrecks a car |
| Bug fixes found while testing | Explosions damaged cars without setting them alight (no chain reactions). Explosion debris spawned at street level on hills. The map-pin sound used a missing effect name. | Checked in the browser: a rocket-hit car now catches fire |

## v10.3: easier driving

Player report: cars still too fast and hard to control at speed. Measured with a fixed-step driving simulation on a flat street:

| | Before (v10.2) | After (v10.3) |
|---|---|---|
| Vento S top speed | 220 km/h | 180 km/h |
| Vento S 0–100 km/h | 0.9 s | 2.3 s |
| Sedan 0–100 km/h | 2.0 s | 4.6 s |
| Turn from a 1-second full steer at top speed, Vento S | 41° (at 220 km/h) | 30° (at 180 km/h) |
| Same, sedan | 59° | 50° |
| Braking 100 → 0 km/h, Vento S / sedan | 0.35 s / 0.6 s | 1.1 s / 1.2 s |

Changes: lower top speeds by model (van 90 → Vento S 180 km/h); acceleration tapers toward top speed; much lower drag under throttle, so each car still reaches its top speed; brakes the same for every model and no longer violent; speed-sensitive steering lock and slower turn-in at speed for the player, with a quick return to centre; phone joystick has a dead zone and a finer response near the centre; softer wall bounces.

## Safety and content

- **Trademarks:** no real brands, games or places in code or docs (searched for Ferrari, GTA, Rockstar, Vice City, Los Santos, Lamborghini, Porsche). Cars, characters, the city, gangs and the casino are original.
- **No network access** besides loading three.js (local copy in the repo; pinned cdnjs r128 in the hosted link). No `fetch`, XHR, WebSocket, `eval` or `new Function`.
- **HTML injection:** `innerHTML` is only used with the game's own constant strings (card faces, slot symbols) or to clear containers. Player-typed cheat codes are filtered to A–Z and never inserted as HTML; dialogue, the cheat list and the character name use `textContent` (the name is also filtered to letters, digits, spaces and . ' -).
- **Storage:** four `localStorage` keys (`neoncoast.v1` save, `neoncoast.gfx`, `neoncoast.sens`, `neoncoast.look`), all wrapped in try/catch; the game runs normally with storage blocked.
- **Gambling:** in-game currency only; the table screen says so. There's no way to buy currency.
- **Dating** is PG: conversation choices, dates to public places, gifts and a heal.
- **Browser shortcuts:** no Ctrl-based controls (Ctrl+W would close the tab); Tab, Space and arrow keys have their default browser actions suppressed only while playing.

## Known limitations (not fixed, by design or out of scope)

- **Performance** was measured only in software rendering (no GPU in the review container). Real devices will be much faster, but low-end phones may need Graphics: LOW, which the game also switches to automatically.
- **People and boats** don't do full physics: pedestrians on a pier edge can step onto the water surface, and boats don't capsize.
- **Story missions use your current position**, so a mission started far from its area can involve a long trip.
- **Save data lives in the browser**: clearing site data or using a private window resets progress.
- **The hosted claude.ai link** needs internet; the GitHub Pages / installed version works offline.
