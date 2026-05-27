# CODEX NOTES

## Session: 2026-05-26 — Babylon.js Runtime Restored

**Status**: Active runtime is Babylon.js again.

**Completed:**
- Removed PlayCanvas runtime and Editor automation files from the active repo.
- Replaced PlayCanvas dependency with Babylon.js, Babylon GUI, Babylon loaders, and Havok.
- Rewired `src/game.ts` to use the Babylon engine, shared input manager, and scene manager.
- Updated README, task files, tools docs, bug log, and decision log back to Babylon.js.
- Added local Havok WASM serving so Babylon physics initializes in Vite dev and production builds.

**Note:**
- Older PlayCanvas notes below are historical only and are no longer active project direction.

---

## Session: 2026-05-26 — Real Asset Playable Level Pass

**Status**: Babylon scene uses confirmed local assets instead of visible blockout dressing.

**Completed:**
- Fixed third-person camera-relative movement yaw.
- Increased gamepad deadzones so controller drift does not move the player at idle.
- Paused Lil Artie's embedded walking animation while idle.
- Loaded real GLB assets for terrain-derived level mesh, tree, rock, cliff, pillar, treasure chest, weapons, player, NPC, and one human enemy.
- Converted the oversized `terrain_dristibute_gn.glb` source into a lightweight heightfield JSON because loading the raw 352 MB GLB crashed the browser.
- Added `docs/ASSET_INVENTORY.md`.

**Needs assets:**
- Distinct human enemy models, distinct NPC models, jungle village/camp kit, cave entrance kit, optimized terrain material set, and final matched animation set.

---

Notes and observations from the Codex agent (code implementation).

---

## Session: 2026-05-25 — Terrain Dupe + T-Pose Fix

**Status**: Both bugs fixed, TypeScript clean.

**Bug 1 — Double terrain:**
- Root cause: `createWorld()` always loaded the terrain GLB AND always created a ground box. When terrain loaded, the box was rendered with `opacity: 0.18` which still showed as a second layer.
- Fix: Terrain logic now follows a strict either/or pattern — if the GLB loads, that is the terrain, nothing else is added. If the GLB is unavailable, the fallback flat green ground box appears.

**Bug 2 — T-pose / no animation:**
- Root cause: `PlayCanvasAssetLoader.loadSlot()` called `instantiateRenderEntity()` which creates the mesh hierarchy but does NOT initialise the PlayCanvas animation state machine. The `anim` component was never added.
- Fix: Replaced the old loader-based player creation with a direct `loadFromUrl` call in `createPlayer()`. After mesh instantiation, the code now adds the `anim` component, calls `loadStateGraph()` with a minimal one-layer graph (START → locomotion → END), and calls `assignAnimation('locomotion', animAssets[0].resource, 'Base Layer')`.
- The walking animation embedded in `lil-artie.glb` (Meshy Walking GLB) now plays automatically on load.

**Editor scene cleanup:**
- Disabled and moved the default PlayCanvas `Box` and `Plane` out of the active scene view.
- Moved `REAL_LIL_ARTIE__meshy_character` onto the terrain area.
- Attached the uploaded walking animation asset to Lil Artie in the Editor scene.
- Reframed the launch camera toward Lil Artie and the terrain.

**Verified:**
- `npx tsc --noEmit` → clean
- `npx vite build` → 1168 modules transformed successfully (EPERM on .DS_Store is a Linux sandbox limitation only, not a code issue)

**Next priorities:**
1. Wire animation state to movement — play walk clip when moving, idle (or pause) when still.
2. Import additional Meshy animation GLBs (run, jump, attack) and add them as named states.
3. Tune player spawn height against the real terrain surface.

---

## Session: 2026-05-24 — Project Initialization

**Status**: Project scaffolded. Source stubs created.

**Architecture decisions implemented:**
- Used `@babylonjs/core` v7.x for scene, mesh, physics
- Havok physics via `@babylonjs/havok` — async initialization required
- Vite aliases set up for all src/ subdirectories
- WebGPU with WebGL fallback in `engine.ts`
- Input system uses three-layer merge: gamepad > keyboard > mouse for movement, gamepad and keyboard for camera

**Files created:**
- All 50+ TypeScript source stubs in src/
- All stubs include interfaces, class shells, and TODO comments for implementation

**Next coding priorities:**
1. Hook up Havok physics properly with capsule collider on player
2. Implement proper grounded check via physics raycast (currently approximate)
3. Wire up BabylonJS Gamepad Manager alongside Browser Gamepad API for gamepad support
4. Test that Babylon GUI (AdvancedDynamicTexture) renders HUD correctly
5. Implement proper boomerang hit detection with sphere overlap query

**Known limitations in current stubs:**
- `playerMovement.ts`: grounded check is a velocity approximation, needs proper physics raycast
- `climbing.ts`: uses ray + metadata tag — need to tag climbable meshes in worldManager
- `whipSwing.ts`: pendulum physics is simplified — may need constraints API
- `boomerang.ts`: no actual hit detection yet — needs sphere overlap query each frame

**DO NOT overwrite:** worldManager.ts (scene setup is working reference), game.ts (entry point)

---

## Session: 2026-05-25 — First Runnable Build

**Status**: Phase 1 is now runnable and verified.

**Completed:**
- Installed npm dependencies and generated `package-lock.json`
- Added Vite client type reference in `src/vite-env.d.ts`
- Fixed Babylon engine typing so WebGPU and WebGL fallback both compile through `AbstractEngine`
- Fixed HUD GUI imports and right-aligned quest text positioning
- Replaced incorrect Babylon loading UI FPS placeholder with a DOM FPS counter
- Added a static Havok physics body to the ground so the player does not fall through the scene

**Verified:**
- `npm run type-check`
- `npm run build`

---

## Session: 2026-05-25 — Live PlayCanvas Scene Fix

**Status**: Live scene cleanup, terrain placement, and movement fixed in PlayCanvas Editor.

**Completed:**
- Removed the default `Box` and `Plane` entities from the live PlayCanvas hierarchy
- Corrected the launch camera yaw so it faces Lil Artie
- Initial placement still left Lil Artie at the terrain edge with most of the launch view showing empty void
- Moved Lil Artie and the launch camera farther into the snowy terrain mesh so the launch opens on playable terrain
- Attached `lilArtieInput` and `lilArtiePlayerController` to `REAL_LIL_ARTIE__meshy_character`
- Attached `thirdPersonCameraRig` to `Camera`

**Verified:**
- Live PlayCanvas launch shows Lil Artie standing on the snowy terrain with the default box/plane gone
- Keyboard `W` movement moves Lil Artie in the live PlayCanvas launch

**Remaining risk:**
- The PlayCanvas account is over disk allowance, so additional asset uploads will fail until space is cleared or the plan is upgraded.

---

## Session: 2026-05-25 — PlayCanvas Engine Switch

**Status**: Active runtime switched to PlayCanvas.

**Completed:**
- Installed `playcanvas`
- Removed Babylon runtime dependencies
- Replaced active `src/main.ts` and `src/game.ts`
- Added `src/playcanvas/` runtime files
- Added PlayCanvas GLB asset-slot loader
- Updated TypeScript include list to check the active PlayCanvas runtime only
- Updated README, asset intake notes, and decision log

**Active asset slots:**
- `public/assets/models/characters/lil-artie.glb`
- `public/assets/models/weapons/boomerang.glb`
- `public/assets/models/weapons/dagger.glb`
- `public/assets/models/weapons/whip.glb`

**Remaining transition work:**
- Rebuild gameplay systems in PlayCanvas instead of carrying Babylon-specific code forward.
- Import real assets and tune scale/materials before rebuilding combat/traversal.
- Local dev server at `http://127.0.0.1:3000/`
- Browser scene renders with canvas, HUD bars, FPS counter, Lil Artie placeholder, and visible terrain

**Next coding priorities:**
1. Build the actual Phase 2 input pass from the existing scaffold.
2. Make movement feel playable: grounded check, walking/running/jumping validation, and camera framing.
3. Add visible prototype island objects before expanding combat or quests.

---

## Session: 2026-05-25 — PlayCanvas REST Automation

**Status**: PlayCanvas project automation is active.

**Completed:**
- Generated a PlayCanvas REST API token named `Codex Automation`
- Confirmed project ID `1533403`, scene ID `2507920`, and branch `main`
- Added Editor-ready classic PlayCanvas scripts under `public/playcanvas/scripts/`
- Added `public/playcanvas/data/projectSetupManifest.json`
- Uploaded the following assets to PlayCanvas through REST API:
  - `assetSlotMarker.js`
  - `lilArtieInput.js`
  - `lilArtiePlayerController.js`
  - `thirdPersonCameraRig.js`
  - `projectSetupManifest.json`

**Important:**
- Do not commit or print the PlayCanvas API token.
- REST API can upload script/json assets and list project assets.
- Scene hierarchy edits still need Editor API, the PlayCanvas browser editor, or a dedicated PlayCanvas MCP/browser bridge.

**Next coding priorities:**
1. Attach uploaded scripts to entities in the PlayCanvas Editor scene.
2. Import first real GLB assets and assign them to the manifest slots.
3. Replace local placeholder runtime with the same PlayCanvas script behavior used online.

---

## Session: 2026-05-25 — Terrain Asset Intake

**Status**: First real terrain asset is wired into the active runtime.

**Completed:**
- Selected `public/assets/models/snowy_mountain_terrain__optimized_mesh.glb` as the first active terrain asset
- Left `public/assets/terrain_dristibute_gn.glb` out of the active runtime because it is too large for the current browser scene pass
- Added `prototypeTerrain` to the PlayCanvas asset manifest
- Updated the PlayCanvas world bootstrap to load the terrain GLB before creating the player
- Kept a thin base collider under the imported terrain for current movement testing
- Uploaded the selected terrain GLB to the PlayCanvas project asset library
- Placed the uploaded terrain model into the PlayCanvas Editor scene hierarchy as `REAL_TERRAIN__snowy_mountain_terrain`

**Verified:**
- `npm run type-check`
- `npm run build`

**Next coding priorities:**
1. Tune terrain scale and player spawn height after visual placement.
2. Replace the temporary base collider with terrain-appropriate collision.
3. Add the real Lil Artie character asset next.

---

## Session: 2026-05-25 — Meshy Character Intake

**Status**: First real Lil Artie character asset is wired into the active runtime.

**Completed:**
- Selected the Meshy walking skinned GLB as the first runtime character model
- Copied it to `public/assets/models/characters/lil-artie.glb`
- Uploaded `lil-artie.glb` to PlayCanvas project `1533403`
- Placed the generated model in the Editor scene as `REAL_LIL_ARTIE__meshy_character`
- Left the full Meshy source folder and zip untracked as source/staging files

**Next coding priorities:**
1. Tune character scale and spawn height against the real terrain.
2. Connect the walking animation asset to the player controller.
3. Decide which Meshy animation GLBs should be merged into the final character animation set.

---

## Session: 2026-05-25 — Phase 2 Input System

**Status**: Phase 2 input support is implemented and build-verified.

**Completed:**
- Moved runtime input ownership to one shared `InputManager`
- Fixed keyboard just-pressed/just-released tracking
- Added mouse just-pressed tracking and per-frame camera delta updates
- Added canvas pointer lock for mouse camera control
- Cleaned up Xbox/PlayStation mapping selection
- Added active input device and controller type tracking
- Connected controller prompt detection to HUD

**Verified:**
- `npm run type-check`
- `npm run build`
- Browser scene reload at `http://127.0.0.1:3000/`

**Remaining risk:**
- Physical Xbox/PlayStation controller behavior still needs hardware testing.

---

## Session: 2026-05-25 — Phase 3 Player Controller

**Status**: Phase 3 player controller is implemented and build-verified.

**Completed:**
- Added ray-based grounded checks for the player capsule
- Added stamina-gated dodge movement
- Kept run stamina drain tied to movement and grounded state
- Tuned third-person camera startup framing
- Synced inventory weapon switching with `WeaponManager`
- Added player dodge config values

**Verified:**
- `npm run type-check`
- `npm run build`
- Browser scene reload at `http://127.0.0.1:3000/`

**Remaining risk:**
- Manual keyboard/controller feel testing is still needed for movement tuning.

---

## Session: 2026-05-25 — Phase 4 Traversal

**Status**: Phase 4 traversal is implemented and build-verified.

**Completed:**
- Integrated climb surface detection into `PlayerMovement`
- Added ledge grab and pull-up handling
- Added airborne gliding with stamina drain
- Added water-zone swimming detection
- Added run-dodge sliding behavior
- Added whip swing point detection and attach/release flow
- Added fall damage based on landing impact velocity
- Added traversal test geometry to Prototype Island

**Verified:**
- `npm run type-check`
- `npm run build`
- Fresh browser launch at `http://127.0.0.1:3000/`

**Remaining risk:**
- Traversal feel still needs manual tuning after playtesting.

---

## Session: 2026-05-25 — Phase 5 Weapons

**Status**: Phase 5 weapon prototypes are implemented and build-verified.

**Completed:**
- Added shared enemy hit detection helpers
- Exposed enemy metadata for weapon damage
- Added boomerang throw/return hit flow
- Added dagger attack and combo hit flow
- Added whip hit, stun/disarm, and swing anchor raycast flow
- Kept inventory weapon switching connected to active combat weapon

**Verified:**
- `npm run type-check`
- `npm run build`
- Fresh browser launch at `http://127.0.0.1:3000/`

**Remaining risk:**
- Weapon range, hit timing, and combat feel need manual playtesting.

---

## Session: 2026-05-25 — Phase 6 Enemy AI

**Status**: Phase 6 enemy AI prototype is implemented and build-verified.

**Completed:**
- Added player damage callback wiring from enemies through `EnemySpawner`
- Added enemy health bars and health color feedback
- Added state color feedback for patrol, alert, chase, attack, search, stunned, and defeated
- Added stronger hit reaction and stun behavior
- Added defeated enemy cleanup from spawner and weapon targeting
- Kept enemy camp spawning active in Prototype Island

**Verified:**
- `npm run type-check`
- `npm run build`
- Fresh browser launch at `http://127.0.0.1:3000/`

**Remaining risk:**
- Enemy chase/attack balance needs manual playtesting once terrain and camp layout are richer.

---

## Session: 2026-05-25 — Phase 7 World Prototype

**Status**: Phase 7 world prototype is implemented and build-verified.

**Completed:**
- Added lightweight trees and rocks to Prototype Island
- Added water test area
- Added cave entrance placeholder
- Added enemy camp props
- Added village test area and huts
- Added Elder Kwame NPC using existing dialogue data
- Added asset-slot metadata for future GLB replacement from Meshy, purchased packs, Blender, or PlayCanvas Editor exports
- Removed unused asset-loader instantiation from procedural environment generation

**Asset style direction:**
- Stylized 3D adventure
- Low-to-mid poly models
- Strong silhouettes and readable shapes
- Warm jungle/coastal color palette
- Clean PBR-light materials, not photoreal
- All imports should be normalized to game scale and exported as GLB/GLTF

**Verified:**
- `npm run type-check`
- `npm run build`
- Browser scene launch at `http://127.0.0.1:3000/`
- In-browser scene ran around 50 FPS after placeholder optimization

**Remaining risk:**
- Purchased assets must be checked for license, file format, poly count, texture paths, rig compatibility, and visual fit before import.

---

## Session: 2026-05-25 — Asset Integration Pivot

**Status**: First real-asset slots are wired.

**Completed:**
- Added optional GLB loading with safe placeholder fallback
- Added auto-load slots for Lil Artie, boomerang, dagger, and whip
- Fixed missing GLB paths incorrectly resolving as Vite HTML responses
- Added `tools/asset-intake.md` with style rules and exact drop-in filenames

**First asset filenames:**
- `public/assets/models/characters/lil-artie.glb`
- `public/assets/models/weapons/boomerang.glb`
- `public/assets/models/weapons/dagger.glb`
- `public/assets/models/weapons/whip.glb`

**Verified:**
- `npm run type-check`
- `npm run build`
- Browser startup reaches Ready with missing assets using fallback placeholders

---

## Session: 2026-05-25 — Movement Direction Fix

**Status**: Forward/back movement inversion fixed.

**Completed:**
- Changed keyboard W/up arrow to positive forward movement
- Inverted gamepad Y axis so left-stick-up maps to positive forward movement

**Verified:**
- `npm run type-check`
- `npm run build`

---

## Session: 2026-05-26 — Local Real-Asset Playable Scene

**Status**: Local PlayCanvas scene is rendering with real assets and no PlayCanvas cloud storage dependency.

**Completed:**
- Copied usable GLB assets from `/Volumes/Lito's Hard Drive/Lito's Games/Wolf Pacc/Assets/Models`.
- Added real oak tree, rock, cliff, chest, temple pillar, boomerang, dagger, and whip GLBs to `public/assets`.
- Kept Meshy `lil-artie.glb` as the playable character because it includes an animation clip.
- Fixed PlayCanvas anim graph setup by adding required `parameters`.
- Scaled Lil Artie down to playable size.
- Added camera-relative keyboard/gamepad movement and mouse-drag camera orbit.
- Added local debug state for player position inspection.

**Verified:**
- Browser render at `http://127.0.0.1:3001/`.
- `npm run build`.

**Remaining risk:**
- Manual held-key/controller testing still needs to be done in the visible browser because the browser automation layer blocked synthetic held input.
