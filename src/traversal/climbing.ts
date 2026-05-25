/**
 * climbing.ts — Wall climbing logic.
 */

import { Mesh, Vector3, Scene, Ray } from '@babylonjs/core';
import { Debug } from '../utils/debug';

export class ClimbingSystem {
  private scene: Scene;
  private playerMesh: Mesh;
  private isClimbing: boolean = false;
  private climbSurface: Vector3 | null = null;

  constructor(scene: Scene, playerMesh: Mesh) {
    this.scene = scene;
    this.playerMesh = playerMesh;
  }

  /**
   * Check if player is against a climbable surface. Returns normal of the surface.
   */
  checkForClimbableSurface(): Vector3 | null {
    const forward = new Vector3(
      Math.sin(this.playerMesh.rotation.y),
      0,
      Math.cos(this.playerMesh.rotation.y)
    );

    const ray = new Ray(
      this.playerMesh.position.add(new Vector3(0, 1, 0)),
      forward,
      0.6
    );

    const hit = this.scene.pickWithRay(ray);
    if (hit?.hit && hit.pickedMesh?.metadata?.climbable) {
      return hit.getNormal(true) ?? null;
    }
    return null;
  }

  startClimbing(surfaceNormal: Vector3): void {
    this.isClimbing = true;
    this.climbSurface = surfaceNormal;
    Debug.log('Climbing', 'Started climbing.');
  }

  stopClimbing(): void {
    this.isClimbing = false;
    this.climbSurface = null;
    Debug.log('Climbing', 'Stopped climbing.');
  }

  /**
   * Move player up/down along a climbable surface.
   */
  updateClimb(verticalInput: number, speed: number, deltaTime: number): void {
    if (!this.isClimbing) return;
    this.playerMesh.position.y += verticalInput * speed * deltaTime;
  }

  get climbing(): boolean {
    return this.isClimbing;
  }
}
