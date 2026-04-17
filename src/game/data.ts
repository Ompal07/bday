import { GIFTEE_NAME } from './constants';
import type { LetterContent, PhotoSet, RoomDefinition, SongTrack, VideoContent } from './types';

export const letters: LetterContent[] = [
  {
    id: 'intro-letter',
    title: `A tiny note for ${GIFTEE_NAME}`,
    pages: [
      `Happy birthday, ${GIFTEE_NAME}.\n\nI made this little world for you because you deserve something playful, soft, and full of heart.`,
      `I hope every room feels like a pocket of calm, every gift feels a little personal, and every tiny surprise makes you smile.`,
      `You are my favorite person to celebrate, and I hope this adventure wraps you in cozy birthday magic.`,
    ],
  },
  {
    id: 'final-letter',
    title: 'The last page',
    pages: [
      `You found the end of the little adventure.\n\nThat means you collected the memories, solved the tiny games, and reached the brightest room in the sky.`,
      `Thank you for being you.\n\nI hope today feels warm, sweet, and beautifully yours.`,
      `Happy birthday, my love.\n\nAlways yours.`,
    ],
  },
];

export const photos: PhotoSet[] = [
  {
    id: 'bedroom-photos',
    title: 'Our cozy memories',
    frames: [
      { caption: 'A warm first memory', tint: 0xf6c1d1 },
      { caption: 'A soft little laugh', tint: 0xf8e3aa },
      { caption: 'The sweetest calm', tint: 0xbdd9ff },
    ],
  },
  {
    id: 'gallery-photos',
    title: 'Scrapbook pages',
    frames: [
      { caption: 'Something cute and pink', tint: 0xffd1a8 },
      { caption: 'Something dreamy and blue', tint: 0xa6d8ff },
      { caption: 'Something bright and golden', tint: 0xffefb3 },
    ],
  },
];

export const videos: VideoContent[] = [
  {
    id: 'love-note-video',
    title: 'A tiny video surprise',
    src: undefined,
    poster: undefined,
    caption: 'Drop a short MP4 into public/videos/love-note.mp4 to replace this placeholder.',
  },
];

export const songs: SongTrack[] = [
  {
    id: 'moonlit-purr',
    title: 'Moonlit Purr',
    mood: 'soft lullaby',
    bpm: 82,
    voice: 'sine',
    notes: [
      { semitone: 0, duration: 0.5, velocity: 0.5 },
      { semitone: 3, duration: 0.5, velocity: 0.45 },
      { semitone: 7, duration: 0.75, velocity: 0.55 },
      { semitone: 10, duration: 0.25, velocity: 0.4 },
      { semitone: 7, duration: 0.5, velocity: 0.5 },
      { semitone: 3, duration: 0.5, velocity: 0.45 },
      { semitone: 0, duration: 1, velocity: 0.55 },
      { semitone: 5, duration: 0.5, velocity: 0.45 },
      { semitone: 7, duration: 0.5, velocity: 0.5 },
      { semitone: 10, duration: 0.75, velocity: 0.45 },
      { semitone: 7, duration: 0.25, velocity: 0.4 },
      { semitone: 5, duration: 0.5, velocity: 0.45 },
    ],
  },
  {
    id: 'garden-bloom',
    title: 'Garden Bloom',
    mood: 'playful waltz',
    bpm: 96,
    voice: 'triangle',
    notes: [
      { semitone: 0, duration: 0.33, velocity: 0.45 },
      { semitone: 4, duration: 0.33, velocity: 0.4 },
      { semitone: 7, duration: 0.33, velocity: 0.5 },
      { semitone: 9, duration: 0.66, velocity: 0.4 },
      { semitone: 7, duration: 0.33, velocity: 0.45 },
      { semitone: 4, duration: 0.33, velocity: 0.4 },
      { semitone: 2, duration: 0.66, velocity: 0.5 },
      { semitone: 5, duration: 0.33, velocity: 0.45 },
      { semitone: 9, duration: 0.33, velocity: 0.42 },
      { semitone: 12, duration: 0.66, velocity: 0.5 },
      { semitone: 9, duration: 0.33, velocity: 0.42 },
      { semitone: 5, duration: 0.66, velocity: 0.45 },
    ],
  },
  {
    id: 'cake-spark',
    title: 'Cake Spark',
    mood: 'birthday shimmer',
    bpm: 108,
    voice: 'square',
    notes: [
      { semitone: 0, duration: 0.25, velocity: 0.4 },
      { semitone: 7, duration: 0.25, velocity: 0.45 },
      { semitone: 12, duration: 0.5, velocity: 0.55 },
      { semitone: 7, duration: 0.25, velocity: 0.45 },
      { semitone: 14, duration: 0.25, velocity: 0.4 },
      { semitone: 12, duration: 0.5, velocity: 0.55 },
      { semitone: 9, duration: 0.25, velocity: 0.42 },
      { semitone: 7, duration: 0.25, velocity: 0.4 },
      { semitone: 5, duration: 0.5, velocity: 0.45 },
      { semitone: 7, duration: 0.25, velocity: 0.42 },
      { semitone: 12, duration: 0.25, velocity: 0.5 },
      { semitone: 16, duration: 0.5, velocity: 0.55 },
    ],
  },
  {
    id: 'sky-ending',
    title: 'Sky Ending',
    mood: 'glowing finale',
    bpm: 72,
    voice: 'sine',
    notes: [
      { semitone: 0, duration: 0.5, velocity: 0.45 },
      { semitone: 5, duration: 0.5, velocity: 0.5 },
      { semitone: 9, duration: 1, velocity: 0.55 },
      { semitone: 7, duration: 0.5, velocity: 0.5 },
      { semitone: 5, duration: 0.5, velocity: 0.45 },
      { semitone: 0, duration: 1, velocity: 0.55 },
      { semitone: 12, duration: 0.5, velocity: 0.5 },
      { semitone: 9, duration: 0.5, velocity: 0.5 },
      { semitone: 7, duration: 1, velocity: 0.55 },
    ],
  },
];

const bedroom: RoomDefinition = {
  id: 'bedroom',
  sceneKey: 'BedroomScene',
  title: 'Cozy Bedroom',
  subtitle: 'a soft little start',
  theme: { top: 0x24324d, bottom: 0x4b2942, accent: 0xffcad4, glow: 0xfff1b8 },
  width: 960,
  height: 1440,
  spawnX: 160,
  spawnY: 1160,
  gifts: [
    { id: 'intro-letter', roomId: 'bedroom', type: 'letter', x: 250, y: 1020, title: 'Letter', label: 'Open the first note', assetKey: 'envelope', contentRef: 'intro-letter' },
    { id: 'bedroom-photo', roomId: 'bedroom', type: 'photo', x: 680, y: 960, title: 'Frame', label: 'Peek at a memory', assetKey: 'photo', contentRef: 'bedroom-photos' },
    { id: 'bedroom-wish', roomId: 'bedroom', type: 'wish', x: 500, y: 780, title: 'Wish Card', label: 'Tap for a wish', assetKey: 'heart', contentRef: 'birthday-wish' },
    { id: 'music-player', roomId: 'bedroom', type: 'wish', x: 780, y: 1180, title: 'Music Player', label: 'Pick a song', assetKey: 'music', contentRef: 'music-select', note: 'This room opens the song picker.' },
  ],
  portals: [
    { id: 'to-gallery', roomId: 'bedroom', x: 860, y: 1280, targetSceneKey: 'GalleryScene', title: 'Gallery Door', label: 'Go to the memory gallery' },
  ],
};

const gallery: RoomDefinition = {
  id: 'gallery',
  sceneKey: 'GalleryScene',
  title: 'Memory Gallery',
  subtitle: 'a scrapbook of little moments',
  theme: { top: 0x1f3153, bottom: 0x55325b, accent: 0xbde7ff, glow: 0xffd8ef },
  width: 960,
  height: 1440,
  spawnX: 150,
  spawnY: 1160,
  gifts: [
    { id: 'gallery-photo-1', roomId: 'gallery', type: 'photo', x: 260, y: 1000, title: 'Photo One', label: 'Swipe through photos', assetKey: 'frame', contentRef: 'gallery-photos' },
    { id: 'gallery-photo-2', roomId: 'gallery', type: 'photo', x: 520, y: 820, title: 'Photo Two', label: 'Open another memory', assetKey: 'frame', contentRef: 'gallery-photos' },
    { id: 'gallery-video', roomId: 'gallery', type: 'video', x: 760, y: 980, title: 'Video Note', label: 'Play the tiny video', assetKey: 'video', contentRef: 'love-note-video' },
    { id: 'gallery-wish', roomId: 'gallery', type: 'wish', x: 470, y: 1180, title: 'Wish', label: 'A short birthday wish', assetKey: 'heart', contentRef: 'birthday-wish' },
  ],
  portals: [
    { id: 'to-garden', roomId: 'gallery', x: 860, y: 1260, targetSceneKey: 'GardenScene', title: 'Dream Gate', label: 'Step into the garden' },
  ],
};

const garden: RoomDefinition = {
  id: 'garden',
  sceneKey: 'GardenScene',
  title: 'Dream Garden',
  subtitle: 'a tiny playground in the sky',
  theme: { top: 0x113a45, bottom: 0x2f6c58, accent: 0xc7ffcb, glow: 0xffef9d },
  width: 960,
  height: 1440,
  spawnX: 160,
  spawnY: 1160,
  gifts: [
    { id: 'memory-match', roomId: 'garden', type: 'minigame', x: 260, y: 1040, title: 'Memory Match', label: 'Tiny card game', assetKey: 'star', contentRef: 'memory-match' },
    { id: 'catch-hearts', roomId: 'garden', type: 'minigame', x: 500, y: 880, title: 'Catch Hearts', label: 'Catch the falling hearts', assetKey: 'heart', contentRef: 'catch-hearts' },
    { id: 'sort-gifts', roomId: 'garden', type: 'minigame', x: 740, y: 1040, title: 'Sort Gifts', label: 'Drag gifts to boxes', assetKey: 'gift', contentRef: 'sort-gifts' },
    { id: 'garden-star', roomId: 'garden', type: 'wish', x: 510, y: 1220, title: 'Wish Star', label: 'A little sparkle', assetKey: 'star', contentRef: 'birthday-wish' },
  ],
  portals: [
    { id: 'to-cake', roomId: 'garden', x: 860, y: 1260, targetSceneKey: 'CakeScene', title: 'Birthday Arch', label: 'Enter the cake room' },
  ],
};

export const cakeRoom: RoomDefinition = {
  id: 'cake',
  sceneKey: 'CakeScene',
  title: 'Cake Room',
  subtitle: 'make a wish',
  theme: { top: 0x4a215c, bottom: 0x7f4b63, accent: 0xffd6a5, glow: 0xfff2ca },
  width: 960,
  height: 1440,
  spawnX: 150,
  spawnY: 1120,
  gifts: [
    { id: 'birthday-cake', roomId: 'cake', type: 'cake', x: 530, y: 1040, title: 'Birthday Cake', label: 'Tap the candles', assetKey: 'cake', contentRef: 'birthday-cake' },
    { id: 'cake-wish', roomId: 'cake', type: 'wish', x: 760, y: 1220, title: 'A wish', label: 'A glowing birthday card', assetKey: 'heart', contentRef: 'birthday-wish' },
  ],
  portals: [
    { id: 'to-ending', roomId: 'cake', x: 860, y: 1260, targetSceneKey: 'EndingScene', title: 'Sky Stair', label: 'Unlock the ending' },
  ],
};

const ending: RoomDefinition = {
  id: 'ending',
  sceneKey: 'EndingScene',
  title: 'Final Sky',
  subtitle: 'the brightest soft ending',
  theme: { top: 0x16223f, bottom: 0x4a2f6c, accent: 0xf6c6ff, glow: 0xffe7ad },
  width: 960,
  height: 1440,
  spawnX: 520,
  spawnY: 1080,
  gifts: [
    { id: 'final-letter', roomId: 'ending', type: 'letter', x: 520, y: 1000, title: 'Final Letter', label: 'Read the last note', assetKey: 'envelope', contentRef: 'final-letter' },
  ],
  portals: [],
};

export const rooms: RoomDefinition[] = [bedroom, gallery, garden, cakeRoom, ending];
