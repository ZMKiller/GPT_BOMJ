import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // preload assets
  }

  create(): void {
    this.scene.start('CityMapScene');
  }
}
