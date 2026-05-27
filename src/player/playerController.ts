/**
 * playerController.ts — Top-level player controller.
 * Coordinates movement, camera, combat, inventory, and stats.
 */

import { Scene, MeshBuilder, Mesh, Vector3 } from '@babylonjs/core';
import { InputManager } from '../input/inputManager';
import { PlayerMovement } from './playerMovement';
import { PlayerCamera } from './playerCamera';
import { PlayerStats } from './playerStats';
import { PlayerStamina } from './playerStamina';
import { PlayerInventory } from './playerInventory';
import { PlayerCombat } from './playerCombat';
import { WeaponManager } from '../weapons/weaponManager';
import { SaveSystem } from '../core/saveSystem';
import { Debug } from '../utils/debug';

export class PlayerController {
  private scene: Scene;
  private input: InputManager;

  private mesh!: Mesh;
  private stats!: PlayerStats;
  private stamina!: PlayerStamina;
  private inventory!: PlayerInventory;
  private movement!: PlayerMovement;
  private camera!: PlayerCamera;
  private combat!: PlayerCombat;
  private weaponManager!: WeaponManager;

  private deltaTime: number = 0;

  constructor(scene: Scene, input: InputManager) {
    this.scene = scene;
    this.input = input;
  }

  async init(): Promise<void> {
    Debug.log('PlayerController', 'Initializing Lil Artie...');

    this.mesh = this.createControllerMesh();

    // Stats & stamina
    this.stats = new PlayerStats();
    this.stamina = new PlayerStamina(this.stats);

    // Inventory
    this.inventory = new PlayerInventory();
    this.inventory.init(['boomerang', 'dagger', 'whip']);

    // Weapons
    this.weaponManager = new WeaponManager(this.scene);
    await this.weaponManager.init();
    this.inventory.onWeaponChanged = weapon => this.weaponManager.setActiveWeapon(weapon);

    // Movement
    this.movement = new PlayerMovement(this.mesh, this.scene, this.input, this.stats, this.stamina);
    this.movement.initPhysics();

    // Camera
    this.camera = new PlayerCamera(this.scene, this.mesh, this.input);
    this.camera.init();

    // Combat
    this.combat = new PlayerCombat(this.scene, this.mesh, this.input, this.stats, this.weaponManager);

    // Load saved position if available
    const save = SaveSystem.load();
    if (save) {
      const p = save.player.position;
      this.movement.teleport(new Vector3(p.x, p.y, p.z));
      this.stats.deserialize({ health: save.player.health });
    }

    Debug.log('PlayerController', 'Lil Artie ready.');
  }

  update(deltaTime: number): void {
    this.deltaTime = deltaTime;
    this.movement.update(deltaTime, this.camera.yaw);
    this.camera.update(deltaTime);
    this.combat.update(deltaTime);

    // Weapon switching
    if (this.input.wasJustPressed('weaponNext')) this.inventory.nextWeapon();
    if (this.input.wasJustPressed('weaponPrev')) this.inventory.prevWeapon();
    this.weaponManager.update(deltaTime, this.mesh.position);
  }

  private createControllerMesh(): Mesh {
    const capsule = MeshBuilder.CreateCapsule('lilArtie', {
      height: 1.8,
      radius: 0.4,
      tessellation: 8,
    }, this.scene);

    capsule.position = new Vector3(0, 2, 0);
    capsule.visibility = 0;

    return capsule;
  }

  get playerMesh(): Mesh {
    return this.mesh;
  }

  get playerStats(): PlayerStats {
    return this.stats;
  }

  get playerInventory(): PlayerInventory {
    return this.inventory;
  }

  dispose(): void {
    this.camera.dispose();
    this.mesh.dispose();
  }
}
