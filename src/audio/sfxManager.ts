/**
 * sfxManager.ts — One-shot sound effects pool.
 */

import { Scene, Sound } from '@babylonjs/core';
import { Debug } from '../utils/debug';

const SFX_CATALOG: Record<string, string> = {
  'footstep-grass': '/assets/audio/sfx/footstep-grass.mp3',
  'footstep-stone': '/assets/audio/sfx/footstep-stone.mp3',
  'boomerang-throw': '/assets/audio/sfx/boomerang-throw.mp3',
  'boomerang-catch': '/assets/audio/sfx/boomerang-catch.mp3',
  'dagger-slash': '/assets/audio/sfx/dagger-slash.mp3',
  'whip-crack': '/assets/audio/sfx/whip-crack.mp3',
  'chest-open': '/assets/audio/sfx/chest-open.mp3',
  'enemy-hit': '/assets/audio/sfx/enemy-hit.mp3',
  'player-hurt': '/assets/audio/sfx/player-hurt.mp3',
  'jump': '/assets/audio/sfx/jump.mp3',
  'land': '/assets/audio/sfx/land.mp3',
  'quest-complete': '/assets/audio/sfx/quest-complete.mp3',
};

export class SfxManager {
  private scene: Scene;
  private volume: number = 0.8;
  private cache: Map<string, Sound> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;
  }

  play(name: string): void {
    const url = SFX_CATALOG[name];
    if (!url) {
      Debug.warn('SfxManager', `SFX not found: ${name}`);
      return;
    }

    let sound = this.cache.get(name);
    if (!sound) {
      sound = new Sound(name, url, this.scene, null, {
        loop: false,
        autoplay: false,
        volume: this.volume,
      });
      this.cache.set(name, sound);
    }

    sound.play();
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    for (const sound of this.cache.values()) {
      sound.setVolume(this.volume);
    }
  }

  dispose(): void {
    for (const sound of this.cache.values()) sound.dispose();
    this.cache.clear();
  }
}
