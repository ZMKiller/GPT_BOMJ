import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class DowntownScene extends LocationScene {
  constructor() {
    super('DowntownScene', LocationId.Downtown);
  }

  create(): void {
    super.create();
    this.add.rectangle(0, 0, 800, 600, 0x444444).setOrigin(0);
    this.add.text(400, 300, 'Downtown', { color: '#ffffff' }).setOrigin(0.5);
  }
}
