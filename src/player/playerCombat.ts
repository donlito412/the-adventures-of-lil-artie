/**
 * playerCombat.ts — Player combat state machine and hit detection.
 */

import { Scene, Mesh, Vector3 } from '@babylonjs/core';
import { InputManager } from '../input/inputManager';
import { PlayerStats } from './playerStats';
import { WeaponManager } from '../weapons/weaponManager';

export type CombatState = 'idle' | 'attacking' | 'recovering' | 'staggered' | 'dodging';

export class PlayerCombat {
  private scene: Scene;
  private playerMesh: Mesh;
  private input: InputManager;
  private stats: PlayerStats;
  private weaponManager: WeaponManager;

  private state: CombatState = 'idle';
  private attackTimer: number = 0;
  private comboCount: number = 0;
  private comboResetTimer: number = 0;
  private readonly COMBO_WINDOW = 0.6;

  constructor(
    scene: Scene,
    playerMesh: Mesh,
    input: InputManager,
    stats: PlayerStats,
    weaponManager: WeaponManager
  ) {
    this.scene = scene;
    this.playerMesh = playerMesh;
    this.input = input;
    this.stats = stats;
    this.weaponManager = weaponManager;
  }

  update(deltaTime: number): void {
    if (this.attackTimer > 0) this.attackTimer -= deltaTime;
    if (this.comboResetTimer > 0) this.comboResetTimer -= deltaTime;
    else this.comboCount = 0;

    if (this.attackTimer <= 0 && this.state === 'attacking') {
      this.state = 'idle';
    }

    // Primary attack
    if (this.input.wasJustPressed('attackPrimary') && this.canAttack()) {
      this.performPrimaryAttack();
    }

    // Secondary attack
    if (this.input.wasJustPressed('attackSecondary') && this.canAttack()) {
      this.performSecondaryAttack();
    }
  }

  private canAttack(): boolean {
    return this.state === 'idle' || (this.state === 'attacking' && this.comboCount < 3);
  }

  private performPrimaryAttack(): void {
    const weapon = this.weaponManager.activeWeapon;
    if (!weapon) return;

    weapon.primaryAttack(this.playerMesh.position, this.playerMesh.rotation.y);
    this.attackTimer = weapon.attackDuration;
    this.comboCount++;
    this.comboResetTimer = this.COMBO_WINDOW;
    this.state = 'attacking';
  }

  private performSecondaryAttack(): void {
    const weapon = this.weaponManager.activeWeapon;
    if (!weapon) return;

    weapon.secondaryAttack(this.playerMesh.position, this.playerMesh.rotation.y);
    this.attackTimer = weapon.attackDuration * 1.5;
    this.state = 'attacking';
  }

  get combatState(): CombatState {
    return this.state;
  }

  get isAttacking(): boolean {
    return this.state === 'attacking';
  }
}
