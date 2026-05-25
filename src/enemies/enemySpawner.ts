/**
 * enemySpawner.ts — Spawns enemies at defined camp locations.
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { HumanEnemy } from './enemyAI';
import { PatrolPath } from './enemyPatrol';
import { GameConfig } from '../core/config';
import { Debug } from '../utils/debug';

export interface CampConfig {
  id: string;
  center: Vector3;
  enemyCount: number;
  patrolRadius: number;
}

export class EnemySpawner {
  private scene: Scene;
  private activeEnemies: Map<string, HumanEnemy> = new Map();
  private defeatedEnemyIds: Set<string> = new Set();
  private onPlayerDamage?: (damage: number) => void;

  constructor(scene: Scene, defeatedIds: string[] = [], onPlayerDamage?: (damage: number) => void) {
    this.scene = scene;
    this.onPlayerDamage = onPlayerDamage;
    for (const id of defeatedIds) this.defeatedEnemyIds.add(id);
  }

  spawnCamp(camp: CampConfig): void {
    Debug.log('EnemySpawner', `Spawning camp: ${camp.id} (${camp.enemyCount} enemies)`);

    for (let i = 0; i < camp.enemyCount; i++) {
      const enemyId = `${camp.id}-enemy-${i}`;
      if (this.defeatedEnemyIds.has(enemyId)) continue;

      const angle = (i / camp.enemyCount) * Math.PI * 2;
      const startPos = new Vector3(
        camp.center.x + Math.cos(angle) * camp.patrolRadius * 0.5,
        camp.center.y,
        camp.center.z + Math.sin(angle) * camp.patrolRadius * 0.5,
      );

      const enemy = new HumanEnemy(this.scene, {
        id: enemyId,
        name: `Guard ${i + 1}`,
        health: GameConfig.ENEMY_BASE_HEALTH,
        patrolSpeed: GameConfig.ENEMY_PATROL_SPEED,
        chaseSpeed: GameConfig.ENEMY_CHASE_SPEED,
        attackRange: GameConfig.ENEMY_ATTACK_RANGE,
        detectionRadius: GameConfig.ENEMY_DETECTION_RADIUS,
        attackDamage: 15,
      }, startPos);

      enemy.setPatrolPath(PatrolPath.circle(camp.center, camp.patrolRadius, 4));

      enemy.onDefeated = (id) => {
        this.defeatedEnemyIds.add(id);
        this.activeEnemies.delete(id);
        Debug.log('EnemySpawner', `Enemy defeated: ${id}`);
      };

      enemy.onDamageDealt = (targetId, damage) => {
        if (targetId === 'player') {
          this.onPlayerDamage?.(damage);
        }
      };

      this.activeEnemies.set(enemyId, enemy);
    }
  }

  update(deltaTime: number, playerPosition: Vector3): void {
    for (const enemy of this.activeEnemies.values()) {
      enemy.update(deltaTime, playerPosition);
    }
  }

  get enemies(): HumanEnemy[] {
    return Array.from(this.activeEnemies.values());
  }

  get defeatedIds(): string[] {
    return Array.from(this.defeatedEnemyIds);
  }
}
