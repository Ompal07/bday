import Phaser from 'phaser';
import type { GiftData, PortalData } from '../game/types';

export type InteractableKind = 'gift' | 'portal';

export interface InteractableModel {
  id: string;
  kind: InteractableKind;
  x: number;
  y: number;
  title: string;
  label: string;
  active: boolean;
}

export class Interactable {
  readonly model: InteractableModel;
  readonly sprite: Phaser.GameObjects.Image;
  readonly label: Phaser.GameObjects.Text;
  private readonly glow: Phaser.GameObjects.Ellipse;

  constructor(scene: Phaser.Scene, item: GiftData | PortalData, key: string, kind: InteractableKind) {
    this.model = {
      id: item.id,
      kind,
      x: item.x,
      y: item.y,
      title: item.title,
      label: item.label,
      active: true,
    };

    this.sprite = scene.add.image(item.x, item.y, key).setDepth(12);
    this.sprite.setScale(kind === 'portal' ? 0.8 : 0.7);

    this.glow = scene.add.ellipse(item.x, item.y + 32, 92, 26, 0xffffff, 0.12).setDepth(11);
    this.label = scene.add
      .text(item.x, item.y + 70, item.label, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '20px',
        color: '#fff8f6',
        align: 'center',
        stroke: '#00111a',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(14);
  }

  setActive(active: boolean): void {
    this.model.active = active;
    this.sprite.setAlpha(active ? 1 : 0.42);
    this.label.setAlpha(active ? 1 : 0.42);
    this.glow.setAlpha(active ? 0.12 : 0.04);
  }

  setCompleted(): void {
    this.sprite.setTint(0xd0ffd8);
    this.sprite.setScale(this.sprite.scale * 0.96);
    this.label.setText('Collected');
  }

  destroy(): void {
    this.sprite.destroy();
    this.label.destroy();
    this.glow.destroy();
  }
}

