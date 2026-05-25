/**
 * playerInventory.ts — Player inventory and weapon slot management.
 */

export type WeaponId = 'boomerang' | 'dagger' | 'whip' | string;

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: 'weapon' | 'item' | 'key' | 'artifact';
}

export class PlayerInventory {
  private items: Map<string, InventoryItem> = new Map();
  private weapons: WeaponId[] = [];
  private activeWeaponIndex: number = 0;

  onWeaponChanged?: (weapon: WeaponId) => void;

  init(startingWeapons: WeaponId[] = ['boomerang', 'dagger', 'whip']): void {
    this.weapons = startingWeapons;
  }

  addItem(item: InventoryItem): void {
    if (this.items.has(item.id)) {
      this.items.get(item.id)!.quantity += item.quantity;
    } else {
      this.items.set(item.id, { ...item });
    }

    if (item.type === 'weapon' && !this.weapons.includes(item.id)) {
      this.weapons.push(item.id);
    }
  }

  removeItem(id: string, quantity = 1): boolean {
    const item = this.items.get(id);
    if (!item) return false;
    item.quantity -= quantity;
    if (item.quantity <= 0) this.items.delete(id);
    return true;
  }

  hasItem(id: string): boolean {
    return this.items.has(id);
  }

  nextWeapon(): void {
    this.activeWeaponIndex = (this.activeWeaponIndex + 1) % this.weapons.length;
    this.onWeaponChanged?.(this.activeWeapon);
  }

  prevWeapon(): void {
    this.activeWeaponIndex = (this.activeWeaponIndex - 1 + this.weapons.length) % this.weapons.length;
    this.onWeaponChanged?.(this.activeWeapon);
  }

  get activeWeapon(): WeaponId {
    return this.weapons[this.activeWeaponIndex] ?? 'none';
  }

  get allWeapons(): WeaponId[] {
    return [...this.weapons];
  }

  get allItems(): InventoryItem[] {
    return Array.from(this.items.values());
  }

  serialize(): { items: InventoryItem[]; weapons: WeaponId[]; activeIndex: number } {
    return {
      items: this.allItems,
      weapons: this.weapons,
      activeIndex: this.activeWeaponIndex,
    };
  }
}
