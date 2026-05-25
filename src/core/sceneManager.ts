/**
 * sceneManager.ts — Manages loading and switching between game scenes.
 */

import { Scene } from '@babylonjs/core';
import { Engine } from './engine';
import { InputManager } from '../input/inputManager';
import { Debug } from '../utils/debug';

export class SceneManager {
  private engine: Engine;
  private inputManager: InputManager;
  private currentScene: Scene | null = null;
  private sceneName: string = '';

  constructor(engine: Engine, inputManager: InputManager) {
    this.engine = engine;
    this.inputManager = inputManager;
  }

  async loadScene(name: string): Promise<void> {
    Debug.log('SceneManager', `Loading scene: ${name}`);

    // Dispose current scene
    if (this.currentScene) {
      this.currentScene.dispose();
    }

    this.sceneName = name;

    // Dynamically import scene modules
    switch (name) {
      case 'prototype-island':
        const { PrototypeIslandScene } = await import('../world/worldManager');
        this.currentScene = await PrototypeIslandScene.create(this.engine.babylonEngine, this.inputManager);
        break;
      default:
        throw new Error(`Unknown scene: ${name}`);
    }

    Debug.log('SceneManager', `Scene "${name}" loaded.`);
  }

  update(): void {
    if (this.currentScene) {
      this.currentScene.render();
    }
  }

  dispose(): void {
    if (this.currentScene) {
      this.currentScene.dispose();
      this.currentScene = null;
    }
  }

  get scene(): Scene | null {
    return this.currentScene;
  }
}
