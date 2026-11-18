# Neon Coast

An original third-person 3D open-world city sandbox for phones and desktop browsers. Drive, explore, take jobs and outrun the police. Everything (graphics and sound) is generated in code, with no downloads, so it runs fully offline.

## Play on your phone
1. Host this folder (for example, GitHub Pages: repo **Settings → Pages →** pick this branch, root folder).
2. Open the URL on your phone, then use **Add to Home Screen** (iOS Safari: Share menu; Android Chrome: ⋮ menu).
3. After the first visit it works offline, launching like an app.

You can also open `index.html` directly. Offline caching needs it to be served over http(s).

## Controls
| Touch | Keyboard | Action |
|---|---|---|
| Left thumb | WASD / arrows | Move · steer (up = gas, down = brake) |
| Drag right side | J / L or mouse drag | Look around |
| FIRE | Space | Shoot / punch (auto-aim) |
| CAR | E or F | Enter, carjack, exit |
| RUN / BRAKE | Shift | Sprint · handbrake drift |
| ⇄ | Q | Switch weapon |
| II | P / Esc | Pause |

## Features
- Third-person 3D (three.js, bundled locally) with realistic lighting: real-time sun shadows, reflective car paint/glass/water, sunrise-to-night sky, textured streets, glowing streetlights; Graphics High/Low in the pause menu (auto-drops to Low on slow phones); 12×12-block coastal city: downtown towers, neighborhoods, parks, beach
- Detailed procedurally modeled cars: two Italian-style supercars (mid-engine Vento S, front-engine Vento GT), coupe, sedan, taxi, van, police; spoked wheels with brake calipers, body roll and nose-dive
- Realistic-proportion people with faces, hairstyles, varied clothing and jointed walk/run animation
- Traffic AI, pedestrians, parked cars, carjacking, crashes, fires and explosions
- 5-star wanted system: patrols, pursuits, foot cops, busted / wasted, Respray garage
- Jobs from green `$` markers: courier, bank job, hit, street race, rideshare
- Gun store (SMG, armor), clinic, safehouse save, day/night cycle, synthesized audio, autosave
