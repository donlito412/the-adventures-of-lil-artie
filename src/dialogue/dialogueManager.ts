/**
 * dialogueManager.ts — Drives dialogue trees and emits UI events.
 */

import { DialogueTree, DialogueLine, DialogueChoice } from './dialogueData';
import { Debug } from '../utils/debug';

export class DialogueManager {
  private trees: Map<string, DialogueTree> = new Map();
  private activeLine: DialogueLine | null = null;
  private activeTree: DialogueTree | null = null;

  onLineReady?: (line: DialogueLine) => void;
  onChoicesReady?: (choices: DialogueChoice[]) => void;
  onDialogueEnd?: () => void;

  registerTree(tree: DialogueTree): void {
    this.trees.set(tree.id, tree);
  }

  start(treeId: string): boolean {
    const tree = this.trees.get(treeId);
    if (!tree) {
      Debug.warn('DialogueManager', `Tree not found: ${treeId}`);
      return false;
    }

    this.activeTree = tree;
    this.showLine(tree.startId);
    return true;
  }

  advance(choiceIndex?: number): void {
    if (!this.activeLine || !this.activeTree) return;

    if (this.activeLine.choices && choiceIndex !== undefined) {
      const choice = this.activeLine.choices[choiceIndex];
      if (choice) this.showLine(choice.nextId);
    } else if (this.activeLine.nextId) {
      this.showLine(this.activeLine.nextId);
    } else {
      this.end();
    }
  }

  private showLine(lineId: string): void {
    const line = this.activeTree!.lines.find(l => l.id === lineId);
    if (!line) {
      this.end();
      return;
    }

    this.activeLine = line;
    this.onLineReady?.(line);

    if (line.choices) {
      this.onChoicesReady?.(line.choices);
    }
  }

  private end(): void {
    this.activeLine = null;
    this.activeTree = null;
    this.onDialogueEnd?.();
    Debug.log('DialogueManager', 'Dialogue ended.');
  }

  get isActive(): boolean {
    return this.activeTree !== null;
  }
}
