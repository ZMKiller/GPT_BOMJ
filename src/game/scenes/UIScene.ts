import Phaser from 'phaser';
import { Systems } from './BootScene';
import { StatId } from '../util/types';

export default class UIScene extends Phaser.Scene {
  private systems!: Systems;
  private moneyText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private statsText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    const { width } = this.scale;
    this.add.rectangle(0, 0, width, 50, 0x000000, 0.5).setOrigin(0);
    this.systems = this.game.registry.get('systems') as Systems;

    this.moneyText = this.add.text(10, 10, '', { color: '#ffffff' });
    this.timeText = this.add.text(150, 10, '', { color: '#ffffff' });
    this.statsText = this.add.text(10, 30, '', { color: '#ffffff' });
    this.scene.bringToTop();

    this.refresh();
    this.systems.stats.on('changed', () => this.refresh());
    this.systems.economy.on('cash', () => this.refresh());
    this.systems.time.onTick(1, () => this.refresh());
    this.game.events.on('toast', (msg: string) => this.showToast(msg));
  }

  private refresh(): void {
    const now = this.systems.time.now();
    this.moneyText.setText(`деньги: ${this.systems.economy.cash}`);
    this.timeText.setText(`день ${now.day} ${now.hour.toString().padStart(2, '0')}:${now.minute.toString().padStart(2, '0')}`);
    const s = this.systems.stats.get() as Record<StatId, number>;
    this.statsText.setText(`hp:${s.health} hu:${s.hunger} en:${s.energy} mood:${s.mood} hyg:${s.hygiene}`);
  }

  private showToast(msg: string): void {
    const t = this.add.text(400, 560, msg, { color: '#ffff00' }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: 520, alpha: 0, duration: 2000, onComplete: () => t.destroy() });
  }
}
