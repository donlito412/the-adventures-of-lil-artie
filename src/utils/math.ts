/**
 * math.ts — Math utility functions for game calculations.
 */

import { Vector3 } from '@babylonjs/core';

export const MathUtils = {
  /** Clamp a value between min and max. */
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  },

  /** Linear interpolation. */
  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * MathUtils.clamp(t, 0, 1);
  },

  /** Smooth step interpolation. */
  smoothStep(t: number): number {
    t = MathUtils.clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  },

  /** Convert degrees to radians. */
  toRad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  /** Convert radians to degrees. */
  toDeg(rad: number): number {
    return rad * (180 / Math.PI);
  },

  /** Normalize an angle to [-PI, PI]. */
  normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  },

  /** Random float between min and max. */
  randFloat(min: number, max: number): number {
    return min + Math.random() * (max - min);
  },

  /** Random int between min and max (inclusive). */
  randInt(min: number, max: number): number {
    return Math.floor(MathUtils.randFloat(min, max + 1));
  },

  /** Distance between two Vector3 points (2D ignoring Y). */
  dist2D(a: Vector3, b: Vector3): number {
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dz * dz);
  },

  /** Flat angle (Y-axis) from a to b. */
  angleToTarget(from: Vector3, to: Vector3): number {
    return Math.atan2(to.x - from.x, to.z - from.z);
  },
};
