/**
 * audioManager.ts — Top-level audio coordinator.
 */

import { Scene } from '@babylonjs/core';
import { MusicManager } from './musicManager';
import { SfxManager } from './sfxManager';
import { Debug } from '../utils/debug';

export class AudioManager {
  private scene: Scene;
  private music: MusicManager;
  private sfx: SfxManager;

  constructor(scene: Scene) {
    this.scene = scene;
    this.music = new MusicManager(scene);
    this.sfx = new SfxManager(scene);
  }

  playAmbient(trackName: string): void {
    // Placeholder — play when audio files are in place
    Debug.log('AudioManager', `Ambient: ${trackName} (placeholder)`);
  }

  playSfx(soundName: string): void {
    this.sfx.play(soundName);
  }

  playMusic(trackName: string): void {
    this.music.play(trackName);
  }

  stopMusic(): void {
    this.music.stop();
  }

  setMasterVolume(vol: number): void {
    this.music.setVolume(vol);
    this.sfx.setVolume(vol);
  }

  dispose(): void {
    this.music.dispose();
    this.sfx.dispose();
  }
}
