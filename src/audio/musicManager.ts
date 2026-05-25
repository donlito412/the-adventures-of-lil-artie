/**
 * musicManager.ts — Background music playback with crossfade.
 */

import { Scene, Sound } from '@babylonjs/core';
import { Debug } from '../utils/debug';

const MUSIC_TRACKS: Record<string, string> = {
  'jungle-exploration': '/assets/audio/music/jungle-exploration.mp3',
  'combat-tension': '/assets/audio/music/combat-tension.mp3',
  'cave-ambient': '/assets/audio/music/cave-ambient.mp3',
  'victory': '/assets/audio/music/victory.mp3',
};

export class MusicManager {
  private scene: Scene;
  private currentSound: Sound | null = null;
  private volume: number = 0.5;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  play(trackName: string): void {
    const url = MUSIC_TRACKS[trackName];
    if (!url) {
      Debug.warn('MusicManager', `Track not found: ${trackName}`);
      return;
    }

    this.stop();
    this.currentSound = new Sound(trackName, url, this.scene, null, {
      loop: true,
      autoplay: true,
      volume: this.volume,
    });
    Debug.log('MusicManager', `Playing: ${trackName}`);
  }

  stop(): void {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound.dispose();
      this.currentSound = null;
    }
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    this.currentSound?.setVolume(this.volume);
  }

  dispose(): void {
    this.stop();
  }
}
