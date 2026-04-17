import Phaser from 'phaser';
import { INTERACT_RADIUS } from './constants';

export interface InteractionTarget {
  id: string;
  x: number;
  y: number;
  label: string;
  active: boolean;
}

export class InteractionManager {
  static nearest(player: Phaser.GameObjects.Sprite, targets: InteractionTarget[]): InteractionTarget | null {
    let closest: InteractionTarget | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const target of targets) {
      if (!target.active) {
        continue;
      }

      const distance = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);
      if (distance < INTERACT_RADIUS && distance < closestDistance) {
        closest = target;
        closestDistance = distance;
      }
    }

    return closest;
  }
}
