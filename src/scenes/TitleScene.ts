import Phaser from 'phaser';
import { GAME_TITLE, GIFTEE_NAME, SceneKeys } from '../game/constants';
import { songs } from '../game/data';
import { AudioManager } from '../game/audio';
import { SaveManager } from '../game/storage';
import { createTextButton, createPanel } from '../ui/Modal';
import { SongSelector } from '../ui/SongSelector';

export class TitleScene extends Phaser.Scene {
  private selector: SongSelector | null = null;
  private save = SaveManager.load();
  private titleCat!: Phaser.GameObjects.Image;

  constructor() {
    super(SceneKeys.Title);
  }

  create(): void {
    this.save = SaveManager.load();
    AudioManager.setMuted(this.save.muted);

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0e1328, 1).setOrigin(0);
    this.add.circle(this.scale.width * 0.18, this.scale.height * 0.16, 180, 0xffcad4, 0.14);
    this.add.circle(this.scale.width * 0.84, this.scale.height * 0.28, 220, 0xbdd9ff, 0.11);
    this.add.circle(this.scale.width * 0.5, this.scale.height * 0.82, 260, 0xffe7ad, 0.08);

    for (let i = 0; i < 12; i += 1) {
      const orb = this.add.circle(40 + (i * 47) % this.scale.width, 120 + (i * 83) % this.scale.height, 6 + (i % 3), i % 2 === 0 ? 0xffcad4 : 0xbdd9ff, 0.48);
      this.tweens.add({
        targets: orb,
        y: `+=${14 + (i % 4) * 8}`,
        x: `+=${i % 2 === 0 ? 8 : -8}`,
        duration: 1800 + i * 80,
        yoyo: true,
        repeat: -1,
      });
    }

    this.titleCat = this.add.image(this.scale.width / 2, 205, 'cat').setScale(1.6);
    this.tweens.add({
      targets: this.titleCat,
      y: this.titleCat.y - 8,
      angle: 3,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const panel = createPanel(this, this.scale.width / 2, this.scale.height * 0.61, this.scale.width - 48, 470, 0x161427);
    const heading = this.add.text(0, -158, GAME_TITLE, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '32px',
      color: '#fff6ef',
      align: 'center',
      stroke: '#0a0812',
      strokeThickness: 5,
      wordWrap: { width: this.scale.width - 120 },
    }).setOrigin(0.5);
    const sub = this.add.text(0, -104, `A gentle birthday adventure for ${GIFTEE_NAME}.`, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#ffdca9',
      align: 'center',
      wordWrap: { width: this.scale.width - 120 },
    }).setOrigin(0.5);
    const progress = SaveManager.load();
    const hasProgress = progress.openedGiftIds.length > 0 || progress.completedMiniGames.length > 0 || progress.currentSceneKey !== SceneKeys.Title;
    const summary = this.add.text(0, -56, hasProgress ? 'Your save data is ready.' : 'Start a little love story and collect memories.', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '16px',
      color: '#c7d6ff',
      align: 'center',
      wordWrap: { width: this.scale.width - 120 },
    }).setOrigin(0.5);
    const start = createTextButton(this, 0, 10, 210, 64, 'Start', 0xffd6a5, () => void this.startAdventure(SceneKeys.Bedroom));
    const continueButton = createTextButton(this, 0, 86, 210, 64, 'Continue', 0xcdf7d5, () => void this.startAdventure(progress.currentSceneKey));
    const songsButton = createTextButton(this, 0, 162, 210, 64, 'Songs', 0xbdd9ff, () => this.openSongSelector());
    const muteButton = createTextButton(this, 0, 238, 210, 64, AudioManager.getMuted() ? 'Muted' : 'Mute', 0xffcad4, () => {
      const muted = AudioManager.toggleMuted();
      (muteButton.list[1] as Phaser.GameObjects.Text).setText(muted ? 'Muted' : 'Mute');
    });
    const resetButton = createTextButton(this, 0, 314, 210, 64, 'Reset save', 0xf4c7d0, () => {
      SaveManager.reset();
      this.scene.restart();
    });

    if (!hasProgress) {
      continueButton.setVisible(false);
    }

    panel.add([heading, sub, summary, start, continueButton, songsButton, muteButton, resetButton]);

    this.tweens.add({
      targets: panel,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.98, to: 1 },
      duration: 600,
      ease: 'Sine.easeOut',
    });
  }

  private openSongSelector(): void {
    if (this.selector) {
      return;
    }

    this.selector = new SongSelector(this, {
      onSelect: (songId) => {
        AudioManager.play(songId);
        this.selector?.destroy();
        this.selector = null;
      },
      onClose: () => {
        this.selector?.destroy();
        this.selector = null;
      },
    }, this.save.selectedSongId);
  }

  private async startAdventure(sceneKey: string): Promise<void> {
    await AudioManager.unlock();
    const chosen = this.save.selectedSongId || songs[0].id;
    AudioManager.play(chosen);
    const nextScene = Object.values(SceneKeys).includes(sceneKey as (typeof SceneKeys)[keyof typeof SceneKeys])
      ? sceneKey
      : SceneKeys.Bedroom;
    this.scene.start(nextScene);
  }
}
