/**
 * gliding.ts — Glider/paraglider descent system.
 */

import { Mesh, Vector3 } from '@babylonjs/core';
import { Debug } from '../utils/debug';

export class GlidingSystem {
  private playerMesh: Mesh;
  private isGliding: boolean = false;
  private readonly GLIDE_FALL_SPEED = -2.0;  // slow descent
  private readonly GLIDE_FORWARD_SPEED = 8.0;

  constructor(playerMesh: Mesh) {
    this.playerMesh = playerMesh;
  }

  /**
   * Activate glide — only works while airborne.
   */
  startGlide(isGrounded: boolean): boolean {
    if (isGrounded) return false;
    this.isGliding = true;
    Debug.log('Gliding', 'Glide started.');
    return true;
  }

  stopGlide(): void {
    this.isGliding = false;
    Debug.log('Gliding', 'Glide stopped.');
  }

  /**
   * Override vertical velocity while gliding.
   * Returns modified velocity.
   */
  applyGlide(currentVelocity: Vector3): Vector3 {
    if (!this.isGliding) return currentVelocity;

    return new Vector3(
      currentVelocity.x,
      Math.max(this.GLIDE_FALL_SPEED, currentVelocity.y),
      currentVelocity.z
    );
  }

  get gliding(): boolean {
    return this.isGliding;
  }
}
