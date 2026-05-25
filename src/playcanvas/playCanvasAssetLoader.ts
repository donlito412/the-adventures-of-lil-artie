import * as pc from 'playcanvas';
import { AssetSlot } from './assetManifest';

export class PlayCanvasAssetLoader {
  constructor(private app: pc.Application) {}

  async loadSlot(slot: AssetSlot): Promise<pc.Entity | null> {
    if (!(await this.exists(slot.path))) {
      console.warn(`[AssetLoader] Missing ${slot.id}: ${slot.path}`);
      return null;
    }

    return new Promise((resolve, reject) => {
      this.app.assets.loadFromUrl(slot.path, 'container', (err, asset) => {
        if (err || !asset?.resource) {
          reject(err ?? new Error(`Failed to load ${slot.path}`));
          return;
        }

        const resource = asset.resource as { instantiateRenderEntity: (options?: object) => pc.Entity };
        const entity = resource.instantiateRenderEntity({
          castShadows: true,
          receiveShadows: true,
        });
        entity.name = slot.id;
        entity.setLocalScale(slot.scale, slot.scale, slot.scale);
        resolve(entity);
      });
    });
  }

  private async exists(path: string): Promise<boolean> {
    try {
      const res = await fetch(path, { method: 'HEAD' });
      const contentType = res.headers.get('content-type') ?? '';
      return res.ok && !contentType.includes('text/html');
    } catch {
      return false;
    }
  }
}
