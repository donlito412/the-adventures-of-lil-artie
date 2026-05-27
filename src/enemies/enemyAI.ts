/**
 * enemyAI.ts — State machine AI for human enemies.
 */

import { Vector3, Scene, Mesh, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { EnemyBase, EnemyConfig } from './enemyBase';
import { Debug } from '../utils/debug';

export class HumanEnemy extends EnemyBase {
  private bodyMaterial!: StandardMaterial;
  private healthBack!: Mesh;
  private healthFill!: Mesh;
  private searchTimer: number = 0;
  private alertTimer: number = 0;
  private attackTimer: number = 0;
  private stunnedTimer: number = 0;
  private lastKnownPlayerPos: Vector3 = Vector3.Zero();
  private homePosition: Vector3 = Vector3.Zero();

  constructor(scene: Scene, config: EnemyConfig, startPosition: Vector3) {
    super(scene, config);
    this.createMesh();
    this.mesh.position = startPosition.clone();
    this.homePosition = startPosition.clone();
    this.lastKnownPlayerPos = startPosition.clone();
  }

  createMesh(): void {
    this.mesh = MeshBuilder.CreateCapsule(`enemy-${this.config.id}`, {
      height: 1.8,
      radius: 0.35,
    }, this.scene);
    this.mesh.position = Vector3.Zero();

    this.bodyMaterial = new StandardMaterial(`enemy-mat-${this.config.id}`, this.scene);
    this.bodyMaterial.diffuseColor = new Color3(0.5, 0.3, 0.2);
    this.mesh.material = this.bodyMaterial;
    this.mesh.metadata = { enemy: this, enemyId: this.config.id };
    this.mesh.visibility = 0;

    this.healthBack = MeshBuilder.CreateBox(`enemy-health-bg-${this.config.id}`, {
      width: 0.9,
      height: 0.08,
      depth: 0.04,
    }, this.scene);
    this.healthBack.parent = this.mesh;
    this.healthBack.position = new Vector3(0, 1.2, 0);
    const backMat = new StandardMaterial(`enemy-health-bg-mat-${this.config.id}`, this.scene);
    backMat.diffuseColor = new Color3(0.08, 0.08, 0.08);
    this.healthBack.material = backMat;

    this.healthFill = MeshBuilder.CreateBox(`enemy-health-fill-${this.config.id}`, {
      width: 0.85,
      height: 0.09,
      depth: 0.05,
    }, this.scene);
    this.healthFill.parent = this.mesh;
    this.healthFill.position = new Vector3(0, 1.2, -0.03);
    const fillMat = new StandardMaterial(`enemy-health-fill-mat-${this.config.id}`, this.scene);
    fillMat.diffuseColor = new Color3(0.1, 0.8, 0.18);
    this.healthFill.material = fillMat;
  }

  update(deltaTime: number, playerPosition: Vector3): void {
    if (this.state === 'defeated') return;

    const distToPlayer = Vector3.Distance(this.mesh.position, playerPosition);

    // Tick timers
    if (this.attackTimer > 0) this.attackTimer -= deltaTime;
    if (this.alertTimer > 0) this.alertTimer -= deltaTime;
    if (this.searchTimer > 0) this.searchTimer -= deltaTime;
    if (this.stunnedTimer > 0) this.stunnedTimer -= deltaTime;

    this.updateVisuals();

    // State transitions
    switch (this.state) {
      case 'stunned':
        if (this.stunnedTimer <= 0) {
          this.state = distToPlayer <= this.config.detectionRadius ? 'chase' : 'search';
          this.searchTimer = 3;
        }
        break;

      case 'patrol':
        this.doPatrol(deltaTime);
        if (distToPlayer <= this.config.detectionRadius) {
          this.state = 'alert';
          this.alertTimer = 1.0;
          this.lastKnownPlayerPos = playerPosition.clone();
          Debug.log('EnemyAI', `${this.config.id} spotted player!`);
        }
        break;

      case 'alert':
        this.faceTarget(playerPosition);
        // Pause briefly then chase
        if (this.alertTimer <= 0) {
          this.state = 'chase';
        }
        break;

      case 'chase':
        this.moveToward(playerPosition, this.config.chaseSpeed, deltaTime);
        this.lastKnownPlayerPos = playerPosition.clone();

        if (distToPlayer <= this.config.attackRange) {
          this.state = 'attack';
        }
        // Lost sight
        if (distToPlayer > this.config.detectionRadius * 1.5) {
          this.state = 'search';
          this.searchTimer = 5.0;
        }
        break;

      case 'attack':
        if (distToPlayer > this.config.attackRange * 1.2) {
          this.state = 'chase';
          break;
        }
        if (this.attackTimer <= 0) {
          this.onDamageDealt?.('player', this.config.attackDamage);
          this.attackTimer = 1.2;
          this.faceTarget(playerPosition);
          Debug.log('EnemyAI', `${this.config.id} attacked player for ${this.config.attackDamage}`);
        }
        break;

      case 'search':
        this.moveToward(this.lastKnownPlayerPos, this.config.patrolSpeed, deltaTime);
        if (distToPlayer <= this.config.detectionRadius) {
          this.state = 'chase';
        }
        if (this.searchTimer <= 0 || Vector3.Distance(this.mesh.position, this.lastKnownPlayerPos) < 0.6) {
          this.state = 'patrol';
        }
        break;
    }
  }

  override takeDamage(amount: number): void {
    super.takeDamage(amount);
    if (this.state !== 'defeated') {
      this.state = 'chase';
      this.searchTimer = 4;
      this.updateVisuals();
    }
  }

  override stun(duration = 1.2): void {
    if (this.state === 'defeated') return;
    this.state = 'stunned';
    this.stunnedTimer = duration;
    this.updateVisuals();
  }

  private doPatrol(deltaTime: number): void {
    if (this.patrolPath.length === 0) return;

    const target = this.patrolPath[this.patrolIndex];
    const dist = Vector3.Distance(this.mesh.position, target);

    if (dist < 0.5) {
      this.patrolIndex = (this.patrolIndex + 1) % this.patrolPath.length;
      return;
    }

    this.moveToward(target, this.config.patrolSpeed, deltaTime);
  }

  private moveToward(target: Vector3, speed: number, deltaTime: number): void {
    const dir = target.subtract(this.mesh.position);
    dir.y = 0;
    if (dir.length() < 0.1) return;
    dir.normalize();

    this.mesh.position.addInPlace(dir.scale(speed * deltaTime));

    // Face movement direction
    const angle = Math.atan2(dir.x, dir.z);
    this.mesh.rotation.y = angle;
  }

  private faceTarget(target: Vector3): void {
    const dir = target.subtract(this.mesh.position);
    dir.y = 0;
    if (dir.length() < 0.1) return;
    this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
  }

  private updateVisuals(): void {
    if (!this.bodyMaterial) return;

    switch (this.state) {
      case 'patrol':
        this.bodyMaterial.diffuseColor = new Color3(0.5, 0.3, 0.2);
        break;
      case 'alert':
        this.bodyMaterial.diffuseColor = new Color3(0.95, 0.72, 0.18);
        break;
      case 'chase':
        this.bodyMaterial.diffuseColor = new Color3(0.82, 0.22, 0.12);
        break;
      case 'attack':
        this.bodyMaterial.diffuseColor = new Color3(1, 0.05, 0.02);
        break;
      case 'search':
        this.bodyMaterial.diffuseColor = new Color3(0.22, 0.36, 0.75);
        break;
      case 'stunned':
        this.bodyMaterial.diffuseColor = new Color3(0.5, 0.5, 0.58);
        break;
    }

    if (this.healthFill) {
      this.healthFill.scaling.x = Math.max(0.02, this.healthPercent);
      const healthMat = this.healthFill.material as StandardMaterial;
      healthMat.diffuseColor = this.healthPercent > 0.45
        ? new Color3(0.1, 0.8, 0.18)
        : new Color3(0.95, 0.18, 0.08);
    }
  }

  protected override defeat(): void {
    this.state = 'defeated';
    this.mesh.metadata = {};
    this.mesh.isPickable = false;
    this.bodyMaterial.diffuseColor = new Color3(0.12, 0.12, 0.12);
    this.healthBack.setEnabled(false);
    this.healthFill.setEnabled(false);
    this.onDefeated?.(this.config.id);
    Debug.log('EnemyAI', `${this.config.id} defeated`);
    setTimeout(() => this.mesh?.dispose(), 2000);
  }
}
