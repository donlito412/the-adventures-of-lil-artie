/**
 * questTypes.ts — Quest data structures and type definitions.
 */

export type QuestStatus = 'inactive' | 'active' | 'completed' | 'failed';
export type ObjectiveType = 'collect' | 'defeat' | 'reach' | 'talk' | 'survive';

export interface QuestObjective {
  id: string;
  type: ObjectiveType;
  description: string;
  targetId?: string;
  targetCount?: number;
  currentCount?: number;
  completed: boolean;
}

export interface QuestReward {
  type: 'item' | 'weapon' | 'experience';
  id: string;
  quantity: number;
}

export interface QuestData {
  id: string;
  title: string;
  description: string;
  giverNpcId?: string;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  status: QuestStatus;
  prerequisiteQuestIds?: string[];
}
