import Phaser from 'phaser';
import { SceneKeys } from '../game/constants';
import { SaveManager } from '../game/storage';

const textureKeys = [
  'cat',
  'envelope',
  'photo',
  'video',
  'heart',
  'music',
  'gift',
  'star',
  'cake',
  'door',
  'card',
  'basket',
  'card-back',
];

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create(): void {
    this.createTextures();
    void SaveManager.load();
    this.scene.start(SceneKeys.Preload);
  }

  private createTextures(): void {
    const createIfMissing = (key: string, draw: (g: Phaser.GameObjects.Graphics) => void, width = 128, height = 128): void => {
      if (this.textures.exists(key)) {
        return;
      }
      const g = this.add.graphics();
      draw(g);
      g.generateTexture(key, width, height);
      g.destroy();
    };

    createIfMissing('cat', (g) => {
      g.clear();
      g.fillStyle(0xffdfd7, 1);
      g.fillCircle(64, 70, 34);
      g.fillStyle(0xffc2bf, 1);
      g.fillTriangle(34, 35, 50, 10, 64, 38);
      g.fillTriangle(94, 35, 78, 10, 64, 38);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(52, 66, 6);
      g.fillCircle(76, 66, 6);
      g.fillStyle(0x2b1d2b, 1);
      g.fillCircle(52, 66, 2.6);
      g.fillCircle(76, 66, 2.6);
      g.fillStyle(0xffb7c8, 1);
      g.fillCircle(64, 74, 4.4);
      g.lineStyle(4, 0xffa3b7, 1);
      g.beginPath();
      g.arc(64, 80, 10, Phaser.Math.DegToRad(12), Phaser.Math.DegToRad(168), false);
      g.strokePath();
      g.fillStyle(0xffffff, 1);
      g.fillEllipse(64, 92, 58, 38);
      g.fillStyle(0xffd0cc, 1);
      g.fillEllipse(64, 88, 34, 22);
      g.fillStyle(0xffb7c8, 1);
      g.fillTriangle(22, 96, 8, 120, 34, 114);
      g.fillTriangle(106, 96, 120, 120, 94, 114);
      g.fillStyle(0xffe9e8, 1);
      g.fillCircle(43, 107, 7);
      g.fillCircle(85, 107, 7);
    });

    createIfMissing('envelope', (g) => {
      g.fillStyle(0xfff6f2, 1);
      g.fillRoundedRect(16, 28, 96, 72, 14);
      g.lineStyle(4, 0xeab1c1, 1);
      g.strokeRoundedRect(16, 28, 96, 72, 14);
      g.lineStyle(4, 0xf4c7d0, 1);
      g.beginPath();
      g.moveTo(16, 34);
      g.lineTo(64, 74);
      g.lineTo(112, 34);
      g.strokePath();
      g.beginPath();
      g.moveTo(16, 98);
      g.lineTo(48, 70);
      g.lineTo(80, 70);
      g.lineTo(112, 98);
      g.strokePath();
    });

    createIfMissing('photo', (g) => {
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(16, 12, 96, 104, 12);
      g.fillStyle(0xf1d0d6, 1);
      g.fillRoundedRect(24, 20, 80, 72, 10);
      g.fillStyle(0xffefb3, 1);
      g.fillCircle(82, 42, 12);
      g.fillStyle(0xaad5ff, 1);
      g.fillTriangle(28, 86, 52, 56, 78, 86);
      g.fillStyle(0xffb7c8, 1);
      g.fillCircle(43, 46, 10);
    });

    createIfMissing('video', (g) => {
      g.fillStyle(0x121a35, 1);
      g.fillRoundedRect(14, 18, 100, 86, 14);
      g.fillStyle(0xffffff, 0.12);
      g.fillRoundedRect(22, 26, 84, 54, 10);
      g.fillStyle(0xffd6a5, 1);
      g.fillTriangle(54, 38, 54, 68, 82, 53);
      g.fillStyle(0xbdd9ff, 1);
      g.fillCircle(34, 88, 6);
      g.fillCircle(94, 88, 6);
    });

    createIfMissing('heart', (g) => {
      g.fillStyle(0xff8fb0, 1);
      g.fillCircle(50, 46, 20);
      g.fillCircle(78, 46, 20);
      g.fillTriangle(30, 55, 64, 110, 98, 55);
    });

    createIfMissing('music', (g) => {
      g.fillStyle(0xf6e7ff, 1);
      g.fillRoundedRect(34, 18, 56, 86, 12);
      g.fillStyle(0xbdd9ff, 1);
      g.fillCircle(56, 76, 10);
      g.fillStyle(0xffd6a5, 1);
      g.fillRect(68, 28, 6, 40);
      g.fillCircle(74, 68, 8);
    });

    createIfMissing('gift', (g) => {
      g.fillStyle(0xffd6a5, 1);
      g.fillRoundedRect(24, 44, 80, 60, 12);
      g.fillStyle(0xff8fb0, 1);
      g.fillRect(60, 30, 8, 82);
      g.fillRect(30, 68, 68, 8);
      g.fillStyle(0xfff2ca, 1);
      g.fillTriangle(40, 30, 64, 10, 88, 30);
    });

    createIfMissing('star', (g) => {
      g.fillStyle(0xfff2ca, 1);
      const cx = 64;
      const cy = 64;
      const r1 = 42;
      const r2 = 18;
      const points: number[] = [];
      for (let i = 0; i < 10; i += 1) {
        const angle = -Math.PI / 2 + (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? r1 : r2;
        points.push(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      }
      g.fillPoints(points, true);
    });

    createIfMissing('cake', (g) => {
      g.fillStyle(0xf9d4d8, 1);
      g.fillRoundedRect(26, 50, 76, 44, 12);
      g.fillStyle(0xfff3d5, 1);
      g.fillRoundedRect(20, 34, 88, 26, 12);
      g.fillStyle(0xffb7c8, 1);
      g.fillRect(36, 18, 6, 20);
      g.fillRect(58, 14, 6, 24);
      g.fillRect(80, 18, 6, 20);
      g.fillStyle(0xffefb3, 1);
      g.fillCircle(39, 14, 6);
      g.fillCircle(61, 10, 6);
      g.fillCircle(83, 14, 6);
    });

    createIfMissing('door', (g) => {
      g.fillStyle(0x7f5c96, 1);
      g.fillRoundedRect(24, 16, 80, 96, 14);
      g.fillStyle(0xfff5eb, 1);
      g.fillRoundedRect(36, 28, 56, 72, 10);
      g.fillStyle(0xffd6a5, 1);
      g.fillCircle(82, 64, 5);
    });

    createIfMissing('card', (g) => {
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(12, 10, 104, 108, 16);
      g.fillStyle(0xf5d6e3, 1);
      g.fillRoundedRect(20, 18, 88, 92, 12);
      g.fillStyle(0xffb7c8, 1);
      g.fillCircle(46, 50, 12);
      g.fillCircle(82, 50, 12);
      g.fillTriangle(34, 58, 64, 94, 94, 58);
    });

    createIfMissing('basket', (g) => {
      g.fillStyle(0xffffff, 0);
      g.fillRect(0, 0, 128, 128);
      g.fillStyle(0xbdd9ff, 1);
      g.fillRoundedRect(18, 64, 92, 34, 12);
      g.fillStyle(0x88a8ff, 1);
      g.fillRect(26, 58, 76, 8);
      g.lineStyle(4, 0xffffff, 0.7);
      g.beginPath();
      g.moveTo(30, 70);
      g.lineTo(98, 70);
      g.strokePath();
    });

    createIfMissing('card-back', (g) => {
      g.fillStyle(0xffe9e8, 1);
      g.fillRoundedRect(18, 18, 92, 92, 14);
      g.lineStyle(2, 0xffc2bf, 1);
      g.strokeRoundedRect(18, 18, 92, 92, 14);
      g.fillStyle(0xffb7c8, 1);
      g.fillCircle(64, 64, 24);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(56, 58, 5);
      g.fillCircle(72, 58, 5);
    });

    textureKeys.forEach((key) => {
      if (!this.textures.exists(key)) {
        console.warn(`Texture creation failed for ${key}`);
      }
    });
  }
}

