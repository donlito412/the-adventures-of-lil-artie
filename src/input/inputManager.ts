/**
 * inputManager.ts — Central input dispatcher.
 * Aggregates keyboard, mouse, and gamepad inputs into named game actions.
 */

import { KeyboardInput } from './keyboardInput';
import { MouseInput } from './mouseInput';
import { ControllerType, GamepadInput } from './gamepadInput';
import { GameAction } from './inputMap';

export type InputState = {
  [key in GameAction]: boolean;
};

export interface AxisState {
  moveX: number;
  moveY: number;
  cameraX: number;
  cameraY: number;
}

export class InputManager {
  private keyboard!: KeyboardInput;
  private mouse!: MouseInput;
  private gamepad!: GamepadInput;

  private _actions: InputState = {} as InputState;
  private _axes: AxisState = { moveX: 0, moveY: 0, cameraX: 0, cameraY: 0 };
  private lastInputDevice: 'keyboard' | 'gamepad' = 'keyboard';

  init(pointerLockTarget?: HTMLElement): void {
    this.keyboard = new KeyboardInput();
    this.mouse = new MouseInput();
    this.gamepad = new GamepadInput();

    this.keyboard.init();
    this.mouse.init(pointerLockTarget);
    this.gamepad.init();
  }

  update(): void {
    this.keyboard.update();
    this.mouse.update();
    this.gamepad.update();

    // Merge all input sources — gamepad takes priority for axes
    const gp = this.gamepad.isConnected;

    // Actions
    const actions: GameAction[] = [
      'moveForward', 'moveBack', 'moveLeft', 'moveRight',
      'run', 'jump', 'dodge', 'attackPrimary', 'attackSecondary',
      'weaponPrev', 'weaponNext', 'interact', 'inventory', 'map',
      'pause', 'glide', 'climbUp', 'lockOn',
    ];

    for (const action of actions) {
      this._actions[action] =
        this.keyboard.isActionPressed(action) ||
        (gp && this.gamepad.isActionPressed(action)) ||
        this.mouse.isActionPressed(action);
    }

    // Movement axes — prefer gamepad if connected and active
    const gpAxes = this.gamepad.axes;
    const kbAxes = this.keyboard.getMovementAxes();

    if (gp && (Math.abs(gpAxes.moveX) > 0.2 || Math.abs(gpAxes.moveY) > 0.2)) {
      this._axes.moveX = gpAxes.moveX;
      this._axes.moveY = gpAxes.moveY;
    } else {
      this._axes.moveX = kbAxes.x;
      this._axes.moveY = kbAxes.y;
    }

    this._axes.cameraX = gp && Math.abs(gpAxes.cameraX) > 0.2 ? gpAxes.cameraX : this.mouse.deltaX;
    this._axes.cameraY = gp && Math.abs(gpAxes.cameraY) > 0.2 ? gpAxes.cameraY : this.mouse.deltaY;

    if (gp && this.gamepad.wasRecentlyUsed) {
      this.lastInputDevice = 'gamepad';
    } else if (
      Object.values(this._actions).some(Boolean) ||
      Math.abs(kbAxes.x) > 0 ||
      Math.abs(kbAxes.y) > 0 ||
      Math.abs(this.mouse.deltaX) > 0 ||
      Math.abs(this.mouse.deltaY) > 0
    ) {
      this.lastInputDevice = 'keyboard';
    }
  }

  isPressed(action: GameAction): boolean {
    return this._actions[action] ?? false;
  }

  wasJustPressed(action: GameAction): boolean {
    return (
      this.keyboard.wasJustPressed(action) ||
      this.gamepad.wasJustPressed(action) ||
      this.mouse.wasJustPressed(action)
    );
  }

  get axes(): AxisState {
    return this._axes;
  }

  get gamepadConnected(): boolean {
    return this.gamepad.isConnected;
  }

  get activeInputDevice(): 'keyboard' | 'gamepad' {
    return this.lastInputDevice;
  }

  get activeControllerType(): ControllerType | 'keyboard' {
    return this.lastInputDevice === 'gamepad' ? this.gamepad.type : 'keyboard';
  }

  dispose(): void {
    this.keyboard.dispose();
    this.mouse.dispose();
    this.gamepad.dispose();
  }
}
