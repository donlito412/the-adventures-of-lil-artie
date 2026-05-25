/**
 * questManager.ts — Tracks active, completed, and available quests.
 */

import { QuestData, QuestStatus, QuestObjective } from './questTypes';
import { Debug } from '../utils/debug';
import questsData from '../data/quests.json';

export class QuestManager {
  private quests: Map<string, QuestData> = new Map();

  onQuestStarted?: (quest: QuestData) => void;
  onObjectiveUpdated?: (questId: string, objective: QuestObjective) => void;
  onQuestCompleted?: (quest: QuestData) => void;

  constructor() {
    // Load quest templates from data
    for (const q of questsData as QuestData[]) {
      this.quests.set(q.id, { ...q, status: 'inactive' });
    }
  }

  startQuest(id: string): boolean {
    const quest = this.quests.get(id);
    if (!quest || quest.status !== 'inactive') return false;

    quest.status = 'active';
    this.onQuestStarted?.(quest);
    Debug.log('QuestManager', `Quest started: ${quest.title}`);
    return true;
  }

  updateObjective(questId: string, objectiveId: string, increment: number = 1): void {
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== 'active') return;

    const obj = quest.objectives.find(o => o.id === objectiveId);
    if (!obj || obj.completed) return;

    if (obj.targetCount !== undefined) {
      obj.currentCount = (obj.currentCount ?? 0) + increment;
      if (obj.currentCount >= obj.targetCount) {
        obj.completed = true;
      }
    } else {
      obj.completed = true;
    }

    this.onObjectiveUpdated?.(questId, obj);

    // Check if all objectives complete
    if (quest.objectives.every(o => o.completed)) {
      this.completeQuest(questId);
    }
  }

  private completeQuest(id: string): void {
    const quest = this.quests.get(id);
    if (!quest) return;

    quest.status = 'completed';
    this.onQuestCompleted?.(quest);
    Debug.log('QuestManager', `Quest completed: ${quest.title}`);
  }

  getActiveQuests(): QuestData[] {
    return Array.from(this.quests.values()).filter(q => q.status === 'active');
  }

  getCompletedQuestIds(): string[] {
    return Array.from(this.quests.values())
      .filter(q => q.status === 'completed')
      .map(q => q.id);
  }

  getQuest(id: string): QuestData | undefined {
    return this.quests.get(id);
  }
}
