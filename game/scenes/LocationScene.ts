import Phaser from 'phaser';

export default abstract class LocationScene extends Phaser.Scene {
  protected constructor(key: string) {
    super({ key });
  }

  create(): void {
    // common location setup
  }
}
