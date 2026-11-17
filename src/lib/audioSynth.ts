// Soft piano + warm pad + bells synthesizer via Web Audio API (D major)
export class WeddingSynth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private verbIn: GainNode | null = null;
  private on = false;
  private timer: any = null;
  private nextT = 0;
  private bar = 0;
  private primed = false;

  private BPM = 56;
  private B = 60 / 56;
  private mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

  // Chords: Dmaj7 | Bm7 | Gmaj7 | A9sus
  private CH = [
    [50, 57, 61, 66],
    [47, 54, 57, 62],
    [43, 50, 54, 59],
    [45, 52, 55, 59]
  ];

  private PAD = [
    [57, 62, 66, 69],
    [59, 62, 66, 69],
    [55, 59, 62, 66],
    [57, 61, 64, 67]
  ];

  private MEL = [
    [74, 76, 78, 81, 85],
    [74, 78, 81, 83, 85],
    [74, 76, 79, 83, 78],
    [76, 78, 81, 83, 85]
  ];

  private build(c: AudioContext) {
    this.ctx = c;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;

    this.master = c.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);
    comp.connect(c.destination);

    // Reverb buffer
    const len = Math.floor(c.sampleRate * 3.6);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.7);
      }
    }

    const verb = c.createConvolver();
    verb.buffer = buf;
    this.verbIn = c.createGain();
    const wet = c.createGain();
    wet.gain.value = 0.85;

    this.verbIn.connect(verb);
    verb.connect(wet);
    wet.connect(this.master);
  }

  private piano(m: number, t: number, v: number, d: number, lead = false) {
    if (!this.ctx || !this.master || !this.verbIn) return;
    const f = this.mtof(m);
    const g = this.ctx.createGain();
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = lead ? 3400 : 1900;

    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const o3 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    const g3 = this.ctx.createGain();

    o1.type = 'sine';
    o2.type = 'triangle';
    o3.type = 'sine';
    o1.frequency.value = f;
    o2.frequency.value = f * 2.0015;
    o3.frequency.value = f * 3.01;
    g2.gain.value = 0.22;
    g3.gain.value = 0.06;

    o1.connect(g);
    o2.connect(g2);
    g2.connect(g);
    o3.connect(g3);
    g3.connect(g);

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v * 0.55, t + 0.012);
    g.gain.exponentialRampToValueAtTime(v * 0.2, t + 0.28);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d + 1.2);

    g.connect(lp);
    lp.connect(this.master);
    const s = this.ctx.createGain();
    s.gain.value = 0.6;
    lp.connect(s);
    s.connect(this.verbIn);

    [o1, o2, o3].forEach(o => {
      o.start(t);
      o.stop(t + d + 1.4);
    });
  }

  private pad(notes: number[], t: number, d: number) {
    if (!this.ctx || !this.master || !this.verbIn) return;
    notes.forEach(m => {
      const g = this.ctx!.createGain();
      const lp = this.ctx!.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 720;

      [-6, 6].forEach(c => {
        const o = this.ctx!.createOscillator();
        o.type = 'triangle';
        o.frequency.value = this.mtof(m);
        o.detune.value = c;
        o.connect(g);
        o.start(t);
        o.stop(t + d + 2.4);
      });

      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03, t + 1.8);
      g.gain.setValueAtTime(0.03, t + d);
      g.gain.linearRampToValueAtTime(0, t + d + 2.2);

      g.connect(lp);
      lp.connect(this.master!);
      const s = this.ctx!.createGain();
      s.gain.value = 0.5;
      lp.connect(s);
      s.connect(this.verbIn!);
    });
  }

  private bell(m: number, t: number) {
    if (!this.ctx || !this.master || !this.verbIn) return;
    const f = this.mtof(m);
    [1, 2.76].forEach((r, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = 'sine';
      o.frequency.value = f * r;

      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05 / (i + 1), t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
      o.connect(g);
      g.connect(this.master!);
      const s = this.ctx!.createGain();
      s.gain.value = 0.9;
      g.connect(s);
      s.connect(this.verbIn!);
      o.start(t);
      o.stop(t + 2.8);
    });
  }

  private playBar(t: number) {
    const i = this.bar % 4;
    const ch = this.CH[i];

    // 12/8 rolling arpeggio
    [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 3].forEach((k, j) => {
      this.piano(ch[k], t + j * this.B / 3, j % 6 === 0 ? 0.5 : 0.24 + Math.random() * 0.08, this.B * 1.5);
    });

    this.pad(this.PAD[i], t, 4 * this.B);

    let p = Math.floor(Math.random() * 5);
    [[0, 0.9], [1.5, 0.55], [2, 0.6], [3, 0.5]].forEach(([b, pr]) => {
      if (Math.random() < pr) {
        p = Math.max(0, Math.min(4, p + Math.floor(Math.random() * 3) - 1));
        this.piano(this.MEL[i][p], t + b * this.B, 0.4, this.B * 2.2, true);
      }
    });

    if (Math.random() < 0.5) {
      this.bell(this.MEL[i][4] + 12, t + 3.5 * this.B);
    }
  }

  private sched = () => {
    if (!this.ctx || !this.on) return;
    while (this.nextT < this.ctx.currentTime + 1.8) {
      this.playBar(this.nextT);
      this.nextT += 4 * this.B;
      this.bar++;
    }
  };

  public prime() {
    if (this.primed || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    this.build(new AudioCtx());
    this.primed = true;
  }

  public start(): boolean {
    this.prime();
    if (!this.ctx) return false;
    this.ctx.resume();
    if (!this.on) {
      this.on = true;
      this.bar = 0;
      this.nextT = this.ctx.currentTime + 0.25;
      if (this.master) {
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.setTargetAtTime(0.95, this.ctx.currentTime, 1.4);
      }
      this.timer = setInterval(this.sched, 250);
      this.sched();
    }
    return true;
  }

  public stop() {
    if (!this.on || !this.ctx) return;
    this.on = false;
    clearInterval(this.timer);
    if (this.master) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.35);
    }
    setTimeout(() => {
      if (!this.on && this.ctx && this.ctx.state !== 'closed') {
        this.ctx.suspend();
      }
    }, 1600);
  }

  public get playing() {
    return this.on;
  }
}

