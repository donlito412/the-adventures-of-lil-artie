# BUGS AND FIXES

_Log bugs and their resolutions here. Format: `[DATE] [STATUS] Bug description → Fix applied`_

---

## Open Bugs

_None._

## Resolved Bugs

- [2026-05-25] [Resolved] Double terrain — `createWorld()` always created a visible ground box ON TOP of the loaded terrain GLB, resulting in two overlapping terrain objects → Rewrote terrain logic: GLB terrain is the sole terrain when loaded; fallback ground box only appears when the GLB is unavailable. File: `src/playcanvas/playCanvasGame.ts`.
- [2026-05-25] [Resolved] Character in T-pose — `PlayCanvasAssetLoader.loadSlot()` called `instantiateRenderEntity()` which renders the mesh but never initialises the PlayCanvas anim system → Rewrote `createPlayer()` to add the `anim` component, load a minimal state graph (START → locomotion → END), and call `assignAnimation()` with the first embedded animation clip from the GLB container. File: `src/playcanvas/playCanvasGame.ts`.
- [2026-05-25] [Resolved] PlayCanvas launch scene still showed the default `Plane` and `Box`, and Lil Artie was not placed on the real terrain → Disabled/moved the default objects in the Editor scene, moved Lil Artie onto the terrain area, attached the walking animation asset, and reframed the launch camera.

- [2026-05-25] [Resolved] TypeScript build failed on Vite env typing, Babylon engine type mismatch, and HUD GUI API usage -> Added Vite client typing, typed engine wrapper as AbstractEngine, and corrected HUD imports/alignment.
- [2026-05-25] [Resolved] First browser launch showed Babylon loading UI over the scene -> Replaced `displayLoadingUI()` FPS placeholder with a real DOM FPS overlay.
- [2026-05-25] [Resolved] Player fell through the prototype terrain because ground had no physics body -> Added a static Havok physics aggregate to the ground mesh.
- [2026-05-25] [Resolved] Missing GLB asset paths could be mistaken for valid files because Vite returned `index.html` -> Asset availability now rejects HTML responses and safely falls back to placeholders.
- [2026-05-25] [Resolved] Player/controller forward movement was inverted -> Keyboard forward and gamepad left-stick-up now map to positive forward movement.
- [2026-05-25] [Resolved] PlayCanvas REST curl calls were sent with an empty bearer value because inline shell assignment expanded too early -> Use a shell variable assigned before the `curl` command.

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
