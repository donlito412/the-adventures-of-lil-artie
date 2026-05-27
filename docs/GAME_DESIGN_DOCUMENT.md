# GAME DESIGN DOCUMENT
## The Adventures of Lil Artie

**Version**: 0.1 — MVP Draft  
**Date**: 2026-05-24  
**Status**: Active Development

---

## 1. Overview

**The Adventures of Lil Artie** is a browser-based, 3D open-world adventure game starring Lil Artie — an African American teenage explorer with dreadlocks who travels through jungles, deserts, ruins, islands, mountains, and coastal villages.

The game draws from the action-adventure tradition: exploration, puzzle-solving, combat, and discovery. It is entirely original — no licensed assets, no copied maps, no cloned mechanics.

**Platform**: Web browser (desktop-first, mobile later)  
**Engine**: Babylon.js + TypeScript + Vite  
**Physics**: Havok Physics through Babylon.js  
**Controller**: Xbox, PlayStation, Keyboard/Mouse

---

## 2. Core Pillars

1. **Exploration First** — The world is worth exploring. Every corner holds something: a ruin, a hidden chest, an NPC with a story.
2. **Weapons as Tools** — Your weapons solve movement problems, not just combat problems.
3. **Human Conflict** — Enemies are people: mercenaries, looters, raiders. No monsters.
4. **Cultural Groundedness** — Characters, places, and artifacts draw from real African and diaspora traditions.
5. **Browser-Native** — Runs in any modern browser, no install required.

---

## 3. Core Gameplay Loop

```
Explore World
    ↓
Find Clue / NPC / Quest
    ↓
Navigate Obstacles (climbing, swimming, gliding, whip swing)
    ↓
Engage Enemies (boomerang, dagger, whip)
    ↓
Collect Treasure / Complete Objective
    ↓
Unlock New Area / Weapon / Story
    ↓
Explore More
```

---

## 4. Player Character

**Name**: Artie (Lil Artie)  
**Age**: 16  
**Background**: See CHARACTER_DESIGN.md  
**Core Abilities**:
- Walk, run, jump, dodge
- Climb walls and ledges
- Glide with handmade glider
- Swim
- Whip swing on anchor points
- Boomerang (throw and catch)
- Dagger (fast combo melee)
- Whip (range + disarm + grapple)

---

## 5. World

Five biomes planned (see WORLD_DESIGN.md):
1. Jungle Island (Prototype — MVP)
2. Desert Canyon
3. Mountain Pass
4. Coastal Village / Ocean
5. Underground Ruins Network

---

## 6. Enemies

All enemies are human. See ENEMY_AI_SYSTEM.md.

Factions:
- **Blackthorn Syndicate** — Corporate mercenaries looting ancient sites
- **Sand Wolves** — Desert bandit clan
- **Ruin Seekers** — Freelance treasure hunters turned hostile

---

## 7. Weapons

| Weapon | Type | Primary | Secondary |
|---|---|---|---|
| Boomerang | Ranged | Throw (arc, returns) | Charged throw |
| Dagger | Melee | Slash combo | Power stab |
| Whip | Hybrid | Crack (range) | Latch swing point |
| Spear* | Melee | Thrust | Throw |
| Sling* | Ranged | Stone shot | Rapid fire |

*Unlockable later.

---

## 8. Progression

- No traditional leveling in MVP
- Weapons unlock through exploration and quests
- New biomes unlock through story progression
- Artifacts collected for lore and rewards
- Player stat upgrades planned for post-MVP

---

## 9. Save System

- Browser localStorage
- Auto-save on chest open, quest completion, and zone transition
- Manual save via pause menu
- One save slot in MVP

---

## 10. Technical Stack

| System | Technology |
|---|---|
| Renderer | Babylon.js |
| Physics | Havok Physics |
| Input | Browser Gamepad API + Keyboard/Mouse |
| UI | Babylon GUI or HTML overlay UI |
| Audio | Babylon audio |
| Assets | GLB/GLTF from Blender |
| Build | Vite + TypeScript |
| Deploy | Vercel (primary), Netlify (backup) |
