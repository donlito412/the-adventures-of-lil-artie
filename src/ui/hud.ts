/**
 * hud.ts — In-game HUD: health bar, stamina bar, weapon icon, quest tracker.
 */

import { Scene } from '@babylonjs/core';
import '@babylonjs/gui';
import {
  AdvancedDynamicTexture as ADT,
  StackPanel,
  Rectangle,
  Control,
  TextBlock,
} from '@babylonjs/gui';
import { PlayerStats } from '../player/playerStats';
import { PlayerInventory } from '../player/playerInventory';
import { InputManager } from '../input/inputManager';
import { ControllerPrompts } from './controllerPrompts';

export class HUD {
  private scene: Scene;
  private stats: PlayerStats;
  private inventory: PlayerInventory;
  private input: InputManager;
  private ui!: ADT;
  private controllerPrompts!: ControllerPrompts;

  private healthBar!: Rectangle;
  private staminaBar!: Rectangle;
  private weaponText!: TextBlock;
  private questText!: TextBlock;

  constructor(scene: Scene, stats: PlayerStats, inventory: PlayerInventory, input: InputManager) {
    this.scene = scene;
    this.stats = stats;
    this.inventory = inventory;
    this.input = input;
  }

  init(): void {
    this.ui = ADT.CreateFullscreenUI('HUD', true, this.scene);

    // --- Health Bar ---
    const hpBg = new Rectangle('hp-bg');
    hpBg.width = '200px';
    hpBg.height = '14px';
    hpBg.color = 'white';
    hpBg.thickness = 1;
    hpBg.background = '#222';
    hpBg.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    hpBg.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    hpBg.left = '20px';
    hpBg.top = '-60px';
    this.ui.addControl(hpBg);

    this.healthBar = new Rectangle('hp-fill');
    this.healthBar.width = '100%';
    this.healthBar.height = '100%';
    this.healthBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.healthBar.background = '#e74c3c';
    this.healthBar.thickness = 0;
    hpBg.addControl(this.healthBar);

    // --- Stamina Bar ---
    const stBg = new Rectangle('st-bg');
    stBg.width = '200px';
    stBg.height = '10px';
    stBg.color = 'white';
    stBg.thickness = 1;
    stBg.background = '#222';
    stBg.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    stBg.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    stBg.left = '20px';
    stBg.top = '-40px';
    this.ui.addControl(stBg);

    this.staminaBar = new Rectangle('st-fill');
    this.staminaBar.width = '100%';
    this.staminaBar.height = '100%';
    this.staminaBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.staminaBar.background = '#2ecc71';
    this.staminaBar.thickness = 0;
    stBg.addControl(this.staminaBar);

    // --- Active Weapon ---
    this.weaponText = new TextBlock('weapon-text');
    this.weaponText.text = '⚔ Boomerang';
    this.weaponText.color = '#f5c518';
    this.weaponText.fontSize = 16;
    this.weaponText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.weaponText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.weaponText.left = '20px';
    this.weaponText.top = '-20px';
    this.ui.addControl(this.weaponText);

    // --- Quest Tracker ---
    this.questText = new TextBlock('quest-text');
    this.questText.text = '';
    this.questText.color = 'white';
    this.questText.fontSize = 13;
    this.questText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.questText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.questText.left = '-20px';
    this.questText.top = '20px';
    this.questText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.ui.addControl(this.questText);

    this.controllerPrompts = new ControllerPrompts(this.ui);
    this.controllerPrompts.showAction('interact');
  }

  update(): void {
    // Health
    this.healthBar.width = `${this.stats.healthPercent * 100}%`;

    // Stamina
    this.staminaBar.width = `${this.stats.staminaPercent * 100}%`;
    this.staminaBar.background = this.stats.staminaPercent < 0.2 ? '#e67e22' : '#2ecc71';

    // Weapon
    this.weaponText.text = `⚔ ${this.inventory.activeWeapon}`;

    this.controllerPrompts.setDevice(this.input.activeControllerType);
  }

  setQuestText(text: string): void {
    this.questText.text = text;
  }

  dispose(): void {
    this.ui.dispose();
  }
}
