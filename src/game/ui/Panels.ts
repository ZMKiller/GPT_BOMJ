import Phaser from 'phaser';
import { Systems } from '../scenes/BootScene';

/** Context action buttons shown per location. */
export default class Panels extends Phaser.GameObjects.Container {
  private buttons: Phaser.GameObjects.Text[] = [];

  constructor(scene: Phaser.Scene, private systems: Systems) {
    super(scene, scene.scale.width, scene.scale.height);
    scene.add.existing(this);
    this.setScrollFactor(0);
  }

  show(actions: string[]): void {
    // remove previous
    this.buttons.forEach(b => b.destroy());
    this.buttons = [];
    let idx = 0;
    actions.forEach(a => {
      const btn = this.scene.add.text(-10, -10 - idx * 40, a, { color: '#ffffff', backgroundColor: '#000000' })
        .setPadding(8)
        .setOrigin(1, 1)
        .setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        this.scene.game.events.emit('action', a);
        this.systems.audio.click();
      });
      this.add(btn);
      this.buttons.push(btn);
      idx++;
    });
  }
}
