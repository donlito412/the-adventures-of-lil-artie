/**
 * healthBar.ts — Standalone health bar UI component.
 * Used by both player HUD and enemy health indicators.
 */

import { Control, Rectangle, TextBlock } from '@babylonjs/gui';

export function createHealthBar(
  parent: any,
  options: {
    id: string;
    width: string;
    height: string;
    fillColor?: string;
    showLabel?: boolean;
    left?: string;
    top?: string;
    hAlign?: number;
    vAlign?: number;
  }
): { bg: Rectangle; fill: Rectangle } {
  const bg = new Rectangle(`${options.id}-bg`);
  bg.width = options.width;
  bg.height = options.height;
  bg.background = '#333';
  bg.thickness = 1;
  bg.color = '#555';
  if (options.left) bg.left = options.left;
  if (options.top) bg.top = options.top;
  if (options.hAlign !== undefined) bg.horizontalAlignment = options.hAlign;
  if (options.vAlign !== undefined) bg.verticalAlignment = options.vAlign;
  parent.addControl(bg);

  const fill = new Rectangle(`${options.id}-fill`);
  fill.width = '100%';
  fill.height = '100%';
  fill.background = options.fillColor ?? '#e74c3c';
  fill.thickness = 0;
  fill.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  bg.addControl(fill);

  return { bg, fill };
}
