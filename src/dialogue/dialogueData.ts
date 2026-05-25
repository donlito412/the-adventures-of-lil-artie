/**
 * dialogueData.ts — Type definitions for dialogue trees.
 */

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  nextId?: string;
  choices?: DialogueChoice[];
}

export interface DialogueChoice {
  label: string;
  nextId: string;
  condition?: string;  // expression evaluated at runtime
}

export interface DialogueTree {
  id: string;
  npcId: string;
  startId: string;
  lines: DialogueLine[];
}
