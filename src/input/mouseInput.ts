/**
 * mouseInput.ts — Mouse state and pointer lock handler.
 */

import { GameAction } from './inputMap';

export class MouseInput {
  private pointerLockTarget: HTMLElement | null = null;
  private heldButtons = new Set<number>();
  private prevHeldButtons = new Set<number>();
  private justPressedButtons = new Set<number>();
  private justReleasedButtons = new Set<number>();
  private _deltaX = 0;
  private _deltaY = 0;
  private _rawDeltaX = 0;
  private _rawDeltaY = 0;
  private pointerLocked = false;

  private readonly MOUSE_SENSITIVITY = 0.002;

  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0 || e.button === 2) e.preventDefault();
    this.heldButtons.add(e.button);
  };

  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 0 || e.button === 2) e.preventDefault();
    this.heldButtons.delete(e.button);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.pointerLocked) {
      this._rawDeltaX += e.movementX;
      this._rawDeltaY += e.movementY;
    }
  };

  private onPointerLockChange = () => {
    this.pointerLocked = document.pointerLockElement !== null;
  };

  private onTargetClick = () => {
    this.pointerLockTarget?.requestPointerLock();
  };

  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  init(pointerLockTarget?: HTMLElement): void {
    this.pointerLockTarget = pointerLockTarget ?? null;
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    this.pointerLockTarget?.addEventListener('click', this.onTargetClick);
    this.pointerLockTarget?.addEventListener('contextmenu', this.onContextMenu);
  }

  update(): void {
    this.justPressedButtons.clear();
    this.justReleasedButtons.clear();

    for (const button of this.heldButtons) {
      if (!this.prevHeldButtons.has(button)) {
        this.justPressedButtons.add(button);
      }
    }

    for (const button of this.prevHeldButtons) {
      if (!this.heldButtons.has(button)) {
        this.justReleasedButtons.add(button);
      }
    }

    this.prevHeldButtons = new Set(this.heldButtons);

    this._deltaX = this._rawDeltaX * this.MOUSE_SENSITIVITY;
    this._deltaY = this._rawDeltaY * this.MOUSE_SENSITIVITY;
    this._rawDeltaX = 0;
    this._rawDeltaY = 0;
  }

  isActionPressed(action: GameAction): boolean {
    if (action === 'attackPrimary') return this.heldButtons.has(0);
    if (action === 'attackSecondary') return this.heldButtons.has(2);
    return false;
  }

  wasJustPressed(action: GameAction): boolean {
    if (action === 'attackPrimary') return this.justPressedButtons.has(0);
    if (action === 'attackSecondary') return this.justPressedButtons.has(2);
    return false;
  }

  get deltaX(): number {
    return this._deltaX;
  }

  get deltaY(): number {
    return this._deltaY;
  }

  get isPointerLocked(): boolean {
    return this.pointerLocked;
  }

  requestPointerLock(element: HTMLElement): void {
    element.requestPointerLock();
  }

  dispose(): void {
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    this.pointerLockTarget?.removeEventListener('click', this.onTargetClick);
    this.pointerLockTarget?.removeEventListener('contextmenu', this.onContextMenu);
    this.pointerLockTarget = null;
  }
}
