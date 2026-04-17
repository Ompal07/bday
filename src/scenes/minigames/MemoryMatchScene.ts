import Phaser from 'phaser';
import { SceneKeys } from '../../game/constants';
import { SaveManager } from '../../game/storage';
import { createPanel, createTextButton } from '../../ui/Modal';

type MiniPayload = {
  sourceSceneKey: string;
  miniGameId: string;
  rewardGiftId: string;
};

type CardState = {
  key: string;
  matched: boolean;
  faceUp: boolean;
  sprite: Phaser.GameObjects.Container;
};

export class MemoryMatchScene extends Phaser.Scene {
  private payload!: MiniPayload;
  private cards: CardState[] = [];
  private firstCard: CardState | null = null;
  private locked = false;

  constructor() {
    super(SceneKeys.MemoryMatch);
  }

  create(data: MiniPayload): void {
    this.payload = data;
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0d1225, 0.88).setOrigin(0);
    const panel = createPanel(this, this.scale.width / 2, this.scale.height / 2, this.scale.width - 34, this.scale.height - 60, 0x171427);
    const title = this.add.text(0, -420, 'Memory Match', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    const info = this.add.text(0, -374, 'Match the tiny love icons. Tap two cards at a time.', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#c7d6ff',
      align: 'center',
    }).setOrigin(0.5);
    const close = createTextButton(this, 0, 408, 180, 54, 'Close', 0xffd6a5, () => this.exit(false));
    panel.add([title, info, close]);

    const icons = ['heart', 'star', 'gift', 'cat'];
    const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
    const startX = -150;
    const startY = -210;
    const gapX = 150;
    const gapY = 148;

    deck.forEach((icon, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = startX + col * gapX;
      const y = startY + row * gapY;
      const container = this.createCard(x, y, icon);
      panel.add(container);
      this.cards.push({ key: icon, matched: false, faceUp: false, sprite: container });
    });
  }

  private createCard(x: number, y: number, key: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setInteractive(new Phaser.Geom.Rectangle(-58, -72, 116, 144), Phaser.Geom.Rectangle.Contains);
    const bg = this.add.rectangle(0, 0, 116, 144, 0xffffff, 1).setStrokeStyle(3, 0xffcad4, 0.14);
    const front = this.add.image(0, 0, key).setScale(0.72).setVisible(false);
    const back = this.add.image(0, 0, 'card-back').setScale(0.95);
    container.add([bg, front, back]);

    container.on('pointerdown', () => this.flipCard(container));
    return container;
  }

  private flipCard(container: Phaser.GameObjects.Container): void {
    if (this.locked) {
      return;
    }
    const card = this.cards.find((entry) => entry.sprite === container);
    if (!card || card.faceUp || card.matched) {
      return;
    }

    this.setCardFace(card, true);

    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }

    this.locked = true;
    if (this.firstCard.key === card.key) {
      this.firstCard.matched = true;
      card.matched = true;
      this.firstCard = null;
      this.locked = false;
      if (this.cards.every((entry) => entry.matched)) {
        this.onWin();
      }
      return;
    }

    this.time.delayedCall(650, () => {
      if (this.firstCard) {
        this.setCardFace(this.firstCard, false);
      }
      this.setCardFace(card, false);
      this.firstCard = null;
      this.locked = false;
    });
  }

  private setCardFace(card: CardState, faceUp: boolean): void {
    card.faceUp = faceUp;
    const front = card.sprite.list[1] as Phaser.GameObjects.Image;
    const back = card.sprite.list[2] as Phaser.GameObjects.Image;
    front.setVisible(faceUp);
    back.setVisible(!faceUp);
  }

  private onWin(): void {
    this.add.text(this.scale.width / 2, this.scale.height / 2 + 320, 'So cute. Match complete!', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '24px',
      color: '#fff7ef',
    }).setOrigin(0.5);
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
