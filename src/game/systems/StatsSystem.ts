import Phaser from 'phaser';
import { StatId } from '../util/types';
import TimeSystem from './TimeSystem';

/** Handles character stats with periodic decay. */
export default class StatsSystem extends Phaser.Events.EventEmitter {
  private stats: Record<StatId, number>;
  private awake = true;

  constructor(time: TimeSystem, initial: Record<StatId, number>) {
    super();
    this.stats = { ...initial };
    // tick every 5 real seconds
    time.onTick(5, () => this.applyEffects(5));
  }

  get(id?: StatId): number | Record<StatId, number> {
    return id ? this.stats[id] : { ...this.stats };
  }

  modify(patch: Partial<Record<StatId, number>>): void {
    Object.entries(patch).forEach(([k, v]) => {
      const id = k as StatId;
      this.stats[id] = Phaser.Math.Clamp(this.stats[id] + (v ?? 0), 0, 100);
    });
  }

  /** Apply natural changes over time. */
  applyEffects(_delta: number): void {
    this.stats[StatId.Hunger] = Phaser.Math.Clamp(this.stats[StatId.Hunger] + 2, 0, 100);
    if (this.awake) {
      this.stats[StatId.Energy] = Phaser.Math.Clamp(this.stats[StatId.Energy] - 2, 0, 100);
    }
    this.stats[StatId.Hygiene] = Phaser.Math.Clamp(this.stats[StatId.Hygiene] - 1, 0, 100);

    if (this.stats[StatId.Hunger] > 80 || this.stats[StatId.Energy] < 20) {
      this.stats[StatId.Health] = Phaser.Math.Clamp(this.stats[StatId.Health] - 1, 0, 100);
      if (this.stats[StatId.Health] <= 20) this.emit('onLowHealth');
      if (this.stats[StatId.Health] <= 0) this.emit('onDeath');
    }
    this.emit('changed');
  }

  setAwake(value: boolean): void {
    this.awake = value;
  }
}
