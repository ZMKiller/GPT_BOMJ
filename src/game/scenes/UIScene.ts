import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    const { width } = this.scale;
    this.add.rectangle(0, 0, width, 40, 0x000000, 0.5).setOrigin(0);
    this.add.text(10, 10, 'деньги: 0', { color: '#ffffff' });
    this.add.text(150, 10, 'время: 08:00', { color: '#ffffff' });
    this.scene.bringToTop();
  }
}
