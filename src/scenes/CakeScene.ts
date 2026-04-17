import { SceneKeys } from '../game/constants';
import { SaveManager } from '../game/storage';
import type { GiftData } from '../game/types';
import { WorldScene } from './WorldScene';

export class CakeScene extends WorldScene {
  private candlesLeft = 4;
  private hint!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.Cake);
  }

  protected roomId(): string {
    return 'cake';
  }

  protected decorateRoom(): void {
    this.addDecoration(0, 1140, 960, 300, 0x6e4d64, 1);
    this.addDecoration(480, 1150, 340, 160, 0xfff0d5, 0.2);
    this.addGlow(480, 860, 180, 0xfff2ca, 0.18);
    this.addDecoration(480, 980, 200, 50, 0xc99b7a, 1);
    this.addDecoration(480, 930, 150, 24, 0xffcad4, 1);
    this.addDecoration(480, 890, 120, 24, 0xf6e7ff, 1);
    this.addDecoration(480, 840, 92, 24, 0xffefd0, 1);
    this.addDecoration(360, 760, 28, 160, 0xbdd9ff, 0.28);
    this.addDecoration(600, 760, 28, 160, 0xffcad4, 0.28);
    this.addDecoration(300, 700, 18, 120, 0xffd6a5, 0.45);
    this.addDecoration(650, 700, 18, 120, 0xcdf7d5, 0.45);
    this.hint = this.add.text(this.scale.width / 2, this.scale.height / 2 + 270, 'Tap the cake to blow out the candles.', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#fff7ef',
      backgroundColor: 'rgba(18, 15, 36, 0.55)',
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(110);
  }

  protected isPortalActive(): boolean {
    const save = SaveManager.load();
    return this.candlesLeft <= 0 || save.openedGiftIds.includes('birthday-cake');
  }

  protected onGiftInteract(gift: GiftData): void {
    if (gift.id !== 'birthday-cake') {
      super.onGiftInteract(gift);
      return;
    }

    if (this.candlesLeft > 0) {
      this.candlesLeft -= 1;
      const sparkle = this.add.circle(480 + (4 - this.candlesLeft) * 24, 804, 12, 0xfff2ca, 0.95).setDepth(50);
      this.tweens.add({
        targets: sparkle,
        scale: { from: 1, to: 2.8 },
        alpha: { from: 1, to: 0 },
        duration: 500,
        onComplete: () => sparkle.destroy(),
      });
    }

    if (this.candlesLeft <= 0) {
      this.completeGift(gift.id);
      this.targetRecords
        .filter((record) => record.kind === 'portal')
        .forEach((record) => {
          record.active = true;
          record.node.setActive(true);
        });
      this.hint.setText('The candles are out. Your wish is glowing.');
      this.addConfetti();
    } else {
      this.hint.setText(`Nice. ${this.candlesLeft} candle${this.candlesLeft === 1 ? '' : 's'} left.`);
    }
  }

  private addConfetti(): void {
    for (let i = 0; i < 32; i += 1) {
      const dot = this.add.circle(150 + (i * 23) % 680, 350 + (i * 41) % 500, 6 + (i % 3), i % 2 === 0 ? 0xffcad4 : 0xffefb3, 0.95).setDepth(70);
      this.tweens.add({
        targets: dot,
        y: `-=${180 + (i % 4) * 90}`,
        x: `+=${i % 2 === 0 ? 40 : -40}`,
        alpha: { from: 0.96, to: 0 },
        scale: { from: 1, to: 0.2 },
        duration: 1500 + i * 18,
        onComplete: () => dot.destroy(),
      });
    }
  }
}
