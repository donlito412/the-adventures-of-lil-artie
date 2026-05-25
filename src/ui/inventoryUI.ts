/**
 * inventoryUI.ts — Fullscreen inventory overlay.
 */

import { Scene } from '@babylonjs/core';
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control, StackPanel } from '@babylonjs/gui';
import { PlayerInventory } from '../player/playerInventory';

export class InventoryUI {
  private scene: Scene;
  private inventory: PlayerInventory;
  private ui!: AdvancedDynamicTexture;
  private panel!: Rectangle;
  private visible: boolean = false;

  constructor(scene: Scene, inventory: PlayerInventory) {
    this.scene = scene;
    this.inventory = inventory;
  }

  init(): void {
    this.ui = AdvancedDynamicTexture.CreateFullscreenUI('InventoryUI', true, this.scene);

    this.panel = new Rectangle('inv-panel');
    this.panel.width = '400px';
    this.panel.height = '500px';
    this.panel.background = 'rgba(0,0,0,0.85)';
    this.panel.color = '#e8c97a';
    this.panel.thickness = 2;
    this.panel.isVisible = false;
    this.ui.addControl(this.panel);

    const title = new TextBlock('inv-title', 'INVENTORY');
    title.color = '#e8c97a';
    title.fontSize = 20;
    title.fontWeight = 'bold';
    title.top = '-200px';
    this.panel.addControl(title);
  }

  show(): void {
    this.visible = true;
    this.panel.isVisible = true;
    this.refresh();
  }

  hide(): void {
    this.visible = false;
    this.panel.isVisible = false;
  }

  toggle(): void {
    this.visible ? this.hide() : this.show();
  }

  private refresh(): void {
    // TODO: populate inventory item list
  }

  get isVisible(): boolean {
    return this.visible;
  }

  dispose(): void {
    this.ui.dispose();
  }
}
