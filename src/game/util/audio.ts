export default class AudioManager {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private sfxGain: GainNode;
  private musicGain: GainNode;

  constructor() {
    // create audio context lazily on user interaction
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.connect(this.masterGain);
    this.musicGain = this.ctx.createGain();
    this.musicGain.connect(this.masterGain);
  }

  playBeep(freq: number, duration = 0.2, target: GainNode = this.sfxGain): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(target);
    osc.start();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.stop(this.ctx.currentTime + duration);
  }

  click(): void { this.playBeep(600, 0.05); }
  coin(): void { this.playBeep(1200, 0.1); }
  notify(): void { this.playBeep(800, 0.3); }

  startMusic(): void {
    const osc = this.ctx.createOscillator();
    osc.frequency.value = 200;
    osc.type = 'triangle';
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.5;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 20;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    const gain = this.ctx.createGain();
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start();
    lfo.start();
  }

  setMusicVolume(v: number): void { this.musicGain.gain.value = v; }
  setSfxVolume(v: number): void { this.sfxGain.gain.value = v; }
}
