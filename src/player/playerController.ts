/**
 * playerController.ts — Top-level player controller.
 * Coordinates movement, camera, combat, inventory, and stats.
 */

import { Scene, MeshBuilder, Mesh, Vector3, Color3, StandardMaterial } from '@babylonjs/core';
import { InputManager } from '../input/inputManager';
import { PlayerMovement } from './playerMovement';
import { PlayerCamera } from './playerCamera';
import { PlayerStats } from './playerStats';
import { PlayerStamina } from './playerStamina';
import { PlayerInventory } from './playerInventory';
import { PlayerCombat } from './playerCombat';
import { WeaponManager } from '../weapons/weaponManager';
import { SaveSystem } from '../core/saveSystem';
import { AssetLoader } from '../core/assetLoader';
import { GameConfig } from '../core/config';
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

    // Create placeholder mesh (capsule) until real model is loaded
    this.mesh = this.createPlaceholderMesh();
    await this.attachLilArtieModel();

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

  private createPlaceholderMesh(): Mesh {
    const capsule = MeshBuilder.CreateCapsule('lilArtie', {
      height: 1.8,
      radius: 0.4,
      tessellation: 8,
    }, this.scene);

    capsule.position = new Vector3(0, 2, 0);

    const mat = new StandardMaterial('artie-mat', this.scene);
    mat.diffuseColor = new Color3(0.3, 0.2, 0.15);  // brown skin tone placeholder
    capsule.material = mat;

    return capsule;
  }

  private async attachLilArtieModel(): Promise<void> {
    const loader = new AssetLoader(this.scene);
    const model = await loader.loadModelIfAvailable(GameConfig.LIL_ARTIE_MODEL, 'lil-artie-model');
    if (!model) return;

    for (const mesh of model.meshes) {
      mesh.setEnabled(true);
      mesh.isPickable = false;
    }

    model.rootMesh.parent = this.mesh;
    model.rootMesh.position = Vector3.Zero();
    model.rootMesh.scaling = new Vector3(1, 1, 1);
    this.mesh.visibility = 0;
    Debug.log('PlayerController', 'Loaded real Lil Artie GLB asset.');
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
