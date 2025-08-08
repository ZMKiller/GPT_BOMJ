import Phaser from 'phaser';
import locations from '../data/locations.json';
import { LocationDef, LocationId } from '../util/types';
import { Systems } from './BootScene';

const locDefs: Record<string, LocationDef> = {} as any;
(locations as LocationDef[]).forEach(l => (locDefs[l.id] = l));

export default abstract class LocationScene extends Phaser.Scene {
  protected systems!: Systems;
  protected location!: LocationDef;

  protected constructor(key: string, private locId: LocationId) {
    super({ key });
  }

  create(): void {
    this.systems = this.game.registry.get('systems') as Systems;
    this.location = locDefs[this.locId];
    this.systems.state.location = this.locId;

    this.enter();
    this.setupInteractions();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.exit());
  }

  protected enter(): void {
    console.log(`${this.scene.key} enter`);
  }

  protected exit(): void {
    console.log(`${this.scene.key} exit`);
  }

  protected setupInteractions(): void {
    const actions = this.location.actions;
    actions.forEach((act, idx) => {
      const btn = this.add.text(50, 500 + idx * 30, act, { color: '#ffff00' })
        .setInteractive({ useHandCursor: true });
      btn.on('pointerup', () => this.handleAction(act));
    });
  }

  private handleAction(action: string): void {
    const { economy, stats, time, inventory, jobs } = this.systems;
    switch (action) {
      case 'beg': {
        const res = economy.begAttempt({ location: this.locId, npc: this.systems.npc.getRandom(this.location.spawn.npcTypes) });
        if (res.success) this.game.events.emit('toast', `Получено ${res.amount}₽`);
        else this.game.events.emit('toast', 'Ничего не дали');
        break;
      }
      case 'rest': {
        stats.modify({ energy: 20, mood: 5 });
        stats.setAwake(false);
        time.onTick(2, () => stats.setAwake(true));
        break;
      }
      case 'wash': {
        stats.modify({ hygiene: 30 });
        break;
      }
      case 'collect': {
        economy.modify(5);
        break;
      }
      case 'shop': {
        if (!inventory.buy('burger')) this.game.events.emit('toast', 'Нет денег');
        break;
      }
      case 'interview': {
        const ok = jobs.interview('cleaner');
        this.game.events.emit('toast', ok ? 'Приняли!' : 'Отказ');
        if (ok) {
          const now = time.now();
          jobs.startShift('cleaner', now.hour * 60 + now.minute);
        }
        break;
      }
    }
  }
}
