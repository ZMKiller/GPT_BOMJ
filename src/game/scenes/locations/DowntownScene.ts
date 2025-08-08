import LocationScene from '../LocationScene';

export default class DowntownScene extends LocationScene {
  constructor() {
    super('DowntownScene');
  }

  create(): void {
    super.create();
    this.add.rectangle(0, 0, 800, 600, 0x444444).setOrigin(0);
    this.add.text(400, 300, 'Downtown', { color: '#ffffff' }).setOrigin(0.5);
  }
}
