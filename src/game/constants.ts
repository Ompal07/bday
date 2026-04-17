export const GAME_TITLE = 'A Birthday Adventure for My Love';
export const GIFTEE_NAME = 'My Love';
export const SAVE_KEY = 'birthday-adventure-save-v1';
export const SAVE_VERSION = 1;
export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 1440;
export const VIEW_WIDTH = 540;
export const VIEW_HEIGHT = 960;
export const INTERACT_RADIUS = 110;
export const ROOM_PADDING = 64;
export const ENDING_UNLOCK_THRESHOLD = 0.75;

export const SceneKeys = {
  Boot: 'BootScene',
  Preload: 'PreloadScene',
  Title: 'TitleScene',
  Bedroom: 'BedroomScene',
  Gallery: 'GalleryScene',
  Garden: 'GardenScene',
  Cake: 'CakeScene',
  Ending: 'EndingScene',
  GiftModal: 'GiftModalScene',
  MemoryMatch: 'MemoryMatchScene',
  CatchHearts: 'CatchHeartsScene',
  SortGifts: 'SortGiftsScene',
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];

