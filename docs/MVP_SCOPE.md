# MVP SCOPE
## The Adventures of Lil Artie — Prototype Island

---

## Goal

Deliver a playable, polished vertical slice that demonstrates the game's core systems:
- 3D open world with real traversal
- Controller support (Xbox + PS + KB/Mouse)
- Combat with all three starting weapons
- One enemy camp with AI
- One NPC with dialogue
- One quest with objectives
- Save/load system

---

## What's IN the MVP

### World
- [x] Prototype Island (jungle biome, ~200m × 200m)
- [x] Flat terrain with trees and rocks (placeholder)
- [x] One river/water area
- [x] One enemy camp (3 guards + patrol)
- [x] One NPC (Elder Kwame)
- [x] One treasure chest
- [x] One cave entrance (no interior yet)
- [x] Day/night cycle (10 min real-time)

### Player
- [x] Lil Artie placeholder mesh (capsule)
- [x] Walk, run, jump
- [x] Third-person camera
- [x] Xbox controller support
- [x] PlayStation controller support
- [x] Keyboard + mouse fallback
- [x] Stamina system
- [x] Health system
- [x] Dodge roll
- [x] Basic climbing (against climbable-tagged surfaces)
- [x] Glide (hold jump while airborne)

### Weapons
- [x] Boomerang (throw + return)
- [x] Dagger (3-hit combo)
- [x] Whip (crack + swing point latch)
- [x] Weapon switching (Q/E or LB/RB)

### Enemy AI
- [x] 3 guards in jungle camp
- [x] Patrol → Alert → Chase → Attack → Search → Patrol state machine
- [x] Detection radius
- [x] Enemy health + defeat behavior

### Quest
- [x] Quest: "Find the Golden Idol" (4 objectives)
- [x] Dialogue with Elder Kwame
- [x] Quest tracking in HUD

### UI
- [x] Health bar
- [x] Stamina bar
- [x] Active weapon display
- [x] Quest text tracker (top right)
- [x] Controller prompt system (shows correct icons)

### Save System
- [x] localStorage save/load
- [x] Saves: position, health, inventory, completed quests, opened chests

---

## What's NOT in the MVP (Planned Later)

- Custom Lil Artie 3D model (using capsule placeholder)
- Custom enemy GLB models
- Real audio files (all systems are wired, awaiting assets)
- Heightmap terrain (using flat plane)
- Cave interior
- Additional biomes (desert, mountain, coastal)
- Puzzle mechanics
- Skill upgrades
- More quests
- Map screen
- Inventory UI (wired, not fully built out)
- Stealth mechanics
- Double jump, wall run
- Multiplayer

---

## Definition of Done (MVP)

The MVP is done when:
1. You can open the game in a browser
2. You connect an Xbox or PS controller and play with no issues
3. You can explore the island, find enemies, fight with all 3 weapons
4. You can complete "Find the Golden Idol" quest
5. You save and reload the game and your progress persists
6. Performance holds 60fps on a mid-range laptop

---

## Next Milestone After MVP

- Replace placeholder meshes with real GLB models
- Add audio (footsteps, weapons, ambient)
- Build Desert Canyon biome
- Expand quest system to 3 quests
- Improve enemy AI (visual cones, group coordination)
