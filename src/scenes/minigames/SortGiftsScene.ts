import Phaser from 'phaser';
import { SceneKeys } from '../../game/constants';
import { SaveManager } from '../../game/storage';
import { createPanel, createTextButton } from '../../ui/Modal';

type MiniPayload = {
  sourceSceneKey: string;
  miniGameId: string;
  rewardGiftId: string;
};

type Item = {
  sprite: Phaser.GameObjects.Image;
  target: number;
  placed: boolean;
};

export class SortGiftsScene extends Phaser.Scene {
  private payload!: MiniPayload;
  private items: Item[] = [];

  constructor() {
    super(SceneKeys.SortGifts);
  }

  create(data: MiniPayload): void {
    this.payload = data;
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0e1328, 0.92).setOrigin(0);
    const panel = createPanel(this, this.scale.width / 2, this.scale.height / 2, this.scale.width - 34, this.scale.height - 60, 0x161427);
    const title = this.add.text(0, -420, 'Sort the Gifts', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    const info = this.add.text(0, -376, 'Drag each gift into the matching basket.', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#c7d6ff',
      align: 'center',
    }).setOrigin(0.5);
    const close = createTextButton(this, 0, 408, 180, 54, 'Close', 0xffd6a5, () => this.exit(false));
    panel.add([title, info, close]);

    const baskets = [
      this.createBasket(this.scale.width / 2 - 160, this.scale.height / 2 + 280, 'heart'),
      this.createBasket(this.scale.width / 2, this.scale.height / 2 + 280, 'star'),
      this.createBasket(this.scale.width / 2 + 160, this.scale.height / 2 + 280, 'gift'),
    ];
    void baskets;

    const gifts = [
      { key: 'heart', target: 0, x: -160, y: -60 },
      { key: 'star', target: 1, x: 0, y: -110 },
      { key: 'gift', target: 2, x: 160, y: -60 },
    ];

    gifts.forEach((gift) => {
      const sprite = this.add.image(this.scale.width / 2 + gift.x, this.scale.height / 2 + gift.y, gift.key).setScale(0.6).setDepth(126).setInteractive({ draggable: true });
      sprite.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        sprite.x = dragX;
        sprite.y = dragY;
      });
      sprite.on('dragend', () => {
        const item = this.items.find((entry) => entry.sprite === sprite);
        if (!item) {
          return;
        }
        const basketX = [this.scale.width / 2 - 160, this.scale.width / 2, this.scale.width / 2 + 160][item.target];
        const basketY = this.scale.height / 2 + 280;
        const correct = Phaser.Math.Distance.Between(sprite.x, sprite.y, basketX, basketY) < 80;
        if (correct) {
          item.placed = true;
          sprite.disableInteractive();
          this.tweens.add({
            targets: sprite,
            scale: 0.5,
            alpha: 0.6,
            duration: 200,
          });
          if (this.items.every((entry) => entry.placed)) {
            this.onWin();
          }
        } else {
          this.tweens.add({
            targets: sprite,
            x: gift.x,
            y: gift.y,
            duration: 200,
          });
        }
      });
      this.items.push({ sprite, target: gift.target, placed: false });
    });
  }

  private createBasket(x: number, y: number, key: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setDepth(125);
    const basket = this.add.image(0, 0, 'basket').setScale(0.82);
    const icon = this.add.image(0, -24, key).setScale(0.48);
    const label = this.add.text(0, 46, key, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '16px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    container.add([basket, icon, label]);
    return container;
  }

  private onWin(): void {
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
    this.add.text(this.scale.width / 2, this.scale.height / 2 + 310, 'Everything is in the right box!', {
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
