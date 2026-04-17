import { SceneKeys } from '../game/constants';
import { WorldScene } from './WorldScene';

export class EndingScene extends WorldScene {
  constructor() {
    super(SceneKeys.Ending);
  }

  protected roomId(): string {
    return 'ending';
  }

  protected decorateRoom(): void {
    this.addGlow(480, 500, 260, 0xf6c6ff, 0.18);
    this.addGlow(240, 360, 180, 0xffe7ad, 0.14);
    this.addGlow(720, 360, 180, 0xbdd9ff, 0.12);
    this.addDecoration(180, 1180, 220, 38, 0xffffff, 0.15);
    this.addDecoration(780, 1180, 220, 38, 0xffffff, 0.15);
    this.addDecoration(480, 980, 320, 140, 0x1c1732, 0.56);
    this.addDecoration(480, 930, 200, 24, 0xffcad4, 1);
    this.addDecoration(480, 890, 160, 24, 0xbdd9ff, 1);
    this.addDecoration(480, 850, 120, 24, 0xfff2ca, 1);
    this.addDecoration(480, 800, 60, 64, 0xffd6a5, 1);
    this.addDecoration(520, 750, 18, 48, 0xffcad4, 1);
    this.addDecoration(440, 750, 18, 48, 0xbdd9ff, 1);
    this.addDecoration(480, 690, 42, 42, 0xffefb3, 1);
    this.addDecoration(480, 610, 160, 26, 0xffffff, 0.1);
  }
}
