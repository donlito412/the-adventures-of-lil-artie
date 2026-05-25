/**
 * boomerang.ts — Boomerang weapon: throw, arc, auto-return.
 */

import { AbstractMesh, Scene, MeshBuilder, Vector3, Color3, StandardMaterial } from '@babylonjs/core';
import { Weapon } from './weaponManager';
import { GameConfig } from '../core/config';
import { AssetLoader } from '../core/assetLoader';
import { Debug } from '../utils/debug';
import { findEnemyHits } from './weaponHitDetection';

type BoomerangState = 'held' | 'flying' | 'returning';

export class Boomerang implements Weapon {
  readonly id = 'boomerang';
  readonly name = 'Boomerang';
  readonly attackDuration = 0.3;

  private scene: Scene;
  private mesh!: AbstractMesh;
  private state: BoomerangState = 'held';
  private velocity: Vector3 = Vector3.Zero();
  private returnTarget: Vector3 = Vector3.Zero();
  private maxRange: number = GameConfig.BOOMERANG_RANGE;
  private launchOrigin: Vector3 = Vector3.Zero();
  private distanceTraveled: number = 0;
  private hitEnemyIds = new Set<string>();

  onHitEnemy?: (enemyId: string, damage: number) => void;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createMesh();
  }

  private createMesh(): void {
    // Placeholder: flat disc
    this.mesh = MeshBuilder.CreateTorus('boomerang-mesh', {
      diameter: 0.4,
      thickness: 0.06,
      tessellation: 20,
    }, this.scene);

    const mat = new StandardMaterial('boomerang-mat', this.scene);
    mat.diffuseColor = new Color3(0.8, 0.6, 0.2);
    this.mesh.material = mat;
    this.mesh.setEnabled(false);
  }

  async loadAsset(): Promise<void> {
    const model = await new AssetLoader(this.scene).loadModelIfAvailable(GameConfig.BOOMERANG_MODEL, 'boomerang-model');
    if (!model) return;

    this.mesh.dispose();
    this.mesh = model.rootMesh;
    this.mesh.scaling = new Vector3(1, 1, 1);
    this.mesh.setEnabled(false);
    Debug.log('Boomerang', 'Loaded real boomerang GLB asset.');
  }

  primaryAttack(origin: Vector3, yaw: number): void {
    if (this.state !== 'held') return;

    this.launchOrigin = origin.clone().add(new Vector3(0, 1, 0));
    this.mesh.position = this.launchOrigin.clone();

    const dir = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    this.velocity = dir.scale(GameConfig.BOOMERANG_SPEED);
    this.distanceTraveled = 0;
    this.hitEnemyIds.clear();
    this.state = 'flying';
    this.mesh.setEnabled(true);

    Debug.log('Boomerang', 'Thrown!');
  }

  secondaryAttack(origin: Vector3, yaw: number): void {
    // Charged throw: faster, same behavior
    this.primaryAttack(origin, yaw);
    this.velocity.scaleInPlace(1.4);
  }

  update(deltaTime: number, ownerPosition?: Vector3): void {
    if (this.state === 'held') return;
    if (ownerPosition) {
      this.setReturnTarget(ownerPosition);
    }

    // Spin mesh
    this.mesh.rotation.y += 10 * deltaTime;

    if (this.state === 'flying') {
      this.mesh.position.addInPlace(this.velocity.scale(deltaTime));
      this.distanceTraveled += this.velocity.length() * deltaTime;
      this.applyHitDetection();

      // Add slight upward arc
      this.mesh.position.y += Math.sin(this.distanceTraveled / this.maxRange * Math.PI) * 0.02;

      if (this.distanceTraveled >= this.maxRange) {
        this.state = 'returning';
        Debug.log('Boomerang', 'Returning...');
      }
    }

    if (this.state === 'returning') {
      const toOrigin = this.returnTarget.subtract(this.mesh.position);
      const dist = toOrigin.length();

      if (dist < 0.5) {
        this.catch();
        return;
      }

      const dir = toOrigin.normalize();
      this.mesh.position.addInPlace(dir.scale(GameConfig.BOOMERANG_RETURN_SPEED * deltaTime));
      this.applyHitDetection();
    }
  }

  setReturnTarget(target: Vector3): void {
    this.returnTarget = target.clone().add(new Vector3(0, 1, 0));
  }

  private catch(): void {
    this.state = 'held';
    this.mesh.setEnabled(false);
    Debug.log('Boomerang', 'Caught!');
  }

  private applyHitDetection(): void {
    const hits = findEnemyHits(this.scene, this.mesh.position, 1.1);

    for (const hit of hits) {
      if (this.hitEnemyIds.has(hit.id)) continue;
      this.hitEnemyIds.add(hit.id);
      hit.enemy.takeDamage(GameConfig.BOOMERANG_DAMAGE);
      this.onHitEnemy?.(hit.id, GameConfig.BOOMERANG_DAMAGE);
      Debug.log('Boomerang', `Hit ${hit.id} for ${GameConfig.BOOMERANG_DAMAGE}`);
      this.state = 'returning';
    }
  }

  get isInFlight(): boolean {
    return this.state !== 'held';
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
