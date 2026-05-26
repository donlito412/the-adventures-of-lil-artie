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
    scale: 0.014,
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
  oakTree: {
    id: 'realistic-oak-tree',
    type: 'environment',
    path: '/assets/models/environment/realistic-oak-tree.glb',
    scale: 1,
  },
  rock: {
    id: 'realistic-rock',
    type: 'environment',
    path: '/assets/models/environment/realistic-rock.glb',
    scale: 1,
  },
  cliff: {
    id: 'realistic-cliff',
    type: 'environment',
    path: '/assets/models/environment/realistic-cliff.glb',
    scale: 1,
  },
  treasureChest: {
    id: 'treasure-chest',
    type: 'prop',
    path: '/assets/models/props/treasure-chest.glb',
    scale: 1,
  },
  templePillar: {
    id: 'temple-pillar',
    type: 'prop',
    path: '/assets/models/props/temple-pillar.glb',
    scale: 1,
  },
} satisfies Record<string, AssetSlot>;
