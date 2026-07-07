/* ============================================================
   ARDLABS — sound design. Two independent engines so playback is
   reliable on every device, no matter the model.

   1) MUSIC BED — a plain looping <audio> element (the licensed
      /audio/ambient.mp3, used with the artist's written permission
      for website-background use). A native media element is the ONE
      playback path that works everywhere: it plays over the iOS
      hardware mute switch (Web Audio does not), it is never affected
      by the MediaElementSource-is-silent-on-iOS WebKit bug (we never
      route it into Web Audio), and once started inside a user gesture
      it can be muted/unmuted freely afterwards. play() is issued
      synchronously in the enable tap, with a next-gesture retry if a
      browser still refuses the first call — so there is no state in
      which enabling leaves it silent.

   2) UI CUES — click / hover / whoosh / success / arrival, fully
      synthesized through a small Web Audio graph. Short, secondary,
      and unlocked by the same gesture.

   Opt-in, persisted, safe to import on the server.
   ============================================================ */

type Listener = (enabled: boolean) => void;

/** dB (full scale) -> linear gain. */
const dB = (v: number) => Math.pow(10, v / 20);

/* Media-element volume for the bed. Honoured on desktop and Android;
   iOS ignores programmatic volume and plays at the system level, which
   is expected and controlled by the phone's own volume buttons. */
const BED_VOLUME = 0.55;

const CLICK_LEVEL = dB(-24);
const HOVER_LEVEL = dB(-31);
const WHOOSH_LEVEL = dB(-27);
const SUCCESS_LEVEL = dB(-23);

const STORAGE_KEY = "ardlabs-sound";

class AudioManager {
  // Web Audio (UI cues only)
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  // media-element music bed
  private music: HTMLAudioElement | null = null;
  private musicGate = false;
  private fadeRaf = 0;
  private retryArmed = false;
  // state
  private listeners = new Set<Listener>();
  private _enabled = false;
  private initialized = false;
  private lastHover = 0;

  get enabled() {
    return this._enabled;
  }

  /** Idempotent bootstrap. Audio itself still waits for a user gesture. */
  init() {
    if (typeof window === "undefined" || this.initialized) return;
    this.initialized = true;

    if (localStorage.getItem(STORAGE_KEY) === "on") {
      // preference is on, but audio can only start after a user gesture
      const resume = () => {
        this.enable();
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    }

    // Park everything while the tab is hidden; restore on return.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.music?.pause();
        void this.ctx?.suspend();
      } else if (this._enabled) {
        void this.ctx?.resume();
        void this.music?.play().catch(() => {});
      }
    });
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((l) => l(this._enabled));
  }

  private ensureCtx(): AudioContext | null {
    if (this.ctx) return this.ctx;
    if (typeof window === "undefined") return null;
    const AC =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 1;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  private ensureMusic(): HTMLAudioElement {
    if (this.music) return this.music;
    const a = new Audio("/audio/ambient.mp3");
    a.loop = true;
    a.preload = "auto";
    a.setAttribute("playsinline", "");
    a.crossOrigin = "anonymous";
    a.volume = BED_VOLUME;
    this.music = a;
    return a;
  }

  toggle() {
    if (this._enabled) this.disable();
    else this.enable();
  }

  /** Must run synchronously inside a user gesture (tap/click/key). */
  enable() {
    this._enabled = true;
    try {
      localStorage.setItem(STORAGE_KEY, "on");
    } catch {}

    // 1) MUSIC — the reliable path. Start playback INSIDE this gesture.
    const m = this.ensureMusic();
    if (this.fadeRaf) cancelAnimationFrame(this.fadeRaf);
    // heard only once the manifesto gate is open; muted on the hero
    m.muted = !this.musicGate;
    m.volume = BED_VOLUME;
    this.playMusic();

    // 2) UI CUES — unlock Web Audio in the same gesture.
    const ctx = this.ensureCtx();
    if (ctx) {
      if (ctx.state === "suspended") void ctx.resume();
      try {
        const u = ctx.createBufferSource();
        u.buffer = ctx.createBuffer(1, 1, 22050);
        u.connect(ctx.destination);
        u.start(0);
      } catch {}
      this.success();
    }

    this.emit();
  }

  /** play() with a one-time next-gesture retry if a browser refuses the
   *  first call — guarantees the bed is never left silent after enabling. */
  private playMusic() {
    const m = this.music;
    if (!m) return;
    const p = m.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        if (this.retryArmed) return;
        this.retryArmed = true;
        const retry = () => {
          this.retryArmed = false;
          window.removeEventListener("pointerdown", retry);
          window.removeEventListener("touchend", retry);
          window.removeEventListener("keydown", retry);
          if (this._enabled) void this.music?.play().catch(() => {});
        };
        window.addEventListener("pointerdown", retry, { once: true });
        window.addEventListener("touchend", retry, { once: true });
        window.addEventListener("keydown", retry, { once: true });
      });
    }
  }

  /** Smoothly ramp the element's volume (honoured off-iOS; a clean jump
   *  on iOS where volume is read-only). */
  private fadeTo(target: number, ms: number, thenPause = false) {
    const m = this.music;
    if (!m) return;
    if (this.fadeRaf) cancelAnimationFrame(this.fadeRaf);
    const from = m.volume;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      // clamp — rAF timing can overshoot the [0,1] range by a hair
      m.volume = Math.min(1, Math.max(0, from + (target - from) * k));
      if (k < 1) {
        this.fadeRaf = requestAnimationFrame(step);
      } else if (thenPause) {
        m.pause();
      }
    };
    this.fadeRaf = requestAnimationFrame(step);
  }

  /** Open the gate that lets the music be HEARD — the visitor reached the
   *  manifesto (or landed on an inner page). Opens once per page load. */
  allowMusic() {
    if (this.musicGate) return;
    this.musicGate = true;
    if (!this._enabled) return;
    const m = this.ensureMusic();
    m.muted = false;
    m.volume = 0;
    this.fadeTo(BED_VOLUME, 1800);
    void m.play().catch(() => {});
  }

  disable() {
    this._enabled = false;
    try {
      localStorage.setItem(STORAGE_KEY, "off");
    } catch {}
    // fade the bed out over ~1.4 s, then pause
    if (this.music) this.fadeTo(0, 1400, true);
    if (this.ctx && this.ctx.state === "running") void this.ctx.suspend();
    this.emit();
  }

  /* ---------------- shared helpers (UI cues) ---------------- */

  private getNoise(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const len = Math.floor(ctx.sampleRate * 1);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buf;
    return buf;
  }

  private noiseBurst(opts: {
    peak: number;
    attack: number;
    decayTc: number;
    dur: number;
    freqFrom: number;
    freqTo?: number;
    q?: number;
  }) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.getNoise(ctx);
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = opts.q ?? 1;
    bp.frequency.setValueAtTime(opts.freqFrom, t);
    if (opts.freqTo !== undefined) {
      bp.frequency.setTargetAtTime(opts.freqTo, t, opts.dur / 3.5);
    }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.setTargetAtTime(opts.peak, t, opts.attack);
    g.gain.setTargetAtTime(0, t + opts.attack * 3, opts.decayTc);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(t);
    src.stop(t + opts.dur + 0.1);
  }

  private tone(opts: {
    freq: number;
    peak: number;
    attack: number;
    decayTc: number;
    dur: number;
    type?: OscillatorType;
    delay?: number;
  }) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + (opts.delay ?? 0);
    const o = ctx.createOscillator();
    o.type = opts.type ?? "sine";
    o.frequency.setValueAtTime(opts.freq, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.setTargetAtTime(opts.peak, t, opts.attack);
    g.gain.setTargetAtTime(0, t + opts.attack * 3, opts.decayTc);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + opts.dur + 0.1);
  }

  /* ---------------- UI cues ---------------- */

  click() {
    if (!this._enabled) return;
    this.noiseBurst({ peak: CLICK_LEVEL * 0.8, attack: 0.002, decayTc: 0.012, dur: 0.06, freqFrom: 2600, q: 1.4 });
    this.tone({ freq: 880, peak: CLICK_LEVEL * 0.55, attack: 0.003, decayTc: 0.016, dur: 0.06 });
  }

  hover() {
    if (!this._enabled) return;
    const now = performance.now();
    if (now - this.lastHover < 55) return;
    this.lastHover = now;
    this.tone({ freq: 1420 + Math.random() * 160, peak: HOVER_LEVEL, attack: 0.002, decayTc: 0.01, dur: 0.04 });
  }

  whoosh() {
    if (!this._enabled) return;
    this.noiseBurst({ peak: WHOOSH_LEVEL, attack: 0.05, decayTc: 0.11, dur: 0.45, freqFrom: 320, freqTo: 2200, q: 0.8 });
  }

  /** Cinematic entrance, timed to the hero wordmark assembling (~1.6 s). */
  arrival() {
    if (!this._enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(55, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 1.3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.setTargetAtTime(dB(-20), t, 0.35);
    g.gain.setTargetAtTime(0, t + 1.25, 0.3);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + 3);
    this.noiseBurst({ peak: dB(-30), attack: 0.4, decayTc: 0.45, dur: 1.8, freqFrom: 220, freqTo: 1500, q: 0.7 });
    this.tone({ freq: 880, peak: dB(-27), attack: 0.005, decayTc: 0.3, dur: 1.5, delay: 1.05 });
    this.tone({ freq: 1318.5, peak: dB(-27), attack: 0.004, decayTc: 0.26, dur: 1.4, delay: 1.15 });
  }

  /** Two-note rising confirmation (C5 -> G5). */
  success() {
    if (!this._enabled) return;
    this.tone({ freq: 523.25, peak: SUCCESS_LEVEL, attack: 0.006, decayTc: 0.05, dur: 0.22 });
    this.tone({ freq: 783.99, peak: SUCCESS_LEVEL * 0.85, attack: 0.006, decayTc: 0.07, dur: 0.28, delay: 0.11 });
  }
}

export const audio = new AudioManager();
