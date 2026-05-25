/**
 * interactables.ts — Interactive world objects (doors, levers, NPCs, etc.)
 */

import { Scene, Mesh, Vector3, ActionManager, ExecuteCodeAction } from '@babylonjs/core';

export type InteractableType = 'npc' | 'chest' | 'door' | 'lever' | 'climbWall' | 'swingPoint';

export interface Interactable {
  id: string;
  type: InteractableType;
  mesh: Mesh;
  interactRadius: number;
  onInteract: () => void;
  label?: string;
}

export class InteractableSystem {
  private scene: Scene;
  private interactables: Map<string, Interactable> = new Map();
  private nearbyInteractable: Interactable | null = null;

  onShowPrompt?: (label: string) => void;
  onHidePrompt?: () => void;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  register(item: Interactable): void {
    this.interactables.set(item.id, item);
  }

  unregister(id: string): void {
    this.interactables.delete(id);
  }

  /**
   * Call each frame with player position. Finds the nearest interactable in range.
   */
  update(playerPos: Vector3): void {
    let closest: Interactable | null = null;
    let closestDist = Infinity;

    for (const item of this.interactables.values()) {
      const dist = Vector3.Distance(playerPos, item.mesh.position);
      if (dist <= item.interactRadius && dist < closestDist) {
        closest = item;
        closestDist = dist;
      }
    }

    if (closest !== this.nearbyInteractable) {
      if (closest) {
        this.onShowPrompt?.(closest.label ?? 'Interact');
      } else {
        this.onHidePrompt?.();
      }
      this.nearbyInteractable = closest;
    }
  }

  /**
   * Trigger the current nearby interactable's action.
   */
  triggerInteraction(): boolean {
    if (!this.nearbyInteractable) return false;
    this.nearbyInteractable.onInteract();
    return true;
  }

  get nearby(): Interactable | null {
    return this.nearbyInteractable;
  }
}
