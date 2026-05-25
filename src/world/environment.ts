/**
 * environment.ts — Places trees, rocks, water, and props in the world.
 */

import { Scene, Mesh, MeshBuilder, Vector3, Color3, StandardMaterial } from '@babylonjs/core';
import { Debug } from '../utils/debug';

export class Environment {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * Scatter procedural placeholder trees.
   */
  spawnTrees(count: number, bounds: { minX: number; maxX: number; minZ: number; maxZ: number }): void {
    for (let i = 0; i < count; i++) {
      const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const z = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
      this.createPlaceholderTree(new Vector3(x, 0, z));
    }
    Debug.log('Environment', `Placed ${count} trees.`);
  }

  /**
   * Scatter rocks.
   */
  spawnRocks(count: number, bounds: { minX: number; maxX: number; minZ: number; maxZ: number }): void {
    for (let i = 0; i < count; i++) {
      const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const z = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
      const rock = MeshBuilder.CreateSphere(`rock-${i}`, {
        diameter: 0.5 + Math.random() * 1.5,
        segments: 6,
      }, this.scene);
      rock.position = new Vector3(x, 0.3, z);
      rock.scaling.y = 0.6;
      const mat = new StandardMaterial(`rock-mat-${i}`, this.scene);
      mat.diffuseColor = new Color3(0.4, 0.4, 0.4);
      rock.material = mat;
    }
  }

  /**
   * Create a water plane.
   */
  createWater(y: number = 0, size: number = 200): Mesh {
    const water = MeshBuilder.CreateGround('water', { width: size, height: size }, this.scene);
    water.position.y = y;
    const mat = new StandardMaterial('water-mat', this.scene);
    mat.diffuseColor = new Color3(0.1, 0.4, 0.7);
    mat.alpha = 0.75;
    water.material = mat;
    return water;
  }

  private createPlaceholderTree(position: Vector3): void {
    const trunk = MeshBuilder.CreateCylinder(`trunk-${Math.random()}`, {
      height: 3,
      diameter: 0.3,
    }, this.scene);
    trunk.position = position.add(new Vector3(0, 1.5, 0));
    const trunkMat = new StandardMaterial('trunk-mat', this.scene);
    trunkMat.diffuseColor = new Color3(0.35, 0.2, 0.1);
    trunk.material = trunkMat;

    const canopy = MeshBuilder.CreateSphere(`canopy-${Math.random()}`, {
      diameter: 3 + Math.random() * 2,
      segments: 6,
    }, this.scene);
    canopy.position = position.add(new Vector3(0, 4, 0));
    const canopyMat = new StandardMaterial('canopy-mat', this.scene);
    canopyMat.diffuseColor = new Color3(0.15, 0.5, 0.15);
    canopy.material = canopyMat;
  }
}
