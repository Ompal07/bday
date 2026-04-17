import Phaser from 'phaser';

export const SceneTransition = {
  fadeIn(scene: Phaser.Scene, duration = 220): void {
    scene.cameras.main.fadeIn(duration, 0, 0, 0);
  },
  fadeTo(scene: Phaser.Scene, targetSceneKey: string, data?: object, duration = 220): void {
    scene.cameras.main.fadeOut(duration, 0, 0, 0);
    scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      scene.scene.start(targetSceneKey, data);
    });
  },
};
