import { Game } from './game';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error('Canvas element #renderCanvas not found.');
}

const game = new Game(canvas);

game.init()
  .then(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }

    game.start();
  })
  .catch((err) => {
    console.error('Failed to initialize game:', err);
    window.__lilArtieInitError = err instanceof Error ? err.message : String(err);
    const statusEl = document.getElementById('loading-status');
    if (statusEl) statusEl.textContent = `Error loading game: ${window.__lilArtieInitError}`;
  });

declare global {
  interface Window {
    __lilArtieInitError?: string;
  }
}
