/**
 * playerStamina.ts — Stamina drain/regen tick logic.
 */

import { PlayerStats } from './playerStats';
import { GameConfig } from '../core/config';

export class PlayerStamina {
  private stats: PlayerStats;
  private regenDelayTimer: number = 0;
  private isDraining: boolean = false;

  constructor(stats: PlayerStats) {
    this.stats = stats;
  }

  /**
   * Call once per frame with deltaTime in seconds.
   */
  update(deltaTime: number, isRunning: boolean, isClimbing: boolean): void {
    const draining = isRunning || isClimbing;

    if (draining) {
      this.isDraining = true;
      this.regenDelayTimer = GameConfig.PLAYER_STAMINA_REGEN_DELAY;

      const drainRate = GameConfig.PLAYER_STAMINA_DRAIN_RUN;
      this.stats.drainStamina(drainRate * deltaTime);
    } else {
      this.isDraining = false;
      if (this.regenDelayTimer > 0) {
        this.regenDelayTimer -= deltaTime;
      } else {
        this.stats.regenStamina(GameConfig.PLAYER_STAMINA_REGEN * deltaTime);
      }
    }
  }

  /**
   * Check if player can perform a stamina-costing action.
   */
  canSpend(cost: number): boolean {
    return this.stats.stamina >= cost;
  }

  spend(cost: number): boolean {
    return this.stats.drainStamina(cost);
  }

  get isExhausted(): boolean {
    return this.stats.stamina <= 0;
  }
}
