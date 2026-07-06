/* ============================================================
   ARDLABS — fully synthesized sound design (no audio files).
   A tiny Web Audio engine: an evolving ambient pad + refined UI
   cues (click / hover / whoosh / success). Opt-in, persisted,
   and safe to import on the server.

   Architecture
   - lazy AudioContext, created only on a user gesture
   - one master GainNode; every ramp uses setTargetAtTime
     (exponential approach — no clicks/pops, ever)
   - ambient bed: a cinematic "space orchestra" drone — a warm
     D-major stack of sine/triangle voices (root, beating octave
     pair, fifth, and a major third that swells in and out) plus
     filtered air, everything kept below ~1 kHz so there is no
     harsh content anywhere; fading in/out over ~2 s on toggle
   - context is suspended while the tab is hidden and after
     the disable fade completes
   ============================================================ */

type Listener = (enabled: boolean) => void;

/** dB (full scale) -> linear gain. */
const dB = (v: number) => Math.pow(10, v / 20);

const AMBIENT_LEVEL = dB(-35); // sines read quieter than saws — still a barely-there bed
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

    // Save CPU + battery: park the whole context while the tab is hidden.
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
    this.startAmbient();
    // gentle two-note confirmation so enabling is unmistakable
    setTimeout(() => this.success(), 120);
    this.emit();
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
    if (this.ambient) {
      // re-enabled mid fade-out: breathe the existing pad back in
      this.ambient.gain.gain.cancelScheduledValues(t);
      this.ambient.gain.gain.setTargetAtTime(AMBIENT_LEVEL, t, FADE_TC);
      return;
    }

    const pad = ctx.createGain();
    pad.gain.value = 0;
    pad.gain.setTargetAtTime(AMBIENT_LEVEL, t, FADE_TC); // ~2 s fade-in
    pad.connect(this.master);

    // one gentle ceiling for the whole chord: nothing above ~1 kHz survives,
    // so the bed can never turn harsh or fatiguing
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 950;
    filter.Q.value = 0.4;
    filter.connect(pad);

    const stops: { stop: () => void }[] = [];
    const voice = (
      type: OscillatorType,
      freq: number,
      level: number,
      detune = 0
    ) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      o.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = level;
      o.connect(g);
      g.connect(filter);
      o.start(t);
      stops.push(o);
      return g;
    };

    /* A warm D-major "space orchestra" stack — every partial is a soft
       sine/triangle, every interval consonant:
         D2 root, a D3 octave pair beating at ~0.3 Hz (string-section
         shimmer), the A3 fifth, and an F#4 major third that swells in
         and out like a distant horn line. */
    voice("sine", 73.42, 0.9); // D2 — foundation
    voice("triangle", 146.83, 0.42, -3); // D3, slow beat pair
    voice("triangle", 146.83, 0.42, +4);
    voice("sine", 220.0, 0.3); // A3 — fifth
    const third = voice("sine", 369.99, 0.1); // F#4 — the hopeful colour

    // the third breathes: a very slow swell from near-silence to present
    const swell = ctx.createOscillator();
    const swellGain = ctx.createGain();
    swell.type = "sine";
    swell.frequency.value = 0.03; // one swell ≈ 33 s
    swellGain.gain.value = 0.09;
    swell.connect(swellGain);
    swellGain.connect(third.gain);
    swell.start(t);
    stops.push(swell);

    // whole pad breathes ±18% over ~20 s — alive, never static
    const breath = ctx.createOscillator();
    const breathGain = ctx.createGain();
    breath.type = "sine";
    breath.frequency.value = 0.05;
    breathGain.gain.value = AMBIENT_LEVEL * 0.18;
    breath.connect(breathGain);
    breathGain.connect(pad.gain);
    breath.start(t);
    stops.push(breath);

    // filtered air — the quiet "room tone" of a very large space
    const air = ctx.createBufferSource();
    air.buffer = this.getNoise(ctx);
    air.loop = true;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = "lowpass";
    airFilter.frequency.value = 320;
    airFilter.Q.value = 0.3;
    const airGain = ctx.createGain();
    airGain.gain.value = 0.05;
    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(pad);
    air.start(t);
    stops.push(air);

    this.ambient = {
      gain: pad,
      stop: () => {
        stops.forEach((node) => {
          try {
            node.stop();
          } catch {}
        });
        pad.disconnect();
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
