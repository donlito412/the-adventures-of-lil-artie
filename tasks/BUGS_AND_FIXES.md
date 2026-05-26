# BUGS AND FIXES

_Log bugs and their resolutions here. Format: `[DATE] [STATUS] Bug description → Fix applied`_

---

## Open Bugs

_None._

## Resolved Bugs

- [2026-05-25] [Resolved] Double terrain — `createWorld()` always created a visible ground box ON TOP of the loaded terrain GLB, resulting in two overlapping terrain objects → Rewrote terrain logic: GLB terrain is the sole terrain when loaded; fallback ground box only appears when the GLB is unavailable. File: `src/playcanvas/playCanvasGame.ts`.
- [2026-05-25] [Resolved] Character in T-pose — `PlayCanvasAssetLoader.loadSlot()` called `instantiateRenderEntity()` which renders the mesh but never initialises the PlayCanvas anim system → Rewrote `createPlayer()` to add the `anim` component, load a minimal state graph (START → locomotion → END), and call `assignAnimation()` with the first embedded animation clip from the GLB container. File: `src/playcanvas/playCanvasGame.ts`.
- [2026-05-25] [Resolved] PlayCanvas launch scene still showed the default `Plane` and `Box`, and Lil Artie was not placed on the real terrain → Disabled/moved the default objects in the Editor scene, moved Lil Artie onto the terrain area, attached the walking animation asset, and reframed the launch camera.
- [2026-05-25] [Resolved] Live PlayCanvas launch still showed Lil Artie floating in the terrain gap after cleanup → Removed the default `Box`/`Plane` from the Editor hierarchy, corrected the launch camera rotation, and offset Lil Artie onto the visible snowy terrain mesh.
- [2026-05-25] [Resolved] First live placement still left Lil Artie near the terrain edge with most of the launch view showing empty void → Moved Lil Artie and the launch camera deeper into the snowy terrain mesh so the live launch opens on playable terrain instead of the gap.
- [2026-05-25] [Resolved] Live PlayCanvas Lil Artie could not move because the uploaded controller scripts were not attached to the real character/camera entities → Attached `lilArtieInput` and `lilArtiePlayerController` to `REAL_LIL_ARTIE__meshy_character`, attached `thirdPersonCameraRig` to `Camera`, and verified keyboard movement in launch.

- [2026-05-25] [Resolved] TypeScript build failed on Vite env typing, Babylon engine type mismatch, and HUD GUI API usage -> Added Vite client typing, typed engine wrapper as AbstractEngine, and corrected HUD imports/alignment.
- [2026-05-25] [Resolved] First browser launch showed Babylon loading UI over the scene -> Replaced `displayLoadingUI()` FPS placeholder with a real DOM FPS overlay.
- [2026-05-25] [Resolved] Player fell through the prototype terrain because ground had no physics body -> Added a static Havok physics aggregate to the ground mesh.
- [2026-05-25] [Resolved] Missing GLB asset paths could be mistaken for valid files because Vite returned `index.html` -> Asset availability now rejects HTML responses and safely falls back to placeholders.
- [2026-05-25] [Resolved] Player/controller forward movement was inverted -> Keyboard forward and gamepad left-stick-up now map to positive forward movement.
- [2026-05-25] [Resolved] PlayCanvas REST curl calls were sent with an empty bearer value because inline shell assignment expanded too early -> Use a shell variable assigned before the `curl` command.
- [2026-05-26] [Resolved] Local PlayCanvas Lil Artie fell back to a capsule after loading the animated Meshy GLB because the animation state graph was missing `parameters` -> Added the required graph parameters object and kept the real mesh loaded even if animation setup fails.
- [2026-05-26] [Resolved] Local Lil Artie rendered at giant scale in the playable scene -> Normalized the Meshy character asset scale to `0.014` in `src/playcanvas/assetManifest.ts`.

---

## Bug Report Template

```
**ID**: BUG-001
**Date**: YYYY-MM-DD
**Reporter**: [Agent or human]
**Status**: Open | In Progress | Resolved
**Severity**: Critical | High | Medium | Low
**System**: (e.g., PlayerMovement, EnemyAI, Physics)
**Description**: What is happening?
**Expected**: What should happen?
**Steps to Reproduce**:
  1.
  2.
**Fix Applied**: (leave blank if open)
**Commit/File**: (reference to where fix was made)
```
