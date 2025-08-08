import Phaser from 'phaser';
import archetypes from '../data/npcs.json';
import { NpcArchetypeDef } from '../util/types';

const defs: Record<string, NpcArchetypeDef> = {} as any;
(archetypes as NpcArchetypeDef[]).forEach(a => (defs[a.id] = a));

/** Simplified NPC spawner. */
export default class NPCSystem extends Phaser.Events.EventEmitter {
  getRandom(typeIds: string[]): NpcArchetypeDef {
    const id = Phaser.Utils.Array.GetRandom(typeIds);
    return defs[id];
  }
}
