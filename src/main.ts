import './styles.css';

type Screen = 'landing' | 'gifts';
type GiftId = 'letter' | 'cats' | 'cake';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

const state = {
  screen: 'landing' as Screen,
  activeGift: null as GiftId | null,
  openingGift: null as GiftId | null,
  yesAttempts: 0,
  noAttempts: 0,
  giftTimer: 0,
  yesMoveTimer: 0,
  noReactionVisible: false,
  noReactionShaking: false,
  cakeCandles: [false, false, false] as [boolean, boolean, boolean],
  cakeCelebrating: false,
  giftNotice: null as string | null,
  giftNoticeTimer: 0,
  backgroundResumeTime: null as number | null,
};

const audio = {
  background: null as HTMLAudioElement | null,
  birthday: null as HTMLAudioElement | null,
  context: null as AudioContext | null,
  stopSynth: null as (() => void) | null,
};

const assetPath = (path: string): string => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const sameAsset = (track: HTMLAudioElement, src: string): boolean => track.src === new URL(src, document.baseURI).href;

const stopAudioTrack = (track: HTMLAudioElement): void => {
  track.pause();
  track.currentTime = 0;
  track.onloadedmetadata = null;
  track.ontimeupdate = null;
  track.onended = null;
  track.onerror = null;
};

const pauseAudioTrack = (track: HTMLAudioElement): void => {
  track.pause();
  track.onloadedmetadata = null;
  track.ontimeupdate = null;
  track.onended = null;
  track.onerror = null;
};

const BAIRAN_LOOP_START = 10;
const BAIRAN_LOOP_END = 248;
const SOUND_EFFECTS = {
  punch: assetPath('audio/meme/punch-gaming-sound-effect-hd_RzlG1GE.mp3'),
  faaah: assetPath('audio/meme/faaah.mp3'),
  gunshotFahhhh: assetPath('audio/meme/gunshot-fahhhh.mp3'),
  gunshotJbudden: assetPath('audio/meme/gunshotjbudden.mp3'),
  applause3: assetPath('audio/meme/aplausos_3.mp3'),
  nope: assetPath('audio/meme/engineer_no01_1.mp3'),
} as const;

const letters = [
  `Happy Birthday, my love,

I’ve been thinking about what to say to you today, and honestly, no set of words ever feels like enough. You’re one of those rare people who makes life feel lighter just by being in it.

It’s the small things that stay with me: our random conversations, the memes and your wierd personality, the way you understand me without me having to explain everything. That’s what makes this real.

I hope this year gives you everything you’ve been quietly wishing for, and a few things you didn’t even know you needed (like me). You deserve good things, not just today, but every single day.

And selfishly, I hope I get to be there for all of it.
Hopefully we will meet soon!!

Happy birthday Jaanuuu!!

Always,
Om`,
  'You make ordinary days feel softer and brighter.\n\nI hope today gives you that same feeling back in the prettiest way.',
  'You are my favorite person to celebrate.\n\nAlways, always you.',
];

const render = (): void => {
  clearYesMotion();
  app.replaceChildren(
    createBackground(),
    state.screen === 'landing' ? createLanding() : createGiftScreen(),
    createOverlay(),
    createDecorations(),
  );
};

const createBackground = (): HTMLElement => {
  const background = document.createElement('div');
  background.className = 'background';
  return background;
};

const createLanding = (): HTMLElement => {
  const card = document.createElement('section');
  card.className = 'card landing-card';

  const badge = document.createElement('div');
  badge.className = 'badge';
  badge.textContent = 'birthday surprise';

  const title = document.createElement('h1');
  title.textContent = 'Are you ready for your birthday surprise?';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'The yes button is shy. Try a few times.';

  const prompt = document.createElement('p');
  prompt.className = 'landing-prompt';
  prompt.textContent = '';

  const stage = document.createElement('div');
  stage.className = 'landing-stage';

  const yes = createButton('Yes', 'primary', () => {
    state.yesAttempts += 1;
    if (state.yesAttempts < 3) {
      playEffect(SOUND_EFFECTS.gunshotFahhhh, 0.75);
      prompt.textContent = 'You missed Jaanuu💘';
      moveYesButton(yes);
      return;
    }
    playEffect(SOUND_EFFECTS.gunshotFahhhh, 0.8);
    state.screen = 'gifts';
    state.yesAttempts = 0;
    state.activeGift = null;
    state.openingGift = null;
    playBackgroundMusic(false);
    render();
  });
  yes.classList.add('yes-float');
  yes.addEventListener('pointerenter', () => moveYesButton(yes));
  yes.addEventListener('pointerdown', () => {
    moveYesButton(yes);
    window.setTimeout(() => moveYesButton(yes), 40);
  });
  stage.append(yes);

  const no = createButton('No', 'secondary', () => {
    state.noAttempts += 1;
    playEffect(SOUND_EFFECTS.punch, 0.75);
    subtitle.textContent = 'That is okay. I will wait here with a tiny smile until you are.';
    state.noReactionVisible = true;
    state.noReactionShaking = true;
    if (navigator.vibrate) {
      navigator.vibrate([120, 60, 120]);
    }
    no.classList.add('wiggle');
    window.setTimeout(() => {
      no.classList.remove('wiggle');
      state.noReactionShaking = false;
      render();
    }, 500);
    render();
  });

  const actions = document.createElement('div');
  actions.className = 'button-row landing-actions';
  actions.append(no);

  const reaction = document.createElement('div');
  reaction.className = 'no-reaction';
  if (state.noReactionVisible) {
    const caption = document.createElement('p');
    caption.className = 'no-reaction-caption';
    caption.textContent = state.noAttempts > 1 ? 'No again? Last warning.' : "That's it. Last chance.";

    const sticker = document.createElement('img');
    sticker.className = 'no-reaction-sticker';
    sticker.src = assetPath('stickers/lastwarning.png');
    sticker.alt = 'Last warning sticker';
    sticker.loading = 'lazy';
    sticker.decoding = 'async';
    sticker.draggable = false;

    if (state.noReactionShaking) {
      sticker.classList.add('shake');
    }
    if (state.noAttempts > 1) {
      sticker.classList.add('repeat-shake');
    }

    reaction.append(caption, sticker);
  }

  card.append(badge, title, subtitle, prompt, stage, actions, reaction);
  startYesMotion(yes);
  return card;
};

const createGiftScreen = (): HTMLElement => {
  const wrap = document.createElement('section');
  wrap.className = 'gift-screen';

  const header = document.createElement('div');
  header.className = 'gift-header';

  const title = document.createElement('h2');
  title.textContent = 'Pick a gift';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Pick one wrapped gift to unwrap.';

  const back = createButton('Back', 'ghost', () => {
    state.screen = 'landing';
    state.activeGift = null;
    state.openingGift = null;
    pauseBirthdayMusic();
    render();
  });

  header.append(title, subtitle, back);

  const box = document.createElement('div');
  box.className = 'gift-box';

  const row = document.createElement('div');
  row.className = 'gift-row';
  row.append(
    createGiftCard('1', '🎁', 'letter'),
    createGiftCard('2', '🎁', 'cats'),
    createGiftCard('3', '🎁', 'cake'),
  );

  const label = document.createElement('p');
  label.className = 'gift-box-label';
  label.textContent = 'Tap a gift in the box';

  const notice = document.createElement('div');
  notice.className = 'gift-notice';
  notice.hidden = !state.giftNotice;
  notice.textContent = state.giftNotice ?? '';

  box.append(row, label);
  wrap.append(header, box, notice);
  return wrap;
};

const createGiftCard = (number: string, iconText: string, giftId: GiftId): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'gift-card';
  if (giftId === 'cats') {
    button.classList.add('locked');
  }

  if (state.openingGift === giftId) {
    button.classList.add('opening');
  }

  button.addEventListener('click', () => openGift(giftId));

  const num = document.createElement('div');
  num.className = 'gift-number';
  num.textContent = number;

  const icon = document.createElement('div');
  icon.className = 'gift-icon';
  icon.textContent = iconText;

  button.append(num, icon);

  if (giftId === 'cats') {
    const lock = document.createElement('div');
    lock.className = 'gift-lock';
    lock.textContent = 'locked';
    button.append(lock);
  }
  return button;
};

const createOverlay = (): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.className = 'overlay-shell';

  if (state.activeGift === 'letter') {
    overlay.append(createLetterModal());
  } else if (state.activeGift === 'cats') {
    overlay.append(createCatsScene());
  } else if (state.activeGift === 'cake') {
    overlay.append(createCakeScene());
  }

  return overlay;
};

const createLetterModal = (): HTMLElement => {
  const modal = document.createElement('section');
  modal.className = 'modal';

  const title = document.createElement('h2');
  title.textContent = 'A letter for you';

  const body = document.createElement('div');
  body.className = 'letter-pages';

  letters.forEach((page) => {
    const p = document.createElement('p');
    p.className = 'page';
    p.textContent = page;
    body.append(p);
  });

  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  footer.append(createButton('Close', 'primary', closeGift));

  modal.append(title, body, footer);
  return modal;
};

const createCatsScene = (): HTMLElement => {
  const scene = document.createElement('section');
  scene.className = 'cats-scene';

  const close = createButton('Close cats', 'ghost', closeGift);
  close.classList.add('close-floating');

  const title = document.createElement('h2');
  title.textContent = 'Cats for you';

  const text = document.createElement('p');
  text.textContent = 'Tiny hearts are floating by to celebrate.';

  const cloud = document.createElement('div');
  cloud.className = 'cats-cloud';

  ['💗', '💘', '💖', '💞', '💝', '❤️'].forEach((emoji, index) => {
    const heart = document.createElement('span');
    heart.className = 'heart-float';
    heart.textContent = emoji;
    heart.style.setProperty('--delay', `${index * 0.85}s`);
    heart.style.setProperty('--left', `${8 + index * 14}%`);
    heart.style.setProperty('--y', `${78 + (index % 3) * 6}%`);
    cloud.append(heart);
  });

  scene.append(close, title, text, cloud);
  return scene;
};

const createCakeScene = (): HTMLElement => {
  const scene = document.createElement('section');
  scene.className = `cake-scene${state.cakeCelebrating ? ' celebrating' : ''}`;

  if (!audio.birthday) {
    playBirthdayMusic();
  }

  const close = createButton('Close celebration', 'secondary', closeGift);
  close.classList.add('close-floating');

  const header = document.createElement('div');
  header.className = 'cake-header';

  const title = document.createElement('h2');
  title.textContent = state.cakeCelebrating ? 'Happy Birthday Shriya!!' : 'Happy Birthday!';

  const subtitle = document.createElement('p');
  subtitle.textContent = state.cakeCelebrating
    ? 'Happy 17, happy cats and all the love.'
    : 'Tap on Candle to Blow!';

  header.append(title, subtitle);

  const cake = document.createElement('div');
  cake.className = 'cake-stack';
  cake.innerHTML = `
    <div class="sparkles"></div>
    <div class="cake-top"></div>
    <div class="cake-base"></div>
    <div class="cake-shadow"></div>
  `;

  const candleButtons = document.createElement('div');
  candleButtons.className = 'candle-layer';

  [0, 1, 2].forEach((index) => {
    const candle = document.createElement('button');
    candle.type = 'button';
    candle.className = `candle candle-button candle-${index + 1}`;
    candle.setAttribute('aria-label', `Blow candle ${index + 1}`);
    candle.disabled = state.cakeCelebrating || state.cakeCandles[index];
    if (state.cakeCandles[index]) {
      candle.classList.add('blown');
    }
    candle.addEventListener('click', () => blowCakeCandle(index));
    candleButtons.append(candle);
  });

  cake.append(candleButtons);

  const topper = document.createElement('div');
  topper.className = 'cake-topper';
  if (state.cakeCelebrating) {
    const cats = document.createElement('div');
    cats.className = 'happy-cat-row';
    ['cat-a', 'cat-b', 'cat-c'].forEach((variant) => {
      const img = document.createElement('img');
      img.className = `happy-cat ${variant}`;
      img.src = assetPath('stickers/happy-cat.gif');
      img.alt = 'Happy cat celebrating';
      img.draggable = false;
      cats.append(img);
    });
    topper.append(cats);
  } else {
    const kitty = document.createElement('img');
    kitty.className = 'cake-kitty';
    kitty.src = assetPath('stickers/cake-kitty.gif');
    kitty.alt = 'Tap on Candle to Blow!';
    kitty.draggable = false;

    const caption = document.createElement('p');
    caption.className = 'cake-kitty-caption';
    caption.textContent = 'Tap on Candle to Blow!';

    topper.append(kitty, caption);
  }

  const fireworks = document.createElement('div');
  fireworks.className = 'fireworks-field';
  if (state.cakeCelebrating) {
    for (let i = 0; i < 12; i += 1) {
      const firework = document.createElement('span');
      firework.className = 'firework-burst';
      firework.style.setProperty('--x', `${8 + Math.random() * 84}%`);
      firework.style.setProperty('--y', `${8 + Math.random() * 42}%`);
      firework.style.setProperty('--delay', `${Math.random() * 1.8}s`);
      firework.style.setProperty('--hue', `${Math.floor(Math.random() * 360)}`);
      fireworks.append(firework);
    }
  }

  const confetti = document.createElement('div');
  confetti.className = 'confetti-field';
  if (state.cakeCelebrating) {
    for (let i = 0; i < 36; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.setProperty('--x', `${Math.random() * 100}%`);
      piece.style.setProperty('--delay', `${Math.random() * 2}s`);
      piece.style.setProperty('--hue', `${Math.floor(Math.random() * 360)}`);
      confetti.append(piece);
    }
  }

  scene.append(close, fireworks, header, cake, topper, confetti);
  return scene;
};

const blowCakeCandle = (index: number): void => {
  if (state.cakeCelebrating || state.cakeCandles[index]) {
    return;
  }

  const next = [...state.cakeCandles] as [boolean, boolean, boolean];
  next[index] = true;
  state.cakeCandles = next;
  state.cakeCelebrating = next.every(Boolean);
  if (state.cakeCelebrating) {
    playEffect(SOUND_EFFECTS.applause3, 0.85);
  }
  render();
};

const createDecorations = (): HTMLElement => {
  const decorations = document.createElement('div');
  decorations.className = 'decorations';
  for (let i = 0; i < 8; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'heart-float';
    heart.textContent = i % 2 === 0 ? '💗' : '💖';
    heart.style.setProperty('--left', `${6 + i * 12}%`);
    heart.style.setProperty('--y', `${82 + (i % 3) * 6}%`);
    heart.style.setProperty('--delay', `${i * 0.7}s`);
    decorations.append(heart);
  }
  return decorations;
};

const createButton = (label: string, variant: 'primary' | 'secondary' | 'ghost', onClick: () => void): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `button ${variant}`;
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
};

const closeGift = (): void => {
  pauseBirthdayMusic();
  state.activeGift = null;
  state.openingGift = null;
  state.cakeCandles = [false, false, false];
  state.cakeCelebrating = false;
  state.giftNotice = null;
  window.clearTimeout(state.giftNoticeTimer);
  state.giftNoticeTimer = 0;
  render();
  if (state.screen === 'gifts') {
    playBackgroundMusic(true);
  }
};

const openGift = (gift: GiftId): void => {
  if (state.openingGift) {
    return;
  }

  if (gift === 'cats') {
    playEffect(SOUND_EFFECTS.nope, 0.8);
    state.giftNotice = 'Sorry Jaanu, this is still in update!';
    window.clearTimeout(state.giftNoticeTimer);
    state.giftNoticeTimer = window.setTimeout(() => {
      state.giftNotice = null;
      render();
    }, 2200);
    render();
    return;
  }

  if (gift === 'letter') {
    playEffect(SOUND_EFFECTS.gunshotJbudden, 0.8);
  } else if (gift === 'cake') {
    state.cakeCandles = [false, false, false];
    state.cakeCelebrating = false;
  }

  state.openingGift = gift;
  render();
  window.clearTimeout(state.giftTimer);
  state.giftTimer = window.setTimeout(() => {
    state.activeGift = gift;
    state.openingGift = null;
    render();
  }, 260);
};

const moveYesButton = (button: HTMLButtonElement): void => {
  const stage = button.parentElement;
  if (!stage) {
    return;
  }

  const bounds = stage.getBoundingClientRect();
  const maxLeft = Math.max(0, bounds.width - button.offsetWidth - 12);
  const maxTop = Math.max(0, bounds.height - button.offsetHeight - 12);
  const left = Math.max(6, Math.random() * maxLeft);
  const top = Math.max(6, Math.random() * maxTop);

  button.style.left = `${left}px`;
  button.style.top = `${top}px`;
};

const startYesMotion = (button: HTMLButtonElement): void => {
  clearYesMotion();
  window.setTimeout(() => moveYesButton(button), 0);
  state.yesMoveTimer = window.setInterval(() => {
    moveYesButton(button);
  }, 700);
};

const clearYesMotion = (): void => {
  if (state.yesMoveTimer) {
    window.clearInterval(state.yesMoveTimer);
    state.yesMoveTimer = 0;
  }
};

const playEffect = (src: string, volume: number): void => {
  const effect = new Audio(src);
  effect.volume = volume;
  effect.preload = 'auto';
  void effect.play().catch(() => {
    // If the asset is missing or blocked, fail silently.
  });
};

const playBackgroundMusic = (resume = false): void => {
  playAudio(assetPath('audio/bairan.mp3'), { loop: true, volume: 0.5 }, 'background', playAmbientFallback);
  const track = audio.background;
  if (track) {
    track.loop = false;
    const resumeTime = resume && state.backgroundResumeTime != null ? state.backgroundResumeTime : BAIRAN_LOOP_START;
    track.currentTime = resumeTime;
    track.onloadedmetadata = () => {
      if (track.currentTime < BAIRAN_LOOP_START || track.currentTime > BAIRAN_LOOP_END) {
        track.currentTime = BAIRAN_LOOP_START;
      }
    };
    track.ontimeupdate = () => {
      if (track.currentTime >= BAIRAN_LOOP_END) {
        track.currentTime = BAIRAN_LOOP_START;
        void track.play().catch(() => undefined);
      }
    };
  }
  state.backgroundResumeTime = null;
};

const BDAY_LOOP_START = 16;
const BDAY_LOOP_END = 86;

const playBirthdayMusic = (): void => {
  playAudio(assetPath('audio/bdaysong.mp3'), { loop: true, volume: 0.72 }, 'birthday', playHappyBirthdayFallback);
  if (audio.background) {
    state.backgroundResumeTime = audio.background.currentTime;
    pauseAudioTrack(audio.background);
  }
  const track = audio.birthday;
  if (track) {
    track.loop = false;
    track.currentTime = BDAY_LOOP_START;
    track.onloadedmetadata = () => {
      if (track.currentTime < BDAY_LOOP_START || track.currentTime > BDAY_LOOP_END) {
        track.currentTime = BDAY_LOOP_START;
      }
    };
    track.ontimeupdate = () => {
      if (track.currentTime >= BDAY_LOOP_END) {
        track.currentTime = BDAY_LOOP_START;
        void track.play().catch(() => undefined);
      }
    };
  }
};

const pauseBirthdayMusic = (): void => {
  if (audio.birthday) {
    stopAudioTrack(audio.birthday);
    audio.birthday = null;
  }
  stopSynth();
};

const playAudio = (
  src: string,
  options: { loop: boolean; volume: number },
  key: 'background' | 'birthday',
  fallback: () => void,
): void => {
  stopSynth();
  const current = audio[key];
  if (current && sameAsset(current, src)) {
    current.loop = options.loop;
    current.volume = options.volume;
    void current.play().catch(() => undefined);
    return;
  }

  if (current) {
    stopAudioTrack(current);
  }

  const track = new Audio(src);
  track.loop = options.loop;
  track.volume = options.volume;
  track.preload = 'auto';
  track.currentTime = 0;
  audio[key] = track;
  const startFallback = (): void => {
    if (audio[key] === track) {
      audio[key] = null;
    }
    fallback();
  };
  if (key === 'background') {
    track.currentTime = BAIRAN_LOOP_START;
    track.onloadedmetadata = () => {
      if (track.currentTime < BAIRAN_LOOP_START || track.currentTime > BAIRAN_LOOP_END) {
        track.currentTime = BAIRAN_LOOP_START;
      }
    };
    track.ontimeupdate = () => {
      if (track.currentTime >= BAIRAN_LOOP_END) {
        track.currentTime = BAIRAN_LOOP_START;
        void track.play().catch(() => undefined);
      }
    };
  }
  track.addEventListener('error', startFallback, { once: true });
  void track.play().catch(startFallback);
};

const stopSynth = (): void => {
  if (audio.stopSynth) {
    audio.stopSynth();
    audio.stopSynth = null;
  }
};

const ensureContext = (): AudioContext => {
  if (!audio.context) {
    audio.context = new AudioContext();
  }
  return audio.context;
};

const playAmbientFallback = (): void => {
  const context = ensureContext();
  if (context.state !== 'running') {
    void context.resume();
  }

  const master = context.createGain();
  master.gain.value = 0.035;
  master.connect(context.destination);

  const notes = [196, 220, 247, 262, 247, 220];
  let index = 0;
  let stopped = false;
  const timers: number[] = [];

  const tick = (): void => {
    if (stopped) {
      return;
    }
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[index % notes.length];
    gain.gain.value = 0.02;
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    const stopAt = window.setTimeout(() => {
      try {
        osc.stop();
      } catch {
        // no-op
      }
      gain.disconnect();
      osc.disconnect();
    }, 420);
    timers.push(stopAt);
    index += 1;
    timers.push(window.setTimeout(tick, 520));
  };

  tick();
  audio.stopSynth = () => {
    stopped = true;
    timers.forEach((timer) => window.clearTimeout(timer));
    master.disconnect();
  };
};

const playHappyBirthdayFallback = (): void => {
  const context = ensureContext();
  if (context.state !== 'running') {
    void context.resume();
  }

  const master = context.createGain();
  master.gain.value = 0.06;
  master.connect(context.destination);

  const melody = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
    261.63, 261.63, 293.66, 261.63, 392, 349.23,
    261.63, 261.63, 523.25, 440, 349.23, 329.63, 293.66,
    466.16, 466.16, 440, 349.23, 392, 349.23,
  ];
  const durations = [0.38, 0.38, 0.76, 0.76, 0.76, 1.1, 0.38, 0.38, 0.76, 0.76, 0.76, 1.1, 0.38, 0.38, 0.76, 0.76, 0.76, 0.76, 1.1, 0.38, 0.38, 0.76, 0.76, 0.76, 1.1];
  let stopped = false;
  const timers: number[] = [];

  const playNote = (freq: number, duration: number): void => {
    if (stopped) {
      return;
    }
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    const stopAt = window.setTimeout(() => {
      try {
        osc.stop();
      } catch {
        // no-op
      }
      gain.disconnect();
      osc.disconnect();
    }, duration * 1000);
    timers.push(stopAt);
  };

  let delay = 0;
  melody.forEach((freq, index) => {
    const duration = durations[index] ?? 0.5;
    timers.push(window.setTimeout(() => playNote(freq, duration), delay));
    delay += duration * 1000;
  });

  timers.push(
    window.setTimeout(() => {
      if (!stopped) {
        master.disconnect();
      }
    }, delay + 400),
  );

  audio.stopSynth = () => {
    stopped = true;
    timers.forEach((timer) => window.clearTimeout(timer));
    master.disconnect();
  };
};

render();
