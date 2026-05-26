# The Adventures of Lil Artie

> *A browser-based 3D open-world adventure game.*

Lil Artie is an African American teenage explorer with dreadlocks. Armed with a boomerang, dagger, and whip, he navigates jungles, deserts, ruins, coastal villages, and mountain passes — facing off against real human enemies, not monsters.

**No installs. No engine downloads. Just open the browser and play.**

---

## Tech Stack

| System | Technology |
|---|---|
| 3D Engine | [PlayCanvas](https://playcanvas.com/) |
| Language | TypeScript |
| Bundler | Vite |
| Editor | PlayCanvas Editor for scene/layout work |
| Rendering | WebGL/WebGPU-capable browser rendering through PlayCanvas |
| Assets | GLB/GLTF from Meshy, Blender, purchased packs, or PlayCanvas exports |
| Deploy | Vercel / Netlify |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# 1. Navigate to the project folder
cd the-adventures-of-lil-artie

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Controller Support

| Controller | Status |
|---|---|
| Xbox (wired/wireless) | ✅ Full |
| PlayStation 4/5 | ✅ Full |
| Keyboard + Mouse | ✅ Full |
| Generic Gamepad | ✅ Best effort |

See `docs/CONTROLLER_SUPPORT.md` for full button mapping.

---

## Current Engine Direction

The active playable build is the local Vite + PlayCanvas runtime.

Use:
- Local `public/assets` for real GLB/GLTF game assets
- PlayCanvas Editor only when useful for visual layout tests
- Blender for asset cleanup, rigging, optimization, and GLB export
- Meshy and purchased assets as source assets
- Vite/TypeScript for gameplay code and publishing pipeline

The PlayCanvas cloud editor is not the source of truth because the account storage limit is too small for realistic open-world production assets. The previous Babylon.js prototype files remain in `src/` as inactive reference code during the transition, but TypeScript currently checks only the active PlayCanvas runtime.

---

## Project Structure

```
the-adventures-of-lil-artie/
├── src/              # TypeScript source (Codex territory)
│   ├── playcanvas/   # Active PlayCanvas runtime
│   ├── core/         # Legacy Babylon prototype reference during transition
│   ├── input/        # Keyboard, mouse, gamepad input
│   ├── player/       # Player controller, movement, camera, combat
│   ├── weapons/      # Boomerang, dagger, whip
│   ├── enemies/      # AI state machine, spawner
│   ├── world/        # Scene factory, terrain, environment, day/night
│   ├── traversal/    # Climbing, gliding, swimming, ledge grab, whip swing
│   ├── quests/       # Quest manager, objectives
│   ├── dialogue/     # Dialogue trees, NPC
│   ├── ui/           # HUD, inventory, controller prompts
│   ├── audio/        # Music, SFX managers
│   ├── data/         # JSON data (weapons, enemies, quests, dialogue)
│   └── utils/        # Math helpers, debug logger, constants
├── public/
│   ├── assets/       # Models, textures, audio, UI images
│   └── maps/         # Map data
├── docs/             # Design documents (Claude territory)
├── tasks/            # Task tracking files
├── agent-notes/      # Per-agent notes and decisions log
└── tools/            # Asset pipeline, Blender rules, deployment
```

---

## Design Documents

| Document | Description |
|---|---|
| [Game Design Document](docs/GAME_DESIGN_DOCUMENT.md) | Core vision, loops, systems |
| [Character Design](docs/CHARACTER_DESIGN.md) | Lil Artie, NPCs, character guide |
| [World Design](docs/WORLD_DESIGN.md) | All five biomes |
| [Combat System](docs/COMBAT_SYSTEM.md) | Weapons, enemy engagement, damage |
| [Traversal System](docs/TRAVERSAL_SYSTEM.md) | Movement, climbing, gliding, swimming |
| [Enemy AI System](docs/ENEMY_AI_SYSTEM.md) | AI state machine, factions |
| [Controller Support](docs/CONTROLLER_SUPPORT.md) | Full button mapping |
| [Art Direction](docs/ART_DIRECTION.md) | Visual style, color palettes, asset specs |
| [MVP Scope](docs/MVP_SCOPE.md) | What's in the first playable build |

---

## Development Rules

**Before starting work:**
1. Read this README
2. Read `tasks/MASTER_TASK_LIST.md`
3. Read your agent's task file (`CODEX_TASKS.md`, `CLAUDE_TASKS.md`, `ANTIGRAVITY_TASKS.md`)
4. Read `agent-notes/DECISIONS.md`
5. Explain what you will change
6. Then make changes

**After completing work:**
1. Update `tasks/COMPLETED_TASKS.md`
2. Update `tasks/BUGS_AND_FIXES.md` if needed
3. Update `agent-notes/DECISIONS.md` if a major decision was made
4. Leave notes in your agent notes file

**Do NOT:**
- Use Unity, Godot, or Unreal
- Copy Nintendo assets, Zelda maps, or any copyrighted material
- Build monsters — human enemies only
- Overwrite another agent's files
- Make large architecture changes without documenting them in DECISIONS.md

---

## Agent Roles

| Agent | Responsibility |
|---|---|
| **Codex** | All TypeScript code in `src/` |
| **Claude** | Design docs, writing, quests, lore, planning |
| **Antigravity** | Structure, coordination, task tracking, deployment |

---

## License

Original game — all rights reserved. No copyrighted assets used.  
Built with browser-first tools: PlayCanvas, Vite, and TypeScript.
