/**
 * gamepadInput.ts — Browser Gamepad API handler.
 * Supports Xbox and PlayStation controllers via the Standard Gamepad mapping.
 */

import { PS_GAMEPAD_MAP, XBOX_GAMEPAD_MAP, GameAction, GamepadMap } from './inputMap';
import { Debug } from '../utils/debug';

export type ControllerType = 'xbox' | 'playstation' | 'generic';

interface ButtonState {
  held: boolean;
  justPressed: boolean;
  justReleased: boolean;
}

export class GamepadInput {
  private gamepad: Gamepad | null = null;
  private controllerType: ControllerType = 'generic';
  private buttonStates: ButtonState[] = [];
  private prevButtonStates: boolean[] = [];
  private _wasRecentlyUsed = false;
  private recentUseTimer = 0;

  private readonly STICK_DEADZONE = 0.28;

  private onGamepadConnected = (e: GamepadEvent) => {
    this.gamepad = e.gamepad;
    this.controllerType = this.detectControllerType(e.gamepad.id);
    this.initButtonStates(e.gamepad.buttons.length);
    Debug.log('GamepadInput', `Controller connected: ${e.gamepad.id} (${this.controllerType})`);
  };

  private onGamepadDisconnected = (e: GamepadEvent) => {
    if (this.gamepad?.index === e.gamepad.index) {
      this.gamepad = null;
      Debug.log('GamepadInput', 'Controller disconnected.');
    }
  };

  init(): void {
    window.addEventListener('gamepadconnected', this.onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);

    // Check for already-connected gamepad
    const pads = navigator.getGamepads();
    for (const pad of pads) {
      if (pad) {
        this.gamepad = pad;
        this.controllerType = this.detectControllerType(pad.id);
        this.initButtonStates(pad.buttons.length);
        Debug.log('GamepadInput', `Found existing controller: ${pad.id}`);
        break;
      }
    }
  }

  update(): void {
    if (!this.gamepad) return;

    // Re-poll (required for Chrome)
    const pads = navigator.getGamepads();
    this.gamepad = pads[this.gamepad.index];
    if (!this.gamepad) return;

    const buttons = this.gamepad.buttons;
    const axes = this.axes;
    if (
      Math.abs(axes.moveX) > 0 ||
      Math.abs(axes.moveY) > 0 ||
      Math.abs(axes.cameraX) > 0 ||
      Math.abs(axes.cameraY) > 0
    ) {
      this._wasRecentlyUsed = true;
      this.recentUseTimer = 3;
    }

    for (let i = 0; i < buttons.length; i++) {
      const pressed = buttons[i].pressed;
      const prev = this.prevButtonStates[i] ?? false;

      this.buttonStates[i] = {
        held: pressed,
        justPressed: pressed && !prev,
        justReleased: !pressed && prev,
      };

      if (pressed) {
        this._wasRecentlyUsed = true;
        this.recentUseTimer = 3; // seconds
      }

      this.prevButtonStates[i] = pressed;
    }

    if (this.recentUseTimer > 0) {
      this.recentUseTimer -= 1 / 60;
    } else {
      this._wasRecentlyUsed = false;
    }
  }

  isActionPressed(action: GameAction): boolean {
    if (!this.gamepad) return false;
    const map = this.getMap();
    const buttonIndex = map.buttons[action];
    if (buttonIndex === undefined) return false;

    // Handle triggers as digital buttons (threshold 0.5)
    if (action === 'run') {
      return this.gamepad.buttons[buttonIndex]?.value > 0.5;
    }

    return this.buttonStates[buttonIndex]?.held ?? false;
  }

  wasJustPressed(action: GameAction): boolean {
    if (!this.gamepad) return false;
    const map = this.getMap();
    const buttonIndex = map.buttons[action];
    if (buttonIndex === undefined) return false;
    return this.buttonStates[buttonIndex]?.justPressed ?? false;
  }

  get axes(): { moveX: number; moveY: number; cameraX: number; cameraY: number } {
    if (!this.gamepad) return { moveX: 0, moveY: 0, cameraX: 0, cameraY: 0 };

    const map = this.getMap();
    const raw = this.gamepad.axes;

    return {
      moveX: this.applyDeadzone(raw[map.axes.moveX] ?? 0),
      moveY: -this.applyDeadzone(raw[map.axes.moveY] ?? 0),
      cameraX: this.applyDeadzone(raw[map.axes.cameraX] ?? 0),
      cameraY: this.applyDeadzone(raw[map.axes.cameraY] ?? 0),
    };
  }

  get isConnected(): boolean {
    return this.gamepad !== null;
  }

  get wasRecentlyUsed(): boolean {
    return this._wasRecentlyUsed;
  }

  get type(): ControllerType {
    return this.controllerType;
  }

  private detectControllerType(id: string): ControllerType {
    const lower = id.toLowerCase();
    if (lower.includes('xbox') || lower.includes('xinput')) return 'xbox';
    if (lower.includes('playstation') || lower.includes('dualshock') || lower.includes('dualsense')) return 'playstation';
    return 'generic';
  }

  private getMap(): GamepadMap {
    return this.controllerType === 'playstation' ? PS_GAMEPAD_MAP : XBOX_GAMEPAD_MAP;
  }

  private initButtonStates(count: number): void {
    this.buttonStates = Array.from({ length: count }, () => ({
      held: false,
      justPressed: false,
      justReleased: false,
    }));
    this.prevButtonStates = new Array(count).fill(false);
  }

  private applyDeadzone(value: number): number {
    if (Math.abs(value) < this.STICK_DEADZONE) return 0;
    // Rescale from deadzone to 1
    const sign = value > 0 ? 1 : -1;
    return sign * (Math.abs(value) - this.STICK_DEADZONE) / (1 - this.STICK_DEADZONE);
  }

  dispose(): void {
    window.removeEventListener('gamepadconnected', this.onGamepadConnected);
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
  }
}
