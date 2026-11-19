# Neon Coast

An original third-person 3D open-world city sandbox for phones and desktop browsers. Drive, explore, take jobs and outrun the police. Everything (graphics and sound) is generated in code, with no downloads, so it runs fully offline.

## Play on your phone
1. Host this folder (for example, GitHub Pages: repo **Settings → Pages →** pick this branch, root folder).
2. Open the URL on your phone or laptop. On a phone, use **Add to Home Screen** (iOS Safari: Share menu; Android Chrome: ⋮ menu); on a laptop, Chrome/Edge can **Install** it from the address bar.
3. After the first visit it works offline, launching like an app.

You can also open `index.html` directly. Offline caching needs it to be served over http(s).

## Controls
The game picks the right layout automatically: touch buttons on phones and tablets, mouse and keyboard on laptops and desktops. Pause → **Controls** shows the full list and has a mouse sensitivity slider.

| Action | Laptop / PC | Phone |
|---|---|---|
| Move / drive | WASD or arrows | Left thumb |
| Look around | Mouse (click the game to capture it), or J / L | Drag right side |
| Shoot | Left click, K, or Space on foot | FIRE |
| Aim over the shoulder | Hold right click | auto-aim |
| Sprint | Shift | RUN |
| Handbrake | Space or Shift | BRAKE |
| Enter / exit vehicle | F or E | CAR |
| Take off the rocket pack | F or E (away from vehicles; mid-air opens a parachute) | PACK OFF |
| Switch weapon | Q, mouse wheel, or 1–7 to pick one | ⇄ |
| Sniper scope | Hold right click (sniper rifle) | SCOPE |
| Fly up / down | Space / C | UP / DOWN |
| Recruit crew · talk to people | G | RECRUIT / TALK |
| Play a casino table | F | PLAY |
| Next line of dialogue | Click, Space or Enter | Tap |
| Map | Tab | Tap minimap |
| Drop / remove a map pin | Open the map, click a spot (click the pin again to remove it) | Open the map, tap a spot |
| Close the map | Tab, Esc, ✕ or click outside the map | ✕ or tap outside the map |
| Pause | Esc | II |
| Cheats | Type a code any time | Pause → Cheats |

## Features
- Third-person 3D (three.js, bundled locally) with realistic lighting: real-time sun shadows, reflective car paint/glass/water, sunrise-to-night sky, textured streets, glowing streetlights; Graphics High/Low in the pause menu (auto-drops to Low on slow phones); 12×12-block coastal city: downtown towers, neighborhoods, parks, beach
- Detailed procedurally modeled cars: two Italian-style supercars (mid-engine Vento S, front-engine Vento GT), coupe, sedan, taxi, van, police; spoked wheels with brake calipers, body roll and nose-dive
- **Realistic people**: sculpted faces (brow, eyes with lids, nose, lips, jaw, ears), natural hairlines and hairstyles (short, buzz, curly, long, ponytail, bun), stubble and beards, muscle-shaped arms and legs, hands with thumbs, sneakers, and printed clothing (palm, hibiscus, floral, stripes, denim). Distant people switch to a lighter model to keep phones fast.
- **Character creator** (main menu → Character, or Pause → Character): name, man/woman, build, skin tone, hair style and color, facial hair, top, print, colors, bottoms, shoes and accessories, with a face close-up. Your look is saved and used in the story's dialogue.
- **Map pins with GPS**: open the map, tap anywhere to drop a pin; a purple route follows the roads (dashed line when there's no road, such as to the island), a light beam marks the spot, and the HUD shows distance and direction. The pin clears when you arrive.
- Traffic AI, pedestrians, parked cars, carjacking, crashes, fires and explosions
- 5-star wanted system: patrols, pursuits, foot cops, busted / wasted, Respray garage. At 3 stars a **police helicopter** joins the chase (two at 5 stars): it circles overhead, a cop shoots from the door, and at night it lights you up with a searchlight. Shoot it down (rifle, sniper or rocket launcher) or outrun it.
- **Weapons**: fists, pistol, SMG, shotgun, assault rifle, sniper rifle (zoom scope), rocket launcher (explodes cars, people and helicopters). Buy them at the gun store (orange marker).
- **Car speeds by model** (top speed shows when you get in): van 105 km/h, sedan/taxi 135, police 170, coupe 180, Vento GT 200, Vento S 220.
- **Connected cities**: the highway loop links Neon Coast to Pine Hollow and three new cities: **Sunset Bluffs** (southwest, near the coast), **Copper Ridge** (west) and **Northgate** (north). Each has a street grid, downtown towers, shops, homes, parked cars and pedestrians, and a sign and on-screen name as you arrive.
- Huge world: 14×14-block city, desert, the town of Pine Hollow, an airfield with runway, hangars, a parked plane and helicopters, and mountain countryside: ridged peaks with rock and snow, pine forests, coastline, a winding mountain highway with guard rails, a radio tower on the summit, off-road driving with slope physics
- **Story campaign** (9 missions with dialogue): Mama Lu, Benny, Detective Hale and casino owner Isla Moreno help Dex take the coast back from Victor Kane's Vipers. Walk into the gold ★ marker to start the next mission; progress is saved.
- **Neon Palace casino**: walk inside a 3D casino and play **Baccarat** (official Punto Banco third-card rules, Banker pays 0.95:1, Tie 8:1), **Blackjack** (3:2, dealer stands on 17, double down) and **Slots** (≈92% payback). There's a bar too. In-game money only.
- **Dating**: meet Sofia, Jade, Maya and Luna around the map (pink ♥). Talk (G / TALK), choose what to say, and take them on dates; drive carefully — cops and crashes ruin the mood. At full affection they become your girlfriend and help you once a day.
- **Boats & island**: speedboats at the pier east of downtown; ride to the island (beaches, palms, umbrellas, Beach Club, villa, its own pier). You can swim, too.
- **Weather**: random rain showers (wet, reflective streets).
- Gangs: your green Palms crew and the rival purple Vipers each hold turf. Recruit up to four Palms; they follow you, fight, ride in your car or helicopter and shoot out of the windows. Vipers attack in their turf.
- Flying: helicopter, stunt plane, rocket backpack, automatic parachute when you bail out mid-air; land on rooftops
- Driving: speed-sensitive steering and extra grip for stable high-speed handling; calmer top speeds and acceleration
- Jobs from green `$` markers (now including a mountain race): courier, bank job, hit, street race, rideshare
- Gun store (SMG, armor), clinic, safehouse save, day/night cycle, synthesized audio, autosave

## Cheats
Type a code on the keyboard at any time, or open **Pause → Cheats** to type or tap one.

**Undoing cheats:** toggle cheats switch off when you enter the same code again. **Pause → Cheats** lists every cheat that is on: tap one to switch it off, or tap **Turn off all cheats** (or type **NOCHEATS**). The HUD shows "CHEATS ON" under the minimap while any toggle is active. One-off cheats (money, teleports, vehicles, time) have nothing to switch off.

| Code | Effect |
|---|---|
| FIXME | Full health, armor and car repair |
| PAYDAY | +$250,000 |
| LOCKNLOAD | All weapons (incl. sniper and rocket launcher), full ammo |
| BOTTOMLESS | Infinite ammo (toggle) |
| IRONSKIN | Invincible (toggle) |
| CLEANRECORD | Clear wanted level |
| MOSTWANTED | Five-star wanted level |
| GHOSTMODE | Police ignore you (toggle) |
| ROSSO / GRANDTOUR | Spawn a Vento S / Vento GT supercar |
| SIRENS / YELLOWCAB | Spawn a police cruiser / taxi |
| NITROUS | Faster cars (toggle) |
| BIGBANG | Blow up all nearby cars |
| SLOWMO | Slow motion (toggle) |
| EMPTYSTREETS / RUSHHOUR | No traffic / heavy traffic (toggle) |
| MIDNIGHT / HIGHNOON / GOLDENHOUR | Set the time of day |
| SUMMIT / HOMEBASE | Teleport to the mountain top / safehouse |
| SKYPACK | Rocket backpack (toggle; F / PACK OFF also takes it off) |
| CHOPPER | Spawn a helicopter |
| JETSTREAM | Fly a stunt plane (starts in the air) |
| CREWUP | Three Palms gang members join you |
| AIRFIELD / PINEHOLLOW | Teleport to the airfield / Pine Hollow |
| BLUFFS / COPPER / NORTHGATE | Teleport to Sunset Bluffs / Copper Ridge / Northgate |
| GOLDRUSH | +$1,000,000 |
| SPEEDBOAT | Spawn a speedboat on nearby water (or at the pier) |
| PARADISE / HIGHROLLER | Teleport to the island / the Neon Palace |
| LUCKYSTREAK | Win your next 3 casino rounds |
| CHARMER | Everyone you date adores you |
| STORMY / SUNSHINE | Rainstorm (toggle) / clear skies |
| NOCHEATS | Turn off every cheat that is on |
| PINKRIDE | Spawn a pink Vento S |
| TIMEWARP | Skip ahead 6 hours |
| STORYSKIP | Complete the current story mission |

## Tests
- `node tests/casino-rules.test.js`: 106 checks of the baccarat tableau, payouts, blackjack settlement and slot payback, including a 2-million-hand simulation compared against published baccarat odds. No dependencies.
- `node tests/e2e.js [screenshotDir]`: end-to-end playthrough in headless Chromium (all 9 story missions, casino games, boat, dating, cheats, save/reload). Needs Playwright and `python3 -m http.server 8765` running in this folder.

See `AUDIT.md` for the final review.

## Credits
Rendering uses [three.js](https://threejs.org) r128 (MIT License, © 2010–2021 three.js authors), bundled as `three.min.js`.
