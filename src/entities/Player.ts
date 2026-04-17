import Phaser from 'phaser';

export class Player {
  readonly sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'cat');
    this.sprite.setDepth(20);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(0.92);
    this.sprite.body?.setSize(74, 66, true);
    this.sprite.body?.setOffset(14, 42);
  }

  update(dx: number, dy: number, speed: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (!body) {
      return;
    }

    const magnitude = Math.hypot(dx, dy);
    if (magnitude > 0.08) {
      const normX = dx / Math.max(1, magnitude);
      const normY = dy / Math.max(1, magnitude);
      body.setVelocity(normX * speed, normY * speed);
      this.sprite.flipX = normX < 0;
      this.sprite.setAngle(normX * -6);
      this.sprite.setFrame(0);
    } else {
      body.setVelocity(0, 0);
      this.sprite.setAngle(0);
      this.sprite.setFrame(0);
    }
  }

  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }
}

