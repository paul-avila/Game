# Neon Coast

An original third-person 3D open-world city sandbox for phones and desktop browsers. Drive, explore, take jobs and outrun the police. Everything (graphics and sound) is generated in code, with no downloads, so it runs fully offline.

## Play on your phone
1. Host this folder (for example, GitHub Pages: repo **Settings → Pages →** pick this branch, root folder).
2. Open the URL on your phone or laptop. On a phone, use **Add to Home Screen** (iOS Safari: Share menu; Android Chrome: ⋮ menu); on a laptop, Chrome/Edge can **Install** it from the address bar.
3. After the first visit it works offline, launching like an app.
4. **Updates** arrive by themselves: when you're online, opening the app loads the newest version (the version number is at the bottom right of the main menu and pause menu). If a new version is published while the game is open, the menu updates itself, or shows a "New version ready" button if you're mid-game. If an app window still shows an old version, close it fully and reopen it, or press Ctrl+Shift+R on a computer.

You can also open `index.html` directly. Offline caching needs it to be served over http(s).

## Controls
The game picks the right layout automatically: touch buttons on phones and tablets, mouse and keyboard on laptops and desktops. Pause → **Controls** shows the full list and has a mouse sensitivity slider.

| Action | Laptop / PC | Phone |
|---|---|---|
| Move / drive | WASD or arrows | Left thumb |
| Look around | Mouse (click the game to capture it), or J / L | Drag right side |
| Shoot | Left click or K | FIRE |
| Jump | Space (on foot) | JUMP |
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
| Zoom / move the big map | Mouse wheel (or trackpad pinch), + / − keys or buttons, drag; arrow keys move; ◎ centers on you | Pinch with two fingers, + / − buttons, drag with one finger; ◎ centers on you |
| Drop / remove a map pin | Open the map, click a spot (click the pin again to remove it) | Open the map, tap a spot |
| Close the map | Tab, Esc, ✕ or click outside the map | ✕ or tap outside the map |
| Pause / back to the game | Esc (also closes Cheats, Controls, Character and shops; a code typed in Cheats is applied) | II / Resume |
| Cheats | Type a code any time | Pause → Cheats |

## Features
- Third-person 3D (three.js, bundled locally) with realistic lighting: real-time sun shadows, reflective car paint/glass/water, sunrise-to-night sky, textured streets, glowing streetlights; Graphics High/Low in the pause menu (auto-drops to Low on slow phones); 12×12-block coastal city: downtown towers, neighborhoods, parks, beach
- Detailed procedurally modeled cars: two Italian-style supercars (mid-engine Vento S, front-engine Vento GT), coupe, sedan, taxi, van, police; spoked wheels with brake calipers, body roll and nose-dive
- **Realistic people** (v11): photo-textured, fully rigged 3D humans from the Microsoft Rocketbox library (9 men, 7 women, 2 police officers) animated with motion capture: idle breathing, walking and running that blend by speed so the feet don't slide, and a seated pose for cars. Arms aim guns with proper two-handed grips, riders hold the handlebars, gang members wear caps in their crew color. If the models can't load (for example the very first launch offline), the game falls back to the stylized people: sculpted faces (brow, eyes with lids, nose, lips, jaw, ears), natural hairlines and hairstyles (short, buzz, curly, long, ponytail, bun), stubble and beards, muscle-shaped arms and legs, hands with thumbs, sneakers, and printed clothing (palm, hibiscus, floral, stripes, denim). Distant people switch to a lighter model to keep phones fast.
- **Character creator** (main menu → Character, or Pause → Character): pick **Realistic** and choose one of 16 photo-real people, or **Custom** to build a stylized character (build, skin tone, hair style and color, facial hair, top, print, colors, bottoms, shoes and accessories). Face close-up, name, and your look is saved and used in the story's dialogue.
- **Zoomable map**: zoom from the whole region down to single streets (streets and buildings stay sharp), drag to move, scale bar; the minimap zooms out when you drive fast or fly.
- **Map pins with GPS**: open the map, tap anywhere to drop a pin; a purple route follows the roads (dashed line when there's no road, such as to the island), a light beam marks the spot, and the HUD shows distance and direction. The pin clears when you arrive.
- Traffic AI, pedestrians, parked cars, carjacking, crashes, fires and explosions
- 5-star wanted system: patrols, pursuits, foot cops, busted / wasted, Respray garage. At 3 stars a **police helicopter** joins the chase (two at 5 stars): it circles overhead, a cop shoots from the door, and at night it lights you up with a searchlight. Shoot it down (rifle, sniper or rocket launcher) or outrun it.
- **Weapons**: fists, pistol, SMG, shotgun, assault rifle, sniper rifle (zoom scope), rocket launcher (explodes cars, people and helicopters). Buy them at the gun store (orange marker).
- **Bikes**: bicycle (35 km/h), scooter (60), adventure bike (140, rides off-road without slowing) and sports bike (175). You can see your rider: pedalling, upright on the scooter, crouched on the sports bike; motorbike riders wear helmets and bikes lean into turns. Hit something hard and you're thrown off. Find them parked around the cities and in traffic, by the Safehouse, in Pine Hollow and outside the Neon Palace, or spawn them with cheats.
- **Car speeds by model** (top speed shows when you get in): van 90 km/h, sedan/taxi 115, police 145, coupe 150, Vento GT 165, Vento S 180. Acceleration builds gradually, steering gets calmer the faster you go, and brakes are strong but smooth. NITROUS makes cars faster if you want more speed.
- **Connected cities**: the highway loop links Neon Coast to Pine Hollow and three new cities: **Sunset Bluffs** (southwest, near the coast), **Copper Ridge** (west) and **Northgate** (north). Each has a street grid, downtown towers, shops, homes, parked cars and pedestrians, and a sign and on-screen name as you arrive.
- Huge world: 14×14-block city, desert, the town of Pine Hollow, an airfield with runway, hangars, a parked plane and helicopters, and mountain countryside: ridged peaks with rock and snow, pine forests, coastline, a winding mountain highway with guard rails, a radio tower on the summit, off-road driving with slope physics
- **Story campaign** (9 missions with dialogue): Mama Lu, Benny, Detective Hale and casino owner Isla Moreno help Dex take the coast back from Victor Kane's Vipers. Walk into the gold ★ marker to start the next mission; progress is saved.
- **Neon Palace casino**: walk inside a 3D casino and play **Baccarat** (official Punto Banco third-card rules, Banker pays 0.95:1, Tie 8:1), **Blackjack** (3:2, dealer stands on 17, double down) and **Slots** (≈92% payback). There's a bar too. In-game money only.
- **Dating**: meet Sofia, Jade, Maya and Luna around the map (pink ♥). Talk (G / TALK), choose what to say, and take them on dates; drive carefully — cops and crashes ruin the mood. At full affection they become your girlfriend and help you once a day.
- **Boats & island**: speedboats at the pier east of downtown; ride to the island (beaches, palms, umbrellas, Beach Club, villa, its own pier). You can swim, too.
- **Weather**: random rain showers (wet, reflective streets).
- Gangs: your Palms crew (green caps) and the rival Vipers (purple caps) each hold turf. Recruit up to four Palms; they follow you, fight, ride in your car or helicopter and shoot out of the windows. Vipers attack in their turf.
- Flying: helicopter, stunt plane, rocket backpack, automatic parachute when you bail out mid-air; land on rooftops
- Driving: speed-sensitive steering and extra grip for stable high-speed handling; calmer top speeds and acceleration
- Jobs from green `$` markers (now including a mountain race): courier, bank job, hit, street race, rideshare
- Gun store (SMG, armor), clinic, safehouse save, day/night cycle, synthesized audio, autosave

## Cheats
Type a code on the keyboard at any time, or open **Pause → Cheats**: codes are grouped by category (tabs at the top), and the box filters the list as you type.

**Undoing cheats:** toggle cheats switch off when you enter the same code again. **Pause → Cheats** lists every cheat that is on: tap one to switch it off, or tap **Turn off all cheats** (or type **NOCHEATS**). The HUD shows "CHEATS ON" under the minimap while any toggle is active. One-off cheats (money, teleports, vehicles, time) have nothing to switch off.

**❤️ Health & protection**

| Code | Effect |
|---|---|
| FIXME | Full health, armor and car repair |
| IRONSKIN | Invincible (toggle) |

**🔫 Weapons**

| Code | Effect |
|---|---|
| LOCKNLOAD | All weapons (incl. sniper and rocket launcher), full ammo |
| BOTTOMLESS | Infinite ammo (toggle) |

**🚨 Police & wanted level**

| Code | Effect |
|---|---|
| CLEANRECORD | Clear wanted level |
| GHOSTMODE | Police ignore you (toggle) |
| MOSTWANTED | Five-star wanted level |

**🚗 Cars**

| Code | Effect |
|---|---|
| ROSSO | Spawn a Vento S supercar |
| PINKRIDE | Spawn a pink Vento S |
| GRANDTOUR | Spawn a Vento GT |
| SIRENS | Spawn a police cruiser |
| YELLOWCAB | Spawn a taxi |
| NITROUS | Faster cars (toggle) |
| BIGBANG | Blow up all nearby cars |

**🏍️ Bikes**

| Code | Effect |
|---|---|
| PEDALS | Spawn a bicycle |
| SCOOTY | Spawn a scooter |
| DIRTTRAIL | Spawn an adventure bike |
| SUPERBIKE | Spawn a sports bike |

**🚁 Air & sea**

| Code | Effect |
|---|---|
| CHOPPER | Spawn a helicopter |
| JETSTREAM | Fly a stunt plane |
| SKYPACK | Rocket backpack (toggle; F takes it off) |
| SPEEDBOAT | Spawn a speedboat on nearby water |

**📍 Teleport**

| Code | Effect |
|---|---|
| HOMEBASE | Teleport to the safehouse |
| HIGHROLLER | Teleport to the Neon Palace casino |
| PARADISE | Teleport to the island |
| SUMMIT | Teleport to the highest mountain |
| AIRFIELD | Teleport to the airfield |
| PINEHOLLOW | Teleport to Pine Hollow |
| BLUFFS | Teleport to Sunset Bluffs |
| COPPER | Teleport to Copper Ridge |
| NORTHGATE | Teleport to Northgate |

**🌤️ Time & weather**

| Code | Effect |
|---|---|
| HIGHNOON | Set time to noon |
| GOLDENHOUR | Set time to sunset |
| MIDNIGHT | Set time to midnight |
| TIMEWARP | Skip ahead 6 hours |
| SUNSHINE | Clear skies |
| STORMY | Rainstorm (toggle) |

**🚦 Traffic & fun**

| Code | Effect |
|---|---|
| EMPTYSTREETS | No traffic or people (toggle) |
| RUSHHOUR | Heavy traffic (toggle) |
| SLOWMO | Slow motion (toggle) |
| CREWUP | Three Palms gang members join you |

**💰 Money & casino**

| Code | Effect |
|---|---|
| PAYDAY | +$250,000 |
| GOLDRUSH | +$1,000,000 |
| LUCKYSTREAK | Win your next 3 casino rounds |

**⭐ Story & dating**

| Code | Effect |
|---|---|
| STORYSKIP | Complete the current story mission |
| CHARMER | Everyone you date adores you |

**⚙️ Reset**

| Code | Effect |
|---|---|
| NOCHEATS | Turn off every cheat that is on |

## Tests
- `node tests/casino-rules.test.js`: 106 checks of the baccarat tableau, payouts, blackjack settlement and slot payback, including a 2-million-hand simulation compared against published baccarat odds. No dependencies.
- `node tests/e2e.js [screenshotDir]`: end-to-end playthrough in headless Chromium (all 9 story missions, casino games, boat, dating, cheats, save/reload). Needs Playwright and `python3 -m http.server 8765` running in this folder.

See `AUDIT.md` for the final review.

## Credits
Rendering uses [three.js](https://threejs.org) r128 (MIT License, © 2010–2021 three.js authors), bundled as `three.min.js`, plus its `GLTFLoader` and `SkeletonUtils` in `lib/` (see `lib/LICENSE`).

The realistic people and their motion-capture animations come from the [Microsoft Rocketbox Avatar Library](https://github.com/microsoft/Microsoft-Rocketbox) (MIT License, © 2020 Microsoft), converted to glTF in `assets/people/`. See `assets/people/LICENSE.md` for the list of avatars and the full license.
