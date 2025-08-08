import Phaser from 'phaser';
import { StatId } from '../util/types';
import { Systems } from '../scenes/BootScene';

/** HUD draws stat bars and money/time indicators. */
export default class HUD extends Phaser.GameObjects.Container {
  private bars: Record<StatId, Phaser.GameObjects.Graphics> = {} as any;
  private barBg: Record<StatId, Phaser.GameObjects.Graphics> = {} as any;
  private moneyText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private toastY = 60;

  constructor(scene: Phaser.Scene, private systems: Systems) {
    super(scene, 0, 0);
    scene.add.existing(this);

    // create top panel
    const width = scene.scale.width;
    scene.add.rectangle(0, 0, width, 60, 0x000000, 0.5).setOrigin(0);

    this.moneyText = scene.add.text(10, 10, '', { color: '#ffffff' });
    this.timeText = scene.add.text(150, 10, '', { color: '#ffffff' });

    let y = 40;
    (Object.values(StatId) as StatId[]).forEach(id => {
      const bg = scene.add.graphics();
      bg.fillStyle(0x333333, 1).fillRect(10, y, 100, 8);
      const fg = scene.add.graphics();
      fg.fillStyle(0x00ff00, 1).fillRect(10, y, 100, 8);
      this.barBg[id] = bg;
      this.bars[id] = fg;
      y += 12;
    });
    this.refresh();
  }

  refresh(): void {
    const now = this.systems.time.now();
    this.moneyText.setText(`₽: ${this.systems.economy.cash}`);
    this.timeText.setText(`день ${now.day} ${now.hour.toString().padStart(2, '0')}:${now.minute
      .toString()
      .padStart(2, '0')}`);
    const s = this.systems.stats.get() as Record<StatId, number>;
    (Object.values(StatId) as StatId[]).forEach(id => {
      const v = s[id];
      this.bars[id].scaleX = v / 100;
    });
  }

  /** Shows fading toast message in top-right corner. */
  toast(msg: string): void {
    const t = this.scene.add.text(this.scene.scale.width - 10, this.toastY, msg, { color: '#ffff00' }).setOrigin(1, 0);
    this.toastY += 18;
    this.scene.tweens.add({
      targets: t,
      alpha: 0,
      duration: 2500,
      onComplete: () => {
        t.destroy();
        this.toastY -= 18;
      }
    });
  }
}
