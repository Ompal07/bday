import Phaser from 'phaser';
import { songs } from '../game/data';
import { createTextButton, createPanel } from './Modal';

export interface SongSelectorCallbacks {
  onSelect: (songId: string) => void;
  onClose: () => void;
}

export class SongSelector {
  readonly panel: Phaser.GameObjects.Container;
  private readonly songLabel: Phaser.GameObjects.Text;
  private currentIndex = 0;

  constructor(scene: Phaser.Scene, callbacks: SongSelectorCallbacks, initialSongId: string) {
    this.currentIndex = Math.max(0, songs.findIndex((song) => song.id === initialSongId));
    this.panel = createPanel(scene, scene.scale.width / 2, scene.scale.height / 2, scene.scale.width - 60, 420, 0x171427);

    const title = scene.add.text(0, -150, 'Select a song', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
      stroke: '#0b0913',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.songLabel = scene.add.text(0, -65, '', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '22px',
      color: '#ffdca9',
      align: 'center',
      wordWrap: { width: scene.scale.width - 140 },
    }).setOrigin(0.5);

    const prev = createTextButton(scene, -120, 50, 96, 56, '<', 0xbdd9ff, () => {
      this.currentIndex = (this.currentIndex - 1 + songs.length) % songs.length;
      this.refresh();
    });
    const next = createTextButton(scene, 120, 50, 96, 56, '>', 0xbdd9ff, () => {
      this.currentIndex = (this.currentIndex + 1) % songs.length;
      this.refresh();
    });
    const choose = createTextButton(scene, 0, 128, 180, 56, 'Use song', 0xcdf7d5, () => {
      callbacks.onSelect(songs[this.currentIndex].id);
    });
    const close = createTextButton(scene, 0, 192, 180, 56, 'Close', 0xffd6a5, callbacks.onClose);

    this.panel.add([title, this.songLabel, prev, next, choose, close]);
    this.refresh();
  }

  refresh(): void {
    const song = songs[this.currentIndex];
    this.songLabel.setText(`${song.title}\n${song.mood}\n${song.bpm} bpm`);
  }

  destroy(): void {
    this.panel.destroy(true);
  }
}

