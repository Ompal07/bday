import Phaser from 'phaser';

export class TouchControls {
  private readonly scene: Phaser.Scene;
  private readonly radius = 78;
  private readonly joystickBase: Phaser.GameObjects.Arc;
  private readonly joystickKnob: Phaser.GameObjects.Arc;
  private readonly interactButton: Phaser.GameObjects.Container;
  private readonly pauseButton: Phaser.GameObjects.Container;
  private readonly direction = new Phaser.Math.Vector2();
  private activePointerId: number | null = null;
  private interactQueued = false;
  private pauseQueued = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const baseX = 118;
    const baseY = scene.scale.height - 150;

    this.joystickBase = scene.add.circle(baseX, baseY, this.radius, 0x08111f, 0.36).setScrollFactor(0).setDepth(90);
    this.joystickKnob = scene.add.circle(baseX, baseY, 28, 0xffffff, 0.78).setScrollFactor(0).setDepth(91);

    this.joystickBase.setInteractive(new Phaser.Geom.Circle(baseX, baseY, this.radius), Phaser.Geom.Circle.Contains);
    this.joystickBase.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.activePointerId = pointer.id;
      this.updateDirection(pointer);
    });
    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.activePointerId === pointer.id) {
        this.updateDirection(pointer);
      }
    });
    scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.activePointerId === pointer.id) {
        this.activePointerId = null;
        this.direction.set(0, 0);
        this.joystickKnob.setPosition(baseX, baseY);
      }
    });

    this.interactButton = this.createButton(426, scene.scale.height - 162, 100, 100, 0xffd6a5, 'Tap', 'Interact', () => {
      this.interactQueued = true;
    });

    this.pauseButton = this.createButton(scene.scale.width - 76, 76, 76, 76, 0xc7d6ff, 'II', 'Menu', () => {
      this.pauseQueued = true;
    });
  }

  getVector(): Phaser.Math.Vector2 {
    return this.direction;
  }

  consumeInteract(): boolean {
    const value = this.interactQueued;
    this.interactQueued = false;
    return value;
  }

  consumePause(): boolean {
    const value = this.pauseQueued;
    this.pauseQueued = false;
    return value;
  }

  setVisible(visible: boolean): void {
    this.joystickBase.setVisible(visible);
    this.joystickKnob.setVisible(visible);
    this.interactButton.setVisible(visible);
    this.pauseButton.setVisible(visible);
  }

  destroy(): void {
    this.joystickBase.destroy();
    this.joystickKnob.destroy();
    this.interactButton.destroy();
    this.pauseButton.destroy();
  }

  private updateDirection(pointer: Phaser.Input.Pointer): void {
    const dx = pointer.x - this.joystickBase.x;
    const dy = pointer.y - this.joystickBase.y;
    const distance = Math.hypot(dx, dy);
    const maxDistance = this.radius;
    const clamped = Math.min(distance, maxDistance);
    const angle = Math.atan2(dy, dx);
    const offsetX = Math.cos(angle) * clamped;
    const offsetY = Math.sin(angle) * clamped;

    this.direction.set(offsetX / maxDistance, offsetY / maxDistance);
    this.joystickKnob.setPosition(this.joystickBase.x + offsetX, this.joystickBase.y + offsetY);
  }

  private createButton(x: number, y: number, width: number, height: number, fill: number, emoji: string, title: string, onPress: () => void): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y).setScrollFactor(0).setDepth(90);
    const bg = this.scene.add.rectangle(0, 0, width, height, fill, 1).setStrokeStyle(2, 0xffffff, 0.1);
    const text = this.scene.add.text(0, -10, emoji, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '34px',
      color: '#1c1230',
      align: 'center',
    }).setOrigin(0.5);
    const caption = this.scene.add.text(0, 24, title, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '16px',
      color: '#140f20',
    }).setOrigin(0.5);

    container.add([bg, text, caption]);
    container.setSize(width, height);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', () => onPress());
    return container;
  }
}
