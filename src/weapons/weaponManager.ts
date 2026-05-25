/**
 * weaponManager.ts — Manages the active weapon and weapon pool.
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { Boomerang } from './boomerang';
import { Dagger } from './dagger';
import { Whip } from './whip';
import { Debug } from '../utils/debug';

export interface Weapon {
  id: string;
  name: string;
  attackDuration: number;
  loadAsset?(): Promise<void>;
  primaryAttack(origin: any, yaw: number): void;
  secondaryAttack(origin: any, yaw: number): void;
  update(deltaTime: number, ownerPosition?: Vector3): void;
  dispose(): void;
}

export class WeaponManager {
  private scene: Scene;
  private weapons: Map<string, Weapon> = new Map();
  private _activeWeaponId: string = 'boomerang';

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async init(): Promise<void> {
    this.weapons.set('boomerang', new Boomerang(this.scene));
    this.weapons.set('dagger', new Dagger(this.scene));
    this.weapons.set('whip', new Whip(this.scene));

    await Promise.all(
      Array.from(this.weapons.values()).map(weapon => weapon.loadAsset?.() ?? Promise.resolve())
    );
    Debug.log('WeaponManager', 'All weapons initialized.');
  }

  update(deltaTime: number, ownerPosition?: Vector3): void {
    for (const weapon of this.weapons.values()) {
      weapon.update(deltaTime, ownerPosition);
    }
  }

  setActiveWeapon(id: string): void {
    if (this.weapons.has(id)) {
      this._activeWeaponId = id;
    }
  }

  get activeWeapon(): Weapon | undefined {
    return this.weapons.get(this._activeWeaponId);
  }

  get activeWeaponId(): string {
    return this._activeWeaponId;
  }

  dispose(): void {
    for (const weapon of this.weapons.values()) weapon.dispose();
    this.weapons.clear();
  }
}
