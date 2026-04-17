import Phaser from 'phaser';
import { SceneKeys } from '../../game/constants';
import { letters, photos, videos } from '../../game/data';
import { SaveManager } from '../../game/storage';
import { AudioManager } from '../../game/audio';
import { createPanel, createTextButton } from '../../ui/Modal';
import { SongSelector } from '../../ui/SongSelector';

type ModalPayload = {
  sourceSceneKey: string;
  giftId: string;
  type: string;
  contentRef: string;
  title?: string;
  note?: string;
};

export class GiftModalScene extends Phaser.Scene {
  private payload!: ModalPayload;
  private selector: SongSelector | null = null;

  constructor() {
    super(SceneKeys.GiftModal);
  }

  create(data: ModalPayload): void {
    this.payload = data;
    const backdrop = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x060812, 0.72).setOrigin(0).setScrollFactor(0).setDepth(100);
    backdrop.setInteractive();

    if (data.contentRef === 'music-select') {
      this.selector = new SongSelector(this, {
        onSelect: (songId) => {
          AudioManager.play(songId);
          this.close();
        },
        onClose: () => this.close(),
      }, SaveManager.load().selectedSongId);
      return;
    }

    if (data.type === 'video') {
      this.buildVideoModal();
      return;
    }

    this.buildTextModal();
  }

  private buildTextModal(): void {
    const panel = createPanel(this, this.scale.width / 2, this.scale.height / 2, this.scale.width - 44, this.scale.height * 0.76, 0x171427);
    const title = this.add.text(0, -300, this.payload.title ?? 'Gift', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
      align: 'center',
      wordWrap: { width: this.scale.width - 120 },
    }).setOrigin(0.5);
    const close = createTextButton(this, 0, this.scale.height * 0.33 - 60, 180, 54, 'Close', 0xffd6a5, () => this.close());

    const photoSet = photos.find((item) => item.id === this.payload.contentRef);
    if (photoSet) {
      const set = photoSet;
      let index = 0;
      const photoCard = this.add.rectangle(0, -30, this.scale.width - 140, 360, set.frames[index].tint, 1).setStrokeStyle(6, 0xffffff, 0.24);
      const caption = this.add.text(0, 170, set.frames[index].caption, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '22px',
        color: '#fff7ef',
        align: 'center',
        wordWrap: { width: this.scale.width - 160 },
      }).setOrigin(0.5);
      const prev = createTextButton(this, -110, 170, 90, 54, '<', 0xbdd9ff, () => {
        index = (index - 1 + set.frames.length) % set.frames.length;
        updateFrame();
      });
      const next = createTextButton(this, 110, 170, 90, 54, '>', 0xbdd9ff, () => {
        index = (index + 1) % set.frames.length;
        updateFrame();
      });
      const updateFrame = (): void => {
        photoCard.setFillStyle(set.frames[index].tint, 1);
        caption.setText(set.frames[index].caption);
      };
      panel.add([title, photoCard, caption, prev, next, close]);
      return;
    }

    const letter = letters.find((item) => item.id === this.payload.contentRef);
    if (letter) {
      let page = 0;
      const body = this.add.text(0, 0, letter.pages[page], {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        color: '#fff7ef',
        align: 'center',
        wordWrap: { width: this.scale.width - 120 },
        lineSpacing: 14,
      }).setOrigin(0.5);
      const pageLabel = this.add.text(0, 176, `${page + 1} / ${letter.pages.length}`, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '16px',
        color: '#c7d6ff',
      }).setOrigin(0.5);
      const prev = createTextButton(this, -110, 212, 90, 54, '<', 0xbdd9ff, () => {
        page = (page - 1 + letter.pages.length) % letter.pages.length;
        refresh();
      });
      const next = createTextButton(this, 110, 212, 90, 54, '>', 0xbdd9ff, () => {
        page = (page + 1) % letter.pages.length;
        refresh();
      });
      const refresh = (): void => {
        body.setText(letter.pages[page]);
        pageLabel.setText(`${page + 1} / ${letter.pages.length}`);
      };
      panel.add([title, body, pageLabel, prev, next, close]);
      return;
    }

    const bodyText =
      this.payload.contentRef === 'birthday-wish'
        ? 'Happy birthday, my love.\n\nMay today be soft, bright, and full of little joys.'
        : letters.find((letter) => letter.id === this.payload.contentRef)?.pages[0] ?? 'A small surprise.';

    const body = this.add.text(0, 0, bodyText, {
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      color: '#fff7ef',
      align: 'center',
      wordWrap: { width: this.scale.width - 120 },
      lineSpacing: 14,
    }).setOrigin(0.5);

    panel.add([title, body, close]);
    this.tweens.add({
      targets: panel,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.96, to: 1 },
      duration: 500,
      ease: 'Sine.easeOut',
    });
  }

  private buildVideoModal(): void {
    const video = videos.find((item) => item.id === this.payload.contentRef) ?? videos[0];
    const panel = createPanel(this, this.scale.width / 2, this.scale.height / 2, this.scale.width - 44, this.scale.height * 0.74, 0x12162a);
    const title = this.add.text(0, -290, video.title, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '30px',
      color: '#fff7ef',
    }).setOrigin(0.5);
    const close = createTextButton(this, 0, this.scale.height * 0.32 - 46, 180, 54, 'Close', 0xffd6a5, () => this.close());
    const hint = this.add.text(0, 260, video.caption, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#c7d6ff',
      align: 'center',
      wordWrap: { width: this.scale.width - 120 },
    }).setOrigin(0.5);

    const fallback = this.add.rectangle(0, -10, this.scale.width - 120, 360, 0x0f1428, 1).setStrokeStyle(3, 0xffffff, 0.12);
    const fallbackText = this.add.text(0, -10, 'Video player placeholder\n\nAdd a local MP4 at public/videos/love-note.mp4.', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '22px',
      color: '#fff7ef',
      align: 'center',
      wordWrap: { width: this.scale.width - 180 },
      lineSpacing: 10,
    }).setOrigin(0.5);

    if (video.src) {
      const element = document.createElement('video');
      element.src = video.src;
      element.controls = true;
      element.autoplay = false;
      element.playsInline = true;
      element.preload = 'metadata';
      element.style.width = `${Math.round(this.scale.width - 120)}px`;
      element.style.maxHeight = '360px';
      element.style.borderRadius = '18px';
      element.style.background = '#09101f';
      this.add.dom(this.scale.width / 2, this.scale.height / 2 - 24, element).setOrigin(0.5).setDepth(125);
      panel.add([title, hint, close]);
      return;
    }

    panel.add([title, fallback, fallbackText, hint, close]);
  }

  private close(): void {
    SaveManager.patch((draft) => {
      if (!draft.openedGiftIds.includes(this.payload.giftId)) {
        draft.openedGiftIds.push(this.payload.giftId);
      }
    });
    this.selector?.destroy();
    this.selector = null;
    this.scene.resume(this.payload.sourceSceneKey);
    this.scene.stop();
  }
}
