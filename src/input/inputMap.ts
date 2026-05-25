/**
 * inputMap.ts — Maps keyboard keys and gamepad buttons to named game actions.
 */

export type GameAction =
  | 'moveForward'
  | 'moveBack'
  | 'moveLeft'
  | 'moveRight'
  | 'run'
  | 'jump'
  | 'dodge'
  | 'attackPrimary'
  | 'attackSecondary'
  | 'weaponPrev'
  | 'weaponNext'
  | 'interact'
  | 'inventory'
  | 'map'
  | 'pause'
  | 'glide'
  | 'climbUp'
  | 'lockOn';

export interface KeyboardMap {
  [action: string]: string[];
}

export interface GamepadMap {
  buttons: { [action: string]: number };
  axes: {
    moveX: number;
    moveY: number;
    cameraX: number;
    cameraY: number;
  };
}

export const DEFAULT_KEYBOARD_MAP: KeyboardMap = {
  moveForward: ['KeyW', 'ArrowUp'],
  moveBack: ['KeyS', 'ArrowDown'],
  moveLeft: ['KeyA', 'ArrowLeft'],
  moveRight: ['KeyD', 'ArrowRight'],
  run: ['ShiftLeft', 'ShiftRight'],
  jump: ['Space'],
  dodge: ['KeyC'],
  attackPrimary: ['MouseLeft', 'KeyF'],
  attackSecondary: ['MouseRight', 'KeyG'],
  weaponPrev: ['KeyQ'],
  weaponNext: ['KeyE'],
  interact: ['KeyT'],
  inventory: ['KeyI', 'Tab'],
  map: ['KeyM'],
  pause: ['Escape'],
  glide: ['Space'],     // hold while in air
  climbUp: ['Space'],   // while against climbable surface
  lockOn: ['KeyL'],
};

// Xbox / Standard Gamepad button indices
export const XBOX_GAMEPAD_MAP: GamepadMap = {
  buttons: {
    jump: 0,           // A
    attackPrimary: 2,  // X
    attackSecondary: 1,// B
    dodge: 3,          // Y
    interact: 3,       // Y
    weaponPrev: 4,     // LB
    weaponNext: 5,     // RB
    inventory: 8,      // Select/View
    map: 8,
    pause: 9,          // Start/Menu
    lockOn: 10,        // L3
    run: 6,            // LT (axis > 0.5)
    glide: 0,          // A (hold in air)
  },
  axes: {
    moveX: 0,
    moveY: 1,
    cameraX: 2,
    cameraY: 3,
  },
};

// PlayStation controller button layout
export const PS_GAMEPAD_MAP: GamepadMap = {
  buttons: {
    jump: 0,           // Cross
    attackPrimary: 2,  // Square
    attackSecondary: 1,// Circle
    dodge: 3,          // Triangle
    interact: 3,       // Triangle
    weaponPrev: 4,     // L1
    weaponNext: 5,     // R1
    inventory: 8,      // Share
    map: 8,
    pause: 9,          // Options
    lockOn: 10,        // L3
    run: 6,            // L2 (axis > 0.5)
    glide: 0,          // Cross (hold in air)
  },
  axes: {
    moveX: 0,
    moveY: 1,
    cameraX: 2,
    cameraY: 3,
  },
};
