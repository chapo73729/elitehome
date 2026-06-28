/* ============================================================
   ARDLABS — fully synthesized sound design (no audio files).
   A tiny Web Audio engine: ambient drone + UI ticks. Opt-in,
   persisted, and safe to import on the server.
   ============================================================ */

type Listener = (enabled: boolean) => void;

class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: { stop: () => void } | null = null;
  private listeners = new Set<Listener>();
  private _enabled = false;
  private lastHover = 0;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;

  get enabled() {
    return this._enabled;
  }

  init() {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("ardlabs-sound") === "on") {
      // preference is on, but audio can only start after a user gesture
      const resume = () => {
        this.enable();
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    }
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((l) => l(this._enabled));
  }

  private ensureCtx() {
    if (this.ctx) return this.ctx;
    const AC =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.0;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  toggle() {
    if (this._enabled) this.disable();
    else this.enable();
  }

  enable() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;
    if (ctx.state === "suspended") ctx.resume();
    // cancel any pending ambient teardown from a recent disable()
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this._enabled = true;
    localStorage.setItem("ardlabs-sound", "on");
    // fade master in
    const t = ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(1, t + 0.6);
    this.startAmbient();
    // clear rising two-note confirm so enabling is unmistakable
    this.blip(523.25, 0.14, "sine", 0.12);
    setTimeout(() => this.blip(783.99, 0.16, "sine", 0.1), 90);
    this.emit();
  }

  disable() {
    this._enabled = false;
    localStorage.setItem("ardlabs-sound", "off");
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(0, t + 0.4);
    }
    if (this.stopTimer) clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(() => {
      this.ambient?.stop();
      this.stopTimer = null;
    }, 450);
    this.emit();
  }

  private startAmbient() {
    if (!this.ctx || !this.master || this.ambient) return;
    const ctx = this.ctx;
    const pad = ctx.createGain();
    pad.gain.value = 0.09;
    pad.connect(this.master);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;
    filter.Q.value = 5;
    filter.connect(pad);

    // slow filter sweep
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const freqs = [110, 164.81, 220, 329.63]; // A2, E3, A3, E4 — audible on laptops
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? "sine" : "triangle";
      o.frequency.value = f * (1 + (i - 1.5) * 0.001); // slight detune
      o.connect(filter);
      o.start();
      return o;
    });

    this.ambient = {
      stop: () => {
        oscs.forEach((o) => {
          try {
            o.stop();
          } catch {}
        });
        try {
          lfo.stop();
        } catch {}
        pad.disconnect();
        this.ambient = null;
      },
    };
  }

  private blip(
    freq: number,
    dur: number,
    type: OscillatorType = "triangle",
    vol = 0.05
  ) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  hover() {
    if (!this._enabled) return;
    const now = performance.now();
    if (now - this.lastHover < 55) return; // throttle
    this.lastHover = now;
    this.blip(1320 + Math.random() * 120, 0.06, "triangle", 0.05);
  }

  click() {
    if (!this._enabled) return;
    this.blip(660, 0.09, "square", 0.07);
    this.blip(990, 0.12, "sine", 0.05);
  }
}

export const audio = new AudioManager();
