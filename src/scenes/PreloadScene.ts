import Phaser from 'phaser';
import { SceneKeys } from '../game/constants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preload);
  }

  create(): void {
    const title = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, 'Loading the little world...', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    const note = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 24, 'Preparing gifts, songs, and cozy scenes.', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#c7d6ff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [title, note],
      alpha: { from: 0.2, to: 1 },
      yoyo: true,
      repeat: -1,
      duration: 1200,
    });

    this.time.delayedCall(280, () => {
      this.scene.start(SceneKeys.Title);
    });
  }
}

