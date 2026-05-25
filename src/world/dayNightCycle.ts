/**
 * dayNightCycle.ts — Simulates a day/night cycle by animating sun position and sky color.
 */

import { Scene, DirectionalLight, HemisphericLight, Color3, Color4 } from '@babylonjs/core';
import { GameConfig } from '../core/config';

export class DayNightCycle {
  private scene: Scene;
  private sun: DirectionalLight;
  private ambient: HemisphericLight;
  private time: number = 0.25; // Start at 6am (0=midnight, 0.5=noon)

  constructor(scene: Scene, sun: DirectionalLight, ambient: HemisphericLight) {
    this.scene = scene;
    this.sun = sun;
    this.ambient = ambient;
  }

  update(deltaTime: number): void {
    this.time = (this.time + deltaTime / GameConfig.DAY_CYCLE_DURATION) % 1;

    const t = this.time;
    const sunAngle = t * Math.PI * 2;

    // Move sun
    this.sun.direction.x = -Math.cos(sunAngle);
    this.sun.direction.y = -Math.abs(Math.sin(sunAngle)) - 0.2;

    // Intensity drops at night
    const dayFactor = Math.max(0, Math.sin(sunAngle));
    this.sun.intensity = 0.3 + dayFactor * 1.0;
    this.ambient.intensity = 0.2 + dayFactor * 0.5;

    // Sky color
    const skyDay = new Color4(0.53, 0.81, 0.98, 1);
    const skyNight = new Color4(0.02, 0.02, 0.1, 1);
    this.scene.clearColor = Color4.Lerp(skyNight, skyDay, dayFactor);

    // Sun color (warm at dawn/dusk)
    const middayColor = new Color3(1, 0.97, 0.9);
    const dawnColor = new Color3(1, 0.6, 0.2);
    const dawnFactor = 1 - Math.abs(dayFactor * 2 - 1);
    this.sun.diffuse = Color3.Lerp(middayColor, dawnColor, dawnFactor * 0.5);
  }

  get currentHour(): number {
    return Math.floor(this.time * 24);
  }

  get isDay(): boolean {
    return this.time > 0.2 && this.time < 0.8;
  }
}
