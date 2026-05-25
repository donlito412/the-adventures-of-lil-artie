import { PlayCanvasGame } from './playcanvas/playCanvasGame';

export class Game {
  private runtime: PlayCanvasGame;

  constructor(canvas: HTMLCanvasElement) {
    this.runtime = new PlayCanvasGame(canvas);
  }

  async init(): Promise<void> {
    await this.runtime.init();
  }

  start(): void {
    this.runtime.start();
  }

  dispose(): void {
    this.runtime.dispose();
  }
}
