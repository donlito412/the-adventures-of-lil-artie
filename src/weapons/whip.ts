/**
 * whip.ts — Whip weapon: melee crack and swing point grapple.
 */

import { AbstractMesh, Ray, Scene, MeshBuilder, Vector3, Color3, StandardMaterial } from '@babylonjs/core';
import { Weapon } from './weaponManager';
import { GameConfig } from '../core/config';
import { AssetLoader } from '../core/assetLoader';
import { Debug } from '../utils/debug';
import { findEnemyHitsInCone } from './weaponHitDetection';

export class Whip implements Weapon {
  readonly id = 'whip';
  readonly name = 'Whip';
  readonly attackDuration = 0.5;

  private scene: Scene;
  private mesh!: AbstractMesh;
  private isSwinging: boolean = false;
  private swingAnchor: Vector3 | null = null;
  private hitboxActive: boolean = false;
  private hitTimer: number = 0;
  private hitEnemyIds = new Set<string>();
  private hitOrigin = Vector3.Zero();
  private hitYaw = 0;

  onSwingAnchorFound?: (anchor: Vector3) => void;
  onHitEnemy?: (enemyId: string, damage: number) => void;
  onDisarmEnemy?: (enemyId: string) => void;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createMesh();
  }

  private createMesh(): void {
    this.mesh = MeshBuilder.CreateCylinder('whip-mesh', {
      height: GameConfig.WHIP_RANGE,
      diameter: 0.05,
      tessellation: 6,
    }, this.scene);
    const mat = new StandardMaterial('whip-mat', this.scene);
    mat.diffuseColor = new Color3(0.4, 0.2, 0.1);
    this.mesh.material = mat;
    this.mesh.setEnabled(false);
  }

  async loadAsset(): Promise<void> {
    const model = await new AssetLoader(this.scene).loadModelIfAvailable(GameConfig.WHIP_MODEL, 'whip-model');
    if (!model) return;

    this.mesh.dispose();
    this.mesh = model.rootMesh;
    this.mesh.scaling = new Vector3(1, 1, 1);
    this.mesh.setEnabled(false);
    Debug.log('Whip', 'Loaded real whip GLB asset.');
  }

  primaryAttack(origin: Vector3, yaw: number): void {
    // Crack whip — medium damage + disarm chance
    this.activateCrack(origin, yaw, GameConfig.WHIP_DAMAGE);
    Debug.log('Whip', 'Crack!');
  }

  secondaryAttack(origin: Vector3, yaw: number): void {
    // Attempt to latch onto swing point
    this.findSwingAnchor(origin, yaw);
    Debug.log('Whip', 'Attempting swing latch...');
  }

  private activateCrack(origin: Vector3, yaw: number, damage: number): void {
    const dir = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    this.mesh.position = origin.add(new Vector3(0, 1, 0));
    this.mesh.setEnabled(true);
    this.hitboxActive = true;
    this.hitTimer = this.attackDuration;
    this.hitEnemyIds.clear();
    this.hitOrigin = origin.clone();
    this.hitYaw = yaw;
    this.applyHitDetection();
  }

  private findSwingAnchor(origin: Vector3, yaw: number): void {
    const dir = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const ray = new Ray(origin.add(new Vector3(0, 1, 0)), dir, GameConfig.WHIP_RANGE + 3);
    const hit = this.scene.pickWithRay(ray, mesh => !!mesh.metadata?.swingPoint);

    if (hit?.hit && hit.pickedPoint) {
      this.swingAnchor = hit.pickedPoint.clone();
      this.isSwinging = true;
      this.onSwingAnchorFound?.(this.swingAnchor);
      Debug.log('Whip', `Swing anchor found at ${this.swingAnchor}`);
      return;
    }

    Debug.log('Whip', 'No swing point found nearby.');
  }

  update(deltaTime: number): void {
    if (this.hitTimer > 0) {
      this.hitTimer -= deltaTime;
      // Animate whip arc
      this.mesh.rotation.z = Math.sin(this.hitTimer * 10) * 0.3;
      this.applyHitDetection();
    } else if (this.hitboxActive) {
      this.hitboxActive = false;
      this.mesh.setEnabled(false);
      this.isSwinging = false;
      this.swingAnchor = null;
    }
  }

  private applyHitDetection(): void {
    if (!this.hitboxActive) return;

    const direction = new Vector3(Math.sin(this.hitYaw), 0, Math.cos(this.hitYaw));
    const hits = findEnemyHitsInCone(this.scene, this.hitOrigin, direction, GameConfig.WHIP_RANGE, Math.PI / 5);

    for (const hit of hits) {
      if (this.hitEnemyIds.has(hit.id)) continue;
      this.hitEnemyIds.add(hit.id);
      hit.enemy.takeDamage(GameConfig.WHIP_DAMAGE);
      hit.enemy.stun(1.4);
      this.onHitEnemy?.(hit.id, GameConfig.WHIP_DAMAGE);
      this.onDisarmEnemy?.(hit.id);
      Debug.log('Whip', `Hit and disarmed ${hit.id}`);
    }
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
