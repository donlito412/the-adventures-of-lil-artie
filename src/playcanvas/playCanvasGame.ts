import * as pc from 'playcanvas';
import { assetSlots } from './assetManifest';
import { PlayCanvasAssetLoader } from './playCanvasAssetLoader';

export class PlayCanvasGame {
  private app!: pc.Application;
  private player!: pc.Entity;
  private camera!: pc.Entity;
  private keys = new Set<string>();
  private fpsCounter: HTMLDivElement | null = null;
  private lastFpsUpdate = 0;
  private frameCount = 0;
  private currentFps = 0;

  constructor(private canvas: HTMLCanvasElement) {}

  async init(): Promise<void> {
    this.updateLoadingStatus('Starting PlayCanvas...', 15);

    this.app = new pc.Application(this.canvas, {
      keyboard: new pc.Keyboard(window),
      mouse: new pc.Mouse(this.canvas),
      graphicsDeviceOptions: {
        antialias: true,
      },
    });

    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    this.app.scene.ambientLight = new pc.Color(0.45, 0.5, 0.55);

    window.addEventListener('resize', () => this.app.resizeCanvas());
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    this.createFpsCounter();
    this.createLighting();
    this.createCamera();
    this.createWorld();

    this.updateLoadingStatus('Loading real asset slots...', 55);
    await this.createPlayer();

    this.updateLoadingStatus('Ready!', 100);
  }

  start(): void {
    this.app.start();
    this.app.on('update', (dt: number) => {
      this.updatePlayer(dt);
      this.updateCamera();
      this.updateFps(dt);
    });
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.fpsCounter?.remove();
    this.app.destroy();
  }

  private createLighting(): void {
    const sun = new pc.Entity('sun');
    sun.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1, 0.95, 0.82),
      intensity: 2.4,
      castShadows: true,
    });
    sun.setEulerAngles(45, 35, 0);
    this.app.root.addChild(sun);
  }

  private createCamera(): void {
    this.camera = new pc.Entity('main-camera');
    this.camera.addComponent('camera', {
      clearColor: new pc.Color(0.53, 0.81, 0.98),
      fov: 62,
    });
    this.camera.setPosition(0, 5, -8);
    this.app.root.addChild(this.camera);
  }

  private createWorld(): void {
    const ground = new pc.Entity('prototype-island-ground');
    ground.addComponent('render', { type: 'box' });
    ground.setLocalScale(80, 0.2, 80);
    ground.setPosition(0, -0.1, 0);
    this.app.root.addChild(ground);

    const groundMat = new pc.StandardMaterial();
    groundMat.diffuse = new pc.Color(0.33, 0.62, 0.22);
    groundMat.update();
    ground.render!.material = groundMat;

    this.createMarker('asset-drop-zone', new pc.Vec3(-6, 0.1, 5), new pc.Color(0.9, 0.7, 0.2));
    this.createMarker('enemy-camp-zone', new pc.Vec3(14, 0.1, 10), new pc.Color(0.6, 0.2, 0.12));
    this.createMarker('village-zone', new pc.Vec3(-14, 0.1, -8), new pc.Color(0.55, 0.38, 0.16));
  }

  private createMarker(name: string, position: pc.Vec3, color: pc.Color): void {
    const marker = new pc.Entity(name);
    marker.addComponent('render', { type: 'box' });
    marker.setLocalScale(3, 0.1, 3);
    marker.setPosition(position);
    this.app.root.addChild(marker);

    const mat = new pc.StandardMaterial();
    mat.diffuse = color;
    mat.update();
    marker.render!.material = mat;
  }

  private async createPlayer(): Promise<void> {
    const loader = new PlayCanvasAssetLoader(this.app);
    const realPlayer = await loader.loadSlot(assetSlots.lilArtie);

    if (realPlayer) {
      this.player = realPlayer;
      this.player.setPosition(0, 0, 0);
      this.app.root.addChild(this.player);
      return;
    }

    this.player = new pc.Entity('lil-artie-placeholder');
    this.player.addComponent('render', { type: 'capsule' });
    this.player.setLocalScale(0.8, 1.8, 0.8);
    this.player.setPosition(0, 0.9, 0);
    this.app.root.addChild(this.player);

    const mat = new pc.StandardMaterial();
    mat.diffuse = new pc.Color(0.28, 0.17, 0.1);
    mat.update();
    this.player.render!.material = mat;
  }

  private updatePlayer(dt: number): void {
    if (!this.player) return;

    const speed = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? 7 : 4;
    const move = new pc.Vec3();

    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) move.z -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) move.z += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) move.x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) move.x += 1;

    const pads = navigator.getGamepads?.() ?? [];
    const pad = Array.from(pads).find(Boolean);
    if (pad) {
      const x = Math.abs(pad.axes[0] ?? 0) > 0.15 ? pad.axes[0]! : 0;
      const y = Math.abs(pad.axes[1] ?? 0) > 0.15 ? pad.axes[1]! : 0;
      move.x += x;
      move.z += y;
    }

    if (move.lengthSq() <= 0.0001) return;

    move.normalize().mulScalar(speed * dt);
    this.player.translate(move);
    this.player.lookAt(this.player.getPosition().clone().add(new pc.Vec3(move.x, 0, move.z)));
  }

  private updateCamera(): void {
    if (!this.player || !this.camera) return;

    const playerPos = this.player.getPosition();
    const cameraPos = playerPos.clone().add(new pc.Vec3(0, 4, 8));
    this.camera.setPosition(cameraPos);
    this.camera.lookAt(playerPos.clone().add(new pc.Vec3(0, 1.2, 0)));
  }

  private createFpsCounter(): void {
    this.fpsCounter = document.createElement('div');
    this.fpsCounter.id = 'fps-counter';
    this.fpsCounter.style.position = 'fixed';
    this.fpsCounter.style.top = '12px';
    this.fpsCounter.style.left = '12px';
    this.fpsCounter.style.padding = '4px 8px';
    this.fpsCounter.style.background = 'rgba(0, 0, 0, 0.65)';
    this.fpsCounter.style.color = '#f5c518';
    this.fpsCounter.style.font = '12px monospace';
    this.fpsCounter.style.zIndex = '10';
    this.fpsCounter.style.pointerEvents = 'none';
    document.body.appendChild(this.fpsCounter);
  }

  private updateFps(dt: number): void {
    this.frameCount++;
    this.lastFpsUpdate += dt;
    if (this.lastFpsUpdate < 0.5 || !this.fpsCounter) return;

    this.currentFps = Math.round(this.frameCount / this.lastFpsUpdate);
    this.fpsCounter.textContent = `${this.currentFps} FPS`;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
  }

  private updateLoadingStatus(message: string, progress: number): void {
    const statusEl = document.getElementById('loading-status');
    const barEl = document.getElementById('loading-bar');
    if (statusEl) statusEl.textContent = message;
    if (barEl) barEl.style.width = `${progress}%`;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    this.keys.add(event.code);
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
  };
}
