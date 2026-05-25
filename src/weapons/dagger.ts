/**
 * dagger.ts — Close-range dagger with combo attacks.
 */

import { AbstractMesh, Scene, MeshBuilder, Vector3, Color3, StandardMaterial } from '@babylonjs/core';
import { Weapon } from './weaponManager';
import { GameConfig } from '../core/config';
import { AssetLoader } from '../core/assetLoader';
import { Debug } from '../utils/debug';
import { findEnemyHitsInCone } from './weaponHitDetection';

export class Dagger implements Weapon {
  readonly id = 'dagger';
  readonly name = 'Dagger';
  readonly attackDuration = 0.25;

  private scene: Scene;
  private mesh!: AbstractMesh;
  private hitboxActive: boolean = false;
  private hitTimer: number = 0;
  private comboStep: number = 0;
  private hitEnemyIds = new Set<string>();
  private hitDamage = 0;
  private hitYaw = 0;

  onHitEnemy?: (enemyId: string, damage: number) => void;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createMesh();
  }

  private createMesh(): void {
    // Placeholder blade shape
    this.mesh = MeshBuilder.CreateBox('dagger-mesh', { width: 0.05, height: 0.3, depth: 0.05 }, this.scene);
    const mat = new StandardMaterial('dagger-mat', this.scene);
    mat.diffuseColor = new Color3(0.8, 0.8, 0.9);
    this.mesh.material = mat;
    this.mesh.setEnabled(false);
  }

  async loadAsset(): Promise<void> {
    const model = await new AssetLoader(this.scene).loadModelIfAvailable(GameConfig.DAGGER_MODEL, 'dagger-model');
    if (!model) return;

    this.mesh.dispose();
    this.mesh = model.rootMesh;
    this.mesh.scaling = new Vector3(1, 1, 1);
    this.mesh.setEnabled(false);
    Debug.log('Dagger', 'Loaded real dagger GLB asset.');
  }

  primaryAttack(origin: Vector3, yaw: number): void {
    this.comboStep = (this.comboStep + 1) % 3;
    const damage = GameConfig.DAGGER_DAMAGE * (1 + this.comboStep * 0.2);
    this.activateHitbox(origin, yaw, damage, this.attackDuration);
    Debug.log('Dagger', `Slash ${this.comboStep + 1} — dmg: ${damage.toFixed(0)}`);
  }

  secondaryAttack(origin: Vector3, yaw: number): void {
    // Stab — more damage, less range
    this.activateHitbox(origin, yaw, GameConfig.DAGGER_DAMAGE * 1.8, this.attackDuration * 0.8);
    Debug.log('Dagger', 'Stab!');
  }

  private activateHitbox(origin: Vector3, yaw: number, damage: number, duration: number): void {
    const offset = new Vector3(Math.sin(yaw), 0.8, Math.cos(yaw)).scale(GameConfig.DAGGER_RANGE * 0.5);
    this.mesh.position = origin.add(offset);
    this.mesh.setEnabled(true);
    this.hitboxActive = true;
    this.hitTimer = duration;
    this.hitDamage = damage;
    this.hitYaw = yaw;
    this.hitEnemyIds.clear();
    this.applyHit(origin);
  }

  update(deltaTime: number): void {
    if (this.hitTimer > 0) {
      this.hitTimer -= deltaTime;
      this.applyHit(this.mesh.position);
    } else if (this.hitboxActive) {
      this.hitboxActive = false;
      this.mesh.setEnabled(false);
    }
  }

  private applyHit(origin: Vector3): void {
    if (!this.hitboxActive) return;

    const direction = new Vector3(Math.sin(this.hitYaw), 0, Math.cos(this.hitYaw));
    const hits = findEnemyHitsInCone(this.scene, origin, direction, GameConfig.DAGGER_RANGE + 0.8, Math.PI / 3);

    for (const hit of hits) {
      if (this.hitEnemyIds.has(hit.id)) continue;
      this.hitEnemyIds.add(hit.id);
      hit.enemy.takeDamage(this.hitDamage);
      this.onHitEnemy?.(hit.id, this.hitDamage);
      Debug.log('Dagger', `Hit ${hit.id} for ${this.hitDamage.toFixed(0)}`);
    }
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
