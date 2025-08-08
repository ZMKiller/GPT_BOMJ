import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class ParkScene extends LocationScene {
  constructor() {
    super('ParkScene', LocationId.Park);
  }

  create(): void {
    super.create();
    this.add.rectangle(0, 0, 800, 600, 0x226622).setOrigin(0);
    this.add.text(400, 300, 'Park', { color: '#ffffff' }).setOrigin(0.5);
  }
}
