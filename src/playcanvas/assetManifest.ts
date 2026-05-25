export type AssetSlotType = 'character' | 'weapon' | 'environment' | 'prop' | 'enemy' | 'npc';

export interface AssetSlot {
  id: string;
  type: AssetSlotType;
  path: string;
  scale: number;
}

export const assetSlots = {
  lilArtie: {
    id: 'lil-artie',
    type: 'character',
    path: '/assets/models/characters/lil-artie.glb',
    scale: 1,
  },
  boomerang: {
    id: 'boomerang',
    type: 'weapon',
    path: '/assets/models/weapons/boomerang.glb',
    scale: 1,
  },
  dagger: {
    id: 'dagger',
    type: 'weapon',
    path: '/assets/models/weapons/dagger.glb',
    scale: 1,
  },
  whip: {
    id: 'whip',
    type: 'weapon',
    path: '/assets/models/weapons/whip.glb',
    scale: 1,
  },
  prototypeTerrain: {
    id: 'prototype-terrain',
    type: 'environment',
    path: '/assets/models/snowy_mountain_terrain__optimized_mesh.glb',
    scale: 1,
  },
} satisfies Record<string, AssetSlot>;
