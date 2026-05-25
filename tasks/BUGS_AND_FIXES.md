# BUGS AND FIXES

_Log bugs and their resolutions here. Format: `[DATE] [STATUS] Bug description → Fix applied`_

---

## Open Bugs

_None yet._

## Resolved Bugs

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
