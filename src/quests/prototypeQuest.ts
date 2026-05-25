/**
 * prototypeQuest.ts — Wires up the first quest: "Find the Golden Idol".
 */

import { QuestManager } from './questManager';
import { TreasureSystem } from '../world/treasureSystem';
import { EnemySpawner } from '../enemies/enemySpawner';
import { Debug } from '../utils/debug';

export function setupPrototypeQuest(
  quests: QuestManager,
  treasure: TreasureSystem,
  enemies: EnemySpawner
): void {
  // When chest-1 is opened, update the collect objective
  treasure.onChestOpened = (chestId, contents) => {
    if (chestId === 'chest-1') {
      quests.updateObjective('find-the-idol', 'collect-idol');
      Debug.log('PrototypeQuest', `Idol collected from ${chestId}!`);
    }
  };

  // When camp guard defeated, update defeat objective
  enemies.enemies.forEach(enemy => {
    enemy.onDefeated = (enemyId) => {
      if (enemyId.startsWith('jungle-camp-alpha')) {
        quests.updateObjective('find-the-idol', 'clear-camp');
      }
    };
  });

  // Quest reward handler
  quests.onQuestCompleted = (quest) => {
    Debug.log('PrototypeQuest', `QUEST COMPLETE: ${quest.title}`);
    // TODO: display reward UI, grant items
  };
}
