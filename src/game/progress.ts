import { ENDING_UNLOCK_THRESHOLD } from './constants';
import type { SaveData } from './types';

export interface ProgressSummary {
  opened: number;
  totalGoals: number;
  percent: number;
  endingUnlocked: boolean;
}

export class ProgressManager {
  static summarize(save: SaveData, totalGoals: number): ProgressSummary {
    const opened = new Set(save.openedGiftIds).size + new Set(save.completedMiniGames).size;
    const percent = totalGoals <= 0 ? 0 : Math.min(1, opened / totalGoals);
    return {
      opened,
      totalGoals,
      percent,
      endingUnlocked: percent >= ENDING_UNLOCK_THRESHOLD,
    };
  }
}

