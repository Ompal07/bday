import { SAVE_KEY, SAVE_VERSION } from './constants';
import type { SaveData } from './types';

const defaultSave = (): SaveData => ({
  version: SAVE_VERSION,
  openedGiftIds: [],
  completedMiniGames: [],
  selectedSongId: 'moonlit-purr',
  currentSceneKey: 'TitleScene',
  muted: false,
  volume: 0.8,
});

const cloneSave = (save: SaveData): SaveData => JSON.parse(JSON.stringify(save)) as SaveData;

export class SaveManager {
  private static cache: SaveData | null = null;

  static load(): SaveData {
    if (this.cache) {
      return cloneSave(this.cache);
    }

    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) {
        this.cache = defaultSave();
        return cloneSave(this.cache);
      }

      const parsed = JSON.parse(raw) as Partial<SaveData>;
      this.cache = {
        ...defaultSave(),
        ...parsed,
        version: SAVE_VERSION,
        openedGiftIds: Array.isArray(parsed.openedGiftIds) ? parsed.openedGiftIds : [],
        completedMiniGames: Array.isArray(parsed.completedMiniGames) ? parsed.completedMiniGames : [],
      };
      return cloneSave(this.cache);
    } catch {
      this.cache = defaultSave();
      return cloneSave(this.cache);
    }
  }

  static save(next: SaveData): SaveData {
    this.cache = cloneSave(next);
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.cache));
    } catch {
      // Ignore storage failures on private mode or locked-down web views.
    }
    return cloneSave(this.cache);
  }

  static patch(mutator: (draft: SaveData) => void): SaveData {
    const draft = this.load();
    mutator(draft);
    return this.save(draft);
  }

  static reset(): SaveData {
    const next = defaultSave();
    this.save(next);
    return cloneSave(next);
  }
}
