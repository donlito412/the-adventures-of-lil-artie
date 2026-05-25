/**
 * whipSwing.ts — Whip-latched pendulum swing traversal.
 */

import { Mesh, Vector3, Scene } from '@babylonjs/core';
import { Debug } from '../utils/debug';

export class WhipSwingSystem {
  private scene: Scene;
  private playerMesh: Mesh;
  private anchorPoint: Vector3 | null = null;
  private isSwinging: boolean = false;
  private ropeLength: number = 0;
  private swingVelocity: Vector3 = Vector3.Zero();

  constructor(scene: Scene, playerMesh: Mesh) {
    this.scene = scene;
    this.playerMesh = playerMesh;
  }

  attachToAnchor(anchor: Vector3): void {
    this.anchorPoint = anchor.clone();
    this.ropeLength = Vector3.Distance(this.playerMesh.position, anchor);
    this.isSwinging = true;
    Debug.log('WhipSwing', `Latched to swing point at ${anchor}`);
  }

  release(): void {
    this.anchorPoint = null;
    this.isSwinging = false;
    Debug.log('WhipSwing', 'Released from swing point.');
  }

  update(deltaTime: number): void {
    if (!this.isSwinging || !this.anchorPoint) return;

    // Simple pendulum approximation
    const toAnchor = this.anchorPoint.subtract(this.playerMesh.position);
    const dist = toAnchor.length();

    // Centripetal correction — keep rope taut
    if (dist > this.ropeLength) {
      const correction = toAnchor.normalize().scale(dist - this.ropeLength);
      this.playerMesh.position.addInPlace(correction);
    }

    // Gravity pull on swing
    const gravity = new Vector3(0, -15, 0);
    this.swingVelocity.addInPlace(gravity.scale(deltaTime));
    this.playerMesh.position.addInPlace(this.swingVelocity.scale(deltaTime));
  }

  get swinging(): boolean {
    return this.isSwinging;
  }

  get anchor(): Vector3 | null {
    return this.anchorPoint;
  }
}
