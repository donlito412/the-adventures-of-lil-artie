/**
 * enemyPatrol.ts — Utility for generating patrol paths.
 */

import { Vector3 } from '@babylonjs/core';

export class PatrolPath {
  /**
   * Generate a square patrol path around a center point.
   */
  static square(center: Vector3, radius: number): Vector3[] {
    return [
      new Vector3(center.x - radius, center.y, center.z - radius),
      new Vector3(center.x + radius, center.y, center.z - radius),
      new Vector3(center.x + radius, center.y, center.z + radius),
      new Vector3(center.x - radius, center.y, center.z + radius),
    ];
  }

  /**
   * Generate a circular patrol path.
   */
  static circle(center: Vector3, radius: number, points: number = 6): Vector3[] {
    const path: Vector3[] = [];
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      path.push(new Vector3(
        center.x + Math.cos(angle) * radius,
        center.y,
        center.z + Math.sin(angle) * radius,
      ));
    }
    return path;
  }

  /**
   * Generate a back-and-forth linear path.
   */
  static linear(from: Vector3, to: Vector3): Vector3[] {
    return [from.clone(), to.clone()];
  }
}
