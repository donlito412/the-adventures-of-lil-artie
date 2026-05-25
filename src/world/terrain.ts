/**
 * terrain.ts — Terrain generation and heightmap loading.
 */

import { Scene, MeshBuilder, Mesh, GroundMesh, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';

export class Terrain {
  private scene: Scene;
  private groundMesh!: GroundMesh;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * Create a basic subdivided ground plane.
   */
  createFlat(width: number, depth: number): GroundMesh {
    this.groundMesh = MeshBuilder.CreateGround('terrain', {
      width,
      height: depth,
      subdivisions: 64,
      updatable: false,
    }, this.scene);
    return this.groundMesh;
  }

  /**
   * Create terrain from a heightmap image.
   * heightmapUrl: path to a grayscale PNG in public/assets/textures/
   */
  createFromHeightmap(heightmapUrl: string, width: number, depth: number, maxHeight: number): GroundMesh {
    this.groundMesh = MeshBuilder.CreateGroundFromHeightMap(
      'terrain',
      heightmapUrl,
      {
        width,
        height: depth,
        subdivisions: 128,
        minHeight: 0,
        maxHeight,
        updatable: false,
      },
      this.scene
    );
    return this.groundMesh;
  }

  applyTexture(diffuseUrl: string): void {
    if (!this.groundMesh) return;
    const mat = new StandardMaterial('terrain-mat', this.scene);
    const tex = new Texture(diffuseUrl, this.scene);
    tex.uScale = 20;
    tex.vScale = 20;
    mat.diffuseTexture = tex;
    this.groundMesh.material = mat;
  }

  get mesh(): GroundMesh {
    return this.groundMesh;
  }
}
