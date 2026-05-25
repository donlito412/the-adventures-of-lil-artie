/**
 * constants.ts — Global string constants and enums.
 */

export const SCENES = {
  PROTOTYPE_ISLAND: 'prototype-island',
  DESERT_CANYON: 'desert-canyon',
  MOUNTAIN_PASS: 'mountain-pass',
  COASTAL_VILLAGE: 'coastal-village',
} as const;

export const LAYERS = {
  DEFAULT: 0x1,
  PLAYER: 0x2,
  ENEMY: 0x4,
  PROJECTILE: 0x8,
  TERRAIN: 0x10,
  INTERACTABLE: 0x20,
  CLIMBABLE: 0x40,
  WATER: 0x80,
  TRIGGER: 0x100,
} as const;

export const MESH_TAGS = {
  CLIMBABLE: 'climbable',
  SWING_POINT: 'swingPoint',
  ENEMY: 'enemy',
  NPC: 'npc',
  CHEST: 'chest',
  CAVE_ENTRANCE: 'caveEntrance',
} as const;

export const EVENTS = {
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_HEALED: 'player:healed',
  PLAYER_DIED: 'player:died',
  ENEMY_DEFEATED: 'enemy:defeated',
  CHEST_OPENED: 'chest:opened',
  QUEST_STARTED: 'quest:started',
  QUEST_COMPLETED: 'quest:completed',
  OBJECTIVE_UPDATED: 'quest:objectiveUpdated',
  WEAPON_SWITCHED: 'weapon:switched',
  DIALOGUE_STARTED: 'dialogue:started',
  DIALOGUE_ENDED: 'dialogue:ended',
} as const;
