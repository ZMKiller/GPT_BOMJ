import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class ShelterScene extends LocationScene {
  constructor() {
    super('ShelterScene', LocationId.Shelter);
  }

  create(): void {
    super.create();
    this.add.rectangle(0, 0, 800, 600, 0x666666).setOrigin(0);
    this.add.text(400, 300, 'Shelter', { color: '#ffffff' }).setOrigin(0.5);
  }
}
