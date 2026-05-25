# DECISIONS LOG

Major architectural and design decisions. All agents must read this before starting work.

---

## [2026-05-24] Engine Choice: Babylon.js + Vite + TypeScript

**Status**: Superseded on 2026-05-25 by PlayCanvas First.

**Decision**: Use Babylon.js v7 with Vite bundler and TypeScript.
**Alternatives considered**: Three.js (less game-focused), A-Frame (too limited), PlayCanvas (proprietary).
**Reason**: Babylon.js has built-in physics (Havok), input (Gamepad Manager), GUI, and loaders. Best WebGPU support. Active community.
**Impact**: All code uses `@babylonjs/core` imports. No mixing of rendering engines.

---

## [2026-05-24] Physics: Havok via @babylonjs/havok

**Status**: Superseded on 2026-05-25 by PlayCanvas First.

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

## [2026-05-25] Engine Pivot: PlayCanvas First

**Decision**: Switch the active runtime from Babylon.js to PlayCanvas.
**Reason**: The project needs a sellable asset-first workflow with an online editor, real GLB assets, visual scene layout, and fewer tool switches.
**Impact**: `src/main.ts`, `src/game.ts`, and `src/playcanvas/` are the active runtime. Babylon prototype files remain temporarily as inactive reference code. Dependencies now use `playcanvas`.
