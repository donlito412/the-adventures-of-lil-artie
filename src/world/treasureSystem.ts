/**
 * treasureSystem.ts — Treasure chests and collectible artifacts.
 */

import { Scene, Mesh, MeshBuilder, Vector3, Color3, StandardMaterial } from '@babylonjs/core';
import { AssetLoader } from '../core/assetLoader';
import { Debug } from '../utils/debug';

export interface TreasureChest {
  id: string;
  position: Vector3;
  contents: string;
  isOpened: boolean;
  mesh: Mesh;
}

export class TreasureSystem {
  private scene: Scene;
  private chests: Map<string, TreasureChest> = new Map();

  onChestOpened?: (chestId: string, contents: string) => void;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  placeTreasureChest(id: string, position: Vector3, contents: string): TreasureChest {
    const mesh = MeshBuilder.CreateBox(`chest-${id}`, { width: 0.8, height: 0.5, depth: 0.5 }, this.scene);
    mesh.position = position.clone();
    mesh.position.y += 0.25;

    const mat = new StandardMaterial(`chest-mat-${id}`, this.scene);
    mat.diffuseColor = new Color3(0.6, 0.4, 0.1);
    mesh.material = mat;
    void this.attachChestModel(mesh, id);

    const chest: TreasureChest = { id, position, contents, isOpened: false, mesh };
    this.chests.set(id, chest);

    Debug.log('TreasureSystem', `Placed chest: ${id} at ${position}`);
    return chest;
  }

  private async attachChestModel(parent: Mesh, id: string): Promise<void> {
    const model = await new AssetLoader(this.scene).loadModelIfAvailable('/assets/models/props/treasure-chest.glb', `treasure-chest-model-${id}`);
    if (!model) return;

    for (const mesh of model.meshes) {
      mesh.setEnabled(true);
      mesh.isPickable = false;
    }

    model.rootMesh.parent = parent;
    model.rootMesh.position = new Vector3(0, -0.25, 0);
    model.rootMesh.scaling = new Vector3(1.2, 1.2, 1.2);
    parent.visibility = 0;
  }

  openChest(id: string): string | null {
    const chest = this.chests.get(id);
    if (!chest || chest.isOpened) return null;

    chest.isOpened = true;
    // Change mesh color to indicate opened
    (chest.mesh.material as StandardMaterial).diffuseColor = new Color3(0.3, 0.2, 0.05);

    this.onChestOpened?.(id, chest.contents);
    Debug.log('TreasureSystem', `Opened chest ${id}: ${chest.contents}`);
    return chest.contents;
  }

  markOpened(ids: string[]): void {
    for (const id of ids) {
      const chest = this.chests.get(id);
      if (chest) chest.isOpened = true;
    }
  }

  get openedChestIds(): string[] {
    return Array.from(this.chests.values())
      .filter(c => c.isOpened)
      .map(c => c.id);
  }
}
