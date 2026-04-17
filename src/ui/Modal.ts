import Phaser from 'phaser';

export function createPanel(scene: Phaser.Scene, x: number, y: number, width: number, height: number, tint = 0x120f24): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y).setScrollFactor(0).setDepth(120);
  const shadow = scene.add.rectangle(8, 10, width, height, 0x000000, 0.3).setOrigin(0.5);
  const bg = scene.add.rectangle(0, 0, width, height, tint, 0.94).setStrokeStyle(2, 0xffffff, 0.08);
  const edge = scene.add.rectangle(0, 0, width - 8, height - 8, 0xffffff, 0.01).setStrokeStyle(1, 0xffffff, 0.08);
  container.add([shadow, bg, edge]);
  return container;
}

export function createTextButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  fill = 0xffd6a5,
  onClick?: () => void,
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y).setScrollFactor(0).setDepth(130);
  const bg = scene.add.rectangle(0, 0, width, height, fill, 1).setStrokeStyle(2, 0xffffff, 0.08);
  const text = scene.add.text(0, 0, label, {
    fontFamily: 'Trebuchet MS, sans-serif',
    fontSize: '24px',
    color: '#241732',
    stroke: '#fff6f0',
    strokeThickness: 2,
  }).setOrigin(0.5);

  container.add([bg, text]);
  container.setSize(width, height);
  bg.setInteractive({ useHandCursor: true });
  if (onClick) {
    bg.on('pointerdown', onClick);
  }
  bg.on('pointerover', () => bg.setAlpha(0.9));
  bg.on('pointerout', () => bg.setAlpha(1));
  return container;
}
