import Phaser from 'phaser';
import { LocationId, StatId, SkillId } from '../util/types';
import StatsSystem from './StatsSystem';
import SkillSystem from './SkillSystem';
import TimeSystem from './TimeSystem';

/** Simple economy: handles money and begging formula. */
export default class EconomySystem extends Phaser.Events.EventEmitter {
  private locationBonus: Record<LocationId, number> = {
    [LocationId.Downtown]: 0.1,
    [LocationId.Park]: 0.05,
    [LocationId.Shelter]: -0.1,
    [LocationId.JobCenter]: 0,
    [LocationId.Market]: 0.1
  };

  constructor(
    private state: { money: number },
    private stats: StatsSystem,
    private skills: SkillSystem,
    private time: TimeSystem
  ) {
    super();
  }

  get cash(): number {
    return this.state.money;
  }

  modify(amount: number): void {
    this.state.money += amount;
    this.emit('cash', this.state.money);
  }

  begAttempt(ctx: { location: LocationId; npc?: any }): { success: boolean; amount: number; reason?: string } {
    const charm = this.skills.get(SkillId.Charm).level;
    const politeness = this.skills.get(SkillId.Politeness).level;
    const mood = this.stats.get(StatId.Mood) as number;
    const hygiene = this.stats.get(StatId.Hygiene) as number;

    const base = 0.2;
    const bonus = charm * 0.02 + politeness * 0.01 + Phaser.Math.Clamp((mood - 50) / 100, -0.5, 0.5) * 0.1;
    const loc = this.locationBonus[ctx.location] || 0;
    const timeMod = this.time.isDay() ? 0 : -0.05;
    const hyg = hygiene < 30 ? -0.05 : 0;
    let chance = base + bonus + loc + timeMod + hyg;
    const npc = ctx.npc;
    if (npc) {
      chance += npc.baseDonateChance;
      const tod = npc.modifiers?.timeOfDay?.[this.time.isDay() ? 'day' : 'night'] || 0;
      chance += tod;
      chance += npc.modifiers?.location?.[ctx.location] || 0;
      const hygMods = npc.modifiers?.hygieneThresholds;
      if (hygMods) {
        for (const h of hygMods) if (hygiene < h.lt) { chance += h.mod; break; }
      }
    }
    chance = Phaser.Math.Clamp(chance, 0, 1);

    if (Math.random() < chance) {
      let amount = npc ? Phaser.Math.Between(npc.donateRange[0], npc.donateRange[1]) : Phaser.Math.Between(1, 20);
      if (Math.random() < 0.1) amount += Phaser.Math.Between(30, 80);
      this.modify(amount);
      this.skills.addXp(SkillId.Charm, Phaser.Math.Between(1, 3));
      return { success: true, amount };
    }
    return { success: false, amount: 0, reason: 'noLuck' };
  }
}
