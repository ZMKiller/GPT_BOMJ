import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class JobCenterScene extends LocationScene {
  constructor() {
    super('JobCenterScene', LocationId.JobCenter);
  }

  create(): void {
    super.create();
    this.add.rectangle(0, 0, 800, 600, 0x884422).setOrigin(0);
    this.add.text(400, 300, 'Job Center', { color: '#ffffff' }).setOrigin(0.5);
  }
}
