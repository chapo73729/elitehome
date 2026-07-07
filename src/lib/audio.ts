/* ============================================================
   ARDLABS — sound design. A tiny Web Audio engine: a licensed
   music bed + fully synthesized UI cues (click / hover / whoosh /
   success). Opt-in, persisted, and safe to import on the server.

   Architecture
   - lazy AudioContext, created only on a user gesture
   - one master GainNode; every ramp uses setTargetAtTime
     (exponential approach — no clicks/pops, ever)
   - ambient bed: /audio/ambient.mp3 — used with the artist's
     written permission (website-background use only). Fetched and
     decoded ONLY when a visitor enables sound, then looped through
     an AudioBufferSourceNode (never a MediaElementSource, which is
     silent on iOS WebKit), faded in/out over ~2 s
   - context is suspended while the tab is hidden and after the
     disable fade completes — the buffer source freezes in place
   ============================================================ */

type Listener = (enabled: boolean) => void;

/** dB (full scale) -> linear gain. */
const dB = (v: number) => Math.pow(10, v / 20);

const AMBIENT_LEVEL = dB(-19); // music bed — clearly present yet under the content
const CLICK_LEVEL = dB(-24); // ≈ 0.063
const HOVER_LEVEL = dB(-31); // ≈ 0.028 — even quieter tick
const WHOOSH_LEVEL = dB(-27);
const SUCCESS_LEVEL = dB(-23);

const FADE_TC = 0.55; // setTargetAtTime constant -> ~2 s fade (≈4τ)
const STORAGE_KEY = "ardlabs-sound";

interface AmbientVoice {
  gain: GainNode;
  stop: () => void;
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: AmbientVoice | null = null;
  private musicBuffer: AudioBuffer | null = null;
  private musicLoading = false;
  private musicGate = false;
  private noiseBuffer: AudioBuffer | null = null;
  private listeners = new Set<Listener>();
  private _enabled = false;
  private initialized = false;
  private lastHover = 0;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;

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

    // Save CPU + battery: park the whole context while the tab is hidden
    // (suspending freezes the buffer source in place — it resumes exactly
    // where it stopped).
    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) {
        void this.ctx.suspend();
      } else if (this._enabled) {
        void this.ctx.resume();
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
    this.master.gain.value = 0;
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
    if (ctx.state === "suspended" && !document.hidden) void ctx.resume();

    /* iOS unlock, belt and braces — all INSIDE this gesture:
       1. a one-sample buffer through the destination (the classic Web
          Audio unlock);
       2. a looping SILENT <audio> element ("keeper") — playing any media
          element flips iOS's audio session to `playback`, which is what
          stops the hardware mute switch from silencing Web Audio. Without
          it, sound "randomly" works depending on the ringer switch. */
    try {
      const unlock = ctx.createBufferSource();
      unlock.buffer = ctx.createBuffer(1, 1, 22050);
      unlock.connect(ctx.destination);
      unlock.start(0);
    } catch {}
    void this.ensureKeeper().play().catch(() => {});

    // cancel any pending ambient teardown from a recent disable()
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this._enabled = true;
    try {
      localStorage.setItem(STORAGE_KEY, "on");
    } catch {}

    const t = ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(1, t, 0.12);
    // start (or resume) the bed now, inside this gesture — it runs at
    // gain 0 until the manifesto gate opens, so the gate only ever has to
    // raise a volume
    this.startAmbient();
    // confirmation scheduled synchronously (still within the gesture's
    // call stack) — its own delays live on the audio clock
    this.success();

    // watchdog: if the context is still not running shortly after (some
    // iOS states refuse the first resume), the very next touch anywhere
    // finishes the job — no user-visible failure mode left
    setTimeout(() => {
      if (!this._enabled || !this.ctx || this.ctx.state === "running") return;
      const kick = () => {
        if (!this.ctx) return;
        void this.ctx.resume();
        void this.ensureKeeper().play().catch(() => {});
      };
      window.addEventListener("pointerdown", kick, { once: true });
      window.addEventListener("touchend", kick, { once: true });
    }, 600);
    this.emit();
  }

  /** Looping silent <audio> element that holds iOS's audio session in
   *  `playback` mode (defeats the hardware mute switch for Web Audio).
   *  The WAV is generated on the fly — 8 samples of silence. */
  private keeper: HTMLAudioElement | null = null;
  private ensureKeeper(): HTMLAudioElement {
    if (this.keeper) return this.keeper;
    const sr = 8000;
    const n = 8;
    const size = 44 + n * 2;
    const b = new DataView(new ArrayBuffer(size));
    const w = (o: number, s: string) => {
      for (let i = 0; i < s.length; i++) b.setUint8(o + i, s.charCodeAt(i));
    };
    w(0, "RIFF");
    b.setUint32(4, size - 8, true);
    w(8, "WAVE");
    w(12, "fmt ");
    b.setUint32(16, 16, true);
    b.setUint16(20, 1, true);
    b.setUint16(22, 1, true);
    b.setUint32(24, sr, true);
    b.setUint32(28, sr * 2, true);
    b.setUint16(32, 2, true);
    b.setUint16(34, 16, true);
    w(36, "data");
    b.setUint32(40, n * 2, true);
    let s = "";
    new Uint8Array(b.buffer).forEach((x) => (s += String.fromCharCode(x)));
    const a = new Audio("data:audio/wav;base64," + btoa(s));
    a.loop = true;
    a.setAttribute("playsinline", "");
    this.keeper = a;
    return a;
  }

  /** Open the gate that lets the music bed be HEARD. Called when the
   *  visitor reaches the manifesto chapter (or lands on an inner page).
   *  Opens once per page load; the already-playing bed fades up. */
  allowMusic() {
    if (this.musicGate) return;
    this.musicGate = true;
    if (!this._enabled) return;
    if (this.ambient && this.ctx) {
      const t = this.ctx.currentTime;
      this.ambient.gain.gain.cancelScheduledValues(t);
      this.ambient.gain.gain.setTargetAtTime(AMBIENT_LEVEL, t, FADE_TC);
    } else {
      this.startAmbient();
    }
  }

  disable() {
    this._enabled = false;
    try {
      localStorage.setItem(STORAGE_KEY, "off");
    } catch {}

    if (this.ctx && this.ambient) {
      // let the pad breathe out over ~2 s, then tear down + suspend
      const t = this.ctx.currentTime;
      this.ambient.gain.gain.cancelScheduledValues(t);
      this.ambient.gain.gain.setTargetAtTime(0, t, FADE_TC);
    }
    if (this.stopTimer) clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(() => {
      this.ambient?.stop();
      this.keeper?.pause();
      if (this.ctx && this.ctx.state === "running") void this.ctx.suspend();
      this.stopTimer = null;
    }, 2400);
    this.emit();
  }

  /* ---------------- ambient bed ---------------- */

  private startAmbient() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // the bed is only audible once the gate is open; until then it runs
    // muted so the moment of first sound is the manifesto, not the hero
    const target = this.musicGate ? AMBIENT_LEVEL : 0;

    if (this.ambient) {
      // re-enabled mid fade-out: breathe the existing bed back in
      this.ambient.gain.gain.cancelScheduledValues(t);
      this.ambient.gain.gain.setTargetAtTime(target, t, FADE_TC);
      return;
    }

    /* Licensed music bed. Decoded to an AudioBuffer and played through an
       AudioBufferSourceNode — deliberately NOT a MediaElementSource: WebKit
       has a long-standing bug where a media element routed into a Web Audio
       graph produces silence on iOS. A buffer source is plain Web Audio:
       gain fades work everywhere and no autoplay policy is involved once
       the context has been unlocked by the enable gesture. */
    const bed = ctx.createGain();
    bed.gain.value = 0;
    bed.connect(this.master);

    let source: AudioBufferSourceNode | null = null;
    let cancelled = false;

    const startSource = (buffer: AudioBuffer) => {
      if (cancelled || !this.ctx) return;
      source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(bed);
      source.start();
      const now = this.ctx.currentTime;
      bed.gain.cancelScheduledValues(now);
      bed.gain.setTargetAtTime(
        this.musicGate ? AMBIENT_LEVEL : 0,
        now,
        FADE_TC
      );
    };

    if (this.musicBuffer) {
      startSource(this.musicBuffer);
    } else if (!this.musicLoading) {
      this.musicLoading = true;
      fetch("/audio/ambient.mp3")
        .then((r) => r.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data))
        .then((buffer) => {
          this.musicBuffer = buffer;
          this.musicLoading = false;
          startSource(buffer);
        })
        .catch(() => {
          // network/decode failure: UI cues keep working, bed stays silent
          this.musicLoading = false;
        });
    }

    this.ambient = {
      gain: bed,
      stop: () => {
        cancelled = true;
        try {
          source?.stop();
        } catch {}
        source = null;
        bed.disconnect();
        this.ambient = null;
      },
    };
  }

  /* ---------------- shared helpers ---------------- */

  private getNoise(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const len = Math.floor(ctx.sampleRate * 1);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buf;
    return buf;
  }

  /** Envelope-shaped noise burst through a bandpass. */
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

  /** Envelope-shaped oscillator tone. */
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

  /** Soft tactile click: filtered noise transient + a sine blip (~60 ms). */
  click() {
    if (!this._enabled) return;
    this.noiseBurst({
      peak: CLICK_LEVEL * 0.8,
      attack: 0.002,
      decayTc: 0.012,
      dur: 0.06,
      freqFrom: 2600,
      q: 1.4,
    });
    this.tone({
      freq: 880,
      peak: CLICK_LEVEL * 0.55,
      attack: 0.003,
      decayTc: 0.016,
      dur: 0.06,
    });
  }

  /** Featherweight hover tick — quieter and shorter than click. */
  hover() {
    if (!this._enabled) return;
    const now = performance.now();
    if (now - this.lastHover < 55) return; // throttle
    this.lastHover = now;
    this.tone({
      freq: 1420 + Math.random() * 160,
      peak: HOVER_LEVEL,
      attack: 0.002,
      decayTc: 0.01,
      dur: 0.04,
    });
  }

  /** Soft filtered-noise sweep for page transitions (~450 ms). */
  whoosh() {
    if (!this._enabled) return;
    this.noiseBurst({
      peak: WHOOSH_LEVEL,
      attack: 0.05,
      decayTc: 0.11,
      dur: 0.45,
      freqFrom: 320,
      freqTo: 2200,
      q: 0.8,
    });
  }

  /** Cinematic entrance — timed to the hero wordmark assembling (~1.6 s):
   *  a deep swell rising an octave, air sweeping upward, and a two-note
   *  sparkle landing exactly when the letters lock. */
  arrival() {
    if (!this._enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // deep swell: A1 -> A2 over the letters' rise
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

    // air rising with the sweep
    this.noiseBurst({
      peak: dB(-30),
      attack: 0.4,
      decayTc: 0.45,
      dur: 1.8,
      freqFrom: 220,
      freqTo: 1500,
      q: 0.7,
    });

    // the ® snap — a soft sparkle fifth as everything settles
    this.tone({ freq: 880, peak: dB(-27), attack: 0.005, decayTc: 0.3, dur: 1.5, delay: 1.05 });
    this.tone({ freq: 1318.5, peak: dB(-27), attack: 0.004, decayTc: 0.26, dur: 1.4, delay: 1.15 });
  }

  /** Two-note rising confirmation (C5 -> G5). */
  success() {
    if (!this._enabled) return;
    this.tone({
      freq: 523.25,
      peak: SUCCESS_LEVEL,
      attack: 0.006,
      decayTc: 0.05,
      dur: 0.22,
    });
    this.tone({
      freq: 783.99,
      peak: SUCCESS_LEVEL * 0.85,
      attack: 0.006,
      decayTc: 0.07,
      dur: 0.28,
      delay: 0.11,
    });
  }
}

export const audio = new AudioManager();
