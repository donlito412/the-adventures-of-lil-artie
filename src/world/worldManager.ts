/**
 * worldManager.ts — Prototype Island scene factory.
 */

import {
  Scene, AbstractEngine, HemisphericLight, DirectionalLight, Vector3, Color3,
  MeshBuilder, StandardMaterial, Color4, Mesh,
} from '@babylonjs/core';
import { PhysicsAggregate, PhysicsShapeType, PhysicsSystem } from '../core/physics';
import { AssetLoader } from '../core/assetLoader';
import { InputManager } from '../input/inputManager';
import { PlayerController } from '../player/playerController';
import { EnemySpawner } from '../enemies/enemySpawner';
import { NPC } from '../dialogue/npcDialogue';
import { QuestManager } from '../quests/questManager';
import { HUD } from '../ui/hud';
import { AudioManager } from '../audio/audioManager';
import { DayNightCycle } from './dayNightCycle';
import { TreasureSystem } from './treasureSystem';
import { createRealTerrain } from './realTerrain';
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

    const assetLoader = new AssetLoader(scene);

    // Playable terrain generated from the large real terrain GLB so the browser does not crash.
    createRealTerrain(scene);

    const ground = MeshBuilder.CreateGround('walkable-collision-ground', { width: 78, height: 72, subdivisions: 4 }, scene);
    ground.visibility = 0;
    ground.isPickable = true;
    new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.9 }, scene);

    // Traversal test pieces
    const climbWall = MeshBuilder.CreateBox('climb-wall-test', { width: 8, height: 5, depth: 0.6 }, scene);
    climbWall.position = new Vector3(-10, 2.5, 12);
    climbWall.metadata = { climbable: true };
    climbWall.visibility = 0;
    const climbMat = new StandardMaterial('climb-wall-mat', scene);
    climbMat.diffuseColor = new Color3(0.45, 0.36, 0.24);
    climbWall.material = climbMat;
    new PhysicsAggregate(climbWall, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.9 }, scene);

    const ledgePlatform = MeshBuilder.CreateBox('ledge-platform-test', { width: 7, height: 0.6, depth: 5 }, scene);
    ledgePlatform.position = new Vector3(-10, 5.4, 9);
    ledgePlatform.metadata = { climbable: true };
    ledgePlatform.visibility = 0;
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
    swingPost.visibility = 0;
    const postMat = new StandardMaterial('swing-post-mat', scene);
    postMat.diffuseColor = new Color3(0.32, 0.19, 0.1);
    swingPost.material = postMat;
    new PhysicsAggregate(swingPost, PhysicsShapeType.CYLINDER, { mass: 0, restitution: 0, friction: 0.8 }, scene);

    const swingPoint = MeshBuilder.CreateSphere('whip-swing-point-test', { diameter: 0.7 }, scene);
    swingPoint.position = new Vector3(8, 7.2, 16);
    swingPoint.metadata = { swingPoint: true };
    swingPoint.visibility = 0;
    const swingMat = new StandardMaterial('swing-point-mat', scene);
    swingMat.diffuseColor = new Color3(0.95, 0.78, 0.18);
    swingPoint.material = swingMat;

    await PrototypeIslandScene.placeRealLevelAssets(scene, assetLoader);

    // Player
    const player = new PlayerController(scene, inputManager);
    await player.init();

    // Enemies — prototype camp
    const spawner = new EnemySpawner(scene, [], damage => player.playerStats.takeDamage(damage));
    spawner.spawnCamp({
      id: 'jungle-camp-alpha',
      center: new Vector3(20, 0, 10),
      enemyCount: 1,
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

  private static async placeRealLevelAssets(scene: Scene, assetLoader: AssetLoader): Promise<void> {
    const placements: Array<{
      path: string;
      name: string;
      position: Vector3;
      scaling: Vector3;
      rotationY?: number;
      collider?: { size: Vector3; centerOffset: Vector3; shape?: PhysicsShapeType };
    }> = [
      {
        path: '/assets/models/environment/realistic-rock.glb',
        name: 'real-rock-climb-base',
        position: new Vector3(-9, 0, 7),
        scaling: new Vector3(2.2, 1.6, 2.2),
        rotationY: 0.3,
        collider: { size: new Vector3(3, 1.8, 3), centerOffset: new Vector3(0, 0.9, 0) },
      },
      {
        path: '/assets/models/environment/realistic-cliff.glb',
        name: 'real-cliff-cave',
        position: new Vector3(-24, 0, -18),
        scaling: new Vector3(3.5, 3, 3.5),
        rotationY: -0.6,
        collider: { size: new Vector3(7, 5, 3), centerOffset: new Vector3(0, 2.5, 0) },
      },
      {
        path: '/assets/models/props/temple-pillar.glb',
        name: 'real-ruin-pillar-left',
        position: new Vector3(-4, 0, -15),
        scaling: new Vector3(1.7, 1.7, 1.7),
        collider: { size: new Vector3(1.2, 3.2, 1.2), centerOffset: new Vector3(0, 1.6, 0), shape: PhysicsShapeType.CYLINDER },
      },
    ];

    for (const item of placements) {
      const model = await assetLoader.loadModelIfAvailable(item.path, item.name);
      if (!model) continue;

      model.rootMesh.position = item.position;
      model.rootMesh.scaling = item.scaling;
      model.rootMesh.rotation.y = item.rotationY ?? 0;
      for (const mesh of model.meshes) {
        mesh.isPickable = false;
      }

      if (item.collider) {
        const collider = item.collider.shape === PhysicsShapeType.CYLINDER
          ? MeshBuilder.CreateCylinder(`${item.name}-collider`, {
            height: item.collider.size.y,
            diameter: Math.max(item.collider.size.x, item.collider.size.z),
          }, scene)
          : MeshBuilder.CreateBox(`${item.name}-collider`, {
            width: item.collider.size.x,
            height: item.collider.size.y,
            depth: item.collider.size.z,
          }, scene);
        collider.position = item.position.add(item.collider.centerOffset);
        collider.visibility = 0;
        collider.isPickable = true;
        new PhysicsAggregate(collider as Mesh, item.collider.shape ?? PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.85 }, scene);
      }
    }
  }
}
