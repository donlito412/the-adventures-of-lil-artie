/**
 * debug.ts — Development logging and debug utilities.
 */

import { GameConfig } from '../core/config';

const COLORS: Record<string, string> = {
  'Engine':           '#4fc3f7',
  'Physics':          '#ff8a65',
  'PlayerController': '#a5d6a7',
  'InputManager':     '#fff176',
  'EnemyAI':          '#f48fb1',
  'QuestManager':     '#ce93d8',
  'SaveSystem':       '#80cbc4',
  'World':            '#c5e1a5',
  'Boomerang':        '#ffcc80',
  'Dagger':           '#ef9a9a',
  'Whip':             '#bcaaa4',
  'default':          '#b0bec5',
};

export class Debug {
  static log(system: string, message: string): void {
    if (!GameConfig.DEBUG_MODE) return;
    const color = COLORS[system] ?? COLORS['default'];
    console.log(`%c[${system}] ${message}`, `color: ${color}`);
  }

  static warn(system: string, message: string): void {
    console.warn(`[${system}] ${message}`);
  }

  static error(system: string, message: string, err?: unknown): void {
    console.error(`[${system}] ${message}`, err ?? '');
  }

  static assert(condition: boolean, message: string): void {
    if (!condition) {
      Debug.error('Assert', message);
    }
  }

  static vector3(label: string, v: { x: number; y: number; z: number }): void {
    if (!GameConfig.DEBUG_MODE) return;
    console.log(`%c[Vec3] ${label}: (${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`, 'color: #b0bec5');
  }
}
