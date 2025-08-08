import Phaser from 'phaser';
import items from '../data/items.json';
import { ItemDef } from '../util/types';
import StatsSystem from './StatsSystem';
import EconomySystem from './EconomySystem';

const itemDefs: Record<string, ItemDef> = (items as any);

export default class InventorySystem extends Phaser.Events.EventEmitter {
  private items: string[] = [];

  constructor(private stats: StatsSystem, private economy: EconomySystem) {
    super();
  }

  add(id: string): void {
    this.items.push(id);
    this.emit('changed');
  }

  use(id: string): boolean {
    const idx = this.items.indexOf(id);
    if (idx === -1) return false;
    const def = itemDefs[id];
    if (def?.effects) this.stats.modify(def.effects as any);
    this.items.splice(idx, 1);
    this.emit('changed');
    return true;
  }

  buy(id: string): boolean {
    const def = itemDefs[id];
    if (!def || this.economy.cash < def.price) return false;
    this.economy.modify(-def.price);
    this.add(id);
    return true;
  }

  list(): string[] {
    return [...this.items];
  }
}
