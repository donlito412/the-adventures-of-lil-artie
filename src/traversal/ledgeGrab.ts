/**
 * ledgeGrab.ts — Ledge detection and pull-up mechanic.
 */

import { Mesh, Vector3, Scene, Ray } from '@babylonjs/core';
import { Debug } from '../utils/debug';

export class LedgeGrabSystem {
  private scene: Scene;
  private playerMesh: Mesh;
  private isHanging: boolean = false;
  private ledgePosition: Vector3 | null = null;

  constructor(scene: Scene, playerMesh: Mesh) {
    this.scene = scene;
    this.playerMesh = playerMesh;
  }

  /**
   * When airborne and moving upward toward a surface edge, check for ledge.
   */
  detectLedge(): boolean {
    if (this.isHanging) return true;

    // Cast ray slightly above player head, forward
    const forward = new Vector3(
      Math.sin(this.playerMesh.rotation.y),
      0,
      Math.cos(this.playerMesh.rotation.y)
    );

    const headPos = this.playerMesh.position.add(new Vector3(0, 1.0, 0));
    const ray = new Ray(headPos, forward, 0.5);
    const hit = this.scene.pickWithRay(ray);

    if (hit?.hit && hit.pickedMesh?.metadata?.climbable) {
      // Check if there's open space above the hit point (it's a ledge top, not a wall)
      const topRay = new Ray(
        hit.pickedPoint!.add(new Vector3(0, 0.5, 0)),
        new Vector3(0, -1, 0),
        0.8
      );
      const topHit = this.scene.pickWithRay(topRay);
      if (!topHit?.hit) {
        this.ledgePosition = hit.pickedPoint!.clone();
        return true;
      }
    }

    return false;
  }

  grab(): void {
    if (!this.ledgePosition) return;
    this.isHanging = true;
    // Snap player to hang position
    this.playerMesh.position.y = this.ledgePosition.y - 1.2;
    Debug.log('LedgeGrab', 'Hanging on ledge.');
  }

  pullUp(): void {
    if (!this.isHanging || !this.ledgePosition) return;
    this.playerMesh.position.y = this.ledgePosition.y + 0.2;
    this.isHanging = false;
    this.ledgePosition = null;
    Debug.log('LedgeGrab', 'Pulled up!');
  }

  drop(): void {
    this.isHanging = false;
    this.ledgePosition = null;
  }

  get hanging(): boolean {
    return this.isHanging;
  }
}
