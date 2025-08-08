import Phaser from 'phaser';
import { SkillId } from '../util/types';

/** Tracks skill XP and levels. */
export default class SkillSystem extends Phaser.Events.EventEmitter {
  private data: Record<SkillId, { level: number; xp: number }>;
  private base = 10;
  private growth = 1.5;

  constructor(initial: Record<SkillId, { level: number; xp: number }>) {
    super();
    this.data = { ...initial };
  }

  addXp(skill: SkillId, amount: number): void {
    const entry = this.data[skill];
    entry.xp += amount;
    const needed = this.base * Math.pow(this.growth, entry.level);
    if (entry.xp >= needed && entry.level < 10) {
      entry.xp -= needed;
      entry.level++;
      this.emit('levelUp', skill, entry.level);
    }
    this.emit('changed', skill);
  }

  get(skill?: SkillId): any {
    return skill ? this.data[skill] : { ...this.data };
  }
}
