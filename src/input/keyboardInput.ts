/**
 * keyboardInput.ts — Keyboard state tracker.
 */

import { DEFAULT_KEYBOARD_MAP, GameAction } from './inputMap';

export class KeyboardInput {
  private heldKeys = new Set<string>();
  private prevHeldKeys = new Set<string>();
  private justPressedKeys = new Set<string>();
  private justReleasedKeys = new Set<string>();

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.isMappedKey(e.code)) e.preventDefault();
    this.heldKeys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (this.isMappedKey(e.code)) e.preventDefault();
    this.heldKeys.delete(e.code);
  };

  init(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  update(): void {
    this.justPressedKeys.clear();
    this.justReleasedKeys.clear();

    for (const key of this.heldKeys) {
      if (!this.prevHeldKeys.has(key)) {
        this.justPressedKeys.add(key);
      }
    }

    for (const key of this.prevHeldKeys) {
      if (!this.heldKeys.has(key)) {
        this.justReleasedKeys.add(key);
      }
    }

    this.prevHeldKeys = new Set(this.heldKeys);
  }

  isActionPressed(action: GameAction): boolean {
    const keys = DEFAULT_KEYBOARD_MAP[action] ?? [];
    return keys.some(k => this.heldKeys.has(k));
  }

  wasJustPressed(action: GameAction): boolean {
    const keys = DEFAULT_KEYBOARD_MAP[action] ?? [];
    return keys.some(k => this.justPressedKeys.has(k));
  }

  wasJustReleased(action: GameAction): boolean {
    const keys = DEFAULT_KEYBOARD_MAP[action] ?? [];
    return keys.some(k => this.justReleasedKeys.has(k));
  }

  isKeyHeld(code: string): boolean {
    return this.heldKeys.has(code);
  }

  getMovementAxes(): { x: number; y: number } {
    let x = 0;
    let y = 0;
    if (this.heldKeys.has('KeyA') || this.heldKeys.has('ArrowLeft')) x -= 1;
    if (this.heldKeys.has('KeyD') || this.heldKeys.has('ArrowRight')) x += 1;
    if (this.heldKeys.has('KeyW') || this.heldKeys.has('ArrowUp')) y += 1;
    if (this.heldKeys.has('KeyS') || this.heldKeys.has('ArrowDown')) y -= 1;
    // Normalize diagonal
    if (x !== 0 && y !== 0) {
      x *= 0.707;
      y *= 0.707;
    }
    return { x, y };
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private isMappedKey(code: string): boolean {
    return Object.values(DEFAULT_KEYBOARD_MAP).some(keys => keys.includes(code));
  }
}
