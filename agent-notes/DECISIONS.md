# DECISIONS LOG

Major architectural and design decisions. All agents must read this before starting work.

---

## [2026-05-24] Engine Choice: Babylon.js + Vite + TypeScript

**Status**: Active again as of 2026-05-26.

**Decision**: Use Babylon.js v7 with Vite bundler and TypeScript.
**Alternatives considered**: Three.js (less game-focused), A-Frame (too limited), PlayCanvas (proprietary).
**Reason**: Babylon.js has built-in physics (Havok), input (Gamepad Manager), GUI, and loaders. Best WebGPU support. Active community.
**Impact**: All code uses `@babylonjs/core` imports. No mixing of rendering engines.

---

## [2026-05-24] Physics: Havok via @babylonjs/havok

**Status**: Active again as of 2026-05-26.

**Decision**: Use Havok WASM physics for player and enemy collision.
**Reason**: Babylon.js official physics plugin. Best performance for capsule colliders.
**Impact**: Physics init is async — engine.ts handles WebGPU/WebGL, worldManager.ts handles physics.

---

## [2026-05-24] Rendering: WebGPU first, WebGL fallback

**Decision**: Detect WebGPU support at startup. Fall back to WebGL if unavailable.
**Reason**: Future-proof. WebGPU gives better performance on supported browsers.
**Impact**: Engine class handles detection. Code using scene/mesh/lights is renderer-agnostic.

---

## [2026-05-24] Input Architecture: Three-layer merge

**Decision**: GamepadInput + KeyboardInput + MouseInput merged in InputManager.
**Reason**: Supports all controller types cleanly. Gamepad takes priority for movement axes when active.
**Impact**: All game code reads from InputManager only — never directly from keyboard/mouse/gamepad.

---

## [2026-05-24] Enemy Design: Human only, no monsters

**Decision**: All enemies are human characters (mercenaries, raiders, looters).
**Reason**: Original design vision — grounded adventure, not fantasy monster slaying.
**Impact**: EnemyBase models human behavior (patrol, alert, chase, search). No fantasy AI patterns.

---

## [2026-05-24] Weapons as Dual-Purpose Tools

**Decision**: Each weapon serves both combat AND traversal roles.
- Boomerang: ranged combat + can trigger switches at distance
- Whip: close combat + swing point grapple + disarm
- Dagger: fast melee + can cut rope/vines
**Reason**: Richer gameplay loop. Rewards creative use of tools.
**Impact**: Weapon classes expose both primaryAttack and secondaryAttack. Traversal modules reference weapon state.

---

## [2026-05-24] Save System: localStorage only for MVP

**Decision**: Use browser localStorage for save/load in MVP.
**Reason**: Simple, no backend required, works offline.
**Limitation**: ~5MB limit. Cloud saves can be added post-MVP via a backend.
**Impact**: SaveSystem.ts handles all save/load. Data is versioned (SAVE_VERSION constant).

---

## [2026-05-24] Asset Format: GLB (binary GLTF)

**Decision**: All 3D assets use GLB format.
**Reason**: Single-file binary format. Smaller file size than GLTF. Supported by @babylonjs/loaders.
**Impact**: Blender export rules documented in tools/blender-export-rules.md.

---

## [2026-05-25] Input Ownership: Single Shared InputManager

**Decision**: Game owns one InputManager and passes it into the active scene.
**Reason**: Prevents duplicate keyboard, mouse, and gamepad listeners and keeps just-pressed input events from being cleared before gameplay reads them.
**Impact**: `game.ts` updates input once per frame before scene update. Player, HUD, and scene systems read the same input state.

---

## [2026-05-25] Art Direction: Realistic / Stylized-Realistic, Not Low-Poly

**Decision**: Production assets should target a realistic premium adventure look. Do not use low-poly or stylized assets for sale-ready scenes.
**Reason**: The game is intended for commercial sale and should present higher visual quality than blockout or prototype art.
**Impact**: Meshy, purchased, Blender, and Babylon-ready GLB assets must be evaluated for realistic PBR materials, believable scale, and sufficient detail. Low-poly meshes are allowed only as invisible collision proxies or distant LODs.

---

## [2026-05-26] Engine Restore: Babylon.js Active Runtime

**Decision**: Revert the active runtime, tasks, and documentation back to Babylon.js.
**Reason**: PlayCanvas cloud storage limits and workflow friction made it a poor fit for the current production direction.
**Impact**: `src/game.ts` uses the Babylon engine, input manager, and scene manager again. PlayCanvas runtime and Editor automation files are removed from the active repo.

---

## [2026-05-26] Terrain Runtime: Heightfield From Real Source

**Decision**: Use a lightweight Babylon heightfield generated from `public/assets/terrain_dristibute_gn.glb` for the playable level.
**Reason**: The raw 352 MB terrain GLB crashed the browser when loaded directly.
**Impact**: The source terrain asset remains in `public/assets/terrain_dristibute_gn.glb`; runtime terrain data lives in `src/data/terrainHeightmap.json` and `public/maps/prototype-island/terrain-heightmap.json`.

---

## [2026-05-27] Character Asset Cleanup

**Decision**: Remove the current bundled Lil Artie and reused character GLBs from the active project.
**Reason**: They displayed as wrong T-pose/duplicate characters, and the final Lil Artie character will be supplied separately.
**Impact**: Player, NPC, and enemy systems keep invisible controller/collision meshes only until final character assets are added.
