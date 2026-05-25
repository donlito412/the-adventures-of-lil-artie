/**
 * engine.ts — Babylon.js engine wrapper
 * Handles engine creation, WebGL/WebGPU detection, and resize.
 */

import { AbstractEngine, Engine as BabylonEngine, WebGPUEngine } from '@babylonjs/core';
import { GameConfig } from './config';
import { Debug } from '../utils/debug';

export class Engine {
  private canvas: HTMLCanvasElement;
  private _engine!: AbstractEngine;
  private fpsCounter: HTMLDivElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async init(): Promise<void> {
    // Try WebGPU first, fall back to WebGL
    const useWebGPU = await WebGPUEngine.IsSupportedAsync;

    if (useWebGPU) {
      Debug.log('Engine', 'WebGPU supported — using WebGPU renderer.');
      const engine = new WebGPUEngine(this.canvas, {
        antialias: GameConfig.ENGINE_ANTI_ALIASING,
      });
      await engine.initAsync();
      this._engine = engine;
    } else {
      Debug.log('Engine', 'WebGPU not available — falling back to WebGL.');
      this._engine = new BabylonEngine(this.canvas, GameConfig.ENGINE_ANTI_ALIASING, {
        preserveDrawingBuffer: true,
        stencil: true,
      });
    }

    if (GameConfig.SHOW_FPS) {
      this.createFpsCounter();
    }
  }

  runRenderLoop(callback: () => void): void {
    this._engine.runRenderLoop(() => {
      callback();
      this.updateFpsCounter();
    });
  }

  stopRenderLoop(): void {
    this._engine.stopRenderLoop();
  }

  resize(): void {
    this._engine.resize();
  }

  dispose(): void {
    this.fpsCounter?.remove();
    this.fpsCounter = null;
    this._engine.dispose();
  }

  get babylonEngine(): AbstractEngine {
    return this._engine;
  }

  get fps(): number {
    return this._engine.getFps();
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

  private updateFpsCounter(): void {
    if (!this.fpsCounter) return;
    this.fpsCounter.textContent = `${Math.round(this.fps)} FPS`;
  }
}
