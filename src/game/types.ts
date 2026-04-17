export type GiftType = 'letter' | 'photo' | 'video' | 'wish' | 'minigame' | 'cake' | 'portal' | 'music';

export interface SaveData {
  version: number;
  openedGiftIds: string[];
  completedMiniGames: string[];
  selectedSongId: string;
  currentSceneKey: string;
  muted: boolean;
  volume: number;
}

export interface SongNote {
  semitone: number;
  duration: number;
  velocity?: number;
}

export interface SongTrack {
  id: string;
  title: string;
  mood: string;
  bpm: number;
  voice: OscillatorType;
  notes: SongNote[];
}

export interface LetterContent {
  id: string;
  title: string;
  pages: string[];
}

export interface PhotoFrame {
  caption: string;
  tint: number;
  src?: string;
}

export interface PhotoSet {
  id: string;
  title: string;
  frames: PhotoFrame[];
}

export interface VideoContent {
  id: string;
  title: string;
  src?: string;
  poster?: string;
  caption: string;
}

export interface GiftData {
  id: string;
  roomId: string;
  type: Exclude<GiftType, 'portal' | 'music'>;
  x: number;
  y: number;
  title: string;
  label: string;
  assetKey: string;
  contentRef: string;
  note?: string;
}

export interface PortalData {
  id: string;
  roomId: string;
  x: number;
  y: number;
  targetSceneKey: string;
  title: string;
  label: string;
}

export interface RoomDefinition {
  id: string;
  sceneKey: string;
  title: string;
  subtitle: string;
  theme: {
    top: number;
    bottom: number;
    accent: number;
    glow: number;
  };
  width: number;
  height: number;
  spawnX: number;
  spawnY: number;
  gifts: GiftData[];
  portals: PortalData[];
}

