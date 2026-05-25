/**
 * worldManager.ts — Prototype Island scene factory.
 */

import {
  Scene, AbstractEngine, HemisphericLight, DirectionalLight, Vector3, Color3,
  MeshBuilder, StandardMaterial, Texture, Color4, Mesh,
} from '@babylonjs/core';
import { PhysicsAggregate, PhysicsShapeType, PhysicsSystem } from '../core/physics';
import { InputManager } from '../input/inputManager';
import { PlayerController } from '../player/playerController';
import { EnemySpawner } from '../enemies/enemySpawner';
import { NPC } from '../dialogue/npcDialogue';
import { QuestManager } from '../quests/questManager';
import { HUD } from '../ui/hud';
import { AudioManager } from '../audio/audioManager';
import { DayNightCycle } from './dayNightCycle';
import { Environment } from './environment';
import { TreasureSystem } from './treasureSystem';
import { Debug } from '../utils/debug';

export class PrototypeIslandScene {
  static async create(engine: AbstractEngine, inputManager: InputManager): Promise<Scene> {
    Debug.log('World', 'Building Prototype Island...');

    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.53, 0.81, 0.98, 1); // Sky blue

    // Physics
    const physics = new PhysicsSystem(scene);
    await physics.init();

    // Lighting
    const ambient = new HemisphericLight('sun-ambient', new Vector3(0, 1, 0), scene);
    ambient.intensity = 0.6;
    ambient.diffuse = new Color3(1, 0.95, 0.85);

    const sun = new DirectionalLight('sun', new Vector3(-1, -2, -1), scene);
    sun.intensity = 1.2;
    sun.diffuse = new Color3(1, 0.97, 0.9);

    // Terrain (placeholder flat ground)
    const ground = MeshBuilder.CreateGround('ground', { width: 200, height: 200, subdivisions: 20 }, scene);
    const groundMat = new StandardMaterial('ground-mat', scene);
    groundMat.diffuseColor = new Color3(0.3, 0.55, 0.2);
    ground.material = groundMat;
    new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.9 }, scene);

    // Traversal test pieces
    const climbWall = MeshBuilder.CreateBox('climb-wall-test', { width: 8, height: 5, depth: 0.6 }, scene);
    climbWall.position = new Vector3(-10, 2.5, 12);
    climbWall.metadata = { climbable: true };
    const climbMat = new StandardMaterial('climb-wall-mat', scene);
    climbMat.diffuseColor = new Color3(0.45, 0.36, 0.24);
    climbWall.material = climbMat;
    new PhysicsAggregate(climbWall, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.9 }, scene);

    const ledgePlatform = MeshBuilder.CreateBox('ledge-platform-test', { width: 7, height: 0.6, depth: 5 }, scene);
    ledgePlatform.position = new Vector3(-10, 5.4, 9);
    ledgePlatform.metadata = { climbable: true };
    ledgePlatform.material = climbMat;
    new PhysicsAggregate(ledgePlatform, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.9 }, scene);

    const water = MeshBuilder.CreateGround('water-test', { width: 18, height: 14 }, scene);
    water.position = new Vector3(14, 0.03, -18);
    water.metadata = { waterZone: true };
    water.isPickable = false;
    const waterMat = new StandardMaterial('water-test-mat', scene);
    waterMat.diffuseColor = new Color3(0.1, 0.42, 0.75);
    waterMat.alpha = 0.65;
    water.material = waterMat;

    const swingPost = MeshBuilder.CreateCylinder('swing-post-test', { height: 7, diameter: 0.35 }, scene);
    swingPost.position = new Vector3(8, 3.5, 16);
    const postMat = new StandardMaterial('swing-post-mat', scene);
    postMat.diffuseColor = new Color3(0.32, 0.19, 0.1);
    swingPost.material = postMat;
    new PhysicsAggregate(swingPost, PhysicsShapeType.CYLINDER, { mass: 0, restitution: 0, friction: 0.8 }, scene);

    const swingPoint = MeshBuilder.CreateSphere('whip-swing-point-test', { diameter: 0.7 }, scene);
    swingPoint.position = new Vector3(8, 7.2, 16);
    swingPoint.metadata = { swingPoint: true };
    const swingMat = new StandardMaterial('swing-point-mat', scene);
    swingMat.diffuseColor = new Color3(0.95, 0.78, 0.18);
    swingPoint.material = swingMat;

    // Prototype island dressing. These placeholder meshes mark where real GLB assets will be swapped in.
    const environment = new Environment(scene);
    environment.spawnTrees(16, { minX: -42, maxX: 42, minZ: -42, maxZ: 42 });
    environment.spawnRocks(12, { minX: -46, maxX: 46, minZ: -46, maxZ: 46 });

    const caveEntrance = MeshBuilder.CreateBox('cave-entrance-placeholder', { width: 5, height: 4, depth: 1 }, scene);
    caveEntrance.position = new Vector3(-26, 2, -24);
    caveEntrance.metadata = { assetSlot: 'environment/cave-entrance.glb' };
    const caveMat = new StandardMaterial('cave-entrance-mat', scene);
    caveMat.diffuseColor = new Color3(0.08, 0.08, 0.07);
    caveEntrance.material = caveMat;

    const caveArch = MeshBuilder.CreateTorus('cave-arch-placeholder', {
      diameter: 5.8,
      thickness: 0.5,
      tessellation: 18,
    }, scene);
    caveArch.position = new Vector3(-26, 2.1, -23.5);
    caveArch.rotation.x = Math.PI / 2;
    caveArch.metadata = { assetSlot: 'environment/cave-arch.glb' };
    const caveArchMat = new StandardMaterial('cave-arch-mat', scene);
    caveArchMat.diffuseColor = new Color3(0.25, 0.24, 0.22);
    caveArch.material = caveArchMat;

    const campMat = new StandardMaterial('camp-prop-mat', scene);
    campMat.diffuseColor = new Color3(0.45, 0.23, 0.1);
    for (let i = 0; i < 5; i++) {
      const crate = MeshBuilder.CreateBox(`enemy-camp-crate-${i}`, { width: 1.2, height: 0.8, depth: 1.2 }, scene);
      crate.position = new Vector3(16 + i * 1.8, 0.4, 5 + (i % 2) * 3);
      crate.rotation.y = i * 0.45;
      crate.material = campMat;
      crate.metadata = { assetSlot: 'props/camp-crate.glb' };
      new PhysicsAggregate(crate, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.8 }, scene);
    }

    const campfire = MeshBuilder.CreateCylinder('enemy-camp-fire-ring', { height: 0.15, diameter: 2.2 }, scene);
    campfire.position = new Vector3(20, 0.08, 11);
    const fireRingMat = new StandardMaterial('camp-fire-ring-mat', scene);
    fireRingMat.diffuseColor = new Color3(0.12, 0.12, 0.12);
    campfire.material = fireRingMat;

    const villageMat = new StandardMaterial('village-hut-mat', scene);
    villageMat.diffuseColor = new Color3(0.55, 0.36, 0.17);
    for (let i = 0; i < 3; i++) {
      const hut = MeshBuilder.CreateCylinder(`village-hut-${i}`, {
        height: 2.6,
        diameter: 3.2,
        tessellation: 8,
      }, scene);
      hut.position = new Vector3(-18 + i * 5, 1.3, -4 + (i % 2) * 4);
      hut.material = villageMat;
      hut.metadata = { assetSlot: 'environment/village-hut.glb' };
      new PhysicsAggregate(hut, PhysicsShapeType.CYLINDER, { mass: 0, restitution: 0, friction: 0.85 }, scene);

      const roof = MeshBuilder.CreateCylinder(`village-hut-roof-${i}`, {
        height: 1.2,
        diameterTop: 0.2,
        diameterBottom: 3.8,
        tessellation: 8,
      }, scene);
      roof.position = new Vector3(hut.position.x, 3.2, hut.position.z);
      roof.material = climbMat;
      roof.metadata = { assetSlot: 'environment/village-roof.glb' };
    }

    const villageMarker = MeshBuilder.CreateBox('village-test-area-marker', { width: 10, height: 0.08, depth: 8 }, scene);
    villageMarker.position = new Vector3(-13, 0.05, -2);
    villageMarker.isPickable = false;
    const villageMarkerMat = new StandardMaterial('village-marker-mat', scene);
    villageMarkerMat.diffuseColor = new Color3(0.64, 0.52, 0.24);
    villageMarkerMat.alpha = 0.35;
    villageMarker.material = villageMarkerMat;

    // Player
    const player = new PlayerController(scene, inputManager);
    await player.init();

    // Enemies — prototype camp
    const spawner = new EnemySpawner(scene, [], damage => player.playerStats.takeDamage(damage));
    spawner.spawnCamp({
      id: 'jungle-camp-alpha',
      center: new Vector3(20, 0, 10),
      enemyCount: 3,
      patrolRadius: 8,
    });

    // Treasure
    const treasure = new TreasureSystem(scene);
    treasure.placeTreasureChest('chest-1', new Vector3(30, 0, -15), 'golden-idol');

    // NPC
    const elder = new NPC(scene, 'elder-kwame', 'Elder Kwame', new Vector3(-13, 0.9, -5));
    elder.interact();

    // Quest
    const quests = new QuestManager();
    quests.startQuest('find-the-idol');

    // HUD
    const hud = new HUD(scene, player.playerStats, player.playerInventory, inputManager);
    hud.init();

    // Day/night cycle
    const dayNight = new DayNightCycle(scene, sun, ambient);

    // Audio
    const audio = new AudioManager(scene);
    audio.playAmbient('jungle-ambience');

    // Register the update loop
    scene.registerBeforeRender(() => {
      const delta = engine.getDeltaTime() / 1000;
      player.update(delta);
      spawner.update(delta, player.playerMesh.position);
      dayNight.update(delta);
      hud.update();
    });

    Debug.log('World', 'Prototype Island ready!');
    return scene;
  }
}
