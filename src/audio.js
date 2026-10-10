// All sound is synthesised with Web Audio: no asset files.

export class Audio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicOn = false;
    this.step = 0;
    this.nextTime = 0;
    this.intensity = 0;
  }

  // Browsers only allow audio after a user gesture.
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 6;
    this.master.connect(comp).connect(ctx.destination);
    this.sfx = ctx.createGain(); this.sfx.gain.value = 0.9; this.sfx.connect(this.master);
    this.music = ctx.createGain(); this.music.gain.value = 0.32; this.music.connect(this.master);
    const len = ctx.sampleRate;
    this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.8, this.ctx.currentTime, 0.02);
  }

  tone(type, f0, f1, dur, vol, when = 0, dest = this.sfx) {
    const c = this.ctx; if (!c) return;
    const t = c.currentTime + when;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t); o.stop(t + dur + 0.02);
  }

  noise(dur, vol, f0, f1, q = 1, type = 'bandpass', when = 0, dest = this.sfx) {
    const c = this.ctx; if (!c) return;
    const t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noiseBuf; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(dest);
    s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }

  clash(power) {
    const p = Math.min(1, power / 28);
    const v = 0.12 + 0.4 * p;
    const f = 1500 + Math.random() * 900;
    this.tone('triangle', f, f * 0.98, 0.18 + 0.25 * p, v * 0.5);
    this.tone('square', f * 1.51, f * 1.5, 0.09 + 0.1 * p, v * 0.16);
    this.tone('sine', f * 2.76, f * 2.7, 0.25 + 0.3 * p, v * 0.22);
    this.noise(0.07 + 0.08 * p, v, 5200, 2200, 0.8);
    if (p > 0.5) this.tone('sine', 150, 45, 0.25, v * 0.9);
  }
  wall(power, slam) {
    const p = Math.min(1, power / 18);
    this.noise(0.12, 0.1 + 0.25 * p, 1800, 500, 1.2);
    this.tone('triangle', 420, 180, 0.14, 0.1 + 0.2 * p);
    if (slam) this.tone('sine', 120, 40, 0.3, 0.5);
  }
  windup() { this.tone('sawtooth', 220, 660, 0.3, 0.07); this.noise(0.3, 0.05, 800, 3200, 2); }
  shoot() { this.noise(0.28, 0.3, 4200, 700, 1.4); this.tone('sawtooth', 980, 240, 0.22, 0.14); }
  projHit() { this.noise(0.2, 0.4, 2600, 500, 0.7); this.tone('square', 520, 110, 0.2, 0.2); this.tone('sine', 140, 50, 0.25, 0.5); }
  guard() { this.tone('sine', 520, 1040, 0.25, 0.22); this.tone('triangle', 780, 1560, 0.3, 0.12, 0.04); }
  parry() {
    this.tone('triangle', 2400, 2350, 0.5, 0.3); this.tone('sine', 3600, 3500, 0.6, 0.2);
    this.noise(0.1, 0.4, 7000, 3000, 0.7); this.tone('sine', 170, 50, 0.3, 0.6);
  }
  dash() { this.noise(0.35, 0.35, 500, 5200, 0.9); this.tone('sawtooth', 160, 720, 0.25, 0.12); }
  leap() { this.noise(0.9, 0.25, 300, 4200, 1.5); this.tone('sawtooth', 110, 880, 0.9, 0.12); this.tone('sine', 220, 1760, 0.9, 0.1); }
  meteor() {
    this.tone('sine', 190, 28, 0.9, 1.0); this.tone('triangle', 90, 30, 0.7, 0.6);
    this.noise(0.8, 0.7, 2600, 90, 0.5, 'lowpass'); this.noise(0.25, 0.4, 6000, 1500, 0.7);
  }
  blink() { this.noise(0.22, 0.25, 6000, 900, 2); this.tone('sine', 1500, 500, 0.2, 0.14); }
  quake() { this.tone('sine', 130, 34, 0.55, 0.9); this.noise(0.45, 0.5, 1400, 120, 0.6, 'lowpass'); this.noise(0.15, 0.3, 3000, 900, 0.8); }
  flare() { this.noise(0.45, 0.4, 900, 3600, 0.7); this.tone('sawtooth', 240, 90, 0.4, 0.12); }
  heal() { [523, 659, 784].forEach((f, i) => this.tone('sine', f, f * 1.01, 0.35, 0.13, i * 0.06)); }
  drain() { this.tone('sine', 300, 620, 0.22, 0.12); this.tone('triangle', 150, 80, 0.2, 0.2); }
  chain() { this.noise(0.25, 0.3, 3000, 1500, 3); [0, 0.04, 0.08, 0.12].forEach((w) => this.tone('square', 1800 + w * 3000, 1500, 0.04, 0.07, w)); }
  ringout() { this.tone('sawtooth', 1400, 180, 0.8, 0.2); this.noise(0.7, 0.4, 5000, 400, 0.8); this.tone('sine', 140, 40, 0.5, 0.7); }
  ultReady() { [660, 880, 1320].forEach((f, i) => this.tone('triangle', f, f, 0.22, 0.16, i * 0.07)); }
  denied() { this.tone('square', 150, 120, 0.08, 0.08); }
  move() { this.tone('sine', 880, 1200, 0.05, 0.05); }
  ui() { this.tone('triangle', 720, 960, 0.07, 0.14); }
  hover() { this.tone('sine', 1300, 1300, 0.03, 0.04); }
  beep(final) {
    if (final) { this.tone('square', 880, 880, 0.5, 0.18); this.tone('sawtooth', 1320, 1320, 0.55, 0.12); this.noise(0.5, 0.25, 800, 6000, 0.8); }
    else this.tone('square', 440, 440, 0.16, 0.16);
  }
  finish(win) {
    const notes = win ? [523, 659, 784, 1047] : [392, 330, 262, 196];
    notes.forEach((f, i) => { this.tone('triangle', f, f, 0.45, 0.2, i * 0.13); this.tone('sawtooth', f / 2, f / 2, 0.45, 0.07, i * 0.13); });
  }

  startMusic() { if (!this.ctx || this.musicOn) return; this.musicOn = true; this.step = 0; this.nextTime = this.ctx.currentTime + 0.1; }
  stopMusic() { this.musicOn = false; }

  // Call every frame; schedules a little ahead of the audio clock.
  update() {
    const c = this.ctx;
    if (!c || !this.musicOn) return;
    const spb = 60 / 138 / 4;
    while (this.nextTime < c.currentTime + 0.15) {
      const s = this.step % 64, bar = Math.floor(s / 16), b = s % 16;
      const when = this.nextTime - c.currentTime;
      const roots = [55, 55, 65.4, 49];
      const root = roots[bar];
      const m = this.music, hot = this.intensity;
      if (b % 4 === 0) this.tone('sine', 150, 42, 0.16, 0.9, when, m);
      if (b % 4 === 2) this.noise(0.03, 0.12 + 0.1 * hot, 9000, 9000, 1, 'highpass', when, m);
      if (b % 8 === 4) this.noise(0.11, 0.35, 1900, 1100, 0.8, 'bandpass', when, m);
      if (b % 2 === 1 || b % 8 === 0) this.tone('sawtooth', root, root, spb * 0.9, 0.22, when, m);
      const arp = [1, 1.5, 2, 2.4, 3, 2.4, 2, 1.5];
      if (hot > 0.3 || b % 2 === 0) this.tone('square', root * 4 * arp[b % 8], root * 4 * arp[b % 8], spb * 0.8, 0.035 + 0.035 * hot, when, m);
      this.nextTime += spb;
      this.step++;
    }
  }
}
