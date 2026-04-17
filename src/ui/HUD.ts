import Phaser from 'phaser';
import { createTextButton } from './Modal';

export interface HudCallbacks {
  onOpenMenu: () => void;
  onToggleMute: () => void;
  onCycleSong: () => void;
}

export class HUD {
  readonly container: Phaser.GameObjects.Container;
  readonly progressText: Phaser.GameObjects.Text;
  readonly roomText: Phaser.GameObjects.Text;
  readonly statusText: Phaser.GameObjects.Text;
  private readonly muteButton: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, callbacks: HudCallbacks) {
    this.container = scene.add.container(0, 0).setScrollFactor(0).setDepth(100);

    this.roomText = scene.add.text(20, 18, 'Room', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '24px',
      color: '#fff6ef',
      stroke: '#0a0812',
      strokeThickness: 4,
    });

    this.progressText = scene.add.text(20, 50, '0 / 0 gifts', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#ffdca9',
      stroke: '#0a0812',
      strokeThickness: 3,
    });

    this.statusText = scene.add.text(20, 76, '', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '16px',
      color: '#c7e7ff',
      stroke: '#0a0812',
      strokeThickness: 3,
    });

    const menu = createTextButton(scene, scene.scale.width - 58, 42, 88, 56, 'Menu', 0xbdd9ff, callbacks.onOpenMenu);
    this.muteButton = createTextButton(scene, scene.scale.width - 158, 42, 88, 56, 'Mute', 0xffd6a5, callbacks.onToggleMute);
    const song = createTextButton(scene, scene.scale.width - 266, 42, 88, 56, 'Song', 0xcdf7d5, callbacks.onCycleSong);

    this.container.add([this.roomText, this.progressText, this.statusText, menu, this.muteButton, song]);
  }

  setProgress(opened: number, total: number): void {
    this.progressText.setText(`${opened} / ${total} gifts`);
  }

  setRoom(title: string, subtitle: string): void {
    this.roomText.setText(title);
    this.statusText.setText(subtitle);
  }

  setMuted(muted: boolean): void {
    const text = this.muteButton.list[1] as Phaser.GameObjects.Text | undefined;
    if (text) {
      text.setText(muted ? 'On' : 'Mute');
    }
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
