/**
 * config.ts — Global game configuration constants
 */

export const GameConfig = {
  // Engine
  ENGINE_ANTI_ALIASING: true,
  TARGET_FPS: 60,

  // Player
  PLAYER_WALK_SPEED: 5.0,
  PLAYER_RUN_SPEED: 10.0,
  PLAYER_JUMP_FORCE: 8.0,
  PLAYER_DODGE_SPEED: 14.0,
  PLAYER_DODGE_DURATION: 0.22,
  PLAYER_DODGE_STAMINA_COST: 18,
  PLAYER_CLIMB_SPEED: 3.2,
  PLAYER_CLIMB_STAMINA_DRAIN: 12,
  PLAYER_GLIDE_STAMINA_DRAIN: 8,
  PLAYER_SWIM_SPEED: 4,
  PLAYER_MAX_HEALTH: 100,
  PLAYER_MAX_STAMINA: 100,
  PLAYER_STAMINA_DRAIN_RUN: 15,    // per second
  PLAYER_STAMINA_REGEN: 20,        // per second
  PLAYER_STAMINA_REGEN_DELAY: 1.5, // seconds before regen starts

  // Camera
  CAMERA_RADIUS: 8,
  CAMERA_MIN_RADIUS: 3,
  CAMERA_MAX_RADIUS: 15,
  CAMERA_LOWER_BETA: 0.2,
  CAMERA_UPPER_BETA: 1.4,
  CAMERA_SENSITIVITY: 0.3,

  // Physics
  GRAVITY: -15,
  FALL_DAMAGE_THRESHOLD: 15, // units/second on landing

  // Weapons
  BOOMERANG_SPEED: 25,
  BOOMERANG_RANGE: 20,
  BOOMERANG_RETURN_SPEED: 30,
  BOOMERANG_DAMAGE: 20,
  DAGGER_DAMAGE: 35,
  DAGGER_RANGE: 1.5,
  WHIP_DAMAGE: 15,
  WHIP_RANGE: 5,

  // Enemies
  ENEMY_DETECTION_RADIUS: 12,
  ENEMY_ATTACK_RANGE: 2,
  ENEMY_PATROL_SPEED: 2,
  ENEMY_CHASE_SPEED: 6,
  ENEMY_BASE_HEALTH: 80,

  // World
  DAY_CYCLE_DURATION: 600, // seconds for a full day
  WATER_LEVEL: 0,

  // Debug
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  SHOW_FPS: true,
  SHOW_PHYSICS_COLLIDERS: false,

  // Real asset slots
  BOOMERANG_MODEL: '/assets/models/weapons/boomerang.glb',
  DAGGER_MODEL: '/assets/models/weapons/dagger.glb',
  WHIP_MODEL: '/assets/models/weapons/whip.glb',
} as const;
