/**
 * physics.ts — Havok physics engine integration for Babylon.js
 */

import { Scene, HavokPlugin, Vector3, PhysicsAggregate, PhysicsShapeType } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { GameConfig } from './config';
import { Debug } from '../utils/debug';

export class PhysicsSystem {
  private scene: Scene;
  private plugin!: HavokPlugin;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async init(): Promise<void> {
    Debug.log('Physics', 'Initializing Havok physics...');

    const havokInstance = await HavokPhysics();
    this.plugin = new HavokPlugin(true, havokInstance);

    this.scene.enablePhysics(
      new Vector3(0, GameConfig.GRAVITY, 0),
      this.plugin
    );

    Debug.log('Physics', 'Havok physics initialized.');
  }

  get havokPlugin(): HavokPlugin {
    return this.plugin;
  }

  dispose(): void {
    this.scene.disablePhysicsEngine();
  }
}

// Re-export commonly used physics types
export { PhysicsAggregate, PhysicsShapeType };
