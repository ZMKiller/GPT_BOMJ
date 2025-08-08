import Phaser from 'phaser';

/**
 * Manages in-game time. 1 real second = 1 in-game minute by default.
 */
export default class TimeSystem extends Phaser.Events.EventEmitter {
  private minute: number;
  private day: number;
  private speed = 60; // real seconds -> game minutes
  private tickers: Array<{ interval: number; acc: number; cb: () => void }> = [];

  constructor(day = 0, minute = 8 * 60) {
    super();
    this.day = day;
    this.minute = minute;
  }

  set(day: number, minute: number): void {
    this.day = day;
    this.minute = minute;
  }

  update(dt: number): void {
    const minutes = (dt * this.speed) / 60;
    this.minute += minutes;
    if (this.minute >= 1440) {
      this.minute -= 1440;
      this.day = (this.day + 1) % 7;
    }
    for (const t of this.tickers) {
      t.acc += dt;
      if (t.acc >= t.interval) {
        t.acc -= t.interval;
        t.cb();
      }
    }
  }

  now(): { day: number; hour: number; minute: number } {
    return { day: this.day, hour: Math.floor(this.minute / 60), minute: Math.floor(this.minute % 60) };
  }

  isDay(): boolean {
    const h = Math.floor(this.minute / 60);
    return h >= 6 && h < 21;
  }

  /** Register callback fired every interval seconds of real time */
  onTick(intervalSec: number, cb: () => void): void {
    this.tickers.push({ interval: intervalSec, acc: 0, cb });
  }
}
