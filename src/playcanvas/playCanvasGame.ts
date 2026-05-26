import * as pc from 'playcanvas';
import { assetSlots } from './assetManifest';

// ─── Internal types for PlayCanvas 2.x container / anim APIs ─────────────────

interface ContainerResource {
  instantiateRenderEntity(options?: { castShadows?: boolean; receiveShadows?: boolean }): pc.Entity;
  animations?: pc.Asset[];
}

interface AnimStateGraph {
  parameters: Record<string, unknown>;
  layers: {
    name: string;
    states: { name: string; speed?: number; loop?: boolean }[];
    transitions: { from: string; to: string; time: number; priority: number; conditions?: unknown[] }[];
  }[];
}

interface AnimComponentExtended {
  loadStateGraph(graph: AnimStateGraph): void;
  assignAnimation(state: string, track: unknown, layer?: string): void;
}

declare global {
  interface Window {
    __lilArtieDebug?: {
      playerPosition: { x: number; y: number; z: number };
      hasPlayer: boolean;
    };
  }
}

// ─── PlayCanvasGame ───────────────────────────────────────────────────────────

export class PlayCanvasGame {
  private app!: pc.Application;
  private player!: pc.Entity;
  private camera!: pc.Entity;
  private playerAnim: pc.AnimComponent | null = null;
  private keys = new Set<string>();
  private cameraYaw = 0;
  private cameraPitch = -18;
  private mouseLookActive = false;
  private fpsCounter: HTMLDivElement | null = null;
  private lastFpsUpdate = 0;
  private frameCount = 0;

  constructor(private canvas: HTMLCanvasElement) {}

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  async init(): Promise<void> {
    this.updateLoadingStatus('Starting PlayCanvas…', 10);

    this.app = new pc.Application(this.canvas, {
      keyboard: new pc.Keyboard(window),
      mouse: new pc.Mouse(this.canvas),
      graphicsDeviceOptions: { antialias: true },
    });

    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    this.app.scene.ambientLight = new pc.Color(0.5, 0.52, 0.58);

    window.addEventListener('resize', () => this.app.resizeCanvas());
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointermove', this.onPointerMove);

    this.createFpsCounter();
    this.createLighting();
    this.createCamera();

    this.updateLoadingStatus('Loading terrain…', 30);
    await this.createWorld();

    this.updateLoadingStatus('Loading character…', 65);
    await this.createPlayer();

    this.updateLoadingStatus('Ready!', 100);
  }

  start(): void {
    this.app.start();
    this.app.on('update', (dt: number) => {
      this.handlePlayerMovement(dt);
      this.updateCamera();
      this.updateDebugState();
      this.updateFps(dt);
    });
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointermove', this.onPointerMove);
    this.fpsCounter?.remove();
    this.app.destroy();
  }

  // ─── Lighting ──────────────────────────────────────────────────────────────

  private createLighting(): void {
    const sun = new pc.Entity('sun');
    sun.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1, 0.95, 0.82),
      intensity: 2.4,
      castShadows: true,
    });
    sun.setEulerAngles(48, 35, 0);
    this.app.root.addChild(sun);

    const fill = new pc.Entity('fill-light');
    fill.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.45, 0.55, 0.7),
      intensity: 0.6,
    });
    fill.setEulerAngles(220, 0, 0);
    this.app.root.addChild(fill);
  }

  // ─── Camera ────────────────────────────────────────────────────────────────

  private createCamera(): void {
    this.camera = new pc.Entity('main-camera');
    this.camera.addComponent('camera', {
      clearColor: new pc.Color(0.49, 0.73, 0.91),
      fov: 62,
      farClip: 2000,
    });
    this.camera.setPosition(0, 6, 10);
    this.app.root.addChild(this.camera);
  }

  // ─── World ─────────────────────────────────────────────────────────────────

  private async createWorld(): Promise<void> {
    // Load terrain GLB — if it succeeds that IS the terrain, no ground box added.
    // Only fall back to a flat box if the GLB is unavailable.
    const terrainLoaded = await this.loadGlb(
      assetSlots.prototypeTerrain.path,
      'terrain-glb',
      new pc.Vec3(0, 0, 0),
      assetSlots.prototypeTerrain.scale,
    );

    if (!terrainLoaded) {
      // Fallback: simple flat green ground so the scene is never empty
      const ground = new pc.Entity('fallback-ground');
      ground.addComponent('render', { type: 'box' });
      ground.setLocalScale(120, 0.4, 120);
      ground.setPosition(0, -0.2, 0);
      this.app.root.addChild(ground);
      const mat = new pc.StandardMaterial();
      mat.diffuse = new pc.Color(0.33, 0.58, 0.22);
      mat.update();
      ground.render!.material = mat;
      console.warn('[World] Terrain GLB not found — using fallback ground.');
    }

    // Zone orientation markers
    this.createMarker('camp-fire-zone', new pc.Vec3(14, 0.15, 10), new pc.Color(0.6, 0.2, 0.12));

    await this.createExplorationSet();
  }

  private async createExplorationSet(): Promise<void> {
    await Promise.all([
      this.placeGlb(assetSlots.oakTree.path, 'oak-tree-a', new pc.Vec3(-10, 0, -8), 1.8, 0),
      this.placeGlb(assetSlots.oakTree.path, 'oak-tree-b', new pc.Vec3(11, 0, -12), 1.45, 48),
      this.placeGlb(assetSlots.oakTree.path, 'oak-tree-c', new pc.Vec3(-18, 0, 12), 1.25, -26),
      this.placeGlb(assetSlots.rock.path, 'rock-a', new pc.Vec3(6, 0, -5), 1.4, 18),
      this.placeGlb(assetSlots.rock.path, 'rock-b', new pc.Vec3(-7, 0, 9), 1.1, -42),
      this.placeGlb(assetSlots.cliff.path, 'cliff-backdrop', new pc.Vec3(22, 0, -18), 2.2, 135),
      this.placeGlb(assetSlots.treasureChest.path, 'treasure-chest', new pc.Vec3(8, 0, 8), 0.8, 30),
      this.placeGlb(assetSlots.templePillar.path, 'pillar-a', new pc.Vec3(-3, 0, 14), 1.1, 0),
      this.placeGlb(assetSlots.templePillar.path, 'pillar-b', new pc.Vec3(2, 0, 15), 1.1, 8),
      this.placeGlb(assetSlots.boomerang.path, 'boomerang-pickup', new pc.Vec3(-2, 1, 4), 0.55, 30),
      this.placeGlb(assetSlots.dagger.path, 'dagger-pickup', new pc.Vec3(0, 1, 4), 0.5, -20),
      this.placeGlb(assetSlots.whip.path, 'whip-pickup', new pc.Vec3(2, 1, 4), 0.55, 12),
    ]);

    this.createWater();
  }

  private createMarker(name: string, position: pc.Vec3, color: pc.Color): void {
    const marker = new pc.Entity(name);
    marker.addComponent('render', { type: 'box' });
    marker.setLocalScale(3, 0.12, 3);
    marker.setPosition(position);
    this.app.root.addChild(marker);
    const mat = new pc.StandardMaterial();
    mat.diffuse = color;
    mat.update();
    marker.render!.material = mat;
  }

  // ─── Player ────────────────────────────────────────────────────────────────

  private async createPlayer(): Promise<void> {
    const slot = assetSlots.lilArtie;

    const available = await this.assetExists(slot.path);
    if (!available) {
      this.createFallbackCapsule();
      return;
    }

    return new Promise<void>((resolve) => {
      this.app.assets.loadFromUrl(slot.path, 'container', (err, asset) => {
        if (err || !asset?.resource) {
          console.warn('[Player] Failed to load character GLB:', err);
          this.createFallbackCapsule();
          resolve();
          return;
        }

        const container = asset.resource as ContainerResource;

        // Instantiate the fully-skinned mesh entity
        const entity = container.instantiateRenderEntity({
          castShadows: true,
          receiveShadows: true,
        });
        entity.name = 'lil-artie';
        entity.setLocalScale(slot.scale, slot.scale, slot.scale);
        entity.setPosition(0, 1, 0);

        // ── Wire the animation system ──────────────────────────────────────
        const animAssets = container.animations ?? [];
        if (animAssets.length > 0) {
          try {
            this.setupAnim(entity, animAssets);
          } catch (animError) {
            console.warn('[Player] Animation setup failed; keeping character mesh loaded:', animError);
          }
        } else {
          console.warn('[Player] Character GLB has no embedded animations — T-pose will show.');
        }

        this.app.root.addChild(entity);
        this.player = entity;
        this.setAnimationMoving(false);
        console.log('[Player] Lil Artie loaded', animAssets.length > 0 ? 'with animations.' : '(no animations).');
        resolve();
      });
    });
  }

  /**
   * Adds the PlayCanvas `anim` component and starts playing the first
   * embedded animation clip in a looping locomotion state.
   */
  private setupAnim(entity: pc.Entity, animAssets: pc.Asset[]): void {
    entity.addComponent('anim', { activate: true });

    const stateGraph: AnimStateGraph = {
      parameters: {},
      layers: [
        {
          name: 'Base Layer',
          states: [
            { name: 'START' },
            { name: 'END' },
            { name: 'locomotion', speed: 1.0, loop: true },
          ],
          transitions: [
            { from: 'START', to: 'locomotion', time: 0, priority: 0, conditions: [] },
          ],
        },
      ],
    };

    const animComp = entity.anim as unknown as AnimComponentExtended;
    animComp.loadStateGraph(stateGraph);
    // Assign the first clip (walking animation) to the locomotion state
    animComp.assignAnimation('locomotion', animAssets[0].resource, 'Base Layer');
    this.playerAnim = entity.anim ?? null;

    console.log(`[Player] Animation assigned: "${animAssets[0].name}"`);
  }

  /** Plain brown capsule used when the character GLB is unavailable. */
  private createFallbackCapsule(): void {
    this.player = new pc.Entity('lil-artie-placeholder');
    this.player.addComponent('render', { type: 'capsule' });
    this.player.setLocalScale(0.6, 1.8, 0.6);
    this.player.setPosition(0, 1.8, 0);
    this.app.root.addChild(this.player);
    const mat = new pc.StandardMaterial();
    mat.diffuse = new pc.Color(0.28, 0.17, 0.1);
    mat.update();
    this.player.render!.material = mat;
    console.warn('[Player] Fallback capsule in use.');
  }

  // ─── Movement ──────────────────────────────────────────────────────────────

  private handlePlayerMovement(dt: number): void {
    if (!this.player) return;

    const speed = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? 7 : 4;
    const input = new pc.Vec2();

    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) input.y += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) input.y -= 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) input.x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) input.x += 1;

    // Gamepad left stick
    const pads = navigator.getGamepads?.() ?? [];
    const pad = Array.from(pads).find(Boolean);
    if (pad) {
      const ax = Math.abs(pad.axes[0] ?? 0) > 0.25 ? (pad.axes[0] ?? 0) : 0;
      const ay = Math.abs(pad.axes[1] ?? 0) > 0.25 ? (pad.axes[1] ?? 0) : 0;
      input.x += ax;
      input.y += -ay;
    }

    const hasMovement = input.lengthSq() > 0.04;
    this.setAnimationMoving(hasMovement);
    if (hasMovement) {
      input.normalize();

      const yaw = this.cameraYaw * pc.math.DEG_TO_RAD;
      const forward = new pc.Vec3(Math.sin(yaw), 0, Math.cos(yaw));
      const right = new pc.Vec3(Math.cos(yaw), 0, -Math.sin(yaw));
      const move = right.mulScalar(input.x).add(forward.mulScalar(input.y));
      move.normalize().mulScalar(speed * dt);

      const next = this.player.getPosition().clone().add(move);
      this.player.setPosition(next.x, Math.max(next.y, 1), next.z);
      this.player.lookAt(next.clone().add(new pc.Vec3(move.x, 0, move.z)));
    }

    const pos = this.player.getPosition();
    if (pos.y < 1) {
      this.player.setPosition(pos.x, 1, pos.z);
    }
  }

  // ─── Camera follow ─────────────────────────────────────────────────────────

  private updateCamera(): void {
    if (!this.player || !this.camera) return;
    const playerPos = this.player.getPosition();
    const yaw = this.cameraYaw * pc.math.DEG_TO_RAD;
    const pitch = this.cameraPitch * pc.math.DEG_TO_RAD;
    const distance = 9;
    const offset = new pc.Vec3(
      Math.sin(yaw) * Math.cos(pitch) * -distance,
      4.8 + Math.sin(pitch) * distance,
      Math.cos(yaw) * Math.cos(pitch) * -distance,
    );
    this.camera.setPosition(playerPos.clone().add(offset));
    this.camera.lookAt(playerPos.clone().add(new pc.Vec3(0, 1.2, 0)));
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Generic GLB loader. Returns true on success, false on any failure.
   * Does NOT add a fallback — callers decide what to do when false is returned.
   */
  private loadGlb(
    path: string,
    name: string,
    position: pc.Vec3,
    scale: number,
  ): Promise<boolean> {
    return this.assetExists(path).then((available) => {
      if (!available) return false;

      return new Promise<boolean>((resolve) => {
        this.app.assets.loadFromUrl(path, 'container', (err, asset) => {
          if (err || !asset?.resource) {
            resolve(false);
            return;
          }
          const container = asset.resource as ContainerResource;
          const entity = container.instantiateRenderEntity({ castShadows: true, receiveShadows: true });
          entity.name = name;
          entity.setPosition(position);
          entity.setLocalScale(scale, scale, scale);
          this.app.root.addChild(entity);
          resolve(true);
        });
      });
    });
  }

  private async placeGlb(
    path: string,
    name: string,
    position: pc.Vec3,
    scale: number,
    yaw: number,
  ): Promise<pc.Entity | null> {
    const entity = await this.loadEntity(path, name, position, scale);
    if (entity) entity.setEulerAngles(0, yaw, 0);
    return entity;
  }

  private loadEntity(path: string, name: string, position: pc.Vec3, scale: number): Promise<pc.Entity | null> {
    return this.assetExists(path).then((available) => {
      if (!available) return null;

      return new Promise<pc.Entity | null>((resolve) => {
        this.app.assets.loadFromUrl(path, 'container', (err, asset) => {
          if (err || !asset?.resource) {
            console.warn(`[World] Failed to load ${name}:`, err);
            resolve(null);
            return;
          }

          const container = asset.resource as ContainerResource;
          const entity = container.instantiateRenderEntity({ castShadows: true, receiveShadows: true });
          entity.name = name;
          entity.setPosition(position);
          entity.setLocalScale(scale, scale, scale);
          this.app.root.addChild(entity);
          resolve(entity);
        });
      });
    });
  }

  private createWater(): void {
    const water = new pc.Entity('coastal-water');
    water.addComponent('render', { type: 'box' });
    water.setLocalScale(80, 0.05, 34);
    water.setPosition(0, -0.03, 32);
    this.app.root.addChild(water);

    const mat = new pc.StandardMaterial();
    mat.diffuse = new pc.Color(0.05, 0.28, 0.42);
    mat.emissive = new pc.Color(0.02, 0.08, 0.1);
    mat.opacity = 0.72;
    mat.blendType = pc.BLEND_NORMAL;
    mat.update();
    water.render!.material = mat;
  }

  private setAnimationMoving(moving: boolean): void {
    if (!this.playerAnim) return;
    this.playerAnim.speed = moving ? 1 : 0;
  }

  private updateDebugState(): void {
    if (!this.player) {
      window.__lilArtieDebug = { hasPlayer: false, playerPosition: { x: 0, y: 0, z: 0 } };
      return;
    }

    const pos = this.player.getPosition();
    window.__lilArtieDebug = {
      hasPlayer: true,
      playerPosition: { x: pos.x, y: pos.y, z: pos.z },
    };
  }

  /** HEAD-check that rejects Vite's 404 → index.html fallback responses. */
  private async assetExists(path: string): Promise<boolean> {
    try {
      const res = await fetch(path, { method: 'HEAD' });
      const ct = res.headers.get('content-type') ?? '';
      return res.ok && !ct.includes('text/html');
    } catch {
      return false;
    }
  }

  // ─── FPS counter ───────────────────────────────────────────────────────────

  private createFpsCounter(): void {
    this.fpsCounter = document.createElement('div');
    this.fpsCounter.id = 'fps-counter';
    Object.assign(this.fpsCounter.style, {
      position: 'fixed', top: '12px', left: '12px',
      padding: '4px 8px', background: 'rgba(0,0,0,0.65)',
      color: '#f5c518', font: '12px monospace',
      zIndex: '10', pointerEvents: 'none',
    });
    document.body.appendChild(this.fpsCounter);
  }

  private updateFps(dt: number): void {
    this.frameCount++;
    this.lastFpsUpdate += dt;
    if (this.lastFpsUpdate < 0.5 || !this.fpsCounter) return;
    this.fpsCounter.textContent = `${Math.round(this.frameCount / this.lastFpsUpdate)} FPS`;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
  }

  private updateLoadingStatus(message: string, progress: number): void {
    const statusEl = document.getElementById('loading-status');
    const barEl = document.getElementById('loading-bar');
    if (statusEl) statusEl.textContent = message;
    if (barEl) barEl.style.width = `${progress}%`;
  }

  private onKeyDown = (e: KeyboardEvent): void => { this.keys.add(e.code); };
  private onKeyUp = (e: KeyboardEvent): void => { this.keys.delete(e.code); };
  private onPointerDown = (): void => { this.mouseLookActive = true; };
  private onPointerUp = (): void => { this.mouseLookActive = false; };
  private onPointerMove = (e: PointerEvent): void => {
    if (!this.mouseLookActive) return;
    this.cameraYaw -= e.movementX * 0.2;
    this.cameraPitch = pc.math.clamp(this.cameraPitch - e.movementY * 0.12, -42, -8);
  };
}
