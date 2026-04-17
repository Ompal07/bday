import Phaser from 'phaser';
import { SceneKeys } from '../game/constants';
import { rooms, songs } from '../game/data';
import type { GiftData, PortalData, RoomDefinition, SaveData } from '../game/types';
import { Player } from '../entities/Player';
import { Interactable } from '../entities/Interactable';
import { TouchControls } from '../systems/TouchControls';
import { HUD } from '../ui/HUD';
import { SaveManager } from '../game/storage';
import { ProgressManager } from '../game/progress';
import { InteractionManager, type InteractionTarget } from '../game/interaction';
import { createPanel, createTextButton } from '../ui/Modal';
import { SceneTransition } from '../game/transition';
import { AudioManager } from '../game/audio';

type TargetRecord = InteractionTarget & {
  kind: 'gift' | 'portal';
  node: Interactable;
  gift?: GiftData;
  portal?: PortalData;
};

export abstract class WorldScene extends Phaser.Scene {
  protected abstract roomId(): string;
  protected abstract decorateRoom(): void;
  protected room!: RoomDefinition;
  protected player!: Player;
  protected controls!: TouchControls;
  protected hud!: HUD;
  protected prompt!: Phaser.GameObjects.Text;
  protected save!: SaveData;
  protected targetRecords: TargetRecord[] = [];
  protected menuOpen = false;
  protected menuContainer: Phaser.GameObjects.Container | null = null;
  protected roomBanner!: Phaser.GameObjects.Container;

  create(): void {
    this.save = SaveManager.load();
    this.room = rooms.find((room) => room.id === this.roomId()) ?? rooms[0];
    SaveManager.patch((draft) => {
      draft.currentSceneKey = this.scene.key;
    });

    this.physics.world.setBounds(0, 0, this.room.width, this.room.height);
    this.cameras.main.setBounds(0, 0, this.room.width, this.room.height);
    this.drawBackdrop();
    this.decorateRoom();
    this.buildInteractables();
    this.player = new Player(this, this.room.spawnX, this.room.spawnY);
    this.player.sprite.setDepth(30);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

    this.controls = new TouchControls(this);
    this.hud = new HUD(this, {
      onOpenMenu: () => this.toggleMenu(),
      onToggleMute: () => {
        AudioManager.toggleMuted();
        this.hud.setMuted(AudioManager.getMuted());
      },
      onCycleSong: () => this.cycleSong(),
    });
    this.hud.setMuted(AudioManager.getMuted());
    this.prompt = this.add.text(this.scale.width / 2, this.scale.height - 210, '', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#fff6ef',
      backgroundColor: 'rgba(12, 10, 20, 0.55)',
      padding: { x: 12, y: 8 },
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(110);

    this.roomBanner = createPanel(this, this.scale.width / 2, this.scale.height / 2 - 250, this.scale.width - 100, 120, 0x1c1a2f);
    const roomTitle = this.add.text(0, -12, this.room.title, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    const roomSub = this.add.text(0, 20, this.room.subtitle, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#c7d6ff',
    }).setOrigin(0.5);
    this.roomBanner.add([roomTitle, roomSub]);
    this.tweens.add({
      targets: this.roomBanner,
      alpha: { from: 0, to: 1 },
      y: this.roomBanner.y + 8,
      duration: 900,
      yoyo: true,
      onComplete: () => this.roomBanner.destroy(),
    });
  }

  update(): void {
    if (this.menuOpen) {
      return;
    }

    const move = this.controls.getVector();
    this.player.update(move.x, move.y, 280);

    const nearest = InteractionManager.nearest(this.player.sprite, this.targetRecords) as TargetRecord | null;
    this.updatePrompt(nearest);

    if (this.controls.consumePause()) {
      this.toggleMenu();
      return;
    }

    if (this.controls.consumeInteract() && nearest) {
      void this.handleInteraction(nearest);
    }

    this.updateProgressHud();
  }

  protected getTotalGoals(): number {
    return rooms.reduce((sum, room) => sum + room.gifts.length, 0);
  }

  protected addDecoration(x: number, y: number, width: number, height: number, fill: number, alpha = 1): Phaser.GameObjects.Rectangle {
    return this.add.rectangle(x, y, width, height, fill, alpha).setDepth(2);
  }

  protected addGlow(x: number, y: number, radius: number, fill: number, alpha = 0.12): Phaser.GameObjects.Arc {
    return this.add.circle(x, y, radius, fill, alpha).setDepth(1);
  }

  protected isPortalActive(_portal: PortalData): boolean {
    return true;
  }

  protected onGiftInteract(gift: GiftData): void {
    this.openGiftModal(gift);
  }

  public completeGift(giftId: string): void {
    SaveManager.patch((draft) => {
      if (!draft.openedGiftIds.includes(giftId)) {
        draft.openedGiftIds.push(giftId);
      }
    });

    const record = this.targetRecords.find((entry) => entry.id === giftId);
    if (record) {
      record.active = false;
      record.node.setActive(false);
      record.node.setCompleted();
    }
    this.updateProgressHud();
  }

  public completeMiniGame(miniGameId: string): void {
    SaveManager.patch((draft) => {
      if (!draft.completedMiniGames.includes(miniGameId)) {
        draft.completedMiniGames.push(miniGameId);
      }
    });
    this.updateProgressHud();
  }

  protected goToScene(sceneKey: string, data?: object): void {
    SceneTransition.fadeTo(this, sceneKey, data, 260);
  }

  protected openGiftModal(gift: GiftData): void {
    this.completeGift(gift.id);
    this.scene.pause();
    this.scene.launch(SceneKeys.GiftModal, {
      sourceSceneKey: this.scene.key,
      giftId: gift.id,
      title: gift.title,
      type: gift.type,
      contentRef: gift.contentRef,
      note: gift.note,
    });
  }

  protected launchMiniGame(miniGameId: string, giftId: string): void {
    this.scene.pause();
    const key =
      miniGameId === 'memory-match'
        ? SceneKeys.MemoryMatch
        : miniGameId === 'catch-hearts'
          ? SceneKeys.CatchHearts
          : SceneKeys.SortGifts;

    this.scene.launch(key, {
      sourceSceneKey: this.scene.key,
      miniGameId,
      rewardGiftId: giftId,
    });
  }

  private drawBackdrop(): void {
    this.add.rectangle(0, 0, this.room.width, this.room.height, this.room.theme.bottom, 1).setOrigin(0).setDepth(0);
    this.add.rectangle(0, 0, this.room.width, this.room.height * 0.55, this.room.theme.top, 1).setOrigin(0).setDepth(0);
    this.add.rectangle(0, this.room.height * 0.65, this.room.width, this.room.height * 0.35, this.room.theme.bottom, 1).setOrigin(0).setDepth(0);

    for (let i = 0; i < 14; i += 1) {
      const x = 40 + (i * 67) % this.room.width;
      const y = 50 + (i * 91) % (this.room.height * 0.46);
      this.add.circle(x, y, 4 + (i % 3), this.room.theme.glow, 0.38 + (i % 3) * 0.08).setDepth(1);
    }

    this.addGlow(this.room.width * 0.2, this.room.height * 0.2, 200, this.room.theme.accent, 0.14);
    this.addGlow(this.room.width * 0.78, this.room.height * 0.16, 220, this.room.theme.glow, 0.1);
    this.addGlow(this.room.width * 0.5, this.room.height * 0.82, 280, this.room.theme.accent, 0.05);
  }

  private buildInteractables(): void {
    const save = SaveManager.load();

    for (const gift of this.room.gifts) {
      const record = this.createTargetRecord(gift, gift.assetKey, 'gift');
      const alreadyOpened = save.openedGiftIds.includes(gift.id);
      record.active = !alreadyOpened;
      record.node.setActive(!alreadyOpened);
      if (alreadyOpened) {
        record.node.setCompleted();
      }
      this.targetRecords.push(record);
    }

    for (const portal of this.room.portals) {
      const record = this.createTargetRecord(portal, 'door', 'portal');
      const active = this.isPortalActive(portal);
      record.active = active;
      record.node.setActive(active);
      this.targetRecords.push(record);
    }
  }

  private createTargetRecord(item: GiftData | PortalData, key: string, kind: 'gift' | 'portal'): TargetRecord {
    const node = new Interactable(this, item, key, kind);
    return {
      id: item.id,
      kind,
      x: item.x,
      y: item.y,
      label: item.label,
      active: true,
      node,
      gift: kind === 'gift' ? (item as GiftData) : undefined,
      portal: kind === 'portal' ? (item as PortalData) : undefined,
    };
  }

  private updatePrompt(target: TargetRecord | null): void {
    if (!target) {
      this.prompt.setText('Move with the joystick. Tap Interact when you are near a gift.');
      return;
    }

    const status = target.active ? target.label : 'Already collected';
    this.prompt.setText(`${target.kind === 'portal' ? 'Doorway' : 'Gift'}: ${status}`);
  }

  private updateProgressHud(): void {
    const save = SaveManager.load();
    const summary = ProgressManager.summarize(save, this.getTotalGoals() + 3);
    this.hud.setRoom(this.room.title, this.room.subtitle);
    this.hud.setProgress(summary.opened, summary.totalGoals);
  }

  private async handleInteraction(target: TargetRecord): Promise<void> {
    if (!target.active) {
      return;
    }

    if (target.kind === 'portal' && target.portal) {
      if (target.portal.targetSceneKey === SceneKeys.Ending) {
        const save = SaveManager.load();
        const summary = ProgressManager.summarize(save, this.getTotalGoals() + 3);
        if (!summary.endingUnlocked && this.room.id !== 'ending') {
          this.prompt.setText('The final sky is still waiting for a few more memories.');
          return;
        }
      }
      this.goToScene(target.portal.targetSceneKey);
      return;
    }

    const gift = target.gift;
    if (!gift) {
      return;
    }

    if (gift.type === 'minigame') {
      this.launchMiniGame(gift.contentRef, gift.id);
      return;
    }

    this.onGiftInteract(gift);
  }

  protected toggleMenu(): void {
    if (this.menuOpen) {
      this.menuContainer?.destroy(true);
      this.menuContainer = null;
      this.menuOpen = false;
      this.controls.setVisible(true);
      return;
    }

    this.menuOpen = true;
    this.controls.setVisible(false);
    this.menuContainer = createPanel(this, this.scale.width / 2, this.scale.height / 2, this.scale.width - 80, 300, 0x171427);
    const title = this.add.text(0, -96, 'Paused', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    const resume = createTextButton(this, 0, -18, 200, 58, 'Resume', 0xcdf7d5, () => this.toggleMenu());
    const mute = createTextButton(this, 0, 54, 200, 58, AudioManager.getMuted() ? 'Muted' : 'Mute', 0xffd6a5, () => {
      const muted = AudioManager.toggleMuted();
      this.hud.setMuted(muted);
      (mute.list[1] as Phaser.GameObjects.Text).setText(muted ? 'Muted' : 'Mute');
    });
    const reset = createTextButton(this, 0, 126, 200, 58, 'Reset Save', 0xf4c7d0, () => {
      SaveManager.reset();
      this.scene.start(SceneKeys.Title);
    });
    this.menuContainer.add([title, resume, mute, reset]);
  }

  private cycleSong(): void {
    const trackIds = songs.map((track) => track.id);
    const current = AudioManager.getCurrentTrackId();
    const index = Math.max(0, trackIds.findIndex((id) => id === current));
    const next = trackIds[(index + 1) % trackIds.length] ?? current;
    AudioManager.play(next);
  }
}
