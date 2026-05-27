import { Color3, Mesh, Scene, StandardMaterial, VertexData } from '@babylonjs/core';
import terrainData from '../data/terrainHeightmap.json';

export function createRealTerrain(scene: Scene): Mesh {
  const { grid, width, depth, heights } = terrainData as {
    grid: number;
    width: number;
    depth: number;
    heights: number[];
  };

  const positions: number[] = [];
  const indices: number[] = [];
  const colors: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const halfWidth = width / 2;
  const halfDepth = depth / 2;

  for (let z = 0; z < grid; z++) {
    for (let x = 0; x < grid; x++) {
      const height = heights[z * grid + x] ?? 0;
      const px = (x / (grid - 1)) * width - halfWidth;
      const pz = (z / (grid - 1)) * depth - halfDepth;
      positions.push(px, height, pz);
      uvs.push(x / (grid - 1), z / (grid - 1));

      const low = new Color3(0.18, 0.34, 0.14);
      const mid = new Color3(0.36, 0.45, 0.22);
      const high = new Color3(0.42, 0.39, 0.34);
      const color = height < 1.3
        ? Color3.Lerp(low, mid, Math.max(0, height + 1) / 2.3)
        : Color3.Lerp(mid, high, Math.min(1, (height - 1.3) / 4));
      colors.push(color.r, color.g, color.b, 1);
    }
  }

  for (let z = 0; z < grid - 1; z++) {
    for (let x = 0; x < grid - 1; x++) {
      const a = z * grid + x;
      const b = a + 1;
      const c = a + grid;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  VertexData.ComputeNormals(positions, indices, normals);

  const terrain = new Mesh('real-terrain-heightfield', scene);
  const vertexData = new VertexData();
  vertexData.positions = positions;
  vertexData.indices = indices;
  vertexData.normals = normals;
  vertexData.uvs = uvs;
  vertexData.colors = colors;
  vertexData.applyToMesh(terrain);

  const material = new StandardMaterial('real-terrain-heightfield-mat', scene);
  material.diffuseColor = new Color3(1, 1, 1);
  material.specularColor = new Color3(0.05, 0.05, 0.04);
  terrain.material = material;
  terrain.isPickable = true;

  return terrain;
}
