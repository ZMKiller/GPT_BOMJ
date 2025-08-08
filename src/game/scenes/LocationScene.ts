import Phaser from 'phaser';
import locations from '../data/locations.json';
import { LocationDef, LocationId } from '../util/types';
import { Systems } from './BootScene';
import Panels from '../ui/Panels';
import { isImageMissing } from '../util/assetLoader';

const locDefs: Record<string, LocationDef> = {} as any;
(locations as LocationDef[]).forEach(l => (locDefs[l.id] = l));

export default abstract class LocationScene extends Phaser.Scene {
  protected systems!: Systems;
  protected location!: LocationDef;
  private panels!: Panels;
  private player!: Phaser.GameObjects.Sprite;
  private actionHandler = (a: string) => this.handleAction(a);
  private moveHandler = (v: { x: number; y: number }) => this.onMove(v);

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

    // listen to global events for actions and movement
    this.game.events.on('action', this.actionHandler);
    this.game.events.on('move', this.moveHandler);
  }

  protected enter(): void {
    console.log(`${this.scene.key} enter`);
    if (this.location.bgKey && !isImageMissing(this.location.bgKey)) {
      this.add.image(400, 300, this.location.bgKey).setOrigin(0.5);
    } else {

      // fallback: plain rectangle and centered label when texture is missing
      this.add.rectangle(0, 0, 800, 600, 0x444444).setOrigin(0);
      this.add.text(400, 300, this.location.name, { color: '#ffffff' }).setOrigin(0.5);
    }
    // top title always visible

    this.add.text(400, 40, this.location.name, { color: '#ffffff' }).setOrigin(0.5, 0);
  }

  protected exit(): void {
    console.log(`${this.scene.key} exit`);
    this.game.events.off('action', this.actionHandler);
    this.game.events.off('move', this.moveHandler);
  }

  protected setupInteractions(): void {
    this.player = this.add.sprite(400, 400, 'player_idle');
    this.anims.create({ key: 'idle', frames: [{ key: 'player_idle' }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'walk', frames: [{ key: 'player_walk' }, { key: 'player_idle' }], frameRate: 4, repeat: -1 });
    this.player.play('idle');

    // rain particles for ambiance
    const rain = this.add.particles('raindrop');
    rain.createEmitter({ x: { min: 0, max: 800 }, y: 0, lifespan: 2000, speedY: 300, quantity: 8, scale: { start: 1, end: 1 } });
    this.systems.time.onTick(5, () => this.systems.stats.modify({ mood: -1 }));

    this.panels = new Panels(this, this.systems);
    this.panels.show(this.location.actions);
  }

  private handleAction(action: string): void {
    const { economy, stats, time, inventory, jobs } = this.systems;
    switch (action) {
      case 'beg': {
        const res = economy.begAttempt({ location: this.locId, npc: this.systems.npc.getRandom(this.location.spawn.npcTypes) });
        if (res.success) {
          this.game.events.emit('toast', `Получено ${res.amount}₽`);
          const coin = this.add.image(this.player.x, this.player.y - 20, 'coin');
          this.tweens.add({ targets: coin, y: coin.y - 50, alpha: 0, duration: 800, onComplete: () => coin.destroy() });
          this.systems.audio.coin();
        } else {
          this.game.events.emit('toast', 'Ничего не дали');
        }
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
        this.game.events.emit('toast', '+5₽ бутылки');
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

  private onMove(v: { x: number; y: number }): void {
    if (!this.player) return;
    this.player.x += v.x * 0.02;
    this.player.y += v.y * 0.02;
    const moving = Math.abs(v.x) > 5 || Math.abs(v.y) > 5;
    this.player.play(moving ? 'walk' : 'idle');
  }
}
