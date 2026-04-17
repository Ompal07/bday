import { SceneKeys } from '../game/constants';
import { WorldScene } from './WorldScene';

export class BedroomScene extends WorldScene {
  constructor() {
    super(SceneKeys.Bedroom);
  }

  protected roomId(): string {
    return 'bedroom';
  }

  protected decorateRoom(): void {
    this.addDecoration(220, 1220, 280, 180, 0x7b4c6f, 0.82);
    this.addDecoration(210, 1170, 240, 40, 0xf2d7de, 1);
    this.addDecoration(214, 1106, 260, 130, 0xc79bb6, 0.95);
    this.addDecoration(680, 1020, 220, 150, 0x4c3b63, 0.88);
    this.addDecoration(680, 980, 200, 120, 0xfff2e6, 0.84);
    this.addDecoration(770, 880, 130, 120, 0x97d6ff, 0.28);
    this.addGlow(780, 880, 110, 0xbdd9ff, 0.18);
    this.addDecoration(530, 830, 180, 24, 0xffd6a5, 1);
    this.addDecoration(520, 795, 140, 18, 0xffb7c8, 1);
    this.addDecoration(530, 760, 56, 66, 0xbdd9ff, 0.28);
    this.addDecoration(530, 740, 22, 28, 0xfff2ca, 1);
    this.addDecoration(470, 1000, 70, 70, 0xffcad4, 0.7);
    this.addDecoration(470, 1000, 30, 30, 0xffffff, 0.8);
    this.addDecoration(760, 1180, 120, 120, 0x3d305d, 0.76);
    this.addGlow(760, 1180, 120, 0xffe7ad, 0.12);
  }
}
