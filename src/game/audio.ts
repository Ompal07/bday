import { songs } from './data';
import { SaveManager } from './storage';
import type { SongTrack } from './types';

type VoiceState = {
  timer: number;
  gain: GainNode;
  osc: OscillatorNode;
};

export class AudioManager {
  private static context: AudioContext | null = null;
  private static master: GainNode | null = null;
  private static currentTrackId: string | null = null;
  private static muted = false;
  private static activeVoices: VoiceState[] = [];
  private static started = false;

  static getTracks(): SongTrack[] {
    return songs;
  }

  static getTrack(trackId: string): SongTrack {
    return songs.find((track) => track.id === trackId) ?? songs[0];
  }

  static async unlock(): Promise<void> {
    const context = this.ensureContext();
    if (context.state !== 'running') {
      await context.resume();
    }
    this.started = true;
    this.applyMute(SaveManager.load().muted);
  }

  static isUnlocked(): boolean {
    return this.started;
  }

  static play(trackId: string): void {
    const track = this.getTrack(trackId);
    if (this.currentTrackId === track.id) {
      return;
    }

    this.stop();
    this.currentTrackId = track.id;
    SaveManager.patch((save) => {
      save.selectedSongId = track.id;
    });
    this.startTrack(track);
  }

  static stop(): void {
    for (const voice of this.activeVoices) {
      window.clearTimeout(voice.timer);
      try {
        voice.osc.stop();
      } catch {
        // no-op
      }
      voice.gain.disconnect();
      voice.osc.disconnect();
    }
    this.activeVoices = [];
    this.currentTrackId = null;
  }

  static setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyMute(muted);
    SaveManager.patch((save) => {
      save.muted = muted;
    });
  }

  static toggleMuted(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  static getMuted(): boolean {
    return this.muted;
  }

  static getCurrentTrackId(): string {
    return this.currentTrackId ?? SaveManager.load().selectedSongId;
  }

  private static ensureContext(): AudioContext {
    if (!this.context) {
      const AudioCtor = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this.context = new AudioCtor();
      this.master = this.context.createGain();
      this.master.gain.value = 0.8;
      this.master.connect(this.context.destination);
    }
    return this.context;
  }

  private static applyMute(muted: boolean): void {
    this.muted = muted;
    if (this.master) {
      this.master.gain.value = muted ? 0 : 0.8;
    }
  }

  private static startTrack(track: SongTrack): void {
    const context = this.ensureContext();
    const secondsPerBeat = 60 / track.bpm;
    let stepIndex = 0;

    const scheduleStep = (): void => {
      if (this.currentTrackId !== track.id) {
        return;
      }

      const note = track.notes[stepIndex];
      this.playNote(track, note, secondsPerBeat);
      const stepSeconds = Math.max(0.14, note.duration * secondsPerBeat);
      window.setTimeout(() => {
        stepIndex += 1;
        if (stepIndex >= track.notes.length) {
          stepIndex = 0;
        }
        scheduleStep();
      }, stepSeconds * 1000);
    };

    void context;
    scheduleStep();
  }

  private static playNote(track: SongTrack, note: { semitone: number; duration: number; velocity?: number }, secondsPerBeat: number): void {
    const context = this.ensureContext();
    if (!this.master) {
      return;
    }

    const frequency = 220 * Math.pow(2, note.semitone / 12);
    const osc = context.createOscillator();
    const gain = context.createGain();
    const compressor = context.createDynamicsCompressor();

    osc.type = track.voice;
    osc.frequency.value = frequency;
    gain.gain.value = (note.velocity ?? 0.45) * 0.16;
    osc.connect(gain);
    gain.connect(compressor);
    compressor.connect(this.master);
    osc.start();

    const releaseMs = Math.max(80, note.duration * secondsPerBeat * 820);
    const timer = window.setTimeout(() => {
      try {
        osc.stop();
      } catch {
        // no-op
      }
      gain.disconnect();
      osc.disconnect();
      this.activeVoices = this.activeVoices.filter((voice) => voice.timer !== timer);
    }, releaseMs);

    this.activeVoices.push({ osc, gain, timer });
  }
}
