// Web Audio API Synthesizer for instant, dependency-free notification sounds

class SoundEffects {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return null;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      return this.audioCtx;
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
      return null;
    }
  }

  /**
   * Plays a crisp, pleasant high-frequency double beep (like an access chime / school bell alert)
   */
  public playEntranceBeep() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Beep 1 (Higher ping)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5 note
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08); // Ramp to C6

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.13);

      // Beep 2 (Affirmative chime)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      const startTime2 = now + 0.12;
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, startTime2); // E6 note
      osc2.frequency.exponentialRampToValueAtTime(1567.98, startTime2 + 0.1); // G6 note

      gain2.gain.setValueAtTime(0.001, startTime2);
      gain2.gain.linearRampToValueAtTime(0.4, startTime2 + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime2 + 0.32);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(startTime2);
      osc2.stop(startTime2 + 0.35);
    } catch (err) {
      console.warn('Error playing beep sound:', err);
    }
  }

  /**
   * Authoritative 3-tone melodious chime sequence for Official Citatorios & Reports (F5 -> A5 -> C6)
   */
  public playNoticeAlert() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [698.46, 880.00, 1046.50]; // F5, A5, C6 major chord

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.14;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.42);
      });
    } catch (err) {
      console.warn('Error playing notice alert chime:', err);
    }
  }

  /**
   * Urgent dual-tone chime for immediate citations
   */
  public playUrgentAlert() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [880, 1174.66, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.4, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch (err) {
      console.warn('Error playing urgent alert sound:', err);
    }
  }

  /**
   * Simple single test beep
   */
  public playTestBeep() {
    this.playNoticeAlert();
  }
}

export const soundEffects = new SoundEffects();
