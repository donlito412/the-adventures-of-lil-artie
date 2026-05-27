import { Engine } from './core/engine';
import { InputManager } from './input/inputManager';
import { SceneManager } from './core/sceneManager';
import { Debug } from './utils/debug';

export class Game {
  private engine: Engine;
  private inputManager: InputManager;
  private sceneManager!: SceneManager;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.inputManager = new InputManager();
  }

  async init(): Promise<void> {
    Debug.log('Game', 'Initializing Babylon.js runtime...');
    await this.engine.init();
    this.inputManager.init(document.getElementById('renderCanvas') ?? undefined);
    this.sceneManager = new SceneManager(this.engine, this.inputManager);
    await this.sceneManager.loadScene('prototype-island');
    Debug.log('Game', 'Babylon.js runtime ready.');
  }

  start(): void {
    this.engine.runRenderLoop(() => {
      this.inputManager.update();
      this.sceneManager.update();
    });

    window.addEventListener('resize', this.onResize);
  }

  dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.sceneManager.dispose();
    this.inputManager.dispose();
    this.engine.dispose();
  }

  private onResize = (): void => {
    this.engine.resize();
  };
}
