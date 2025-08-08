import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class ParkScene extends LocationScene {
  constructor() {
    super('ParkScene', LocationId.Park);
  }
}
