import Phaser from 'phaser';

export default abstract class LocationScene extends Phaser.Scene {
  protected constructor(key: string) {
    super({ key });
  }

  create(): void {
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
    console.log(`${this.scene.key} setupInteractions`);
  }
}
