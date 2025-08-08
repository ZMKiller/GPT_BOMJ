import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class MarketScene extends LocationScene {
  constructor() {
    super('MarketScene', LocationId.Market);
  }
}
