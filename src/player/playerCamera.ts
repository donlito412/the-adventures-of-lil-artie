/**
 * playerCamera.ts — Third-person follow camera for Lil Artie.
 */

import { Scene, ArcRotateCamera, Vector3, Mesh } from '@babylonjs/core';
import { InputManager } from '../input/inputManager';
import { GameConfig } from '../core/config';

export class PlayerCamera {
  private camera!: ArcRotateCamera;
  private scene: Scene;
  private target: Mesh;
  private input: InputManager;

  constructor(scene: Scene, target: Mesh, input: InputManager) {
    this.scene = scene;
    this.target = target;
    this.input = input;
  }

  init(): void {
    this.camera = new ArcRotateCamera(
      'playerCamera',
      -Math.PI / 2,
      Math.PI / 3,
      GameConfig.CAMERA_RADIUS,
      this.target.position.add(new Vector3(0, 1.4, 0)),
      this.scene
    );

    this.camera.lowerRadiusLimit = GameConfig.CAMERA_MIN_RADIUS;
    this.camera.upperRadiusLimit = GameConfig.CAMERA_MAX_RADIUS;
    this.camera.lowerBetaLimit = GameConfig.CAMERA_LOWER_BETA;
    this.camera.upperBetaLimit = GameConfig.CAMERA_UPPER_BETA;
    this.camera.wheelPrecision = 35;
    this.camera.position = this.target.position.add(new Vector3(0, 4, -GameConfig.CAMERA_RADIUS));

    // Disable default controls — we drive it manually
    this.camera.inputs.clear();

    this.scene.activeCamera = this.camera;
  }

  update(deltaTime: number): void {
    // Smoothly follow player
    const targetPos = this.target.position.add(new Vector3(0, 1.5, 0));
    this.camera.target = Vector3.Lerp(this.camera.target, targetPos, 10 * deltaTime);

    // Apply input rotation
    const axes = this.input.axes;
    const sensitivity = GameConfig.CAMERA_SENSITIVITY;

    if (Math.abs(axes.cameraX) > 0.01) {
      this.camera.alpha -= axes.cameraX * sensitivity;
    }
    if (Math.abs(axes.cameraY) > 0.01) {
      this.camera.beta += axes.cameraY * sensitivity;
    }
  }

  get yaw(): number {
    return -this.camera.alpha - Math.PI / 2;
  }

  get babylonCamera(): ArcRotateCamera {
    return this.camera;
  }

  dispose(): void {
    this.camera.dispose();
  }
}
