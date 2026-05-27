/**
 * npcDialogue.ts — NPC entity with attached dialogue tree.
 */

import { Scene, Mesh, MeshBuilder, Vector3, Color3, StandardMaterial } from '@babylonjs/core';
import { DialogueManager } from './dialogueManager';
import { DialogueTree } from './dialogueData';
import dialogueData from '../data/dialogue.json';
import { AssetLoader } from '../core/assetLoader';
import { Debug } from '../utils/debug';

export class NPC {
  private scene: Scene;
  private mesh!: Mesh;
  private dialogueManager: DialogueManager;
  readonly id: string;
  readonly name: string;

  constructor(scene: Scene, id: string, name: string, position: Vector3) {
    this.scene = scene;
    this.id = id;
    this.name = name;
    this.dialogueManager = new DialogueManager();

    this.createMesh(position);
    this.loadDialogue();
  }

  private createMesh(position: Vector3): void {
    this.mesh = MeshBuilder.CreateCapsule(`npc-${this.id}`, { height: 1.75, radius: 0.32 }, this.scene);
    this.mesh.position = position.clone();

    const mat = new StandardMaterial(`npc-mat-${this.id}`, this.scene);
    mat.diffuseColor = new Color3(0.2, 0.5, 0.8); // blue to distinguish from enemies
    this.mesh.material = mat;

    void this.attachNpcModel();
  }

  private async attachNpcModel(): Promise<void> {
    const model = await new AssetLoader(this.scene).loadModelIfAvailable('/assets/models/characters/realistic-artie.glb', `npc-model-${this.id}`);
    if (!model) return;

    for (const mesh of model.meshes) {
      mesh.setEnabled(true);
      mesh.isPickable = false;
    }

    model.rootMesh.parent = this.mesh;
    model.rootMesh.position = new Vector3(0, 0.95, 0);
    model.rootMesh.scaling = new Vector3(1, 1, 1);
    this.mesh.visibility = 0;
  }

  private loadDialogue(): void {
    const trees = (dialogueData as DialogueTree[]).filter(t => t.npcId === this.id);
    for (const tree of trees) {
      this.dialogueManager.registerTree(tree);
    }
    Debug.log('NPC', `${this.name} has ${trees.length} dialogue trees.`);
  }

  interact(): void {
    Debug.log('NPC', `Talking to ${this.name}`);
    // Start the first available tree for this NPC
    this.dialogueManager.start(`${this.id}-greeting`);
  }

  get position(): Vector3 {
    return this.mesh.position;
  }

  get dialogue(): DialogueManager {
    return this.dialogueManager;
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
