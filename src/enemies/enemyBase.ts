/**
 * enemyBase.ts — Base class for all human enemies.
 */

import { Mesh, Scene, Vector3 } from '@babylonjs/core';

export type EnemyState = 'patrol' | 'alert' | 'chase' | 'attack' | 'search' | 'stunned' | 'defeated';

export interface EnemyConfig {
  id: string;
  name: string;
  health: number;
  patrolSpeed: number;
  chaseSpeed: number;
  attackRange: number;
  detectionRadius: number;
  attackDamage: number;
}

export abstract class EnemyBase {
  protected scene: Scene;
  protected mesh!: Mesh;
  protected config: EnemyConfig;
  protected health: number;
  protected state: EnemyState = 'patrol';
  protected patrolPath: Vector3[] = [];
  protected patrolIndex: number = 0;

  onDefeated?: (id: string) => void;
  onDamageDealt?: (targetId: string, damage: number) => void;
  onDamaged?: (id: string, healthPercent: number) => void;

  constructor(scene: Scene, config: EnemyConfig) {
    this.scene = scene;
    this.config = config;
    this.health = config.health;
  }

  abstract createMesh(): void;
  abstract update(deltaTime: number, playerPosition: Vector3): void;

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.onDamaged?.(this.config.id, this.healthPercent);
    if (this.health <= 0) {
      this.defeat();
    }
  }

  stun(duration = 1.2): void {
    if (this.state === 'defeated') return;
    this.state = 'stunned';
    setTimeout(() => {
      if (this.state === 'stunned') {
        this.state = 'search';
      }
    }, duration * 1000);
  }

  protected defeat(): void {
    this.state = 'defeated';
    this.onDefeated?.(this.config.id);
    // TODO: play defeat animation, drop loot
    setTimeout(() => this.mesh?.dispose(), 2000);
  }

  setPatrolPath(path: Vector3[]): void {
    this.patrolPath = path;
    this.patrolIndex = 0;
  }

  get enemyState(): EnemyState {
    return this.state;
  }

  get position(): Vector3 {
    return this.mesh?.position ?? Vector3.Zero();
  }

  get id(): string {
    return this.config.id;
  }

  get isAlive(): boolean {
    return this.health > 0;
  }

  get healthPercent(): number {
    return this.health / this.config.health;
  }
}
