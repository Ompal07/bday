import Phaser from 'phaser';
import { SceneKeys } from '../../game/constants';
import { SaveManager } from '../../game/storage';
import { createPanel, createTextButton } from '../../ui/Modal';

type MiniPayload = {
  sourceSceneKey: string;
  miniGameId: string;
  rewardGiftId: string;
};

export class CatchHeartsScene extends Phaser.Scene {
  private payload!: MiniPayload;
  private bucket!: Phaser.GameObjects.Image;
  private hearts: Phaser.GameObjects.Image[] = [];
  private score = 0;
  private timeLeft = 28;
  private running = false;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.CatchHearts);
  }

  create(data: MiniPayload): void {
    this.payload = data;
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x09111f, 0.92).setOrigin(0);
    const panel = createPanel(this, this.scale.width / 2, this.scale.height / 2, this.scale.width - 34, this.scale.height - 60, 0x161427);
    const title = this.add.text(0, -420, 'Catch Hearts', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    const info = this.add.text(0, -376, 'Move the basket with your finger and catch the falling hearts.', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#c7d6ff',
      align: 'center',
    }).setOrigin(0.5);
    this.scoreText = this.add.text(-150, -300, '0 hearts', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '22px',
      color: '#ffdca9',
    }).setOrigin(0.5);
    this.timerText = this.add.text(150, -300, '28s', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '22px',
      color: '#ffdca9',
    }).setOrigin(0.5);
    const close = createTextButton(this, 0, 408, 180, 54, 'Close', 0xffd6a5, () => this.exit(false));

    panel.add([title, info, this.scoreText, this.timerText, close]);
    this.bucket = this.add.image(this.scale.width / 2, this.scale.height - 180, 'basket').setScale(1.1).setDepth(125);
    this.bucket.setInteractive(new Phaser.Geom.Rectangle(-60, -40, 120, 90), Phaser.Geom.Rectangle.Contains);
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.bucket.x = Phaser.Math.Clamp(pointer.x, 90, this.scale.width - 90);
      }
    });
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.bucket.x = Phaser.Math.Clamp(pointer.x, 90, this.scale.width - 90);
    });

    this.running = true;
    this.spawnLoop();
    this.timerLoop();
  }

  private spawnLoop(): void {
    if (!this.running) {
      return;
    }

    const heart = this.add.image(Phaser.Math.Between(70, this.scale.width - 70), -30, 'heart').setScale(0.48 + Math.random() * 0.14).setDepth(124);
    this.hearts.push(heart);

    this.tweens.add({
      targets: heart,
      y: this.scale.height + 40,
      x: `+=${Phaser.Math.Between(-30, 30)}`,
      duration: 1500 + Math.random() * 700,
      onUpdate: () => {
        if (Phaser.Math.Distance.Between(heart.x, heart.y, this.bucket.x, this.bucket.y) < 58) {
          this.collectHeart(heart);
        }
      },
      onComplete: () => heart.destroy(),
    });

    this.time.delayedCall(520, () => this.spawnLoop());
  }

  private timerLoop(): void {
    if (!this.running) {
      return;
    }
    this.timerText.setText(`${this.timeLeft}s`);
    if (this.timeLeft <= 0) {
      this.onWin();
      return;
    }
    this.timeLeft -= 1;
    this.time.delayedCall(1000, () => this.timerLoop());
  }

  private collectHeart(heart: Phaser.GameObjects.Image): void {
    if (!heart.active) {
      return;
    }
    heart.destroy();
    this.score += 1;
    this.scoreText.setText(`${this.score} hearts`);
    if (this.score >= 8) {
      this.onWin();
    }
  }

  private onWin(): void {
    if (!this.running) {
      return;
    }
    this.running = false;
    const parent = this.scene.get(this.payload.sourceSceneKey) as {
      completeMiniGame?: (id: string) => void;
      completeGift?: (id: string) => void;
    };
    parent.completeMiniGame?.(this.payload.miniGameId);
    parent.completeGift?.(this.payload.rewardGiftId);
    SaveManager.patch((draft) => {
      if (!draft.completedMiniGames.includes(this.payload.miniGameId)) {
        draft.completedMiniGames.push(this.payload.miniGameId);
      }
      if (!draft.openedGiftIds.includes(this.payload.rewardGiftId)) {
        draft.openedGiftIds.push(this.payload.rewardGiftId);
      }
    });
    this.add.text(this.scale.width / 2, this.scale.height / 2 + 300, 'Heart pile complete!', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '24px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    this.time.delayedCall(900, () => this.exit(true));
  }

  private exit(completed: boolean): void {
    if (completed) {
      SaveManager.patch((draft) => {
        if (!draft.completedMiniGames.includes(this.payload.miniGameId)) {
          draft.completedMiniGames.push(this.payload.miniGameId);
        }
      });
    }
    this.scene.resume(this.payload.sourceSceneKey);
    this.scene.stop();
  }
}
