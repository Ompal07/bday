import { SceneKeys } from '../game/constants';
import { WorldScene } from './WorldScene';

export class GalleryScene extends WorldScene {
  constructor() {
    super(SceneKeys.Gallery);
  }

  protected roomId(): string {
    return 'gallery';
  }

  protected decorateRoom(): void {
    this.addDecoration(160, 1100, 50, 560, 0x8c6d7d, 0.7);
    this.addDecoration(800, 1100, 50, 560, 0x8c6d7d, 0.7);
    this.addDecoration(480, 1240, 520, 260, 0x38253b, 0.68);
    this.addDecoration(480, 1160, 600, 28, 0xffd6a5, 0.3);
    this.addGlow(220, 820, 120, 0xbdd9ff, 0.16);
    this.addGlow(700, 790, 130, 0xffcad4, 0.14);
    this.addDecoration(260, 880, 150, 120, 0xf6e7ff, 0.66);
    this.addDecoration(520, 820, 150, 120, 0xfff2ca, 0.66);
    this.addDecoration(760, 900, 150, 120, 0xe6f1ff, 0.66);
    this.addDecoration(470, 620, 320, 46, 0xffffff, 0.12);
    this.addDecoration(470, 620, 320, 14, 0xffcad4, 0.48);
    this.addDecoration(470, 530, 140, 100, 0xffd6a5, 0.22);
  }
}
