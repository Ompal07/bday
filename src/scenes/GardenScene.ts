import { SceneKeys } from '../game/constants';
import { WorldScene } from './WorldScene';

export class GardenScene extends WorldScene {
  constructor() {
    super(SceneKeys.Garden);
  }

  protected roomId(): string {
    return 'garden';
  }

  protected decorateRoom(): void {
    this.addDecoration(0, 1180, 960, 260, 0x264c3f, 1);
    this.addDecoration(220, 1010, 180, 120, 0x3d7e59, 0.52);
    this.addDecoration(760, 1020, 180, 120, 0x3d7e59, 0.52);
    this.addDecoration(600, 840, 80, 220, 0x7b9b58, 0.24);
    this.addDecoration(320, 880, 80, 220, 0x7b9b58, 0.24);
    this.addDecoration(520, 660, 300, 24, 0xfff2ca, 0.4);
    this.addGlow(220, 520, 120, 0xffef9d, 0.18);
    this.addGlow(700, 450, 180, 0xc7ffcb, 0.15);
    this.addDecoration(190, 680, 120, 120, 0xffcad4, 0.4);
    this.addDecoration(760, 660, 120, 120, 0xbdd9ff, 0.36);
    this.addDecoration(500, 1160, 200, 36, 0xfff2ca, 0.2);
    for (let i = 0; i < 8; i += 1) {
      this.addDecoration(140 + i * 100, 1230 + (i % 2) * 16, 18, 48, i % 2 === 0 ? 0xffcad4 : 0xbdd9ff, 0.8);
    }
  }
}
