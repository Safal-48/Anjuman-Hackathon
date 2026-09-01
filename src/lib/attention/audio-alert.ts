/**
 * Web Audio API gentle notification sound for Attention Alerts
 * Runs client-side with no external audio file dependencies.
 */

import { ATTENTION_CONFIG } from "./attention-config";

class AudioAlertManager {
  private audioCtx: AudioContext | null = null;
  private isEnabled: boolean = ATTENTION_CONFIG.AUDIO.DEFAULT_ENABLED;
  private lastPlayTime: number = 0;

  constructor() {
    // Lazy initialize on first interaction or alert
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  private initContext() {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Play a subtle, professional dual-frequency chime
   */
  public playSoftAttentionChime() {
    if (!this.isEnabled) return;

    // Minimum 3-second gap between audio chimes to avoid annoyance
    const now = Date.now();
    if (now - this.lastPlayTime < 3000) return;
    this.lastPlayTime = now;

    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(ATTENTION_CONFIG.AUDIO.CHIME_FREQUENCY_PRIMARY, ctx.currentTime);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(ATTENTION_CONFIG.AUDIO.CHIME_FREQUENCY_SECONDARY, ctx.currentTime);

      // Envelope: gentle attack, smooth decay
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.03); // Soft max volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ATTENTION_CONFIG.AUDIO.CHIME_DURATION_SECONDS);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);

      osc1.stop(ctx.currentTime + ATTENTION_CONFIG.AUDIO.CHIME_DURATION_SECONDS);
      osc2.stop(ctx.currentTime + ATTENTION_CONFIG.AUDIO.CHIME_DURATION_SECONDS);
    } catch {
      // Audio playback restrictions safely handled
    }
  }
}

export const audioAlert = new AudioAlertManager();
