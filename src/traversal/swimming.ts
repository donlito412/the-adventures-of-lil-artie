/**
 * swimming.ts — Water movement system.
 */

import { Mesh, Scene, Vector3 } from '@babylonjs/core';
import { GameConfig } from '../core/config';

export class SwimmingSystem {
  private scene: Scene;
  private playerMesh: Mesh;
  private isSubmerged: boolean = false;
  private readonly SWIM_SPEED = 4.0;
  private readonly SURFACE_FLOAT_SPEED = -1.5; // sinks slowly if not actively swimming

  constructor(scene: Scene, playerMesh: Mesh) {
    this.scene = scene;
    this.playerMesh = playerMesh;
  }

  checkWater(): void {
    this.isSubmerged = this.playerMesh.position.y < GameConfig.WATER_LEVEL || this.isInsideWaterZone();
  }

  applyWaterPhysics(velocity: Vector3, deltaTime: number): Vector3 {
    if (!this.isSubmerged) return velocity;

    // Dampen movement in water
    return new Vector3(
      velocity.x * 0.5,
      Math.max(this.SURFACE_FLOAT_SPEED, velocity.y * 0.4),
      velocity.z * 0.5
    );
  }

  swimUp(deltaTime: number): void {
    if (!this.isSubmerged) return;
    this.playerMesh.position.y += this.SWIM_SPEED * 0.5 * deltaTime;
  }

  get submerged(): boolean {
    return this.isSubmerged;
  }

  private isInsideWaterZone(): boolean {
    for (const mesh of this.scene.meshes) {
      if (!mesh.metadata?.waterZone) continue;

      const bounds = mesh.getBoundingInfo().boundingBox;
      const min = bounds.minimumWorld;
      const max = bounds.maximumWorld;
      const p = this.playerMesh.position;

      if (
        p.x >= min.x &&
        p.x <= max.x &&
        p.z >= min.z &&
        p.z <= max.z &&
        p.y <= mesh.position.y + 1.4
      ) {
        return true;
      }
    }

    return false;
  }
}
