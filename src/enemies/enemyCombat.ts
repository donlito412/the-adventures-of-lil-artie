/**
 * enemyCombat.ts — Enemy attack logic and hit detection.
 */

import { Vector3 } from '@babylonjs/core';

export class EnemyCombat {
  private attackCooldown: number = 0;
  private readonly BASE_COOLDOWN = 1.5;

  canAttack(): boolean {
    return this.attackCooldown <= 0;
  }

  attack(enemyPos: Vector3, playerPos: Vector3, attackRange: number, damage: number): number {
    if (!this.canAttack()) return 0;

    const dist = Vector3.Distance(enemyPos, playerPos);
    if (dist > attackRange) return 0;

    this.attackCooldown = this.BASE_COOLDOWN;
    return damage;
  }

  update(deltaTime: number): void {
    if (this.attackCooldown > 0) this.attackCooldown -= deltaTime;
  }
}
