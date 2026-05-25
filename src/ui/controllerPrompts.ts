/**
 * controllerPrompts.ts — Shows context-sensitive button prompts based on active input device.
 */

import { AdvancedDynamicTexture, TextBlock, Control } from '@babylonjs/gui';
import { ControllerType } from '../input/gamepadInput';

const XBOX_ICONS: Record<string, string> = {
  jump: '[A]',
  attackPrimary: '[X]',
  attackSecondary: '[B]',
  dodge: '[Y]',
  interact: '[Y]',
  weaponNext: '[RB]',
  weaponPrev: '[LB]',
  pause: '[☰]',
};

const PS_ICONS: Record<string, string> = {
  jump: '[✕]',
  attackPrimary: '[□]',
  attackSecondary: '[○]',
  dodge: '[△]',
  interact: '[△]',
  weaponNext: '[R1]',
  weaponPrev: '[L1]',
  pause: '[Options]',
};

const KB_ICONS: Record<string, string> = {
  jump: '[Space]',
  attackPrimary: '[F]',
  attackSecondary: '[G]',
  dodge: '[C]',
  interact: '[T]',
  weaponNext: '[E]',
  weaponPrev: '[Q]',
  pause: '[Esc]',
};

export class ControllerPrompts {
  private ui: AdvancedDynamicTexture;
  private promptText!: TextBlock;
  private controllerType: ControllerType | 'keyboard' = 'keyboard';

  constructor(ui: AdvancedDynamicTexture) {
    this.ui = ui;
    this.createPromptLabel();
  }

  private createPromptLabel(): void {
    this.promptText = new TextBlock('prompt-text', '');
    this.promptText.color = 'white';
    this.promptText.fontSize = 14;
    this.promptText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.promptText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.promptText.top = '-100px';
    this.ui.addControl(this.promptText);
  }

  setDevice(type: ControllerType | 'keyboard'): void {
    this.controllerType = type;
  }

  showAction(actionKey: string): void {
    const icons = this.controllerType === 'xbox'
      ? XBOX_ICONS
      : this.controllerType === 'playstation'
        ? PS_ICONS
        : KB_ICONS;

    this.promptText.text = icons[actionKey] ?? `[${actionKey}]`;
    this.promptText.isVisible = true;
  }

  hide(): void {
    this.promptText.isVisible = false;
  }
}
