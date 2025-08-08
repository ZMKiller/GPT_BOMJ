import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class ShelterScene extends LocationScene {
  constructor() {
    super('ShelterScene', LocationId.Shelter);
  }
}
