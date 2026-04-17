import Phaser from 'phaser';
import { SceneKeys, VIEW_HEIGHT, VIEW_WIDTH } from './constants';
import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { TitleScene } from '../scenes/TitleScene';
import { BedroomScene } from '../scenes/BedroomScene';
import { GalleryScene } from '../scenes/GalleryScene';
import { GardenScene } from '../scenes/GardenScene';
import { CakeScene } from '../scenes/CakeScene';
import { EndingScene } from '../scenes/EndingScene';
import { GiftModalScene } from '../scenes/modals/GiftModalScene';
import { MemoryMatchScene } from '../scenes/minigames/MemoryMatchScene';
import { CatchHeartsScene } from '../scenes/minigames/CatchHeartsScene';
import { SortGiftsScene } from '../scenes/minigames/SortGiftsScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#0b1020',
  width: VIEW_WIDTH,
  height: VIEW_HEIGHT,
  dom: {
    createContainer: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    PreloadScene,
    TitleScene,
    BedroomScene,
    GalleryScene,
    GardenScene,
    CakeScene,
    EndingScene,
    GiftModalScene,
    MemoryMatchScene,
    CatchHeartsScene,
    SortGiftsScene,
  ],
  audio: {
    disableWebAudio: false,
  },
  title: SceneKeys.Title,
};
