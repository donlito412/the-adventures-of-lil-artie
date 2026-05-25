/**
 * playerStats.ts — Player health, stamina, and stat tracking.
 */

import { GameConfig } from '../core/config';

export interface PlayerStatsData {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  level: number;
  experience: number;
}

export class PlayerStats {
  private _health: number;
  private _maxHealth: number;
  private _stamina: number;
  private _maxStamina: number;
  private _level: number = 1;
  private _experience: number = 0;

  onHealthChanged?: (health: number, max: number) => void;
  onStaminaChanged?: (stamina: number, max: number) => void;
  onDeath?: () => void;

  constructor() {
    this._health = GameConfig.PLAYER_MAX_HEALTH;
    this._maxHealth = GameConfig.PLAYER_MAX_HEALTH;
    this._stamina = GameConfig.PLAYER_MAX_STAMINA;
    this._maxStamina = GameConfig.PLAYER_MAX_STAMINA;
  }

  takeDamage(amount: number): void {
    this._health = Math.max(0, this._health - amount);
    this.onHealthChanged?.(this._health, this._maxHealth);
    if (this._health <= 0) this.onDeath?.();
  }

  heal(amount: number): void {
    this._health = Math.min(this._maxHealth, this._health + amount);
    this.onHealthChanged?.(this._health, this._maxHealth);
  }

  drainStamina(amount: number): boolean {
    if (this._stamina < amount) return false;
    this._stamina = Math.max(0, this._stamina - amount);
    this.onStaminaChanged?.(this._stamina, this._maxStamina);
    return true;
  }

  regenStamina(amount: number): void {
    this._stamina = Math.min(this._maxStamina, this._stamina + amount);
    this.onStaminaChanged?.(this._stamina, this._maxStamina);
  }

  get health(): number { return this._health; }
  get maxHealth(): number { return this._maxHealth; }
  get stamina(): number { return this._stamina; }
  get maxStamina(): number { return this._maxStamina; }
  get healthPercent(): number { return this._health / this._maxHealth; }
  get staminaPercent(): number { return this._stamina / this._maxStamina; }
  get isDead(): boolean { return this._health <= 0; }
  get hasStamina(): boolean { return this._stamina > 10; }

  serialize(): PlayerStatsData {
    return {
      health: this._health,
      maxHealth: this._maxHealth,
      stamina: this._stamina,
      maxStamina: this._maxStamina,
      level: this._level,
      experience: this._experience,
    };
  }

  deserialize(data: Partial<PlayerStatsData>): void {
    if (data.health !== undefined) this._health = data.health;
    if (data.maxHealth !== undefined) this._maxHealth = data.maxHealth;
    if (data.stamina !== undefined) this._stamina = data.stamina;
    if (data.maxStamina !== undefined) this._maxStamina = data.maxStamina;
    if (data.level !== undefined) this._level = data.level;
    if (data.experience !== undefined) this._experience = data.experience;
  }
}
