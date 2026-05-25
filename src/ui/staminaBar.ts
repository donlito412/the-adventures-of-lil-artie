/**
 * staminaBar.ts — Standalone stamina bar component.
 */

import { createHealthBar } from './healthBar';

export function createStaminaBar(parent: any, options: {
  id: string;
  width: string;
  height: string;
  left?: string;
  top?: string;
  hAlign?: number;
  vAlign?: number;
}) {
  return createHealthBar(parent, { ...options, fillColor: '#27ae60' });
}
