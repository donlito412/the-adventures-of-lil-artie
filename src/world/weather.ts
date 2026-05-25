/**
 * weather.ts — Placeholder weather system (rain, fog, wind).
 */

import { Scene, ParticleSystem, Texture, Vector3, Color4 } from '@babylonjs/core';

export type WeatherType = 'clear' | 'rain' | 'fog' | 'storm';

export class WeatherSystem {
  private scene: Scene;
  private currentWeather: WeatherType = 'clear';
  private rainSystem?: ParticleSystem;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  setWeather(type: WeatherType): void {
    this.clearWeather();
    this.currentWeather = type;

    switch (type) {
      case 'rain':
        this.startRain();
        break;
      case 'fog':
        this.scene.fogMode = Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.03;
        this.scene.fogColor.set(0.8, 0.8, 0.85);
        break;
      case 'clear':
      default:
        this.scene.fogMode = Scene.FOGMODE_NONE;
        break;
    }
  }

  private startRain(): void {
    this.rainSystem = new ParticleSystem('rain', 2000, this.scene);
    this.rainSystem.emitter = new Vector3(0, 30, 0);
    this.rainSystem.minEmitBox = new Vector3(-50, 0, -50);
    this.rainSystem.maxEmitBox = new Vector3(50, 0, 50);
    this.rainSystem.color1 = new Color4(0.7, 0.7, 1, 0.8);
    this.rainSystem.color2 = new Color4(0.7, 0.7, 1, 0.5);
    this.rainSystem.minSize = 0.02;
    this.rainSystem.maxSize = 0.05;
    this.rainSystem.minLifeTime = 0.5;
    this.rainSystem.maxLifeTime = 1.0;
    this.rainSystem.emitRate = 600;
    this.rainSystem.direction1 = new Vector3(-1, -10, -1);
    this.rainSystem.direction2 = new Vector3(1, -15, 1);
    this.rainSystem.start();
  }

  private clearWeather(): void {
    this.rainSystem?.stop();
    this.rainSystem?.dispose();
    this.rainSystem = undefined;
    this.scene.fogMode = Scene.FOGMODE_NONE;
  }

  get weather(): WeatherType {
    return this.currentWeather;
  }
}
