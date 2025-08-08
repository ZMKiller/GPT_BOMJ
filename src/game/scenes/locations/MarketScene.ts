import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class MarketScene extends LocationScene {
  constructor() {
    super('MarketScene', LocationId.Market);
  }

  create(): void {
    super.create();
    this.add.rectangle(0, 0, 800, 600, 0x444488).setOrigin(0);
    this.add.text(400, 300, 'Market', { color: '#ffffff' }).setOrigin(0.5);
  }
}
