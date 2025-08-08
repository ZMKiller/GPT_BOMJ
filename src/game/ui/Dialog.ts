import Phaser from 'phaser';
import { Systems } from '../scenes/BootScene';

/** Simple modal dialog with text and options. */
export default class Dialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, private systems: Systems, private onClose: () => void) {
    super(scene, 0, 0);
    scene.add.existing(this);
    const { width, height } = scene.scale;
    // dark backdrop
    scene.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0).setInteractive();
  }

  open(text: string, options: Array<{ label: string; action: () => void }>): void {
    const { width, height } = this.scene.scale;
    const panel = this.scene.add.rectangle(width / 2, height / 2, width - 80, 200, 0x333333, 0.9);
    const label = this.scene.add.text(panel.x, panel.y - 60, text, { color: '#ffffff', align: 'center', wordWrap: { width: width - 120 } }).setOrigin(0.5);
    options.forEach((opt, i) => {
      const btn = this.scene.add.text(panel.x, panel.y - 20 + i * 30, opt.label, { color: '#ffff00', backgroundColor: '#000000' })
        .setOrigin(0.5)
        .setPadding(6)
        .setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        opt.action();
        this.destroy(true);
        this.onClose();
        this.systems.audio.click();
      });
    });
  }
}
