import Phaser from 'phaser';
import eventsData from '../data/events.json';
import { EventDef, StatId } from '../util/types';
import EconomySystem from './EconomySystem';
import StatsSystem from './StatsSystem';
import InventorySystem from './InventorySystem';

const defs: EventDef[] = eventsData as any;

export default class EventSystem extends Phaser.Events.EventEmitter {
  constructor(
    private economy: EconomySystem,
    private stats: StatsSystem,
    private inventory: InventorySystem
  ) {
    super();
  }

  roll(ctx: { location: string; time: 'day' | 'night' }): EventDef | null {
    for (const ev of defs) {
      const w = ev.when;
      if (w?.location && !w.location.includes(ctx.location)) continue;
      if (w?.time && !w.time.includes(ctx.time)) continue;
      const chance = w?.chance ?? 0;
      if (Math.random() < chance) return ev;
    }
    return null;
  }

  apply(ev: EventDef): void {
    const option = ev.options[0];
    const effects = option.effects;
    if (!effects) return;
    if (effects.money) this.economy.modify(effects.money);
    if (effects.stats) this.stats.modify(effects.stats as any);
    if (effects.items?.add) effects.items.add.forEach(i => this.inventory.add(i));
    if (effects.items?.remove)
      effects.items.remove.forEach(i => this.inventory.use(i));
    this.emit('event', ev.id);
  }
}
