/**
 * assetLoader.ts — Handles loading of GLB/GLTF models, textures, and audio assets.
 */

import {
  Scene,
  SceneLoader,
  AbstractMesh,
  AnimationGroup,
  Texture,
  AssetsManager,
  MeshAssetTask,
  TextureAssetTask,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { Debug } from '../utils/debug';

export interface LoadedModel {
  meshes: AbstractMesh[];
  rootMesh: AbstractMesh;
  animationGroups: AnimationGroup[];
}

export class AssetLoader {
  private scene: Scene;
  private assetsManager: AssetsManager;

  constructor(scene: Scene) {
    this.scene = scene;
    this.assetsManager = new AssetsManager(scene);
    this.assetsManager.useDefaultLoadingScreen = false;
  }

  /**
   * Load a GLB/GLTF model from the public/assets/models directory.
   */
  async loadModel(path: string, name?: string): Promise<LoadedModel> {
    Debug.log('AssetLoader', `Loading model: ${path}`);

    const result = await SceneLoader.ImportMeshAsync('', '', path, this.scene);
    const rootMesh = result.meshes[0];

    if (name) rootMesh.name = name;

    return {
      meshes: result.meshes,
      rootMesh,
      animationGroups: result.animationGroups,
    };
  }

  async loadModelIfAvailable(path: string, name?: string): Promise<LoadedModel | null> {
    if (!(await this.assetExists(path))) {
      Debug.warn('AssetLoader', `Model not found, using placeholder: ${path}`);
      return null;
    }

    return this.loadModel(path, name);
  }

  /**
   * Load a texture from the public/assets/textures directory.
   */
  loadTexture(path: string): Texture {
    return new Texture(path, this.scene);
  }

  /**
   * Queue multiple assets for batch loading with progress callbacks.
   */
  addModelTask(taskName: string, meshNames: string, rootUrl: string, sceneFilename: string): MeshAssetTask {
    return this.assetsManager.addMeshTask(taskName, meshNames, rootUrl, sceneFilename);
  }

  addTextureTask(taskName: string, url: string): TextureAssetTask {
    return this.assetsManager.addTextureTask(taskName, url);
  }

  async loadAll(onProgress?: (remaining: number, total: number) => void): Promise<void> {
    if (onProgress) {
      this.assetsManager.onProgressObservable.add((evt) => {
        onProgress(evt.remainingCount, evt.totalCount);
      });
    }

    return new Promise((resolve, reject) => {
      this.assetsManager.onFinish = () => resolve();
      this.assetsManager.onTaskError = (task) => reject(new Error(`Asset load failed: ${task.name}`));
      this.assetsManager.load();
    });
  }

  private async assetExists(path: string): Promise<boolean> {
    try {
      const res = await fetch(path, { method: 'HEAD' });
      const contentType = res.headers.get('content-type') ?? '';
      return res.ok && !contentType.includes('text/html');
    } catch {
      return false;
    }
  }
}
