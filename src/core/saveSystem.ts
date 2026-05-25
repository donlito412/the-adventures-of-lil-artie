/**
 * saveSystem.ts — Browser localStorage save/load system
 */

import { Debug } from '../utils/debug';

export interface SaveData {
  version: string;
  timestamp: number;
  player: {
    position: { x: number; y: number; z: number };
    health: number;
    stamina: number;
    activeWeapon: string;
  };
  inventory: string[];
  completedQuests: string[];
  openedChests: string[];
  world: {
    defeatedEnemies: string[];
  };
}

const SAVE_KEY = 'lil-artie-save';
const SAVE_VERSION = '0.1.0';

export class SaveSystem {
  private static defaultSave(): SaveData {
    return {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      player: {
        position: { x: 0, y: 2, z: 0 },
        health: 100,
        stamina: 100,
        activeWeapon: 'boomerang',
      },
      inventory: ['boomerang', 'dagger', 'whip'],
      completedQuests: [],
      openedChests: [],
      world: {
        defeatedEnemies: [],
      },
    };
  }

  static save(data: Partial<SaveData>): void {
    try {
      const existing = SaveSystem.load() ?? SaveSystem.defaultSave();
      const merged: SaveData = {
        ...existing,
        ...data,
        timestamp: Date.now(),
        version: SAVE_VERSION,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(merged));
      Debug.log('SaveSystem', 'Game saved.');
    } catch (err) {
      Debug.warn('SaveSystem', `Save failed: ${err}`);
    }
  }

  static load(): SaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw) as SaveData;
      if (data.version !== SAVE_VERSION) {
        Debug.warn('SaveSystem', `Save version mismatch (${data.version} vs ${SAVE_VERSION}). Resetting.`);
        return null;
      }
      return data;
    } catch (err) {
      Debug.warn('SaveSystem', `Load failed: ${err}`);
      return null;
    }
  }

  static deleteSave(): void {
    localStorage.removeItem(SAVE_KEY);
    Debug.log('SaveSystem', 'Save deleted.');
  }

  static hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  static getDefaultSave(): SaveData {
    return SaveSystem.defaultSave();
  }
}
